import React from 'react';
import { useArena } from '../../context/ArenaContext';
import { ProficiencyLevel } from '../../types';
import { Sparkles, Compass, Flame } from 'lucide-react';

export const LevelSelector: React.FC = () => {
  const { level, setLevel } = useArena();

  const levels: { id: ProficiencyLevel; label: string; icon: React.ReactNode; colorClass: string; activeBg: string }[] = [
    {
      id: 'beginner',
      label: 'Beginner',
      icon: <Sparkles className="w-3.5 h-3.5" />,
      colorClass: 'text-emerald-700',
      activeBg: 'bg-emerald-600 text-white shadow-sm'
    },
    {
      id: 'intermediate',
      label: 'Intermediate',
      icon: <Compass className="w-3.5 h-3.5" />,
      colorClass: 'text-blue-700',
      activeBg: 'bg-blue-600 text-white shadow-sm'
    },
    {
      id: 'advanced',
      label: 'Advanced',
      icon: <Flame className="w-3.5 h-3.5" />,
      colorClass: 'text-purple-700',
      activeBg: 'bg-purple-600 text-white shadow-sm'
    }
  ];

  return (
    <div className="flex items-center p-1 bg-slate-100/90 rounded-xl border border-slate-200/80">
      {levels.map((item) => {
        const isActive = level === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setLevel(item.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
              isActive
                ? item.activeBg
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};
