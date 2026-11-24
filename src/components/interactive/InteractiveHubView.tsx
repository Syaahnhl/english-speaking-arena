import React, { useState, useEffect } from 'react';
import { useArena } from '../../context/ArenaContext';
import { 
  TABOO_CARDS, 
  YES_AND_PROMPTS, 
  FOUR_THREE_TWO_TOPICS, 
  SPEED_TALKING_TOPICS, 
  SHADOWING_LESSONS, 
  VISUAL_STORY_PROMPTS 
} from '../../data/interactiveData';
import { soundService } from '../../services/soundService';
import { speechService } from '../../services/speechService';
import { 
  Mic2, 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle, 
  Volume2, 
  Sparkles, 
  Image as ImageIcon, 
  Radio, 
  Clock, 
  AlertOctagon, 
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Info
} from 'lucide-react';

export const InteractiveHubView: React.FC = () => {
  const { awardXp } = useArena();
  const [activeSubTab, setActiveSubTab] = useState<'taboo' | 'yes-and' | '432' | 'speed-talk' | 'shadowing' | 'visual-story'>('taboo');
  const [showHowToPlay, setShowHowToPlay] = useState<boolean>(true);

  // --- 1. TABOO STATE ---
  const [tabooIndex, setTabooIndex] = useState(0);
  const [tabooTimeLeft, setTabooTimeLeft] = useState(60);
  const [tabooRunning, setTabooRunning] = useState(false);
  const currentTaboo = TABOO_CARDS[tabooIndex];

  // --- 2. YES, AND STATE ---
  const [yesAndIndex, setYesAndIndex] = useState(0);
  const currentYesAnd = YES_AND_PROMPTS[yesAndIndex];

  // --- 3. 4/3/2 TECHNIQUE STATE ---
  const [fttIndex, setFttIndex] = useState(0);
  const [fttRound, setFttRound] = useState<1 | 2 | 3>(1);
  const roundDurations = { 1: 240, 2: 180, 3: 120 }; // 4m, 3m, 2m
  const [fttTimeLeft, setFttTimeLeft] = useState(roundDurations[1]);
  const [fttRunning, setFttRunning] = useState(false);
  const currentFtt = FOUR_THREE_TWO_TOPICS[fttIndex];

  // --- 4. SPEED TALKING STATE ---
  const [speedIndex, setSpeedIndex] = useState(0);
  const currentSpeed = SPEED_TALKING_TOPICS[speedIndex];

  // --- 5. SHADOWING STATE ---
  const [shadowIndex, setShadowIndex] = useState(0);
  const [shadowSentenceIndex, setShadowSentenceIndex] = useState(0);
  const currentShadow = SHADOWING_LESSONS[shadowIndex];
  const activeShadowSentence = currentShadow.sentences[shadowSentenceIndex];

  // --- 6. VISUAL STORYTELLING STATE ---
  const [visualIndex, setVisualIndex] = useState(0);
  const currentVisual = VISUAL_STORY_PROMPTS[visualIndex];

  // Timer for Taboo
  useEffect(() => {
    let t: any = null;
    if (tabooRunning && tabooTimeLeft > 0) {
      t = setInterval(() => {
        setTabooTimeLeft(prev => {
          if (prev <= 1) {
            setTabooRunning(false);
            soundService.playTimesUp();
            return 0;
          }
          if (prev <= 4) soundService.playTick();
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (t) clearInterval(t);
    };
  }, [tabooRunning, tabooTimeLeft]);

  // Timer for 4/3/2
  useEffect(() => {
    let t: any = null;
    if (fttRunning && fttTimeLeft > 0) {
      t = setInterval(() => {
        setFttTimeLeft(prev => {
          if (prev <= 1) {
            handleNextFttRound();
            return 0;
          }
          if (prev <= 4) soundService.playTick();
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (t) clearInterval(t);
    };
  }, [fttRunning, fttTimeLeft]);

  const handleNextFttRound = () => {
    soundService.playSuccess();
    setFttRunning(false);
    if (fttRound < 3) {
      const nextRound = (fttRound + 1) as 2 | 3;
      setFttRound(nextRound);
      setFttTimeLeft(roundDurations[nextRound]);
    } else {
      awardXp(35, `Menyelesaikan Teknik 4/3/2: "${currentFtt.title}"`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="max-w-xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold">
            <Mic2 className="w-3.5 h-3.5" />
            <span>Fluency Gym & Games</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Interactive Speech Studio
          </h1>
          <p className="text-slate-600 text-sm leading-relaxed">
            Enam metode latihan bicara interaktif yang dirancang untuk membongkar kebiasaan ragu, melatih improvisasi cepat, dan mengasah pelafalan intonasi alami.
          </p>
        </div>

        <button
          onClick={() => setShowHowToPlay(!showHowToPlay)}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-md transition-all flex-shrink-0"
        >
          <HelpCircle className="w-4 h-4 text-amber-400" />
          <span>Panduan Cara Main</span>
          {showHowToPlay ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Sub-tab Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: 'taboo', label: '1. Taboo / Hot Seat', icon: AlertOctagon },
          { id: 'yes-and', label: '2. Yes, And... Improv', icon: Sparkles },
          { id: '432', label: '3. Teknik 4/3/2', icon: Clock },
          { id: 'speed-talk', label: '4. Speed Talking', icon: Radio },
          { id: 'shadowing', label: '5. Shadowing Studio', icon: Volume2 },
          { id: 'visual-story', label: '6. Visual Storytelling', icon: ImageIcon },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveSubTab(tab.id as typeof activeSubTab);
                soundService.playClick();
              }}
              className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                  : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ============================================================== */}
      {/* METHOD 1: TABOO / HOT SEAT */}
      {/* ============================================================== */}
      {activeSubTab === 'taboo' && (
        <div className="space-y-6">
          {showHowToPlay && (
            <div className="bg-gradient-to-br from-rose-50/70 via-white to-slate-50 rounded-3xl border border-rose-100 p-6 shadow-soft space-y-3 animate-slide-up text-xs text-slate-700">
              <div className="flex items-center gap-2 font-extrabold text-sm text-rose-950">
                <AlertOctagon className="w-4 h-4 text-rose-600" />
                <span>Cara Bermain Taboo / Hot Seat:</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Tantangan mendeskripsikan sebuah kata target kepada teman atau partner bicara Anda <strong>TANPA</strong> menyebutkan kata-kata terlarang yang tercantum di kartu!
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                <div className="p-3.5 bg-white rounded-2xl border border-rose-100 space-y-1">
                  <strong className="block text-slate-900">1. Lihat Kata Target</strong>
                  <p className="text-slate-500">Kata besar di tengah adalah kata yang harus ditebak oleh lawan bicara Anda.</p>
                </div>
                <div className="p-3.5 bg-white rounded-2xl border border-rose-100 space-y-1">
                  <strong className="block text-slate-900">2. Hindari Kata Terlarang</strong>
                  <p className="text-slate-500">Dilarang menyebut 5 kata di kotak merah! Gunakan sinonim, perumpamaan, atau fungsinya.</p>
                </div>
                <div className="p-3.5 bg-white rounded-2xl border border-rose-100 space-y-1">
                  <strong className="block text-slate-900">3. Kejar Batas Waktu</strong>
                  <p className="text-slate-500">Deskripsikan terus selama 60 detik. Jika berhasil tertebak, klaim reward +20 XP.</p>
                </div>
              </div>
            </div>
          )}

          <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-card space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
                Kategori: {currentTaboo.category}
              </span>
              <span className="text-xs font-mono text-slate-400">Kartu {tabooIndex + 1} dari {TABOO_CARDS.length}</span>
            </div>

            <div className="text-center py-8 bg-gradient-to-b from-indigo-50/60 to-white rounded-3xl border border-indigo-100">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400 block mb-2">
                KATA TARGET YANG HARUS DIDESKRIPSIKAN:
              </span>
              <h2 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-wider font-mono">
                {currentTaboo.word}
              </h2>
              <p className="text-xs text-slate-500 mt-3 max-w-md mx-auto italic">
                Tips Bantuan: "{currentTaboo.hints}"
              </p>
            </div>

            {/* FORBIDDEN WORDS */}
            <div className="p-6 rounded-3xl bg-rose-50/70 border-2 border-rose-200 space-y-3">
              <span className="text-xs font-extrabold uppercase tracking-wider text-rose-800 flex items-center gap-2">
                <AlertOctagon className="w-4 h-4 text-rose-600" />
                DILARANG KERAS MENGUCAPKAN KATA BERIKUT:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {currentTaboo.forbiddenWords.map((word, wIdx) => (
                  <div key={wIdx} className="p-3 bg-white rounded-2xl border border-rose-200 text-center font-bold text-sm text-rose-700 shadow-sm">
                    {word}
                  </div>
                ))}
              </div>
            </div>

            {/* Timer & Controls */}
            <div className="flex items-center justify-between p-5 rounded-3xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-3">
                <span className="text-3xl font-mono font-black text-slate-900">
                  {tabooTimeLeft}s
                </span>
                <span className="text-xs text-slate-400 uppercase font-semibold">
                  {tabooRunning ? 'Mendeskripsikan' : 'Jeda'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (!tabooRunning) soundService.playStart();
                    setTabooRunning(!tabooRunning);
                  }}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-md transition-all ${
                    tabooRunning ? 'bg-amber-500 hover:bg-amber-600' : 'bg-indigo-600 hover:bg-indigo-700'
                  }`}
                >
                  {tabooRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                  <span>{tabooRunning ? 'Jeda' : 'Mulai Timer'}</span>
                </button>

                <button
                  onClick={() => {
                    soundService.playSuccess();
                    awardXp(20, `Menebak Kata Taboo: "${currentTaboo.word}"`);
                    setTabooIndex((tabooIndex + 1) % TABOO_CARDS.length);
                    setTabooTimeLeft(60);
                    setTabooRunning(false);
                  }}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition-all"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Berhasil Tebak (+20 XP)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* METHOD 2: YES, AND... IMPROVISATION */}
      {/* ============================================================== */}
      {activeSubTab === 'yes-and' && (
        <div className="space-y-6">
          {showHowToPlay && (
            <div className="bg-gradient-to-br from-indigo-50/70 via-white to-slate-50 rounded-3xl border border-indigo-100 p-6 shadow-soft space-y-3 animate-slide-up text-xs text-slate-700">
              <div className="flex items-center gap-2 font-extrabold text-sm text-indigo-950">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>Cara Bermain "Yes, and..." Improv:</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Prinsip improvisasi panggung paling populer di dunia. Aturan utamanya: <strong>Jangan pernah menolak</strong> premis yang dibuat partner ("No, that's not true..."). Selalu terima premisnya ("Yes"), lalu kembangkan dengan kejutan baru ("and...")!
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                <div className="p-3.5 bg-white rounded-2xl border border-indigo-100 space-y-1">
                  <strong className="block text-slate-900">1. Baca Kalimat Pembuka</strong>
                  <p className="text-slate-500">Lihat premis awal cerita yang tidak biasa di bawah ini.</p>
                </div>
                <div className="p-3.5 bg-white rounded-2xl border border-indigo-100 space-y-1">
                  <strong className="block text-slate-900">2. Gunakan "Yes, and..."</strong>
                  <p className="text-slate-500">Mulailah respons Anda dengan "Yes, and..." lalu sambung dengan kelanjutan plot yang menarik.</p>
                </div>
                <div className="p-3.5 bg-white rounded-2xl border border-indigo-100 space-y-1">
                  <strong className="block text-slate-900">3. Bicara 60 Detik</strong>
                  <p className="text-slate-500">Lanjutkan alur cerita secara spontan dan klaim reward +20 XP.</p>
                </div>
              </div>
            </div>
          )}

          <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-card space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                Prinsip Improvisasi Spontan
              </span>
              <span className="text-xs font-semibold text-slate-400 capitalize">Tingkat {currentYesAnd.level}</span>
            </div>

            <div className="space-y-1">
              <h3 className="text-2xl font-black text-slate-900">{currentYesAnd.scenario}</h3>
              <p className="text-xs text-slate-500">Terima kejadian sebelumnya, lalu kembangkan cerita tanpa ragu.</p>
            </div>

            <div className="p-6 rounded-3xl bg-indigo-50/70 border border-indigo-100 text-slate-900 text-base font-semibold leading-relaxed">
              <span className="text-xs text-indigo-600 font-bold block mb-1">Premis Cerita Awal:</span>
              "{currentYesAnd.starterLine}"
            </div>

            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-800 block">Inspirasi Plot Kejutan ("Yes, and..."):</span>
              {currentYesAnd.suggestedTwists.map((twist, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-800 flex items-center justify-between"
                >
                  <span className="font-medium leading-relaxed">{twist}</span>
                  <button
                    onClick={() => speechService.speak(twist, 1.0)}
                    className="text-slate-400 hover:text-indigo-600 p-1.5 flex-shrink-0"
                    title="Dengarkan pengucapan"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-400">Latih imajinasi dan kelancaran berbicara.</span>
              <button
                onClick={() => {
                  soundService.playSuccess();
                  awardXp(20, `Menyelesaikan Improv "Yes, And..." pada ${currentYesAnd.scenario}`);
                  setYesAndIndex((yesAndIndex + 1) % YES_AND_PROMPTS.length);
                }}
                className="px-6 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition-all"
              >
                Selesaikan Improv (+20 XP)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* METHOD 3: 4/3/2 TECHNIQUE */}
      {/* ============================================================== */}
      {activeSubTab === '432' && (
        <div className="space-y-6">
          {showHowToPlay && (
            <div className="bg-gradient-to-br from-purple-50/70 via-white to-slate-50 rounded-3xl border border-purple-100 p-6 shadow-soft space-y-3 animate-slide-up text-xs text-slate-700">
              <div className="flex items-center gap-2 font-extrabold text-sm text-purple-950">
                <Clock className="w-4 h-4 text-purple-600" />
                <span>Cara Kerja Teknik 4/3/2:</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Ditemukan oleh Prof. Maurice Nation, teknik ini melatih otak untuk memangkas jeda kata ('um', 'ah', 'like') dengan mengulang cerita yang sama dalam waktu yang dipadatkan secara bertahap.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                <div className="p-3.5 bg-white rounded-2xl border border-purple-100 space-y-1">
                  <strong className="block text-slate-900">Putaran 1 (4 Menit)</strong>
                  <p className="text-slate-500">Ceritakan seluruh kisah secara mendalam dengan semua detail latar belakang.</p>
                </div>
                <div className="p-3.5 bg-white rounded-2xl border border-purple-100 space-y-1">
                  <strong className="block text-slate-900">Putaran 2 (3 Menit)</strong>
                  <p className="text-slate-500">Ceritakan ulang topik yang sama dengan memangkas kata-kata yang tidak perlu.</p>
                </div>
                <div className="p-3.5 bg-white rounded-2xl border border-purple-100 space-y-1">
                  <strong className="block text-slate-900">Putaran 3 (2 Menit)</strong>
                  <p className="text-slate-500">Sampaikan intisari cerita dengan ritme percaya diri dan artikulasi tegas!</p>
                </div>
              </div>
            </div>
          )}

          <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-card space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-100">
                Teknik Kompresi Kelancaran
              </span>
              <span className="text-xs font-semibold text-slate-400 capitalize">Tingkat {currentFtt.level}</span>
            </div>

            <div className="space-y-1">
              <h3 className="text-2xl font-black text-slate-900">{currentFtt.title}</h3>
              <p className="text-xs text-slate-500">{currentFtt.description}</p>
            </div>

            {/* Putaran Progress */}
            <div className="grid grid-cols-3 gap-3">
              {[1, 2, 3].map(r => (
                <div
                  key={r}
                  className={`p-4 rounded-2xl border text-center transition-all ${
                    fttRound === r
                      ? 'bg-purple-50 border-2 border-purple-600 shadow-sm'
                      : fttRound > r
                      ? 'bg-emerald-50 border-emerald-300'
                      : 'bg-slate-50 border-slate-200 opacity-60'
                  }`}
                >
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Putaran {r}</span>
                  <span className="text-lg font-black text-slate-900 font-mono">
                    {r === 1 ? '4 Menit' : r === 2 ? '3 Menit' : '2 Menit'}
                  </span>
                  <span className="text-[10px] text-slate-500 block mt-1">
                    {r === 1 ? 'Cerita lengkap' : r === 2 ? 'Pangkas jeda' : 'Kelancaran maksimal'}
                  </span>
                </div>
              ))}
            </div>

            {/* Outline Guide */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
              <strong className="text-slate-800 block">Poin-Poin Garis Besar:</strong>
              {currentFtt.outline.map((pt, i) => (
                <div key={i} className="text-slate-600">• {pt}</div>
              ))}
            </div>

            {/* Timer Console */}
            <div className="flex items-center justify-between p-5 rounded-3xl bg-purple-950 text-white shadow-lg">
              <div>
                <span className="text-[11px] text-purple-200 block uppercase font-bold">Timer Putaran {fttRound}</span>
                <span className="text-3xl font-mono font-black">
                  {Math.floor(fttTimeLeft / 60)}:{(fttTimeLeft % 60).toString().padStart(2, '0')}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (!fttRunning) soundService.playStart();
                    setFttRunning(!fttRunning);
                  }}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-white text-purple-950 hover:bg-purple-50 transition-all"
                >
                  {fttRunning ? 'Jeda Putaran' : 'Mulai Putaran'}
                </button>

                <button
                  onClick={handleNextFttRound}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-purple-700 hover:bg-purple-600 text-white transition-all"
                >
                  {fttRound < 3 ? 'Lanjut Putaran' : 'Selesaikan Tantangan'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* METHOD 4: SPEED TALKING */}
      {/* ============================================================== */}
      {activeSubTab === 'speed-talk' && (
        <div className="space-y-6">
          {showHowToPlay && (
            <div className="bg-gradient-to-br from-amber-50/70 via-white to-slate-50 rounded-3xl border border-amber-100 p-6 shadow-soft space-y-3 animate-slide-up text-xs text-slate-700">
              <div className="flex items-center gap-2 font-extrabold text-sm text-amber-950">
                <Radio className="w-4 h-4 text-amber-600" />
                <span>Cara Bermain Speed Talking / Fishbowl:</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Latihan spontanitas kilat. Anda harus merespons topik mendalam tanpa membuat catatan di kertas selama 45 detik untuk melatih daya tanggap otak terhadap bahasa Inggris.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                <div className="p-3.5 bg-white rounded-2xl border border-amber-100 space-y-1">
                  <strong className="block text-slate-900">1. Baca Topik Acak</strong>
                  <p className="text-slate-500">Pahami pertanyaan inti yang muncul secara spontan.</p>
                </div>
                <div className="p-3.5 bg-white rounded-2xl border border-amber-100 space-y-1">
                  <strong className="block text-slate-900">2. Jawab Langsung</strong>
                  <p className="text-slate-500">Sampaikan pandangan Anda dengan lugas menggunakan panduan pertanyaan.</p>
                </div>
                <div className="p-3.5 bg-white rounded-2xl border border-amber-100 space-y-1">
                  <strong className="block text-slate-900">3. Rotasi Topik</strong>
                  <p className="text-slate-500">Tekan "Rotasi Topik" untuk melatih topik berikutnya dan klaim +15 XP.</p>
                </div>
              </div>
            </div>
          )}

          <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-card space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                Kategori: {currentSpeed.category}
              </span>
              <span className="text-xs font-semibold text-slate-400 capitalize">Tingkat {currentSpeed.level}</span>
            </div>

            <div className="p-8 rounded-3xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 text-center">
              <span className="text-xs font-bold text-amber-800 uppercase tracking-widest block mb-2">
                PERTANYAAN SPONTAN:
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 leading-snug">
                "{currentSpeed.topic}"
              </h3>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
              <strong className="text-slate-800 block">Panduan Menjawab:</strong>
              {currentSpeed.guideQuestions.map((q, idx) => (
                <div key={idx} className="text-slate-600">• {q}</div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-400">Jawab spontan selama 45 detik.</span>
              <button
                onClick={() => {
                  soundService.playSuccess();
                  awardXp(15, `Menyelesaikan Speed Talking: ${currentSpeed.category}`);
                  setSpeedIndex((speedIndex + 1) % SPEED_TALKING_TOPICS.length);
                }}
                className="px-6 py-2.5 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-md transition-all"
              >
                Rotasi Topik Baru (+15 XP)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* METHOD 5: SHADOWING PRACTICE */}
      {/* ============================================================== */}
      {activeSubTab === 'shadowing' && (
        <div className="space-y-6">
          {showHowToPlay && (
            <div className="bg-gradient-to-br from-emerald-50/70 via-white to-slate-50 rounded-3xl border border-emerald-100 p-6 shadow-soft space-y-3 animate-slide-up text-xs text-slate-700">
              <div className="flex items-center gap-2 font-extrabold text-sm text-emerald-950">
                <Volume2 className="w-4 h-4 text-emerald-600" />
                <span>Cara Kerja Shadowing Studio:</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Teknik menirukan suara penutur asli (native speaker) persis seperti bayangan (shadow) untuk menyerap ritme bahasa, intonasi naik-turun, serta penekanan suku kata yang benar.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                <div className="p-3.5 bg-white rounded-2xl border border-emerald-100 space-y-1">
                  <strong className="block text-slate-900">1. Dengarkan Model Audio</strong>
                  <p className="text-slate-500">Putar audio kalimat dan perhatikan penekanan kata (kata yang dicetak tebal).</p>
                </div>
                <div className="p-3.5 bg-white rounded-2xl border border-emerald-100 space-y-1">
                  <strong className="block text-slate-900">2. Tirukan Persis</strong>
                  <p className="text-slate-500">Ucapkan secara bersamaan atau sesaat setelah audio berbunyi dengan intonasi serupa.</p>
                </div>
                <div className="p-3.5 bg-white rounded-2xl border border-emerald-100 space-y-1">
                  <strong className="block text-slate-900">3. Manfaatkan Tips Fonetik</strong>
                  <p className="text-slate-500">Baca tips sambungan kata (linking) untuk berbicara lebih mengalir.</p>
                </div>
              </div>
            </div>
          )}

          <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-card space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                {currentShadow.accent}
              </span>
              <span className="text-xs font-semibold text-slate-400">Penutur: {currentShadow.speaker}</span>
            </div>

            <div className="space-y-1">
              <h3 className="text-2xl font-black text-slate-900">{currentShadow.title}</h3>
              <p className="text-xs text-slate-500">Topik: {currentShadow.topic}</p>
            </div>

            {/* Target Sentence Box */}
            <div className="p-8 rounded-3xl bg-emerald-50/70 border-2 border-emerald-300 text-center space-y-4">
              <span className="text-xs text-emerald-800 font-extrabold uppercase tracking-wider block">
                Kalimat {shadowSentenceIndex + 1} dari {currentShadow.sentences.length}
              </span>
              <p className="text-xl sm:text-2xl font-bold text-slate-900 leading-relaxed">
                "{activeShadowSentence.text}"
              </p>
              {activeShadowSentence.phoneticTips && (
                <div className="text-xs text-emerald-900 font-medium bg-emerald-100/70 p-3 rounded-2xl inline-block border border-emerald-200">
                  💡 <span className="font-bold">Tips Fonetik:</span> {activeShadowSentence.phoneticTips}
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => speechService.speak(activeShadowSentence.text, 1.0)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition-all"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Putar Audio Track</span>
                </button>

                <button
                  onClick={() => speechService.speak(activeShadowSentence.text, 0.75)}
                  className="px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition-all"
                >
                  Tempo Pelan (0.75x)
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  disabled={shadowSentenceIndex === 0}
                  onClick={() => setShadowSentenceIndex(prev => prev - 1)}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold border border-slate-200 disabled:opacity-40"
                >
                  Sebelumnya
                </button>
                <button
                  disabled={shadowSentenceIndex >= currentShadow.sentences.length - 1}
                  onClick={() => setShadowSentenceIndex(prev => prev + 1)}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-200 hover:bg-slate-300 disabled:opacity-40"
                >
                  Berikutnya
                </button>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => {
                  soundService.playSuccess();
                  awardXp(20, `Menyelesaikan Shadowing: "${currentShadow.title}"`);
                  setShadowIndex((shadowIndex + 1) % SHADOWING_LESSONS.length);
                  setShadowSentenceIndex(0);
                }}
                className="px-6 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition-all"
              >
                Selesaikan Sesi Shadowing (+20 XP)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* METHOD 6: VISUAL STORYTELLING */}
      {/* ============================================================== */}
      {activeSubTab === 'visual-story' && (
        <div className="space-y-6">
          {showHowToPlay && (
            <div className="bg-gradient-to-br from-indigo-50/70 via-white to-slate-50 rounded-3xl border border-indigo-100 p-6 shadow-soft space-y-3 animate-slide-up text-xs text-slate-700">
              <div className="flex items-center gap-2 font-extrabold text-sm text-indigo-950">
                <ImageIcon className="w-4 h-4 text-indigo-600" />
                <span>Cara Bermain Visual Storytelling:</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Tantangan menceritakan alur kisah lengkap hanya dari satu foto pemantik tanpa panduan teks. Latih kemampuan menyusun struktur narasi masa lalu, masa kini, dan prediksi masa depan.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-2">
                <div className="p-3.5 bg-white rounded-2xl border border-indigo-100 space-y-1">
                  <strong className="block text-slate-900">1. What is happening?</strong>
                  <p className="text-slate-500">Jelaskan apa yang sedang berlangsung di foto.</p>
                </div>
                <div className="p-3.5 bg-white rounded-2xl border border-indigo-100 space-y-1">
                  <strong className="block text-slate-900">2. Who are they?</strong>
                  <p className="text-slate-500">Siapa tokoh-tokohnya dan apa hubungan mereka?</p>
                </div>
                <div className="p-3.5 bg-white rounded-2xl border border-indigo-100 space-y-1">
                  <strong className="block text-slate-900">3. What happened before?</strong>
                  <p className="text-slate-500">Apa peristiwa yang memicu momen tersebut?</p>
                </div>
                <div className="p-3.5 bg-white rounded-2xl border border-indigo-100 space-y-1">
                  <strong className="block text-slate-900">4. What happens next?</strong>
                  <p className="text-slate-500">Bagaimana kelanjutan kisah mereka nantinya?</p>
                </div>
              </div>
            </div>
          )}

          <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-card space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                Tantangan Narasi Visual
              </span>
              <span className="text-xs font-semibold text-slate-400 capitalize">Tingkat {currentVisual.level}</span>
            </div>

            <h3 className="text-2xl font-black text-slate-900">{currentVisual.title}</h3>

            {/* Photo frame */}
            <div className="rounded-3xl overflow-hidden border border-slate-200 shadow-md max-h-80">
              <img
                src={currentVisual.imageUrl}
                alt={currentVisual.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Guiding Questions */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <strong className="text-slate-800 block">Pertanyaan Pemandu Cerita:</strong>
              {currentVisual.promptQuestions.map((q, qIdx) => (
                <div key={qIdx} className="text-slate-700 font-medium">• {q}</div>
              ))}
            </div>

            {/* Suggested Vocab */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700 block">Kosakata Deskriptif yang Disarankan:</span>
              <div className="flex flex-wrap gap-2">
                {currentVisual.suggestedVocab.map((v, i) => (
                  <span key={i} className="px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-100">
                    {v}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-400">Bicaralah selama 90 detik menceritakan alur foto.</span>
              <button
                onClick={() => {
                  soundService.playSuccess();
                  awardXp(25, `Menyelesaikan Visual Storytelling: "${currentVisual.title}"`);
                  setVisualIndex((visualIndex + 1) % VISUAL_STORY_PROMPTS.length);
                }}
                className="px-6 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition-all"
              >
                Selesaikan Cerita (+25 XP)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
