import React, { useState } from 'react';
import { useArena } from '../../context/ArenaContext';
import { HEAD_TO_HEAD_BATTLES } from '../../data/seedUsersData';
import { LeaderboardUser, HeadToHeadBattle } from '../../types';
import { soundService } from '../../services/soundService';
import { storageService } from '../../services/storageService';
import { 
  Trophy, 
  Flame, 
  Swords, 
  Calendar, 
  Award, 
  Sparkles, 
  Crown, 
  Play, 
  Pause,
  RotateCcw,
  CheckCircle, 
  Users, 
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Shield,
  Target,
  Dices,
  Send,
  UserCheck
} from 'lucide-react';

export const SpeakingArenaView: React.FC = () => {
  const { addToast, activeClassStudents, activeClassId, setActiveTab } = useArena();
  const [activeBoard, setActiveBoard] = useState<'weekly' | 'monthly' | 'all-time'>('weekly');
  const [selectedBattle, setSelectedBattle] = useState<HeadToHeadBattle | null>(null);
  const [showHowToPlay, setShowHowToPlay] = useState<boolean>(false);

  const students = activeClassStudents;
  const [player1, setPlayer1] = useState<string>(students[0]?.name || 'Siswa 1');
  const [player2, setPlayer2] = useState<string>(students[1]?.name || 'Siswa 2');

  // Battle session states
  const [activeTurn, setActiveTurn] = useState<1 | 2>(1);
  const [battleRunning, setBattleRunning] = useState<boolean>(false);
  const [battleTimeLeft, setBattleTimeLeft] = useState<number>(60);
  const [turn1Finished, setTurn1Finished] = useState<boolean>(false);
  const [battleFinished, setBattleFinished] = useState<boolean>(false);

  // Teacher Rubric Scoring for the Battle
  const [scoreP1, setScoreP1] = useState({ completion: 24, vocab: 23, fluency: 22, fulfillment: 23 });
  const [scoreP2, setScoreP2] = useState({ completion: 23, vocab: 24, fluency: 23, fulfillment: 24 });
  const [declaredWinner, setDeclaredWinner] = useState<string | null>(null);

  const totalP1 = scoreP1.completion + scoreP1.vocab + scoreP1.fluency + scoreP1.fulfillment;
  const totalP2 = scoreP2.completion + scoreP2.vocab + scoreP2.fluency + scoreP2.fulfillment;

  const currentList = storageService.getClassLeaderboard(activeClassId);

  // Head to head timer
  React.useEffect(() => {
    let timer: any = null;
    if (battleRunning && battleTimeLeft > 0) {
      timer = setInterval(() => {
        setBattleTimeLeft(prev => {
          if (prev <= 1) {
            handleTurnTimesUp();
            return 0;
          }
          if (prev <= 4) soundService.playTick();
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [battleRunning, battleTimeLeft]);

  const handleStartBattleModal = (battle: HeadToHeadBattle) => {
    setSelectedBattle(battle);
    setBattleTimeLeft(battle.timeLimit);
    setBattleRunning(false);
    setActiveTurn(1);
    setTurn1Finished(false);
    setBattleFinished(false);
    setDeclaredWinner(null);
  };

  const handleTurnTimesUp = () => {
    setBattleRunning(false);
    soundService.playTimesUp();
    if (activeTurn === 1) {
      setTurn1Finished(true);
      setActiveTurn(2);
      if (selectedBattle) setBattleTimeLeft(selectedBattle.timeLimit);
    } else {
      setBattleFinished(true);
      soundService.playSuccess();
    }
  };

  const handleFinishTurnEarly = () => {
    handleTurnTimesUp();
  };

  const handlePickRandomPair = () => {
    soundService.playClick();
    const idx1 = Math.floor(Math.random() * students.length);
    let idx2 = Math.floor(Math.random() * students.length);
    while (idx2 === idx1 && students.length > 1) {
      idx2 = Math.floor(Math.random() * students.length);
    }
    setPlayer1(students[idx1].name);
    setPlayer2(students[idx2].name);
  };

  const handleSaveBattleResult = () => {
    if (!selectedBattle) return;
    const winnerName = totalP1 >= totalP2 ? player1 : player2;

    storageService.addSubmission({
      id: `sub-battle-${Date.now()}`,
      studentId: `usr-${winnerName.toLowerCase().replace(/\s+/g, '-')}`,
      studentName: winnerName,
      assignmentTitle: `Pemenang Duel 1v1: ${selectedBattle.title}`,
      submittedAt: 'Baru saja di kelas',
      durationSeconds: selectedBattle.timeLimit,
      transcriptOrNotes: `Duel vs ${winnerName === player1 ? player2 : player1}. Skor Akhir: ${player1} (${totalP1}/100) vs ${player2} (${totalP2}/100).`,
      status: 'graded',
      score: Math.max(totalP1, totalP2),
      feedback: `Selamat atas kemenangan duel argumen di depan kelas!`,
      activityType: 'debate'
    });

    soundService.playSuccess();
    addToast({
      type: 'success',
      title: 'Hasil Duel Disimpan!',
      message: `Pemenang: ${winnerName} dengan skor ${Math.max(totalP1, totalP2)}/100 (+40 XP).`
    });

    setSelectedBattle(null);
  };

  return (
    <div className="space-y-6">
      {/* Tournament Card / Arena Header */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 text-white p-6 sm:p-8 shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="max-w-2xl relative z-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-400/20">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>Teacher Arena & Classroom Battles</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Arena Duel & Turnamen Murid
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Fasilitasi duel bicara 1v1 antar siswa di depan kelas atau secara daring! Tentukan topik, jalankan timer duel, dan catat pemenang ke papan peringkat kelas.
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-300">
            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>Sesi Mingguan Aktif</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
              <Users className="w-4 h-4 text-amber-400" />
              <span>18 Siswa di Kelas Ini</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
              <Crown className="w-4 h-4 text-amber-400" />
              <span>Hadiah: +40 XP & Badge Kelas</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowHowToPlay(!showHowToPlay)}
          className="relative z-10 flex items-center gap-2 px-5 py-3 rounded-2xl bg-white text-slate-900 text-xs font-bold shadow-lg hover:bg-slate-100 transition-all flex-shrink-0"
        >
          <HelpCircle className="w-4 h-4 text-indigo-600" />
          <span>Panduan Duel & Rubrik</span>
          {showHowToPlay ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Expandable How To Play */}
      {showHowToPlay && (
        <div className="bg-gradient-to-br from-indigo-50/70 via-white to-slate-50 rounded-3xl border border-indigo-100 p-6 shadow-soft space-y-4 animate-slide-up text-xs text-slate-700">
          <h4 className="font-extrabold text-sm text-slate-900">Mekanisme Duel 1v1 di Depan Kelas:</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-white border border-indigo-100 shadow-sm space-y-1">
              <span className="w-6 h-6 rounded-xl bg-indigo-600 text-white font-extrabold flex items-center justify-center text-xs">1</span>
              <strong className="block text-slate-900 pt-1">Pilih Dua Siswa & Topik</strong>
              <p className="text-slate-500 leading-relaxed">Tentukan Siswa 1 dan Siswa 2. Keduanya diberikan tantangan topik dan durasi yang sama persis.</p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-indigo-100 shadow-sm space-y-1">
              <span className="w-6 h-6 rounded-xl bg-indigo-600 text-white font-extrabold flex items-center justify-center text-xs">2</span>
              <strong className="block text-slate-900 pt-1">Giliran Bergantian (Turn-Based)</strong>
              <p className="text-slate-500 leading-relaxed">Siswa 1 berbicara hingga timer selesai, lalu giliran Siswa 2 menyampaikan sanggahan atau argumennya.</p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-indigo-100 shadow-sm space-y-1">
              <span className="w-6 h-6 rounded-xl bg-indigo-600 text-white font-extrabold flex items-center justify-center text-xs">3</span>
              <strong className="block text-slate-900 pt-1">Rubrik Penilaian 4 Aspek</strong>
              <p className="text-slate-500 leading-relaxed">Guru menilai: Ketuntasan (25%), Kosakata (25%), Kelancaran (25%), dan Pemenuhan Misi (25%).</p>
            </div>
          </div>
        </div>
      )}

      {/* Head to Head Challenge Section */}
      <section className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-soft space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Swords className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-extrabold text-slate-900">Pilih Arena Duel Topik</h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Pilih salah satu arena duel untuk menandingkan dua murid dalam kelas pada topik yang sama.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {HEAD_TO_HEAD_BATTLES.map((battle) => (
            <div
              key={battle.id}
              className="p-6 rounded-3xl bg-slate-50/80 border border-slate-200 hover:border-indigo-300 hover:bg-white hover:shadow-card transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded bg-indigo-100 text-indigo-700">
                    {battle.category}
                  </span>
                  <span className="text-xs font-mono text-slate-500 font-semibold">
                    {Math.floor(battle.timeLimit / 60)}:{(battle.timeLimit % 60).toString().padStart(2, '0')} Menit / Siswa
                  </span>
                </div>

                <h3 className="font-extrabold text-sm text-slate-900">{battle.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed italic bg-white p-3 rounded-2xl border border-slate-100">
                  "{battle.prompt}"
                </p>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                  <span>Format: <strong>1v1 Turn-Based</strong></span>
                  <span className="capitalize font-semibold text-indigo-600">{battle.level}</span>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-200/70 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-mono font-semibold">
                  Batas: {Math.floor(battle.timeLimit / 60)}:{(battle.timeLimit % 60).toString().padStart(2, '0')} Menit
                </span>
                <button
                  onClick={() => handleStartBattleModal(battle)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-all"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Tandingkan Siswa</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Active Battle Modal for Classroom */}
      {selectedBattle && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-float border border-slate-200 animate-slide-up space-y-6 my-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-extrabold uppercase text-indigo-600">
                Panggung Duel Kelas: {selectedBattle.title}
              </span>
              <button
                onClick={() => setSelectedBattle(null)}
                className="text-slate-400 hover:text-slate-700 text-xs font-bold px-2 py-1"
              >
                Tutup
              </button>
            </div>

            {/* Student Pair Picker Toolbar */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-indigo-600 text-white font-bold flex items-center justify-center text-[10px]">1</span>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Siswa 1</span>
                    {students.length > 0 ? (
                      <select
                        value={player1}
                        onChange={(e) => setPlayer1(e.target.value)}
                        className="bg-transparent font-bold text-slate-900 focus:outline-none cursor-pointer"
                      >
                        {students.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                      </select>
                    ) : (
                      <input
                        type="text"
                        value={player1}
                        onChange={(e) => setPlayer1(e.target.value)}
                        placeholder="Nama Siswa 1..."
                        className="bg-transparent font-bold text-slate-900 focus:outline-none border-b border-indigo-200"
                      />
                    )}
                  </div>
                </div>

                <span className="text-slate-400 font-bold">VS</span>

                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-purple-600 text-white font-bold flex items-center justify-center text-[10px]">2</span>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Siswa 2</span>
                    {students.length > 0 ? (
                      <select
                        value={player2}
                        onChange={(e) => setPlayer2(e.target.value)}
                        className="bg-transparent font-bold text-slate-900 focus:outline-none cursor-pointer"
                      >
                        {students.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                      </select>
                    ) : (
                      <input
                        type="text"
                        value={player2}
                        onChange={(e) => setPlayer2(e.target.value)}
                        placeholder="Nama Siswa 2..."
                        className="bg-transparent font-bold text-slate-900 focus:outline-none border-b border-purple-200"
                      />
                    )}
                  </div>
                </div>
              </div>

              {students.length > 1 && (
                <button
                  onClick={handlePickRandomPair}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold hover:bg-slate-50"
                >
                  <Dices className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Undi Pasangan</span>
                </button>
              )}
            </div>

            {/* Prompt Box */}
            <div className="p-5 rounded-2xl bg-slate-900 text-white text-center space-y-1">
              <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">Topik Adu Argumen</span>
              <p className="text-base sm:text-lg font-medium leading-relaxed">
                "{selectedBattle.prompt}"
              </p>
            </div>

            {/* Turn Comparison Display */}
            <div className="grid grid-cols-2 gap-4">
              {/* Player 1 */}
              <div className={`p-5 rounded-2xl text-center space-y-2 border-2 transition-all ${
                activeTurn === 1 && battleRunning
                  ? 'bg-indigo-50/80 border-indigo-600 shadow-md ring-2 ring-indigo-400/20'
                  : 'bg-slate-50 border-slate-200'
              }`}>
                <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                  Giliran 1: {player1}
                </span>
                <div className="text-3xl font-mono font-black text-slate-900 pt-1">
                  {activeTurn === 1 ? (
                    `${Math.floor(battleTimeLeft / 60)}:${(battleTimeLeft % 60).toString().padStart(2, '0')}`
                  ) : turn1Finished ? (
                    <span className="text-emerald-600 text-lg font-bold flex items-center justify-center gap-1">
                      <CheckCircle className="w-4 h-4" /> Selesai
                    </span>
                  ) : (
                    `${Math.floor(selectedBattle.timeLimit / 60)}:${(selectedBattle.timeLimit % 60).toString().padStart(2, '0')}`
                  )}
                </div>
                <span className="text-[11px] text-slate-500 block">
                  {activeTurn === 1 && battleRunning ? 'Sedang Berbicara' : 'Menunggu Giliran'}
                </span>
              </div>

              {/* Player 2 */}
              <div className={`p-5 rounded-2xl text-center space-y-2 border-2 transition-all ${
                activeTurn === 2 && battleRunning
                  ? 'bg-purple-50/80 border-purple-600 shadow-md ring-2 ring-purple-400/20'
                  : 'bg-slate-50 border-slate-200'
              }`}>
                <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-700">
                  Giliran 2: {player2}
                </span>
                <div className="text-3xl font-mono font-black text-slate-900 pt-1">
                  {activeTurn === 2 ? (
                    `${Math.floor(battleTimeLeft / 60)}:${(battleTimeLeft % 60).toString().padStart(2, '0')}`
                  ) : battleFinished ? (
                    <span className="text-emerald-600 text-lg font-bold flex items-center justify-center gap-1">
                      <CheckCircle className="w-4 h-4" /> Selesai
                    </span>
                  ) : (
                    `${Math.floor(selectedBattle.timeLimit / 60)}:${(selectedBattle.timeLimit % 60).toString().padStart(2, '0')}`
                  )}
                </div>
                <span className="text-[11px] text-slate-500 block">
                  {activeTurn === 2 && battleRunning ? 'Sedang Berbicara' : 'Menunggu Giliran'}
                </span>
              </div>
            </div>

            {/* Controls */}
            {!battleFinished ? (
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={() => {
                    if (!battleRunning) soundService.playStart();
                    setBattleRunning(!battleRunning);
                  }}
                  className="px-8 py-3 rounded-2xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition-all flex items-center gap-2"
                >
                  {battleRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                  <span>{battleRunning ? 'Jeda Timer' : `Mulai Giliran Bicara: ${activeTurn === 1 ? player1 : player2}`}</span>
                </button>

                {battleRunning && (
                  <button
                    onClick={handleFinishTurnEarly}
                    className="px-5 py-3 rounded-2xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all"
                  >
                    Selesai Lebih Awal
                  </button>
                )}
              </div>
            ) : (
              /* TEACHER RUBRIC EVALUATION AFTER BOTH SPOKE */
              <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-5 animate-slide-up">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-500" />
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-900">Rubrik Penilaian Pengajar 4 Aspek</h4>
                      <p className="text-[11px] text-slate-500">Bandingkan argumen kedua murid dan tentukan pemenang duel</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400 block font-bold">Skor Akhir:</span>
                    <span className="font-mono font-black text-sm text-slate-900">
                      {player1} ({totalP1}) vs {player2} ({totalP2})
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  {/* Player 1 Rubric */}
                  <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-3">
                    <span className="font-bold text-indigo-700 block uppercase">Penilaian {player1}</span>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Completion (Ketuntasan):</span>
                        <input
                          type="number"
                          min="10"
                          max="25"
                          value={scoreP1.completion}
                          onChange={(e) => setScoreP1({ ...scoreP1, completion: Number(e.target.value) })}
                          className="w-14 px-2 py-0.5 border rounded text-right font-mono"
                        />
                      </div>
                      <div className="flex justify-between">
                        <span>Vocab Usage (Kosakata):</span>
                        <input
                          type="number"
                          min="10"
                          max="25"
                          value={scoreP1.vocab}
                          onChange={(e) => setScoreP1({ ...scoreP1, vocab: Number(e.target.value) })}
                          className="w-14 px-2 py-0.5 border rounded text-right font-mono"
                        />
                      </div>
                      <div className="flex justify-between">
                        <span>Fluency (Kelancaran):</span>
                        <input
                          type="number"
                          min="10"
                          max="25"
                          value={scoreP1.fluency}
                          onChange={(e) => setScoreP1({ ...scoreP1, fluency: Number(e.target.value) })}
                          className="w-14 px-2 py-0.5 border rounded text-right font-mono"
                        />
                      </div>
                      <div className="flex justify-between">
                        <span>Task Fulfillment (Isi):</span>
                        <input
                          type="number"
                          min="10"
                          max="25"
                          value={scoreP1.fulfillment}
                          onChange={(e) => setScoreP1({ ...scoreP1, fulfillment: Number(e.target.value) })}
                          className="w-14 px-2 py-0.5 border rounded text-right font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Player 2 Rubric */}
                  <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-3">
                    <span className="font-bold text-purple-700 block uppercase">Penilaian {player2}</span>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Completion (Ketuntasan):</span>
                        <input
                          type="number"
                          min="10"
                          max="25"
                          value={scoreP2.completion}
                          onChange={(e) => setScoreP2({ ...scoreP2, completion: Number(e.target.value) })}
                          className="w-14 px-2 py-0.5 border rounded text-right font-mono"
                        />
                      </div>
                      <div className="flex justify-between">
                        <span>Vocab Usage (Kosakata):</span>
                        <input
                          type="number"
                          min="10"
                          max="25"
                          value={scoreP2.vocab}
                          onChange={(e) => setScoreP2({ ...scoreP2, vocab: Number(e.target.value) })}
                          className="w-14 px-2 py-0.5 border rounded text-right font-mono"
                        />
                      </div>
                      <div className="flex justify-between">
                        <span>Fluency (Kelancaran):</span>
                        <input
                          type="number"
                          min="10"
                          max="25"
                          value={scoreP2.fluency}
                          onChange={(e) => setScoreP2({ ...scoreP2, fluency: Number(e.target.value) })}
                          className="w-14 px-2 py-0.5 border rounded text-right font-mono"
                        />
                      </div>
                      <div className="flex justify-between">
                        <span>Task Fulfillment (Isi):</span>
                        <input
                          type="number"
                          min="10"
                          max="25"
                          value={scoreP2.fulfillment}
                          onChange={(e) => setScoreP2({ ...scoreP2, fulfillment: Number(e.target.value) })}
                          className="w-14 px-2 py-0.5 border rounded text-right font-mono"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleSaveBattleResult}
                  className="w-full py-3.5 rounded-2xl font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>
                    Umumkan Pemenang: {totalP1 >= totalP2 ? player1 : player2} & Simpan Nilai (+40 XP)
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Leaderboard */}
      <section className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-soft space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              Papan Peringkat Murid Kelas
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Pantau kemajuan mingguan, akumulasi XP, dan konsistensi seluruh siswa di kelas Anda.
            </p>
          </div>

          <div className="flex items-center p-1 bg-slate-100 rounded-2xl border border-slate-200">
            {(['weekly', 'monthly', 'all-time'] as const).map((period) => (
              <button
                key={period}
                onClick={() => {
                  setActiveBoard(period);
                  soundService.playClick();
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                  activeBoard === period
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {period === 'weekly' ? 'Mingguan' : period === 'monthly' ? 'Bulanan' : 'Sepanjang Masa'}
              </button>
            ))}
          </div>
        </div>

        {/* Leaderboard Table / Clean Empty State */}
        {currentList.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-3 bg-slate-50/50 rounded-2xl border border-slate-100">
            <Trophy className="w-10 h-10 mx-auto text-slate-300" />
            <p className="text-sm font-bold text-slate-700">Belum ada siswa terdaftar di kelas ini.</p>
            <p className="text-xs max-w-md mx-auto text-slate-500">
              Papan peringkat akan otomatis menampilkan nama, rank, dan akumulasi poin XP setelah Anda menambahkan nama siswa di menu Profil Guru & Kelas.
            </p>
            <button
              onClick={() => setActiveTab('progress')}
              className="mt-2 inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-all"
            >
              <Users className="w-4 h-4" />
              <span>Input Siswa ke Kelas Ini</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Peringkat</th>
                  <th className="py-3 px-4">Nama Siswa</th>
                  <th className="py-3 px-4">Tingkat Kemampuan</th>
                  <th className="py-3 px-4">Jenjang Gelar</th>
                  <th className="py-3 px-4 text-center">Tantangan</th>
                  <th className="py-3 px-4 text-center">Streak</th>
                  <th className="py-3 px-4 text-right">Total XP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {currentList.map((st, index) => {
                  const rankNum = index + 1;
                  return (
                    <tr
                      key={st.id}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      <td className="py-4 px-4 font-black text-sm">
                        {rankNum === 1 && <span className="inline-flex items-center justify-center w-7 h-7 rounded-xl bg-amber-400 text-slate-900 shadow-sm font-black">1</span>}
                        {rankNum === 2 && <span className="inline-flex items-center justify-center w-7 h-7 rounded-xl bg-slate-300 text-slate-900 shadow-sm font-black">2</span>}
                        {rankNum === 3 && <span className="inline-flex items-center justify-center w-7 h-7 rounded-xl bg-amber-600 text-white shadow-sm font-black">3</span>}
                        {rankNum > 3 && <span className="text-slate-400 pl-2">#{rankNum}</span>}
                      </td>

                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={st.avatar}
                            alt={st.name}
                            className="w-9 h-9 rounded-full object-cover border border-slate-200"
                          />
                          <div>
                            <div className="flex items-center gap-1.5">
                              <strong className="text-slate-900 font-bold">{st.name}</strong>
                              {st.categoryPill && (
                                <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-indigo-50 text-indigo-700">
                                  {st.categoryPill}
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-slate-400 font-mono">@{st.username}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4 capitalize font-semibold text-slate-600">
                        {st.level}
                      </td>

                      <td className="py-4 px-4">
                        <span className="inline-flex items-center gap-1 font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-xl">
                          <Award className="w-3.5 h-3.5 text-indigo-500" />
                          {st.rankTitle}
                        </span>
                      </td>

                      <td className="py-4 px-4 text-center font-mono font-bold text-slate-700">
                        {st.completedChallenges} Selesai
                      </td>

                      <td className="py-4 px-4 text-center font-mono">
                        <span className="inline-flex items-center gap-1 text-amber-600 font-bold">
                          <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                          {st.streak} Hari
                        </span>
                      </td>

                      <td className="py-4 px-4 text-right font-black font-mono text-sm text-indigo-600">
                        {st.xp.toLocaleString()} XP
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};
