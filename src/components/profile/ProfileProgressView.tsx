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
  Mail, 
  Phone, 
  FileText, 
  BookOpen, 
  Upload, 
  Check, 
  AlertCircle,
  HelpCircle,
  Award
} from 'lucide-react';

export const ProfileProgressView: React.FC = () => {
  const { 
    user, 
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
    loadSampleStudents,
    addToast
  } = useArena();

  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'classrooms' | 'students'>('profile');

  // --- TEACHER PROFILE FORM STATE ---
  const [teacherName, setTeacherName] = useState(user.name);
  const [username, setUsername] = useState(user.username);
  const [schoolName, setSchoolName] = useState(user.schoolName || '');
  const [subject, setSubject] = useState(user.subject || 'Bahasa Inggris');
  const [email, setEmail] = useState(user.email || '');
  const [phone, setPhone] = useState(user.phone || '');
  const [bio, setBio] = useState(user.bio || '');
  const [avatar, setAvatar] = useState(user.avatar);

  // --- CLASSROOM CREATION FORM STATE ---
  const [newClassName, setNewClassName] = useState('');
  const [newClassGrade, setNewClassGrade] = useState('Grade 10');
  const [newClassDesc, setNewClassDesc] = useState('');
  const [newClassCode, setNewClassCode] = useState('');

  // --- STUDENT CREATION STATE ---
  const [selectedClassForStudent, setSelectedClassForStudent] = useState<string>(activeClassId);
  const [singleStudentName, setSingleStudentName] = useState('');
  const [singleStudentLevel, setSingleStudentLevel] = useState<ProficiencyLevel>('intermediate');
  const [batchNamesText, setBatchNamesText] = useState('');
  const [inputMode, setInputMode] = useState<'single' | 'batch'>('single');

  const currentClassObj = classrooms.find(c => c.id === selectedClassForStudent) || classrooms[0];
  const studentsInSelectedClass = students.filter(s => s.classId === selectedClassForStudent);

  // Save Teacher Profile
  const handleSaveTeacherProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateTeacherProfile({
      name: teacherName.trim() || 'Pengajar Bahasa Inggris',
      username: username.trim() || 'teacher',
      schoolName: schoolName.trim(),
      subject: subject.trim(),
      email: email.trim(),
      phone: phone.trim(),
      bio: bio.trim(),
      avatar
    });
  };

  // Create Classroom
  const handleCreateClassroom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName.trim()) return;

    const generatedCode = newClassCode.trim() || 
      `${newClassName.replace(/[^a-zA-Z0-9]/g, '').slice(0, 4).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;

    const newClass: Classroom = {
      id: `cls-${Date.now()}`,
      name: newClassName.trim(),
      code: generatedCode,
      teacherId: user.id,
      studentCount: 0,
      description: newClassDesc.trim() || 'Kelompok kelas aktif latihan berbicara dan membaca.',
      gradeLevel: newClassGrade
    };

    addClassroom(newClass);
    setNewClassName('');
    setNewClassDesc('');
    setNewClassCode('');
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
      level: singleStudentLevel,
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
      .split('\n')
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

  const avatarPresets = [
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&q=80',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=256&q=80'
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* 1. TOP HEADER BANNER */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl object-cover border-2 border-indigo-600 shadow-md"
          />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900">{user.name}</h1>
              <span className="text-xs font-extrabold uppercase px-2.5 py-0.5 rounded-lg bg-indigo-50 text-indigo-700">
                Pengajar
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              {user.schoolName ? `${user.schoolName} • ` : ''}{user.subject || 'Bahasa Inggris'}
            </p>
            <p className="text-[11px] text-slate-400">
              {classrooms.length} Kelas Terdaftar • {students.length} Siswa Terkelola
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200 text-xs">
          <button
            onClick={() => {
              setActiveSubTab('profile');
              soundService.playClick();
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all ${
              activeSubTab === 'profile'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Profil Pengajar</span>
          </button>

          <button
            onClick={() => {
              setActiveSubTab('classrooms');
              soundService.playClick();
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all ${
              activeSubTab === 'classrooms'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Input Nama Kelas ({classrooms.length})</span>
          </button>

          <button
            onClick={() => {
              setActiveSubTab('students');
              soundService.playClick();
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all ${
              activeSubTab === 'students'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Input Nama Siswa ({studentsInSelectedClass.length})</span>
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. SUBTAB: TEACHER PROFILE FORM */}
      {/* ============================================================== */}
      {activeSubTab === 'profile' && (
        <form onSubmit={handleSaveTeacherProfile} className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-soft space-y-6 animate-slide-up">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-black text-slate-900">Identitas & Biodata Pengajar</h2>
            <p className="text-xs text-slate-500 mt-1">
              Data ini ditampilkan pada rapor siswa, sertifikat turnamen arena, dan dasbor fasilitator kelas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Nama Lengkap & Gelar Guru</label>
              <input
                type="text"
                value={teacherName}
                onChange={(e) => setTeacherName(e.target.value)}
                placeholder="Contoh: Ms. Eleanor Vance / Budi Rahardjo, S.Pd."
                className="w-full px-4 py-3 rounded-2xl text-xs bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Username Pengajar</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Contoh: teacher_eleanor"
                className="w-full px-4 py-3 rounded-2xl text-xs bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Sekolah / Lembaga / Kursus</label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  placeholder="Contoh: SMA Bintang Bangsa / English First Academy"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl text-xs bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Mata Pelajaran / Fokus Latihan</label>
              <div className="relative">
                <BookOpen className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Contoh: English Speaking & Public Fluency"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl text-xs bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Email Pengajar</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Contoh: guru@sekolah.sch.id"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl text-xs bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">No. WhatsApp / Kontak</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Contoh: +62 812-3456-7890"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl text-xs bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Motto Mengajar / Bio Pengajar</label>
            <textarea
              rows={2}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tuliskan pesan motivasi atau visi kelas untuk murid..."
              className="w-full px-4 py-3 rounded-2xl text-xs bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium leading-relaxed"
            />
          </div>

          {/* Avatar Preset Picker */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 block">Pilih Foto Profil Pengajar</label>
            <div className="flex flex-wrap items-center gap-3">
              {avatarPresets.map((imgUrl, i) => (
                <button
                  type="button"
                  key={i}
                  onClick={() => setAvatar(imgUrl)}
                  className={`w-12 h-12 rounded-2xl overflow-hidden border-2 transition-all ${
                    avatar === imgUrl ? 'border-indigo-600 ring-2 ring-indigo-400/30 scale-105' : 'border-slate-200 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={imgUrl} alt="Avatar option" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-xs bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20 transition-all"
            >
              <Check className="w-4 h-4" />
              <span>Simpan Perubahan Profil</span>
            </button>
          </div>
        </form>
      )}

      {/* ============================================================== */}
      {/* 2. SUBTAB: CLASSROOMS MANAGEMENT (INPUT NAMA KELAS) */}
      {/* ============================================================== */}
      {activeSubTab === 'classrooms' && (
        <div className="space-y-8 animate-slide-up">
          {/* Form Buat Kelas Baru */}
          <form onSubmit={handleCreateClassroom} className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-soft space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-indigo-600" />
                <h3 className="font-extrabold text-base text-slate-900">Input / Tambah Kelas Baru</h3>
              </div>
              <span className="text-xs text-slate-400">Guru dapat membuat beberapa rombel kelas</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-bold text-slate-700">Nama Kelas</label>
                <input
                  type="text"
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                  placeholder="Contoh: Kelas 10-A English Orators / Speaking Club B"
                  className="w-full px-4 py-2.5 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Tingkat / Grade</label>
                <input
                  type="text"
                  value={newClassGrade}
                  onChange={(e) => setNewClassGrade(e.target.value)}
                  placeholder="Contoh: Grade 10 / Pemula"
                  className="w-full px-4 py-2.5 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-bold text-slate-700">Deskripsi / Catatan Kelas</label>
                <input
                  type="text"
                  value={newClassDesc}
                  onChange={(e) => setNewClassDesc(e.target.value)}
                  placeholder="Contoh: Fokus latihan bicara percaya diri dan fluency..."
                  className="w-full px-4 py-2.5 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Kode Kelas (Opsional)</label>
                <input
                  type="text"
                  value={newClassCode}
                  onChange={(e) => setNewClassCode(e.target.value)}
                  placeholder="Contoh: ENG-10A (otomatis jika kosong)"
                  className="w-full px-4 py-2.5 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Simpan Kelas Baru</span>
              </button>
            </div>
          </form>

          {/* List Kelas Yang Sudah Ada */}
          <div className="space-y-4">
            <h3 className="font-extrabold text-base text-slate-900 flex items-center justify-between">
              <span>Daftar Kelompok Kelas ({classrooms.length})</span>
              <span className="text-xs font-normal text-slate-400">Pilih salah satu kelas untuk memfasilitasi sesi</span>
            </h3>

            {classrooms.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-3xl border border-slate-200 text-slate-400 space-y-2">
                <GraduationCap className="w-8 h-8 mx-auto text-slate-300" />
                <p className="text-xs font-bold text-slate-600">Belum ada kelas yang dibuat.</p>
                <p className="text-[11px]">Gunakan formulir di atas untuk menginput nama kelas pertama Anda.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {classrooms.map((cls) => {
                  const isActive = cls.id === activeClassId;
                  const countInClass = students.filter(s => s.classId === cls.id).length;

                  return (
                    <div
                      key={cls.id}
                      className={`p-6 rounded-3xl border transition-all space-y-4 ${
                        isActive
                          ? 'bg-indigo-50/70 border-2 border-indigo-600 shadow-md ring-2 ring-indigo-400/20'
                          : 'bg-white border-slate-200 hover:border-slate-300 shadow-soft'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-700">
                              {cls.code}
                            </span>
                            {cls.gradeLevel && (
                              <span className="text-[10px] font-semibold text-slate-500">
                                • {cls.gradeLevel}
                              </span>
                            )}
                          </div>
                          <h4 className="text-lg font-black text-slate-900 mt-1">{cls.name}</h4>
                          <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mt-0.5">
                            {cls.description}
                          </p>
                        </div>

                        {isActive && (
                          <span className="flex-shrink-0 text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500 text-white flex items-center gap-1 shadow-sm">
                            <CheckCircle className="w-3 h-3" />
                            <span>Aktif</span>
                          </span>
                        )}
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-600 flex items-center gap-1.5">
                          <Users className="w-4 h-4 text-indigo-600" />
                          <span>{countInClass} Siswa Terdaftar</span>
                        </span>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedClassForStudent(cls.id);
                              setActiveSubTab('students');
                              soundService.playClick();
                            }}
                            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white text-indigo-700 border border-indigo-200 hover:bg-indigo-50 transition-all"
                          >
                            Kelola Siswa
                          </button>

                          {!isActive && (
                            <button
                              onClick={() => {
                                setActiveClassId(cls.id);
                                soundService.playSuccess();
                                addToast({
                                  type: 'info',
                                  title: 'Kelas Aktif Berpindah',
                                  message: `Sesi sekarang menggunakan rombel "${cls.name}".`
                                });
                              }}
                              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition-all shadow-sm"
                            >
                              Pilih Kelas
                            </button>
                          )}

                          {classrooms.length > 1 && (
                            <button
                              onClick={() => deleteClassroom(cls.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                              title="Hapus Kelas"
                            >
                              <Trash2 className="w-4 h-4" />
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

      {/* ============================================================== */}
      {/* 3. SUBTAB: STUDENTS MANAGEMENT (INPUT NAMA SISWA) */}
      {/* ============================================================== */}
      {activeSubTab === 'students' && (
        <div className="space-y-6 animate-slide-up">
          {/* Class Target Switcher & Quick Sample Loader */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-soft flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-500">Kelola Siswa untuk Kelas:</span>
              <select
                value={selectedClassForStudent}
                onChange={(e) => setSelectedClassForStudent(e.target.value)}
                className="font-black text-sm text-indigo-900 bg-indigo-50 px-3 py-1.5 rounded-xl border border-indigo-200 focus:outline-none cursor-pointer"
              >
                {classrooms.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({students.filter(s => s.classId === c.id).length} Siswa)
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={loadSampleStudents}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 transition-all"
                title="Muat 4 contoh nama murid untuk uji coba cepat"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>+ Muat Contoh Siswa (Opsional)</span>
              </button>
            </div>
          </div>

          {/* Input Mode Selector */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setInputMode('single')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                inputMode === 'single'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              + Input Satu per Satu
            </button>
            <button
              onClick={() => setInputMode('batch')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                inputMode === 'batch'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              📋 Paste Daftar Siswa Sekaligus (Batch)
            </button>
          </div>

          {/* Form: Single Student Input */}
          {inputMode === 'single' && (
            <form onSubmit={handleAddSingleStudent} className="p-6 bg-white rounded-3xl border border-slate-200 shadow-soft space-y-4 animate-slide-up">
              <h4 className="font-extrabold text-sm text-slate-900">Input Nama Siswa Baru</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700">Nama Lengkap Siswa</label>
                  <input
                    type="text"
                    value={singleStudentName}
                    onChange={(e) => setSingleStudentName(e.target.value)}
                    placeholder="Contoh: Muhammad Rizky / Anisa Rahma"
                    className="w-full px-4 py-2.5 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Tingkat Kemampuan</label>
                  <select
                    value={singleStudentLevel}
                    onChange={(e) => setSingleStudentLevel(e.target.value as ProficiencyLevel)}
                    className="w-full px-4 py-2.5 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold cursor-pointer"
                  >
                    <option value="beginner">Beginner (Pemula)</option>
                    <option value="intermediate">Intermediate (Menengah)</option>
                    <option value="advanced">Advanced (Mahir)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambahkan ke {currentClassObj?.name}</span>
                </button>
              </div>
            </form>
          )}

          {/* Form: Batch Student Input */}
          {inputMode === 'batch' && (
            <form onSubmit={handleAddBatchStudents} className="p-6 bg-white rounded-3xl border border-slate-200 shadow-soft space-y-4 animate-slide-up">
              <div>
                <h4 className="font-extrabold text-sm text-slate-900">Paste Daftar Siswa (Satu Nama per Baris)</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Salin dari Excel, Word, atau daftar absensi kelas lalu tempel langsung di bawah ini.
                </p>
              </div>

              <textarea
                rows={5}
                value={batchNamesText}
                onChange={(e) => setBatchNamesText(e.target.value)}
                placeholder={"Contoh:\nAhmad Fauzi\nBella Safira\nCitra Dewi\nDimas Pratama\nEka Saputra"}
                className="w-full px-4 py-3 rounded-2xl text-xs bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium leading-relaxed font-mono"
                required
              />

              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-slate-400">
                  {batchNamesText.split('\n').filter(l => l.trim().length > 0).length} nama terdeteksi
                </span>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20 transition-all"
                >
                  <Upload className="w-4 h-4" />
                  <span>Simpan Semua Nama Siswa</span>
                </button>
              </div>
            </form>
          )}

          {/* Table of Students in Selected Class */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-soft overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-base text-slate-900">
                  Daftar Siswa Terdaftar di {currentClassObj?.name}
                </h3>
                <p className="text-xs text-slate-500">
                  Siswa ini akan otomatis muncul pada undian Speaking Cards, Roleplay, dan Turnamen Duel
                </p>
              </div>
              <span className="text-xs font-mono font-bold px-3 py-1 bg-slate-100 rounded-full text-slate-700">
                {studentsInSelectedClass.length} Siswa
              </span>
            </div>

            {studentsInSelectedClass.length === 0 ? (
              <div className="p-12 text-center text-slate-400 space-y-3">
                <Users className="w-10 h-10 mx-auto text-slate-300" />
                <p className="text-sm font-bold text-slate-600">Belum ada data siswa di kelas ini.</p>
                <p className="text-xs max-w-md mx-auto text-slate-400">
                  Tambahkan nama siswa melalui form di atas atau klik tombol <strong>"+ Muat Contoh Siswa"</strong> untuk memasukkan data uji coba kelas.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px] tracking-wider font-bold bg-slate-50/60">
                      <th className="py-3 px-4">No</th>
                      <th className="py-3 px-4">Nama Siswa</th>
                      <th className="py-3 px-4">Level</th>
                      <th className="py-3 px-4">Pangkat / Gelar</th>
                      <th className="py-3 px-4 text-center">Tantangan</th>
                      <th className="py-3 px-4 text-right">Total XP</th>
                      <th className="py-3 px-4 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {studentsInSelectedClass.map((st, idx) => (
                      <tr key={st.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3.5 px-4 font-mono text-slate-400 font-bold">{idx + 1}</td>
                        <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center gap-2.5">
                          <img
                            src={st.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(st.name)}`}
                            alt={st.name}
                            className="w-7 h-7 rounded-full object-cover border border-slate-200"
                          />
                          <span>{st.name}</span>
                        </td>
                        <td className="py-3.5 px-4 capitalize">
                          <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-indigo-50 text-indigo-700">
                            {st.level}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center gap-1 font-bold text-slate-700">
                            <Award className="w-3.5 h-3.5 text-amber-500" />
                            {st.rankTitle || 'Rookie'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-600">
                          {st.completedChallenges} Selesai
                        </td>
                        <td className="py-3.5 px-4 text-right font-black font-mono text-indigo-600">
                          {st.xp || 0} XP
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <button
                            onClick={() => deleteStudent(st.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                            title="Hapus Siswa"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
