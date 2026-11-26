import React, { useState } from 'react';
import { useArena } from '../../context/ArenaContext';
import { storageService } from '../../services/storageService';
import { 
  GraduationCap, 
  Users, 
  Layers, 
  Gauge, 
  Theater, 
  Trophy, 
  Mic2, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  Dices,
  PlusCircle,
  Play,
  Volume2,
  FolderOpen
} from 'lucide-react';
import { soundService } from '../../services/soundService';

export const StudentDashboard: React.FC = () => {
  const { 
    activeTeacher, 
    classrooms, 
    activeClassId, 
    setActiveClassId, 
    setActiveTab,
    level
  } = useArena();
  
  const currentClass = classrooms.find(c => c.id === activeClassId) || classrooms[0];
  const students = currentClass ? storageService.getStudentsByClass(currentClass.id) : [];

  // Random student picker state
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [isPicking, setIsPicking] = useState(false);

  const handlePickRandomStudent = () => {
    if (students.length === 0) return;
    soundService.playClick();
    setIsPicking(true);
    let counter = 0;
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * students.length);
      setSelectedStudent(students[randomIndex].name);
      counter++;
      if (counter > 12) {
        clearInterval(interval);
        setIsPicking(false);
        soundService.playSuccess();
      }
    }, 90);
  };

  const handleAwardStudent = (studentId: string) => {
    soundService.playSuccess();
    storageService.addStudentPoints(studentId, 25);
    // trigger refresh if needed
  };

  const totalStudents = classrooms.reduce((acc, c) => acc + c.studentCount, 0);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* 1. TEACHER HERO BANNER */}
      <div className="relative overflow-hidden rounded-2xl bg-slate-900 text-white p-6 sm:p-8 border border-slate-800 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/90 text-blue-300 text-xs font-semibold tracking-wide border border-blue-800">
            <GraduationCap className="w-3.5 h-3.5 text-sky-400" />
            <span>Fasilitasi Kelas • {currentClass ? currentClass.name : 'Belum Ada Kelas'}</span>
            <span className="ml-1 px-2 py-0.5 rounded bg-blue-600 text-white font-extrabold uppercase text-[10px]">
              Tier {level.toUpperCase()}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Selamat Mengajar, {activeTeacher?.name || 'Teacher 1'}!
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-xl">
            Aplikasi ini dirancang khusus untuk memandu aktivitas speaking di depan kelas. Tampilkan kartu topik, jalankan teleprompter kecepatan baca bersama murid, atau undi giliran bicara secara acak.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                soundService.playClick();
                setActiveTab('reading');
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-sm transition-all"
            >
              <Gauge className="w-4 h-4" />
              <span>Buka Teleprompter Kelas</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => {
                soundService.playClick();
                setActiveTab('cards');
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all"
            >
              <Layers className="w-4 h-4 text-amber-400" />
              <span>Bank Speaking Cards</span>
            </button>

            <button
              onClick={() => {
                soundService.playClick();
                setActiveTab('cards');
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-sm transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>+ Buat Topik Sendiri</span>
            </button>

            {students.length > 0 && (
              <button
                onClick={handlePickRandomStudent}
                disabled={isPicking}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 transition-all"
              >
                <Dices className={`w-4 h-4 ${isPicking ? 'animate-spin' : ''}`} />
                <span>{isPicking ? 'Mengundi...' : '🎲 Undi Siswa Maju'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Current Active Class Overview Card */}
        <div className="relative z-10 w-full lg:w-72 bg-slate-800/80 rounded-2xl border border-slate-700 p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-700 pb-3">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Kelas Aktif</span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-blue-500 text-white">
                  {currentClass?.level?.toUpperCase() || level.toUpperCase()}
                </span>
              </div>
              <h3 className="text-sm font-bold text-white truncate max-w-[160px]">
                {currentClass ? currentClass.name : 'Belum Ada'}
              </h3>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-blue-900/60 text-blue-200 text-xs font-semibold">
              {students.length} Siswa
            </span>
          </div>

          <div className="space-y-1.5 text-xs">
            <label className="text-[11px] text-slate-400 font-medium">Ganti Kelas Berjalan:</label>
            <select
              value={activeClassId}
              onChange={(e) => setActiveClassId(e.target.value)}
              className="w-full text-xs font-semibold text-white bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 cursor-pointer focus:outline-none focus:border-blue-500"
            >
              {classrooms.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.studentCount} murid)
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setActiveTab('progress')}
            className="w-full py-2 rounded-lg text-xs font-semibold bg-slate-700 hover:bg-slate-600 text-slate-200 transition-colors text-center block"
          >
            + Kelola Kelas & Siswa
          </button>
        </div>
      </div>

      {/* 2. RANDOM STUDENT WINNER BANNER (IF PICKED) */}
      {selectedStudent && (
        <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
              🎯
            </div>
            <div>
              <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider block">Giliran Maju Bicara</span>
              <h4 className="text-base font-extrabold text-slate-900">
                {selectedStudent}
              </h4>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                soundService.playClick();
                setActiveTab('cards');
              }}
              className="px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Pilihkan Topik Bicara →
            </button>
            <button
              onClick={() => setSelectedStudent(null)}
              className="px-2.5 py-1.5 text-slate-400 hover:text-slate-600 text-xs"
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      {/* 3. TEACHER STATS OVERVIEW */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-1">
          <div className="flex items-center gap-2 text-blue-600 text-xs font-semibold">
            <FolderOpen className="w-4 h-4" />
            <span>Kelas Anda</span>
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {classrooms.length} Kelas
          </div>
          <p className="text-[11px] text-slate-500">Milik {activeTeacher?.name || 'Anda'}</p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-1">
          <div className="flex items-center gap-2 text-blue-600 text-xs font-semibold">
            <Users className="w-4 h-4" />
            <span>Total Siswa</span>
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {totalStudents} Siswa
          </div>
          <p className="text-[11px] text-slate-500">Terdaftar di semua kelas</p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-1">
          <div className="flex items-center gap-2 text-blue-600 text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4" />
            <span>Siswa Kelas Aktif</span>
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {students.length} Siswa
          </div>
          <p className="text-[11px] text-slate-500">{currentClass?.name || 'Kelas Terpilih'}</p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-1">
          <div className="flex items-center gap-2 text-blue-600 text-xs font-semibold">
            <Sparkles className="w-4 h-4" />
            <span>Mode Latihan</span>
          </div>
          <div className="text-2xl font-bold text-slate-900">
            6 Modul
          </div>
          <p className="text-[11px] text-slate-500">Speaking, Reading, Roleplay, Arena</p>
        </div>
      </div>

      {/* 4. CLASS SELECTION CARDS (BISA MASUK KELAS YG UDAH DIBUAT) */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">Pilih Kelas yang Sedang Diajar</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Klik salah satu kelas di bawah untuk langsung mengaktifkan roster siswa dan leaderboard kelas tersebut.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('progress')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Tambah Kelas Baru</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {classrooms.map((cls) => {
            const isSelected = cls.id === activeClassId;
            return (
              <div
                key={cls.id}
                onClick={() => {
                  soundService.playClick();
                  setActiveClassId(cls.id);
                }}
                className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-blue-50/70 border-blue-500 ring-1 ring-blue-500'
                    : 'bg-slate-50 border-slate-200 hover:bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      isSelected ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {isSelected ? 'Kelas Aktif' : 'Klik Masuk'}
                    </span>
                    <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">
                      {cls.level || 'intermediate'}
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-slate-500">
                    {cls.studentCount} Murid
                  </span>
                </div>
                <h4 className="font-bold text-sm text-slate-900 truncate">{cls.name}</h4>
                <p className="text-[11px] text-slate-500 mt-1">
                  Jenjang: {cls.grade || 'Umum'} • Guru: {activeTeacher?.name}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. CLASSROOM ACTIVITIES TOOLKIT */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-base text-slate-900">Pilih Aktivitas Belajar Hari Ini</h3>
          <span className="text-xs text-slate-500">Tampilkan ke proyektor / layar kelas</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Running Reading */}
          <div
            onClick={() => setActiveTab('reading')}
            className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 hover:shadow-sm transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <Gauge className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-slate-900 group-hover:text-blue-600 transition-colors">
                Teleprompter Reading
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Tampilkan teks bacaan berjalan naik secara kontinu. Guru memegang kendali kecepatan untuk melatih kelancaran membaca bersama.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-600">
              <span>Buka Teleprompter</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Speaking Cards */}
          <div
            onClick={() => setActiveTab('cards')}
            className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-amber-400 hover:shadow-sm transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                <Layers className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-slate-900 group-hover:text-amber-700 transition-colors">
                Bank Speaking Cards
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Pilih topik bicara terarah dengan timer hitung mundur, kosakata bantuan, dan contoh pembuka kalimat untuk siswa.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-amber-700">
              <span>Pilih Kartu Topik</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Roleplay Secret Mission */}
          <div
            onClick={() => setActiveTab('roleplay')}
            className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 hover:shadow-sm transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <Theater className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-slate-900 group-hover:text-blue-600 transition-colors">
                Roleplay Misi Rahasia
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Tugaskan dua siswa maju ke depan. Setiap peran memiliki misi tersembunyi yang harus dicapai dalam dialog bahasa Inggris.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-600">
              <span>Buka Simulasi Roleplay</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Speaking Arena Duel 1v1 */}
          <div
            onClick={() => setActiveTab('arena')}
            className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-slate-400 hover:shadow-sm transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center font-bold">
                <Trophy className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-slate-900 group-hover:text-slate-800 transition-colors">
                Arena Duel 1v1 & Leaderboard
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Adu argumen dua murid pada topik yang sama di depan kelas, berikan poin berdasarkan rubrik 4 kriteria, dan catat skornya.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-700">
              <span>Mulai Duel Siswa</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Studio Games */}
          <div
            onClick={() => setActiveTab('interactive')}
            className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 hover:shadow-sm transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <Mic2 className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-slate-900 group-hover:text-blue-600 transition-colors">
                Studio Games & Pemanasan
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Permainan cepat: Word Chain, Alibi Detective, Tongue Twister, dan Rapid Fire untuk mencairkan suasana sebelum materi utama.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-600">
              <span>Buka Studio Games</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Roster & Penilaian Siswa */}
          <div
            onClick={() => setActiveTab('teacher')}
            className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-slate-400 hover:shadow-sm transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-slate-900 group-hover:text-slate-800 transition-colors">
                Roster Murid & Poin Kelas
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Lihat daftar murid di kelas aktif, catat poin partisipasi, atau ekspor rekap keikutsertaan berbicara siswa.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-700">
              <span>Buka Roster Kelas</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </section>

      {/* 6. ACTIVE CLASS STUDENT ROSTER PREVIEW */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              <span>Siswa di {currentClass ? currentClass.name : 'Kelas Terpilih'} ({students.length} Siswa)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Daftar murid yang siap dipanggil berbicara atau diberi poin partisipasi hari ini.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {students.length > 0 && (
              <button
                onClick={handlePickRandomStudent}
                disabled={isPicking}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition-colors flex items-center gap-1.5"
              >
                <Dices className={`w-3.5 h-3.5 ${isPicking ? 'animate-spin' : ''}`} />
                <span>Undi Maju</span>
              </button>
            )}
            <button
              onClick={() => setActiveTab('progress')}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            >
              + Input Nama Siswa
            </button>
          </div>
        </div>

        {students.length === 0 ? (
          <div className="py-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300 text-slate-500 space-y-2">
            <Users className="w-8 h-8 mx-auto text-slate-400" />
            <p className="text-xs font-bold text-slate-700">Belum ada murid di kelas ini</p>
            <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
              Silakan input nama-nama siswa kelas ini agar Anda dapat mengundi giliran bicara dan mencatat poin partisipasi.
            </p>
            <button
              onClick={() => setActiveTab('progress')}
              className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm"
            >
              + Input Nama Murid Sekarang
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {students.map((student, idx) => (
              <div
                key={student.id}
                className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between hover:bg-slate-100/80 transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs flex-shrink-0">
                    {idx + 1}
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-slate-800 block truncate">
                      {student.name}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      Poin: <strong className="text-blue-600">{student.xp || 0} XP</strong>
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleAwardStudent(student.id)}
                  title="Beri +25 XP Partisipasi Bicara"
                  className="px-2 py-1 bg-white hover:bg-blue-50 border border-slate-200 text-blue-600 text-[10px] font-bold rounded shadow-2xs hover:border-blue-300 transition-colors"
                >
                  +25 XP
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
