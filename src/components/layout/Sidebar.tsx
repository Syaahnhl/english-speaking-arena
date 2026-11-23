import React from 'react';
import { useArena } from '../../context/ArenaContext';
import { 
  LayoutDashboard, 
  Layers, 
  ShoppingBag, 
  Theater, 
  BookOpen, 
  Trophy, 
  Mic2, 
  BarChart3, 
  GraduationCap 
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  highlight?: boolean;
}

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, role, cart } = useArena();

  const studentNavItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'cards', label: 'Speaking Cards', icon: Layers },
    { 
      id: 'cart', 
      label: 'Speaking Cart', 
      icon: ShoppingBag,
      badge: cart.length > 0 ? `${cart.length}` : undefined 
    },
    { id: 'roleplay', label: 'Secret Roleplay', icon: Theater },
    { 
      id: 'reading', 
      label: 'Running Reading', 
      icon: BookOpen,
      highlight: true
    },
    { id: 'arena', label: 'Speaking Arena', icon: Trophy },
    { id: 'interactive', label: 'Interactive Studio', icon: Mic2 },
    { id: 'progress', label: 'My Progress', icon: BarChart3 },
  ];

  const teacherNavItems: NavItem[] = [
    { id: 'teacher', label: 'Teacher Dashboard', icon: GraduationCap, highlight: true },
    { id: 'dashboard', label: 'Student Preview', icon: LayoutDashboard },
    { id: 'cards', label: 'Speaking Cards', icon: Layers },
    { id: 'reading', label: 'Running Reading', icon: BookOpen },
    { id: 'roleplay', label: 'Roleplay Missions', icon: Theater },
    { id: 'arena', label: 'Class Arena', icon: Trophy },
  ];

  const items = role === 'teacher' ? teacherNavItems : studentNavItems;

  return (
    <aside className="hidden lg:flex flex-col w-64 border-r border-slate-200/80 bg-white min-h-[calc(100vh-65px)] p-4 select-none">
      <div className="space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded-full ${
                  isActive ? 'bg-white text-indigo-700' : 'bg-indigo-100 text-indigo-700'
                }`}>
                  {item.badge}
                </span>
              )}

              {item.highlight && !isActive && (
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
              )}
            </button>
          );
        })}
      </div>

      {/* Classroom Banner in Sidebar */}
      <div className="mt-auto pt-4 border-t border-slate-100">
        <div className="p-3 bg-gradient-to-br from-indigo-50 to-slate-50 rounded-xl border border-indigo-100">
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-900">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Class 10-A English Orators</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Weekly Speaking Sprint ends in 3 days.</p>
        </div>
      </div>
    </aside>
  );
};
