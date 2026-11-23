import React, { useState } from 'react';
import { useArena } from '../../context/ArenaContext';
import { storageService } from '../../services/storageService';
import { SpeakingCard, SpeakingCardCategory, ProficiencyLevel } from '../../types';
import { SpeakingPracticeModal } from './SpeakingPracticeModal';
import { 
  Layers, 
  Sparkles, 
  Compass, 
  Flame, 
  Clock, 
  Plus, 
  Play, 
  Filter, 
  Check 
} from 'lucide-react';
import { soundService } from '../../services/soundService';

export const SpeakingCardsView: React.FC = () => {
  const { level, addToCart, cart } = useArena();
  const [selectedCard, setSelectedCard] = useState<SpeakingCard | null>(null);
  const [levelFilter, setLevelFilter] = useState<ProficiencyLevel | 'all'>(level);
  const [categoryFilter, setCategoryFilter] = useState<SpeakingCardCategory | 'all'>('all');

  const cards = storageService.getSpeakingCards();

  const filteredCards = cards.filter(c => {
    if (levelFilter !== 'all' && c.level !== levelFilter) return false;
    if (categoryFilter !== 'all' && c.category !== categoryFilter) return false;
    return true;
  });

  const categories: { id: SpeakingCardCategory | 'all'; label: string }[] = [
    { id: 'all', label: 'All Categories' },
    { id: 'ice-breaker', label: 'Ice Breaker' },
    { id: 'opinion', label: 'Opinion' },
    { id: 'would-you-rather', label: 'Would You Rather' },
    { id: 'storytelling', label: 'Storytelling' },
    { id: 'debate', label: 'Debate' },
    { id: 'daily-conversation', label: 'Daily Conversation' },
    { id: 'critical-thinking', label: 'Critical Thinking' },
    { id: 'random-challenge', label: 'Random Challenge' },
    { id: 'professional', label: 'Professional' }
  ];

  const handleAddToCart = (card: SpeakingCard) => {
    addToCart({
      id: card.id,
      title: card.title,
      type: card.category === 'ice-breaker' || card.category === 'daily-conversation' ? 'appetizer' : card.category === 'debate' || card.category === 'opinion' ? 'main-course' : 'dessert',
      category: card.category,
      duration: card.estimatedDuration,
      level: card.level,
      prompt: card.question,
      instructions: `Practice speaking smoothly on "${card.title}".`,
      vocabulary: card.vocabularySuggestions
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-soft flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-2">
            <Layers className="w-3.5 h-3.5" />
            <span>Interactive Speaking Deck</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Speaking Cards
          </h1>
          <p className="text-slate-500 text-sm mt-1 max-w-xl">
            Choose a digital card to jump straight into focused speaking practice. Every card includes duration timers, vocabulary prompts, and sentence starters.
          </p>
        </div>

        {/* Level Quick Stats */}
        <div className="flex items-center gap-2 p-1.5 bg-slate-50 rounded-2xl border border-slate-200/80">
          {(['beginner', 'intermediate', 'advanced'] as const).map(lvl => {
            const count = cards.filter(c => c.level === lvl).length;
            return (
              <div key={lvl} className="px-3 py-1.5 rounded-xl text-center">
                <span className="block text-xs font-bold text-slate-800 font-mono">{count}</span>
                <span className="text-[10px] text-slate-400 capitalize font-medium">{lvl}</span>
              </div>
            );
          })}
        </div>
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
            Showing {filteredCards.length} cards
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => {
                setCategoryFilter(cat.id);
                soundService.playClick();
              }}
              className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-medium transition-all ${
                categoryFilter === cat.id
                  ? 'bg-indigo-100 text-indigo-700 font-bold border border-indigo-300'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCards.map((card) => {
          const inCart = cart.some(c => c.id === card.id);

          return (
            <div
              key={card.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-soft hover:shadow-card hover:border-indigo-200 transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Level & Category */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100">
                    {card.category.replace('-', ' ')}
                  </span>

                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 ${
                    card.level === 'beginner' 
                      ? 'bg-emerald-50 text-emerald-700' 
                      : card.level === 'intermediate'
                      ? 'bg-blue-50 text-blue-700'
                      : 'bg-purple-50 text-purple-700'
                  }`}>
                    {card.level === 'beginner' && <Sparkles className="w-3 h-3" />}
                    {card.level === 'intermediate' && <Compass className="w-3 h-3" />}
                    {card.level === 'advanced' && <Flame className="w-3 h-3" />}
                    <span className="capitalize">{card.level}</span>
                  </span>
                </div>

                {/* Card Title */}
                <h3 className="font-extrabold text-base text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                  {card.title}
                </h3>

                {/* Card Prompt */}
                <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  "{card.question}"
                </p>

                {/* Vocab preview */}
                <div className="mt-3 flex flex-wrap gap-1">
                  {card.vocabularySuggestions.slice(0, 3).map((v, i) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium">
                      {v}
                    </span>
                  ))}
                  {card.vocabularySuggestions.length > 3 && (
                    <span className="text-[10px] px-1.5 py-0.5 text-slate-400">
                      +{card.vocabularySuggestions.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {card.estimatedDuration}s
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleAddToCart(card)}
                    disabled={inCart}
                    className={`p-2 rounded-xl text-xs font-semibold border transition-all ${
                      inCart
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-700 cursor-default'
                        : 'bg-white hover:bg-slate-100 text-slate-600 border-slate-200'
                    }`}
                    title={inCart ? 'Already in Cart' : 'Add to Speaking Cart'}
                  >
                    {inCart ? <Check className="w-4 h-4 text-emerald-600" /> : <Plus className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => {
                      soundService.playClick();
                      setSelectedCard(card);
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20 transition-all"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Start</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Practice Modal */}
      {selectedCard && (
        <SpeakingPracticeModal
          card={selectedCard}
          onClose={() => setSelectedCard(null)}
        />
      )}
    </div>
  );
};
