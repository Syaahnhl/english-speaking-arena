import React, { useState } from 'react';
import { useArena } from '../../context/ArenaContext';
import { Classroom, Student, ProficiencyLevel } from '../../types';
import { soundService } from '../../services/soundService';
import { 
  UserCheck, 
  GraduationCap, 
  Users, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle, 
  Sparkles, 
  Building2, 
  BookOpen, 
  Check, 
  AlertCircle,
  HelpCircle,
  FolderOpen,
  UserPlus,
  RefreshCw,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  X,
  Layers,
  Gauge,
  Clock,
  FileText,
  Theater,
  Swords,
  Mic2
} from 'lucide-react';
import { storageService } from '../../services/storageService';
import { CreateSpeakingCardModal } from '../speaking-cards/CreateSpeakingCardModal';
import { CreateReadingMaterialModal } from '../running-reading/CreateReadingMaterialModal';
import { CreateRoleplayModal } from '../roleplay/CreateRoleplayModal';
import { CreateBattleModal } from '../arena/CreateBattleModal';
import { CreateInteractiveQuestionModal } from '../interactive/CreateInteractiveQuestionModal';
import { SpeakingCard, ReadingMaterial, RoleplayScenario, HeadToHeadBattle } from '../../types';

export const ProfileProgressView: React.FC = () => {
  const { 
    teachers,
    activeTeacher,
    switchActiveTeacher,
    createTeacher,
    deleteTeacher,
    updateTeacherProfile,
    classrooms, 
    activeClassId, 
    setActiveClassId, 
    addClassroom, 
    deleteClassroom,
    students,
    addStudent, 
    addStudentsBatch, 
    deleteStudent,
    loadSampleStudents
  } = useArena();

  const [activeStep, setActiveStep] = useState<'profile' | 'classrooms' | 'students' | 'materials'>('profile');

  // --- CUSTOM MATERIALS STATE ---
  const [showCreateCardModal, setShowCreateCardModal] = useState(false);
  const [showCreateReadingModal, setShowCreateReadingModal] = useState(false);
  const [showCreateRoleplayModal, setShowCreateRoleplayModal] = useState(false);
  const [showCreateBattleModal, setShowCreateBattleModal] = useState(false);
  const [showCreateInteractiveModal, setShowCreateInteractiveModal] = useState(false);

  const [customCards, setCustomCards] = useState<SpeakingCard[]>(() => 
    storageService.getSpeakingCards().filter(c => c.isCustom)
  );
  const [customMaterials, setCustomMaterials] = useState<ReadingMaterial[]>(() => 
    storageService.getReadingMaterials().filter(m => m.isCustom)
  );
  const [customRoleplays, setCustomRoleplays] = useState<RoleplayScenario[]>(() => 
    storageService.getRoleplayScenarios().filter(r => r.isCustom)
  );
  const [customBattles, setCustomBattles] = useState<HeadToHeadBattle[]>(() => 
    storageService.getBattles().filter(b => b.isCustom)
  );

  const getCustomInteractiveList = () => {
    const taboo = storageService.getTabooCards().filter(x => x.isCustom).map(x => ({ id: x.id, type: 'Taboo', title: x.word, level: x.level, del: () => storageService.deleteTabooCard(x.id) }));
    const yesAnd = storageService.getYesAndPrompts().filter(x => x.isCustom).map(x => ({ id: x.id, type: 'Yes, And', title: x.scenario, level: x.level, del: () => storageService.deleteYesAndPrompt(x.id) }));
    const ftt = storageService.getFourThreeTwoTopics().filter(x => x.isCustom).map(x => ({ id: x.id, type: 'Teknik 4/3/2', title: x.title, level: x.level, del: () => storageService.deleteFourThreeTwoTopic(x.id) }));
    const speed = storageService.getSpeedTalkingTopics().filter(x => x.isCustom).map(x => ({ id: x.id, type: 'Speed Talk', title: x.topic, level: x.level, del: () => storageService.deleteSpeedTalkingTopic(x.id) }));
    const shadow = storageService.getShadowingLessons().filter(x => x.isCustom).map(x => ({ id: x.id, type: 'Shadowing', title: x.title, level: x.level, del: () => storageService.deleteShadowingLesson(x.id) }));
    const visual = storageService.getVisualStoryPrompts().filter(x => x.isCustom).map(x => ({ id: x.id, type: 'Visual Story', title: x.title, level: x.level, del: () => storageService.deleteVisualStoryPrompt(x.id) }));
    return [...taboo, ...yesAnd, ...ftt, ...speed, ...shadow, ...visual];
  };

  const [customInteractiveItems, setCustomInteractiveItems] = useState(() => getCustomInteractiveList());

  const refreshCustomContent = () => {
    setCustomCards(storageService.getSpeakingCards().filter(c => c.isCustom));
    setCustomMaterials(storageService.getReadingMaterials().filter(m => m.isCustom));
    setCustomRoleplays(storageService.getRoleplayScenarios().filter(r => r.isCustom));
    setCustomBattles(storageService.getBattles().filter(b => b.isCustom));
    setCustomInteractiveItems(getCustomInteractiveList());
  };

  // --- EDIT ACTIVE TEACHER STATE ---
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editTeacherName, setEditTeacherName] = useState(activeTeacher?.name || 'Teacher 1');
  const [editSchoolName, setEditSchoolName] = useState(activeTeacher?.schoolName || '');
  const [editSubject, setEditSubject] = useState(activeTeacher?.subject || 'Bahasa Inggris');

  // --- NEW TEACHER FORM MODAL/DRAWER STATE ---
  const [showAddTeacherModal, setShowAddTeacherModal] = useState(false);
  const [newTeacherName, setNewTeacherName] = useState('');
  const [newTeacherSchool, setNewTeacherSchool] = useState('');
  const [newTeacherSubject, setNewTeacherSubject] = useState('Bahasa Inggris');

  // Keep edit state synced if activeTeacher changes
  React.useEffect(() => {
    if (activeTeacher) {
      setEditTeacherName(activeTeacher.name);
      setEditSchoolName(activeTeacher.schoolName || '');
      setEditSubject(activeTeacher.subject || 'Bahasa Inggris');
    }
  }, [activeTeacher?.id]);

  // --- CLASSROOM CREATION STATE ---
  const [newClassName, setNewClassName] = useState('');
  const [newClassGrade, setNewClassGrade] = useState('Kelas 10 (SMA/SMK)');
  const [newClassTier, setNewClassTier] = useState<ProficiencyLevel>('intermediate');
  const [newClassDesc, setNewClassDesc] = useState('');

  // --- STUDENT CREATION STATE ---
  const [selectedClassForStudent, setSelectedClassForStudent] = useState<string>(activeClassId || classrooms[0]?.id || '');
  const [singleStudentName, setSingleStudentName] = useState('');
  const [batchNamesText, setBatchNamesText] = useState('');
  const [studentInputMode, setStudentInputMode] = useState<'single' | 'batch'>('single');

  // Sync selectedClassForStudent with activeClassId
  React.useEffect(() => {
    if (activeClassId) {
      setSelectedClassForStudent(activeClassId);
    } else if (classrooms.length > 0) {
      setSelectedClassForStudent(classrooms[0].id);
    }
  }, [activeClassId, classrooms]);

  const currentClassObj = classrooms.find(c => c.id === selectedClassForStudent) || classrooms[0];
  const studentsInSelectedClass = students.filter(s => s.classId === selectedClassForStudent);

  // Save Active Teacher Profile
  const handleSaveTeacherProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTeacherName.trim()) return;

    updateTeacherProfile({
      name: editTeacherName.trim(),
      schoolName: editSchoolName.trim(),
      subject: editSubject.trim()
    });
    setIsEditingProfile(false);
  };

  // Create New Teacher
  const handleCreateTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeacherName.trim()) return;

    createTeacher(newTeacherName.trim(), newTeacherSchool.trim(), newTeacherSubject.trim());
    setNewTeacherName('');
    setNewTeacherSchool('');
    setNewTeacherSubject('Bahasa Inggris');
    setShowAddTeacherModal(false);
  };

  // Create Classroom
  const handleCreateClassroom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName.trim() || !activeTeacher) return;

    const newClass: Classroom = {
      id: `cls-${Date.now()}`,
      name: newClassName.trim(),
      teacherId: activeTeacher.id,
      studentCount: 0,
      description: newClassDesc.trim() || 'Kelompok kelas aktif latihan berbicara dan membaca.',
      grade: newClassGrade,
      level: newClassTier
    };

    addClassroom(newClass);
    setNewClassName('');
    setNewClassDesc('');
    setSelectedClassForStudent(newClass.id);
  };

  // Add Single Student
  const handleAddSingleStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!singleStudentName.trim() || !selectedClassForStudent) return;

    const newStudent: Student = {
      id: `st-${Date.now()}`,
      classId: selectedClassForStudent,
      name: singleStudentName.trim(),
      username: singleStudentName.trim().toLowerCase().replace(/[^a-z0-9]/g, '_'),
      level: currentClassObj?.level || 'intermediate',
      xp: 0,
      completedChallenges: 0,
      streak: 1,
      rankTitle: 'Rookie',
      createdAt: new Date().toISOString().split('T')[0]
    };

    addStudent(newStudent);
    setSingleStudentName('');
  };

  // Add Batch Students
  const handleAddBatchStudents = (e: React.FormEvent) => {
    e.preventDefault();
    if (!batchNamesText.trim() || !selectedClassForStudent) return;

    const lines = batchNamesText
      .split(/[\n,]/)
      .map(line => line.trim())
      .filter(line => line.length > 0);

    if (lines.length === 0) return;

    const newStudents: Student[] = lines.map((name, idx) => ({
      id: `st-${Date.now()}-${idx}`,
      classId: selectedClassForStudent,
      name,
      username: name.toLowerCase().replace(/[^a-z0-9]/g, '_'),
      level: currentClassObj?.level || 'intermediate',
      xp: 0,
      completedChallenges: 0,
      streak: 1,
      rankTitle: 'Rookie',
      createdAt: new Date().toISOString().split('T')[0]
    }));

    addStudentsBatch(newStudents);
    setBatchNamesText('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* 1. FRIENDLY ONBOARDING HEADER & STEP NAVIGATION */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-blue-600" />
              <span>Pengaturan Guru, Kelas & Siswa</span>
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Panduan 3 langkah mudah untuk menyiapkan sesi belajar Anda di kelas.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="font-bold text-slate-700">Pengajar Aktif:</span>
            <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 font-bold border border-blue-200 truncate max-w-[150px]">
              {activeTeacher?.name || 'Teacher 1'}
            </span>
          </div>
        </div>

        {/* 4 Step Wizard Tabs (Easy for Beginners) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
          {/* Step 1 */}
          <button
            onClick={() => {
              setActiveStep('profile');
              soundService.playClick();
            }}
            className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
              activeStep === 'profile'
                ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs ${
                activeStep === 'profile' ? 'bg-white text-blue-700' : 'bg-slate-200 text-slate-700'
              }`}>
                1
              </div>
              <div className="truncate">
                <strong className="block truncate">Profil Guru</strong>
                <span className={`text-[10px] block truncate ${activeStep === 'profile' ? 'text-blue-100' : 'text-slate-400'}`}>
                  Atur Nama & Sekolah
                </span>
              </div>
            </div>
            <ChevronRight className={`w-4 h-4 flex-shrink-0 ${activeStep === 'profile' ? 'text-white' : 'text-slate-400'}`} />
          </button>

          {/* Step 2 */}
          <button
            onClick={() => {
              setActiveStep('classrooms');
              soundService.playClick();
            }}
            className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
              activeStep === 'classrooms'
                ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs ${
                activeStep === 'classrooms' ? 'bg-white text-blue-700' : 'bg-slate-200 text-slate-700'
              }`}>
                2
              </div>
              <div className="truncate">
                <strong className="block truncate">Kelas & Tier</strong>
                <span className={`text-[10px] block truncate ${activeStep === 'classrooms' ? 'text-blue-100' : 'text-slate-400'}`}>
                  {classrooms.length} Kelas Terdaftar
                </span>
              </div>
            </div>
            <ChevronRight className={`w-4 h-4 flex-shrink-0 ${activeStep === 'classrooms' ? 'text-white' : 'text-slate-400'}`} />
          </button>

          {/* Step 3 */}
          <button
            onClick={() => {
              setActiveStep('students');
              soundService.playClick();
            }}
            className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
              activeStep === 'students'
                ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs ${
                activeStep === 'students' ? 'bg-white text-blue-700' : 'bg-slate-200 text-slate-700'
              }`}>
                3
              </div>
              <div className="truncate">
                <strong className="block truncate">Daftar Siswa</strong>
                <span className={`text-[10px] block truncate ${activeStep === 'students' ? 'text-blue-100' : 'text-slate-400'}`}>
                  {students.length} Siswa Terkelola
                </span>
              </div>
            </div>
            <ChevronRight className={`w-4 h-4 flex-shrink-0 ${activeStep === 'students' ? 'text-white' : 'text-slate-400'}`} />
          </button>

          {/* Step 4: Topik & Materi Guru */}
          <button
            onClick={() => {
              setActiveStep('materials');
              refreshCustomContent();
              soundService.playClick();
            }}
            className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
              activeStep === 'materials'
                ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs ${
                activeStep === 'materials' ? 'bg-white text-blue-700' : 'bg-slate-200 text-slate-700'
              }`}>
                4
              </div>
              <div className="truncate">
                <strong className="block truncate">Topik & Materi</strong>
                <span className={`text-[10px] block truncate ${activeStep === 'materials' ? 'text-blue-100' : 'text-slate-400'}`}>
                  {customCards.length + customMaterials.length} Materi Kustom
                </span>
              </div>
            </div>
            <ChevronRight className={`w-4 h-4 flex-shrink-0 ${activeStep === 'materials' ? 'text-white' : 'text-slate-400'}`} />
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* STEP 1: PROFIL PENGATURAN GURU (CLEAN & NON-CONFUSING) */}
      {/* ========================================================= */}
      {activeStep === 'profile' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Main Card: Profil Pengajar Aktif */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-xl flex-shrink-0">
                  {activeTeacher?.name ? activeTeacher.name.charAt(0).toUpperCase() : 'T'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-slate-900">
                      {activeTeacher?.name || 'Teacher 1'}
                    </h3>
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-blue-100 text-blue-700">
                      Sedang Aktif
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {activeTeacher?.schoolName ? `${activeTeacher.schoolName} • ` : 'Belum ada nama sekolah • '}{activeTeacher?.subject || 'Bahasa Inggris'}
                  </p>
                </div>
              </div>

              {!isEditingProfile && (
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(true)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 self-start sm:self-auto"
                >
                  <Edit3 className="w-3.5 h-3.5 text-blue-600" />
                  <span>Ubah Nama & Data Saya</span>
                </button>
              )}
            </div>

            {/* If Teacher Clicks Edit: Clean Inline Form */}
            {isEditingProfile ? (
              <form onSubmit={handleSaveTeacherProfile} className="space-y-4 pt-1">
                <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 space-y-3">
                  <h4 className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                    <Edit3 className="w-3.5 h-3.5 text-blue-600" />
                    <span>Perbarui Data Profil Pengajar Anda</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700">Nama Pengajar *</label>
                      <input
                        type="text"
                        value={editTeacherName}
                        onChange={(e) => setEditTeacherName(e.target.value)}
                        placeholder="Contoh: Teacher Ahmad, S.Pd."
                        required
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-800 bg-white focus:outline-none focus:border-blue-600 font-semibold"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700">Asal Sekolah / Lembaga</label>
                      <input
                        type="text"
                        value={editSchoolName}
                        onChange={(e) => setEditSchoolName(e.target.value)}
                        placeholder="Contoh: SMA Negeri 1 / English Course"
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-800 bg-white focus:outline-none focus:border-blue-600"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Mata Pelajaran / Spesialisasi</label>
                    <input
                      type="text"
                      value={editSubject}
                      onChange={(e) => setEditSubject(e.target.value)}
                      placeholder="Contoh: English Speaking & Fluency"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-800 bg-white focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-2xs"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Simpan Perubahan</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditingProfile(false)}
                      className="px-3 py-2 bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 rounded-lg text-xs font-medium"
                    >
                      Batal
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Total Kelas</span>
                  <strong className="text-slate-900 font-bold text-sm">{classrooms.length} Kelas</strong>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Total Siswa</span>
                  <strong className="text-slate-900 font-bold text-sm">{students.length} Siswa</strong>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 col-span-2">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Langkah Selanjutnya</span>
                  <button
                    onClick={() => setActiveStep('classrooms')}
                    className="text-blue-600 font-bold hover:underline flex items-center gap-1 mt-0.5"
                  >
                    <span>Lanjut ke Langkah 2: Buat Kelas & Tier</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Secondary Section: Ganti Akun Guru / Tambah Pengajar Lain (Opsional) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span>Daftar Guru di Perangkat Ini ({teachers.length} Guru)</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Digunakan jika komputer/laptop ini dipakai bergantian oleh lebih dari 1 pengajar.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowAddTeacherModal(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Guru Baru</span>
              </button>
            </div>

            {/* List of Teachers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {teachers.map((t) => {
                const isActive = t.id === activeTeacher?.id;
                return (
                  <div
                    key={t.id}
                    className={`p-3.5 rounded-xl border transition-all flex items-center justify-between ${
                      isActive
                        ? 'bg-blue-50/70 border-blue-500 ring-1 ring-blue-500'
                        : 'bg-slate-50 border-slate-200 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                        isActive ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {t.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-slate-900 block truncate">
                          {t.name}
                        </span>
                        <span className="text-[10px] text-slate-500 block truncate">
                          {t.schoolName || 'English Teacher'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      {isActive ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-600 text-white">
                          Sedang Aktif
                        </span>
                      ) : (
                        <button
                          onClick={() => switchActiveTeacher(t.id)}
                          className="px-2.5 py-1 text-[11px] font-semibold bg-white border border-slate-300 hover:border-blue-600 hover:text-blue-600 rounded text-slate-700 transition-colors"
                        >
                          Pilih Akun Ini
                        </button>
                      )}

                      {!isActive && teachers.length > 1 && (
                        <button
                          onClick={() => {
                            if (confirm(`Hapus akun ${t.name}?`)) {
                              deleteTeacher(t.id);
                            }
                          }}
                          className="p-1 text-slate-400 hover:text-rose-600"
                          title="Hapus Akun"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: TAMBAH AKUN GURU BARU */}
      {showAddTeacherModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-blue-600" />
                <span>Daftarkan Akun Pengajar Baru</span>
              </h3>
              <button
                onClick={() => setShowAddTeacherModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTeacher} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Nama Pengajar *</label>
                <input
                  type="text"
                  value={newTeacherName}
                  onChange={(e) => setNewTeacherName(e.target.value)}
                  placeholder="Contoh: Teacher Ahmad, S.Pd."
                  required
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-800 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Asal Sekolah / Lembaga</label>
                <input
                  type="text"
                  value={newTeacherSchool}
                  onChange={(e) => setNewTeacherSchool(e.target.value)}
                  placeholder="Contoh: SMA Negeri 1 / English Center"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-800 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Mata Pelajaran</label>
                <input
                  type="text"
                  value={newTeacherSubject}
                  onChange={(e) => setNewTeacherSubject(e.target.value)}
                  placeholder="Bahasa Inggris"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-800 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-2xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Daftarkan Guru Ini</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddTeacherModal(false)}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* STEP 2: KELOLA KELAS & TIER KEMAMPUAN */}
      {/* ========================================================= */}
      {activeStep === 'classrooms' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Form Tambah Kelas Baru */}
            <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <FolderOpen className="w-4 h-4 text-blue-600" />
                  <span>Buat Kelas Baru</span>
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Milik pengajar: <strong className="text-slate-800">{activeTeacher?.name}</strong>
                </p>
              </div>

              <form onSubmit={handleCreateClassroom} className="space-y-3.5">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Nama Kelas *</label>
                  <input
                    type="text"
                    value={newClassName}
                    onChange={(e) => setNewClassName(e.target.value)}
                    placeholder="Contoh: Kelas 10-A English Orators"
                    required
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-800 focus:outline-none focus:border-blue-600"
                  />
                </div>

                {/* Tier Selection */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    Tier Kemampuan Bahasa Inggris *
                  </label>
                  <div className="grid grid-cols-3 gap-1">
                    {(['beginner', 'intermediate', 'advanced'] as ProficiencyLevel[]).map((tier) => (
                      <button
                        key={tier}
                        type="button"
                        onClick={() => setNewClassTier(tier)}
                        className={`py-2 px-1 text-center rounded-lg border text-xs font-bold capitalize transition-all ${
                          newClassTier === tier
                            ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {tier}
                      </button>
                    ))}
                  </div>
                  <p className="text-[10px] text-slate-500">
                    {newClassTier === 'beginner' && '🎯 Beginner: Kalimat sederhana & kosakata dasar.'}
                    {newClassTier === 'intermediate' && '⚡ Intermediate: Opini & simulasi roleplay.'}
                    {newClassTier === 'advanced' && '🔥 Advanced: Debat & komunikasi profesional.'}
                  </p>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Jenjang / Tingkat</label>
                  <select
                    value={newClassGrade}
                    onChange={(e) => setNewClassGrade(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-800 bg-white focus:outline-none focus:border-blue-600"
                  >
                    <option value="Kelas 7 (SMP)">Kelas 7 (SMP)</option>
                    <option value="Kelas 8 (SMP)">Kelas 8 (SMP)</option>
                    <option value="Kelas 9 (SMP)">Kelas 9 (SMP)</option>
                    <option value="Kelas 10 (SMA/SMK)">Kelas 10 (SMA/SMK)</option>
                    <option value="Kelas 11 (SMA/SMK)">Kelas 11 (SMA/SMK)</option>
                    <option value="Kelas 12 (SMA/SMK)">Kelas 12 (SMA/SMK)</option>
                    <option value="Kuliah / Umum">Kuliah / Umum</option>
                    <option value="English Course / Bimbel">English Course / Bimbel</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Catatan Kelas (Opsional)</label>
                  <textarea
                    rows={2}
                    value={newClassDesc}
                    onChange={(e) => setNewClassDesc(e.target.value)}
                    placeholder="Contoh: Latihan bicara setiap Kamis"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-800 focus:outline-none focus:border-blue-600"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-2xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Simpan Kelas Ini</span>
                </button>
              </form>
            </div>

            {/* Daftar Kelas */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <div>
                  <h3 className="font-bold text-sm text-slate-900">
                    Daftar Kelas {activeTeacher?.name} ({classrooms.length} Kelas)
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Pilih kelas untuk mengaktifkan sesi dan roster muridnya.
                  </p>
                </div>

                {classrooms.length > 0 && (
                  <button
                    onClick={() => setActiveStep('students')}
                    className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <span>Lanjut ke Langkah 3: Input Siswa</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {classrooms.length === 0 ? (
                <div className="p-8 text-center bg-white rounded-2xl border border-dashed border-slate-300 text-slate-400 space-y-2">
                  <FolderOpen className="w-8 h-8 mx-auto text-slate-300" />
                  <p className="text-xs font-bold text-slate-700">Belum ada kelas yang dibuat</p>
                  <p className="text-[11px] text-slate-500">Gunakan formulir sebelah kiri untuk membuat kelas pertama Anda.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {classrooms.map((cls) => {
                    const isActive = cls.id === activeClassId;
                    return (
                      <div
                        key={cls.id}
                        className={`p-4 rounded-xl border transition-all ${
                          isActive
                            ? 'bg-blue-50/80 border-blue-500 ring-1 ring-blue-500'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-blue-100 text-blue-700">
                                {cls.level || 'intermediate'}
                              </span>
                              <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                                {cls.grade || 'Umum'}
                              </span>
                            </div>
                            <h4 className="font-bold text-sm text-slate-900 mt-1.5 truncate max-w-[180px]">
                              {cls.name}
                            </h4>
                          </div>

                          {isActive ? (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-600 text-white">
                              Aktif
                            </span>
                          ) : (
                            <button
                              onClick={() => {
                                setActiveClassId(cls.id);
                                soundService.playClick();
                              }}
                              className="text-[11px] font-semibold text-slate-700 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 px-2.5 py-1 rounded transition-colors"
                            >
                              Pilih Kelas
                            </button>
                          )}
                        </div>

                        <p className="text-[11px] text-slate-500 line-clamp-2 mb-3">
                          {cls.description || 'Kelompok kelas latihan berbicara.'}
                        </p>

                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                          <span className="font-semibold text-slate-600">
                            {cls.studentCount} Siswa
                          </span>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setSelectedClassForStudent(cls.id);
                                setActiveStep('students');
                              }}
                              className="text-blue-600 hover:underline font-bold"
                            >
                              Input Siswa →
                            </button>

                            {classrooms.length > 1 && (
                              <button
                                onClick={() => {
                                  if (confirm(`Hapus kelas "${cls.name}"?`)) {
                                    deleteClassroom(cls.id);
                                  }
                                }}
                                className="text-slate-400 hover:text-rose-600 p-1"
                                title="Hapus Kelas"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* STEP 3: INPUT & ROSTER SISWA */}
      {/* ========================================================= */}
      {activeStep === 'students' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Form Input Siswa */}
            <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span>Input Siswa ke Kelas</span>
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Pilih kelas sasaran, lalu masukkan nama-nama murid.
                </p>
              </div>

              {/* Pilih Kelas Sasaran */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Kelas Tujuan:</label>
                <select
                  value={selectedClassForStudent}
                  onChange={(e) => setSelectedClassForStudent(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-800 bg-white focus:outline-none focus:border-blue-600 font-semibold"
                >
                  {classrooms.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.studentCount} siswa)
                    </option>
                  ))}
                </select>
              </div>

              {/* Mode Input: 1 Nama vs Sekaligus */}
              <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 rounded-lg text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setStudentInputMode('single')}
                  className={`py-1.5 rounded transition-all ${
                    studentInputMode === 'single'
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Input 1 Siswa
                </button>
                <button
                  type="button"
                  onClick={() => setStudentInputMode('batch')}
                  className={`py-1.5 rounded transition-all ${
                    studentInputMode === 'batch'
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Paste Banyak Nama
                </button>
              </div>

              {studentInputMode === 'single' ? (
                <form onSubmit={handleAddSingleStudent} className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Nama Siswa</label>
                    <input
                      type="text"
                      value={singleStudentName}
                      onChange={(e) => setSingleStudentName(e.target.value)}
                      placeholder="Contoh: Dimas Aditya Pratama"
                      required
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-800 focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-2xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Tambahkan Siswa</span>
                  </button>
                </form>
              ) : (
                <form onSubmit={handleAddBatchStudents} className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">
                      Paste Daftar Nama (1 per baris)
                    </label>
                    <textarea
                      rows={5}
                      value={batchNamesText}
                      onChange={(e) => setBatchNamesText(e.target.value)}
                      placeholder={"Ahmad Fauzi\nBella Safira\nCitra Kirana\nDavid Maulana"}
                      required
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-800 focus:outline-none focus:border-blue-600 font-mono"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-2xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Tambahkan Semua Nama</span>
                  </button>
                </form>
              )}

              {/* Tombol Cepat: Muat Siswa Contoh */}
              <div className="pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    if (selectedClassForStudent) {
                      loadSampleStudents(selectedClassForStudent);
                    }
                  }}
                  className="w-full py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>⚡ Muat Siswa Contoh Otomatis</span>
                </button>
              </div>
            </div>

            {/* Roster Siswa di Kelas Terpilih */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <h3 className="font-bold text-sm text-slate-900">
                    Daftar Siswa di {currentClassObj?.name || 'Kelas Terpilih'} ({studentsInSelectedClass.length} Siswa)
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Siswa siap dipanggil berbicara atau diberi poin di dasbor.
                  </p>
                </div>

                {studentsInSelectedClass.length > 0 && (
                  <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                    {studentsInSelectedClass.length} Siswa Aktif
                  </span>
                )}
              </div>

              {studentsInSelectedClass.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300 text-slate-400 space-y-2">
                  <Users className="w-8 h-8 mx-auto text-slate-300" />
                  <p className="text-xs font-bold text-slate-700">Belum ada murid di kelas ini</p>
                  <p className="text-[11px] text-slate-500">
                    Gunakan formulir sebelah kiri untuk input nama atau klik "Muat Siswa Contoh Otomatis".
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[440px] overflow-y-auto pr-1">
                  {studentsInSelectedClass.map((student, idx) => (
                    <div
                      key={student.id}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between hover:bg-slate-100/80 transition-colors"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-6 h-6 rounded-md bg-blue-600 text-white flex items-center justify-center font-bold text-[11px] flex-shrink-0">
                          {idx + 1}
                        </div>
                        <div className="min-w-0">
                          <span className="text-xs font-bold text-slate-900 block truncate">
                            {student.name}
                          </span>
                          <span className="text-[10px] text-slate-500">
                            Skor: <strong className="text-blue-600">{student.xp || 0} XP</strong>
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          if (confirm(`Hapus ${student.name} dari kelas?`)) {
                            deleteStudent(student.id);
                          }
                        }}
                        className="text-slate-400 hover:text-rose-600 p-1"
                        title="Hapus Siswa"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* STEP 4: KELOLA TOPIK & MATERI AJAR GURU */}
      {/* ========================================================= */}
      {activeStep === 'materials' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Header Action Banner */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-blue-100 text-blue-700 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Materi & Topik Silabus Pengajar</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900">
                Kelola Topik Diskusi & Teks Bacaan Sendiri
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                Input materi pelajaran atau topik spesifik yang sedang diajarkan di kelas agar siswa berlatih dengan konteks yang relevan.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 flex-shrink-0">
              <button
                onClick={() => {
                  soundService.playClick();
                  setShowCreateCardModal(true);
                }}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Buat Topik Speaking</span>
              </button>

              <button
                onClick={() => {
                  soundService.playClick();
                  setShowCreateReadingModal(true);
                }}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-md transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Buat Teks Teleprompter</span>
              </button>

              <button
                onClick={() => {
                  soundService.playClick();
                  setShowCreateRoleplayModal(true);
                }}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Buat Skenario Roleplay</span>
              </button>

              <button
                onClick={() => {
                  soundService.playClick();
                  setShowCreateBattleModal(true);
                }}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow-md transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Buat Topik Duel</span>
              </button>

              <button
                onClick={() => {
                  soundService.playClick();
                  setShowCreateInteractiveModal(true);
                }}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Soal Game</span>
              </button>
            </div>
          </div>

          {/* Section 1: Topik Speaking Cards Kustom */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">
                    Kartu Topik Speaking Buatan Guru ({customCards.length})
                  </h3>
                  <span className="text-[11px] text-slate-500">
                    Kartu pertanyaan pemantik untuk diproyeksikan dan diuji ke siswa di kelas
                  </span>
                </div>
              </div>
            </div>

            {customCards.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
                <Sparkles className="w-10 h-10 text-slate-300 mx-auto" />
                <div className="space-y-1">
                  <h4 className="font-bold text-xs text-slate-700">Belum Ada Topik Speaking Kustom</h4>
                  <p className="text-[11px] text-slate-500 max-w-md mx-auto">
                    Buat pertanyaan pemantik bicara baru yang selaras dengan tema pelajaran hari ini (misal: "Future Technology", "Environmental Issues", dll).
                  </p>
                </div>
                <button
                  onClick={() => setShowCreateCardModal(true)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-all inline-flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Buat Topik Pertama Anda</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {customCards.map(card => (
                  <div
                    key={card.id}
                    className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 hover:shadow-xs transition-all flex flex-col justify-between group"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                          {card.category}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono text-slate-400">
                            {card.estimatedDuration}s
                          </span>
                          <button
                            onClick={() => {
                              if (confirm(`Hapus topik "${card.title}"?`)) {
                                storageService.deleteSpeakingCard(card.id);
                                refreshCustomContent();
                              }
                            }}
                            className="text-slate-300 hover:text-rose-600 transition-colors p-1"
                            title="Hapus topik ini"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <h4 className="font-bold text-sm text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                        {card.title}
                      </h4>
                      <p className="text-xs text-slate-600 italic bg-slate-50 p-2.5 rounded-xl line-clamp-3">
                        "{card.question}"
                      </p>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                      <span className="capitalize font-semibold text-blue-600">Level: {card.level}</span>
                      <span className="text-slate-400">Buatan Pengajar</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 2: Teks Bacaan Teleprompter Kustom */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <Gauge className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">
                    Teks Bacaan Teleprompter Buatan Guru ({customMaterials.length})
                  </h3>
                  <span className="text-[11px] text-slate-500">
                    Teks artikel atau dialog untuk latihan kecepatan membaca kontinu di layar proyektor
                  </span>
                </div>
              </div>
            </div>

            {customMaterials.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
                <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
                <div className="space-y-1">
                  <h4 className="font-bold text-xs text-slate-700">Belum Ada Teks Bacaan Kustom</h4>
                  <p className="text-[11px] text-slate-500 max-w-md mx-auto">
                    Masukkan teks bacaan dari buku pelajaran, cerita fabel, atau artikel berita untuk diproyeksikan dan dibaca bersama siswa.
                  </p>
                </div>
                <button
                  onClick={() => setShowCreateReadingModal(true)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-xs transition-all inline-flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Teks Bacaan Pertama</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {customMaterials.map(mat => (
                  <div
                    key={mat.id}
                    className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 hover:shadow-xs transition-all flex flex-col justify-between group"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                          {mat.genre.replace('-', ' ')}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono text-slate-400">
                            {mat.wordCount} Kata
                          </span>
                          <button
                            onClick={() => {
                              if (confirm(`Hapus materi bacaan "${mat.title}"?`)) {
                                storageService.deleteReadingMaterial(mat.id);
                                refreshCustomContent();
                              }
                            }}
                            className="text-slate-300 hover:text-rose-600 transition-colors p-1"
                            title="Hapus materi ini"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <h4 className="font-bold text-sm text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                        {mat.title}
                      </h4>
                      <p className="text-xs text-slate-600 line-clamp-2">
                        {mat.summary}
                      </p>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                      <span className="capitalize font-semibold text-blue-600">Level: {mat.level}</span>
                      <span className="text-slate-400">{mat.paragraphs.length} Paragraf • {mat.questions.length} Kuis</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 3: Skenario Roleplay & Arena Duel Kustom */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Roleplay Kustom */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                    <Theater className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">
                      Skenario Roleplay Buatan Guru ({customRoleplays.length})
                    </h3>
                    <span className="text-[11px] text-slate-500">Misi rahasia berpasangan</span>
                  </div>
                </div>
                <button
                  onClick={() => setShowCreateRoleplayModal(true)}
                  className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah</span>
                </button>
              </div>

              {customRoleplays.length === 0 ? (
                <div className="p-6 text-center bg-slate-50 rounded-2xl border border-slate-200/80 text-xs text-slate-500">
                  Belum ada skenario roleplay buatan sendiri. Klik "Tambah" untuk membuat skenario misi baru.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {customRoleplays.map(r => (
                    <div key={r.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <span className="text-[10px] font-bold uppercase text-indigo-600">{r.level}</span>
                        <h4 className="font-bold text-xs text-slate-900 truncate">{r.title}</h4>
                      </div>
                      <button
                        onClick={() => {
                          if (confirm(`Hapus skenario "${r.title}"?`)) {
                            storageService.deleteRoleplayScenario(r.id);
                            refreshCustomContent();
                          }
                        }}
                        className="text-slate-400 hover:text-rose-600 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Arena Duel Kustom */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
                    <Swords className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">
                      Topik Duel 1v1 Buatan Guru ({customBattles.length})
                    </h3>
                    <span className="text-[11px] text-slate-500">Soal debat & adu argumen</span>
                  </div>
                </div>
                <button
                  onClick={() => setShowCreateBattleModal(true)}
                  className="text-xs font-bold text-sky-600 hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah</span>
                </button>
              </div>

              {customBattles.length === 0 ? (
                <div className="p-6 text-center bg-slate-50 rounded-2xl border border-slate-200/80 text-xs text-slate-500">
                  Belum ada topik duel buatan sendiri. Klik "Tambah" untuk membuat topik debat 1v1 baru.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {customBattles.map(b => (
                    <div key={b.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <span className="text-[10px] font-bold uppercase text-sky-600">{b.category} • {b.level}</span>
                        <h4 className="font-bold text-xs text-slate-900 truncate">{b.title}</h4>
                      </div>
                      <button
                        onClick={() => {
                          if (confirm(`Hapus topik duel "${b.title}"?`)) {
                            storageService.deleteBattle(b.id);
                            refreshCustomContent();
                          }
                        }}
                        className="text-slate-400 hover:text-rose-600 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Section 4: Soal Studio Games Interaktif Kustom */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                  <Mic2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">
                    Soal Studio Games Interaktif Buatan Guru ({customInteractiveItems.length})
                  </h3>
                  <span className="text-[11px] text-slate-500">
                    Taboo, Yes And, Teknik 4/3/2, Speed Talk, Shadowing, dan Visual Story
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowCreateInteractiveModal(true)}
                className="text-xs font-bold text-purple-600 hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Soal Game</span>
              </button>
            </div>

            {customInteractiveItems.length === 0 ? (
              <div className="p-6 text-center bg-slate-50 rounded-2xl border border-slate-200/80 text-xs text-slate-500">
                Belum ada soal game interaktif buatan sendiri. Tambahkan soal Taboo, Speed Talk, atau Shadowing khusus untuk kelas Anda.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {customInteractiveItems.map(item => (
                  <div key={item.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-purple-100 text-purple-700">
                        {item.type}
                      </span>
                      <h4 className="font-bold text-xs text-slate-900 truncate mt-1">{item.title}</h4>
                      <span className="text-[10px] text-slate-500 capitalize">Level: {item.level}</span>
                    </div>
                    <button
                      onClick={() => {
                        if (confirm(`Hapus soal "${item.title}"?`)) {
                          item.del();
                          refreshCustomContent();
                        }
                      }}
                      className="text-slate-400 hover:text-rose-600 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal Dialogs */}
      {showCreateCardModal && (
        <CreateSpeakingCardModal
          onClose={() => setShowCreateCardModal(false)}
          onSuccess={() => {
            refreshCustomContent();
            setShowCreateCardModal(false);
          }}
        />
      )}

      {showCreateReadingModal && (
        <CreateReadingMaterialModal
          onClose={() => setShowCreateReadingModal(false)}
          onSuccess={() => {
            refreshCustomContent();
            setShowCreateReadingModal(false);
          }}
        />
      )}

      <CreateRoleplayModal
        isOpen={showCreateRoleplayModal}
        onClose={() => setShowCreateRoleplayModal(false)}
        onCreated={() => {
          refreshCustomContent();
        }}
      />

      <CreateBattleModal
        isOpen={showCreateBattleModal}
        onClose={() => setShowCreateBattleModal(false)}
        onCreated={() => {
          refreshCustomContent();
        }}
      />

      <CreateInteractiveQuestionModal
        isOpen={showCreateInteractiveModal}
        onClose={() => setShowCreateInteractiveModal(false)}
        onCreated={() => {
          refreshCustomContent();
        }}
      />
    </div>
  );
};
