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
  RefreshCw
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

  const [activeSubTab, setActiveSubTab] = useState<'teachers' | 'classrooms' | 'students'>('teachers');

  // --- NEW TEACHER FORM STATE ---
  const [newTeacherName, setNewTeacherName] = useState('');
  const [newTeacherSchool, setNewTeacherSchool] = useState('');
  const [newTeacherSubject, setNewTeacherSubject] = useState('Bahasa Inggris');

  // --- EDIT CURRENT TEACHER STATE ---
  const [editTeacherName, setEditTeacherName] = useState(activeTeacher?.name || 'Teacher 1');
  const [editSchoolName, setEditSchoolName] = useState(activeTeacher?.schoolName || '');
  const [editSubject, setEditSubject] = useState(activeTeacher?.subject || 'Bahasa Inggris');

  // Keep edit state synced if activeTeacher changes
  React.useEffect(() => {
    if (activeTeacher) {
      setEditTeacherName(activeTeacher.name);
      setEditSchoolName(activeTeacher.schoolName || '');
      setEditSubject(activeTeacher.subject || 'Bahasa Inggris');
    }
  }, [activeTeacher?.id]);

  // --- CLASSROOM CREATION FORM STATE ---
  const [newClassName, setNewClassName] = useState('');
  const [newClassGrade, setNewClassGrade] = useState('Kelas 10');
  const [newClassDesc, setNewClassDesc] = useState('');

  // --- STUDENT CREATION STATE ---
  const [selectedClassForStudent, setSelectedClassForStudent] = useState<string>(activeClassId || classrooms[0]?.id || '');
  const [singleStudentName, setSingleStudentName] = useState('');
  const [batchNamesText, setBatchNamesText] = useState('');
  const [inputMode, setInputMode] = useState<'single' | 'batch'>('single');

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

  // Handle Create New Teacher
  const handleCreateTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeacherName.trim()) return;

    createTeacher(newTeacherName.trim(), newTeacherSchool.trim(), newTeacherSubject.trim());
    setNewTeacherName('');
    setNewTeacherSchool('');
    setNewTeacherSubject('Bahasa Inggris');
  };

  // Handle Save Current Teacher Profile
  const handleSaveTeacherProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTeacherName.trim()) return;

    updateTeacherProfile({
      name: editTeacherName.trim(),
      schoolName: editSchoolName.trim(),
      subject: editSubject.trim()
    });
  };

  // Handle Create Classroom for Active Teacher
  const handleCreateClassroom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName.trim() || !activeTeacher) return;

    const newClass: Classroom = {
      id: `cls-${Date.now()}`,
      name: newClassName.trim(),
      teacherId: activeTeacher.id,
      studentCount: 0,
      description: newClassDesc.trim() || 'Kelompok kelas aktif latihan berbicara dan membaca.',
      grade: newClassGrade
    };

    addClassroom(newClass);
    setNewClassName('');
    setNewClassDesc('');
    setSelectedClassForStudent(newClass.id);
  };

  // Handle Add Single Student
  const handleAddSingleStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!singleStudentName.trim() || !selectedClassForStudent) return;

    const newStudent: Student = {
      id: `st-${Date.now()}`,
      classId: selectedClassForStudent,
      name: singleStudentName.trim(),
      username: singleStudentName.trim().toLowerCase().replace(/[^a-z0-9]/g, '_'),
      level: 'intermediate',
      xp: 0,
      completedChallenges: 0,
      streak: 1,
      rankTitle: 'Rookie',
      createdAt: new Date().toISOString().split('T')[0]
    };

    addStudent(newStudent);
    setSingleStudentName('');
  };

  // Handle Add Batch Students
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
      level: 'intermediate',
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
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* 1. TOP HEADER BANNER */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-teal-700 text-white flex items-center justify-center font-bold text-xl flex-shrink-0">
            {activeTeacher?.name ? activeTeacher.name.charAt(0).toUpperCase() : 'T'}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900">{activeTeacher?.name || 'Teacher 1'}</h1>
              <span className="text-[11px] font-bold uppercase px-2 py-0.5 rounded bg-teal-100 text-teal-800">
                Pengajar Aktif
              </span>
            </div>
            <p className="text-xs text-slate-600">
              {activeTeacher?.schoolName ? `${activeTeacher.schoolName} • ` : ''}{activeTeacher?.subject || 'Bahasa Inggris'}
            </p>
            <p className="text-[11px] text-slate-500">
              {classrooms.length} Kelas • {students.length} Total Siswa Terkelola
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs">
          <button
            onClick={() => {
              setActiveSubTab('teachers');
              soundService.playClick();
            }}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeSubTab === 'teachers'
                ? 'bg-teal-700 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            1. Kelola Pengajar ({teachers.length})
          </button>
          <button
            onClick={() => {
              setActiveSubTab('classrooms');
              soundService.playClick();
            }}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeSubTab === 'classrooms'
                ? 'bg-teal-700 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            2. Kelola Kelas ({classrooms.length})
          </button>
          <button
            onClick={() => {
              setActiveSubTab('students');
              soundService.playClick();
            }}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeSubTab === 'students'
                ? 'bg-teal-700 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            3. Input Siswa ({studentsInSelectedClass.length})
          </button>
        </div>
      </div>

      {/* 2. SUBTAB: TEACHERS MANAGEMENT */}
      {activeSubTab === 'teachers' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Form Tambah Pengajar Baru & Edit Pengajar Aktif */}
          <div className="lg:col-span-2 space-y-6">
            {/* Box 1: Tambah Pengajar Baru */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                  <UserPlus className="w-4 h-4 text-teal-700" />
                  <span>Tambah Pengajar Baru</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Setiap pengajar memiliki daftar kelas dan muridnya masing-masing secara terpisah.
                </p>
              </div>

              <form onSubmit={handleCreateTeacher} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Nama Pengajar *</label>
                    <input
                      type="text"
                      value={newTeacherName}
                      onChange={(e) => setNewTeacherName(e.target.value)}
                      placeholder="Contoh: Teacher Ahmad, S.Pd."
                      required
                      className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-xs text-slate-800 focus:outline-none focus:border-teal-600"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Asal Sekolah / Lembaga</label>
                    <input
                      type="text"
                      value={newTeacherSchool}
                      onChange={(e) => setNewTeacherSchool(e.target.value)}
                      placeholder="Contoh: SMA Negeri 1 / English Center"
                      className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-xs text-slate-800 focus:outline-none focus:border-teal-600"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Mata Pelajaran / Spesialisasi</label>
                  <input
                    type="text"
                    value={newTeacherSubject}
                    onChange={(e) => setNewTeacherSubject(e.target.value)}
                    placeholder="Contoh: English Speaking & Fluency"
                    className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-xs text-slate-800 focus:outline-none focus:border-teal-600"
                  />
                </div>

                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-semibold shadow-2xs transition-colors flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Daftarkan Pengajar Ini</span>
                </button>
              </form>
            </div>

            {/* Box 2: Edit Profil Pengajar Aktif Saat Ini */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-teal-700" />
                  <span>Ubah Nama & Data Pengajar Aktif ({activeTeacher?.name})</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Perbarui nama yang akan tampil di sapaan kelas dan dasbor.
                </p>
              </div>

              <form onSubmit={handleSaveTeacherProfile} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Nama Pengajar</label>
                    <input
                      type="text"
                      value={editTeacherName}
                      onChange={(e) => setEditTeacherName(e.target.value)}
                      placeholder="Nama Pengajar"
                      required
                      className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-xs text-slate-800 focus:outline-none focus:border-teal-600"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Sekolah / Instansi</label>
                    <input
                      type="text"
                      value={editSchoolName}
                      onChange={(e) => setEditSchoolName(e.target.value)}
                      placeholder="Nama Sekolah"
                      className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-xs text-slate-800 focus:outline-none focus:border-teal-600"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Bidang / Subjek</label>
                  <input
                    type="text"
                    value={editSubject}
                    onChange={(e) => setEditSubject(e.target.value)}
                    placeholder="Contoh: English Speaking"
                    className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-xs text-slate-800 focus:outline-none focus:border-teal-600"
                  />
                </div>

                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Simpan Perubahan Pengajar</span>
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: Daftar Semua Pengajar Terdaftar & Tombol Ganti */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
              <div className="border-b border-slate-100 pb-2">
                <h4 className="font-bold text-sm text-slate-900">
                  Daftar Pengajar ({teachers.length})
                </h4>
                <p className="text-[11px] text-slate-500">
                  Pilih pengajar untuk berganti akun dan membuka kelas masing-masing.
                </p>
              </div>

              <div className="space-y-2.5">
                {teachers.map((teacher) => {
                  const isActive = teacher.id === activeTeacher?.id;
                  return (
                    <div
                      key={teacher.id}
                      className={`p-3.5 rounded-xl border transition-all ${
                        isActive
                          ? 'bg-teal-50 border-teal-500 ring-1 ring-teal-500'
                          : 'bg-slate-50 border-slate-200 hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                            isActive ? 'bg-teal-700 text-white' : 'bg-slate-200 text-slate-700'
                          }`}>
                            {teacher.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <strong className="text-xs text-slate-900 block truncate max-w-[130px]">
                              {teacher.name}
                            </strong>
                            <span className="text-[10px] text-slate-500 block truncate max-w-[130px]">
                              {teacher.schoolName || 'English Teacher'}
                            </span>
                          </div>
                        </div>

                        {isActive ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-700 text-white">
                            Sedang Aktif
                          </span>
                        ) : (
                          <button
                            onClick={() => switchActiveTeacher(teacher.id)}
                            className="px-2 py-1 text-[11px] font-semibold bg-white border border-slate-300 hover:border-teal-500 hover:text-teal-700 rounded text-slate-700 transition-colors"
                          >
                            Pilih
                          </button>
                        )}
                      </div>

                      {/* Delete button if not the only teacher */}
                      {!isActive && teachers.length > 1 && (
                        <div className="pt-2 border-t border-slate-200/60 flex justify-end">
                          <button
                            onClick={() => {
                              if (confirm(`Hapus akun pengajar ${teacher.name}? Semua kelas milik pengajar ini akan ikut terhapus.`)) {
                                deleteTeacher(teacher.id);
                              }
                            }}
                            className="text-[10px] text-rose-600 hover:text-rose-800 flex items-center gap-1"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Hapus Akun</span>
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. SUBTAB: CLASSROOMS MANAGEMENT */}
      {activeSubTab === 'classrooms' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Create New Classroom Form */}
          <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <FolderOpen className="w-4 h-4 text-teal-700" />
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
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-xs text-slate-800 focus:outline-none focus:border-teal-600"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Tingkat / Jenjang</label>
                <select
                  value={newClassGrade}
                  onChange={(e) => setNewClassGrade(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-800 bg-white focus:outline-none focus:border-teal-600"
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
                  placeholder="Contoh: Fokus speaking setiap Kamis pukul 08:00"
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-xs text-slate-800 focus:outline-none focus:border-teal-600"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-semibold shadow-2xs transition-colors flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Simpan Kelas Ini</span>
              </button>
            </form>
          </div>

          {/* List of Classrooms */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h3 className="font-bold text-sm text-slate-900">
                Daftar Kelas {activeTeacher?.name} ({classrooms.length} Kelas)
              </h3>
              <span className="text-[11px] text-slate-500">
                Klik kartu untuk menjadikannya kelas aktif di layar
              </span>
            </div>

            {classrooms.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-2xl border border-dashed border-slate-300 text-slate-400 space-y-2">
                <FolderOpen className="w-8 h-8 mx-auto text-slate-300" />
                <p className="text-xs font-bold text-slate-700">Belum ada kelas untuk pengajar ini</p>
                <p className="text-[11px] text-slate-500">Buat kelas pertama Anda di formulir sebelah kiri.</p>
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
                          ? 'bg-teal-50/80 border-teal-500 ring-1 ring-teal-500'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <span className="text-[10px] font-bold text-teal-800 bg-teal-100/70 px-2 py-0.5 rounded">
                            {cls.grade || 'Umum'}
                          </span>
                          <h4 className="font-bold text-sm text-slate-900 mt-1 truncate max-w-[200px]">
                            {cls.name}
                          </h4>
                        </div>

                        {isActive ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-700 text-white">
                            Aktif
                          </span>
                        ) : (
                          <button
                            onClick={() => {
                              setActiveClassId(cls.id);
                              soundService.playClick();
                            }}
                            className="text-[11px] font-semibold text-slate-700 bg-slate-100 hover:bg-teal-50 hover:text-teal-700 px-2.5 py-1 rounded transition-colors"
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
                          {cls.studentCount} Siswa Terdaftar
                        </span>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedClassForStudent(cls.id);
                              setActiveSubTab('students');
                            }}
                            className="text-teal-700 hover:underline font-semibold"
                          >
                            + Input Siswa
                          </button>

                          {classrooms.length > 1 && (
                            <button
                              onClick={() => {
                                if (confirm(`Hapus kelas "${cls.name}"? Data siswa di kelas ini akan dihapus.`)) {
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
      )}

      {/* 4. SUBTAB: STUDENTS INPUT & ROSTER */}
      {activeSubTab === 'students' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Form Input Siswa */}
          <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-teal-700" />
                <span>Input Siswa ke Kelas</span>
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Masukkan nama-nama siswa agar bisa diundi bicara dan dicatat nilainya.
              </p>
            </div>

            {/* Pilih Kelas Sasaran */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Pilih Kelas Sasaran:</label>
              <select
                value={selectedClassForStudent}
                onChange={(e) => setSelectedClassForStudent(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-800 bg-white focus:outline-none focus:border-teal-600"
              >
                {classrooms.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.studentCount} siswa)
                  </option>
                ))}
              </select>
            </div>

            {/* Toggle Mode: Satu-per-satu vs Sekaligus (Batch) */}
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-lg text-xs font-semibold">
              <button
                type="button"
                onClick={() => setInputMode('single')}
                className={`py-1.5 rounded transition-all ${
                  inputMode === 'single'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Input 1 Nama
              </button>
              <button
                type="button"
                onClick={() => setInputMode('batch')}
                className={`py-1.5 rounded transition-all ${
                  inputMode === 'batch'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Paste Banyak Nama
              </button>
            </div>

            {inputMode === 'single' ? (
              <form onSubmit={handleAddSingleStudent} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Nama Siswa</label>
                  <input
                    type="text"
                    value={singleStudentName}
                    onChange={(e) => setSingleStudentName(e.target.value)}
                    placeholder="Contoh: Dimas Aditya Pratama"
                    required
                    className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-xs text-slate-800 focus:outline-none focus:border-teal-600"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-semibold shadow-2xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambahkan Siswa</span>
                </button>
              </form>
            ) : (
              <form onSubmit={handleAddBatchStudents} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Paste Daftar Nama Siswa (1 per baris / koma)
                  </label>
                  <textarea
                    rows={6}
                    value={batchNamesText}
                    onChange={(e) => setBatchNamesText(e.target.value)}
                    placeholder={"Ahmad Fauzi\nBella Safira\nCitra Kirana\nDavid Maulana"}
                    required
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-800 focus:outline-none focus:border-teal-600 font-mono"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-semibold shadow-2xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambahkan Semua Nama</span>
                </button>
              </form>
            )}

            {/* Tombol Muat Siswa Contoh */}
            <div className="pt-3 border-t border-slate-100">
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
                <span>+ Muat 6 Nama Siswa Contoh</span>
              </button>
            </div>
          </div>

          {/* Right Column: Daftar Siswa di Kelas Terpilih */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-sm text-slate-900">
                  Daftar Siswa di {currentClassObj?.name || 'Kelas Terpilih'} ({studentsInSelectedClass.length} Siswa)
                </h3>
                <p className="text-[11px] text-slate-500">
                  Siswa yang terdaftar di kelas ini akan muncul di dasbor dan undian giliran bicara.
                </p>
              </div>

              {studentsInSelectedClass.length > 0 && (
                <span className="text-xs font-bold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200">
                  {studentsInSelectedClass.length} Siswa Siap Berlatih
                </span>
              )}
            </div>

            {studentsInSelectedClass.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300 text-slate-400 space-y-2">
                <Users className="w-8 h-8 mx-auto text-slate-300" />
                <p className="text-xs font-bold text-slate-700">Belum ada murid di kelas ini</p>
                <p className="text-[11px] text-slate-500">
                  Gunakan formulir di sebelah kiri untuk menginput nama murid satu per satu atau paste daftar nama dari Excel / Word.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[480px] overflow-y-auto pr-1">
                {studentsInSelectedClass.map((student, idx) => (
                  <div
                    key={student.id}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between hover:bg-slate-100/80 transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-6 h-6 rounded-md bg-teal-700 text-white flex items-center justify-center font-bold text-[11px] flex-shrink-0">
                        {idx + 1}
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-slate-900 block truncate">
                          {student.name}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          Skor: <strong className="text-teal-700">{student.xp || 0} XP</strong>
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
      )}
    </div>
  );
};
