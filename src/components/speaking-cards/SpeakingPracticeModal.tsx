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
  Clock,
  BookOpen
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
  const [showHowToPlay, setShowHowToPlay] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  useEffect(() => {
    let interval: any = null;
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
    awardXp(20, `Menyelesaikan Tantangan Bicara: "${card.title}"`);
    completeDailyChallenge('dc-1');
    onClose();
  };

  const progressPercent = Math.min(100, Math.round(((selectedDuration - timeLeft) / selectedDuration) * 100));

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-10 shadow-float border border-slate-200 animate-slide-up my-6 relative space-y-6">
        {/* Top Header Controls */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
              {card.category.replace('-', ' ')}
            </span>
            <span className="text-xs font-semibold text-slate-400 capitalize">
              • Tingkat {card.level}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowHowToPlay(!showHowToPlay)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 transition-all"
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
              <span>Cara Latihan</span>
            </button>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-100 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* HOW TO PLAY ACCORDION */}
        {showHowToPlay && (
          <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200/80 text-xs text-amber-900 space-y-2 animate-slide-up">
            <strong className="block font-bold">Panduan Langkah Latihan:</strong>
            <ol className="list-decimal pl-4 space-y-1">
              <li>Pahami <strong>Topik Utama</strong> di bawah dan tentukan poin pendapat Anda.</li>
              <li>Pilih durasi target bicara (30 detik hingga 3 menit).</li>
              <li>Gunakan <strong>Kosakata Rekomendasi</strong> untuk memperkaya ungkapan bahasa Inggris Anda.</li>
              <li>Manfaatkan <strong>Sentence Starters</strong> jika Anda butuh kalimat pembuka.</li>
              <li>Tekan <strong>Mulai Bicara</strong> dan teruslah berbicara tanpa rasa takut salah hingga timer berbunyi!</li>
            </ol>
          </div>
        )}

        {/* Prompt Title & Core Question with High Focus */}
        <div className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug">
            {card.title}
          </h2>

          <div className="p-6 rounded-2xl bg-indigo-50/60 border border-indigo-100 text-slate-900 text-base sm:text-lg font-medium leading-relaxed">
            "{card.question}"
          </div>
        </div>

        {/* Duration Selection (Before starting) */}
        {!hasStarted && (
          <div className="flex items-center gap-3 py-1">
            <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-slate-400" /> Target Waktu:
            </span>
            <div className="flex flex-wrap gap-2">
              {durationOptions.map(sec => (
                <button
                  key={sec}
                  onClick={() => handleChangeDuration(sec)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition-all ${
                    selectedDuration === sec
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {sec >= 60 ? `${sec / 60} Menit` : `${sec} Detik`}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Circular Countdown Timer */}
        <div className="flex flex-col items-center py-2">
          <div className="relative w-40 h-40 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke="currentColor"
                strokeWidth="10"
                className="text-slate-100"
                fill="transparent"
              />
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke="currentColor"
                strokeWidth="10"
                strokeDasharray={440}
                strokeDashoffset={440 - (440 * progressPercent) / 100}
                strokeLinecap="round"
                className={`transition-all duration-300 ${
                  timeLeft <= 5 ? 'text-rose-500' : 'text-indigo-600'
                }`}
                fill="transparent"
              />
            </svg>

            <div className="absolute flex flex-col items-center justify-center">
              <span className={`text-4xl font-mono font-black ${
                timeLeft <= 5 ? 'text-rose-600 animate-pulse' : 'text-slate-900'
              }`}>
                {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
              </span>
              <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mt-1">
                {isRunning ? 'Sedang Bicara' : isFinished ? 'Selesai' : 'Siap Latihan'}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            {!isRunning ? (
              <button
                onClick={handleStart}
                className="flex items-center gap-2 px-8 py-3 rounded-2xl font-bold text-sm bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20 transition-all"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>{hasStarted ? 'Lanjutkan Bicara' : 'Mulai Bicara Sekarang'}</span>
              </button>
            ) : (
              <button
                onClick={handlePause}
                className="flex items-center gap-2 px-8 py-3 rounded-2xl font-bold text-sm bg-amber-500 hover:bg-amber-600 text-white shadow-md transition-all"
              >
                <Pause className="w-4 h-4" />
                <span>Jeda Sementara</span>
              </button>
            )}

            {hasStarted && !isFinished && (
              <button
                onClick={handleFinishEarly}
                className="flex items-center gap-1.5 px-5 py-3 rounded-2xl font-bold text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all"
              >
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Selesai Lebih Awal</span>
              </button>
            )}

            <button
              onClick={handleReset}
              className="p-3 rounded-2xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
              title="Reset Timer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Vocabulary Support */}
        <div className="pt-4 border-t border-slate-100 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Kosakata Bantu (Klik untuk Suara):
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {card.vocabularySuggestions.map((vocab, vIdx) => (
              <button
                key={vIdx}
                onClick={() => speechService.speak(vocab, 0.9)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 border border-slate-200/80 text-xs font-semibold text-slate-700 transition-all shadow-sm"
              >
                <span>{vocab}</span>
                <Volume2 className="w-3.5 h-3.5 text-slate-400" />
              </button>
            ))}
          </div>
        </div>

        {/* Sentence Starters */}
        {card.sentenceStarters.length > 0 && (
          <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-2">
            <span className="text-xs font-bold text-slate-800 block">Contoh Pembuka Kalimat (Sentence Starters):</span>
            <div className="space-y-1.5">
              {card.sentenceStarters.map((starter, sIdx) => (
                <p key={sIdx} className="text-xs text-slate-700 font-medium italic">
                  • "{starter}"
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Hints & Sample Response */}
        <div className="space-y-2.5">
          {card.hints.length > 0 && (
            <div className="border border-slate-200/80 rounded-2xl overflow-hidden">
              <button
                onClick={() => setShowHints(!showHints)}
                className="w-full flex items-center justify-between p-3.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all"
              >
                <span className="flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-500" /> Tips & Strategi Berbicara
                </span>
                {showHints ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {showHints && (
                <div className="p-4 bg-amber-50/40 border-t border-slate-100 text-xs text-slate-700 space-y-1.5">
                  {card.hints.map((h, i) => (
                    <div key={i}>• {h}</div>
                  ))}
                </div>
              )}
            </div>
          )}

          {card.sampleResponse && (
            <div className="border border-slate-200/80 rounded-2xl overflow-hidden">
              <button
                onClick={() => setShowSample(!showSample)}
                className="w-full flex items-center justify-between p-3.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all"
              >
                <span className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-indigo-600" /> Butuh Inspirasi? Lihat Contoh Jawaban
                </span>
                {showSample ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {showSample && (
                <div className="p-4 bg-indigo-50/40 border-t border-slate-100 text-xs text-slate-700 leading-relaxed space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-indigo-900">Model Response:</span>
                    <button
                      onClick={() => speechService.speak(card.sampleResponse || '', 0.95)}
                      className="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800"
                    >
                      <Volume2 className="w-3.5 h-3.5" /> Dengarkan Contoh
                    </button>
                  </div>
                  <p className="italic">"{card.sampleResponse}"</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Completion Card */}
        {isFinished && (
          <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 flex items-center justify-between animate-slide-up">
            <div>
              <div className="flex items-center gap-2 text-emerald-900 font-extrabold text-sm">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
                <span>Latihan Selesai!</span>
              </div>
              <p className="text-xs text-emerald-700 mt-0.5">
                Pencapaian luar biasa! Klaim bonus +20 XP untuk progres Anda.
              </p>
            </div>
            <button
              onClick={handleClaimReward}
              className="px-6 py-2.5 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-500/20 transition-all"
            >
              Klaim +20 XP
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
