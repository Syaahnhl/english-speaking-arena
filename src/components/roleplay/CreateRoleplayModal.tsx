import React, { useState } from 'react';
import { ProficiencyLevel, RoleplayScenario } from '../../types';
import { storageService } from '../../services/storageService';
import { soundService } from '../../services/soundService';
import { useArena } from '../../context/ArenaContext';
import { X, Theater, Sparkles, User, ShieldAlert, BookOpen, Clock } from 'lucide-react';

interface CreateRoleplayModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (newScenario: RoleplayScenario) => void;
}

export const CreateRoleplayModal: React.FC<CreateRoleplayModalProps> = ({
  isOpen,
  onClose,
  onCreated
}) => {
  const { addToast } = useArena();
  const activeTeacher = storageService.getCurrentUser();

  const [title, setTitle] = useState('');
  const [level, setLevel] = useState<ProficiencyLevel>('intermediate');
  const [context, setContext] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(3);
  const [vocabularyText, setVocabularyText] = useState('');

  // Player A
  const [roleA, setRoleA] = useState('');
  const [situationA, setSituationA] = useState('');
  const [objectiveA, setObjectiveA] = useState('');
  const [requiredPhrasesA, setRequiredPhrasesA] = useState('');
  const [forbiddenWordsA, setForbiddenWordsA] = useState('');

  // Player B
  const [roleB, setRoleB] = useState('');
  const [situationB, setSituationB] = useState('');
  const [objectiveB, setObjectiveB] = useState('');
  const [requiredPhrasesB, setRequiredPhrasesB] = useState('');
  const [forbiddenWordsB, setForbiddenWordsB] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !context.trim() || !roleA.trim() || !roleB.trim()) {
      addToast({
        type: 'info',
        title: 'Form Belum Lengkap',
        message: 'Mohon isi judul, latar situasi, dan peran untuk kedua siswa.'
      });
      return;
    }

    const parseCsv = (text: string) =>
      text
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);

    const newScenario: RoleplayScenario = {
      id: `roleplay-custom-${Date.now()}`,
      title: title.trim(),
      level,
      context: context.trim(),
      suggestedDuration: Math.max(60, durationMinutes * 60),
      vocabularySupport: parseCsv(vocabularyText),
      isCustom: true,
      teacherId: activeTeacher?.id,
      playerA: {
        playerRole: 'A',
        roleName: roleA.trim(),
        situation: situationA.trim() || `Situasi peran ${roleA.trim()}`,
        rules: ['Pertahankan karakter dan bicaralah secara diplomatis.'],
        secretObjective: objectiveA.trim() || 'Selesaikan percakapan dengan kesepakatan terbaik.',
        requiredPhrases: parseCsv(requiredPhrasesA),
        forbiddenWords: parseCsv(forbiddenWordsA)
      },
      playerB: {
        playerRole: 'B',
        roleName: roleB.trim(),
        situation: situationB.trim() || `Situasi peran ${roleB.trim()}`,
        rules: ['Tanggapi lawan bicara secara profesional dan fokus pada solusi.'],
        secretObjective: objectiveB.trim() || 'Pertahankan kepentingan dan tawarkan jalan tengah.',
        requiredPhrases: parseCsv(requiredPhrasesB),
        forbiddenWords: parseCsv(forbiddenWordsB)
      }
    };

    storageService.saveCustomRoleplayScenario(newScenario);
    soundService.playSuccess();
    addToast({
      type: 'success',
      title: 'Skenario Berhasil Disimpan',
      message: `"${title}" telah ditambahkan ke Bank Roleplay Misi Rahasia.`
    });

    onCreated(newScenario);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-scaleUp">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <Theater className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900">Buat Skenario Roleplay Baru</h3>
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
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Skenario Utama */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-blue-700 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              1. Informasi Skenario Utama
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-8 space-y-1">
                <label className="text-xs font-bold text-slate-700">Judul Skenario *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="Contoh: The Missing Luggage at Airport Carousel"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 font-semibold focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs font-bold text-slate-700">Tingkat *</label>
                <select
                  value={level}
                  onChange={e => setLevel(e.target.value as ProficiencyLevel)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 font-semibold focus:outline-none focus:border-blue-500 bg-white"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs font-bold text-slate-700">Durasi (Menit)</label>
                <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={durationMinutes}
                    onChange={e => setDurationMinutes(Number(e.target.value))}
                    className="w-full text-xs font-bold text-slate-800 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Konteks & Latar Situasi Kelas *</label>
              <textarea
                required
                rows={2}
                value={context}
                onChange={e => setContext(e.target.value)}
                placeholder="Jelaskan di mana percakapan berlangsung dan apa konflik dasarnya. Contoh: Seorang turis asing baru mendarat di bandara dan kopernya tidak kunjung muncul di conveyor belt..."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                Kosakata Pendukung (Bantuan untuk Siswa)
              </label>
              <input
                type="text"
                value={vocabularyText}
                onChange={e => setVocabularyText(e.target.value)}
                placeholder="Pisahkan dengan koma, contoh: Baggage claim, Tracking tag, Compensation, Apologies"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Player A & Player B Side-by-Side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2 border-t border-slate-100">
            {/* Player A */}
            <div className="p-4 rounded-2xl bg-sky-50/60 border border-sky-100 space-y-3">
              <div className="flex items-center gap-2 text-sky-900 font-bold text-xs pb-1 border-b border-sky-200/60">
                <User className="w-4 h-4 text-sky-600" />
                <span>Misi Tersembunyi: Peran Siswa A</span>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700">Nama Peran A *</label>
                <input
                  type="text"
                  required
                  value={roleA}
                  onChange={e => setRoleA(e.target.value)}
                  placeholder="Contoh: Anxious Passenger"
                  className="w-full px-3 py-1.5 rounded-lg border border-sky-200 bg-white text-xs font-semibold focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700">Misi Rahasia Peran A *</label>
                <textarea
                  rows={2}
                  value={objectiveA}
                  onChange={e => setObjectiveA(e.target.value)}
                  placeholder="Contoh: Minta pengantaran koper ke hotel hari ini juga dan voucher ganti rugi."
                  className="w-full px-3 py-1.5 rounded-lg border border-sky-200 bg-white text-xs focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700">Frasa Wajib Diucapkan</label>
                <input
                  type="text"
                  value={requiredPhrasesA}
                  onChange={e => setRequiredPhrasesA(e.target.value)}
                  placeholder="Pisah koma: I had important medicines inside, Who can I speak to?"
                  className="w-full px-3 py-1.5 rounded-lg border border-sky-200 bg-white text-xs focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-rose-700 flex items-center gap-1">
                  <ShieldAlert className="w-3 h-3" />
                  Kata Terlarang (Dilarang Diucapkan)
                </label>
                <input
                  type="text"
                  value={forbiddenWordsA}
                  onChange={e => setForbiddenWordsA(e.target.value)}
                  placeholder="Pisah koma: stupid, sue you, incompetent"
                  className="w-full px-3 py-1.5 rounded-lg border border-rose-200 bg-white text-xs text-rose-900 focus:outline-none focus:border-rose-400"
                />
              </div>
            </div>

            {/* Player B */}
            <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 space-y-3">
              <div className="flex items-center gap-2 text-indigo-900 font-bold text-xs pb-1 border-b border-indigo-200/60">
                <User className="w-4 h-4 text-indigo-600" />
                <span>Misi Tersembunyi: Peran Siswa B</span>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700">Nama Peran B *</label>
                <input
                  type="text"
                  required
                  value={roleB}
                  onChange={e => setRoleB(e.target.value)}
                  placeholder="Contoh: Airport Baggage Agent"
                  className="w-full px-3 py-1.5 rounded-lg border border-indigo-200 bg-white text-xs font-semibold focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700">Misi Rahasia Peran B *</label>
                <textarea
                  rows={2}
                  value={objectiveB}
                  onChange={e => setObjectiveB(e.target.value)}
                  placeholder="Contoh: Tetap tenang, jelaskan koper berada di penerbangan transit berikutnya, jangan tawarkan uang tunai."
                  className="w-full px-3 py-1.5 rounded-lg border border-indigo-200 bg-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700">Frasa Wajib Diucapkan</label>
                <input
                  type="text"
                  value={requiredPhrasesB}
                  onChange={e => setRequiredPhrasesB(e.target.value)}
                  placeholder="Pisah koma: I sincerely apologize for the delay, Rest assured we are tracking it"
                  className="w-full px-3 py-1.5 rounded-lg border border-indigo-200 bg-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-rose-700 flex items-center gap-1">
                  <ShieldAlert className="w-3 h-3" />
                  Kata Terlarang (Dilarang Diucapkan)
                </label>
                <input
                  type="text"
                  value={forbiddenWordsB}
                  onChange={e => setForbiddenWordsB(e.target.value)}
                  placeholder="Pisah koma: not my problem, calm down, impossible"
                  className="w-full px-3 py-1.5 rounded-lg border border-rose-200 bg-white text-xs text-rose-900 focus:outline-none focus:border-rose-400"
                />
              </div>
            </div>
          </div>

          {/* Footer buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 transition-all flex items-center gap-2"
            >
              <Theater className="w-4 h-4" />
              <span>Simpan Skenario Roleplay</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
