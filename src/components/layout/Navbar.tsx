import React from 'react';
import { useArena } from '../../context/ArenaContext';
import { LevelSelector } from './LevelSelector';
import { 
  Volume2, 
  VolumeX, 
  GraduationCap, 
  UserCheck
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    user, 
    soundEnabled, 
    toggleSound, 
    setActiveTab 
  } = useArena();

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200/90 px-4 lg:px-6 py-2.5 transition-colors">
      <div className="w-full flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div 
          onClick={() => setActiveTab('dashboard')} 
          className="flex items-center gap-3 cursor-pointer select-none group"
        >
          <div className="w-9 h-9 rounded-xl bg-teal-700 flex items-center justify-center text-white shadow-sm group-hover:bg-teal-800 transition-colors">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-sm sm:text-base tracking-tight text-slate-900 group-hover:text-teal-700 transition-colors">
              English Speaking Arena
            </h1>
            <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
              Platform Mengajar Percakapan & Membaca
            </p>
          </div>
        </div>

        {/* Right Section: Level Selector, Sound Toggle, Teacher Profile Pill */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Level Switcher */}
          <div className="hidden sm:block">
            <LevelSelector />
          </div>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-all border border-transparent hover:border-slate-200"
            title={soundEnabled ? 'Matikan Efek Suara' : 'Nyalakan Efek Suara'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-teal-700" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
          </button>

          {/* Active Teacher Profile Button */}
          <button
            onClick={() => setActiveTab('progress')}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-slate-800 text-xs font-semibold transition-all"
            title="Kelola Profil Pengajar, Kelas & Siswa"
          >
            <div className="w-5 h-5 rounded-md bg-teal-700 text-white flex items-center justify-center text-[10px] font-bold">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <span className="max-w-[130px] truncate">{user.name}</span>
          </button>
        </div>
      </div>

      {/* Mobile Level selector */}
      <div className="mt-2 pt-2 border-t border-slate-100 sm:hidden flex justify-center">
        <LevelSelector />
      </div>
    </header>
  );
};
