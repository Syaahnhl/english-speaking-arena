import React, { useState } from 'react';
import { ProficiencyLevel, HeadToHeadBattle } from '../../types';
import { storageService } from '../../services/storageService';
import { soundService } from '../../services/soundService';
import { useArena } from '../../context/ArenaContext';
import { X, Swords, Clock, Tag, Sparkles } from 'lucide-react';

interface CreateBattleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (newBattle: HeadToHeadBattle) => void;
}

export const CreateBattleModal: React.FC<CreateBattleModalProps> = ({
  isOpen,
  onClose,
  onCreated
}) => {
  const { addToast } = useArena();
  const activeTeacher = storageService.getCurrentUser();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<HeadToHeadBattle['category']>('Same Topic');
  const [level, setLevel] = useState<ProficiencyLevel>('intermediate');
  const [prompt, setPrompt] = useState('');
  const [timeLimit, setTimeLimit] = useState(60);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !prompt.trim()) {
      addToast({
        type: 'info',
        title: 'Form Belum Lengkap',
        message: 'Mohon isi judul duel dan pertanyaan/instruksi duel.'
      });
      return;
    }

    const newBattle: HeadToHeadBattle = {
      id: `battle-custom-${Date.now()}`,
      title: title.trim(),
      category,
      level,
      prompt: prompt.trim(),
      timeLimit,
      isCustom: true,
      teacherId: activeTeacher?.id,
      opponent: {
        name: 'Peserta 2 (Siswa)',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&q=80',
        rank: 'Challenger'
      }
    };

    storageService.saveCustomBattle(newBattle);
    soundService.playSuccess();
    addToast({
      type: 'success',
      title: 'Topik Duel Berhasil Disimpan',
      message: `"${title}" siap digunakan untuk turnamen kelas.`
    });

    onCreated(newBattle);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-xl flex flex-col overflow-hidden animate-scaleUp">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <Swords className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900">Buat Topik Duel 1v1 Kelas</h3>
              <p className="text-xs text-slate-500">
                Oleh Guru: <strong className="text-slate-700">{activeTeacher?.name}</strong>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Judul Duel / Turnamen *</label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Contoh: Social Media Ban for Teenagers: Good or Bad?"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Kategori</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-white focus:outline-none focus:border-blue-500"
              >
                <option value="Same Topic">Same Topic (Debat)</option>
                <option value="Fast Answer">Fast Answer (Kilat)</option>
                <option value="Vocabulary Battle">Vocabulary Battle</option>
                <option value="Storytelling Battle">Storytelling</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Tingkat</label>
              <select
                value={level}
                onChange={e => setLevel(e.target.value as ProficiencyLevel)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-white focus:outline-none focus:border-blue-500"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Durasi Bicara / Siswa</label>
              <select
                value={timeLimit}
                onChange={e => setTimeLimit(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-white focus:outline-none focus:border-blue-500"
              >
                <option value={30}>30 Detik</option>
                <option value={60}>1 Menit (60s)</option>
                <option value={90}>1.5 Menit (90s)</option>
                <option value={120}>2 Menit (120s)</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">
              Pertanyaan / Topik Instruksi Duel *
            </label>
            <textarea
              required
              rows={3}
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder="Contoh: Should smartphones be banned in high school classrooms to boost focus, or integrated as active digital learning tools? State your clear stance with 2 solid reasons."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Footer buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5"
            >
              <Swords className="w-4 h-4" />
              <span>Simpan Topik Duel</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
