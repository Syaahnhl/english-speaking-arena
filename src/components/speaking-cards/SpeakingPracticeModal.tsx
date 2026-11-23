import React, { useState, useEffect } from 'react';
import { SpeakingCard } from '../../types';
import { useArena } from '../../context/ArenaContext';
import { soundService } from '../../services/soundService';
import { speechService } from '../../services/speechService';
import { 
  X, 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle, 
  Volume2, 
  HelpCircle, 
  Lightbulb, 
  ChevronDown, 
  ChevronUp, 
  Sparkles,
  Clock
} from 'lucide-react';

interface Props {
  card: SpeakingCard;
  onClose: () => void;
}

export const SpeakingPracticeModal: React.FC<Props> = ({ card, onClose }) => {
  const { awardXp, completeDailyChallenge } = useArena();
  
  const durationOptions = card.suggestedDurationOptions || [30, 60, 90, 120, 180];
  const [selectedDuration, setSelectedDuration] = useState<number>(card.estimatedDuration || 60);
  const [timeLeft, setTimeLeft] = useState<number>(selectedDuration);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const [showSample, setShowSample] = useState<boolean>(false);
  const [showHints, setShowHints] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            setIsFinished(true);
            soundService.playTimesUp();
            return 0;
          }
          if (prev <= 4) {
            soundService.playTick();
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft]);

  const handleStart = () => {
    if (!hasStarted) {
      setHasStarted(true);
      soundService.playStart();
    } else {
      soundService.playClick();
    }
    setIsRunning(true);
  };

  const handlePause = () => {
    soundService.playClick();
    setIsRunning(false);
  };

  const handleReset = () => {
    soundService.playClick();
    setIsRunning(false);
    setTimeLeft(selectedDuration);
    setHasStarted(false);
    setIsFinished(false);
  };

  const handleChangeDuration = (sec: number) => {
    if (isRunning) return;
    setSelectedDuration(sec);
    setTimeLeft(sec);
    soundService.playClick();
  };

  const handleFinishEarly = () => {
    setIsRunning(false);
    setIsFinished(true);
    soundService.playSuccess();
  };

  const handleClaimReward = () => {
    // Award 20 XP for completing speaking challenge
    awardXp(20, `Completed Speaking Card: "${card.title}"`);
    completeDailyChallenge('dc-1');
    onClose();
  };

  const progressPercent = Math.min(100, Math.round(((selectedDuration - timeLeft) / selectedDuration) * 100));

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-float border border-slate-200 animate-slide-up my-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-2 rounded-full hover:bg-slate-100 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Level & Category Badge */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
            {card.category.replace('-', ' ')}
          </span>
          <span className="text-[11px] font-semibold text-slate-400">
            • {card.level.toUpperCase()}
          </span>
        </div>

        {/* Prompt Title */}
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          {card.title}
        </h2>

        {/* Core Question / Topic Prompt in High Focus */}
        <div className="mt-4 p-5 rounded-2xl bg-indigo-50/70 border border-indigo-100 text-slate-900 text-base sm:text-lg font-medium leading-relaxed shadow-sm">
          "{card.question}"
        </div>

        {/* Duration Picker (Only before starting or paused) */}
        {!hasStarted && (
          <div className="mt-4 flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Duration:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {durationOptions.map(sec => (
                <button
                  key={sec}
                  onClick={() => handleChangeDuration(sec)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold font-mono transition-all ${
                    selectedDuration === sec
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {sec >= 60 ? `${sec / 60}m` : `${sec}s`}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Countdown Timer Display */}
        <div className="mt-6 flex flex-col items-center">
          <div className="relative w-36 h-36 flex items-center justify-center">
            {/* SVG circular progress */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="72"
                cy="72"
                r="62"
                stroke="currentColor"
                strokeWidth="8"
                className="text-slate-100"
                fill="transparent"
              />
              <circle
                cx="72"
                cy="72"
                r="62"
                stroke="currentColor"
                strokeWidth="8"
                strokeDasharray={390}
                strokeDashoffset={390 - (390 * progressPercent) / 100}
                strokeLinecap="round"
                className={`transition-all duration-300 ${
                  timeLeft <= 5 ? 'text-rose-500' : 'text-indigo-600'
                }`}
                fill="transparent"
              />
            </svg>

            <div className="absolute flex flex-col items-center justify-center">
              <span className={`text-3xl font-mono font-extrabold ${
                timeLeft <= 5 ? 'text-rose-600 animate-pulse' : 'text-slate-900'
              }`}>
                {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
              </span>
              <span className="text-[10px] text-slate-400 font-semibold uppercase">
                {isRunning ? 'Speaking' : isFinished ? 'Completed' : 'Ready'}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-4 flex items-center gap-3">
            {!isRunning ? (
              <button
                onClick={handleStart}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20 transition-all"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>{hasStarted ? 'Resume Speaking' : 'Start Challenge'}</span>
              </button>
            ) : (
              <button
                onClick={handlePause}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm bg-amber-500 hover:bg-amber-600 text-white shadow-md transition-all"
              >
                <Pause className="w-4 h-4" />
                <span>Pause</span>
              </button>
            )}

            {hasStarted && !isFinished && (
              <button
                onClick={handleFinishEarly}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-semibold text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all"
              >
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Finish Now</span>
              </button>
            )}

            <button
              onClick={handleReset}
              className="p-2.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
              title="Reset Timer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Vocabulary Suggestions */}
        <div className="mt-6 pt-5 border-t border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Suggested Vocabulary:
            </span>
            <span className="text-[11px] text-slate-400">Click to listen pronunciation</span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {card.vocabularySuggestions.map((vocab, vIdx) => (
              <button
                key={vIdx}
                onClick={() => speechService.speak(vocab, 0.9)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 border border-slate-200/80 text-xs font-medium text-slate-700 transition-all"
              >
                <span>{vocab}</span>
                <Volume2 className="w-3 h-3 text-slate-400 group-hover:text-indigo-500" />
              </button>
            ))}
          </div>
        </div>

        {/* Sentence Starters */}
        {card.sentenceStarters.length > 0 && (
          <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200/60">
            <span className="text-xs font-bold text-slate-700 block mb-1.5">Sentence Starters:</span>
            <div className="space-y-1">
              {card.sentenceStarters.map((starter, sIdx) => (
                <p key={sIdx} className="text-xs text-slate-600 italic">
                  • "{starter}"
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Expandable Hints & Sample Response */}
        <div className="mt-4 space-y-2">
          {/* Hints Toggle */}
          {card.hints.length > 0 && (
            <div className="border border-slate-200/70 rounded-xl overflow-hidden">
              <button
                onClick={() => setShowHints(!showHints)}
                className="w-full flex items-center justify-between p-3 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all"
              >
                <span className="flex items-center gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-500" /> Practice Hints & Strategy
                </span>
                {showHints ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {showHints && (
                <div className="p-3 bg-amber-50/50 border-t border-slate-100 text-xs text-slate-600 space-y-1">
                  {card.hints.map((h, i) => (
                    <div key={i}>• {h}</div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Sample Response Drawer (Need help?) */}
          {card.sampleResponse && (
            <div className="border border-slate-200/70 rounded-xl overflow-hidden">
              <button
                onClick={() => setShowSample(!showSample)}
                className="w-full flex items-center justify-between p-3 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all"
              >
                <span className="flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-indigo-500" /> Need Help? See Sample Response
                </span>
                {showSample ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {showSample && (
                <div className="p-4 bg-indigo-50/40 border-t border-slate-100 text-xs text-slate-700 leading-relaxed">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-indigo-900">Model Response:</span>
                    <button
                      onClick={() => speechService.speak(card.sampleResponse || '', 0.95)}
                      className="flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:text-indigo-800"
                    >
                      <Volume2 className="w-3 h-3" /> Listen
                    </button>
                  </div>
                  <p className="italic">"{card.sampleResponse}"</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Completion Modal Prompt */}
        {isFinished && (
          <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 flex items-center justify-between animate-slide-up">
            <div>
              <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-sm">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Challenge Completed!</span>
              </div>
              <p className="text-xs text-emerald-700 mt-0.5">
                Great vocal flow! Claim your +20 XP rewards.
              </p>
            </div>
            <button
              onClick={handleClaimReward}
              className="px-5 py-2.5 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-500/20 transition-all"
            >
              Claim +20 XP
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
