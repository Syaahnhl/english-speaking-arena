import React, { useState } from 'react';
import { useArena } from '../../context/ArenaContext';
import { SPEAKING_CART_LIBRARY, CART_PRESETS, CartPreset } from '../../data/speakingCartPresets';
import { SpeakingSessionRunner } from './SpeakingSessionRunner';
import { 
  ShoppingBag, 
  Trash2, 
  Play, 
  Plus, 
  Check, 
  Clock, 
  Utensils, 
  Zap, 
  HelpCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { soundService } from '../../services/soundService';

export const SpeakingCartView: React.FC = () => {
  const { cart, removeFromCart, clearCart, addToCart, cartDurationMinutes } = useArena();
  const [activeSession, setActiveSession] = useState<boolean>(false);
  const [showHowToPlay, setShowHowToPlay] = useState<boolean>(false);

  const handleApplyPreset = (preset: CartPreset) => {
    clearCart();
    preset.itemIds.forEach(id => {
      const it = SPEAKING_CART_LIBRARY.find(item => item.id === id);
      if (it) addToCart(it);
    });
    soundService.playSuccess();
  };

  if (activeSession && cart.length > 0) {
    return (
      <SpeakingSessionRunner
        items={cart}
        onFinish={() => {
          setActiveSession(false);
          clearCart();
        }}
        onExit={() => setActiveSession(false)}
      />
    );
  }

  const appetizers = SPEAKING_CART_LIBRARY.filter(i => i.type === 'appetizer');
  const mainCourses = SPEAKING_CART_LIBRARY.filter(i => i.type === 'main-course');
  const desserts = SPEAKING_CART_LIBRARY.filter(i => i.type === 'dessert');

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="max-w-xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold">
            <Utensils className="w-3.5 h-3.5" />
            <span>Classroom Lesson Plan Builder</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Rangkaian Sesi Mengajar (Speaking Cart)
          </h1>
          <p className="text-slate-600 text-sm leading-relaxed">
            Rancang alur sesi mengajar speaking di kelas seperti menyusun 3 babak sajian: buka dengan <strong className="text-amber-700">Appetizer</strong> (pemanasan kelas), lanjutkan dengan <strong className="text-indigo-700">Main Course</strong> (aktivitas inti debat/roleplay), dan tutup dengan <strong className="text-pink-700">Dessert</strong> (latihan artikulasi kilat).
          </p>
        </div>

        {/* How to Play Button */}
        <button
          onClick={() => setShowHowToPlay(!showHowToPlay)}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-md transition-all flex-shrink-0"
        >
          <HelpCircle className="w-4 h-4 text-amber-400" />
          <span>Panduan Rangkaian Sesi</span>
          {showHowToPlay ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Expandable How To Play */}
      {showHowToPlay && (
        <div className="bg-gradient-to-br from-indigo-50/70 via-white to-slate-50 rounded-3xl border border-indigo-100 p-6 shadow-soft space-y-4 animate-slide-up">
          <h4 className="font-extrabold text-sm text-indigo-950">Cara Fasilitasi 3 Babak Speaking di Kelas:</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-700">
            <div className="p-4 rounded-2xl bg-white border border-amber-200 shadow-sm space-y-1">
              <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-extrabold text-[10px] uppercase">Babak 1: Appetizer</span>
              <h5 className="font-bold text-slate-900 pt-1">Pemanasan Kelas (1–2 Menit)</h5>
              <p className="text-slate-500 leading-relaxed">Cairkan suasana kelas dengan ice breaker ringan atau pertanyaan cepat untuk memancing murid berbicara.</p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-indigo-200 shadow-sm space-y-1">
              <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 font-extrabold text-[10px] uppercase">Babak 2: Main Course</span>
              <h5 className="font-bold text-slate-900 pt-1">Aktivitas Inti (3–5 Menit)</h5>
              <p className="text-slate-500 leading-relaxed">Fokus utama pembelajaran: tantang murid dengan roleplay berpasangan, opini berbobot, atau debat formal.</p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-pink-200 shadow-sm space-y-1">
              <span className="px-2 py-0.5 rounded bg-pink-100 text-pink-800 font-extrabold text-[10px] uppercase">Babak 3: Dessert</span>
              <h5 className="font-bold text-slate-900 pt-1">Refleksi & Artikulasi (1 Menit)</h5>
              <p className="text-slate-500 leading-relaxed">Penutup sesi yang menyenangkan: latih kejelasan artikulasi dengan tongue twister atau tantangan kosakata kilat.</p>
            </div>
          </div>
        </div>
      )}

      {/* Preset Buttons */}
      <div className="p-5 bg-white rounded-3xl border border-slate-200/80 shadow-soft flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Pilihan Paket Cepat (Preset):</span>
          <span className="text-xs text-slate-600 font-medium">Klik salah satu paket untuk mengisi keranjang secara otomatis</span>
        </div>

        <div className="flex flex-wrap gap-2.5">
          {CART_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handleApplyPreset(preset)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 text-xs font-bold text-slate-800 hover:text-indigo-700 transition-all shadow-sm"
            >
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>{preset.name}</span>
              <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full font-mono">
                {preset.badge}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Cart Summary & Start Session Bar */}
      <div className="p-6 bg-slate-950 text-white rounded-3xl shadow-card flex flex-col sm:flex-row items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-white">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-black text-base">Keranjang Latihan Anda</h3>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-300">
                {cart.length} Latihan Dipilih
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Estimasi Total Durasi: <strong className="text-white font-mono">{cartDurationMinutes} Menit</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          {cart.length > 0 && (
            <button
              onClick={clearCart}
              className="px-4 py-3 rounded-2xl text-xs font-semibold text-rose-300 hover:bg-rose-500/20 transition-all flex items-center gap-1.5"
            >
              <Trash2 className="w-4 h-4" />
              <span>Kosongkan</span>
            </button>
          )}

          <button
            disabled={cart.length === 0}
            onClick={() => {
              soundService.playStart();
              setActiveSession(true);
            }}
            className={`w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3 rounded-2xl font-bold text-xs shadow-lg transition-all ${
              cart.length > 0
                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/30'
                : 'bg-white/20 text-white/40 cursor-not-allowed'
            }`}
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Mulai Rangkaian Sesi</span>
          </button>
        </div>
      </div>

      {/* Selected Items List */}
      {cart.length > 0 && (
        <div className="p-5 bg-white rounded-3xl border border-slate-200/80 shadow-soft space-y-3">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Urutan Latihan dalam Keranjang:
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {cart.map((item, idx) => (
              <div
                key={item.id}
                className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2"
              >
                <div className="min-w-0 space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center font-mono">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-bold text-slate-800 truncate">{item.title}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 capitalize block ml-7">
                    {item.type.replace('-', ' ')} • {item.duration}s
                  </span>
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                  title="Hapus item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Menu Categories */}
      <div className="space-y-8">
        {/* APPETIZERS SECTION */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
            <span className="px-3 py-1 rounded-xl bg-amber-100 text-amber-800 font-extrabold text-xs uppercase tracking-wider">
              1. Appetizers (Pemanasan)
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Small talk, quick questions & ice breakers (1–2 Menit)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {appetizers.map((item) => {
              const inCart = cart.some(c => c.id === item.id);
              return (
                <div key={item.id} className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-soft flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                        {item.category}
                      </span>
                      <span className="text-xs font-mono text-slate-400">{item.duration}s</span>
                    </div>
                    <h4 className="font-extrabold text-sm text-slate-900">{item.title}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">"{item.prompt}"</p>
                  </div>
                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">{item.level}</span>
                    <button
                      onClick={() => (inCart ? removeFromCart(item.id) : addToCart(item))}
                      className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        inCart
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white'
                      }`}
                    >
                      {inCart ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                      <span>{inCart ? 'Terpilih' : 'Tambah'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* MAIN COURSES SECTION */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
            <span className="px-3 py-1 rounded-xl bg-indigo-100 text-indigo-800 font-extrabold text-xs uppercase tracking-wider">
              2. Main Courses (Latihan Inti)
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Roleplay, debat, storytelling & tantangan opini (3–4 Menit)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {mainCourses.map((item) => {
              const inCart = cart.some(c => c.id === item.id);
              return (
                <div key={item.id} className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-soft flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded">
                        {item.category}
                      </span>
                      <span className="text-xs font-mono text-slate-400">{item.duration}s</span>
                    </div>
                    <h4 className="font-extrabold text-base text-slate-900">{item.title}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed bg-slate-50/80 p-3.5 rounded-2xl border border-slate-100">
                      "{item.prompt}"
                    </p>
                  </div>
                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">{item.level}</span>
                    <button
                      onClick={() => (inCart ? removeFromCart(item.id) : addToCart(item))}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        inCart
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20'
                      }`}
                    >
                      {inCart ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                      <span>{inCart ? 'Terpilih' : 'Pilih Menu Utama'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* DESSERTS SECTION */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
            <span className="px-3 py-1 rounded-xl bg-pink-100 text-pink-800 font-extrabold text-xs uppercase tracking-wider">
              3. Desserts (Tantangan Spontan)
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Tongue twister, vocabulary sprint & reaksi cepat (1 Menit)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {desserts.map((item) => {
              const inCart = cart.some(c => c.id === item.id);
              return (
                <div key={item.id} className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-soft flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-pink-700 bg-pink-50 px-2 py-0.5 rounded">
                        {item.category}
                      </span>
                      <span className="text-xs font-mono text-slate-400">{item.duration}s</span>
                    </div>
                    <h4 className="font-extrabold text-sm text-slate-900">{item.title}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">"{item.prompt}"</p>
                  </div>
                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">{item.level}</span>
                    <button
                      onClick={() => (inCart ? removeFromCart(item.id) : addToCart(item))}
                      className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        inCart
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-pink-50 hover:bg-pink-600 text-pink-700 hover:text-white'
                      }`}
                    >
                      {inCart ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                      <span>{inCart ? 'Terpilih' : 'Tambah'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};
