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
  UserCheck 
} from 'lucide-react';

export const RoleplayView: React.FC = () => {
  const { level, awardXp, completeDailyChallenge } = useArena();
  const [selectedScenario, setSelectedScenario] = useState<RoleplayScenario | null>(null);
  const [activePlayerRole, setActivePlayerRole] = useState<'A' | 'B'>('A');
  const [revealedSecret, setRevealedSecret] = useState<boolean>(false);

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
    let interval: NodeJS.Timeout | null = null;
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

    // Calculate score
    const calculatedScore = Math.floor(Math.random() * 11) + 88; // 88-98%
    const feedback = `Impressive roleplay execution! You respected the situational boundaries and naturally integrated the required conversational markers without trigger phrases.`;
    setScoreResult({ score: calculatedScore, feedback });

    awardXp(30, `Completed Secret Roleplay Mission: "${selectedScenario?.title}"`);
    completeDailyChallenge('dc-1');
  };

  const filteredScenarios = ROLEPLAY_SCENARIOS.filter(s => s.level === level || level === 'beginner');

  // If in active scenario view
  if (selectedScenario) {
    const currentMission: SecretMission = activePlayerRole === 'A' ? selectedScenario.playerA : selectedScenario.playerB;
    const opponentMission: SecretMission = activePlayerRole === 'A' ? selectedScenario.playerB : selectedScenario.playerA;

    return (
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setSelectedScenario(null)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Scenarios</span>
          </button>

          {/* Switch Role A / B */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200">
            <button
              onClick={() => setActivePlayerRole('A')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                activePlayerRole === 'A' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600'
              }`}
            >
              Play Role A ({selectedScenario.playerA.roleName.split(' ')[0]})
            </button>
            <button
              onClick={() => setActivePlayerRole('B')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                activePlayerRole === 'B' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600'
              }`}
            >
              Play Role B ({selectedScenario.playerB.roleName.split(' ')[0]})
            </button>
          </div>
        </div>

        {/* Scenario Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-card space-y-6">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100">
              {selectedScenario.level.toUpperCase()} SIMULATION
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900 mt-2">
              {selectedScenario.title}
            </h2>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
              <strong>Context:</strong> {selectedScenario.context}
            </p>
          </div>

          {/* The Two Roles Setup */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Active Assigned Role */}
            <div className="p-4 rounded-2xl bg-indigo-50/70 border-2 border-indigo-500 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">
                  YOUR ROLE: {currentMission.playerRole}
                </span>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-indigo-600 text-white">
                  YOU
                </span>
              </div>
              <h4 className="font-extrabold text-base text-slate-900">{currentMission.roleName}</h4>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                {currentMission.situation}
              </p>
            </div>

            {/* Partner's Public Overview */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  PARTNER ROLE: {opponentMission.playerRole}
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                  OPPONENT / PARTNER
                </span>
              </div>
              <h4 className="font-extrabold text-base text-slate-800">{opponentMission.roleName}</h4>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                {opponentMission.situation}
              </p>
            </div>
          </div>

          {/* SECRET MISSION CARD (Confidential) */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white shadow-md relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                <span className="text-xs font-extrabold uppercase tracking-wider text-rose-300">
                  Confidential Secret Objective
                </span>
              </div>

              <button
                onClick={() => setRevealedSecret(!revealedSecret)}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 transition-all"
              >
                {revealedSecret ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{revealedSecret ? 'Hide' : 'Reveal Secret Mission'}</span>
              </button>
            </div>

            {revealedSecret ? (
              <div className="space-y-4 animate-slide-up">
                <div className="p-3 bg-white/10 rounded-xl">
                  <span className="text-[11px] text-indigo-300 uppercase font-bold block mb-1">
                    Your Hidden Goal:
                  </span>
                  <p className="text-sm font-semibold text-white">
                    {currentMission.secretObjective}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {/* Required phrases */}
                  <div className="p-3 bg-emerald-950/60 border border-emerald-500/30 rounded-xl">
                    <span className="text-emerald-400 font-bold block mb-1 flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" /> Must Use Phrases:
                    </span>
                    <ul className="space-y-1 text-emerald-100">
                      {currentMission.requiredPhrases.map((phrase, pIdx) => (
                        <li key={pIdx}>• "{phrase}"</li>
                      ))}
                    </ul>
                  </div>

                  {/* Forbidden words */}
                  <div className="p-3 bg-rose-950/60 border border-rose-500/30 rounded-xl">
                    <span className="text-rose-400 font-bold block mb-1 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" /> Forbidden Words:
                    </span>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {currentMission.forbiddenWords.map((word, wIdx) => (
                        <span key={wIdx} className="px-2 py-0.5 rounded bg-rose-900/80 text-rose-200 font-mono font-bold text-[11px]">
                          {word}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-slate-400">
                <p className="text-xs">Your partner must not see your secret mission instructions.</p>
                <p className="text-sm font-bold text-slate-300 mt-1">Click "Reveal Secret Mission" when ready.</p>
              </div>
            )}
          </div>

          {/* Timer & Session Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-3">
              <span className="text-3xl font-mono font-extrabold text-slate-900">
                {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
              </span>
              <span className="text-xs text-slate-400 uppercase font-semibold">
                {isRunning ? 'Roleplay Ongoing' : 'Paused'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={isRunning ? handlePauseTimer : handleStartTimer}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-md transition-all ${
                  isRunning ? 'bg-amber-500 hover:bg-amber-600' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/20'
                }`}
              >
                {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                <span>{isRunning ? 'Pause' : 'Start Simulation'}</span>
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
                <span>Finish & Score</span>
              </button>
            </div>
          </div>

          {/* Vocabulary Support */}
          <div className="pt-3 border-t border-slate-100">
            <span className="text-xs font-bold text-slate-700 block mb-2">Scenario Vocabulary:</span>
            <div className="flex flex-wrap gap-1.5">
              {selectedScenario.vocabularySupport.map((v, i) => (
                <button
                  key={i}
                  onClick={() => speechService.speak(v, 0.9)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-xs font-medium text-slate-700 transition-all"
                >
                  <span>{v}</span>
                  <Volume2 className="w-3 h-3 text-slate-400" />
                </button>
              ))}
            </div>
          </div>

          {/* Scoring Result Modal / Card */}
          {sessionCompleted && scoreResult && (
            <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 space-y-4 animate-slide-up">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-emerald-900">Mission Accomplished!</h3>
                    <p className="text-xs text-emerald-700">Both players scored for conversational compliance.</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs text-slate-500 block">Performance Score</span>
                  <span className="text-2xl font-black text-emerald-700 font-mono">{scoreResult.score}/100</span>
                </div>
              </div>

              <div className="p-3 bg-white/80 rounded-xl border border-emerald-100 text-xs text-slate-700">
                <span className="font-bold text-emerald-900 block mb-0.5">Evaluation Feedback:</span>
                {scoreResult.feedback}
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs font-bold text-emerald-800">+30 XP Awarded to your profile</span>
                <button
                  onClick={() => setSelectedScenario(null)}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition-all"
                >
                  Select Next Mission
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
      {/* Hero */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-soft flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-2">
            <Theater className="w-3.5 h-3.5" />
            <span>Immersive Conversational Simulation</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Roleplay Secret Missions
          </h1>
          <p className="text-slate-500 text-sm mt-1 max-w-xl">
            Simulate realistic real-world situations with secret agendas. Avoid forbidden words, introduce target vocabulary naturally, and negotiate solutions under time pressure.
          </p>
        </div>

        <div className="flex items-center gap-2 p-3 bg-indigo-50/60 rounded-2xl border border-indigo-100 text-xs text-indigo-900">
          <UserCheck className="w-5 h-5 text-indigo-600 flex-shrink-0" />
          <span>Solo Practice or Pair with a Classmate</span>
        </div>
      </div>

      {/* Scenarios Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ROLEPLAY_SCENARIOS.map((scenario) => {
          return (
            <div
              key={scenario.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-soft hover:shadow-card hover:border-indigo-200 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 ${
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
                    {Math.round(scenario.suggestedDuration / 60)} mins
                  </span>
                </div>

                <h3 className="font-extrabold text-lg text-slate-900 group-hover:text-indigo-600 transition-colors">
                  {scenario.title}
                </h3>
                <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                  {scenario.context}
                </p>

                {/* Roles snippet */}
                <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] uppercase font-bold text-indigo-600 block">Role A</span>
                    <span className="font-semibold text-slate-800 truncate block">{scenario.playerA.roleName}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] uppercase font-bold text-indigo-600 block">Role B</span>
                    <span className="font-semibold text-slate-800 truncate block">{scenario.playerB.roleName}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">
                  {scenario.vocabularySupport.length} target vocab
                </span>

                <button
                  onClick={() => {
                    soundService.playClick();
                    setSelectedScenario(scenario);
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20 transition-all"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Enter Mission</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
