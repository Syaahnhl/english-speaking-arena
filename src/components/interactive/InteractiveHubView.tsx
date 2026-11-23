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
  Flame, 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Compass, 
  Image as ImageIcon, 
  Radio, 
  Clock, 
  AlertOctagon 
} from 'lucide-react';

export const InteractiveHubView: React.FC = () => {
  const { awardXp, completeDailyChallenge } = useArena();
  const [activeSubTab, setActiveSubTab] = useState<'taboo' | 'yes-and' | '432' | 'speed-talk' | 'shadowing' | 'visual-story'>('taboo');

  // --- 1. TABOO STATE ---
  const [tabooIndex, setTabooIndex] = useState(0);
  const [tabooTimeLeft, setTabooTimeLeft] = useState(60);
  const [tabooRunning, setTabooRunning] = useState(false);
  const currentTaboo = TABOO_CARDS[tabooIndex];

  // --- 2. YES, AND STATE ---
  const [yesAndIndex, setYesAndIndex] = useState(0);
  const currentYesAnd = YES_AND_PROMPTS[yesAndIndex];
  const [yesAndTurn, setYesAndTurn] = useState(0);

  // --- 3. 4/3/2 TECHNIQUE STATE ---
  const [fttIndex, setFttIndex] = useState(0);
  const [fttRound, setFttRound] = useState<1 | 2 | 3>(1);
  const roundDurations = { 1: 240, 2: 180, 3: 120 }; // 4m, 3m, 2m
  const [fttTimeLeft, setFttTimeLeft] = useState(roundDurations[1]);
  const [fttRunning, setFttRunning] = useState(false);
  const currentFtt = FOUR_THREE_TWO_TOPICS[fttIndex];

  // --- 4. SPEED TALKING STATE ---
  const [speedIndex, setSpeedIndex] = useState(0);
  const [speedTimeLeft, setSpeedTimeLeft] = useState(45);
  const [speedRunning, setSpeedRunning] = useState(false);
  const currentSpeed = SPEED_TALKING_TOPICS[speedIndex];

  // --- 5. SHADOWING STATE ---
  const [shadowIndex, setShadowIndex] = useState(0);
  const [shadowSentenceIndex, setShadowSentenceIndex] = useState(0);
  const [shadowRate, setShadowRate] = useState(1.0);
  const [isSpeakingShadow, setIsSpeakingShadow] = useState(false);
  const currentShadow = SHADOWING_LESSONS[shadowIndex];
  const activeShadowSentence = currentShadow.sentences[shadowSentenceIndex];

  // --- 6. VISUAL STORYTELLING STATE ---
  const [visualIndex, setVisualIndex] = useState(0);
  const currentVisual = VISUAL_STORY_PROMPTS[visualIndex];
  const [visualTimeLeft, setVisualTimeLeft] = useState(90);
  const [visualRunning, setVisualRunning] = useState(false);

  // Timer tick effect for Taboo
  useEffect(() => {
    let t: NodeJS.Timeout | null = null;
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

  // Timer tick for 4/3/2
  useEffect(() => {
    let t: NodeJS.Timeout | null = null;
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
      awardXp(35, `Completed 4/3/2 Fluency Technique on "${currentFtt.title}"`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-soft">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-2">
          <Mic2 className="w-3.5 h-3.5" />
          <span>Interactive Methods Studio</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Fluency Gym & Speech Games
        </h1>
        <p className="text-slate-500 text-sm mt-1 max-w-xl">
          Six specialized drills designed by ESL speech coaches to break hesitations, build quick improvisation reflexes, and hone authentic pronunciation intonation.
        </p>

        {/* Sub-tab Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto pt-5 border-t border-slate-100 mt-5 pb-1">
          {[
            { id: 'taboo', label: 'Taboo / Hot Seat', icon: AlertOctagon },
            { id: 'yes-and', label: 'Yes, And... Improv', icon: Sparkles },
            { id: '432', label: '4/3/2 Technique', icon: Clock },
            { id: 'speed-talk', label: 'Speed Talking', icon: Radio },
            { id: 'shadowing', label: 'Shadowing Studio', icon: Volume2 },
            { id: 'visual-story', label: 'Visual Storytelling', icon: ImageIcon },
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
                className={`flex-shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/70'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* METHOD 1: TABOO / HOT SEAT */}
      {activeSubTab === 'taboo' && (
        <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-card space-y-6 animate-slide-up">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
              Hot Seat Challenge
            </span>
            <span className="text-xs font-mono text-slate-400">Card {tabooIndex + 1} of {TABOO_CARDS.length}</span>
          </div>

          <div className="text-center py-4 bg-gradient-to-b from-indigo-50/50 to-white rounded-2xl border border-indigo-100/60">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Describe This Word:</span>
            <h2 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-wider mt-2 font-mono">
              {currentTaboo.word}
            </h2>
            <p className="text-xs text-slate-500 mt-2 italic">Hint: "{currentTaboo.hints}"</p>
          </div>

          {/* FORBIDDEN WORDS BOX */}
          <div className="p-5 rounded-2xl bg-rose-50/80 border-2 border-rose-200">
            <span className="text-xs font-extrabold uppercase tracking-wider text-rose-800 flex items-center gap-1.5 mb-3">
              <AlertOctagon className="w-4 h-4 text-rose-600" />
              Do NOT Say Any of These Words:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {currentTaboo.forbiddenWords.map((word, wIdx) => (
                <div key={wIdx} className="p-2.5 bg-white rounded-xl border border-rose-200 text-center font-bold text-sm text-rose-700 shadow-sm">
                  {word}
                </div>
              ))}
            </div>
          </div>

          {/* Timer & Controls */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-3">
              <span className="text-3xl font-mono font-black text-slate-900">
                {tabooTimeLeft}s
              </span>
              <span className="text-[10px] text-slate-400 uppercase font-semibold">
                {tabooRunning ? 'Describing' : 'Paused'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (!tabooRunning) soundService.playStart();
                  setTabooRunning(!tabooRunning);
                }}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-md transition-all ${
                  tabooRunning ? 'bg-amber-500' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/20'
                }`}
              >
                {tabooRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                <span>{tabooRunning ? 'Pause' : 'Start Timer'}</span>
              </button>

              <button
                onClick={() => {
                  soundService.playSuccess();
                  awardXp(20, `Guessed Taboo Word "${currentTaboo.word}"`);
                  setTabooIndex((tabooIndex + 1) % TABOO_CARDS.length);
                  setTabooTimeLeft(60);
                  setTabooRunning(false);
                }}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition-all"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Next Word (+20 XP)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* METHOD 2: YES, AND... IMPROVISATION */}
      {activeSubTab === 'yes-and' && (
        <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-card space-y-6 animate-slide-up">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
              Improv Principle: "Yes, and..."
            </span>
            <span className="text-xs font-semibold text-slate-400 capitalize">{currentYesAnd.level}</span>
          </div>

          <div>
            <h3 className="text-xl font-extrabold text-slate-900">{currentYesAnd.scenario}</h3>
            <p className="text-xs text-slate-500 mt-1">
              Rule: Never deny the premise. Accept whatever happened ("Yes"), then add an unexpected escalation ("and...").
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-indigo-50/70 border border-indigo-100 text-slate-900 text-base font-semibold leading-relaxed">
            <span className="text-xs text-indigo-600 font-bold block mb-1">Starter Line:</span>
            "{currentYesAnd.starterLine}"
          </div>

          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-700 block">Suggested Twists to Build On:</span>
            {currentYesAnd.suggestedTwists.map((twist, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-800 flex items-center justify-between"
              >
                <span className="font-medium">{twist}</span>
                <button
                  onClick={() => speechService.speak(twist, 1.0)}
                  className="text-slate-400 hover:text-indigo-600 p-1"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-400">Speak for 60 seconds with your twist.</span>
            <button
              onClick={() => {
                soundService.playSuccess();
                awardXp(20, `Completed "Yes, And..." Improv on ${currentYesAnd.scenario}`);
                setYesAndIndex((yesAndIndex + 1) % YES_AND_PROMPTS.length);
              }}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition-all"
            >
              Complete Improv (+20 XP)
            </button>
          </div>
        </div>
      )}

      {/* METHOD 3: 4/3/2 TECHNIQUE */}
      {activeSubTab === '432' && (
        <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-card space-y-6 animate-slide-up">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-100">
              Maurice Nation's 4/3/2 Fluency Method
            </span>
            <span className="text-xs font-semibold text-slate-400 capitalize">{currentFtt.level}</span>
          </div>

          <div>
            <h3 className="text-xl font-extrabold text-slate-900">{currentFtt.title}</h3>
            <p className="text-xs text-slate-500 mt-1">{currentFtt.description}</p>
          </div>

          {/* Round Indicator */}
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3].map(r => (
              <div
                key={r}
                className={`p-3 rounded-2xl border text-center transition-all ${
                  fttRound === r
                    ? 'bg-purple-50 border-purple-500 shadow-sm'
                    : fttRound > r
                    ? 'bg-emerald-50 border-emerald-300 opacity-80'
                    : 'bg-slate-50 border-slate-200 opacity-60'
                }`}
              >
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Round {r}</span>
                <span className="text-base font-extrabold text-slate-900 font-mono">
                  {r === 1 ? '4 Mins' : r === 2 ? '3 Mins' : '2 Mins'}
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5">
                  {r === 1 ? 'Full narrative' : r === 2 ? 'Cut pauses' : 'Punchy flow'}
                </span>
              </div>
            ))}
          </div>

          {/* Outline Guide */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
            <span className="font-bold text-slate-800 block">Structured Outline:</span>
            {currentFtt.outline.map((pt, i) => (
              <div key={i} className="text-slate-600">• {pt}</div>
            ))}
          </div>

          {/* Timer Display */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-purple-900 text-white shadow-md">
            <div>
              <span className="text-[11px] text-purple-200 block uppercase font-bold">Round {fttRound} Timer</span>
              <span className="text-3xl font-mono font-extrabold">
                {Math.floor(fttTimeLeft / 60)}:{(fttTimeLeft % 60).toString().padStart(2, '0')}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (!fttRunning) soundService.playStart();
                  setFttRunning(!fttRunning);
                }}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-white text-purple-900 hover:bg-purple-50 transition-all"
              >
                {fttRunning ? 'Pause Round' : 'Start Speaking'}
              </button>

              <button
                onClick={handleNextFttRound}
                className="px-4 py-2.5 rounded-xl text-xs font-bold bg-purple-700 hover:bg-purple-600 text-white transition-all"
              >
                {fttRound < 3 ? 'Next Round' : 'Finish Challenge'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* METHOD 4: SPEED TALKING */}
      {activeSubTab === 'speed-talk' && (
        <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-card space-y-6 animate-slide-up">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
              Fishbowl / Speed Rotation
            </span>
            <span className="text-xs font-semibold text-slate-400 capitalize">{currentSpeed.category}</span>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 text-center">
            <span className="text-xs font-bold text-amber-800 uppercase tracking-widest block mb-2">Prompt:</span>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900">"{currentSpeed.topic}"</h3>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
            <span className="font-bold text-slate-700 block">Guide Questions for Rotation:</span>
            {currentSpeed.guideQuestions.map((q, idx) => (
              <div key={idx} className="text-slate-600">• {q}</div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-400">Practice rapid spontaneous response.</span>
            <button
              onClick={() => {
                soundService.playSuccess();
                awardXp(15, `Completed Speed Talking session on ${currentSpeed.category}`);
                setSpeedIndex((speedIndex + 1) % SPEED_TALKING_TOPICS.length);
              }}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-md transition-all"
            >
              Rotate Topic (+15 XP)
            </button>
          </div>
        </div>
      )}

      {/* METHOD 5: SHADOWING PRACTICE */}
      {activeSubTab === 'shadowing' && (
        <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-card space-y-6 animate-slide-up">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Intonation & Accent Shadowing
            </span>
            <span className="text-xs font-semibold text-slate-500">{currentShadow.accent}</span>
          </div>

          <div>
            <h3 className="text-xl font-extrabold text-slate-900">{currentShadow.title}</h3>
            <p className="text-xs text-slate-500 mt-1">Speaker: {currentShadow.speaker} • {currentShadow.topic}</p>
          </div>

          {/* Current Target Sentence */}
          <div className="p-6 rounded-2xl bg-emerald-50/70 border-2 border-emerald-300 text-center space-y-3">
            <span className="text-xs text-emerald-800 font-bold uppercase tracking-wider block">
              Sentence {shadowSentenceIndex + 1} of {currentShadow.sentences.length}
            </span>
            <p className="text-xl sm:text-2xl font-bold text-slate-900 leading-relaxed">
              "{activeShadowSentence.text}"
            </p>
            {activeShadowSentence.phoneticTips && (
              <div className="text-xs text-emerald-800 font-medium bg-emerald-100/60 p-2 rounded-lg inline-block">
                💡 <span className="font-semibold">Phonetic Tip:</span> {activeShadowSentence.phoneticTips}
              </div>
            )}
          </div>

          {/* Controls: Speed, Playback */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  speechService.speak(activeShadowSentence.text, shadowRate);
                }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition-all"
              >
                <Volume2 className="w-4 h-4" />
                <span>Play Audio Track</span>
              </button>

              <button
                onClick={() => {
                  // Speak slower at 0.7x for precision articulation
                  speechService.speak(activeShadowSentence.text, 0.75);
                }}
                className="px-3 py-2.5 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition-all"
              >
                Slow (0.75x)
              </button>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                disabled={shadowSentenceIndex === 0}
                onClick={() => setShadowSentenceIndex(prev => prev - 1)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 disabled:opacity-30"
              >
                Prev
              </button>
              <button
                disabled={shadowSentenceIndex >= currentShadow.sentences.length - 1}
                onClick={() => setShadowSentenceIndex(prev => prev + 1)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-200 hover:bg-slate-300 disabled:opacity-30"
              >
                Next
              </button>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={() => {
                soundService.playSuccess();
                awardXp(20, `Finished Shadowing Lesson: "${currentShadow.title}"`);
                setShadowIndex((shadowIndex + 1) % SHADOWING_LESSONS.length);
                setShadowSentenceIndex(0);
              }}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition-all"
            >
              Complete Shadowing Session (+20 XP)
            </button>
          </div>
        </div>
      )}

      {/* METHOD 6: VISUAL STORYTELLING */}
      {activeSubTab === 'visual-story' && (
        <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-card space-y-6 animate-slide-up">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
              Visual Narrative Prompt
            </span>
            <span className="text-xs font-semibold text-slate-400 capitalize">{currentVisual.level}</span>
          </div>

          <div>
            <h3 className="text-xl font-extrabold text-slate-900">{currentVisual.title}</h3>
          </div>

          {/* Picture Display */}
          <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm max-h-72">
            <img
              src={currentVisual.imageUrl}
              alt={currentVisual.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Prompt Questions */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
            <span className="font-bold text-slate-800 block">Storytelling Guiding Questions:</span>
            {currentVisual.promptQuestions.map((q, qIdx) => (
              <div key={qIdx} className="text-slate-700 font-medium">• {q}</div>
            ))}
          </div>

          {/* Suggested Vocab */}
          <div>
            <span className="text-xs font-bold text-slate-700 block mb-2">Descriptive Vocabulary:</span>
            <div className="flex flex-wrap gap-1.5">
              {currentVisual.suggestedVocab.map((v, i) => (
                <span key={i} className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-semibold border border-indigo-100">
                  {v}
                </span>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-400">Speak for 90 seconds explaining the story.</span>
            <button
              onClick={() => {
                soundService.playSuccess();
                awardXp(25, `Completed Visual Storytelling on "${currentVisual.title}"`);
                setVisualIndex((visualIndex + 1) % VISUAL_STORY_PROMPTS.length);
              }}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition-all"
            >
              Finish Story (+25 XP)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
