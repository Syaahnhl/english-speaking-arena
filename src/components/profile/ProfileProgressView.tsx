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
  X
} from 'lucide-react';

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

  const [activeStep, setActiveStep] = useState<'profile' | 'classrooms' | 'students'>('profile');

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

        {/* 3 Step Wizard Tabs (Easy for Beginners) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
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
                <span>+ Tambah Guru Baru</span>
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
                  <span>+ Buat Kelas Baru</span>
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
                              + Input Siswa →
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
    </div>
  );
};
