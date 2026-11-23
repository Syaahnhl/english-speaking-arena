import React, { useState } from 'react';
import { useArena } from '../../context/ArenaContext';
import { 
  LayoutDashboard, 
  Layers, 
  BookOpen, 
  Trophy, 
  MoreHorizontal, 
  ShoppingBag, 
  Theater, 
  Mic2, 
  BarChart3, 
  GraduationCap, 
  X 
} from 'lucide-react';

export const MobileNav: React.FC = () => {
  const { activeTab, setActiveTab, cart, role } = useArena();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const primaryItems = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'cards', label: 'Cards', icon: Layers },
    { id: 'reading', label: 'Reading', icon: BookOpen },
    { id: 'arena', label: 'Arena', icon: Trophy },
  ];

  const moreItems = [
    { id: 'cart', label: 'Speaking Cart', icon: ShoppingBag, badge: cart.length > 0 ? `${cart.length}` : undefined },
    { id: 'roleplay', label: 'Secret Roleplay', icon: Theater },
    { id: 'interactive', label: 'Interactive Studio', icon: Mic2 },
    { id: 'progress', label: 'My Progress', icon: BarChart3 },
    ...(role === 'teacher' ? [{ id: 'teacher', label: 'Teacher Dashboard', icon: GraduationCap }] : []),
  ];

  return (
    <>
      {/* Bottom Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-2 py-2 flex items-center justify-around">
        {primaryItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setDrawerOpen(false);
              }}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
                isActive ? 'text-indigo-600 font-bold scale-105' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] mt-0.5">{item.label}</span>
            </button>
          );
        })}

        {/* More Button */}
        <button
          onClick={() => setDrawerOpen(true)}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
            drawerOpen || moreItems.some(m => m.id === activeTab)
              ? 'text-indigo-600 font-bold'
              : 'text-slate-500'
          }`}
        >
          <MoreHorizontal className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">More</span>
        </button>
      </nav>

      {/* Drawer for More items */}
      {drawerOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex flex-col justify-end">
          <div className="bg-white rounded-t-3xl p-6 shadow-float border-t border-slate-200 animate-slide-up max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-900 text-base">All Arena Features</h3>
              <button
                onClick={() => setDrawerOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4">
              {moreItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setDrawerOpen(false);
                    }}
                    className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                      isActive
                        ? 'bg-indigo-50 border-indigo-300 text-indigo-700 font-bold'
                        : 'bg-slate-50/80 border-slate-200/80 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="w-5 h-5 text-indigo-600" />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold truncate">{item.label}</div>
                    </div>
                    {item.badge && (
                      <span className="text-[10px] bg-indigo-600 text-white font-bold px-1.5 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
