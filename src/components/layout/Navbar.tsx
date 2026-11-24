import React from 'react';
import { useArena } from '../../context/ArenaContext';
import { LevelSelector } from './LevelSelector';
import { 
  ShoppingBag, 
  Volume2, 
  VolumeX, 
  GraduationCap, 
  Monitor, 
  Users, 
  ChevronDown, 
  RotateCcw,
  Sparkles,
  Eye
} from 'lucide-react';
import { storageService } from '../../services/storageService';

export const Navbar: React.FC = () => {
  const { 
    user, 
    role, 
    setRole, 
    cart, 
    soundEnabled, 
    toggleSound, 
    setActiveTab, 
    resetAllData,
    activeClassId,
    setActiveClassId,
    isProjectorMode,
    toggleProjectorMode
  } = useArena();

  const classrooms = storageService.getClassrooms();
  const currentClass = classrooms.find(c => c.id === activeClassId) || classrooms[0];

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-4 lg:px-8 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div 
          onClick={() => setActiveTab('dashboard')} 
          className="flex items-center gap-3 cursor-pointer select-none group"
        >
          <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div className="hidden sm:block">
            <div className="flex items-center gap-2">
              <h1 className="font-black text-base tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                English Speaking Arena
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                TEACHER SUITE
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">Platform Praktik Bicara & Teleprompter Kelas</p>
          </div>
        </div>

        {/* Center: Active Classroom Selector & Level Filter */}
        <div className="hidden md:flex items-center gap-3">
          {/* Active Class Selector Dropdown */}
          <div className="relative">
            <select
              value={activeClassId}
              onChange={(e) => setActiveClassId(e.target.value)}
              className="appearance-none bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-slate-800 text-xs font-bold py-1.5 pl-8 pr-8 rounded-xl cursor-pointer transition-all"
            >
              {classrooms.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name} ({cls.studentCount} Murid)
                </option>
              ))}
            </select>
            <Users className="w-3.5 h-3.5 text-indigo-600 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Level Switcher */}
          <LevelSelector />
        </div>

        {/* Right Action Bar for Teacher */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Projector / Screen Presentation Mode */}
          <button
            onClick={toggleProjectorMode}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
              isProjectorMode
                ? 'bg-amber-100 text-amber-900 border-amber-300 shadow-sm'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
            title="Mode Presentasi Layar / Proyektor Kelas"
          >
            <Monitor className="w-3.5 h-3.5 text-indigo-600" />
            <span className="hidden xl:inline">{isProjectorMode ? 'Proyektor Aktif' : 'Layar Kelas'}</span>
          </button>

          {/* Lesson Plan / Speaking Cart Shortcut */}
          <button
            onClick={() => setActiveTab('cart')}
            className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-slate-700 hover:text-indigo-600 bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 text-xs font-bold transition-all"
            title="Buka Rangkaian Sesi Mengajar (Speaking Cart)"
          >
            <ShoppingBag className="w-4 h-4 text-indigo-600" />
            <span className="hidden md:inline">Rangkaian Sesi</span>
            {cart.length > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 bg-indigo-600 text-white rounded-full text-[10px] font-extrabold font-mono">
                {cart.length}
              </span>
            )}
          </button>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-all border border-transparent hover:border-slate-200"
            title={soundEnabled ? 'Matikan Efek Suara Timer/Buzzer' : 'Nyalakan Efek Suara'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
          </button>

          {/* Teacher Profile / Role Toggle */}
          <div className="flex items-center gap-2 pl-1 border-l border-slate-200">
            <button
              onClick={() => setActiveTab('teacher')}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-900 text-xs font-bold transition-all"
              title="Profil Pengajar & Roster Siswa"
            >
              <img
                src={user.avatar}
                alt={user.name}
                className="w-5 h-5 rounded-full object-cover"
              />
              <span className="hidden lg:inline">{user.name.split(' ')[0]} (Pengajar)</span>
            </button>

            {/* Quick Demo Reset */}
            <button
              onClick={() => {
                if (window.confirm('Reset data simulasi kelas ke kondisi awal?')) {
                  resetAllData();
                }
              }}
              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
              title="Reset data demo"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Bar: Class selector & Level selector */}
      <div className="mt-2.5 pt-2 border-t border-slate-100 md:hidden flex flex-col gap-2">
        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-500 font-semibold">Kelas:</span>
          <select
            value={activeClassId}
            onChange={(e) => setActiveClassId(e.target.value)}
            className="bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold py-1 px-2 rounded-lg"
          >
            {classrooms.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex justify-center">
          <LevelSelector />
        </div>
      </div>
    </header>
  );
};
