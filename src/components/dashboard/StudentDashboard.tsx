import React from 'react';
import { useArena } from '../../context/ArenaContext';
import { storageService } from '../../services/storageService';
import { WEEKLY_LEADERBOARD } from '../../data/seedUsersData';
import { 
  GraduationCap, 
  Users, 
  Layers, 
  Gauge, 
  Theater, 
  ShoppingBag, 
  Trophy, 
  Mic2, 
  ArrowRight, 
  CheckCircle, 
  Clock, 
  FileText, 
  Monitor, 
  Play, 
  Zap, 
  Award 
} from 'lucide-react';
import { soundService } from '../../services/soundService';

export const StudentDashboard: React.FC = () => {
  const { user, activeClassId, setActiveTab, toggleProjectorMode, isProjectorMode } = useArena();
  
  const classrooms = storageService.getClassrooms();
  const currentClass = classrooms.find(c => c.id === activeClassId) || classrooms[0];
  const submissions = storageService.getSubmissions();
  const pendingSubmissions = submissions.filter(s => s.status === 'pending');

  return (
    <div className="space-y-8">
      {/* 1. TEACHER HERO BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 text-white p-6 sm:p-10 shadow-card flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold tracking-wide border border-indigo-400/20">
            <GraduationCap className="w-4 h-4 text-indigo-400" />
            <span>Pusat Kendali Pengajar • {currentClass.name}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            Selamat Mengajar, {user.name}!
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Fasilitasi kelas interaktif hari ini: tampilkan kartu pemantik di proyektor, jalankan teleprompter kecepatan baca bersama murid, dan pimpin duel bicara langsung.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                soundService.playClick();
                setActiveTab('reading');
              }}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20 transition-all"
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
              className="flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-all backdrop-blur-sm"
            >
              <Layers className="w-4 h-4 text-amber-400" />
              <span>Bank Speaking Cards</span>
            </button>

            <button
              onClick={toggleProjectorMode}
              className={`flex items-center gap-2 px-4 py-3 rounded-2xl text-xs font-bold transition-all border ${
                isProjectorMode
                  ? 'bg-amber-400 text-slate-900 border-amber-400 shadow-md'
                  : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
              }`}
              title="Aktifkan Mode Proyektor Layar Penuh"
            >
              <Monitor className="w-4 h-4" />
              <span>{isProjectorMode ? 'Layar Proyektor Aktif' : 'Mode Proyektor'}</span>
            </button>
          </div>
        </div>

        {/* Class Quick Overview Card */}
        <div className="relative z-10 w-full lg:w-80 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Kelas Aktif</span>
              <h3 className="text-base font-black text-white truncate max-w-[180px]">{currentClass.name}</h3>
            </div>
            <span className="px-2.5 py-1 rounded-xl bg-indigo-500/20 text-indigo-300 text-xs font-mono font-bold">
              {currentClass.code}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
              <span className="text-slate-400 block text-[11px]">Total Murid</span>
              <strong className="text-lg text-white font-mono">{currentClass.studentCount} Siswa</strong>
            </div>
            <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
              <span className="text-slate-400 block text-[11px]">Tugas Masuk</span>
              <strong className={`text-lg font-mono ${pendingSubmissions.length > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                {pendingSubmissions.length} Menunggu
              </strong>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('teacher')}
            className="w-full py-2.5 rounded-xl text-xs font-bold bg-white text-slate-900 hover:bg-slate-100 transition-all text-center block"
          >
            Buka Roster & Periksa Nilai
          </button>
        </div>
      </div>

      {/* 2. TEACHER STATS OVERVIEW */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-5">
        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-soft space-y-1">
          <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold">
            <Users className="w-4 h-4" />
            <span>Total Siswa Terdaftar</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
            {classrooms.reduce((acc, c) => acc + c.studentCount, 0)} Murid
          </div>
          <p className="text-[11px] text-slate-400">Lintas {classrooms.length} kelompok kelas</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-soft space-y-1">
          <div className="flex items-center gap-2 text-amber-600 text-xs font-bold">
            <FileText className="w-4 h-4" />
            <span>Tugas Butuh Nilai</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-600 font-mono">
            {pendingSubmissions.length} Tugas
          </div>
          <p className="text-[11px] text-slate-400">Terkumpul dari rekaman murid</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-soft space-y-1">
          <div className="flex items-center gap-2 text-emerald-600 text-xs font-bold">
            <Clock className="w-4 h-4" />
            <span>Total Jam Mengajar</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
            {user.speakingMinutes} Menit
          </div>
          <p className="text-[11px] text-slate-400">Fasilitasi speaking aktif</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-soft space-y-1">
          <div className="flex items-center gap-2 text-purple-600 text-xs font-bold">
            <Award className="w-4 h-4" />
            <span>Rata-Rata Kelancaran</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
            93.4%
          </div>
          <p className="text-[11px] text-slate-400">Pencapaian rubrik kelas</p>
        </div>
      </div>

      {/* 3. QUICK LESSON PRESETS FOR TODAY'S CLASS */}
      <section className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-soft space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              <h2 className="text-lg font-black text-slate-900">Rencana Latihan Kelas Siap Pakai</h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Pilih paket sesi mengajar instan yang siap Anda tampilkan langsung di layar kelas atau Google Meet/Zoom.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('cart')}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
          >
            Kustomisasi Rangkaian (Cart) →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Preset 1 */}
          <div className="p-5 rounded-3xl bg-slate-50/80 border border-slate-200 hover:border-indigo-300 hover:bg-white transition-all flex flex-col justify-between space-y-3">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-lg bg-amber-100 text-amber-800">
                  Ice Breaking
                </span>
                <span className="text-xs font-mono font-bold text-slate-500">5 Menit</span>
              </div>
              <h4 className="font-extrabold text-sm text-slate-900">Morning Voice Warm-Up</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Pemanasan small talk singkat + tongue twister seru untuk melatih kelenturan artikulasi murid di awal jam pelajaran.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('cart')}
              className="w-full py-2.5 rounded-xl text-xs font-bold bg-white hover:bg-indigo-50 border border-slate-200 text-indigo-700 transition-all flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Play className="w-3.5 h-3.5 fill-indigo-700" />
              <span>Jalankan Sesi Pemanasan</span>
            </button>
          </div>

          {/* Preset 2 */}
          <div className="p-5 rounded-3xl bg-slate-50/80 border border-slate-200 hover:border-indigo-300 hover:bg-white transition-all flex flex-col justify-between space-y-3">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-lg bg-indigo-100 text-indigo-800">
                  Speed Drill
                </span>
                <span className="text-xs font-mono font-bold text-slate-500">10 Menit</span>
              </div>
              <h4 className="font-extrabold text-sm text-slate-900">Teleprompter Reading Sprint</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Tampilkan teks bacaan bergerak ke atas di layar kelas. Minta murid membaca bergantian sesuai kecepatan sebelum teks hilang.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('reading')}
              className="w-full py-2.5 rounded-xl text-xs font-bold bg-white hover:bg-indigo-50 border border-slate-200 text-indigo-700 transition-all flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Gauge className="w-3.5 h-3.5 text-indigo-700" />
              <span>Buka Teleprompter Kelas</span>
            </button>
          </div>

          {/* Preset 3 */}
          <div className="p-5 rounded-3xl bg-slate-50/80 border border-slate-200 hover:border-indigo-300 hover:bg-white transition-all flex flex-col justify-between space-y-3">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-lg bg-purple-100 text-purple-800">
                  Roleplay Misi
                </span>
                <span className="text-xs font-mono font-bold text-slate-500">15 Menit</span>
              </div>
              <h4 className="font-extrabold text-sm text-slate-900">Simulasi Konflik Berpasangan</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Tugaskan Murid A dan B maju ke depan. Buka kartu misi rahasia masing-masing dan saksikan negosiasi bahasa Inggris mereka!
              </p>
            </div>
            <button
              onClick={() => setActiveTab('roleplay')}
              className="w-full py-2.5 rounded-xl text-xs font-bold bg-white hover:bg-indigo-50 border border-slate-200 text-indigo-700 transition-all flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Theater className="w-3.5 h-3.5 text-indigo-700" />
              <span>Buka Simulasi Roleplay</span>
            </button>
          </div>
        </div>
      </section>

      {/* 4. CLASSROOM ACTIVITIES TOOLKIT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 spans): Interactive Activities for Class */}
        <div className="lg:col-span-2 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-lg text-slate-900">Fasilitasi Aktivitas Mengajar</h3>
            <span className="text-xs text-slate-400">Siap Ditampilkan ke Siswa</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Running Reading */}
            <div
              onClick={() => setActiveTab('reading')}
              className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-soft hover:shadow-card hover:border-indigo-300 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
                  <Gauge className="w-6 h-6 text-indigo-600" />
                </div>
                <h4 className="font-extrabold text-base text-slate-900 group-hover:text-indigo-600 transition-colors">
                  Teleprompter Reading
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Proyeksikan teks bergerak naik secara kontinu. Guru memegang kendali kecepatan (0.5x–2.0x) untuk melatih kelancaran membaca serempak murid.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-indigo-600">
                <span>Mulai Sesi Membaca Kelas</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>

            {/* Speaking Cards */}
            <div
              onClick={() => setActiveTab('cards')}
              className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-soft hover:shadow-card hover:border-indigo-300 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
                  <Layers className="w-6 h-6 text-amber-600" />
                </div>
                <h4 className="font-extrabold text-base text-slate-900 group-hover:text-amber-600 transition-colors">
                  Bank Kartu Bicara (Speaking Cards)
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Panggil giliran bicara murid dengan kartu topik acak. Dilengkapi timer hitung mundur, kosakata panduan, dan inspirasi contoh respons.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-600">
                <span>Pilih Kartu Topik</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>

            {/* Roleplay Secret Mission */}
            <div
              onClick={() => setActiveTab('roleplay')}
              className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-soft hover:shadow-card hover:border-purple-300 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
                  <Theater className="w-6 h-6 text-purple-600" />
                </div>
                <h4 className="font-extrabold text-base text-slate-900 group-hover:text-purple-600 transition-colors">
                  Roleplay Misi Rahasia
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Tugaskan dua siswa untuk maju. Berikan misi rahasia masing-masing tanpa saling melihat, lalu nilai kemampuan diplomasi bahasa Inggris mereka.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-purple-600">
                <span>Mulai Simulasi Kelas</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>

            {/* Speaking Arena Showdowns */}
            <div
              onClick={() => setActiveTab('arena')}
              className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-soft hover:shadow-card hover:border-rose-300 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
                  <Trophy className="w-6 h-6 text-rose-600" />
                </div>
                <h4 className="font-extrabold text-base text-slate-900 group-hover:text-rose-600 transition-colors">
                  Duel Head-to-Head & Leaderboard
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Tandingkan dua murid dalam satu topik debat yang sama di depan kelas, gunakan rubrik 4 kriteria penilaian, dan perbarui peringkat kelas.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-rose-600">
                <span>Fasilitasi Duel Kelas</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (1 span): Submissions to Grade & Class Leaderboard */}
        <div className="space-y-6">
          {/* Submissions Pending Grade */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-soft space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-500" />
                <span>Tugas Siswa Masuk</span>
              </h3>
              <button
                onClick={() => setActiveTab('teacher')}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
              >
                Lihat Semua ({submissions.length})
              </button>
            </div>

            <div className="space-y-3">
              {submissions.slice(0, 3).map((sub) => (
                <div
                  key={sub.id}
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <strong className="text-slate-900">{sub.studentName}</strong>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                      sub.status === 'graded' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {sub.status === 'graded' ? `${sub.score}/100` : 'Perlu Nilai'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 truncate">{sub.assignmentTitle}</p>
                </div>
              ))}
            </div>

            <button
              onClick={() => setActiveTab('teacher')}
              className="w-full py-2.5 rounded-xl text-xs font-bold bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 transition-all text-center"
            >
              Buka Meja Penilaian Guru
            </button>
          </div>

          {/* Classroom Leaderboard Preview */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-soft space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-500" />
                <span>Peringkat Teraktif {currentClass.name.split(' ')[0]}</span>
              </h4>
              <button
                onClick={() => setActiveTab('arena')}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
              >
                Arena
              </button>
            </div>

            <div className="space-y-2.5">
              {WEEKLY_LEADERBOARD.slice(0, 4).map((person, idx) => (
                <div
                  key={person.id}
                  className="p-3 rounded-2xl flex items-center justify-between bg-slate-50 border border-slate-100"
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-5 text-center font-mono font-bold text-xs ${
                      idx === 0 ? 'text-amber-500' : idx === 1 ? 'text-slate-400' : 'text-amber-700'
                    }`}>
                      #{idx + 1}
                    </span>
                    <img
                      src={person.avatar}
                      alt={person.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div>
                      <span className="font-bold text-xs text-slate-800 block">{person.name}</span>
                      <span className="text-[10px] text-slate-400">{person.categoryPill}</span>
                    </div>
                  </div>

                  <span className="font-mono font-black text-xs text-indigo-700">
                    {person.xp} XP
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
