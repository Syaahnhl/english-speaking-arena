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
  GraduationCap, 
  Users,
  Gauge,
  UserCheck
} from 'lucide-react';
import { storageService } from '../../services/storageService';

interface NavItem {
  id: string;
  label: string;
  sublabel?: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  highlight?: boolean;
}

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, cart, activeClassId } = useArena();
  const classrooms = storageService.getClassrooms();
  const currentClass = classrooms.find(c => c.id === activeClassId) || classrooms[0];

  const teacherNavItems: NavItem[] = [
    { 
      id: 'dashboard', 
      label: 'Dasbor Pengajar', 
      sublabel: 'Pusat Kendali Kelas',
      icon: LayoutDashboard 
    },
    { 
      id: 'cards', 
      label: 'Bank Speaking Cards', 
      sublabel: 'Kartu Pemantik Bicara',
      icon: Layers 
    },
    { 
      id: 'cart', 
      label: 'Rangkaian Sesi (Cart)', 
      sublabel: 'Lesson Plan 3 Babak',
      icon: ShoppingBag,
      badge: cart.length > 0 ? `${cart.length}` : undefined 
    },
    { 
      id: 'reading', 
      label: 'Running Reading', 
      sublabel: 'Teleprompter Kecepatan',
      icon: Gauge,
      highlight: true
    },
    { 
      id: 'roleplay', 
      label: 'Roleplay Misi Rahasia', 
      sublabel: 'Simulasi Konflik Berpasangan',
      icon: Theater 
    },
    { 
      id: 'arena', 
      label: 'Arena & Turnamen Kelas', 
      sublabel: 'Duel 1v1 & Leaderboard',
      icon: Trophy 
    },
    { 
      id: 'interactive', 
      label: 'Studio Games Interaktif', 
      sublabel: '6 Games & Pemanasan',
      icon: Mic2 
    },
    { 
      id: 'teacher', 
      label: 'Roster & Nilai Murid', 
      sublabel: 'Pemeriksaan Tugas Siswa',
      icon: GraduationCap 
    },
    { 
      id: 'progress', 
      label: 'Profil Guru & Kelas', 
      sublabel: 'Input Kelas & Siswa',
      icon: UserCheck 
    },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-72 border-r border-slate-200/80 bg-white min-h-[calc(100vh-65px)] p-4 select-none">
      {/* Current Active Class Badge at Top of Sidebar */}
      <div className="mb-4 p-3.5 bg-gradient-to-br from-indigo-50/90 to-slate-50 rounded-2xl border border-indigo-100 space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-700 bg-indigo-100/70 px-2 py-0.5 rounded-md">
            Kelas Aktif
          </span>
          <span className="text-xs font-mono font-bold text-slate-500">
            {currentClass.studentCount} Murid
          </span>
        </div>
        <h4 className="font-extrabold text-xs text-slate-900 truncate">
          {currentClass.name}
        </h4>
        <p className="text-[11px] text-slate-500 truncate">Kode Undangan: {currentClass.code}</p>
      </div>

      {/* Main Navigation Items */}
      <div className="space-y-1">
        {teacherNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between p-3 rounded-2xl transition-all duration-150 text-left ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20 font-bold'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className={`p-2 rounded-xl flex-shrink-0 ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="block text-xs font-bold truncate">{item.label}</span>
                  {item.sublabel && (
                    <span className={`block text-[10px] truncate ${
                      isActive ? 'text-indigo-100' : 'text-slate-400'
                    }`}>
                      {item.sublabel}
                    </span>
                  )}
                </div>
              </div>

              {item.badge && (
                <span className={`text-[11px] font-black px-2 py-0.5 rounded-full ${
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

      {/* Footer Support Info */}
      <div className="mt-auto pt-4 border-t border-slate-100 text-xs text-slate-400 text-center">
        <span>English Speaking Arena • Teacher Edition</span>
      </div>
    </aside>
  );
};
