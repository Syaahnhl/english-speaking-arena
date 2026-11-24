import React, { useState, useEffect, useRef } from 'react';
import { ReadingMaterial } from '../../types';
import { ReadingQuizModal } from './ReadingQuizModal';
import { soundService } from '../../services/soundService';
import { speechService } from '../../services/speechService';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Sliders, 
  Sun, 
  Moon, 
  Coffee, 
  CheckCircle, 
  ArrowLeft,
  HelpCircle,
  Eye,
  FastForward,
  ChevronUp,
  Volume2,
  VolumeX,
  Gauge
} from 'lucide-react';

interface Props {
  material: ReadingMaterial;
  onBack: () => void;
}

type ReadingTheme = 'dark' | 'light' | 'warm';
type FontSize = 'sm' | 'md' | 'lg' | 'xl';

export const ReadingReader: React.FC<Props> = ({ material, onBack }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1.0);
  const [theme, setTheme] = useState<ReadingTheme>('dark'); // Teleprompter dark by default for optimal readability
  const [fontSize, setFontSize] = useState<FontSize>('lg');
  const [showGuideModal, setShowGuideModal] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [showQuiz, setShowQuiz] = useState<boolean>(false);
  const [ttsEnabled, setTtsEnabled] = useState<boolean>(false);

  // Time & scroll tracking
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [scrollProgress, setScrollProgress] = useState<number>(0); // 0 to 100%

  const viewportRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const lastTimestampRef = useRef<number | null>(null);
  const currentScrollTopRef = useRef<number>(0);

  // Pixel velocity:
  // At 1.0x, typical comfortable reading scroll speed is ~35 pixels per second.
  // With multiplier: 0.5x = 18px/s, 1.0x = 36px/s, 1.5x = 54px/s, 2.0x = 72px/s
  const basePixelsPerSecond = 38;
  const pixelsPerSecond = basePixelsPerSecond * speedMultiplier;

  // Elapsed timer
  useEffect(() => {
    let timer: any = null;
    if (isPlaying) {
      timer = setInterval(() => {
        setElapsedSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying]);

  // Teleprompter animation loop
  useEffect(() => {
    if (!isPlaying) {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
        animFrameIdRef.current = null;
      }
      lastTimestampRef.current = null;
      return;
    }

    const viewport = viewportRef.current;
    const content = contentRef.current;
    if (!viewport || !content) return;

    const maxScroll = Math.max(0, content.offsetHeight + viewport.offsetHeight * 0.4);

    const step = (timestamp: number) => {
      if (lastTimestampRef.current === null) {
        lastTimestampRef.current = timestamp;
      }
      const deltaSec = (timestamp - lastTimestampRef.current) / 1000;
      lastTimestampRef.current = timestamp;

      // Advance scroll position upwards
      currentScrollTopRef.current += pixelsPerSecond * deltaSec;

      if (viewport) {
        viewport.scrollTop = currentScrollTopRef.current;

        const maxReadableScroll = content.offsetHeight - viewport.offsetHeight * 0.3;
        const progress = Math.min(100, Math.round((currentScrollTopRef.current / maxReadableScroll) * 100));
        setScrollProgress(Math.max(0, progress));

        // When text has scrolled past the viewport
        if (currentScrollTopRef.current >= maxScroll) {
          setIsPlaying(false);
          soundService.playSuccess();
          return;
        }
      }

      animFrameIdRef.current = requestAnimationFrame(step);
    };

    animFrameIdRef.current = requestAnimationFrame(step);

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [isPlaying, speedMultiplier]);

  const handleTogglePlay = () => {
    soundService.playClick();
    if (!isPlaying) {
      // Start
      setIsPlaying(true);
      if (ttsEnabled) {
        speechService.speak(material.paragraphs.join(' '), speedMultiplier);
      }
    } else {
      // Pause
      setIsPlaying(false);
      speechService.stop();
    }
  };

  const handleRewind = () => {
    soundService.playClick();
    if (viewportRef.current) {
      const rewindPixels = 150;
      currentScrollTopRef.current = Math.max(0, currentScrollTopRef.current - rewindPixels);
      viewportRef.current.scrollTop = currentScrollTopRef.current;
      setScrollProgress(Math.round((currentScrollTopRef.current / (contentRef.current?.offsetHeight || 1)) * 100));
    }
  };

  const handleRestart = () => {
    soundService.playClick();
    setIsPlaying(false);
    speechService.stop();
    currentScrollTopRef.current = 0;
    if (viewportRef.current) {
      viewportRef.current.scrollTop = 0;
    }
    setScrollProgress(0);
    setElapsedSeconds(0);
  };

  const handleFinish = () => {
    setIsPlaying(false);
    speechService.stop();
    soundService.playSuccess();
    setShowQuiz(true);
  };

  // Estimated WPM calculation
  const timeInMinutes = Math.max(0.1, elapsedSeconds / 60);
  const calculatedWpm = Math.round(material.wordCount / timeInMinutes);

  // Theme styling definitions
  const themeStyles = {
    dark: {
      outer: 'bg-slate-950 border-slate-800 text-slate-100',
      teleprompter: 'bg-[#090d16] text-slate-100',
      paragraph: 'text-slate-200 text-center',
      guideLine: '',
      mask: 'from-[#090d16] via-transparent to-[#090d16]'
    },
    light: {
      outer: 'bg-white border-slate-200 text-slate-900',
      teleprompter: 'bg-slate-50 text-slate-900',
      paragraph: 'text-slate-800 text-center',
      guideLine: '',
      mask: 'from-slate-50 via-transparent to-slate-50'
    },
    warm: {
      outer: 'bg-[#faf6ee] border-[#e8dfcf] text-[#2c2419]',
      teleprompter: 'bg-[#f4ede1] text-[#2c2419]',
      paragraph: 'text-[#382f22] text-center',
      guideLine: '',
      mask: 'from-[#f4ede1] via-transparent to-[#f4ede1]'
    }
  };

  const fontSizes = {
    sm: 'text-base leading-relaxed',
    md: 'text-lg sm:text-xl leading-loose',
    lg: 'text-xl sm:text-2xl leading-loose tracking-wide',
    xl: 'text-2xl sm:text-3xl leading-loose tracking-wider'
  };

  const currentTheme = themeStyles[theme];

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      {/* Top Header & Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={() => {
            speechService.stop();
            onBack();
          }}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 rounded-xl border border-slate-200 shadow-sm transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Perpustakaan</span>
        </button>

        <div className="flex items-center gap-2">
          {/* How to Play Guide Button */}
          <button
            onClick={() => setShowGuideModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 transition-all"
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
            <span>Cara Main & Aturan</span>
          </button>

          {/* Settings Toggle */}
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-sm transition-all"
          >
            <Sliders className="w-3.5 h-3.5 text-slate-500" />
            <span>Kustomisasi Tampilan</span>
          </button>
        </div>
      </div>

      {/* HOW TO PLAY MODAL / POPUP */}
      {showGuideModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-float border border-slate-200 animate-slide-up space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-amber-100 text-amber-800">
                  <Gauge className="w-5 h-5 text-amber-600" />
                </span>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">Panduan Running Reading</h3>
                  <span className="text-xs text-slate-500">Mekanisme Teleprompter Velocity</span>
                </div>
              </div>
              <button
                onClick={() => setShowGuideModal(false)}
                className="text-xs text-slate-400 hover:text-slate-700 font-semibold px-2 py-1"
              >
                Tutup
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
              <div className="p-3 bg-indigo-50/70 rounded-2xl border border-indigo-100">
                <strong className="text-indigo-900 block mb-1">Konsep Permainan:</strong>
                Teks bacaan akan bergerak merayap ke atas secara berkelanjutan seperti layar teleprompter berita profesional. Kalimat yang sudah lewat ke atas akan menghilang. Tantangannya: Anda harus membaca dan mencerna isi bacaan sebelum teks tersebut tergulung habis!
              </div>

              <div className="space-y-2">
                <strong className="text-slate-800 block">Langkah & Aturan Main:</strong>
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center flex-shrink-0">1</span>
                  <span><strong>Atur Kecepatan:</strong> Pilih multiplier kecepatan (0.5x untuk santai, 1.0x kecepatan normal, hingga 2.0x untuk tantangan membaca cepat).</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center flex-shrink-0">2</span>
                  <span><strong>Fokuskan Pandangan:</strong> Letakkan mata Anda di sekitar <em>Garis Pandu Tengah</em>. Baca kalimat saat bergerak melintasi garis tersebut.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center flex-shrink-0">3</span>
                  <span><strong>Jangan Terlalu Lambat:</strong> Jika Anda berhenti terlalu lama, teks akan hilang ke atas dan Anda kehilangan informasi penting!</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center flex-shrink-0">4</span>
                  <span><strong>Kuis Pemahaman:</strong> Segera setelah teks habis bergulir ke atas, jawab pertanyaan pemahaman untuk membuktikan retensi ingatan Anda dan mengklaim XP.</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowGuideModal(false)}
              className="w-full py-2.5 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition-all"
            >
              Saya Siap Membaca!
            </button>
          </div>
        </div>
      )}

      {/* Settings Bar (Collapsible) */}
      {showSettings && (
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-soft grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs animate-slide-up">
          {/* Theme */}
          <div>
            <label className="block font-bold text-slate-700 mb-1.5">Tema Warna Layar</label>
            <div className="flex gap-1.5">
              <button
                onClick={() => setTheme('dark')}
                className={`flex-1 py-1.5 rounded-lg border flex items-center justify-center gap-1 ${
                  theme === 'dark' ? 'bg-slate-900 border-blue-500 font-bold text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                <Moon className="w-3.5 h-3.5" /> Studio Gelap
              </button>
              <button
                onClick={() => setTheme('light')}
                className={`flex-1 py-1.5 rounded-lg border flex items-center justify-center gap-1 ${
                  theme === 'light' ? 'bg-blue-50 border-blue-600 font-bold text-blue-700' : 'bg-slate-100 text-slate-600'
                }`}
              >
                <Sun className="w-3.5 h-3.5" /> Terang
              </button>
              <button
                onClick={() => setTheme('warm')}
                className={`flex-1 py-1.5 rounded-lg border flex items-center justify-center gap-1 ${
                  theme === 'warm' ? 'bg-amber-100 border-amber-600 font-bold text-amber-900' : 'bg-slate-100 text-slate-600'
                }`}
              >
                <Coffee className="w-3.5 h-3.5" /> Kertas Hangat
              </button>
            </div>
          </div>

          {/* Font Size */}
          <div>
            <label className="block font-bold text-slate-700 mb-1.5">Ukuran Teks</label>
            <div className="flex gap-1">
              {(['sm', 'md', 'lg', 'xl'] as FontSize[]).map(sz => (
                <button
                  key={sz}
                  onClick={() => setFontSize(sz)}
                  className={`flex-1 py-1.5 rounded-lg border uppercase font-bold text-[11px] ${
                    fontSize === sz ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  {sz === 'sm' ? 'Sedang' : sz === 'md' ? 'Besar' : sz === 'lg' ? 'XL' : 'XXL'}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MAIN TELEPROMPTER CONTAINER */}
      <div className={`rounded-3xl border shadow-card overflow-hidden transition-colors duration-200 ${currentTheme.outer}`}>
        {/* Teleprompter Top Status Bar */}
        <div className="px-6 py-4 border-b border-inherit/20 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-500/20 text-sky-400">
              {material.genre.replace('-', ' ')}
            </span>
            <span className="opacity-70 font-medium">
              {material.wordCount} Kata • Level: {material.level.toUpperCase()}
            </span>
          </div>

          {/* Active speed indicator */}
          <div className="flex items-center gap-2 font-mono">
            <span className="opacity-70">Kecepatan:</span>
            <span className="px-2 py-0.5 rounded bg-blue-500/20 font-bold text-sky-400">
              {speedMultiplier}x ({Math.round(160 * speedMultiplier)} WPM)
            </span>
          </div>
        </div>

        {/* Viewport Frame with Fading Top and Bottom Edges */}
        <div className="relative h-[420px] sm:h-[480px] overflow-hidden select-none">
          {/* Top Fade Gradient Mask (Text disappears as it scrolls into here!) */}
          <div className={`absolute top-0 left-0 right-0 h-24 bg-gradient-to-b ${currentTheme.mask} z-20 pointer-events-none`} />

          {/* Bottom Fade Gradient Mask */}
          <div className={`absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t ${currentTheme.mask} z-20 pointer-events-none`} />

          {/* Scrollable Viewport Container */}
          <div
            ref={viewportRef}
            className={`w-full h-full overflow-y-hidden px-8 sm:px-16 pt-32 pb-48 transition-all ${currentTheme.teleprompter}`}
          >
            <div ref={contentRef} className="max-w-2xl mx-auto space-y-12 text-center">
              {/* Title & Introduction */}
              <div className="text-center pt-8 pb-4 border-b border-inherit/20">
                <span className="text-xs uppercase font-extrabold tracking-widest text-sky-400 block mb-2">
                  TELEPROMPTER SPEED DRILL
                </span>
                <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-snug">
                  {material.title}
                </h1>
                <p className="text-xs opacity-60 mt-3 max-w-lg mx-auto">
                  {material.summary}
                </p>
              </div>

              {/* Reading Paragraphs that scroll continuously upwards (CENTER ALIGNED) */}
              {material.paragraphs.map((paragraph, pIdx) => (
                <p
                  key={pIdx}
                  className={`font-medium transition-all text-center ${fontSizes[fontSize]} ${currentTheme.paragraph}`}
                >
                  {paragraph}
                </p>
              ))}

              {/* End of Text Marker */}
              <div className="text-center py-12 border-t border-inherit/20">
                <span className="text-xs uppercase font-bold tracking-widest text-emerald-400 block">
                  ✓ AKHIR BACAAN
                </span>
                <p className="text-sm opacity-70 mt-1">
                  Selamat! Teks telah selesai tergulung. Klik tombol di bawah untuk mengerjakan kuis.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Real-time Progress Bar */}
        <div className="px-6 py-2 border-t border-inherit/20 bg-inherit/40 flex items-center gap-3 text-xs">
          <span className="opacity-70 font-mono text-[11px] w-20">Gulir: {scrollProgress}%</span>
          <div className="flex-1 h-2 bg-slate-700/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-500 transition-all duration-150"
              style={{ width: `${scrollProgress}%` }}
            />
          </div>
          <span className="opacity-70 font-mono text-[11px]">
            {Math.floor(elapsedSeconds / 60)}:{(elapsedSeconds % 60).toString().padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* SPEED & PLAYBACK CONTROL CONSOLE */}
      <div className="p-5 bg-white rounded-3xl border border-slate-200/80 shadow-soft flex flex-wrap items-center justify-between gap-4">
        {/* Left: Play, Pause, Rewind, Reset */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleTogglePlay}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-xs shadow-md transition-all ${
              isPlaying
                ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/20'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/20'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4" />
                <span>Jeda Gulir</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>{scrollProgress > 0 ? 'Lanjutkan Gulir' : 'Mulai Teleprompter'}</span>
              </>
            )}
          </button>

          <button
            onClick={handleRewind}
            disabled={scrollProgress === 0}
            className="p-3 rounded-2xl border border-slate-200 text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            title="Mundurkan Gulir Sedikit"
          >
            <ChevronUp className="w-4 h-4" />
          </button>

          <button
            onClick={handleRestart}
            className="p-3 rounded-2xl border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-all"
            title="Ulangi dari Awal"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Voice Assistant Toggle */}
          <button
            onClick={() => {
              setTtsEnabled(!ttsEnabled);
              if (ttsEnabled) speechService.stop();
            }}
            className={`flex items-center gap-1.5 px-3 py-2.5 rounded-2xl border text-xs font-semibold transition-all ${
              ttsEnabled
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
            title="Bantuan Suara Narator"
          >
            {ttsEnabled ? <Volume2 className="w-4 h-4 text-emerald-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
            <span className="hidden sm:inline">Narator Suara</span>
          </button>
        </div>

        {/* Center: Velocity Buttons (0.5x, 0.75x, 1.0x, 1.25x, 1.5x, 2.0x) */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1 hidden md:inline">
            Kecepatan:
          </span>
          {[0.5, 0.75, 1.0, 1.25, 1.5, 2.0].map((rate) => (
            <button
              key={rate}
              onClick={() => {
                setSpeedMultiplier(rate);
                soundService.playClick();
              }}
              className={`px-3 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                speedMultiplier === rate
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {rate}x
            </button>
          ))}
        </div>

        {/* Right: Quiz Trigger */}
        <button
          onClick={handleFinish}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-500/20 transition-all ml-auto sm:ml-0"
        >
          <CheckCircle className="w-4 h-4" />
          <span>Selesai & Kuis Pemahaman</span>
        </button>
      </div>

      {/* Vocabulary Glossary Drawer */}
      {material.vocabularyGlossary.length > 0 && (
        <div className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="font-extrabold text-sm text-slate-900">Kosakata Kunci dalam Artikel Ini</h4>
              <p className="text-xs text-slate-500">Klik ikon suara untuk mendengarkan pengucapan yang tepat.</p>
            </div>
            <span className="text-xs font-mono text-slate-400">{material.vocabularyGlossary.length} kosakata</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {material.vocabularyGlossary.map((vocab, vIdx) => (
              <div key={vIdx} className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-indigo-700">{vocab.word}</span>
                  <button
                    onClick={() => speechService.speak(vocab.word, 0.9)}
                    className="text-slate-400 hover:text-indigo-600 p-1"
                    title="Dengarkan pengucapan"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-[11px] text-slate-600 leading-snug">{vocab.definition}</p>
                <p className="text-[10px] text-slate-400 italic">"{vocab.example}"</p>
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
