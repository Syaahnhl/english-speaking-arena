import React, { useState, useEffect, useRef } from 'react';
import { ReadingMaterial } from '../../types';
import { ReadingQuizModal } from './ReadingQuizModal';
import { soundService } from '../../services/soundService';
import { speechService } from '../../services/speechService';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Sliders, 
  Sun, 
  Moon, 
  Coffee, 
  CheckCircle, 
  ChevronLeft,
  ChevronRight,
  ArrowLeft
} from 'lucide-react';

interface Props {
  material: ReadingMaterial;
  onBack: () => void;
}

type ReadingDisplayMode = 'auto-scroll' | 'manual-scroll' | 'sentence-by-sentence' | 'paragraph';
type ReadingTheme = 'light' | 'warm' | 'dark';
type FontSize = 'sm' | 'md' | 'lg' | 'xl';
type LineSpacing = 'normal' | 'relaxed' | 'loose';

export const ReadingReader: React.FC<Props> = ({ material, onBack }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1.0);
  const [displayMode, setDisplayMode] = useState<ReadingDisplayMode>('auto-scroll');
  const [theme, setTheme] = useState<ReadingTheme>('light');
  const [fontSize, setFontSize] = useState<FontSize>('md');
  const [lineSpacing, setLineSpacing] = useState<LineSpacing>('relaxed');
  const [ttsEnabled, setTtsEnabled] = useState<boolean>(false);

  // Time tracking
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [activeSentenceIndex, setActiveSentenceIndex] = useState<number>(0);
  const [activeParagraphIndex, setActiveParagraphIndex] = useState<number>(0);
  const [showQuiz, setShowQuiz] = useState<boolean>(false);
  const [showControls, setShowControls] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const activeElementRef = useRef<HTMLSpanElement | null>(null);

  // Extract all sentences across paragraphs
  const sentences: { text: string; paragraphIndex: number; sentenceIndexInPara: number }[] = [];
  material.paragraphs.forEach((p, pIdx) => {
    // Regex splits sentences preserving punctuation
    const matches = p.match(/[^.!?]+[.!?]+(\s|$)/g) || [p];
    matches.forEach((s, sIdx) => {
      sentences.push({
        text: s.trim(),
        paragraphIndex: pIdx,
        sentenceIndexInPara: sIdx
      });
    });
  });

  // Calculate standard baseline reading duration
  // Baseline: 150 words per minute at 1.0x
  // Duration for sentence = (words in sentence / (150 * speedMultiplier)) * 60 seconds
  const currentSentence = sentences[activeSentenceIndex] || sentences[0];
  const wordsInCurrentSentence = currentSentence ? currentSentence.text.split(/\s+/).length : 5;
  const sentenceDurationMs = Math.max(1200, Math.round(((wordsInCurrentSentence / (160 * speedMultiplier)) * 60) * 1000));

  // Elapsed timer
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isPlaying) {
      timer = setInterval(() => {
        setElapsedSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying]);

  // Sentence advancement when playing
  useEffect(() => {
    let advanceTimer: NodeJS.Timeout | null = null;
    if (isPlaying) {
      // If TTS enabled, speak sentence
      if (ttsEnabled && currentSentence) {
        speechService.speak(currentSentence.text, speedMultiplier, () => {
          // On speech finish, advance if still playing
          handleNextSentence();
        });
      } else {
        advanceTimer = setTimeout(() => {
          handleNextSentence();
        }, sentenceDurationMs);
      }
    } else {
      speechService.stop();
    }

    return () => {
      if (advanceTimer) clearTimeout(advanceTimer);
    };
  }, [isPlaying, activeSentenceIndex, speedMultiplier, ttsEnabled]);

  // Auto scroll effect
  useEffect(() => {
    if (displayMode === 'auto-scroll' && activeElementRef.current && containerRef.current) {
      activeElementRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }, [activeSentenceIndex, displayMode]);

  const handleNextSentence = () => {
    if (activeSentenceIndex < sentences.length - 1) {
      setActiveSentenceIndex(prev => {
        const next = prev + 1;
        setActiveParagraphIndex(sentences[next].paragraphIndex);
        return next;
      });
    } else {
      // Reached the end of text!
      setIsPlaying(false);
      soundService.playSuccess();
    }
  };

  const handlePrevSentence = () => {
    if (activeSentenceIndex > 0) {
      setActiveSentenceIndex(prev => {
        const next = prev - 1;
        setActiveParagraphIndex(sentences[next].paragraphIndex);
        return next;
      });
    }
  };

  const handleTogglePlay = () => {
    soundService.playClick();
    setIsPlaying(prev => !prev);
  };

  const handleRestart = () => {
    soundService.playClick();
    setIsPlaying(false);
    setActiveSentenceIndex(0);
    setActiveParagraphIndex(0);
    setElapsedSeconds(0);
    speechService.stop();
  };

  const handleFinish = () => {
    setIsPlaying(false);
    speechService.stop();
    soundService.playSuccess();
    setShowQuiz(true);
  };

  // Estimate WPM
  const timeInMinutes = Math.max(0.1, elapsedSeconds / 60);
  const calculatedWpm = Math.round(material.wordCount / timeInMinutes);

  // Theme styles
  const themeClasses = {
    light: 'bg-white text-slate-800 border-slate-200',
    warm: 'bg-[#faf6ee] text-[#3c3328] border-[#e6decf]',
    dark: 'bg-[#0f172a] text-slate-200 border-slate-800'
  };

  const fontSizes = {
    sm: 'text-sm leading-relaxed',
    md: 'text-base sm:text-lg leading-relaxed',
    lg: 'text-lg sm:text-xl leading-loose',
    xl: 'text-xl sm:text-2xl leading-loose'
  };

  const lineSpacings = {
    normal: 'leading-normal',
    relaxed: 'leading-relaxed',
    loose: 'leading-loose'
  };

  const progressPercentage = Math.round(((activeSentenceIndex + 1) / sentences.length) * 100);

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* Top Bar: Back & Title */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => {
            speechService.stop();
            onBack();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit to Library</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-500">
            {material.wordCount} words • {material.level.toUpperCase()}
          </span>
          <button
            onClick={() => setShowControls(prev => !prev)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Settings</span>
          </button>
        </div>
      </div>

      {/* Settings Panel (Collapsible) */}
      {showControls && (
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-soft grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 animate-slide-up text-xs">
          {/* Theme */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">Reading Theme</label>
            <div className="flex gap-1.5">
              <button
                onClick={() => setTheme('light')}
                className={`flex-1 py-1.5 px-2 rounded-lg border flex items-center justify-center gap-1 ${
                  theme === 'light' ? 'bg-indigo-50 border-indigo-500 font-bold text-indigo-700' : 'bg-white border-slate-200 text-slate-600'
                }`}
              >
                <Sun className="w-3.5 h-3.5" /> Light
              </button>
              <button
                onClick={() => setTheme('warm')}
                className={`flex-1 py-1.5 px-2 rounded-lg border flex items-center justify-center gap-1 ${
                  theme === 'warm' ? 'bg-amber-100 border-amber-600 font-bold text-amber-900' : 'bg-amber-50/50 border-amber-200 text-slate-600'
                }`}
              >
                <Coffee className="w-3.5 h-3.5" /> Warm
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`flex-1 py-1.5 px-2 rounded-lg border flex items-center justify-center gap-1 ${
                  theme === 'dark' ? 'bg-slate-900 border-indigo-500 font-bold text-white' : 'bg-slate-800 border-slate-700 text-slate-300'
                }`}
              >
                <Moon className="w-3.5 h-3.5" /> Dark
              </button>
            </div>
          </div>

          {/* Mode */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">Display Mode</label>
            <select
              value={displayMode}
              onChange={(e) => setDisplayMode(e.target.value as ReadingDisplayMode)}
              className="w-full py-1.5 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium"
            >
              <option value="auto-scroll">Auto Scroll</option>
              <option value="manual-scroll">Manual Scroll</option>
              <option value="sentence-by-sentence">Sentence-by-Sentence</option>
              <option value="paragraph">Paragraph Focus</option>
            </select>
          </div>

          {/* Font Size */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">Font Size</label>
            <div className="flex gap-1">
              {(['sm', 'md', 'lg', 'xl'] as FontSize[]).map(sz => (
                <button
                  key={sz}
                  onClick={() => setFontSize(sz)}
                  className={`flex-1 py-1.5 rounded-lg border uppercase font-bold text-[11px] ${
                    fontSize === sz ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          {/* Line Spacing */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">Line Spacing</label>
            <div className="flex gap-1">
              {(['normal', 'relaxed', 'loose'] as LineSpacing[]).map(ls => (
                <button
                  key={ls}
                  onClick={() => setLineSpacing(ls)}
                  className={`flex-1 py-1.5 rounded-lg border capitalize font-medium text-[11px] ${
                    lineSpacing === ls ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  {ls}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Reading Card */}
      <div className={`rounded-2xl border p-6 sm:p-10 shadow-card transition-colors duration-200 ${themeClasses[theme]}`}>
        {/* Title & Metadata */}
        <div className="border-b border-inherit/20 pb-4 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-500">
              {material.genre.replace('-', ' ')}
            </span>
            <span className="text-xs opacity-60">
              Sentence {activeSentenceIndex + 1} of {sentences.length}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {material.title}
          </h2>
        </div>

        {/* Reading Text Display */}
        <div
          ref={containerRef}
          className={`max-h-[55vh] overflow-y-auto pr-2 space-y-6 ${fontSizes[fontSize]} ${lineSpacings[lineSpacing]}`}
        >
          {displayMode === 'sentence-by-sentence' ? (
            /* Sentence-by-Sentence Mode */
            <div className="min-h-[160px] flex items-center justify-center p-6 bg-indigo-500/5 rounded-2xl border border-indigo-500/20 text-center">
              <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                {currentSentence?.text}
              </span>
            </div>
          ) : displayMode === 'paragraph' ? (
            /* Paragraph Mode */
            material.paragraphs.map((para, pIdx) => {
              const isCurrentPara = pIdx === activeParagraphIndex;
              return (
                <p
                  key={pIdx}
                  className={`p-4 rounded-xl transition-all ${
                    isCurrentPara
                      ? 'bg-indigo-500/10 border-l-4 border-indigo-600 font-medium'
                      : 'opacity-40 hover:opacity-75'
                  }`}
                >
                  {para}
                </p>
              );
            })
          ) : (
            /* Auto or Manual Scroll Full Text with active sentence highlight */
            material.paragraphs.map((para, pIdx) => {
              // Find sentences for this paragraph
              const paraSentences = sentences.filter(s => s.paragraphIndex === pIdx);

              return (
                <p key={pIdx} className="transition-all">
                  {paraSentences.map((s, sIdx) => {
                    const globalIndex = sentences.findIndex(
                      item => item.paragraphIndex === pIdx && item.sentenceIndexInPara === sIdx
                    );
                    const isActive = globalIndex === activeSentenceIndex;

                    return (
                      <span
                        key={sIdx}
                        ref={isActive ? (el) => { activeElementRef.current = el; } : null}
                        onClick={() => {
                          setActiveSentenceIndex(globalIndex);
                          setActiveParagraphIndex(pIdx);
                        }}
                        className={`cursor-pointer transition-all duration-200 rounded px-1 py-0.5 ${
                          isActive
                            ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                            : globalIndex < activeSentenceIndex
                            ? 'opacity-70'
                            : 'opacity-90 hover:bg-slate-200/40'
                        }`}
                      >
                        {s.text}{' '}
                      </span>
                    );
                  })}
                </p>
              );
            })
          )}
        </div>

        {/* Progress bar */}
        <div className="mt-8 pt-4 border-t border-inherit/20">
          <div className="flex items-center justify-between text-xs opacity-75 mb-1.5 font-medium">
            <span>Reading Progress</span>
            <span>{progressPercentage}%</span>
          </div>
          <div className="w-full h-2 bg-slate-200/50 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-600 transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Control Console */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-soft flex flex-wrap items-center justify-between gap-4">
        {/* Playback Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevSentence}
            disabled={activeSentenceIndex === 0}
            className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed"
            title="Previous Sentence"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={handleTogglePlay}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all ${
              isPlaying
                ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-500/20'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/20'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>Start Reading</span>
              </>
            )}
          </button>

          <button
            onClick={handleNextSentence}
            disabled={activeSentenceIndex >= sentences.length - 1}
            className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed"
            title="Next Sentence"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={handleRestart}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100"
            title="Restart from beginning"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* TTS Audio toggle */}
          <button
            onClick={() => {
              setTtsEnabled(prev => !prev);
              speechService.stop();
            }}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition-all ${
              ttsEnabled
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
            title="Toggle Text-To-Speech Pronunciation Audio"
          >
            {ttsEnabled ? <Volume2 className="w-4 h-4 text-emerald-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
            <span className="hidden sm:inline">Voice Assistant</span>
          </button>
        </div>

        {/* Speed Controls: 0.5x, 0.75x, 1.0x, 1.25x, 1.5x, 2.0x & Slider */}
        <div className="flex items-center gap-1 sm:gap-2">
          <span className="text-xs font-semibold text-slate-500 mr-1 hidden sm:inline">Speed:</span>
          {[0.5, 0.75, 1.0, 1.25, 1.5, 2.0].map((rate) => (
            <button
              key={rate}
              onClick={() => {
                setSpeedMultiplier(rate);
                soundService.playClick();
              }}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                speedMultiplier === rate
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {rate}x
            </button>
          ))}
        </div>

        {/* Elapsed Time & Finish Button */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[11px] text-slate-400 block">Elapsed Time</span>
            <span className="text-xs font-mono font-bold text-slate-800">
              {Math.floor(elapsedSeconds / 60)}:{(elapsedSeconds % 60).toString().padStart(2, '0')}
            </span>
          </div>

          <button
            onClick={handleFinish}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-500/20 transition-all"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Finish Reading</span>
          </button>
        </div>
      </div>

      {/* Vocabulary Glossary Footer */}
      {material.vocabularyGlossary.length > 0 && (
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-soft">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-3">
            Key Vocabulary in this Article
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {material.vocabularyGlossary.map((vocab, vIdx) => (
              <div key={vIdx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-indigo-700">{vocab.word}</span>
                  <button
                    onClick={() => speechService.speak(vocab.word, 0.9)}
                    className="text-slate-400 hover:text-indigo-600 p-0.5"
                    title="Pronounce word"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-[11px] text-slate-600 mt-1">{vocab.definition}</p>
                <p className="text-[10px] text-slate-400 italic mt-1">"{vocab.example}"</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Post-Reading Comprehension Quiz Modal */}
      {showQuiz && (
        <ReadingQuizModal
          material={material}
          readingDurationSeconds={elapsedSeconds}
          calculatedWpm={calculatedWpm}
          onClose={() => {
            setShowQuiz(false);
            onBack();
          }}
          onRetry={() => {
            setShowQuiz(false);
            handleRestart();
          }}
        />
      )}
    </div>
  );
};
