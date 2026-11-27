import React, { useState, useEffect } from 'react';
import { 
  ProficiencyLevel, 
  TabooCard, 
  YesAndPrompt, 
  FourThreeTwoTopic, 
  SpeedTalkingTopic, 
  ShadowingLesson, 
  VisualStoryPrompt 
} from '../../types';
import { storageService } from '../../services/storageService';
import { soundService } from '../../services/soundService';
import { useArena } from '../../context/ArenaContext';
import { 
  X, 
  Mic2, 
  AlertOctagon, 
  Sparkles, 
  Clock, 
  Radio, 
  Volume2, 
  Image as ImageIcon,
  Check 
} from 'lucide-react';

export type InteractiveGameType = 'taboo' | 'yes-and' | '432' | 'speed-talk' | 'shadowing' | 'visual-story';

interface CreateInteractiveQuestionModalProps {
  isOpen: boolean;
  defaultGame?: InteractiveGameType;
  onClose: () => void;
  onCreated: (gameType: InteractiveGameType, newItem: any) => void;
}

export const CreateInteractiveQuestionModal: React.FC<CreateInteractiveQuestionModalProps> = ({
  isOpen,
  defaultGame = 'taboo',
  onClose,
  onCreated
}) => {
  const { addToast } = useArena();
  const activeTeacher = storageService.getCurrentUser();

  const [gameType, setGameType] = useState<InteractiveGameType>(defaultGame);
  const [level, setLevel] = useState<ProficiencyLevel>('intermediate');

  useEffect(() => {
    if (isOpen) {
      setGameType(defaultGame);
    }
  }, [isOpen, defaultGame]);

  // 1. Taboo state
  const [tabooWord, setTabooWord] = useState('');
  const [tabooCategory, setTabooCategory] = useState('');
  const [tabooForbidden, setTabooForbidden] = useState('');
  const [tabooHints, setTabooHints] = useState('');

  // 2. Yes, And state
  const [yesScenario, setYesScenario] = useState('');
  const [yesStarterLine, setYesStarterLine] = useState('');
  const [yesTwists, setYesTwists] = useState('');

  // 3. 4/3/2 state
  const [fttTitle, setFttTitle] = useState('');
  const [fttDesc, setFttDesc] = useState('');
  const [fttOutline, setFttOutline] = useState('');

  // 4. Speed Talk state
  const [speedTopic, setSpeedTopic] = useState('');
  const [speedCategory, setSpeedCategory] = useState('');
  const [speedQuestions, setSpeedQuestions] = useState('');

  // 5. Shadowing state
  const [shadowTitle, setShadowTitle] = useState('');
  const [shadowSpeaker, setShadowSpeaker] = useState('Alex (US Accent)');
  const [shadowAccent, setShadowAccent] = useState('American - Conversational');
  const [shadowTopic, setShadowTopic] = useState('Daily Conversation');
  const [shadowSentenceText, setShadowSentenceText] = useState('');
  const [shadowEmphasis, setShadowEmphasis] = useState('');
  const [shadowPhonetic, setShadowPhonetic] = useState('');

  // 6. Visual Story state
  const [visTitle, setVisTitle] = useState('');
  const [visImageUrl, setVisImageUrl] = useState('https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80');
  const [visQuestions, setVisQuestions] = useState('');
  const [visVocab, setVisVocab] = useState('');

  if (!isOpen) return null;

  const parseLinesOrCsv = (text: string) => {
    return text
      .split(/[\n,]/)
      .map(s => s.trim())
      .filter(Boolean);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (gameType === 'taboo') {
      if (!tabooWord.trim()) {
        addToast({ type: 'info', title: 'Kata Target Kosong', message: 'Mohon isi kata target yang harus ditebak.' });
        return;
      }
      const forbidden = parseLinesOrCsv(tabooForbidden);
      const newCard: TabooCard = {
        id: `taboo-custom-${Date.now()}`,
        word: tabooWord.trim().toUpperCase(),
        level,
        category: tabooCategory.trim() || 'General',
        forbiddenWords: forbidden.length > 0 ? forbidden : ['Word1', 'Word2', 'Word3'],
        hints: tabooHints.trim() || `Describe ${tabooWord.trim()} without saying the forbidden words.`,
        isCustom: true,
        teacherId: activeTeacher?.id
      };
      storageService.saveCustomTabooCard(newCard);
      onCreated('taboo', newCard);
    } else if (gameType === 'yes-and') {
      if (!yesScenario.trim() || !yesStarterLine.trim()) {
        addToast({ type: 'info', title: 'Form Belum Lengkap', message: 'Mohon isi judul skenario dan kalimat pembuka.' });
        return;
      }
      const twists = parseLinesOrCsv(yesTwists);
      const newPrompt: YesAndPrompt = {
        id: `yes-custom-${Date.now()}`,
        scenario: yesScenario.trim(),
        starterLine: yesStarterLine.trim(),
        level,
        suggestedTwists: twists.length > 0 ? twists : ['Yes, and suddenly a mysterious noise occurred!'],
        isCustom: true,
        teacherId: activeTeacher?.id
      };
      storageService.saveCustomYesAndPrompt(newPrompt);
      onCreated('yes-and', newPrompt);
    } else if (gameType === '432') {
      if (!fttTitle.trim()) {
        addToast({ type: 'info', title: 'Judul Topik Kosong', message: 'Mohon isi judul topik 4/3/2.' });
        return;
      }
      const outline = parseLinesOrCsv(fttOutline);
      const newTopic: FourThreeTwoTopic = {
        id: `ftt-custom-${Date.now()}`,
        title: fttTitle.trim(),
        level,
        description: fttDesc.trim() || 'Ceritakan pengalamanmu dan kurangi waktu jeda di tiap babak.',
        outline: outline.length > 0 ? outline : ['Latar belakang', 'Tantangan utama', 'Pelajaran berharga'],
        isCustom: true,
        teacherId: activeTeacher?.id
      };
      storageService.saveCustomFourThreeTwoTopic(newTopic);
      onCreated('432', newTopic);
    } else if (gameType === 'speed-talk') {
      if (!speedTopic.trim()) {
        addToast({ type: 'info', title: 'Topik Kosong', message: 'Mohon isi topik pertanyaan speed talk.' });
        return;
      }
      const guideQs = parseLinesOrCsv(speedQuestions);
      const newSpeed: SpeedTalkingTopic = {
        id: `speed-custom-${Date.now()}`,
        topic: speedTopic.trim(),
        category: speedCategory.trim() || 'Classroom Discussion',
        level,
        guideQuestions: guideQs.length > 0 ? guideQs : ['What is your primary reason?', 'How would you convince others?'],
        isCustom: true,
        teacherId: activeTeacher?.id
      };
      storageService.saveCustomSpeedTalkingTopic(newSpeed);
      onCreated('speed-talk', newSpeed);
    } else if (gameType === 'shadowing') {
      if (!shadowTitle.trim() || !shadowSentenceText.trim()) {
        addToast({ type: 'info', title: 'Form Belum Lengkap', message: 'Mohon isi judul materi dan teks kalimat shadowing.' });
        return;
      }
      const emphasis = parseLinesOrCsv(shadowEmphasis);
      const newShadow: ShadowingLesson = {
        id: `shad-custom-${Date.now()}`,
        title: shadowTitle.trim(),
        level,
        speaker: shadowSpeaker.trim(),
        accent: shadowAccent.trim(),
        topic: shadowTopic.trim(),
        isCustom: true,
        teacherId: activeTeacher?.id,
        sentences: [
          {
            id: `s-${Date.now()}`,
            text: shadowSentenceText.trim(),
            emphasisWords: emphasis.length > 0 ? emphasis : [shadowSentenceText.trim().split(' ')[0]],
            phoneticTips: shadowPhonetic.trim() || 'Tirukan intonasi dan jeda napas pembicara secara natural.'
          }
        ]
      };
      storageService.saveCustomShadowingLesson(newShadow);
      onCreated('shadowing', newShadow);
    } else if (gameType === 'visual-story') {
      if (!visTitle.trim()) {
        addToast({ type: 'info', title: 'Judul Kosong', message: 'Mohon isi judul gambar visual storytelling.' });
        return;
      }
      const questions = parseLinesOrCsv(visQuestions);
      const vocab = parseLinesOrCsv(visVocab);
      const newVisual: VisualStoryPrompt = {
        id: `vis-custom-${Date.now()}`,
        title: visTitle.trim(),
        imageUrl: visImageUrl.trim(),
        level,
        promptQuestions: questions.length > 0 ? questions : ['What is happening in this image?', 'What will happen next?'],
        suggestedVocab: vocab.length > 0 ? vocab : ['Fascinating', 'Atmosphere', 'Detail'],
        isCustom: true,
        teacherId: activeTeacher?.id
      };
      storageService.saveCustomVisualStoryPrompt(newVisual);
      onCreated('visual-story', newVisual);
    }

    soundService.playSuccess();
    addToast({
      type: 'success',
      title: 'Soal Game Berhasil Disimpan',
      message: 'Soal baru telah tersimpan dan siap dimainkan di kelas.'
    });

    onClose();
  };

  const gameOptions = [
    { id: 'taboo', label: '1. Taboo / Kata Terlarang', icon: AlertOctagon },
    { id: 'yes-and', label: '2. Yes, And... Improv', icon: Sparkles },
    { id: '432', label: '3. Teknik 4/3/2', icon: Clock },
    { id: 'speed-talk', label: '4. Speed Talking', icon: Radio },
    { id: 'shadowing', label: '5. Shadowing Practice', icon: Volume2 },
    { id: 'visual-story', label: '6. Visual Storytelling', icon: ImageIcon },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-scaleUp">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <Mic2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900">Tambah Soal Game Interaktif</h3>
              <p className="text-xs text-slate-500">
                Pilih jenis permainan dan buat variasi soal untuk siswa Anda.
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
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Game Type Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Pilih Jenis Game:</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {gameOptions.map(opt => {
                const isSelected = gameType === opt.id;
                const Icon = opt.icon;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setGameType(opt.id as InteractiveGameType)}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-bold transition-all text-left ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="truncate">{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Difficulty Level */}
          <div className="flex items-center gap-3">
            <label className="text-xs font-bold text-slate-700 flex-shrink-0">Tingkat Kesulitan:</label>
            <select
              value={level}
              onChange={e => setLevel(e.target.value as ProficiencyLevel)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-white focus:outline-none focus:border-blue-500"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          {/* DYNAMIC FIELDS PER GAME */}

          {/* 1. TABOO */}
          {gameType === 'taboo' && (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 animate-fadeIn">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Kata Target (Dideskripsikan) *</label>
                  <input
                    type="text"
                    required
                    value={tabooWord}
                    onChange={e => setTabooWord(e.target.value)}
                    placeholder="Contoh: TRAIN"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-black uppercase text-blue-900 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Kategori</label>
                  <input
                    type="text"
                    value={tabooCategory}
                    onChange={e => setTabooCategory(e.target.value)}
                    placeholder="Contoh: Transportation"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-rose-700">
                  5 Kata Terlarang (Dilarang Diucapkan) *
                </label>
                <input
                  type="text"
                  required
                  value={tabooForbidden}
                  onChange={e => setTabooForbidden(e.target.value)}
                  placeholder="Pisah koma: Track, Station, Rails, Locomotive, Wheels"
                  className="w-full px-3 py-2 rounded-xl border border-rose-200 bg-white text-xs text-rose-900 focus:outline-none focus:border-rose-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Tips Bantuan Guru (Hints)</label>
                <input
                  type="text"
                  value={tabooHints}
                  onChange={e => setTabooHints(e.target.value)}
                  placeholder="Contoh: A long vehicle that carries commuters across cities."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-600 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          )}

          {/* 2. YES, AND */}
          {gameType === 'yes-and' && (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 animate-fadeIn">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Judul Skenario Improv *</label>
                <input
                  type="text"
                  required
                  value={yesScenario}
                  onChange={e => setYesScenario(e.target.value)}
                  placeholder="Contoh: The Midnight Museum Alarm"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Kalimat Pembuka Guru / Siswa A *</label>
                <textarea
                  required
                  rows={2}
                  value={yesStarterLine}
                  onChange={e => setYesStarterLine(e.target.value)}
                  placeholder="Contoh: We were just about to lock the main glass door when the dinosaur skeleton in room 3 moved its tail..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Ide Alur Lanjutan ("Yes, and...")</label>
                <textarea
                  rows={2}
                  value={yesTwists}
                  onChange={e => setYesTwists(e.target.value)}
                  placeholder="Tulis 1 twist per baris, contoh:&#10;Yes, and the security guard recognized the dinosaur!&#10;Yes, and the museum lights suddenly switched off!"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          )}

          {/* 3. 4/3/2 TECHNIQUE */}
          {gameType === '432' && (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 animate-fadeIn">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Judul Topik Pidato 4/3/2 *</label>
                <input
                  type="text"
                  required
                  value={fttTitle}
                  onChange={e => setFttTitle(e.target.value)}
                  placeholder="Contoh: How Traveling to a New Place Changed My Perspective"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Deskripsi Instruksi Bicara</label>
                <textarea
                  rows={2}
                  value={fttDesc}
                  onChange={e => setFttDesc(e.target.value)}
                  placeholder="Babak 1 (4 mnt): Ceritakan lengkap. Babak 2 (3 mnt): Pangkas jeda bicara. Babak 3 (2 mnt): Sampaikan intinya secara padat dan ekspresif."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">3 Poin Kerangka Cerita (Outline)</label>
                <textarea
                  rows={3}
                  value={fttOutline}
                  onChange={e => setFttOutline(e.target.value)}
                  placeholder="Tulis 1 poin per baris, contoh:&#10;1. Kapan dan ke mana kamu pergi&#10;2. Kejadian tak terduga yang dialami di sana&#10;3. Pelajaran hidup yang paling berkesan hingga kini"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          )}

          {/* 4. SPEED TALK */}
          {gameType === 'speed-talk' && (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 animate-fadeIn">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Kategori Topik</label>
                  <input
                    type="text"
                    value={speedCategory}
                    onChange={e => setSpeedCategory(e.target.value)}
                    placeholder="Contoh: Technology & Ethics"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Pertanyaan Pemantik Bicara Cepat *</label>
                <textarea
                  required
                  rows={2}
                  value={speedTopic}
                  onChange={e => setSpeedTopic(e.target.value)}
                  placeholder="Contoh: If you had to eliminate one technology from human history, what would it be and why?"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Pertanyaan Pemandu (Guiding Questions)</label>
                <textarea
                  rows={2}
                  value={speedQuestions}
                  onChange={e => setSpeedQuestions(e.target.value)}
                  placeholder="Tulis 1 pertanyaan per baris, contoh:&#10;How would our daily productivity change?&#10;What alternative would take its place?"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          )}

          {/* 5. SHADOWING */}
          {gameType === 'shadowing' && (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 animate-fadeIn">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Judul Materi Shadowing *</label>
                <input
                  type="text"
                  required
                  value={shadowTitle}
                  onChange={e => setShadowTitle(e.target.value)}
                  placeholder="Contoh: Expressing Honest Opinion in Meetings"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700">Speaker / Nama</label>
                  <input
                    type="text"
                    value={shadowSpeaker}
                    onChange={e => setShadowSpeaker(e.target.value)}
                    placeholder="Emma (US Accent)"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700">Aksen & Gaya</label>
                  <input
                    type="text"
                    value={shadowAccent}
                    onChange={e => setShadowAccent(e.target.value)}
                    placeholder="American - Professional"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700">Topik Pembicaraan</label>
                  <input
                    type="text"
                    value={shadowTopic}
                    onChange={e => setShadowTopic(e.target.value)}
                    placeholder="Business Discussion"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Teks Kalimat Shadowing *</label>
                <textarea
                  required
                  rows={2}
                  value={shadowSentenceText}
                  onChange={e => setShadowSentenceText(e.target.value)}
                  placeholder="Contoh: While I understand the budget constraints, investing in quality training will yield higher returns."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Kata Tekanan (Emphasis Words)</label>
                  <input
                    type="text"
                    value={shadowEmphasis}
                    onChange={e => setShadowEmphasis(e.target.value)}
                    placeholder="Pisah koma: constraints, quality, higher returns"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Tips Fonetik / Pelafalan</label>
                  <input
                    type="text"
                    value={shadowPhonetic}
                    onChange={e => setShadowPhonetic(e.target.value)}
                    placeholder="Contoh: Naikkan intonasi di kata 'constraints'."
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 6. VISUAL STORY */}
          {gameType === 'visual-story' && (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 animate-fadeIn">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Judul Gambar / Cerita *</label>
                <input
                  type="text"
                  required
                  value={visTitle}
                  onChange={e => setVisTitle(e.target.value)}
                  placeholder="Contoh: The Secret Garden Gate"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">URL Gambar (Unsplash / Web)</label>
                <input
                  type="url"
                  value={visImageUrl}
                  onChange={e => setVisImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs focus:outline-none focus:border-blue-500 font-mono text-[11px]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Pertanyaan Pemandu Cerita Murid</label>
                <textarea
                  rows={2}
                  value={visQuestions}
                  onChange={e => setVisQuestions(e.target.value)}
                  placeholder="Tulis 1 pertanyaan per baris, contoh:&#10;Who discovered this gate?&#10;What is glowing on the other side?&#10;What happens when you touch the handle?"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Saran Kosakata (Vocabulary Suggestions)</label>
                <input
                  type="text"
                  value={visVocab}
                  onChange={e => setVisVocab(e.target.value)}
                  placeholder="Pisah koma: Overgrown ivy, Antique padlock, Whispering wind, Discovery"
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          )}

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
              className="px-6 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Simpan Soal ke Game Ini</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
