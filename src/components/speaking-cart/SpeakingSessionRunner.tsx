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
  ArrowLeft 
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

  // Sync timer when step changes
  useEffect(() => {
    if (currentItem) {
      setTimeLeft(currentItem.duration);
      setIsRunning(false);
    }
  }, [currentIndex, currentItem]);

  // Interval
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
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
    const totalXp = items.length * 15 + 20; // 15 XP per course + 20 bonus for full menu completion
    awardXp(totalXp, `Completed Full Speaking Menu Session (${items.length} items)`);
    completeDailyChallenge('dc-1');
    completeDailyChallenge('dc-2');
    onFinish();
  };

  if (sessionCompleted) {
    return (
      <div className="max-w-xl mx-auto p-8 bg-white rounded-3xl border border-slate-200/80 shadow-float text-center space-y-6 animate-slide-up">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20">
          <Sparkles className="w-8 h-8" />
        </div>

        <div>
          <h2 className="text-2xl font-extrabold text-slate-900">Session Completed!</h2>
          <p className="text-slate-600 text-sm mt-1">
            You successfully finished your custom Speaking Cart menu with all {items.length} dishes served.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-around">
          <div>
            <span className="text-xs text-indigo-700 block">Exercises</span>
            <span className="text-lg font-bold text-indigo-900 font-mono">{items.length}</span>
          </div>
          <div className="h-8 w-px bg-indigo-200" />
          <div>
            <span className="text-xs text-indigo-700 block">Total Speaking</span>
            <span className="text-lg font-bold text-indigo-900 font-mono">
              {Math.round(items.reduce((acc, it) => acc + it.duration, 0) / 60)} mins
            </span>
          </div>
          <div className="h-8 w-px bg-indigo-200" />
          <div>
            <span className="text-xs text-indigo-700 block">Reward</span>
            <span className="text-lg font-extrabold text-emerald-600 font-mono">
              +{items.length * 15 + 20} XP
            </span>
          </div>
        </div>

        <button
          onClick={handleClaimFinalSession}
          className="w-full py-3 rounded-xl font-bold text-sm bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20 transition-all"
        >
          Claim XP & Finish Session
        </button>
      </div>
    );
  }

  const courseTypeLabels: Record<string, { label: string; bg: string; text: string }> = {
    appetizer: { label: 'Appetizer Course', bg: 'bg-amber-100', text: 'text-amber-800' },
    'main-course': { label: 'Main Course', bg: 'bg-indigo-100', text: 'text-indigo-800' },
    dessert: { label: 'Dessert Course', bg: 'bg-pink-100', text: 'text-pink-800' }
  };

  const badge = courseTypeLabels[currentItem.type] || { label: 'Course', bg: 'bg-slate-100', text: 'text-slate-800' };

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {/* Session Top Navigator */}
      <div className="flex items-center justify-between">
        <button
          onClick={onExit}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit Session</span>
        </button>

        <div className="text-xs font-semibold text-slate-500">
          Course {currentIndex + 1} of {items.length}
        </div>
      </div>

      {/* Course Step Progress Pills */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-1.5">
        {items.map((item, idx) => (
          <div
            key={item.id}
            className={`h-2 rounded-full transition-all ${
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
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-card space-y-6">
        <div className="flex items-center justify-between">
          <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${badge.bg} ${badge.text}`}>
            {badge.label}
          </span>
          <span className="text-xs font-semibold text-slate-400 capitalize">
            {currentItem.category} • {currentItem.level}
          </span>
        </div>

        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            {currentItem.title}
          </h2>
          <p className="text-xs text-slate-500 mt-1">{currentItem.instructions}</p>
        </div>

        {/* Prompt Quote Box */}
        <div className="p-5 rounded-2xl bg-indigo-50/60 border border-indigo-100 text-slate-900 text-base sm:text-lg font-medium leading-relaxed">
          "{currentItem.prompt}"
        </div>

        {/* Timer Display */}
        <div className="flex flex-col items-center">
          <div className="text-4xl sm:text-5xl font-mono font-extrabold text-slate-900 tracking-tight">
            {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
          </div>
          <span className="text-[11px] font-semibold text-slate-400 uppercase mt-1">
            {isRunning ? 'Speaking in progress' : 'Paused / Ready'}
          </span>

          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={handleToggleTimer}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all ${
                isRunning
                  ? 'bg-amber-500 hover:bg-amber-600 text-white'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/20'
              }`}
            >
              {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
              <span>{isRunning ? 'Pause' : 'Start Timer'}</span>
            </button>

            <button
              onClick={handleResetCurrent}
              className="p-2.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
              title="Reset Timer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={handleStepDone}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-semibold text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all"
            >
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Next Course</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Vocabulary Support */}
        {currentItem.vocabulary.length > 0 && (
          <div className="pt-4 border-t border-slate-100">
            <span className="text-xs font-bold text-slate-700 block mb-2">Recommended Vocabulary:</span>
            <div className="flex flex-wrap gap-1.5">
              {currentItem.vocabulary.map((v, i) => (
                <button
                  key={i}
                  onClick={() => speechService.speak(v, 0.9)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-xs font-medium text-slate-700 transition-all"
                >
                  <span>{v}</span>
                  <Volume2 className="w-3 h-3 text-slate-400" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
