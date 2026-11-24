import React, { useState } from 'react';
import { useArena } from '../../context/ArenaContext';
import { storageService } from '../../services/storageService';
import { StudentSubmission, Classroom, SpeakingCard, ProficiencyLevel, Student } from '../../types';
import { soundService } from '../../services/soundService';
import { 
  GraduationCap, 
  Users, 
  FileText, 
  Layers, 
  HelpCircle
} from 'lucide-react';

export const TeacherDashboard: React.FC = () => {
  const { addToast, activeClassStudents, activeClassId, setActiveTab: setGlobalTab } = useArena();
  const [activeTab, setActiveTab] = useState<'roster' | 'grading' | 'create-card' | 'classes'>('roster');
  
  const [submissions, setSubmissions] = useState<StudentSubmission[]>(storageService.getSubmissions());
  const [classrooms, setClassrooms] = useState<Classroom[]>(storageService.getClassrooms());
  const currentStudents = activeClassStudents;
  
  // Grading Modal / State
  const [gradingSub, setGradingSub] = useState<StudentSubmission | null>(null);
  const [gradeScore, setGradeScore] = useState<number>(90);
  const [gradeFeedback, setGradeFeedback] = useState<string>('Struktur argumen tersusun rapi dengan pemilihan kosakata transisi yang meyakinkan.');

  // Form: Create Speaking Card
  const [newCardTitle, setNewCardTitle] = useState('');
  const [newCardLevel, setNewCardLevel] = useState<ProficiencyLevel>('intermediate');
  const [newCardQuestion, setNewCardQuestion] = useState('');
  const [newCardVocab, setNewCardVocab] = useState('');
  const [newCardDuration, setNewCardDuration] = useState(90);

  // Form: Create Classroom
  const [newClassName, setNewClassName] = useState('');
  const [newClassDesc, setNewClassDesc] = useState('');

  const handleSaveGrade = () => {
    if (!gradingSub) return;
    storageService.gradeSubmission(gradingSub.id, gradeScore, gradeFeedback);
    setSubmissions(storageService.getSubmissions());
    soundService.playSuccess();
    addToast({
      type: 'success',
      title: 'Penilaian Terkirim',
      message: `Skor ${gradeScore}/100 dan catatan evaluasi telah dikirim ke ${gradingSub.studentName}.`
    });
    setGradingSub(null);
  };

  const handleCreateSpeakingCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCardTitle || !newCardQuestion) return;

    const vocabArray = newCardVocab.split(',').map(v => v.trim()).filter(Boolean);
    const card: SpeakingCard = {
      id: `custom-card-${Date.now()}`,
      title: newCardTitle,
      level: newCardLevel,
      category: 'opinion',
      question: newCardQuestion,
      estimatedDuration: newCardDuration,
      vocabularySuggestions: vocabArray.length > 0 ? vocabArray : ['Articulate', 'Perspective', 'Conclusion'],
      sentenceStarters: ['In my point of view...', 'Furthermore...', 'To summarize...'],
      hints: ['Maintain eye contact and clear pacing']
    };

    storageService.addSpeakingCard(card);
    soundService.playSuccess();
    addToast({
      type: 'success',
      title: 'Kartu Berhasil Dipublikasikan',
      message: `"${newCardTitle}" kini dapat dimainkan oleh siswa di Speaking Cards!`
    });

    setNewCardTitle('');
    setNewCardQuestion('');
    setNewCardVocab('');
  };

  const handleCreateClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName) return;

    const code = `${newClassName.slice(0, 4).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newCls: Classroom = {
      id: `cls-${Date.now()}`,
      name: newClassName,
      code,
      teacherId: 'usr-teacher-01',
      studentCount: 1,
      description: newClassDesc || 'Kelompok kelas aktif latihan bicara bahasa Inggris.'
    };

    storageService.addClassroom(newCls);
    setClassrooms(storageService.getClassrooms());
    soundService.playSuccess();
    addToast({
      type: 'success',
      title: 'Kelas Berhasil Dibuat',
      message: `Kelas "${newClassName}" siap dengan kode undangan: ${code}`
    });

    setNewClassName('');
    setNewClassDesc('');
  };

  return (
    <div className="space-y-6">
      {/* Teacher Banner */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="max-w-xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Teacher & Admin Management</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Dasbor Pengajar & Manajemen Kelas
          </h1>
          <p className="text-slate-600 text-sm leading-relaxed">
            Pantau kemajuan speaking murid, periksa dan beri penilaian manual pada tugas yang terkumpul, serta publikasikan kartu latihan baru.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200">
          {[
            { id: 'roster', label: 'Daftar Murid', icon: Users },
            { id: 'grading', label: `Penilaian Tugas (${submissions.filter(s => s.status === 'pending').length})`, icon: FileText },
            { id: 'create-card', label: '+ Buat Kartu', icon: Layers },
            { id: 'classes', label: 'Kelompok Kelas', icon: GraduationCap }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as typeof activeTab);
                  soundService.playClick();
                }}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 1. STUDENT ROSTER TAB */}
      {activeTab === 'roster' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-soft space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-extrabold text-base text-slate-900">Kemajuan Murid Terdaftar</h3>
              <p className="text-xs text-slate-500">Metrik aktifitas belajar untuk kelas aktif</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-400 font-bold">{currentStudents.length} Murid</span>
              <button
                onClick={() => setGlobalTab('progress')}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition-all shadow-sm flex items-center gap-1.5"
              >
                <Users className="w-3.5 h-3.5" />
                <span>Input / Kelola Siswa</span>
              </button>
            </div>
          </div>

          {currentStudents.length === 0 ? (
            <div className="p-12 text-center text-slate-400 space-y-3 bg-slate-50/50 rounded-2xl border border-slate-100">
              <Users className="w-10 h-10 mx-auto text-slate-300" />
              <p className="text-sm font-bold text-slate-700">Belum ada murid di kelas ini.</p>
              <p className="text-xs max-w-md mx-auto text-slate-500">
                Silakan masukkan nama siswa melalui menu Profil Guru & Kelas untuk memulai penilaian dan melihat statistik performa.
              </p>
              <button
                onClick={() => setGlobalTab('progress')}
                className="mt-2 inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-all"
              >
                <Users className="w-4 h-4" />
                <span>Buka Menu Input Siswa</span>
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px] tracking-wider font-bold">
                    <th className="py-3 px-3">Nama Murid</th>
                    <th className="py-3 px-3">Tingkat Kemampuan</th>
                    <th className="py-3 px-3">Total XP</th>
                    <th className="py-3 px-3">Streak Harian</th>
                    <th className="py-3 px-3">Tantangan Tuntas</th>
                    <th className="py-3 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {currentStudents.map((st) => (
                    <tr key={st.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-3">
                        <div className="flex items-center gap-3">
                          <img 
                            src={st.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(st.name)}`} 
                            alt={st.name} 
                            className="w-9 h-9 rounded-full object-cover border border-slate-200" 
                          />
                          <div>
                            <span className="font-bold text-slate-900 block">{st.name}</span>
                            <span className="text-[10px] text-slate-400">@{st.username || 'murid'}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-3">
                        <span className="capitalize px-2.5 py-0.5 rounded-lg text-[11px] font-semibold bg-indigo-50 text-indigo-700">
                          {st.level}
                        </span>
                      </td>
                      <td className="py-4 px-3 font-mono font-bold text-indigo-600">{st.xp || 0} XP</td>
                      <td className="py-4 px-3 font-mono font-bold text-amber-600">{st.streak || 1} Hari</td>
                      <td className="py-4 px-3 text-slate-600">{st.completedChallenges || 0} Selesai</td>
                      <td className="py-4 px-3">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
                          Aktif
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* 2. SUBMISSION REVIEW & GRADING TAB */}
      {activeTab === 'grading' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-soft space-y-5">
            <div>
              <h3 className="font-extrabold text-base text-slate-900">Ulasan & Penilaian Tugas Murid</h3>
              <p className="text-xs text-slate-500">
                Periksa rekaman atau transkrip tugas berbicara yang dikirimkan murid, berikan masukan, dan tentukan nilai akhir.
              </p>
            </div>

            <div className="space-y-3.5">
              {submissions.map((sub) => (
                <div
                  key={sub.id}
                  className="p-5 rounded-3xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 max-w-xl">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-slate-900">{sub.studentName}</span>
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-700">
                        {sub.activityType}
                      </span>
                      <span className="text-xs text-slate-400">• {sub.submittedAt}</span>
                    </div>

                    <h4 className="font-semibold text-xs text-slate-700">{sub.assignmentTitle}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed italic bg-white p-3 rounded-2xl border border-slate-100">
                      "{sub.transcriptOrNotes}"
                    </p>

                    {sub.feedback && (
                      <div className="mt-2 text-xs text-purple-800 bg-purple-50 p-2.5 rounded-xl border border-purple-100">
                        <strong>Catatan Guru:</strong> {sub.feedback}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                    {sub.status === 'graded' ? (
                      <div className="text-right">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Nilai</span>
                        <span className="text-lg font-black text-emerald-600 font-mono">{sub.score}/100</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setGradingSub(sub);
                          setGradeScore(90);
                        }}
                        className="px-5 py-2.5 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white shadow-md transition-all"
                      >
                        Beri Nilai & Catatan
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Modal Penilaian */}
          {gradingSub && (
            <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-float border border-slate-200 animate-slide-up space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="font-extrabold text-base text-slate-900">
                    Nilai Tugas: {gradingSub.studentName}
                  </h3>
                  <button
                    onClick={() => setGradingSub(null)}
                    className="text-xs font-bold text-slate-400 hover:text-slate-700"
                  >
                    Batal
                  </button>
                </div>

                <div className="text-xs text-slate-600 bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-1">
                  <strong>Tugas:</strong> {gradingSub.assignmentTitle}
                  <p className="italic">"{gradingSub.transcriptOrNotes}"</p>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
                    <span>Skor Penilaian:</span>
                    <span className="text-purple-700 font-mono text-base font-black">{gradeScore} / 100</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="100"
                    value={gradeScore}
                    onChange={(e) => setGradeScore(Number(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Catatan Evaluasi Guru:</label>
                  <textarea
                    rows={3}
                    value={gradeFeedback}
                    onChange={(e) => setGradeFeedback(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    onClick={() => setGradingSub(null)}
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                  >
                    Tutup
                  </button>
                  <button
                    onClick={handleSaveGrade}
                    className="px-6 py-2.5 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white shadow-md"
                  >
                    Simpan & Kirim Nilai
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. CREATE SPEAKING CARD TAB */}
      {activeTab === 'create-card' && (
        <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-card space-y-6">
          <div className="space-y-1">
            <h3 className="font-black text-xl text-slate-900">Publikasikan Kartu Tantangan Baru</h3>
            <p className="text-xs text-slate-500">
              Kartu yang Anda terbitkan akan langsung muncul di deck Speaking Cards murid.
            </p>
          </div>

          <form onSubmit={handleCreateSpeakingCard} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Judul Topik Bicara</label>
              <input
                type="text"
                placeholder="Contoh: Is Space Exploration Worth the High Cost?"
                value={newCardTitle}
                onChange={(e) => setNewCardTitle(e.target.value)}
                required
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tingkat Kemampuan</label>
                <select
                  value={newCardLevel}
                  onChange={(e) => setNewCardLevel(e.target.value as ProficiencyLevel)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl font-medium"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Target Durasi Bicara</label>
                <select
                  value={newCardDuration}
                  onChange={(e) => setNewCardDuration(Number(e.target.value))}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl font-medium"
                >
                  <option value={30}>30 Detik</option>
                  <option value={60}>60 Detik (1 Menit)</option>
                  <option value={90}>90 Detik (1.5 Menit)</option>
                  <option value={120}>120 Detik (2 Menit)</option>
                  <option value={180}>180 Detik (3 Menit)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Pertanyaan / Instruksi Topik</label>
              <textarea
                rows={3}
                placeholder="Tuliskan pertanyaan pemantik yang merangsang argumentasi murid..."
                value={newCardQuestion}
                onChange={(e) => setNewCardQuestion(e.target.value)}
                required
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl font-medium leading-relaxed"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Kosakata Rekomendasi (Pisahkan dengan koma)</label>
              <input
                type="text"
                placeholder="Contoh: Astronomical cost, Innovation, Priority, Funding"
                value={newCardVocab}
                onChange={(e) => setNewCardVocab(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl font-medium"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-7 py-3 rounded-2xl font-bold bg-purple-600 hover:bg-purple-700 text-white shadow-md transition-all"
              >
                Terbitkan Kartu Sekarang
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 4. CLASSROOM MANAGEMENT TAB */}
      {activeTab === 'classes' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {classrooms.map((cls) => (
              <div key={cls.id} className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-soft space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-base text-slate-900">{cls.name}</h4>
                  <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-xl bg-purple-50 text-purple-700 border border-purple-200">
                    Kode: {cls.code}
                  </span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">{cls.description}</p>
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                  <span>{cls.studentCount} Murid Terdaftar</span>
                  <button className="text-purple-600 font-bold hover:underline">
                    Buka Papan Peringkat Kelas
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Form Buat Kelas */}
          <div className="max-w-xl bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-soft space-y-4">
            <h4 className="font-extrabold text-sm text-slate-900">Buka Kelompok Kelas Baru</h4>
            <form onSubmit={handleCreateClass} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Kelompok Kelas</label>
                <input
                  type="text"
                  placeholder="Contoh: Debate Champion Syndicate"
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                  required
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Deskripsi / Fokus Pembelajaran</label>
                <input
                  type="text"
                  placeholder="Contoh: Fokus pada latihan debat mingguan dan roleplay bisnis"
                  value={newClassDesc}
                  onChange={(e) => setNewClassDesc(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-2xl text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white shadow-sm"
              >
                Buat Kelas Baru
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
