import React from 'react';
import { useArena } from '../../context/ArenaContext';
import { getNextRankProgress } from '../../services/gamificationService';
import { ACHIEVEMENTS_LIST } from '../../data/achievementsData';
import { WEEKLY_LEADERBOARD } from '../../data/seedUsersData';
import { 
  Flame, 
  Sparkles, 
  Trophy, 
  BookOpen, 
  Layers, 
  Theater, 
  ShoppingBag, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Award, 
  Compass,
  Gauge
} from 'lucide-react';
import { soundService } from '../../services/soundService';

export const StudentDashboard: React.FC = () => {
  const { user, level, dailyChallenges, completeDailyChallenge, setActiveTab } = useArena();
  const rankProgress = getNextRankProgress(user.xp);

  const unlockedBadges = ACHIEVEMENTS_LIST.filter(a => user.achievements.includes(a.id));

  return (
    <div className="space-y-8">
      {/* 1. Welcome Section & Hero Bar */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 text-white p-6 sm:p-10 shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div className="relative z-10 max-w-xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold tracking-wide">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Selamat datang kembali, {user.name.split(' ')[0]}!</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            Tingkatkan Kelancaran Berbicara Anda Hari Ini
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Kuasai kosakata baru, hadapi duel bicara, dan latih kecepatan membaca dengan teleprompter. Konsistensi harian Anda sedang berjalan {user.streakDays} hari berturut-turut!
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                soundService.playClick();
                setActiveTab('cards');
              }}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20 transition-all"
            >
              <Layers className="w-4 h-4" />
              <span>Buka Speaking Cards</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => {
                soundService.playClick();
                setActiveTab('reading');
              }}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-all backdrop-blur-sm"
            >
              <Gauge className="w-4 h-4 text-amber-400" />
              <span>Teleprompter Reading</span>
            </button>
          </div>
        </div>

        {/* Rank & XP Card in Hero */}
        <div className="relative z-10 w-full md:w-80 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Jenjang Peringkat</span>
              <h3 className="text-xl font-black text-white">{rankProgress.currentRank.name}</h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-900 flex items-center justify-center font-bold shadow-md">
              <Trophy className="w-6 h-6 text-amber-950" />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-300 font-mono">
              <span className="font-bold text-amber-400">{user.xp} XP</span>
              {rankProgress.nextRank ? (
                <span>Target: {rankProgress.nextRank.minXp} XP</span>
              ) : (
                <span>Peringkat Tertinggi</span>
              )}
            </div>
            <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-amber-300 transition-all duration-500 rounded-full"
                style={{ width: `${rankProgress.progressPercent}%` }}
              />
            </div>
            {rankProgress.nextRank && (
              <span className="text-[10px] text-slate-400 block text-right font-medium">
                Kurang {rankProgress.xpNeeded} XP lagi menuju {rankProgress.nextRank.name}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 2. Key Activity Stats Grid with generous breathing room */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-5">
        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-soft space-y-1">
          <div className="flex items-center gap-2 text-amber-600 text-xs font-bold">
            <Flame className="w-4 h-4 fill-amber-500" />
            <span>Streak Harian</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">{user.streakDays} Hari</div>
          <p className="text-[11px] text-slate-400">Pertahankan latihan besok</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-soft space-y-1">
          <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold">
            <Layers className="w-4 h-4" />
            <span>Aktivitas Selesai</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">{user.completedActivities}</div>
          <p className="text-[11px] text-slate-400">Latihan bicara & membaca</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-soft space-y-1">
          <div className="flex items-center gap-2 text-emerald-600 text-xs font-bold">
            <Clock className="w-4 h-4" />
            <span>Waktu Bicara</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">{user.speakingMinutes} Menit</div>
          <p className="text-[11px] text-slate-400">Akumulasi durasi latihan</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-soft space-y-1">
          <div className="flex items-center gap-2 text-purple-600 text-xs font-bold">
            <BookOpen className="w-4 h-4" />
            <span>Total Kata Dibaca</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">{user.wordsRead.toLocaleString()}</div>
          <p className="text-[11px] text-slate-400">Melalui Running Reading</p>
        </div>
      </div>

      {/* 3. Daily Challenges Section */}
      <section className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-soft space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <h2 className="text-lg font-black text-slate-900">Misi Harian Anda</h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Tuntaskan 3 rutinitas latihan harian untuk mendapatkan akumulasi XP ekstra dan membakar streak.
            </p>
          </div>
          <span className="text-xs font-bold text-slate-400 font-mono bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
            {dailyChallenges.filter(c => c.completed).length} / {dailyChallenges.length} Selesai
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {dailyChallenges.map((challenge) => (
            <div
              key={challenge.id}
              className={`p-5 rounded-3xl border transition-all flex flex-col justify-between ${
                challenge.completed
                  ? 'bg-emerald-50/60 border-emerald-200'
                  : 'bg-slate-50/70 border-slate-200/80 hover:border-indigo-200 hover:bg-white'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-lg ${
                    challenge.completed ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {challenge.type}
                  </span>
                  <span className="text-xs font-bold text-amber-600 font-mono">+{challenge.xpReward} XP</span>
                </div>
                <h4 className="font-extrabold text-sm text-slate-900">{challenge.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">{challenge.description}</p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-200/60 flex items-center justify-between">
                {challenge.completed ? (
                  <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Telah Selesai</span>
                  </span>
                ) : (
                  <button
                    onClick={() => {
                      if (challenge.type === 'speaking') setActiveTab('cards');
                      else if (challenge.type === 'reading') setActiveTab('reading');
                      else completeDailyChallenge(challenge.id);
                    }}
                    className="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800"
                  >
                    <span>Mulai Misi Ini</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Quick Access Hub & Leaderboard Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 spans): Primary Feature Cards */}
        <div className="lg:col-span-2 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-lg text-slate-900">Pilihan Latihan Cepat</h3>
            <span className="text-xs text-slate-400 capitalize">Tingkat {level}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Running Reading Card */}
            <div
              onClick={() => setActiveTab('reading')}
              className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-soft hover:shadow-card hover:border-indigo-300 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
                  <Gauge className="w-6 h-6 text-indigo-600" />
                </div>
                <h4 className="font-extrabold text-base text-slate-900 group-hover:text-indigo-600 transition-colors">
                  Running Reading Teleprompter
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Latih kecepatan membaca dengan teks yang bergerak naik secara kontinu. Jangan sampai kalimat tergulung habis sebelum Anda memahaminya!
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-indigo-600">
                <span>Buka Teleprompter</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>

            {/* Speaking Cart / Menu */}
            <div
              onClick={() => setActiveTab('cart')}
              className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-soft hover:shadow-card hover:border-amber-300 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
                  <ShoppingBag className="w-6 h-6 text-amber-600" />
                </div>
                <h4 className="font-extrabold text-base text-slate-900 group-hover:text-amber-600 transition-colors">
                  Speaking Cart & Menu
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Rangkai sesi latihan campuran Anda sendiri: pembuka Appetizer, debat Main Course, dan kelincahan kata Dessert dalam satu rangkaian.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-600">
                <span>Rangkai Menu Latihan</span>
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
                  Simulasikan situasi negosiasi dan komplain nyata dengan kartu misi tersembunyi, frasa wajib, serta pantangan kata terlarang.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-purple-600">
                <span>Masuk ke Simulasi</span>
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
                  Duel Arena & Turnamen
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Adu kecakapan berbicara pada topik yang sama dengan teman sekelas. Pantau peringkat mingguan dan raih piala kejuaraan.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-rose-600">
                <span>Lihat Arena Tanding</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (1 span): Leaderboard & Badges */}
        <div className="space-y-6">
          {/* Leaderboard Preview */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-soft space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-500" />
                <span>Peringkat Minggu Ini</span>
              </h3>
              <button
                onClick={() => setActiveTab('arena')}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
              >
                Selengkapnya
              </button>
            </div>

            <div className="space-y-2.5">
              {WEEKLY_LEADERBOARD.slice(0, 5).map((person, idx) => (
                <div
                  key={person.id}
                  className={`p-3 rounded-2xl flex items-center justify-between transition-colors ${
                    person.isCurrentUser ? 'bg-indigo-50 border border-indigo-200' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-5 text-center font-mono font-bold text-xs ${
                      idx === 0 ? 'text-amber-500' : idx === 1 ? 'text-slate-400' : idx === 2 ? 'text-amber-700' : 'text-slate-400'
                    }`}>
                      #{idx + 1}
                    </span>
                    <img
                      src={person.avatar}
                      alt={person.name}
                      className="w-9 h-9 rounded-full object-cover border border-slate-200"
                    />
                    <div>
                      <div className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                        <span>{person.name.split(' ')[0]}</span>
                        {person.isCurrentUser && (
                          <span className="text-[9px] bg-indigo-600 text-white px-1.5 py-0.2 rounded font-extrabold">ANDA</span>
                        )}
                      </div>
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

          {/* Badges Preview */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-soft space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="font-extrabold text-sm text-slate-900">Lencana Anda ({unlockedBadges.length})</h4>
              <button
                onClick={() => setActiveTab('progress')}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
              >
                Lihat Semua
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {unlockedBadges.map(badge => (
                <div
                  key={badge.id}
                  title={`${badge.title}: ${badge.description}`}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 border border-purple-200 text-xs font-semibold text-purple-700"
                >
                  <Award className="w-3.5 h-3.5 text-purple-600" />
                  <span>{badge.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
