import React, { useState, useMemo } from 'react';
import { useArena } from '../../context/ArenaContext';
import { storageService } from '../../services/storageService';
import { soundService } from '../../services/soundService';
import { ReadingMaterial, ReadingGenre, ProficiencyLevel, ReadingQuestion } from '../../types';
import { 
  X, 
  Sparkles, 
  Gauge, 
  BookOpen, 
  Check, 
  Plus, 
  Trash2, 
  Clock, 
  FileText, 
  HelpCircle,
  AlertCircle
} from 'lucide-react';

interface CreateReadingMaterialModalProps {
  onClose: () => void;
  onSuccess: (material: ReadingMaterial) => void;
  initialGenre?: ReadingGenre | 'all';
  initialLevel?: ProficiencyLevel | 'all';
}

export const CreateReadingMaterialModal: React.FC<CreateReadingMaterialModalProps> = ({
  onClose,
  onSuccess,
  initialGenre = 'educational',
  initialLevel = 'intermediate'
}) => {
  const { activeTeacher, addToast, level: arenaLevel } = useArena();

  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState<ReadingGenre>(
    initialGenre !== 'all' ? initialGenre : 'educational'
  );
  const [level, setLevel] = useState<ProficiencyLevel>(
    initialLevel !== 'all' ? initialLevel : arenaLevel || 'intermediate'
  );
  const [summary, setSummary] = useState('');
  const [rawText, setRawText] = useState('');

  // Vocabulary entries
  const [vocabList, setVocabList] = useState<Array<{ word: string; definition: string; example: string }>>([
    { word: '', definition: '', example: '' }
  ]);

  // Quiz questions
  const [quizQuestion, setQuizQuestion] = useState('');
  const [opt0, setOpt0] = useState('');
  const [opt1, setOpt1] = useState('');
  const [opt2, setOpt2] = useState('');
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState<number>(0);
  const [explanation, setExplanation] = useState('');

  const genresList: { id: ReadingGenre; label: string }[] = [
    { id: 'educational', label: 'Educational' },
    { id: 'news-articles', label: 'News & Articles' },
    { id: 'short-stories', label: 'Short Stories' },
    { id: 'daily-conversations', label: 'Daily Conversations' },
    { id: 'interesting-facts', label: 'Interesting Facts' },
    { id: 'professional', label: 'Professional' }
  ];

  // Derived stats from raw text
  const paragraphs = useMemo(() => {
    return rawText
      .split(/\n\s*\n/)
      .map(p => p.trim())
      .filter(p => p.length > 0);
  }, [rawText]);

  const wordCount = useMemo(() => {
    return rawText
      .trim()
      .split(/\s+/)
      .filter(w => w.length > 0).length;
  }, [rawText]);

  const estimatedMinutes = Math.max(1, Math.round(wordCount / 140));

  const handleAddVocabRow = () => {
    setVocabList([...vocabList, { word: '', definition: '', example: '' }]);
  };

  const handleRemoveVocabRow = (index: number) => {
    setVocabList(vocabList.filter((_, i) => i !== index));
  };

  const handleVocabChange = (index: number, field: 'word' | 'definition' | 'example', value: string) => {
    const updated = [...vocabList];
    updated[index][field] = value;
    setVocabList(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !rawText.trim()) {
      addToast({
        type: 'info',
        title: 'Form Belum Lengkap',
        message: 'Mohon isi Judul Materi dan Teks Bacaan terlebih dahulu.'
      });
      return;
    }

    if (paragraphs.length === 0 || wordCount < 20) {
      addToast({
        type: 'info',
        title: 'Teks Bacaan Terlalu Singkat',
        message: 'Tulis atau tempelkan minimal 1 paragraf bacaan (minimal 20 kata).'
      });
      return;
    }

    // Filter valid vocabulary
    const validVocab = vocabList
      .filter(v => v.word.trim())
      .map(v => ({
        word: v.word.trim(),
        definition: v.definition.trim() || 'Kosakata penting dalam materi ini.',
        example: v.example.trim() || `Example with "${v.word.trim()}".`
      }));

    // Prepare quiz questions
    const questions: ReadingQuestion[] = [];
    if (quizQuestion.trim() && opt0.trim() && opt1.trim()) {
      const options = [opt0.trim(), opt1.trim()];
      if (opt2.trim()) options.push(opt2.trim());

      questions.push({
        id: `q-custom-1`,
        question: quizQuestion.trim(),
        type: 'multiple-choice',
        options,
        correctAnswer: Math.min(correctAnswerIndex, options.length - 1),
        explanation: explanation.trim() || 'Pertanyaan ini menguji pemahaman inti teks bacaan.'
      });
    }

    const newMaterial: ReadingMaterial = {
      id: `custom-read-${Date.now()}`,
      title: title.trim(),
      genre,
      level,
      wordCount,
      summary: summary.trim() || `Teks bacaan materi kustom kelas mengenai topik ${title.trim()}.`,
      paragraphs,
      vocabularyGlossary: validVocab,
      questions,
      isCustom: true,
      teacherName: activeTeacher?.name || 'Guru',
      createdAt: new Date().toISOString()
    };

    storageService.addReadingMaterial(newMaterial);
    soundService.playSuccess();
    addToast({
      type: 'success',
      title: 'Materi Bacaan Berhasil Disimpan',
      message: `"${newMaterial.title}" (${wordCount} kata) kini siap diproyeksikan di Teleprompter Kelas.`
    });

    onSuccess(newMaterial);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-3xl w-full my-8 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-blue-50/60 to-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <Gauge className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg">Buat Materi Bacaan Teleprompter</h3>
              <p className="text-xs text-slate-500">
                Tempel artikel pelajaran, berita, atau teks silabus Anda sendiri untuk diproyeksikan di depan kelas.
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

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800">
          {/* Section 1: Info Dasar */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Judul Materi Bacaan *
              </label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Contoh: The Wonders of Indonesian Tropical Rainforests"
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Genre / Jenis Teks
                </label>
                <select
                  value={genre}
                  onChange={e => setGenre(e.target.value as ReadingGenre)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  {genresList.map(g => (
                    <option key={g.id} value={g.id}>
                      {g.label}
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
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Ringkasan Singkat (Summary)
              </label>
              <input
                type="text"
                value={summary}
                onChange={e => setSummary(e.target.value)}
                placeholder="Contoh: Artikel menarik tentang keanekaragaman flora dan fauna di hutan hujan tropis."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>
          </div>

          {/* Section 2: Teks Bacaan Paragraf */}
          <div className="space-y-2 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Isi Teks Bacaan Bahasa Inggris *
              </label>
              <div className="flex items-center gap-3 text-xs font-mono font-bold text-slate-500">
                <span className="flex items-center gap-1 text-blue-600">
                  <FileText className="w-3.5 h-3.5" />
                  {wordCount} Kata
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  ~{estimatedMinutes} Menit
                </span>
              </div>
            </div>

            <textarea
              value={rawText}
              onChange={e => setRawText(e.target.value)}
              rows={8}
              placeholder="Tempel atau ketikkan paragraf teks bacaan di sini. Pisahkan antar paragraf dengan tombol Enter (baris kosong).&#10;&#10;Contoh:&#10;Tropical rainforests are dense, warm, and wet forests that cover only about six percent of Earth's land surface. Yet, they harbor more than half of all plant and animal species on our planet.&#10;&#10;In Indonesia, ancient canopy trees like dipterocarps tower over sixty meters above the ground, creating natural multi-layered homes for hornbills, orangutans, and rare orchids."
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50 leading-relaxed font-sans"
              required
            />
            <p className="text-[11px] text-slate-400">
              * Teks ini akan otomatis digulirkan secara dinamis pada teleprompter kelas dengan kecepatan yang dapat diatur guru (0.5x – 2.0x).
            </p>
          </div>

          {/* Section 3: Glosarium Kosakata Penting */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Glosarium Kosakata Sulit (Opsional)
                </h4>
                <p className="text-[11px] text-slate-400">
                  Bantu murid memahami kata sulit yang muncul di teks bacaan.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddVocabRow}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 text-xs font-bold hover:bg-blue-100 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Tambah Kata</span>
              </button>
            </div>

            <div className="space-y-2">
              {vocabList.map((vocab, index) => (
                <div key={index} className="grid grid-cols-1 sm:grid-cols-12 gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="sm:col-span-3">
                    <input
                      type="text"
                      placeholder="Kata (e.g. Canopy)"
                      value={vocab.word}
                      onChange={e => handleVocabChange(index, 'word', e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-bold bg-white focus:outline-none"
                    />
                  </div>
                  <div className="sm:col-span-4">
                    <input
                      type="text"
                      placeholder="Arti / Definisi (The high continuous roof formed by tree tops)"
                      value={vocab.definition}
                      onChange={e => handleVocabChange(index, 'definition', e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs bg-white focus:outline-none"
                    />
                  </div>
                  <div className="sm:col-span-4">
                    <input
                      type="text"
                      placeholder="Contoh kalimat"
                      value={vocab.example}
                      onChange={e => handleVocabChange(index, 'example', e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs bg-white focus:outline-none"
                    />
                  </div>
                  <div className="sm:col-span-1 flex items-center justify-center">
                    {vocabList.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveVocabRow(index)}
                        className="text-slate-400 hover:text-rose-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Kuis Pemahaman Pasca-Baca */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <div>
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Kuis Pemahaman Siswa (Opsional)
              </h4>
              <p className="text-[11px] text-slate-400">
                Uji apakah siswa memahami isi teks setelah teleprompter selesai dibaca.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Pertanyaan Kuis
                </label>
                <input
                  type="text"
                  value={quizQuestion}
                  onChange={e => setQuizQuestion(e.target.value)}
                  placeholder="Contoh: What percentage of the Earth's land surface is covered by rainforests?"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-[11px] font-bold text-slate-600">
                  Pilihan Jawaban (Pilih centang untuk kunci jawaban benar):
                </label>
                {[
                  { val: opt0, set: setOpt0, idx: 0, placeholder: 'Pilihan A (misal: About 6 percent)' },
                  { val: opt1, set: setOpt1, idx: 1, placeholder: 'Pilihan B (misal: More than 50 percent)' },
                  { val: opt2, set: setOpt2, idx: 2, placeholder: 'Pilihan C (misal: Over 80 percent) - opsional' }
                ].map(item => (
                  <div key={item.idx} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="correctAnswerOption"
                      checked={correctAnswerIndex === item.idx}
                      onChange={() => setCorrectAnswerIndex(item.idx)}
                      className="w-4 h-4 text-blue-600 accent-blue-600"
                    />
                    <input
                      type="text"
                      value={item.val}
                      onChange={e => item.set(e.target.value)}
                      placeholder={item.placeholder}
                      className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white focus:outline-none"
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Penjelasan Kunci Jawaban
                </label>
                <input
                  type="text"
                  value={explanation}
                  onChange={e => setExplanation(e.target.value)}
                  placeholder="Contoh: Paragraf pertama menyebutkan bahwa hutan hujan menutupi sekitar 6% daratan bumi."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none"
                />
              </div>
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
              <span>Simpan Teks ke Teleprompter Kelas</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
