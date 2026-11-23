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
  Compass 
} from 'lucide-react';
import { soundService } from '../../services/soundService';

export const StudentDashboard: React.FC = () => {
  const { user, level, dailyChallenges, completeDailyChallenge, setActiveTab } = useArena();
  const rankProgress = getNextRankProgress(user.xp);

  const unlockedBadges = ACHIEVEMENTS_LIST.filter(a => user.achievements.includes(a.id));

  return (
    <div className="space-y-6">
      {/* 1. Welcome Section & Hero Bar */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-700 via-indigo-600 to-violet-700 text-white p-6 sm:p-8 shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold tracking-wide mb-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Welcome back, {user.name.split(' ')[0]}!</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Ready to find your voice today?
          </h1>
          <p className="text-indigo-100 text-xs sm:text-sm mt-2 leading-relaxed">
            Consistency is the secret to fluency. Complete your 3 daily challenges to keep your {user.streakDays}-day streak burning!
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                soundService.playClick();
                setActiveTab('cards');
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-white text-indigo-700 hover:bg-indigo-50 shadow-md transition-all"
            >
              <Layers className="w-4 h-4" />
              <span>Start Speaking</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => {
                soundService.playClick();
                setActiveTab('reading');
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-white/15 hover:bg-white/25 text-white border border-white/20 transition-all backdrop-blur-sm"
            >
              <BookOpen className="w-4 h-4" />
              <span>Running Reading</span>
            </button>
          </div>
        </div>

        {/* Rank & XP Card in Hero */}
        <div className="relative z-10 w-full md:w-72 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-indigo-200">Current Rank</span>
              <h3 className="text-lg font-black text-white">{rankProgress.currentRank.name}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-900 flex items-center justify-center font-bold">
              <Trophy className="w-5 h-5 text-amber-900" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs text-indigo-100 mb-1 font-mono">
              <span>{user.xp} XP</span>
              {rankProgress.nextRank ? (
                <span>Next: {rankProgress.nextRank.minXp} XP</span>
              ) : (
                <span>MAX RANK</span>
              )}
            </div>
            <div className="w-full h-2.5 bg-black/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-amber-300 transition-all duration-500"
                style={{ width: `${rankProgress.progressPercent}%` }}
              />
            </div>
            {rankProgress.nextRank && (
              <span className="text-[10px] text-indigo-200 block text-right mt-1 font-medium">
                {rankProgress.xpNeeded} XP to {rankProgress.nextRank.name}
              </span>
            )}
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/5 skew-x-12 pointer-events-none" />
      </div>

      {/* 2. Key Activity Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-soft">
          <div className="flex items-center gap-2 text-amber-600 text-xs font-bold mb-1">
            <Flame className="w-4 h-4 fill-amber-500" />
            <span>Daily Streak</span>
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono">{user.streakDays} Days</div>
          <span className="text-[10px] text-slate-400">Keep it going tomorrow!</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-soft">
          <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold mb-1">
            <Layers className="w-4 h-4" />
            <span>Activities Done</span>
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono">{user.completedActivities}</div>
          <span className="text-[10px] text-slate-400">Speaking & reading drills</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-soft">
          <div className="flex items-center gap-2 text-emerald-600 text-xs font-bold mb-1">
            <Clock className="w-4 h-4" />
            <span>Speaking Time</span>
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono">{user.speakingMinutes} mins</div>
          <span className="text-[10px] text-slate-400">Recorded speech practice</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-soft">
          <div className="flex items-center gap-2 text-purple-600 text-xs font-bold mb-1">
            <BookOpen className="w-4 h-4" />
            <span>Words Read</span>
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono">{user.wordsRead.toLocaleString()}</div>
          <span className="text-[10px] text-slate-400">Running Reading library</span>
        </div>
      </div>

      {/* 3. Daily Challenges Section */}
      <section className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-soft space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <h2 className="text-base font-extrabold text-slate-900">Today's Daily Missions</h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Complete these targeted routines to earn bonus XP and maintain your habit.
            </p>
          </div>
          <span className="text-xs font-bold text-slate-400 font-mono">
            {dailyChallenges.filter(c => c.completed).length} / {dailyChallenges.length} Done
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {dailyChallenges.map((challenge) => (
            <div
              key={challenge.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                challenge.completed
                  ? 'bg-emerald-50/60 border-emerald-200'
                  : 'bg-slate-50/80 border-slate-200/80 hover:border-indigo-200 hover:bg-white'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                    challenge.completed ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {challenge.type}
                  </span>
                  <span className="text-xs font-bold text-amber-600 font-mono">+{challenge.xpReward} XP</span>
                </div>
                <h4 className="font-bold text-sm text-slate-900">{challenge.title}</h4>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{challenge.description}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between">
                {challenge.completed ? (
                  <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Completed</span>
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
                    <span>Start Challenge</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Two-Column Layout: Quick Practice Features + Leaderboard Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 spans): Fast Access to Key Features */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-base text-slate-900">Recommended Next Activities</h3>
            <span className="text-xs text-slate-400 capitalize">Tuned for {level} level</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Running Reading Card */}
            <div
              onClick={() => setActiveTab('reading')}
              className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-soft hover:shadow-card hover:border-indigo-300 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold mb-3 group-hover:scale-105 transition-transform">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h4 className="font-extrabold text-base text-slate-900 group-hover:text-indigo-600 transition-colors">
                  Running Reading Trainer
                </h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Improve your reading speed (0.5x to 2.0x), track real-time sentence velocity, and answer comprehension quizzes.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-indigo-600">
                <span>Go to Library</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>

            {/* Speaking Cart / Menu */}
            <div
              onClick={() => setActiveTab('cart')}
              className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-soft hover:shadow-card hover:border-indigo-300 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold mb-3 group-hover:scale-105 transition-transform">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <h4 className="font-extrabold text-base text-slate-900 group-hover:text-amber-600 transition-colors">
                  Speaking Cart Menu
                </h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Build custom practice sessions with Appetizers (warm-up), Main Courses (roleplay & debate), and Desserts.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-600">
                <span>Build Practice Menu</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>

            {/* Roleplay Secret Mission */}
            <div
              onClick={() => setActiveTab('roleplay')}
              className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-soft hover:shadow-card hover:border-indigo-300 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold mb-3 group-hover:scale-105 transition-transform">
                  <Theater className="w-5 h-5" />
                </div>
                <h4 className="font-extrabold text-base text-slate-900 group-hover:text-purple-600 transition-colors">
                  Roleplay Secret Missions
                </h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Navigate high-stakes conversations with hidden rules, forbidden words, and objective scoring.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-purple-600">
                <span>Enter Roleplay</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>

            {/* Speaking Arena Showdowns */}
            <div
              onClick={() => setActiveTab('arena')}
              className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-soft hover:shadow-card hover:border-indigo-300 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold mb-3 group-hover:scale-105 transition-transform">
                  <Trophy className="w-5 h-5" />
                </div>
                <h4 className="font-extrabold text-base text-slate-900 group-hover:text-rose-600 transition-colors">
                  Speaking Arena Battles
                </h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Head-to-head topic showdowns and tournaments with peer comparative scoring rubrics.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-rose-600">
                <span>View Arena</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (1 span): Weekly Leaderboard Preview */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-amber-500" />
              Weekly Top Orators
            </h3>
            <button
              onClick={() => setActiveTab('arena')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
            >
              See All
            </button>
          </div>

          <div className="p-4 bg-white rounded-3xl border border-slate-200/80 shadow-soft space-y-3">
            {WEEKLY_LEADERBOARD.slice(0, 5).map((person, idx) => (
              <div
                key={person.id}
                className={`p-2.5 rounded-xl flex items-center justify-between transition-colors ${
                  person.isCurrentUser ? 'bg-indigo-50 border border-indigo-200' : 'hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={`w-5 text-center font-mono font-bold text-xs ${
                    idx === 0 ? 'text-amber-500' : idx === 1 ? 'text-slate-400' : idx === 2 ? 'text-amber-700' : 'text-slate-400'
                  }`}>
                    #{idx + 1}
                  </span>
                  <img
                    src={person.avatar}
                    alt={person.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-bold text-xs text-slate-800 flex items-center gap-1">
                      <span>{person.name.split(' ')[0]}</span>
                      {person.isCurrentUser && (
                        <span className="text-[9px] bg-indigo-600 text-white px-1 py-0.2 rounded font-extrabold">YOU</span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400">{person.categoryPill}</span>
                  </div>
                </div>

                <span className="font-mono font-extrabold text-xs text-indigo-700">
                  {person.xp} XP
                </span>
              </div>
            ))}
          </div>

          {/* Badges Preview */}
          <div className="p-4 bg-white rounded-3xl border border-slate-200/80 shadow-soft space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-xs text-slate-900">Your Badges ({unlockedBadges.length})</h4>
              <button
                onClick={() => setActiveTab('progress')}
                className="text-xs text-indigo-600 font-semibold"
              >
                View
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {unlockedBadges.map(badge => (
                <div
                  key={badge.id}
                  title={`${badge.title}: ${badge.description}`}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-purple-50 border border-purple-200 text-xs font-semibold text-purple-700"
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
