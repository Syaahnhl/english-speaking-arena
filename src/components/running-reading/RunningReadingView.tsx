import React, { useState } from 'react';
import { useArena } from '../../context/ArenaContext';
import { storageService } from '../../services/storageService';
import { ReadingMaterial, ReadingGenre, ProficiencyLevel } from '../../types';
import { ReadingReader } from './ReadingReader';
import { BookOpen, Sparkles, Compass, Flame, Clock, FileText, ArrowRight, Filter } from 'lucide-react';
import { soundService } from '../../services/soundService';

export const RunningReadingView: React.FC = () => {
  const { level } = useArena();
  const [selectedMaterial, setSelectedMaterial] = useState<ReadingMaterial | null>(null);
  const [levelFilter, setLevelFilter] = useState<ProficiencyLevel | 'all'>(level);
  const [genreFilter, setGenreFilter] = useState<ReadingGenre | 'all'>('all');

  const materials = storageService.getReadingMaterials();

  const filteredMaterials = materials.filter(m => {
    if (levelFilter !== 'all' && m.level !== levelFilter) return false;
    if (genreFilter !== 'all' && m.genre !== genreFilter) return false;
    return true;
  });

  const genres: { id: ReadingGenre | 'all'; label: string }[] = [
    { id: 'all', label: 'All Genres' },
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
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-700 via-indigo-600 to-violet-700 text-white p-6 sm:p-8 shadow-card">
        <div className="max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold tracking-wide mb-3">
            <BookOpen className="w-3.5 h-3.5 text-indigo-200" />
            <span>Fluency Velocity Trainer</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Running Reading
          </h1>
          <p className="text-indigo-100 text-sm mt-2 leading-relaxed">
            Train your eyes, vocal rhythm, and comprehension speed. Customize text speed from 0.5x to 2.0x, follow real-time sentence tracking, and test your retention with instant quizzes.
          </p>
        </div>

        {/* Decorative elements */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/5 skew-x-12 pointer-events-none" />
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-soft space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Level Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-500 mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Level:
            </span>
            {(['all', 'beginner', 'intermediate', 'advanced'] as const).map(lvl => (
              <button
                key={lvl}
                onClick={() => {
                  setLevelFilter(lvl);
                  soundService.playClick();
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                  levelFilter === lvl
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          <div className="text-xs text-slate-400 font-medium">
            Showing {filteredMaterials.length} of {materials.length} reading texts
          </div>
        </div>

        {/* Genre Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1">
          {genres.map(g => (
            <button
              key={g.id}
              onClick={() => {
                setGenreFilter(g.id);
                soundService.playClick();
              }}
              className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-medium transition-all ${
                genreFilter === g.id
                  ? 'bg-indigo-100 text-indigo-700 font-bold border border-indigo-300'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>
      </div>

      {/* Reading Materials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredMaterials.map((mat) => {
          const estimatedMinutes = Math.max(1, Math.round(mat.wordCount / 140));

          return (
            <div
              key={mat.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-soft hover:shadow-card hover:border-indigo-200 transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Meta Header */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100">
                    {mat.genre.replace('-', ' ')}
                  </span>

                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 ${
                    mat.level === 'beginner' 
                      ? 'bg-emerald-50 text-emerald-700' 
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

                <h3 className="font-extrabold text-base text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                  {mat.title}
                </h3>
                <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                  {mat.summary}
                </p>
              </div>

              {/* Stats & Launch Action */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                  <span className="flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5 text-slate-400" />
                    {mat.wordCount} words
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    ~{estimatedMinutes} min
                  </span>
                </div>

                <button
                  onClick={() => {
                    soundService.playClick();
                    setSelectedMaterial(mat);
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white transition-all shadow-sm"
                >
                  <span>Start Reading</span>
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
