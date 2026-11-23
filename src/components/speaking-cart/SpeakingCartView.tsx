import React, { useState } from 'react';
import { useArena } from '../../context/ArenaContext';
import { SPEAKING_CART_LIBRARY, CART_PRESETS, CartPreset } from '../../data/speakingCartPresets';
import { SpeakingCartItem } from '../../types';
import { SpeakingSessionRunner } from './SpeakingSessionRunner';
import { 
  ShoppingBag, 
  Trash2, 
  Play, 
  Plus, 
  Check, 
  Clock, 
  Utensils, 
  Sparkles, 
  Zap, 
  CheckCircle2 
} from 'lucide-react';
import { soundService } from '../../services/soundService';

export const SpeakingCartView: React.FC = () => {
  const { cart, removeFromCart, clearCart, addToCart, cartDurationMinutes } = useArena();
  const [activeSession, setActiveSession] = useState<boolean>(false);
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<'all' | 'appetizer' | 'main-course' | 'dessert'>('all');

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
      {/* Hero */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-soft flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-2">
            <Utensils className="w-3.5 h-3.5" />
            <span>Speaking Menu & Cart</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Design Your Speaking Session
          </h1>
          <p className="text-slate-500 text-sm mt-1 max-w-xl">
            Order your custom practice meal! Start with a light <strong className="text-amber-700">Appetizer</strong> warm-up, dive into a meaty <strong className="text-indigo-700">Main Course</strong> debate, and finish with a snappy <strong className="text-pink-700">Dessert</strong> sprint.
          </p>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-col gap-2 w-full md:w-auto">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Quick Presets:</span>
          <div className="flex flex-wrap gap-2">
            {CART_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => handleApplyPreset(preset)}
                className="px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 text-left transition-all group"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 group-hover:text-indigo-600">
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  <span>{preset.name}</span>
                  <span className="text-[10px] bg-slate-200 group-hover:bg-indigo-100 text-slate-600 group-hover:text-indigo-700 px-1.5 py-0.5 rounded font-mono">
                    {preset.badge}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Cart Summary & Start Session Bar */}
      <div className="p-5 bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white rounded-3xl shadow-card flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-base">Your Active Speaking Cart</h3>
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-white/20">
                {cart.length} {cart.length === 1 ? 'dish' : 'dishes'}
              </span>
            </div>
            <p className="text-xs text-indigo-200 mt-0.5">
              Estimated Total Duration: <strong className="text-white font-mono">{cartDurationMinutes} mins</strong> ({cart.reduce((a, b) => a + b.duration, 0)} seconds)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {cart.length > 0 && (
            <button
              onClick={clearCart}
              className="px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-300 hover:bg-rose-500/20 transition-all flex items-center gap-1"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear</span>
            </button>
          )}

          <button
            disabled={cart.length === 0}
            onClick={() => {
              soundService.playStart();
              setActiveSession(true);
            }}
            className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs shadow-lg transition-all ${
              cart.length > 0
                ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/30'
                : 'bg-white/20 text-white/40 cursor-not-allowed'
            }`}
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Serve Menu & Start Session</span>
          </button>
        </div>
      </div>

      {/* Cart Selected Items Preview (if any) */}
      {cart.length > 0 && (
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-soft">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
            Selected Courses in Your Order:
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {cart.map((item, idx) => (
              <div
                key={item.id}
                className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center font-mono">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-bold text-slate-800 truncate">{item.title}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 capitalize block ml-5">
                    {item.type.replace('-', ' ')} • {item.duration}s
                  </span>
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                  title="Remove from cart"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Menu Categories / The Menu Card */}
      <div className="space-y-8">
        {/* APPETIZERS SECTION */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
            <span className="px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-800 font-extrabold text-xs uppercase tracking-wider">
              Appetizers
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Small talk, quick questions & ice breakers (1-2 mins)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {appetizers.map((item) => {
              const inCart = cart.some(c => c.id === item.id);
              return (
                <div key={item.id} className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-soft flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                        {item.category}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">{item.duration}s</span>
                    </div>
                    <h4 className="font-bold text-sm text-slate-900">{item.title}</h4>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">"{item.prompt}"</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">{item.level}</span>
                    <button
                      onClick={() => (inCart ? removeFromCart(item.id) : addToCart(item))}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        inCart
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white'
                      }`}
                    >
                      {inCart ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                      <span>{inCart ? 'Added' : 'Add Dish'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* MAIN COURSES SECTION */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
            <span className="px-2.5 py-0.5 rounded-md bg-indigo-100 text-indigo-800 font-extrabold text-xs uppercase tracking-wider">
              Main Courses
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Roleplay, debate, storytelling & opinion challenges (3-4 mins)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mainCourses.map((item) => {
              const inCart = cart.some(c => c.id === item.id);
              return (
                <div key={item.id} className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-soft flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                        {item.category}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">{item.duration}s</span>
                    </div>
                    <h4 className="font-extrabold text-base text-slate-900">{item.title}</h4>
                    <p className="text-xs text-slate-600 mt-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      "{item.prompt}"
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">{item.level}</span>
                    <button
                      onClick={() => (inCart ? removeFromCart(item.id) : addToCart(item))}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        inCart
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20'
                      }`}
                    >
                      {inCart ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                      <span>{inCart ? 'Selected' : 'Add Main Course'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* DESSERTS SECTION */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
            <span className="px-2.5 py-0.5 rounded-md bg-pink-100 text-pink-800 font-extrabold text-xs uppercase tracking-wider">
              Desserts
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Rapid fire, vocabulary sprints & tongue twisters (1 min)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {desserts.map((item) => {
              const inCart = cart.some(c => c.id === item.id);
              return (
                <div key={item.id} className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-soft flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-pink-700 bg-pink-50 px-2 py-0.5 rounded">
                        {item.category}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">{item.duration}s</span>
                    </div>
                    <h4 className="font-bold text-sm text-slate-900">{item.title}</h4>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">"{item.prompt}"</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">{item.level}</span>
                    <button
                      onClick={() => (inCart ? removeFromCart(item.id) : addToCart(item))}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        inCart
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-pink-50 hover:bg-pink-600 text-pink-700 hover:text-white'
                      }`}
                    >
                      {inCart ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                      <span>{inCart ? 'Added' : 'Add Dessert'}</span>
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
