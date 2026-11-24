import React, { useState } from 'react';
import { useArena } from '../../context/ArenaContext';
import { storageService } from '../../services/storageService';
import { ReadingMaterial, ReadingGenre, ProficiencyLevel } from '../../types';
import { ReadingReader } from './ReadingReader';
import { 
  BookOpen, 
  Sparkles, 
  Compass, 
  Flame, 
  Clock, 
  FileText, 
  ArrowRight, 
  HelpCircle,
  Zap,
  Gauge,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { soundService } from '../../services/soundService';

export const RunningReadingView: React.FC = () => {
  const { level } = useArena();
  const [selectedMaterial, setSelectedMaterial] = useState<ReadingMaterial | null>(null);
  const [levelFilter, setLevelFilter] = useState<ProficiencyLevel | 'all'>(level);
  const [genreFilter, setGenreFilter] = useState<ReadingGenre | 'all'>('all');
  const [showHowToPlay, setShowHowToPlay] = useState<boolean>(false);

  const materials = storageService.getReadingMaterials();

  const filteredMaterials = materials.filter(m => {
    if (levelFilter !== 'all' && m.level !== levelFilter) return false;
    if (genreFilter !== 'all' && m.genre !== genreFilter) return false;
    return true;
  });

  const genres: { id: ReadingGenre | 'all'; label: string }[] = [
    { id: 'all', label: 'Semua Genre' },
    { id: 'short-stories', label: 'Short Stories' },
    { id: 'daily-conversations', label: 'Daily Conversations' },
    { id: 'news-articles', label: 'News & Articles' },
    { id: 'educational', label: 'Educational' },
    { id: 'interesting-facts', label: 'Interesting Facts' },
    { id: 'professional', label: 'Professional' }
  ];

  if (selectedMaterial) {
    return (
      <ReadingReader
        material={selectedMaterial}
        onBack={() => setSelectedMaterial(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Hero Banner with Modern Crisp Aesthetic */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="max-w-xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold tracking-wide">
            <Gauge className="w-3.5 h-3.5 text-indigo-600" />
            <span>Classroom Teleprompter Suite</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Teleprompter Kecepatan Baca Kelas
          </h1>
          <p className="text-slate-600 text-sm leading-relaxed">
            Pandu latihan membaca cepat dan fluency di depan kelas. Proyeksikan teks teleprompter ke layar proyektor, atur kecepatan baca murid (0.5x – 2.0x), dan uji pemahaman dengan kuis interaktif.
          </p>
        </div>

        {/* How to Play Card Button */}
        <button
          onClick={() => setShowHowToPlay(!showHowToPlay)}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-md transition-all flex-shrink-0"
        >
          <HelpCircle className="w-4 h-4 text-amber-400" />
          <span>Panduan Guru & Kecepatan</span>
          {showHowToPlay ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Expandable "Cara Main / How It Works" Card */}
      {showHowToPlay && (
        <div className="bg-gradient-to-br from-indigo-50/80 via-white to-slate-50 rounded-3xl border border-indigo-100 p-6 shadow-soft animate-slide-up space-y-4">
          <div className="flex items-center gap-2 text-indigo-900 font-extrabold text-sm">
            <Zap className="w-4 h-4 text-amber-500" />
            <span>Cara Memandu Running Reading di Depan Kelas:</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs text-slate-700">
            <div className="p-4 rounded-2xl bg-white border border-indigo-100/80 shadow-sm space-y-1">
              <span className="w-6 h-6 rounded-xl bg-indigo-600 text-white font-extrabold flex items-center justify-center text-xs">1</span>
              <h4 className="font-bold text-slate-900 pt-1">Pilih Teks & Tingkat</h4>
              <p className="text-slate-500 leading-relaxed">Pilih artikel bacaan sesuai tingkat kemahiran murid (Beginner, Intermediate, atau Advanced).</p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-indigo-100/80 shadow-sm space-y-1">
              <span className="w-6 h-6 rounded-xl bg-indigo-600 text-white font-extrabold flex items-center justify-center text-xs">2</span>
              <h4 className="font-bold text-slate-900 pt-1">Atur Kecepatan Layar</h4>
              <p className="text-slate-500 leading-relaxed">Pilih kecepatan 0.5x hingga 2.0x di teleprompter sesuai kemampuan membaca nyaring murid.</p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-indigo-100/80 shadow-sm space-y-1">
              <span className="w-6 h-6 rounded-xl bg-indigo-600 text-white font-extrabold flex items-center justify-center text-xs">3</span>
              <h4 className="font-bold text-slate-900 pt-1">Fokus Garis Baca</h4>
              <p className="text-slate-500 leading-relaxed">Teks bergerak ke atas konstan. Murid dilatih membaca cepat sebelum kalimat tergulung hilang ke atas.</p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-indigo-100/80 shadow-sm space-y-1">
              <span className="w-6 h-6 rounded-xl bg-indigo-600 text-white font-extrabold flex items-center justify-center text-xs">4</span>
              <h4 className="font-bold text-slate-900 pt-1">Kuis Pemahaman Bersama</h4>
              <p className="text-slate-500 leading-relaxed">Uji pemahaman isi bacaan bersama kelas melalui kuis interaktif setelah sesi membaca selesai.</p>
            </div>
          </div>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="p-5 bg-white rounded-3xl border border-slate-200/80 shadow-soft space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Level Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-slate-500 mr-1">Tingkat Kesulitan:</span>
            {(['all', 'beginner', 'intermediate', 'advanced'] as const).map(lvl => (
              <button
                key={lvl}
                onClick={() => {
                  setLevelFilter(lvl);
                  soundService.playClick();
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                  levelFilter === lvl
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {lvl === 'all' ? 'Semua' : lvl}
              </button>
            ))}
          </div>

          <div className="text-xs text-slate-400 font-mono">
            {filteredMaterials.length} bacaan tersedia
          </div>
        </div>

        {/* Genre Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {genres.map(g => (
            <button
              key={g.id}
              onClick={() => {
                setGenreFilter(g.id);
                soundService.playClick();
              }}
              className={`flex-shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                genreFilter === g.id
                  ? 'bg-indigo-100 text-indigo-800 font-bold border border-indigo-300'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>
      </div>

      {/* Reading Materials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredMaterials.map((mat) => {
          const estimatedMinutes = Math.max(1, Math.round(mat.wordCount / 150));

          return (
            <div
              key={mat.id}
              className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-soft hover:shadow-card hover:border-indigo-300 transition-all flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-100">
                    {mat.genre.replace('-', ' ')}
                  </span>

                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-lg flex items-center gap-1 ${
                    mat.level === 'beginner' 
                      ? 'bg-sky-50 text-sky-700 border border-sky-200' 
                      : mat.level === 'intermediate'
                      ? 'bg-blue-50 text-blue-700'
                      : 'bg-purple-50 text-purple-700'
                  }`}>
                    {mat.level === 'beginner' && <Sparkles className="w-3 h-3" />}
                    {mat.level === 'intermediate' && <Compass className="w-3 h-3" />}
                    {mat.level === 'advanced' && <Flame className="w-3 h-3" />}
                    <span className="capitalize">{mat.level}</span>
                  </span>
                </div>

                <h3 className="font-extrabold text-lg text-slate-900 group-hover:text-indigo-600 transition-colors">
                  {mat.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                  {mat.summary}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs text-slate-500 font-medium">
                  <span className="flex items-center gap-1">
                    <FileText className="w-4 h-4 text-slate-400" />
                    {mat.wordCount} kata
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4 text-slate-400" />
                    ~{estimatedMinutes} menit
                  </span>
                </div>

                <button
                  onClick={() => {
                    soundService.playClick();
                    setSelectedMaterial(mat);
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20 transition-all"
                >
                  <span>Mulai Teleprompter</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
