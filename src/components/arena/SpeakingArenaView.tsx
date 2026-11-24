import React, { useState } from 'react';
import { useArena } from '../../context/ArenaContext';
import { WEEKLY_LEADERBOARD, MONTHLY_LEADERBOARD, ALL_TIME_LEADERBOARD, HEAD_TO_HEAD_BATTLES } from '../../data/seedUsersData';
import { LeaderboardUser, HeadToHeadBattle } from '../../types';
import { soundService } from '../../services/soundService';
import { 
  Trophy, 
  Flame, 
  Swords, 
  Calendar, 
  Award, 
  Sparkles, 
  Crown, 
  Play, 
  CheckCircle, 
  Users, 
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Shield,
  Target
} from 'lucide-react';

export const SpeakingArenaView: React.FC = () => {
  const { user, awardXp, completeDailyChallenge } = useArena();
  const [activeBoard, setActiveBoard] = useState<'weekly' | 'monthly' | 'all-time'>('weekly');
  const [selectedBattle, setSelectedBattle] = useState<HeadToHeadBattle | null>(null);
  const [showHowToPlay, setShowHowToPlay] = useState<boolean>(false);

  // Battle session states
  const [battleRunning, setBattleRunning] = useState<boolean>(false);
  const [battleTimeLeft, setBattleTimeLeft] = useState<number>(60);
  const [battleFinished, setBattleFinished] = useState<boolean>(false);

  const leaderboardData: Record<string, LeaderboardUser[]> = {
    weekly: WEEKLY_LEADERBOARD,
    monthly: MONTHLY_LEADERBOARD,
    'all-time': ALL_TIME_LEADERBOARD
  };

  const currentList = leaderboardData[activeBoard];

  // Head to head timer
  React.useEffect(() => {
    let timer: any = null;
    if (battleRunning && battleTimeLeft > 0) {
      timer = setInterval(() => {
        setBattleTimeLeft(prev => {
          if (prev <= 1) {
            handleFinishBattle();
            return 0;
          }
          if (prev <= 4) soundService.playTick();
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [battleRunning, battleTimeLeft]);

  const handleStartBattle = (battle: HeadToHeadBattle) => {
    setSelectedBattle(battle);
    setBattleTimeLeft(battle.timeLimit);
    setBattleRunning(false);
    setBattleFinished(false);
  };

  const handleFinishBattle = () => {
    setBattleRunning(false);
    setBattleFinished(true);
    soundService.playSuccess();
    awardXp(35, `Menyelesaikan Duel Arena Head-to-Head: "${selectedBattle?.title}"`);
    completeDailyChallenge('dc-1');
  };

  return (
    <div className="space-y-6">
      {/* Tournament Card / Arena Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-600 via-amber-500 to-indigo-700 text-white p-6 sm:p-8 shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="max-w-2xl relative z-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/20 backdrop-blur-md text-xs font-semibold">
            <Trophy className="w-3.5 h-3.5 text-amber-200" />
            <span>Turnamen Mingguan Fluency Sprint 2026</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Speaking Arena & Kompetisi Murid
          </h1>
          <p className="text-amber-100 text-xs sm:text-sm leading-relaxed">
            Adu kemampuan berbicara Anda secara sehat! Taklukkan duel Head-to-Head bertopik sama, kumpulkan poin XP, dan raih posisi terhormat di papan peringkat.
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs font-semibold">
            <div className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-xl">
              <Calendar className="w-4 h-4 text-amber-200" />
              <span>Sisa Waktu: 3 Hari</span>
            </div>
            <div className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-xl">
              <Users className="w-4 h-4 text-amber-200" />
              <span>128 Peserta Terdaftar</span>
            </div>
            <div className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-xl">
              <Crown className="w-4 h-4 text-amber-200" />
              <span>Hadiah: Golden Orator Badge + 500 XP</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowHowToPlay(!showHowToPlay)}
          className="relative z-10 flex items-center gap-2 px-5 py-3 rounded-2xl bg-white text-slate-900 text-xs font-bold shadow-lg hover:bg-amber-50 transition-all flex-shrink-0"
        >
          <HelpCircle className="w-4 h-4 text-indigo-600" />
          <span>Cara Bertanding & Rubrik</span>
          {showHowToPlay ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Expandable How To Play */}
      {showHowToPlay && (
        <div className="bg-gradient-to-br from-amber-50/70 via-white to-slate-50 rounded-3xl border border-amber-200 p-6 shadow-soft space-y-4 animate-slide-up text-xs text-slate-700">
          <h4 className="font-extrabold text-sm text-slate-900">Format & Mekanisme Pertandingan di Speaking Arena:</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-white border border-amber-200 shadow-sm space-y-1">
              <span className="w-6 h-6 rounded-xl bg-amber-500 text-white font-extrabold flex items-center justify-center text-xs">1</span>
              <strong className="block text-slate-900 pt-1">Prompt Topik yang Sama</strong>
              <p className="text-slate-500 leading-relaxed">Kedua pemain menerima tantangan dan batas durasi bicara yang identik untuk memastikan persaingan adil.</p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-amber-200 shadow-sm space-y-1">
              <span className="w-6 h-6 rounded-xl bg-amber-500 text-white font-extrabold flex items-center justify-center text-xs">2</span>
              <strong className="block text-slate-900 pt-1">Rubrik Penilaian 4 Aspek</strong>
              <p className="text-slate-500 leading-relaxed">Evaluasi berbasis: Completion (25%), Kosakata (25%), Kelancaran (25%), dan Pemenuhan Misi (25%).</p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-amber-200 shadow-sm space-y-1">
              <span className="w-6 h-6 rounded-xl bg-amber-500 text-white font-extrabold flex items-center justify-center text-xs">3</span>
              <strong className="block text-slate-900 pt-1">Leaderboard Inklusif</strong>
              <p className="text-slate-500 leading-relaxed">Murid pemula juga diapresiasi melalui kategori <em>Beginner Rising Star</em>, <em>Most Improved</em>, dan <em>Consistency Champion</em>!</p>
            </div>
          </div>
        </div>
      )}

      {/* Head to Head Challenge Section */}
      <section className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-soft space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Swords className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-extrabold text-slate-900">Duel Topik Head-to-Head</h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Tantang teman sekelas atau tandingkan argumen Anda dengan lawan bicara pada topik yang identik!
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {HEAD_TO_HEAD_BATTLES.map((battle) => (
            <div
              key={battle.id}
              className="p-6 rounded-3xl bg-slate-50/80 border border-slate-200 hover:border-indigo-300 hover:bg-white hover:shadow-card transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded bg-indigo-100 text-indigo-700">
                    {battle.category}
                  </span>
                  <span className="text-xs font-mono text-slate-400">{battle.timeLimit} Detik</span>
                </div>

                <h3 className="font-extrabold text-sm text-slate-900">{battle.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed italic bg-white p-3 rounded-2xl border border-slate-100">
                  "{battle.prompt}"
                </p>

                {/* Opponent info */}
                <div className="flex items-center gap-2 text-xs text-slate-600 pt-1">
                  <img
                    src={battle.opponent.avatar}
                    alt={battle.opponent.name}
                    className="w-7 h-7 rounded-full object-cover border border-slate-200"
                  />
                  <span>Lawan Tanding: <strong className="text-slate-800">{battle.opponent.name}</strong></span>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-200/70 flex items-center justify-between">
                <span className="text-[11px] uppercase font-bold text-slate-400">{battle.level}</span>
                <button
                  onClick={() => handleStartBattle(battle)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-all"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Terima Tantangan</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Active Battle Modal */}
      {selectedBattle && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-10 shadow-float border border-slate-200 animate-slide-up space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-extrabold uppercase text-indigo-600">
                Head-to-Head Showdown: {selectedBattle.category}
              </span>
              <button
                onClick={() => setSelectedBattle(null)}
                className="text-slate-400 hover:text-slate-700 text-xs font-bold px-2 py-1"
              >
                Tutup
              </button>
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">{selectedBattle.title}</h3>
              <p className="text-sm font-medium text-slate-800 bg-indigo-50/70 p-4 rounded-2xl border border-indigo-100 leading-relaxed">
                "{selectedBattle.prompt}"
              </p>
            </div>

            {/* Turn Comparison Display */}
            <div className="grid grid-cols-2 gap-4">
              {/* You */}
              <div className="p-5 rounded-2xl bg-indigo-50/70 border-2 border-indigo-500 text-center space-y-1">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-14 h-14 rounded-full mx-auto object-cover border-2 border-indigo-600"
                />
                <h4 className="font-extrabold text-xs text-slate-900 pt-1">{user.name} (Anda)</h4>
                <span className="text-[10px] text-indigo-600 font-bold uppercase block">{user.rank}</span>
                <div className="text-2xl font-mono font-black text-slate-900 pt-1">
                  {Math.floor(battleTimeLeft / 60)}:{(battleTimeLeft % 60).toString().padStart(2, '0')}
                </div>
              </div>

              {/* Opponent */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-1">
                <img
                  src={selectedBattle.opponent.avatar}
                  alt={selectedBattle.opponent.name}
                  className="w-14 h-14 rounded-full mx-auto object-cover border-2 border-slate-300"
                />
                <h4 className="font-extrabold text-xs text-slate-900 pt-1">{selectedBattle.opponent.name}</h4>
                <span className="text-[10px] text-slate-500 font-bold uppercase block">{selectedBattle.opponent.rank}</span>
                <div className="text-xs text-slate-500 mt-2 p-2.5 bg-white rounded-xl border border-slate-100">
                  Rubrik komparatif aktif.
                </div>
              </div>
            </div>

            {/* Controls */}
            {!battleFinished ? (
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => {
                    if (!battleRunning) soundService.playStart();
                    setBattleRunning(!battleRunning);
                  }}
                  className="px-8 py-3 rounded-2xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition-all flex items-center gap-2"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>{battleRunning ? 'Jeda Giliran' : 'Mulai Giliran Bicara Anda'}</span>
                </button>

                {battleRunning && (
                  <button
                    onClick={handleFinishBattle}
                    className="px-5 py-3 rounded-2xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition-all"
                  >
                    Selesaikan Giliran
                  </button>
                )}
              </div>
            ) : (
              <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                    <span className="font-bold text-sm text-emerald-900">Duel Berhasil Diselesaikan!</span>
                  </div>
                  <span className="text-xs font-extrabold text-emerald-700">+35 XP Diperoleh</span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-center text-xs">
                  <div className="p-2.5 bg-white rounded-xl">
                    <span className="text-[10px] text-slate-400 block">Kelengkapan</span>
                    <strong className="text-slate-800">24/25</strong>
                  </div>
                  <div className="p-2.5 bg-white rounded-xl">
                    <span className="text-[10px] text-slate-400 block">Kosakata</span>
                    <strong className="text-slate-800">23/25</strong>
                  </div>
                  <div className="p-2.5 bg-white rounded-xl">
                    <span className="text-[10px] text-slate-400 block">Kelancaran</span>
                    <strong className="text-slate-800">22/25</strong>
                  </div>
                  <div className="p-2.5 bg-white rounded-xl">
                    <span className="text-[10px] text-slate-400 block">Misi</span>
                    <strong className="text-slate-800">24/25</strong>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedBattle(null)}
                  className="w-full py-3 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                >
                  Kembali ke Arena
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Leaderboard */}
      <section className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-soft space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              Papan Peringkat Arena
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Peringkat transparan dan apresiatif untuk konsistensi, volume bicara, dan kemajuan pemula.
            </p>
          </div>

          <div className="flex items-center p-1 bg-slate-100 rounded-2xl border border-slate-200">
            {(['weekly', 'monthly', 'all-time'] as const).map((period) => (
              <button
                key={period}
                onClick={() => {
                  setActiveBoard(period);
                  soundService.playClick();
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                  activeBoard === period
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {period === 'weekly' ? 'Mingguan' : period === 'monthly' ? 'Bulanan' : 'Sepanjang Masa'}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px] tracking-wider font-bold">
                <th className="py-3 px-3">Peringkat</th>
                <th className="py-3 px-3">Murid</th>
                <th className="py-3 px-3">Level & Gelar</th>
                <th className="py-3 px-3">Streak Harian</th>
                <th className="py-3 px-3">Tantangan Selesai</th>
                <th className="py-3 px-3 text-right">Skor Total XP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentList.map((entry, idx) => {
                const rankNumber = idx + 1;

                return (
                  <tr
                    key={entry.id}
                    className={`transition-colors ${
                      entry.isCurrentUser
                        ? 'bg-indigo-50/70 font-semibold'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <td className="py-4 px-3">
                      <div className="flex items-center gap-1.5 font-mono font-bold">
                        {rankNumber === 1 && <span className="w-6 h-6 rounded-full bg-amber-400 text-white flex items-center justify-center font-bold text-xs shadow-sm">1</span>}
                        {rankNumber === 2 && <span className="w-6 h-6 rounded-full bg-slate-300 text-slate-800 flex items-center justify-center font-bold text-xs shadow-sm">2</span>}
                        {rankNumber === 3 && <span className="w-6 h-6 rounded-full bg-amber-700 text-white flex items-center justify-center font-bold text-xs shadow-sm">3</span>}
                        {rankNumber > 3 && <span className="text-slate-500 pl-2">#{rankNumber}</span>}
                      </div>
                    </td>

                    <td className="py-4 px-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={entry.avatar}
                          alt={entry.name}
                          className="w-9 h-9 rounded-full object-cover border border-slate-200"
                        />
                        <div>
                          <div className="font-bold text-slate-900 flex items-center gap-1.5">
                            <span>{entry.name}</span>
                            {entry.isCurrentUser && (
                              <span className="text-[10px] bg-indigo-600 text-white px-1.5 py-0.2 rounded font-extrabold">ANDA</span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-400">@{entry.username}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-3">
                      <div className="flex items-center gap-2">
                        <span className="capitalize px-2.5 py-0.5 rounded-lg text-[11px] font-semibold bg-slate-100 text-slate-700">
                          {entry.level}
                        </span>
                        {entry.categoryPill && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                            {entry.categoryPill}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-4 px-3">
                      <div className="flex items-center gap-1 text-amber-600 font-bold font-mono">
                        <Flame className="w-4 h-4 fill-amber-500" />
                        <span>{entry.streak} Hari</span>
                      </div>
                    </td>

                    <td className="py-4 px-3 text-slate-600 font-mono">
                      {entry.completedChallenges} Tantangan
                    </td>

                    <td className="py-4 px-3 text-right">
                      <span className="font-mono font-black text-indigo-700 text-sm">
                        {entry.xp} XP
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
