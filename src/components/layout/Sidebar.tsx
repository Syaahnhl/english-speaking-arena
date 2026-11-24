import React from 'react';
import { useArena } from '../../context/ArenaContext';
import { 
  LayoutDashboard, 
  Layers, 
  ShoppingBag, 
  Theater, 
  Trophy, 
  Mic2, 
  GraduationCap, 
  Gauge,
  UserCheck,
  ChevronDown
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  sublabel?: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  highlight?: boolean;
}

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, cart, activeClassId, setActiveClassId, classrooms, activeTeacher } = useArena();
  const currentClass = classrooms.find(c => c.id === activeClassId) || classrooms[0];

  const teacherNavItems: NavItem[] = [
    { 
      id: 'dashboard', 
      label: 'Dasbor Pengajar', 
      sublabel: 'Pusat Fasilitasi Kelas',
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
      sublabel: 'Alur Sesi 3 Babak',
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
      sublabel: 'Catat Poin & Partisipasi',
      icon: GraduationCap 
    },
    { 
      id: 'progress', 
      label: 'Profil Guru & Kelas', 
      sublabel: 'Kelola Guru, Kelas & Siswa',
      icon: UserCheck 
    },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 border-r border-slate-200 bg-white min-h-[calc(100vh-57px)] sticky top-[57px] self-start p-3 select-none flex-shrink-0">
      {/* Current Active Class Badge at Top of Sidebar */}
      <div className="mb-3 p-3 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-200 transition-colors">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 bg-teal-100/80 px-2 py-0.5 rounded">
            Kelas Aktif
          </span>
          <span className="text-xs font-semibold text-slate-500">
            {currentClass ? `${currentClass.studentCount} Murid` : '0 Murid'}
          </span>
        </div>
        
        {classrooms.length > 1 ? (
          <div className="relative">
            <select
              value={activeClassId}
              onChange={(e) => setActiveClassId(e.target.value)}
              className="w-full text-xs font-bold text-slate-800 bg-transparent pr-6 py-1 appearance-none cursor-pointer focus:outline-none truncate"
            >
              {classrooms.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-0 top-1.5 pointer-events-none" />
          </div>
        ) : (
          <h4 className="font-bold text-xs text-slate-900 truncate" title={currentClass?.name}>
            {currentClass?.name || 'Belum Ada Kelas'}
          </h4>
        )}
        <p className="text-[11px] text-slate-500 truncate mt-0.5">
          Pengajar: <span className="font-medium text-slate-700">{activeTeacher?.name || 'Teacher 1'}</span>
        </p>
      </div>

      {/* Main Navigation Items */}
      <nav className="space-y-1">
        {teacherNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-150 text-left ${
                isActive
                  ? 'bg-teal-700 text-white font-semibold shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className={`p-1.5 rounded-lg flex-shrink-0 ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="block text-xs font-semibold truncate leading-tight">{item.label}</span>
                  {item.sublabel && (
                    <span className={`block text-[10px] truncate leading-tight mt-0.5 ${
                      isActive ? 'text-teal-100' : 'text-slate-400'
                    }`}>
                      {item.sublabel}
                    </span>
                  )}
                </div>
              </div>

              {item.badge && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  isActive ? 'bg-white text-teal-800' : 'bg-teal-100 text-teal-800'
                }`}>
                  {item.badge}
                </span>
              )}

              {item.highlight && !isActive && (
                <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Support Info */}
      <div className="mt-auto pt-3 border-t border-slate-200 text-[11px] text-slate-400 text-center">
        <span>Arena Bicara • Mode Pengajar</span>
      </div>
    </aside>
  );
};
