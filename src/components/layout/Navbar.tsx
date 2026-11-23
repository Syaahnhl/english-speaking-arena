import React from 'react';
import { useArena } from '../../context/ArenaContext';
import { LevelSelector } from './LevelSelector';
import { Flame, ShoppingBag, Volume2, VolumeX, Shield, User, RotateCcw } from 'lucide-react';
import { getRankByXp } from '../../services/gamificationService';

export const Navbar: React.FC = () => {
  const { user, role, setRole, cart, soundEnabled, toggleSound, setActiveTab, resetAllData } = useArena();
  const rank = getRankByXp(user.xp);

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 lg:px-8 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div 
          onClick={() => setActiveTab('dashboard')} 
          className="flex items-center gap-3 cursor-pointer select-none group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <span className="font-extrabold text-lg tracking-wider">ES</span>
          </div>
          <div className="hidden sm:block">
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-base tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                English Speaking Arena
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                PRO
              </span>
            </div>
            <p className="text-xs text-slate-500">Gamified Fluency & Reading Platform</p>
          </div>
        </div>

        {/* Center: Level Selector */}
        <div className="hidden md:flex items-center">
          <LevelSelector />
        </div>

        {/* Right Action Bar */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Daily Streak */}
          <div 
            title={`${user.streakDays}-Day Practice Streak! Keep it burning!`}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-800 text-xs font-bold"
          >
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500 animate-bounce-gentle" />
            <span>{user.streakDays}</span>
          </div>

          {/* XP & Rank */}
          <div 
            onClick={() => setActiveTab('progress')}
            title={`Current XP: ${user.xp}. Rank: ${rank.name}`}
            className="cursor-pointer flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-slate-800 text-xs font-semibold transition-all"
          >
            <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${rank.badgeBg} ${rank.badgeColor}`}>
              {rank.name}
            </span>
            <span className="font-mono font-bold text-indigo-600 hidden sm:inline">{user.xp} XP</span>
          </div>

          {/* Speaking Cart Shortcut */}
          <button
            onClick={() => setActiveTab('cart')}
            className="relative p-2 rounded-xl text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 border border-transparent hover:border-indigo-100 transition-all"
            title="Open Speaking Cart / Practice Menu"
          >
            <ShoppingBag className="w-5 h-5" />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-indigo-600 text-white rounded-full text-[10px] font-extrabold flex items-center justify-center animate-pulse">
                {cart.length}
              </span>
            )}
          </button>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-all"
            title={soundEnabled ? 'Mute Sound Effects' : 'Enable Sound Effects'}
          >
            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5 text-slate-400" />}
          </button>

          {/* Switch Role: Student vs Teacher */}
          <button
            onClick={() => setRole(role === 'student' ? 'teacher' : 'student')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
              role === 'teacher'
                ? 'bg-purple-100 text-purple-800 border-purple-300 shadow-sm'
                : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
            }`}
            title="Toggle between Student Mode and Teacher / Admin Dashboard"
          >
            {role === 'teacher' ? (
              <>
                <Shield className="w-3.5 h-3.5 text-purple-600" />
                <span className="hidden sm:inline">Teacher Mode</span>
              </>
            ) : (
              <>
                <User className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden sm:inline">Student View</span>
              </>
            )}
          </button>

          {/* Quick Demo Reset */}
          <button
            onClick={() => {
              if (window.confirm('Reset all demo data (XP, cart, submissions) to default?')) {
                resetAllData();
              }
            }}
            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
            title="Reset demo data"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile level selector */}
      <div className="mt-2.5 pt-2 border-t border-slate-100 md:hidden flex justify-center">
        <LevelSelector />
      </div>
    </header>
  );
};
