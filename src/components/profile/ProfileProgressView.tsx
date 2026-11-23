import React from 'react';
import { useArena } from '../../context/ArenaContext';
import { RANKS, getNextRankProgress } from '../../services/gamificationService';
import { ACHIEVEMENTS_LIST } from '../../data/achievementsData';
import { 
  Award, 
  Trophy, 
  Flame, 
  Sparkles, 
  Clock, 
  BookOpen, 
  Layers, 
  ShieldCheck, 
  CheckCircle2, 
  Lock 
} from 'lucide-react';
import { soundService } from '../../services/soundService';

export const ProfileProgressView: React.FC = () => {
  const { user, level, setLevel } = useArena();
  const rankProgress = getNextRankProgress(user.xp);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-soft flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-indigo-600 shadow-md"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900">{user.name}</h1>
              <span className="text-xs uppercase font-extrabold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">
                {user.role}
              </span>
            </div>
            <p className="text-xs text-slate-400">@{user.username} • Enrolled in Class 10-A</p>

            {/* Level Selector Pills */}
            <div className="mt-3 flex items-center gap-1.5">
              <span className="text-xs font-semibold text-slate-500 mr-1">Arena Level:</span>
              {(['beginner', 'intermediate', 'advanced'] as const).map(lvl => (
                <button
                  key={lvl}
                  onClick={() => setLevel(lvl)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold capitalize transition-all ${
                    level === lvl
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Current XP & Rank Badge */}
        <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 text-center w-full sm:w-auto">
          <span className="text-[10px] uppercase font-bold text-indigo-600 block">Current Arena Standing</span>
          <h3 className="text-xl font-black text-indigo-950 mt-0.5">{rankProgress.currentRank.name}</h3>
          <span className="text-sm font-mono font-bold text-indigo-700 block mt-1">{user.xp} Total XP</span>
        </div>
      </div>

      {/* Rank Ladder / Roadmap */}
      <section className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-soft space-y-4">
        <div>
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-500" />
            Arena Rank Progression Ladder
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Advance through the 6 ranks by consistently speaking and reading in the arena.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {RANKS.map((r) => {
            const isReached = user.xp >= r.minXp;
            const isCurrent = user.rank === r.name;

            return (
              <div
                key={r.name}
                className={`p-3.5 rounded-2xl border text-center transition-all ${
                  isCurrent
                    ? 'bg-indigo-50 border-2 border-indigo-600 shadow-sm'
                    : isReached
                    ? 'bg-emerald-50/50 border-emerald-200'
                    : 'bg-slate-50/60 border-slate-200 opacity-60'
                }`}
              >
                <div className="flex justify-center mb-1.5">
                  {isReached ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <Lock className="w-5 h-5 text-slate-400" />
                  )}
                </div>
                <h4 className="font-extrabold text-xs text-slate-900">{r.name}</h4>
                <span className="text-[10px] font-mono font-semibold text-slate-500 block mt-1">
                  {r.minXp} XP
                </span>
                {isCurrent && (
                  <span className="text-[9px] font-extrabold uppercase tracking-wider text-indigo-600 bg-indigo-100/80 px-1.5 py-0.5 rounded mt-1.5 inline-block">
                    Current
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Achievement Badges Showcase */}
      <section className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-soft space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-purple-600" />
              Achievement Badges
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Unlock badges by accomplishing speech milestones and maintaining consistency.
            </p>
          </div>
          <span className="text-xs font-bold text-slate-400 font-mono">
            {user.achievements.length} of {ACHIEVEMENTS_LIST.length} Unlocked
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {ACHIEVEMENTS_LIST.map((ach) => {
            const isUnlocked = user.achievements.includes(ach.id);

            return (
              <div
                key={ach.id}
                className={`p-4 rounded-2xl border transition-all flex items-start gap-3.5 ${
                  isUnlocked
                    ? 'bg-purple-50/50 border-purple-200 shadow-soft'
                    : 'bg-slate-50/50 border-slate-200/80 opacity-60'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  isUnlocked ? 'bg-purple-600 text-white shadow-sm' : 'bg-slate-200 text-slate-400'
                }`}>
                  {isUnlocked ? <Award className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-extrabold text-xs text-slate-900">{ach.title}</h4>
                    <span className="text-[10px] font-mono font-bold text-amber-600 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                      +{ach.xpReward} XP
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{ach.description}</p>
                  <span className={`text-[10px] font-bold block mt-2 ${
                    isUnlocked ? 'text-emerald-700' : 'text-slate-400'
                  }`}>
                    {isUnlocked ? '✓ Unlocked' : 'Locked'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
