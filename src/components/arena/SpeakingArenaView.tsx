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
  ArrowRight, 
  Clock 
} from 'lucide-react';

export const SpeakingArenaView: React.FC = () => {
  const { user, awardXp, completeDailyChallenge } = useArena();
  const [activeBoard, setActiveBoard] = useState<'weekly' | 'monthly' | 'all-time'>('weekly');
  const [selectedBattle, setSelectedBattle] = useState<HeadToHeadBattle | null>(null);

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
    let timer: NodeJS.Timeout | null = null;
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
    awardXp(35, `Completed Head-to-Head Arena Battle: "${selectedBattle?.title}"`);
    completeDailyChallenge('dc-1');
  };

  return (
    <div className="space-y-6">
      {/* Tournament Card / Arena Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-600 via-amber-500 to-indigo-700 text-white p-6 sm:p-8 shadow-card">
        <div className="max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/20 backdrop-blur-md text-xs font-semibold mb-3">
            <Trophy className="w-3.5 h-3.5 text-amber-200" />
            <span>Spring Fluency Tournament 2026</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Speaking Arena & Competitions
          </h1>
          <p className="text-amber-100 text-sm mt-2 leading-relaxed">
            Test your vocal confidence against peers! Climb the weekly leaderboard, join head-to-head topical showdowns, and earn recognition across multiple achievement categories.
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-semibold">
            <div className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-xl">
              <Calendar className="w-4 h-4 text-amber-200" />
              <span>Ends in 3 days (Sunday 23:59)</span>
            </div>
            <div className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-xl">
              <Users className="w-4 h-4 text-amber-200" />
              <span>128 Participants</span>
            </div>
            <div className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-xl">
              <Crown className="w-4 h-4 text-amber-200" />
              <span>Top Prize: Golden Orator Badge + 500 XP</span>
            </div>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Head to Head Challenge Section */}
      <section className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-soft space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Swords className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-extrabold text-slate-900">Head-to-Head topical Showdowns</h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Both speakers receive the identical topic prompt and speaking duration. Compare fluency and task fulfillment!
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {HEAD_TO_HEAD_BATTLES.map((battle) => (
            <div
              key={battle.id}
              className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-indigo-300 hover:bg-white hover:shadow-card transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-100 text-indigo-700">
                    {battle.category}
                  </span>
                  <span className="text-xs font-mono text-slate-400">{battle.timeLimit}s</span>
                </div>

                <h3 className="font-extrabold text-sm text-slate-900">{battle.title}</h3>
                <p className="text-xs text-slate-600 mt-2 line-clamp-2 italic bg-white p-2.5 rounded-xl border border-slate-100">
                  "{battle.prompt}"
                </p>

                {/* Opponent info */}
                <div className="mt-3 flex items-center gap-2 text-xs text-slate-600">
                  <img
                    src={battle.opponent.avatar}
                    alt={battle.opponent.name}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <span>Match against: <strong className="text-slate-800">{battle.opponent.name}</strong></span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between">
                <span className="text-[11px] uppercase font-bold text-slate-400">{battle.level}</span>
                <button
                  onClick={() => handleStartBattle(battle)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-all"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Accept Battle</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Active Battle Modal */}
      {selectedBattle && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-float border border-slate-200 animate-slide-up space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-bold uppercase text-indigo-600">
                Head-to-Head Arena: {selectedBattle.category}
              </span>
              <button
                onClick={() => setSelectedBattle(null)}
                className="text-slate-400 hover:text-slate-700 text-xs font-semibold px-2 py-1 rounded"
              >
                Close
              </button>
            </div>

            <div className="text-center">
              <h3 className="text-xl font-extrabold text-slate-900">{selectedBattle.title}</h3>
              <p className="text-sm font-medium text-slate-700 mt-2 bg-indigo-50 p-4 rounded-2xl border border-indigo-100">
                "{selectedBattle.prompt}"
              </p>
            </div>

            {/* Turn Comparison Display */}
            <div className="grid grid-cols-2 gap-4">
              {/* You */}
              <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 text-center">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-12 h-12 rounded-full mx-auto object-cover border-2 border-indigo-600"
                />
                <h4 className="font-extrabold text-xs text-slate-900 mt-2">{user.name} (You)</h4>
                <span className="text-[10px] text-indigo-600 font-bold uppercase block">{user.rank}</span>
                <div className="text-2xl font-mono font-extrabold text-slate-900 mt-2">
                  {Math.floor(battleTimeLeft / 60)}:{(battleTimeLeft % 60).toString().padStart(2, '0')}
                </div>
              </div>

              {/* Opponent */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                <img
                  src={selectedBattle.opponent.avatar}
                  alt={selectedBattle.opponent.name}
                  className="w-12 h-12 rounded-full mx-auto object-cover border-2 border-slate-300"
                />
                <h4 className="font-extrabold text-xs text-slate-900 mt-2">{selectedBattle.opponent.name}</h4>
                <span className="text-[10px] text-slate-500 font-bold uppercase block">{selectedBattle.opponent.rank}</span>
                <div className="text-xs text-slate-500 mt-3 p-2 bg-white rounded-lg border border-slate-100">
                  Ready with comparative review rubric.
                </div>
              </div>
            </div>

            {/* Battle controls */}
            {!battleFinished ? (
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => {
                    if (!battleRunning) soundService.playStart();
                    setBattleRunning(!battleRunning);
                  }}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition-all flex items-center gap-2"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>{battleRunning ? 'Pause Turn' : 'Start Your Speaking Turn'}</span>
                </button>

                {battleRunning && (
                  <button
                    onClick={handleFinishBattle}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition-all"
                  >
                    Finish Turn
                  </button>
                )}
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                    <span className="font-bold text-sm text-emerald-900">Battle Complete!</span>
                  </div>
                  <span className="text-xs font-extrabold text-emerald-700">+35 XP Earned</span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-center text-xs">
                  <div className="p-2 bg-white rounded-lg">
                    <span className="text-[10px] text-slate-400 block">Completion</span>
                    <strong className="text-slate-800">24/25</strong>
                  </div>
                  <div className="p-2 bg-white rounded-lg">
                    <span className="text-[10px] text-slate-400 block">Vocabulary</span>
                    <strong className="text-slate-800">23/25</strong>
                  </div>
                  <div className="p-2 bg-white rounded-lg">
                    <span className="text-[10px] text-slate-400 block">Fluency</span>
                    <strong className="text-slate-800">22/25</strong>
                  </div>
                  <div className="p-2 bg-white rounded-lg">
                    <span className="text-[10px] text-slate-400 block">Fulfillment</span>
                    <strong className="text-slate-800">24/25</strong>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedBattle(null)}
                  className="w-full py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                >
                  Return to Arena
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Leaderboard */}
      <section className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-soft space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              Arena Leaderboard
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Inclusive rankings celebrating speaking volume, consistency streaks, and beginner improvement.
            </p>
          </div>

          {/* Timeframe Switcher: Weekly, Monthly, All-Time */}
          <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200">
            {(['weekly', 'monthly', 'all-time'] as const).map((period) => (
              <button
                key={period}
                onClick={() => {
                  setActiveBoard(period);
                  soundService.playClick();
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                  activeBoard === period
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {period.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Leaderboard Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px] tracking-wider font-bold">
                <th className="py-3 px-3">Rank</th>
                <th className="py-3 px-3">Student</th>
                <th className="py-3 px-3">Level & Badge</th>
                <th className="py-3 px-3">Streak</th>
                <th className="py-3 px-3">Completed</th>
                <th className="py-3 px-3 text-right">XP Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentList.map((entry, idx) => {
                const rankNumber = idx + 1;
                const isTop3 = rankNumber <= 3;

                return (
                  <tr
                    key={entry.id}
                    className={`transition-colors ${
                      entry.isCurrentUser
                        ? 'bg-indigo-50/70 font-semibold'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    {/* Rank Number / Medal */}
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-1.5 font-mono font-bold">
                        {rankNumber === 1 && <span className="w-6 h-6 rounded-full bg-amber-400 text-white flex items-center justify-center font-bold text-xs shadow-sm">1</span>}
                        {rankNumber === 2 && <span className="w-6 h-6 rounded-full bg-slate-300 text-slate-800 flex items-center justify-center font-bold text-xs shadow-sm">2</span>}
                        {rankNumber === 3 && <span className="w-6 h-6 rounded-full bg-amber-700 text-white flex items-center justify-center font-bold text-xs shadow-sm">3</span>}
                        {rankNumber > 3 && <span className="text-slate-500 pl-2">#{rankNumber}</span>}
                      </div>
                    </td>

                    {/* Student Info */}
                    <td className="py-3.5 px-3">
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
                              <span className="text-[10px] bg-indigo-600 text-white px-1.5 py-0.2 rounded font-extrabold">YOU</span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-400">@{entry.username}</span>
                        </div>
                      </div>
                    </td>

                    {/* Level & Category Pill */}
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-2">
                        <span className="capitalize px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700">
                          {entry.level}
                        </span>
                        {entry.categoryPill && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                            {entry.categoryPill}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Streak */}
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-1 text-amber-600 font-bold font-mono">
                        <Flame className="w-3.5 h-3.5 fill-amber-500" />
                        <span>{entry.streak}d</span>
                      </div>
                    </td>

                    {/* Completed */}
                    <td className="py-3.5 px-3 text-slate-600 font-mono">
                      {entry.completedChallenges} challenges
                    </td>

                    {/* XP Score */}
                    <td className="py-3.5 px-3 text-right">
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
