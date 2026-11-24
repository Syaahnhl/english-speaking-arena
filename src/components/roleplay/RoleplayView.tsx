import React, { useState, useEffect } from 'react';
import { useArena } from '../../context/ArenaContext';
import { ROLEPLAY_SCENARIOS } from '../../data/roleplayScenariosData';
import { RoleplayScenario, SecretMission } from '../../types';
import { soundService } from '../../services/soundService';
import { speechService } from '../../services/speechService';
import { storageService } from '../../services/storageService';
import { WEEKLY_LEADERBOARD } from '../../data/seedUsersData';
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
  ShieldAlert,
  Users,
  Dices,
  Monitor,
  Send,
  UserCheck
} from 'lucide-react';

export const RoleplayView: React.FC = () => {
  const { addToast } = useArena();
  const students = WEEKLY_LEADERBOARD;
  
  const [selectedScenario, setSelectedScenario] = useState<RoleplayScenario | null>(null);
  const [studentA, setStudentA] = useState<string>(students[0].name);
  const [studentB, setStudentB] = useState<string>(students[1].name);

  // View modes: 'projector' (hides secrets), 'teacher-console' (shows both), 'brief-a', 'brief-b'
  const [displayMode, setDisplayMode] = useState<'projector' | 'teacher-console' | 'brief-a' | 'brief-b'>('teacher-console');
  const [showHowToPlay, setShowHowToPlay] = useState<boolean>(false);

  // In-session timer
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(180);
  const [sessionCompleted, setSessionCompleted] = useState<boolean>(false);

  // Teacher grading states for both students
  const [scoreA, setScoreA] = useState<number>(92);
  const [scoreB, setScoreB] = useState<number>(88);
  const [notesA, setNotesA] = useState<string>('Sangat diplomatis, berhasil mengutarakan keluhan tanpa kata terlarang.');
  const [notesB, setNotesB] = useState<string>('Respon cepat tanggap dan menawarkan solusi alternatif yang ramah.');

  useEffect(() => {
    if (selectedScenario) {
      setTimeLeft(selectedScenario.suggestedDuration);
      setIsRunning(false);
      setSessionCompleted(false);
      setDisplayMode('teacher-console');
    }
  }, [selectedScenario]);

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
  };

  const handleCompleteSession = () => {
    setIsRunning(false);
    setSessionCompleted(true);
    soundService.playSuccess();
  };

  const handlePickRandomPair = () => {
    soundService.playClick();
    const idxA = Math.floor(Math.random() * students.length);
    let idxB = Math.floor(Math.random() * students.length);
    while (idxB === idxA && students.length > 1) {
      idxB = Math.floor(Math.random() * students.length);
    }
    setStudentA(students[idxA].name);
    setStudentB(students[idxB].name);
  };

  const handleSavePairGrades = () => {
    if (!selectedScenario) return;

    // Save student A
    storageService.addSubmission({
      id: `sub-rp-a-${Date.now()}`,
      studentId: `usr-${studentA.toLowerCase().replace(/\s+/g, '-')}`,
      studentName: studentA,
      assignmentTitle: `Roleplay: ${selectedScenario.title} (${selectedScenario.playerA.roleName})`,
      submittedAt: 'Baru saja di kelas',
      durationSeconds: selectedScenario.suggestedDuration - timeLeft,
      transcriptOrNotes: notesA,
      status: 'graded',
      score: scoreA,
      feedback: `Nilai: ${scoreA}/100. ${notesA}`,
      activityType: 'roleplay'
    });

    // Save student B
    storageService.addSubmission({
      id: `sub-rp-b-${Date.now()}`,
      studentId: `usr-${studentB.toLowerCase().replace(/\s+/g, '-')}`,
      studentName: studentB,
      assignmentTitle: `Roleplay: ${selectedScenario.title} (${selectedScenario.playerB.roleName})`,
      submittedAt: 'Baru saja di kelas',
      durationSeconds: selectedScenario.suggestedDuration - timeLeft,
      transcriptOrNotes: notesB,
      status: 'graded',
      score: scoreB,
      feedback: `Nilai: ${scoreB}/100. ${notesB}`,
      activityType: 'roleplay'
    });

    soundService.playSuccess();
    addToast({
      type: 'success',
      title: 'Nilai Pasangan Disimpan!',
      message: `Nilai berhasil direkam untuk ${studentA} (${scoreA}/100) dan ${studentB} (${scoreB}/100).`
    });

    setSelectedScenario(null);
  };

  if (selectedScenario) {
    const missionA: SecretMission = selectedScenario.playerA;
    const missionB: SecretMission = selectedScenario.playerB;

    return (
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Top Header Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => setSelectedScenario(null)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 shadow-sm transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Bank Skenario</span>
          </button>

          {/* Mode Switcher */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-2xl border border-slate-200 text-xs">
            <button
              onClick={() => setDisplayMode('teacher-console')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                displayMode === 'teacher-console' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Konsol Guru (Semua Misi)
            </button>
            <button
              onClick={() => setDisplayMode('projector')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                displayMode === 'projector' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Mode Proyektor (Rahasia Tersembunyi)
            </button>
            <button
              onClick={() => setDisplayMode('brief-a')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                displayMode === 'brief-a' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Briefing {studentA}
            </button>
            <button
              onClick={() => setDisplayMode('brief-b')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                displayMode === 'brief-b' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Briefing {studentB}
            </button>
          </div>
        </div>

        {/* Classroom Pair Selection Toolbar */}
        <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-soft flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4 text-xs">
            {/* Student A Selector */}
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-700 font-black flex items-center justify-center">A</span>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Siswa Peran A ({missionA.roleName})</span>
                <select
                  value={studentA}
                  onChange={(e) => setStudentA(e.target.value)}
                  className="bg-transparent font-bold text-slate-900 text-xs focus:outline-none cursor-pointer"
                >
                  {students.map(s => (
                    <option key={s.id} value={s.name}>{s.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="h-6 w-px bg-slate-200 hidden sm:block" />

            {/* Student B Selector */}
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-purple-100 text-purple-700 font-black flex items-center justify-center">B</span>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Siswa Peran B ({missionB.roleName})</span>
                <select
                  value={studentB}
                  onChange={(e) => setStudentB(e.target.value)}
                  className="bg-transparent font-bold text-slate-900 text-xs focus:outline-none cursor-pointer"
                >
                  {students.map(s => (
                    <option key={s.id} value={s.name}>{s.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <button
            onClick={handlePickRandomPair}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all"
          >
            <Dices className="w-3.5 h-3.5 text-indigo-600" />
            <span>Undi Pasangan Acak</span>
          </button>
        </div>

        {/* Main Scenario Workspace */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-card space-y-6">
          <div className="space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
              SIMULASI SITUASI • TINGKAT {selectedScenario.level.toUpperCase()}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 pt-1">
              {selectedScenario.title}
            </h2>
            <div className="p-4 bg-slate-50/90 rounded-2xl border border-slate-200 text-xs text-slate-700 leading-relaxed">
              <strong className="text-slate-900 block mb-1">Latar Belakang Situasi untuk Kelas:</strong>
              {selectedScenario.context}
            </div>
          </div>

          {/* PROJECTOR VIEW (Public) */}
          {displayMode === 'projector' && (
            <div className="p-8 rounded-3xl bg-slate-900 text-white text-center space-y-6 shadow-xl">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-amber-300 text-xs font-bold">
                <Monitor className="w-4 h-4" />
                <span>Layar Proyektor Kelas • Sesi Berlangsung</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto text-left">
                <div className="p-5 rounded-2xl bg-white/10 border border-white/10 space-y-2">
                  <span className="text-xs uppercase font-extrabold text-indigo-300">Peran A ({studentA})</span>
                  <h4 className="text-lg font-black text-white">{missionA.roleName}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">{missionA.situation}</p>
                </div>

                <div className="p-5 rounded-2xl bg-white/10 border border-white/10 space-y-2">
                  <span className="text-xs uppercase font-extrabold text-purple-300">Peran B ({studentB})</span>
                  <h4 className="text-lg font-black text-white">{missionB.roleName}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">{missionB.situation}</p>
                </div>
              </div>

              <div className="p-4 bg-amber-400/10 border border-amber-400/20 rounded-2xl max-w-md mx-auto text-xs text-amber-200">
                Misi rahasia disembunyikan agar audiens kelas dapat menebak tujuan masing-masing!
              </div>
            </div>
          )}

          {/* TEACHER CONSOLE VIEW (Shows both secret missions) */}
          {displayMode === 'teacher-console' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-indigo-600" />
                  <span>Konsol Rahasia Pengajar (Kedua Misi Siswa)</span>
                </h4>
                <span className="text-xs text-slate-400">Guru memantau pemenuhan misi dan kata terlarang</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Mission A */}
                <div className="p-5 rounded-3xl bg-slate-950 text-white space-y-4 border border-indigo-900/50 shadow-md">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-xs font-black uppercase text-indigo-400">Peran A: {studentA}</span>
                    <span className="text-[11px] font-semibold text-slate-400">{missionA.roleName}</span>
                  </div>

                  <div className="text-xs space-y-1">
                    <span className="text-indigo-300 uppercase font-bold text-[10px]">Tujuan Rahasia:</span>
                    <p className="text-slate-200 font-medium leading-relaxed">{missionA.secretObjective}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/20 text-xs space-y-1">
                    <span className="text-emerald-400 font-bold text-[10px] uppercase block">Frasa Wajib:</span>
                    {missionA.requiredPhrases.map((p, i) => (
                      <p key={i} className="text-emerald-200 italic">• "{p}"</p>
                    ))}
                  </div>

                  <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/20 text-xs space-y-1">
                    <span className="text-rose-400 font-bold text-[10px] uppercase block">Dilarang Ucapkan:</span>
                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                      {missionA.forbiddenWords.map((w, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-rose-900 text-rose-100 font-mono text-[11px] font-bold">
                          {w}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Mission B */}
                <div className="p-5 rounded-3xl bg-slate-950 text-white space-y-4 border border-purple-900/50 shadow-md">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-xs font-black uppercase text-purple-400">Peran B: {studentB}</span>
                    <span className="text-[11px] font-semibold text-slate-400">{missionB.roleName}</span>
                  </div>

                  <div className="text-xs space-y-1">
                    <span className="text-purple-300 uppercase font-bold text-[10px]">Tujuan Rahasia:</span>
                    <p className="text-slate-200 font-medium leading-relaxed">{missionB.secretObjective}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/20 text-xs space-y-1">
                    <span className="text-emerald-400 font-bold text-[10px] uppercase block">Frasa Wajib:</span>
                    {missionB.requiredPhrases.map((p, i) => (
                      <p key={i} className="text-emerald-200 italic">• "{p}"</p>
                    ))}
                  </div>

                  <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/20 text-xs space-y-1">
                    <span className="text-rose-400 font-bold text-[10px] uppercase block">Dilarang Ucapkan:</span>
                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                      {missionB.forbiddenWords.map((w, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-rose-900 text-rose-100 font-mono text-[11px] font-bold">
                          {w}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* BRIEFING A OR B VIEW */}
          {(displayMode === 'brief-a' || displayMode === 'brief-b') && (
            <div className="p-6 rounded-3xl bg-slate-950 text-white space-y-4 animate-slide-up">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-bold uppercase text-amber-300">
                  Kartu Briefing Pribadi: {displayMode === 'brief-a' ? studentA : studentB}
                </span>
                <span className="text-xs text-slate-400">Partner dilarang melihat kartu ini</span>
              </div>

              {(() => {
                const cur = displayMode === 'brief-a' ? missionA : missionB;
                return (
                  <div className="space-y-4 text-xs">
                    <div className="p-4 bg-white/10 rounded-2xl">
                      <span className="text-indigo-300 font-bold uppercase text-[10px] block mb-1">Objektif Rahasia:</span>
                      <p className="text-sm font-semibold text-white leading-relaxed">{cur.secretObjective}</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-4 bg-emerald-950/70 border border-emerald-500/30 rounded-2xl space-y-1.5">
                        <span className="text-emerald-400 font-bold text-xs flex items-center gap-1.5">
                          <CheckCircle className="w-4 h-4" /> Wajib Ucapkan Frasa Ini:
                        </span>
                        <ul className="space-y-1 text-emerald-100">
                          {cur.requiredPhrases.map((phrase, pIdx) => (
                            <li key={pIdx} className="italic">• "{phrase}"</li>
                          ))}
                        </ul>
                      </div>

                      <div className="p-4 bg-rose-950/70 border border-rose-500/30 rounded-2xl space-y-1.5">
                        <span className="text-rose-400 font-bold text-xs flex items-center gap-1.5">
                          <AlertTriangle className="w-4 h-4" /> Dilarang Menyebut Kata:
                        </span>
                        <div className="flex flex-wrap gap-2 pt-1">
                          {cur.forbiddenWords.map((word, wIdx) => (
                            <span key={wIdx} className="px-2.5 py-1 rounded-lg bg-rose-900/80 text-rose-100 font-mono font-bold text-xs">
                              {word}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* Timer and In-session Controls */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl font-mono font-black text-slate-900">
                {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
              </span>
              <span className="text-xs text-slate-400 uppercase font-semibold">
                {isRunning ? 'Roleplay Berlangsung' : 'Jeda / Siap Dimulai'}
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
                <span>{isRunning ? 'Jeda Simulasi' : 'Mulai Simulasi Kelas'}</span>
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
                <span>Selesai & Nilai Siswa</span>
              </button>
            </div>
          </div>

          {/* Situational Vocabulary Support */}
          <div className="pt-3 border-t border-slate-100 space-y-2">
            <span className="text-xs font-bold text-slate-700 block">Kosakata Situasional Pendukung (Klik untuk Audio):</span>
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

          {/* TEACHER EVALUATION & GRADING FORM FOR PAIR */}
          {sessionCompleted && (
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-6 animate-slide-up">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-indigo-600" />
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900">
                      Evaluasi & Penilaian Pengajar untuk Kedua Siswa
                    </h3>
                    <p className="text-[11px] text-slate-500">Berikan penilaian terhadap kesopanan, pencapaian objektif, dan pencegahan kata terlarang</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Grade for Student A */}
                <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-xs text-indigo-700 uppercase">
                      Nilai {studentA} (Peran A)
                    </span>
                    <span className="text-xl font-black font-mono text-indigo-600">{scoreA}/100</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="100"
                    value={scoreA}
                    onChange={(e) => setScoreA(Number(e.target.value))}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={notesA}
                    onChange={(e) => setNotesA(e.target.value)}
                    placeholder="Catatan untuk Siswa A..."
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:outline-none"
                  />
                </div>

                {/* Grade for Student B */}
                <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-xs text-purple-700 uppercase">
                      Nilai {studentB} (Peran B)
                    </span>
                    <span className="text-xl font-black font-mono text-purple-600">{scoreB}/100</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="100"
                    value={scoreB}
                    onChange={(e) => setScoreB(Number(e.target.value))}
                    className="w-full accent-purple-600 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={notesB}
                    onChange={(e) => setNotesB(e.target.value)}
                    placeholder="Catatan untuk Siswa B..."
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:outline-none"
                  />
                </div>
              </div>

              <button
                onClick={handleSavePairGrades}
                className="w-full py-3.5 rounded-2xl font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Simpan Nilai & Berikan XP untuk {studentA} & {studentB}</span>
              </button>
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
            <span>Teacher Roleplay Lab</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Fasilitasi Roleplay Misi Rahasia
          </h1>
          <p className="text-slate-600 text-sm leading-relaxed">
            Bagi murid ke dalam pasangan (Peran A & Peran B). Setiap murid menerima misi tersembunyi dengan frasa wajib dan kata terlarang untuk memicu respon diplomatis nyata.
          </p>
        </div>

        {/* How to Play Button */}
        <button
          onClick={() => setShowHowToPlay(!showHowToPlay)}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-md transition-all flex-shrink-0"
        >
          <HelpCircle className="w-4 h-4 text-amber-400" />
          <span>Panduan Fasilitasi Kelas</span>
          {showHowToPlay ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Expandable How to Play Card */}
      {showHowToPlay && (
        <div className="bg-gradient-to-br from-indigo-50/70 via-white to-slate-50 rounded-3xl border border-indigo-100 p-6 shadow-soft space-y-4 animate-slide-up">
          <h4 className="font-extrabold text-sm text-indigo-950">Langkah Menjalankan Roleplay Secret Mission di Kelas:</h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs text-slate-700">
            <div className="p-4 rounded-2xl bg-white border border-indigo-100/80 shadow-sm space-y-1">
              <span className="w-6 h-6 rounded-xl bg-indigo-600 text-white font-extrabold flex items-center justify-center text-xs">1</span>
              <strong className="block text-slate-900 pt-1">Bagi Pasangan Siswa</strong>
              <p className="text-slate-500 leading-relaxed">Pilih dua siswa dari kelas Anda (Peran A dan Peran B) atau gunakan fitur undi acak.</p>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-indigo-100/80 shadow-sm space-y-1">
              <span className="w-6 h-6 rounded-xl bg-indigo-600 text-white font-extrabold flex items-center justify-center text-xs">2</span>
              <strong className="block text-slate-900 pt-1">Briefing Misi Terpisah</strong>
              <p className="text-slate-500 leading-relaxed">Buka tab Briefing A untuk Siswa A, lalu Briefing B untuk Siswa B tanpa saling membocorkan.</p>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-indigo-100/80 shadow-sm space-y-1">
              <span className="w-6 h-6 rounded-xl bg-indigo-600 text-white font-extrabold flex items-center justify-center text-xs">3</span>
              <strong className="block text-slate-900 pt-1">Tampilkan ke Proyektor</strong>
              <p className="text-slate-500 leading-relaxed">Gunakan Mode Proyektor agar audiens kelas hanya melihat skenario latar tanpa tahu rahasianya.</p>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-indigo-100/80 shadow-sm space-y-1">
              <span className="w-6 h-6 rounded-xl bg-indigo-600 text-white font-extrabold flex items-center justify-center text-xs">4</span>
              <strong className="block text-slate-900 pt-1">Evaluasi Kedua Siswa</strong>
              <p className="text-slate-500 leading-relaxed">Catat nilai skor dan feedback langsung ke buku nilai murid setelah simulasi usai.</p>
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
                    <span className="text-[10px] uppercase font-bold text-purple-600 block">Peran B</span>
                    <span className="font-bold text-slate-800 truncate block mt-0.5">{scenario.playerB.roleName}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">
                  {scenario.vocabularySupport.length} kosakata pendukung
                </span>

                <button
                  onClick={() => {
                    soundService.playClick();
                    setSelectedScenario(scenario);
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20 transition-all"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Fasilitasi Sesi Ini</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
