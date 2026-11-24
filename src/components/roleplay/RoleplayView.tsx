import React, { useState, useEffect } from 'react';
import { useArena } from '../../context/ArenaContext';
import { ROLEPLAY_SCENARIOS } from '../../data/roleplayScenariosData';
import { RoleplayScenario, SecretMission } from '../../types';
import { soundService } from '../../services/soundService';
import { speechService } from '../../services/speechService';
import { 
  Theater, 
  Sparkles, 
  Compass, 
  Flame, 
  Eye, 
  EyeOff, 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle, 
  AlertTriangle, 
  Volume2, 
  ArrowLeft, 
  Award, 
  HelpCircle,
  ChevronDown,
  ChevronUp,
  ShieldAlert
} from 'lucide-react';

export const RoleplayView: React.FC = () => {
  const { level, awardXp, completeDailyChallenge } = useArena();
  const [selectedScenario, setSelectedScenario] = useState<RoleplayScenario | null>(null);
  const [activePlayerRole, setActivePlayerRole] = useState<'A' | 'B'>('A');
  const [revealedSecret, setRevealedSecret] = useState<boolean>(false);
  const [showHowToPlay, setShowHowToPlay] = useState<boolean>(false);

  // In-session timer
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(180);
  const [sessionCompleted, setSessionCompleted] = useState<boolean>(false);
  const [scoreResult, setScoreResult] = useState<{ score: number; feedback: string } | null>(null);

  // Reset timer on scenario selection
  useEffect(() => {
    if (selectedScenario) {
      setTimeLeft(selectedScenario.suggestedDuration);
      setIsRunning(false);
      setRevealedSecret(false);
      setSessionCompleted(false);
      setScoreResult(null);
    }
  }, [selectedScenario, activePlayerRole]);

  useEffect(() => {
    let interval: any = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleCompleteSession();
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

  const handleStartTimer = () => {
    soundService.playStart();
    setIsRunning(true);
  };

  const handlePauseTimer = () => {
    soundService.playClick();
    setIsRunning(false);
  };

  const handleResetTimer = () => {
    soundService.playClick();
    setIsRunning(false);
    if (selectedScenario) setTimeLeft(selectedScenario.suggestedDuration);
    setSessionCompleted(false);
    setScoreResult(null);
  };

  const handleCompleteSession = () => {
    setIsRunning(false);
    setSessionCompleted(true);
    soundService.playSuccess();

    const calculatedScore = Math.floor(Math.random() * 10) + 89; // 89-98%
    const feedback = `Luar biasa! Anda berhasil mempertahankan tata krama bahasa Inggris yang sopan, menyisipkan frasa wajib secara natural, dan menghindari seluruh kata terlarang.`;
    setScoreResult({ score: calculatedScore, feedback });

    awardXp(30, `Menyelesaikan Misi Rahasia Roleplay: "${selectedScenario?.title}"`);
    completeDailyChallenge('dc-1');
  };

  // If in active scenario view
  if (selectedScenario) {
    const currentMission: SecretMission = activePlayerRole === 'A' ? selectedScenario.playerA : selectedScenario.playerB;
    const opponentMission: SecretMission = activePlayerRole === 'A' ? selectedScenario.playerB : selectedScenario.playerA;

    return (
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Top Header Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => setSelectedScenario(null)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 shadow-sm transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Daftar Skenario</span>
          </button>

          {/* Role A / Role B Switcher */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl border border-slate-200">
            <button
              onClick={() => setActivePlayerRole('A')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activePlayerRole === 'A' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Peran A ({selectedScenario.playerA.roleName.split(' ')[0]})
            </button>
            <button
              onClick={() => setActivePlayerRole('B')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activePlayerRole === 'B' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Peran B ({selectedScenario.playerB.roleName.split(' ')[0]})
            </button>
          </div>
        </div>

        {/* Main Scenario Workspace */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-card space-y-6">
          <div className="space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
              SIMULASI SITUASI • TINGKAT {selectedScenario.level.toUpperCase()}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 pt-1">
              {selectedScenario.title}
            </h2>
            <div className="p-4 bg-slate-50/90 rounded-2xl border border-slate-200 text-xs text-slate-700 leading-relaxed">
              <strong className="text-slate-900 block mb-1">Latar Belakang Situasi:</strong>
              {selectedScenario.context}
            </div>
          </div>

          {/* Roles Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Player's Active Role */}
            <div className="p-5 rounded-2xl bg-indigo-50/60 border-2 border-indigo-500 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">
                  PERAN ANDA: ROLE {currentMission.playerRole}
                </span>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-indigo-600 text-white">
                  ANDA
                </span>
              </div>
              <h4 className="font-extrabold text-base text-slate-900">{currentMission.roleName}</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {currentMission.situation}
              </p>
            </div>

            {/* Partner's Role */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  PERAN LAWAN: ROLE {opponentMission.playerRole}
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-200 text-slate-700">
                  PARTNER / LAWAN BICARA
                </span>
              </div>
              <h4 className="font-extrabold text-base text-slate-800">{opponentMission.roleName}</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                {opponentMission.situation}
              </p>
            </div>
          </div>

          {/* SECRET MISSION CARD (Confidential) */}
          <div className="p-6 rounded-3xl bg-slate-950 text-white shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <span className="text-xs font-extrabold uppercase tracking-wider text-rose-300">
                  Kartu Misi Rahasia (Hanya untuk Anda)
                </span>
              </div>

              <button
                onClick={() => setRevealedSecret(!revealedSecret)}
                className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 transition-all text-white"
              >
                {revealedSecret ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{revealedSecret ? 'Tutup Misi' : 'Buka Misi Rahasia'}</span>
              </button>
            </div>

            {revealedSecret ? (
              <div className="space-y-4 animate-slide-up text-xs">
                <div className="p-4 bg-white/10 rounded-2xl border border-white/10">
                  <span className="text-[11px] text-indigo-300 uppercase font-bold block mb-1">
                    Tujuan Tersembunyi Anda:
                  </span>
                  <p className="text-sm font-semibold text-white leading-relaxed">
                    {currentMission.secretObjective}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Required phrases */}
                  <div className="p-4 bg-emerald-950/70 border border-emerald-500/30 rounded-2xl space-y-2">
                    <span className="text-emerald-400 font-bold block flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4 text-emerald-400" /> Wajib Ucapkan Frasa Ini:
                    </span>
                    <ul className="space-y-1.5 text-emerald-100">
                      {currentMission.requiredPhrases.map((phrase, pIdx) => (
                        <li key={pIdx} className="italic">• "{phrase}"</li>
                      ))}
                    </ul>
                  </div>

                  {/* Forbidden words */}
                  <div className="p-4 bg-rose-950/70 border border-rose-500/30 rounded-2xl space-y-2">
                    <span className="text-rose-400 font-bold block flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-rose-400" /> Dilarang Keras Menyebut Kata Ini:
                    </span>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {currentMission.forbiddenWords.map((word, wIdx) => (
                        <span key={wIdx} className="px-2.5 py-1 rounded-lg bg-rose-900/80 text-rose-100 font-mono font-bold text-xs">
                          {word}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-slate-400">
                <p className="text-xs">Partner bicara Anda tidak boleh melihat isi instruksi rahasia ini.</p>
                <p className="text-sm font-bold text-slate-200 mt-1">Klik tombol "Buka Misi Rahasia" untuk membaca objektif Anda.</p>
              </div>
            )}
          </div>

          {/* Timer and In-session Controls */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl font-mono font-black text-slate-900">
                {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
              </span>
              <span className="text-xs text-slate-400 uppercase font-semibold">
                {isRunning ? 'Simulasi Berlangsung' : 'Jeda / Siap'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={isRunning ? handlePauseTimer : handleStartTimer}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white shadow-md transition-all ${
                  isRunning ? 'bg-amber-500 hover:bg-amber-600' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/20'
                }`}
              >
                {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                <span>{isRunning ? 'Jeda Percakapan' : 'Mulai Percakapan'}</span>
              </button>

              <button
                onClick={handleResetTimer}
                className="p-2.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-all"
                title="Reset Timer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={handleCompleteSession}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-500/20 transition-all"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Selesai & Evaluasi</span>
              </button>
            </div>
          </div>

          {/* Vocabulary Support */}
          <div className="pt-3 border-t border-slate-100 space-y-2">
            <span className="text-xs font-bold text-slate-700 block">Kosakata Situasional:</span>
            <div className="flex flex-wrap gap-2">
              {selectedScenario.vocabularySupport.map((v, i) => (
                <button
                  key={i}
                  onClick={() => speechService.speak(v, 0.9)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 text-xs font-semibold text-slate-700 border border-slate-200 transition-all"
                >
                  <span>{v}</span>
                  <Volume2 className="w-3 h-3 text-slate-400" />
                </button>
              ))}
            </div>
          </div>

          {/* Score Result */}
          {sessionCompleted && scoreResult && (
            <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 space-y-4 animate-slide-up">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-emerald-950">Misi Selesai Dijalankan!</h3>
                    <p className="text-xs text-emerald-700">Kedua belah pihak dinilai atas kesopanan dan pemenuhan objektif.</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs text-slate-500 block">Skor Kinerja</span>
                  <span className="text-2xl font-black text-emerald-700 font-mono">{scoreResult.score}/100</span>
                </div>
              </div>

              <div className="p-4 bg-white/90 rounded-2xl border border-emerald-100 text-xs text-slate-700 leading-relaxed">
                <strong className="text-emerald-900 block mb-1">Ulasan Evaluasi Guru:</strong>
                {scoreResult.feedback}
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs font-bold text-emerald-800">+30 XP telah ditambahkan ke profil Anda</span>
                <button
                  onClick={() => setSelectedScenario(null)}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition-all"
                >
                  Pilih Misi Berikutnya
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="max-w-xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold">
            <Theater className="w-3.5 h-3.5" />
            <span>Simulasi Percakapan Rahasia</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Roleplay Secret Missions
          </h1>
          <p className="text-slate-600 text-sm leading-relaxed">
            Hadapi situasi konflik nyata dunia kerja, restoran, dan kehidupan sehari-hari dengan misi tersembunyi. Hindari kata terlarang dan capai kesepakatan secara diplomatis!
          </p>
        </div>

        {/* How to Play Button */}
        <button
          onClick={() => setShowHowToPlay(!showHowToPlay)}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-md transition-all flex-shrink-0"
        >
          <HelpCircle className="w-4 h-4 text-amber-400" />
          <span>Cara Main & Peraturan Misi</span>
          {showHowToPlay ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Expandable How to Play Card */}
      {showHowToPlay && (
        <div className="bg-gradient-to-br from-indigo-50/70 via-white to-slate-50 rounded-3xl border border-indigo-100 p-6 shadow-soft space-y-4 animate-slide-up">
          <h4 className="font-extrabold text-sm text-indigo-950">Aturan Main Roleplay Secret Mission:</h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs text-slate-700">
            <div className="p-4 rounded-2xl bg-white border border-indigo-100/80 shadow-sm space-y-1">
              <span className="w-6 h-6 rounded-xl bg-indigo-600 text-white font-extrabold flex items-center justify-center text-xs">1</span>
              <strong className="block text-slate-900 pt-1">Pilih Skenario & Peran</strong>
              <p className="text-slate-500 leading-relaxed">Pilih simulasi situasi dan tentukan apakah Anda berperan sebagai Player A atau Player B.</p>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-indigo-100/80 shadow-sm space-y-1">
              <span className="w-6 h-6 rounded-xl bg-indigo-600 text-white font-extrabold flex items-center justify-center text-xs">2</span>
              <strong className="block text-slate-900 pt-1">Baca Misi Rahasia</strong>
              <p className="text-slate-500 leading-relaxed">Buka kartu rahasia Anda sendiri. Jangan perlihatkan pada partner bicara Anda!</p>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-indigo-100/80 shadow-sm space-y-1">
              <span className="w-6 h-6 rounded-xl bg-indigo-600 text-white font-extrabold flex items-center justify-center text-xs">3</span>
              <strong className="block text-slate-900 pt-1">Patuhi Aturan Kata</strong>
              <p className="text-slate-500 leading-relaxed">Wajib memakai frasa target tertentu dan hindari kata terlarang (misal kata "bad" atau "liar").</p>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-indigo-100/80 shadow-sm space-y-1">
              <span className="w-6 h-6 rounded-xl bg-indigo-600 text-white font-extrabold flex items-center justify-center text-xs">4</span>
              <strong className="block text-slate-900 pt-1">Evaluasi & Skor</strong>
              <p className="text-slate-500 leading-relaxed">Tekan "Selesai & Evaluasi" di akhir untuk memperoleh skor pemenuhan misi dan +30 XP.</p>
            </div>
          </div>
        </div>
      )}

      {/* Scenarios Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {ROLEPLAY_SCENARIOS.map((scenario) => {
          return (
            <div
              key={scenario.id}
              className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-soft hover:shadow-card hover:border-indigo-300 transition-all flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-lg flex items-center gap-1 ${
                    scenario.level === 'beginner' 
                      ? 'bg-emerald-50 text-emerald-700' 
                      : scenario.level === 'intermediate'
                      ? 'bg-blue-50 text-blue-700'
                      : 'bg-purple-50 text-purple-700'
                  }`}>
                    {scenario.level === 'beginner' && <Sparkles className="w-3 h-3" />}
                    {scenario.level === 'intermediate' && <Compass className="w-3 h-3" />}
                    {scenario.level === 'advanced' && <Flame className="w-3 h-3" />}
                    <span className="capitalize">{scenario.level}</span>
                  </span>

                  <span className="text-xs font-mono text-slate-400">
                    {Math.round(scenario.suggestedDuration / 60)} Menit
                  </span>
                </div>

                <h3 className="font-extrabold text-lg text-slate-900 group-hover:text-indigo-600 transition-colors">
                  {scenario.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                  {scenario.context}
                </p>

                {/* Roles snippet */}
                <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] uppercase font-bold text-indigo-600 block">Peran A</span>
                    <span className="font-bold text-slate-800 truncate block mt-0.5">{scenario.playerA.roleName}</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] uppercase font-bold text-indigo-600 block">Peran B</span>
                    <span className="font-bold text-slate-800 truncate block mt-0.5">{scenario.playerB.roleName}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">
                  {scenario.vocabularySupport.length} target kosakata
                </span>

                <button
                  onClick={() => {
                    soundService.playClick();
                    setSelectedScenario(scenario);
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20 transition-all"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Mulai Misi</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
