import React, { useState } from 'react';
import { useArena } from '../../context/ArenaContext';
import { storageService } from '../../services/storageService';
import { soundService } from '../../services/soundService';
import { SpeakingCard, SpeakingCardCategory, ProficiencyLevel } from '../../types';
import { 
  X, 
  Sparkles, 
  Layers, 
  Clock, 
  BookOpen, 
  Lightbulb, 
  MessageSquare, 
  Check, 
  Compass, 
  Flame 
} from 'lucide-react';

interface CreateSpeakingCardModalProps {
  onClose: () => void;
  onSuccess: (card: SpeakingCard) => void;
  initialCategory?: SpeakingCardCategory | 'all';
  initialLevel?: ProficiencyLevel | 'all';
}

export const CreateSpeakingCardModal: React.FC<CreateSpeakingCardModalProps> = ({
  onClose,
  onSuccess,
  initialCategory = 'opinion',
  initialLevel = 'intermediate'
}) => {
  const { activeTeacher, addToast, level: arenaLevel } = useArena();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<SpeakingCardCategory>(
    initialCategory !== 'all' ? initialCategory : 'opinion'
  );
  const [level, setLevel] = useState<ProficiencyLevel>(
    initialLevel !== 'all' ? initialLevel : arenaLevel || 'intermediate'
  );
  const [duration, setDuration] = useState<number>(60);
  const [question, setQuestion] = useState('');
  const [vocabInput, setVocabInput] = useState('');
  const [starterInput, setStarterInput] = useState('');
  const [hintInput, setHintInput] = useState('');
  const [targetTone, setTargetTone] = useState('Percaya Diri & Terstruktur');

  const categoriesList: { id: SpeakingCardCategory; label: string }[] = [
    { id: 'opinion', label: 'Opini & Pendapat' },
    { id: 'daily-conversation', label: 'Percakapan Harian' },
    { id: 'ice-breaker', label: 'Ice Breaker' },
    { id: 'debate', label: 'Debat Formal' },
    { id: 'storytelling', label: 'Storytelling' },
    { id: 'critical-thinking', label: 'Critical Thinking' },
    { id: 'would-you-rather', label: 'Would You Rather' },
    { id: 'random-challenge', label: 'Tantangan Acak' },
    { id: 'professional', label: 'Profesional & Pitch' }
  ];

  const durationOptions = [30, 45, 60, 90, 120, 180];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !question.trim()) {
      addToast({
        type: 'info',
        title: 'Form Belum Lengkap',
        message: 'Mohon isi Judul Topik dan Pertanyaan Pemantik terlebih dahulu.'
      });
      return;
    }

    const vocabArray = vocabInput
      .split(',')
      .map(v => v.trim())
      .filter(Boolean);

    const starterArray = starterInput
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    const hintsArray = hintInput
      .split('\n')
      .map(h => h.trim())
      .filter(Boolean);

    const newCard: SpeakingCard = {
      id: `custom-card-${Date.now()}`,
      title: title.trim(),
      level,
      category,
      question: question.trim(),
      estimatedDuration: duration,
      suggestedDurationOptions: [duration],
      vocabularySuggestions: vocabArray.length > 0 
        ? vocabArray 
        : ['Perspective', 'Furthermore', 'Consequently', 'Essential'],
      sentenceStarters: starterArray.length > 0
        ? starterArray
        : ['In my opinion...', 'First of all, I believe...', 'To wrap up, I think...'],
      hints: hintsArray.length > 0
        ? hintsArray
        : ['Jaga kontak mata dengan teman sekelas', 'Bicara dengan intonasi jelas dan tenang'],
      targetTone: targetTone.trim() || 'Percaya Diri & Santun',
      isCustom: true,
      teacherName: activeTeacher?.name || 'Guru',
      createdAt: new Date().toISOString()
    };

    storageService.addSpeakingCard(newCard);
    soundService.playSuccess();
    addToast({
      type: 'success',
      title: 'Topik Berhasil Disimpan',
      message: `Topik "${newCard.title}" siap digunakan untuk latihan siswa di kelas.`
    });

    onSuccess(newCard);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-3xl w-full my-8 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-blue-50/60 to-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg">Buat Topik Speaking Sendiri</h3>
              <p className="text-xs text-slate-500">
                Sesuaikan pertanyaan dan materi bicara dengan silabus atau tema ajar Anda hari ini.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800">
          {/* Section 1: Topik & Kategori */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Judul Topik / Sesi Bicara *
              </label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Contoh: Dampak Media Sosial pada Pelajar / Traditional Food vs Fast Food"
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Kategori Diskusi
                </label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value as SpeakingCardCategory)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  {categoriesList.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Tingkat Kesulitan Siswa
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['beginner', 'intermediate', 'advanced'] as const).map(lvl => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setLevel(lvl)}
                      className={`py-2 rounded-xl text-xs font-bold capitalize transition-all border ${
                        level === lvl
                          ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span>Target Durasi Bicara Murid</span>
                <span className="text-blue-600 font-mono font-bold text-xs">{duration} Detik</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {durationOptions.map(sec => (
                  <button
                    key={sec}
                    type="button"
                    onClick={() => setDuration(sec)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                      duration === sec
                        ? 'bg-blue-100 text-blue-800 border-blue-300 font-bold'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {sec}s
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 2: Pertanyaan Pemantik / Prompt */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Pertanyaan Pemantik / Instruksi Bicara (Prompt) *
              </label>
              <textarea
                value={question}
                onChange={e => setQuestion(e.target.value)}
                rows={3}
                placeholder="Tuliskan pertanyaan dalam bahasa Inggris yang akan ditampilkan di proyektor untuk dijawab siswa.&#10;Contoh: In your opinion, should high school students use artificial intelligence for daily homework? Give two clear reasons."
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50 leading-relaxed"
                required
              />
            </div>

            {/* Kosakata Panduan (Vocabulary) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Kosakata Bantuan (Pisahkan dengan koma)
              </label>
              <input
                type="text"
                value={vocabInput}
                onChange={e => setVocabInput(e.target.value)}
                placeholder="Contoh: Critical thinking, Reliance, Efficiency, Plagiarism"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Kosakata ini akan tampil sebagai petunjuk di proyektor agar siswa lebih percaya diri.
              </p>
            </div>

            {/* Kalimat Pembuka & Petunjuk Guru */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Contoh Kalimat Pembuka (1 per baris)
                </label>
                <textarea
                  value={starterInput}
                  onChange={e => setStarterInput(e.target.value)}
                  rows={3}
                  placeholder="In my perspective...&#10;On one hand, I agree that...&#10;To summarize my opinion..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Tips & Petunjuk Guru (1 per baris)
                </label>
                <textarea
                  value={hintInput}
                  onChange={e => setHintInput(e.target.value)}
                  rows={3}
                  placeholder="Bicara dengan tempo stabil&#10;Sertakan 1 contoh nyata dari pengalaman sendiri"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>
            </div>
          </div>

          {/* Live Preview Box */}
          <div className="pt-4 border-t border-slate-100">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Preview Kartu di Layar Proyektor:
            </span>
            <div className="p-5 rounded-2xl border border-blue-200 bg-blue-50/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-lg bg-blue-600 text-white flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Materi Kustom Guru ({level})
                </span>
                <span className="text-xs font-mono text-slate-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {duration}s
                </span>
              </div>
              <h4 className="font-extrabold text-sm text-slate-900">
                {title.trim() || 'Judul Topik Anda Akan Tampil di Sini'}
              </h4>
              <p className="text-xs text-slate-600 italic bg-white/80 p-3 rounded-xl border border-blue-100">
                "{question.trim() || 'Pertanyaan pemantik bahasa Inggris yang akan dijawab oleh siswa...'}"
              </p>
              {vocabInput.trim() && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {vocabInput.split(',').map((v, i) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-white text-blue-700 font-semibold border border-blue-200">
                      {v.trim()}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 transition-all flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>Simpan Topik ke Bank Soal</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
