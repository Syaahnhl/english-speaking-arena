import React, { useState, useEffect } from 'react';
import { SpeakingCard } from '../../types';
import { useArena } from '../../context/ArenaContext';
import { soundService } from '../../services/soundService';
import { speechService } from '../../services/speechService';
import { storageService } from '../../services/storageService';
import { WEEKLY_LEADERBOARD } from '../../data/seedUsersData';
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
  BookOpen,
  UserCheck,
  Dices,
  Award,
  Send,
  Star
} from 'lucide-react';

interface Props {
  card: SpeakingCard;
  onClose: () => void;
}

export const SpeakingPracticeModal: React.FC<Props> = ({ card, onClose }) => {
  const { addToast } = useArena();
  const students = WEEKLY_LEADERBOARD;
  
  const [selectedStudent, setSelectedStudent] = useState<string>(students[0].name);
  const durationOptions = card.suggestedDurationOptions || [30, 60, 90, 120, 180];
  const [selectedDuration, setSelectedDuration] = useState<number>(card.estimatedDuration || 60);
  const [timeLeft, setTimeLeft] = useState<number>(selectedDuration);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const [showSample, setShowSample] = useState<boolean>(false);
  const [showHints, setShowHints] = useState<boolean>(false);
  const [showHowToPlay, setShowHowToPlay] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  // Teacher evaluation states
  const [fluencyScore, setFluencyScore] = useState<number>(28);
  const [vocabScore, setVocabScore] = useState<number>(32);
  const [fulfillmentScore, setFulfillmentScore] = useState<number>(33);
  const [selectedTags, setSelectedTags] = useState<string[]>(['Pelafalan Jelas', 'Kosakata Tepat']);
  const [teacherNotes, setTeacherNotes] = useState<string>('Penyampaian argumen percaya diri dengan intonasi natural.');

  const totalScore = fluencyScore + vocabScore + fulfillmentScore;

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

  const handlePickRandomStudent = () => {
    soundService.playClick();
    const randomIndex = Math.floor(Math.random() * students.length);
    setSelectedStudent(students[randomIndex].name);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleSaveStudentGrade = () => {
    storageService.addSubmission({
      id: `sub-${Date.now()}`,
      studentId: `usr-${selectedStudent.toLowerCase().replace(/\s+/g, '-')}`,
      studentName: selectedStudent,
      assignmentTitle: `Speaking Drill: ${card.title}`,
      submittedAt: 'Baru saja di kelas',
      durationSeconds: selectedDuration - timeLeft,
      transcriptOrNotes: `Catatan guru: ${teacherNotes} [Tags: ${selectedTags.join(', ')}]`,
      status: 'graded',
      score: totalScore,
      feedback: `Nilai: ${totalScore}/100. ${teacherNotes}`,
      activityType: 'speaking-card'
    });

    soundService.playSuccess();
    addToast({
      type: 'success',
      title: 'Nilai Siswa Disimpan!',
      message: `Skor ${totalScore}/100 & +${Math.round(totalScore * 0.35)} XP telah diberikan kepada ${selectedStudent}.`
    });
    onClose();
  };

  const progressPercent = Math.min(100, Math.round(((selectedDuration - timeLeft) / selectedDuration) * 100));

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-float border border-slate-200 animate-slide-up my-6 relative space-y-6">
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
              <span>Panduan Fasilitator</span>
            </button>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-100 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* HOW TO FACILITATE ACCORDION */}
        {showHowToPlay && (
          <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200/80 text-xs text-amber-900 space-y-2 animate-slide-up">
            <strong className="block font-bold">Langkah Fasilitasi Guru di Kelas:</strong>
            <ol className="list-decimal pl-4 space-y-1">
              <li>Pilih atau undi murid yang akan maju berbicara di depan kelas.</li>
              <li>Tampilkan topik pemantik pada layar proyektor agar seluruh kelas dapat menyimak.</li>
              <li>Pilih target waktu bicara (30 detik hingga 3 menit) sesuai kemampuan siswa.</li>
              <li>Putar pelafalan contoh kosakata jika siswa membutuhkan bantuan pengucapan.</li>
              <li>Tekan <strong>Mulai Timer</strong> saat siswa mulai berbicara, lalu berikan skor & evaluasi setelah selesai.</li>
            </ol>
          </div>
        )}

        {/* STUDENT SELECTOR FOR TEACHER */}
        <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 block">
                Siswa yang Maju Bicara
              </span>
              <select
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
                className="bg-transparent font-bold text-slate-900 text-sm focus:outline-none cursor-pointer"
              >
                {students.map(s => (
                  <option key={s.id} value={s.name}>
                    {s.name} ({s.rankTitle})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={handlePickRandomStudent}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white text-indigo-700 border border-indigo-200 hover:bg-indigo-50 transition-all shadow-sm"
            title="Pilih Siswa Secara Acak"
          >
            <Dices className="w-3.5 h-3.5 text-indigo-600" />
            <span>Undi Acak</span>
          </button>
        </div>

        {/* Prompt Title & Core Question with High Focus */}
        <div className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug">
            {card.title}
          </h2>

          <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 text-white text-base sm:text-lg font-medium leading-relaxed shadow-sm">
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
          <div className="relative w-36 h-36 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="72"
                cy="72"
                r="62"
                stroke="currentColor"
                strokeWidth="10"
                className="text-slate-100"
                fill="transparent"
              />
              <circle
                cx="72"
                cy="72"
                r="62"
                stroke="currentColor"
                strokeWidth="10"
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
              <span className={`text-3xl font-mono font-black ${
                timeLeft <= 5 ? 'text-rose-600 animate-pulse' : 'text-slate-900'
              }`}>
                {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
              </span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">
                {isRunning ? 'Murid Bicara' : isFinished ? 'Waktu Selesai' : 'Siap Maju'}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            {!isRunning ? (
              <button
                onClick={handleStart}
                className="flex items-center gap-2 px-8 py-3 rounded-2xl font-bold text-sm bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20 transition-all"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>{hasStarted ? 'Lanjutkan Timer' : 'Mulai Timer Murid'}</span>
              </button>
            ) : (
              <button
                onClick={handlePause}
                className="flex items-center gap-2 px-8 py-3 rounded-2xl font-bold text-sm bg-amber-500 hover:bg-amber-600 text-white shadow-md transition-all"
              >
                <Pause className="w-4 h-4" />
                <span>Jeda Timer</span>
              </button>
            )}

            {hasStarted && !isFinished && (
              <button
                onClick={handleFinishEarly}
                className="flex items-center gap-1.5 px-5 py-3 rounded-2xl font-bold text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all"
              >
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Selesai Bicara</span>
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
              <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Kosakata Panduan (Klik untuk Suara Pelafalan):
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {card.vocabularySuggestions.map((vocab, vIdx) => (
              <button
                key={vIdx}
                onClick={() => speechService.speak(vocab, 0.9)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 border border-slate-200/80 text-xs font-semibold text-slate-700 transition-all shadow-sm"
              >
                <span>{vocab}</span>
                <Volume2 className="w-3.5 h-3.5 text-slate-400" />
              </button>
            ))}
          </div>
        </div>

        {/* Sentence Starters */}
        {card.sentenceStarters.length > 0 && (
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1.5">
            <span className="text-xs font-bold text-slate-800 block">Kalimat Pembuka Rekomendasi:</span>
            <div className="space-y-1">
              {card.sentenceStarters.map((starter, sIdx) => (
                <p key={sIdx} className="text-xs text-slate-700 font-medium italic">
                  • "{starter}"
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Hints & Sample Response */}
        <div className="space-y-2">
          {card.hints.length > 0 && (
            <div className="border border-slate-200/80 rounded-2xl overflow-hidden">
              <button
                onClick={() => setShowHints(!showHints)}
                className="w-full flex items-center justify-between p-3 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all"
              >
                <span className="flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-500" /> Tips & Saran Guru untuk Murid
                </span>
                {showHints ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {showHints && (
                <div className="p-3.5 bg-amber-50/40 border-t border-slate-100 text-xs text-slate-700 space-y-1.5">
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
                className="w-full flex items-center justify-between p-3 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all"
              >
                <span className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-indigo-600" /> Contoh Model Jawaban untuk Diskusi Kelas
                </span>
                {showSample ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {showSample && (
                <div className="p-3.5 bg-indigo-50/40 border-t border-slate-100 text-xs text-slate-700 leading-relaxed space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-indigo-900">Model Response:</span>
                    <button
                      onClick={() => speechService.speak(card.sampleResponse || '', 0.95)}
                      className="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800"
                    >
                      <Volume2 className="w-3.5 h-3.5" /> Putar Audio Contoh
                    </button>
                  </div>
                  <p className="italic">"{card.sampleResponse}"</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* TEACHER EVALUATION & SCORING MODAL */}
        {isFinished && (
          <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-5 animate-slide-up">
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900">
                    Form Penilaian Pengajar untuk {selectedStudent}
                  </h3>
                  <p className="text-[11px] text-slate-500">Berikan penilaian langsung untuk sesi berbicara ini</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block font-bold uppercase">Total Skor</span>
                <span className="text-2xl font-black font-mono text-indigo-600">{totalScore}/100</span>
              </div>
            </div>

            {/* Rubric Sliders */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-white rounded-2xl border border-slate-200 space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-700">Fluency</span>
                  <span className="text-indigo-600 font-mono">{fluencyScore}/30</span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="30"
                  value={fluencyScore}
                  onChange={(e) => setFluencyScore(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>

              <div className="p-3 bg-white rounded-2xl border border-slate-200 space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-700">Vocabulary</span>
                  <span className="text-indigo-600 font-mono">{vocabScore}/35</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="35"
                  value={vocabScore}
                  onChange={(e) => setVocabScore(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>

              <div className="p-3 bg-white rounded-2xl border border-slate-200 space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-700">Fulfillment</span>
                  <span className="text-indigo-600 font-mono">{fulfillmentScore}/35</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="35"
                  value={fulfillmentScore}
                  onChange={(e) => setFulfillmentScore(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>
            </div>

            {/* Quick Feedback Tags */}
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-slate-700 block">Pujian & Catatan Cepat:</span>
              <div className="flex flex-wrap gap-2">
                {[
                  'Pelafalan Jelas',
                  'Kosakata Tepat',
                  'Kontak Mata Baik',
                  'Transisi Alami',
                  'Perlu Kurangi Jeda',
                  'Ide Sangat Kreatif'
                ].map(tag => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                      selectedTags.includes(tag)
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Teacher Notes Input */}
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-700 block">Catatan Evaluasi Guru:</span>
              <input
                type="text"
                value={teacherNotes}
                onChange={(e) => setTeacherNotes(e.target.value)}
                placeholder="Tuliskan catatan apresiasi atau evaluasi untuk siswa..."
                className="w-full px-4 py-2.5 rounded-xl text-xs bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Submit Grade Button */}
            <button
              onClick={handleSaveStudentGrade}
              className="w-full py-3.5 rounded-2xl font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Simpan Nilai & Berikan XP ke {selectedStudent}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
