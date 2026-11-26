import React, { useState } from 'react';
import { useArena } from '../../context/ArenaContext';
import { storageService } from '../../services/storageService';
import { SpeakingCard, SpeakingCardCategory, ProficiencyLevel } from '../../types';
import { SpeakingPracticeModal } from './SpeakingPracticeModal';
import { CreateSpeakingCardModal } from './CreateSpeakingCardModal';
import { 
  Layers, 
  Sparkles, 
  Compass, 
  Flame, 
  Clock, 
  Plus, 
  Play, 
  Check, 
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Trash2
} from 'lucide-react';
import { soundService } from '../../services/soundService';

export const SpeakingCardsView: React.FC = () => {
  const { level, addToCart, cart } = useArena();
  const [selectedCard, setSelectedCard] = useState<SpeakingCard | null>(null);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [levelFilter, setLevelFilter] = useState<ProficiencyLevel | 'all'>(level);
  const [categoryFilter, setCategoryFilter] = useState<SpeakingCardCategory | 'all'>('all');
  const [onlyCustomFilter, setOnlyCustomFilter] = useState<boolean>(false);
  const [showHowToPlay, setShowHowToPlay] = useState<boolean>(false);

  const [cards, setCards] = useState<SpeakingCard[]>(() => storageService.getSpeakingCards());

  const refreshCards = () => {
    setCards(storageService.getSpeakingCards());
  };

  const filteredCards = cards.filter(c => {
    if (onlyCustomFilter && !c.isCustom) return false;
    if (levelFilter !== 'all' && c.level !== levelFilter) return false;
    if (categoryFilter !== 'all' && c.category !== categoryFilter) return false;
    return true;
  });

  const categories: { id: SpeakingCardCategory | 'all'; label: string }[] = [
    { id: 'all', label: 'Semua Kategori' },
    { id: 'ice-breaker', label: 'Ice Breaker' },
    { id: 'opinion', label: 'Opini & Pendapat' },
    { id: 'would-you-rather', label: 'Would You Rather' },
    { id: 'storytelling', label: 'Bercerita (Storytelling)' },
    { id: 'debate', label: 'Debat Formal' },
    { id: 'daily-conversation', label: 'Percakapan Harian' },
    { id: 'critical-thinking', label: 'Critical Thinking' },
    { id: 'random-challenge', label: 'Tantangan Acak' },
    { id: 'professional', label: 'Profesional & Pitch' }
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
      instructions: `Berlatihlah berbicara lancar tentang "${card.title}".`,
      vocabulary: card.vocabularySuggestions
    });
  };

  const handleDeleteCustomCard = (e: React.MouseEvent, card: SpeakingCard) => {
    e.stopPropagation();
    if (window.confirm(`Hapus topik kustom "${card.title}"?`)) {
      storageService.deleteSpeakingCard(card.id);
      refreshCards();
      soundService.playClick();
    }
  };

  const customCount = cards.filter(c => c.isCustom).length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="max-w-xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold">
            <Layers className="w-3.5 h-3.5" />
            <span>Teacher Digital Speaking Deck</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Bank Speaking Cards Pengajar
          </h1>
          <p className="text-slate-600 text-sm leading-relaxed">
            Fasilitasi kelas speaking dengan 50+ kartu pemantik bicara interaktif. Anda juga dapat menambahkan topik diskusi buatan sendiri yang sesuai dengan tema silabus atau materi kelas hari ini.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 flex-shrink-0">
          <button
            onClick={() => {
              soundService.playClick();
              setShowCreateModal(true);
            }}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>+ Buat Topik Sendiri</span>
          </button>

          <button
            onClick={() => setShowHowToPlay(!showHowToPlay)}
            className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-md transition-all"
          >
            <HelpCircle className="w-4 h-4 text-amber-400" />
            <span>Panduan</span>
            {showHowToPlay ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expandable How To Play */}
      {showHowToPlay && (
        <div className="bg-gradient-to-br from-indigo-50/70 via-white to-slate-50 rounded-3xl border border-indigo-100 p-6 shadow-soft space-y-4 animate-slide-up">
          <h4 className="font-extrabold text-sm text-indigo-950">Cara Fasilitasi Speaking Cards di Kelas:</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-700">
            <div className="p-4 rounded-2xl bg-white border border-indigo-100/80 shadow-sm space-y-1">
              <span className="w-6 h-6 rounded-xl bg-indigo-600 text-white font-extrabold flex items-center justify-center text-xs">1</span>
              <strong className="block text-slate-900 pt-1">Pilih Kartu Topik Sesuai Silabus</strong>
              <p className="text-slate-500 leading-relaxed">Pilih materi yang selaras dengan tema belajar hari ini (Beginner, Intermediate, atau Advanced).</p>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-indigo-100/80 shadow-sm space-y-1">
              <span className="w-6 h-6 rounded-xl bg-indigo-600 text-white font-extrabold flex items-center justify-center text-xs">2</span>
              <strong className="block text-slate-900 pt-1">Proyeksikan / Masukkan ke Cart</strong>
              <p className="text-slate-500 leading-relaxed">Tekan "Uji Siswa" untuk membuka modal proyektor, atau klik "+" untuk menyusun rangkaian sesi.</p>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-indigo-100/80 shadow-sm space-y-1">
              <span className="w-6 h-6 rounded-xl bg-indigo-600 text-white font-extrabold flex items-center justify-center text-xs">3</span>
              <strong className="block text-slate-900 pt-1">Beri Skor & Evaluasi Langsung</strong>
              <p className="text-slate-500 leading-relaxed">Setelah siswa selesai bicara, gunakan rubrik cepat pengajar untuk mencatat skor dan memberikan XP.</p>
            </div>
          </div>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="p-5 bg-white rounded-3xl border border-slate-200/80 shadow-soft space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-slate-500 mr-1">Tingkat Kemampuan:</span>
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
            {filteredCards.length} kartu aktif
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => {
              setOnlyCustomFilter(!onlyCustomFilter);
              soundService.playClick();
            }}
            className={`flex-shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 ${
              onlyCustomFilter
                ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Topik Buatan Guru ({customCount})</span>
          </button>

          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => {
                setCategoryFilter(cat.id);
                soundService.playClick();
              }}
              className={`flex-shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                categoryFilter === cat.id
                  ? 'bg-indigo-100 text-indigo-800 font-bold border border-indigo-300'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Cards Grid with Airy Spacing */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCards.map((card) => {
          const inCart = cart.some(c => c.id === card.id);

          return (
            <div
              key={card.id}
              className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-soft hover:shadow-card hover:border-indigo-300 transition-all flex flex-col justify-between group"
            >
              <div className="space-y-3">
                {/* Meta Header */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-100">
                      {card.category.replace('-', ' ')}
                    </span>
                    {card.isCustom && (
                      <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-lg bg-blue-100 text-blue-800 border border-blue-200 flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5 text-blue-600" />
                        Guru
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-lg flex items-center gap-1 ${
                      card.level === 'beginner' 
                        ? 'bg-sky-50 text-sky-700 border border-sky-200' 
                        : card.level === 'intermediate'
                        ? 'bg-blue-50 text-blue-700'
                        : 'bg-purple-50 text-purple-700'
                    }`}>
                      {card.level === 'beginner' && <Sparkles className="w-3 h-3" />}
                      {card.level === 'intermediate' && <Compass className="w-3 h-3" />}
                      {card.level === 'advanced' && <Flame className="w-3 h-3" />}
                      <span className="capitalize">{card.level}</span>
                    </span>

                    {card.isCustom && (
                      <button
                        onClick={(e) => handleDeleteCustomCard(e, card)}
                        className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Hapus topik kustom ini"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <h3 className="font-extrabold text-base text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                  {card.title}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50/80 p-3.5 rounded-2xl border border-slate-100 line-clamp-3">
                  "{card.question}"
                </p>

                {/* Vocabulary badges */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {card.vocabularySuggestions.slice(0, 3).map((v, i) => (
                    <span key={i} className="text-[10px] px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-medium">
                      {v}
                    </span>
                  ))}
                  {card.vocabularySuggestions.length > 3 && (
                    <span className="text-[10px] px-2 py-1 text-slate-400 font-medium">
                      +{card.vocabularySuggestions.length - 3} lainnya
                    </span>
                  )}
                </div>
              </div>

              {/* Action Footer */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-mono font-medium flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {card.estimatedDuration} Detik
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleAddToCart(card)}
                    disabled={inCart}
                    className={`p-2.5 rounded-xl text-xs font-semibold border transition-all ${
                      inCart
                        ? 'bg-blue-50 border-blue-200 text-blue-700 cursor-default'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                    title={inCart ? 'Sudah di Keranjang' : 'Tambah ke Speaking Cart'}
                  >
                    {inCart ? <Check className="w-4 h-4 text-blue-600" /> : <Plus className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => {
                      soundService.playClick();
                      setSelectedCard(card);
                    }}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20 transition-all"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Uji Siswa di Kelas</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {filteredCards.length === 0 && (
          <div className="col-span-full p-12 text-center bg-white rounded-3xl border border-slate-200/80 shadow-soft space-y-4">
            <Sparkles className="w-12 h-12 text-slate-300 mx-auto" />
            <div className="space-y-1">
              <h4 className="font-bold text-slate-800 text-base">Tidak ada kartu yang sesuai filter</h4>
              <p className="text-xs text-slate-500">Coba ubah tingkat kesulitan atau pilih kategori topik lain.</p>
            </div>
            <button
              onClick={() => {
                setLevelFilter('all');
                setCategoryFilter('all');
              }}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all"
            >
              Reset Filter & Tampilkan Semua
            </button>
          </div>
        )}
      </div>

      {/* Practice Modal */}
      {selectedCard && (
        <SpeakingPracticeModal
          card={selectedCard}
          onClose={() => setSelectedCard(null)}
        />
      )}

      {/* Create Speaking Card Modal */}
      {showCreateModal && (
        <CreateSpeakingCardModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            refreshCards();
            setShowCreateModal(false);
          }}
          initialLevel={levelFilter !== 'all' ? levelFilter : 'intermediate'}
          initialCategory={categoryFilter !== 'all' ? categoryFilter : 'opinion'}
        />
      )}
    </div>
  );
};
