import React, { useState, useEffect } from 'react';
import { SpeakingCartItem } from '../../types';
import { useArena } from '../../context/ArenaContext';
import { soundService } from '../../services/soundService';
import { speechService } from '../../services/speechService';
import { 
  Play, 
  Pause, 
  CheckCircle, 
  ChevronRight, 
  RotateCcw, 
  Volume2, 
  Sparkles, 
  ArrowLeft,
  HelpCircle
} from 'lucide-react';

interface Props {
  items: SpeakingCartItem[];
  onFinish: () => void;
  onExit: () => void;
}

export const SpeakingSessionRunner: React.FC<Props> = ({ items, onFinish, onExit }) => {
  const { awardXp, completeDailyChallenge } = useArena();
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const currentItem = items[currentIndex];

  const [timeLeft, setTimeLeft] = useState<number>(currentItem ? currentItem.duration : 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [sessionCompleted, setSessionCompleted] = useState<boolean>(false);
  const [showHowToPlay, setShowHowToPlay] = useState<boolean>(false);

  // Sync timer when step changes
  useEffect(() => {
    if (currentItem) {
      setTimeLeft(currentItem.duration);
      setIsRunning(false);
    }
  }, [currentIndex, currentItem]);

  // Interval
  useEffect(() => {
    let interval: any = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleStepDone();
            return 0;
          }
          if (prev <= 4) soundService.playTick();
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft]);

  const handleStepDone = () => {
    soundService.playSuccess();
    if (currentIndex < items.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsRunning(false);
      setSessionCompleted(true);
    }
  };

  const handleToggleTimer = () => {
    soundService.playClick();
    setIsRunning(prev => !prev);
  };

  const handleResetCurrent = () => {
    soundService.playClick();
    setIsRunning(false);
    if (currentItem) setTimeLeft(currentItem.duration);
  };

  const handleClaimFinalSession = () => {
    const totalXp = items.length * 15 + 20;
    awardXp(totalXp, `Menyelesaikan Seluruh Rangkaian Menu Latihan (${items.length} Hidangan)`);
    completeDailyChallenge('dc-1');
    completeDailyChallenge('dc-2');
    onFinish();
  };

  if (sessionCompleted) {
    return (
      <div className="max-w-xl mx-auto p-8 sm:p-12 bg-white rounded-3xl border border-slate-200/80 shadow-float text-center space-y-6 animate-slide-up">
        <div className="w-16 h-16 mx-auto rounded-3xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20">
          <Sparkles className="w-8 h-8" />
        </div>

        <div className="space-y-1">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Seluruh Menu Selesai Disajikan!</h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            Selamat! Anda berhasil menuntaskan seluruh {items.length} rangkaian latihan bicara dalam sesi menu ini.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-indigo-50/70 border border-indigo-100 flex items-center justify-around">
          <div>
            <span className="text-xs text-indigo-700 block font-bold">Latihan Selesai</span>
            <span className="text-xl font-black text-indigo-950 font-mono">{items.length} Hidangan</span>
          </div>
          <div className="h-10 w-px bg-indigo-200" />
          <div>
            <span className="text-xs text-indigo-700 block font-bold">Total Waktu</span>
            <span className="text-xl font-black text-indigo-950 font-mono">
              {Math.round(items.reduce((acc, it) => acc + it.duration, 0) / 60)} Menit
            </span>
          </div>
          <div className="h-10 w-px bg-indigo-200" />
          <div>
            <span className="text-xs text-indigo-700 block font-bold">Total Reward</span>
            <span className="text-xl font-black text-emerald-600 font-mono">
              +{items.length * 15 + 20} XP
            </span>
          </div>
        </div>

        <button
          onClick={handleClaimFinalSession}
          className="w-full py-3.5 rounded-2xl font-bold text-sm bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20 transition-all"
        >
          Klaim Total XP & Selesaikan Sesi
        </button>
      </div>
    );
  }

  const courseTypeLabels: Record<string, { label: string; bg: string; text: string }> = {
    appetizer: { label: 'Hidangan 1: Appetizer', bg: 'bg-amber-100', text: 'text-amber-800' },
    'main-course': { label: 'Hidangan 2: Main Course', bg: 'bg-indigo-100', text: 'text-indigo-800' },
    dessert: { label: 'Hidangan 3: Dessert', bg: 'bg-pink-100', text: 'text-pink-800' }
  };

  const badge = courseTypeLabels[currentItem.type] || { label: 'Latihan', bg: 'bg-slate-100', text: 'text-slate-800' };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Session Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onExit}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 border border-slate-200 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Keluar dari Sesi</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowHowToPlay(!showHowToPlay)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 transition-all"
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
            <span>Panduan</span>
          </button>

          <span className="text-xs font-bold font-mono text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl">
            Latihan {currentIndex + 1} dari {items.length}
          </span>
        </div>
      </div>

      {showHowToPlay && (
        <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200 text-xs text-amber-900 space-y-1 animate-slide-up">
          <strong className="block font-bold">Panduan Berbicara:</strong>
          <p>Fokuslah berbicara pada prompt yang ditampilkan. Setiap kali timer habis atau Anda menekan "Lanjut Hidangan Berikutnya", sistem akan langsung memindahkan Anda ke hidangan latihan berikutnya hingga seluruh menu tuntas!</p>
        </div>
      )}

      {/* Course Step Progress Bar */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
        {items.map((item, idx) => (
          <div
            key={item.id}
            className={`h-2.5 rounded-full transition-all ${
              idx < currentIndex
                ? 'bg-emerald-500'
                : idx === currentIndex
                ? 'bg-indigo-600 animate-pulse'
                : 'bg-slate-200'
            }`}
          />
        ))}
      </div>

      {/* Main Focus Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-card space-y-6">
        <div className="flex items-center justify-between">
          <span className={`text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full ${badge.bg} ${badge.text}`}>
            {badge.label}
          </span>
          <span className="text-xs font-semibold text-slate-400 capitalize">
            {currentItem.category} • Tingkat {currentItem.level}
          </span>
        </div>

        <div className="space-y-1">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {currentItem.title}
          </h2>
          <p className="text-xs text-slate-500">{currentItem.instructions}</p>
        </div>

        {/* Prompt Quote Box */}
        <div className="p-6 rounded-2xl bg-indigo-50/60 border border-indigo-100 text-slate-900 text-base sm:text-lg font-medium leading-relaxed">
          "{currentItem.prompt}"
        </div>

        {/* Timer Display */}
        <div className="flex flex-col items-center py-2">
          <div className="text-5xl sm:text-6xl font-mono font-black text-slate-900 tracking-tight">
            {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
          </div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-2">
            {isRunning ? 'Waktu Bicara Sedang Berjalan' : 'Jeda / Siap'}
          </span>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={handleToggleTimer}
              className={`flex items-center gap-2 px-8 py-3 rounded-2xl font-bold text-xs shadow-md transition-all ${
                isRunning
                  ? 'bg-amber-500 hover:bg-amber-600 text-white'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/20'
              }`}
            >
              {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
              <span>{isRunning ? 'Jeda' : 'Mulai Timer'}</span>
            </button>

            <button
              onClick={handleResetCurrent}
              className="p-3 rounded-2xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
              title="Reset Timer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={handleStepDone}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all"
            >
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>{currentIndex < items.length - 1 ? 'Lanjut Hidangan Berikutnya' : 'Selesaikan Semua'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Vocabulary Support */}
        {currentItem.vocabulary.length > 0 && (
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <span className="text-xs font-bold text-slate-700 block">Kosakata Bantu:</span>
            <div className="flex flex-wrap gap-2">
              {currentItem.vocabulary.map((v, i) => (
                <button
                  key={i}
                  onClick={() => speechService.speak(v, 0.9)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 text-xs font-semibold text-slate-700 border border-slate-200 transition-all"
                >
                  <span>{v}</span>
                  <Volume2 className="w-3.5 h-3.5 text-slate-400" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
