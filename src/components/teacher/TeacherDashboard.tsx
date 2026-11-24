import React, { useState } from 'react';
import { useArena } from '../../context/ArenaContext';
import { storageService } from '../../services/storageService';
import { SpeakingCard, ProficiencyLevel, Student } from '../../types';
import { soundService } from '../../services/soundService';
import { 
  GraduationCap, 
  Users, 
  Layers, 
  Plus, 
  Check, 
  Award, 
  Dices, 
  Star,
  Sparkles,
  ClipboardCheck
} from 'lucide-react';

export const TeacherDashboard: React.FC = () => {
  const { 
    addToast, 
    activeClassStudents, 
    activeClassId, 
    classrooms, 
    setActiveClassId,
    setActiveTab: setGlobalTab,
    activeTeacher
  } = useArena();
  
  const [activeTab, setActiveTab] = useState<'roster' | 'rubric' | 'create-card'>('roster');
  
  const currentClass = classrooms.find(c => c.id === activeClassId) || classrooms[0];
  const currentStudents = activeClassStudents;

  // Real-time Class Rubric Evaluation State
  const [selectedStudentForEval, setSelectedStudentForEval] = useState<string>('');
  const [evalTopic, setEvalTopic] = useState<string>('Classroom Speaking Exercise');
  const [fluencyScore, setFluencyScore] = useState<number>(85);
  const [vocabScore, setVocabScore] = useState<number>(80);
  const [grammarScore, setGrammarScore] = useState<number>(85);
  const [pronunScore, setPronunScore] = useState<number>(80);
  const [evalNotes, setEvalNotes] = useState<string>('Artikulasi jelas, pemakaian kosakata transisi cukup baik.');

  // Form: Create Speaking Card
  const [newCardTitle, setNewCardTitle] = useState('');
  const [newCardLevel, setNewCardLevel] = useState<ProficiencyLevel>('intermediate');
  const [newCardQuestion, setNewCardQuestion] = useState('');
  const [newCardVocab, setNewCardVocab] = useState('');
  const [newCardDuration, setNewCardDuration] = useState(90);

  const overallScore = Math.round((fluencyScore + vocabScore + grammarScore + pronunScore) / 4);

  const handleAwardStudent = (studentId: string, points: number) => {
    storageService.addStudentPoints(studentId, points);
    soundService.playSuccess();
    addToast({
      type: 'success',
      title: 'Poin Diberikan',
      message: `Berhasil menambahkan +${points} XP partisipasi ke siswa.`
    });
  };

  const handleSaveLiveEvaluation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentForEval) return;

    storageService.addStudentPoints(selectedStudentForEval, 50);
    soundService.playSuccess();
    addToast({
      type: 'success',
      title: 'Evaluasi Tersimpan',
      message: `Nilai ${overallScore}/100 dan +50 XP telah dicatatkan untuk siswa terpilih.`
    });
    setEvalNotes('');
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
      title: 'Kartu Berhasil Ditambahkan',
      message: `"${newCardTitle}" kini siap digunakan di Bank Speaking Cards.`
    });

    setNewCardTitle('');
    setNewCardQuestion('');
    setNewCardVocab('');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Teacher Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-teal-100 text-teal-800 text-xs font-semibold">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Roster & Penilaian Langsung di Kelas</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Pusat Partisipasi & Nilai Siswa
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm">
            Pantau kehadiran, beri poin partisipasi langsung saat siswa bicara, dan gunakan rubrik evaluasi instan.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-semibold">
          {[
            { id: 'roster', label: `Daftar Murid (${currentStudents.length})`, icon: Users },
            { id: 'rubric', label: 'Rubrik Nilai Langsung', icon: ClipboardCheck },
            { id: 'create-card', label: '+ Buat Kartu Topik', icon: Layers }
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
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  isActive
                    ? 'bg-teal-700 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
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
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-base text-slate-900">
                Siswa Kelas: {currentClass ? currentClass.name : 'Kelas Terpilih'}
              </h3>
              <p className="text-xs text-slate-500">
                Berikan poin partisipasi (+10 XP atau +25 XP) saat siswa aktif berbicara di depan kelas.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setGlobalTab('progress')}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-teal-700 hover:bg-teal-800 text-white transition-colors flex items-center gap-1.5 shadow-2xs"
              >
                <Users className="w-3.5 h-3.5" />
                <span>+ Input / Edit Siswa</span>
              </button>
            </div>
          </div>

          {currentStudents.length === 0 ? (
            <div className="p-10 text-center text-slate-400 space-y-2 bg-slate-50 rounded-xl border border-dashed border-slate-300">
              <Users className="w-8 h-8 mx-auto text-slate-300" />
              <p className="text-xs font-bold text-slate-700">Belum ada murid di kelas ini</p>
              <p className="text-[11px] max-w-md mx-auto text-slate-500">
                Silakan masukkan nama siswa melalui menu Profil Guru & Kelas untuk memulai pencatatan poin keaktifan.
              </p>
              <button
                onClick={() => setGlobalTab('progress')}
                className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-teal-700 hover:bg-teal-800 text-white shadow-2xs transition-colors"
              >
                <Users className="w-3.5 h-3.5" />
                <span>Buka Menu Input Siswa</span>
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 uppercase text-[10px] tracking-wider font-bold">
                    <th className="py-2.5 px-3">No</th>
                    <th className="py-2.5 px-3">Nama Murid</th>
                    <th className="py-2.5 px-3">Tingkat</th>
                    <th className="py-2.5 px-3">Total XP</th>
                    <th className="py-2.5 px-3">Beri Poin Keaktifan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {currentStudents.map((st, idx) => (
                    <tr key={st.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-3 font-semibold text-slate-400">{idx + 1}</td>
                      <td className="py-3 px-3">
                        <span className="font-bold text-slate-900 block">{st.name}</span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="capitalize px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                          {st.level || 'intermediate'}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-teal-700">{st.xp || 0} XP</td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleAwardStudent(st.id, 10)}
                            className="px-2 py-1 bg-white hover:bg-teal-50 border border-slate-200 text-teal-800 text-[11px] font-bold rounded shadow-2xs transition-colors"
                          >
                            +10 XP
                          </button>
                          <button
                            onClick={() => handleAwardStudent(st.id, 25)}
                            className="px-2 py-1 bg-teal-700 hover:bg-teal-800 text-white text-[11px] font-bold rounded shadow-2xs transition-colors"
                          >
                            +25 XP
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* 2. LIVE RUBRIC EVALUATION TAB */}
      {activeTab === 'rubric' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <ClipboardCheck className="w-4 h-4 text-teal-700" />
              <span>Rubrik Evaluasi Bicara Langsung (Real-Time In-Class)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Gunakan rubrik ini untuk menilai siswa yang sedang praktik berbicara di depan kelas secara langsung.
            </p>
          </div>

          <form onSubmit={handleSaveLiveEvaluation} className="space-y-4 max-w-2xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Pilih Siswa yang Sedang Tampil *</label>
                <select
                  value={selectedStudentForEval}
                  onChange={(e) => setSelectedStudentForEval(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-800 bg-white focus:outline-none focus:border-teal-600"
                >
                  <option value="">-- Pilih Siswa --</option>
                  {currentStudents.map(st => (
                    <option key={st.id} value={st.id}>{st.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Topik / Aktivitas</label>
                <input
                  type="text"
                  value={evalTopic}
                  onChange={(e) => setEvalTopic(e.target.value)}
                  placeholder="Contoh: Opinion Card / Running Reading"
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-xs text-slate-800 focus:outline-none focus:border-teal-600"
                />
              </div>
            </div>

            {/* Rubrik 4 Aspek */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <div className="space-y-1">
                <div className="flex justify-between font-semibold">
                  <span>1. Fluency (Kelancaran & Ritme)</span>
                  <strong className="text-teal-700">{fluencyScore}</strong>
                </div>
                <input
                  type="range"
                  min="50"
                  max="100"
                  value={fluencyScore}
                  onChange={(e) => setFluencyScore(Number(e.target.value))}
                  className="w-full accent-teal-700"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between font-semibold">
                  <span>2. Vocabulary (Pilihan Kata)</span>
                  <strong className="text-teal-700">{vocabScore}</strong>
                </div>
                <input
                  type="range"
                  min="50"
                  max="100"
                  value={vocabScore}
                  onChange={(e) => setVocabScore(Number(e.target.value))}
                  className="w-full accent-teal-700"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between font-semibold">
                  <span>3. Grammar & Akurasi</span>
                  <strong className="text-teal-700">{grammarScore}</strong>
                </div>
                <input
                  type="range"
                  min="50"
                  max="100"
                  value={grammarScore}
                  onChange={(e) => setGrammarScore(Number(e.target.value))}
                  className="w-full accent-teal-700"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between font-semibold">
                  <span>4. Pronunciation & Artikulasi</span>
                  <strong className="text-teal-700">{pronunScore}</strong>
                </div>
                <input
                  type="range"
                  min="50"
                  max="100"
                  value={pronunScore}
                  onChange={(e) => setPronunScore(Number(e.target.value))}
                  className="w-full accent-teal-700"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Catatan Masukan untuk Siswa</label>
              <textarea
                rows={2}
                value={evalNotes}
                onChange={(e) => setEvalNotes(e.target.value)}
                placeholder="Berikan masukan singkat yang konstruktif..."
                className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-xs text-slate-800 focus:outline-none focus:border-teal-600"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="text-xs font-bold text-slate-800">
                Skor Akhir: <span className="text-base text-teal-700 font-mono">{overallScore}/100</span>
              </div>
              <button
                type="submit"
                disabled={!selectedStudentForEval}
                className="px-4 py-2 bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white rounded-lg text-xs font-semibold shadow-2xs transition-colors flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Simpan Evaluasi & Tambah +50 XP</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 3. CREATE SPEAKING CARD TAB */}
      {activeTab === 'create-card' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 max-w-2xl">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-teal-700" />
              <span>Buat Kartu Bicara Kustom</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Tambahkan kartu pemantik bicara baru yang sesuai dengan tema materi pertemuan hari ini.
            </p>
          </div>

          <form onSubmit={handleCreateSpeakingCard} className="space-y-3.5">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Judul Kartu / Topik *</label>
              <input
                type="text"
                value={newCardTitle}
                onChange={(e) => setNewCardTitle(e.target.value)}
                placeholder="Contoh: Digital Nomads vs Traditional Jobs"
                required
                className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-xs text-slate-800 focus:outline-none focus:border-teal-600"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Tingkat Kesulitan</label>
                <select
                  value={newCardLevel}
                  onChange={(e) => setNewCardLevel(e.target.value as ProficiencyLevel)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-800 bg-white focus:outline-none focus:border-teal-600"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Durasi Bicara (Detik)</label>
                <select
                  value={newCardDuration}
                  onChange={(e) => setNewCardDuration(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-800 bg-white focus:outline-none focus:border-teal-600"
                >
                  <option value={30}>30 Detik</option>
                  <option value={60}>60 Detik (1 Menit)</option>
                  <option value={90}>90 Detik (1.5 Menit)</option>
                  <option value={120}>120 Detik (2 Menit)</option>
                  <option value={180}>180 Detik (3 Menit)</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Pertanyaan / Instruksi Bicara *</label>
              <textarea
                rows={3}
                value={newCardQuestion}
                onChange={(e) => setNewCardQuestion(e.target.value)}
                placeholder="What are the pros and cons of working remotely compared to going to an office every day?"
                required
                className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-xs text-slate-800 focus:outline-none focus:border-teal-600"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Saran Kosakata (Pisahkan dengan koma)</label>
              <input
                type="text"
                value={newCardVocab}
                onChange={(e) => setNewCardVocab(e.target.value)}
                placeholder="Flexibility, Isolation, Productivity, Collaboration"
                className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-xs text-slate-800 focus:outline-none focus:border-teal-600"
              />
            </div>

            <button
              type="submit"
              className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-semibold shadow-2xs transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Simpan & Publikasikan Kartu</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
