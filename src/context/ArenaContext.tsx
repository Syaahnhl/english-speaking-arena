import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, ProficiencyLevel, UserRole, SpeakingCartItem, DailyChallenge, Classroom, Student } from '../types';
import { storageService } from '../services/storageService';
import { soundService } from '../services/soundService';
import { celebrateReward } from '../services/gamificationService';

export interface ToastMessage {
  id: string;
  type: 'xp' | 'success' | 'achievement' | 'info';
  title: string;
  message: string;
  xpAmount?: number;
}

interface ArenaContextType {
  user: UserProfile;
  activeTeacher: UserProfile;
  teachers: UserProfile[];
  role: UserRole;
  level: ProficiencyLevel;
  activeClassId: string;
  setActiveClassId: (id: string) => void;
  cart: SpeakingCartItem[];
  cartDurationMinutes: number;
  dailyChallenges: DailyChallenge[];
  soundEnabled: boolean;
  toasts: ToastMessage[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  setLevel: (level: ProficiencyLevel) => void;
  setRole: (role: UserRole) => void;
  toggleSound: () => void;
  addToCart: (item: SpeakingCartItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  awardXp: (amount: number, reason: string) => void;
  completeDailyChallenge: (id: string) => void;
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
  resetAllData: () => void;
  refreshState: () => void;
  // Multi-Teacher support
  switchActiveTeacher: (teacherId: string) => void;
  createTeacher: (name: string, schoolName?: string, subject?: string) => void;
  deleteTeacher: (teacherId: string) => void;
  updateTeacherProfile: (updates: Partial<UserProfile>) => void;
  // Classrooms & Students for Active Teacher
  classrooms: Classroom[];
  students: Student[];
  activeClassStudents: Student[];
  addClassroom: (cls: Classroom) => void;
  deleteClassroom: (classId: string) => void;
  addStudent: (st: Student) => void;
  addStudentsBatch: (students: Student[]) => void;
  deleteStudent: (studentId: string) => void;
  loadSampleStudents: (classId?: string) => void;
}

const ArenaContext = createContext<ArenaContextType | undefined>(undefined);

export const ArenaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [teachers, setTeachers] = useState<UserProfile[]>(storageService.getTeachers());
  const [user, setUser] = useState<UserProfile>(storageService.getCurrentUser());
  const [role, setRoleState] = useState<UserRole>(storageService.getCurrentRole());
  const [level, setLevelState] = useState<ProficiencyLevel>(user.level);
  
  const initialClasses = storageService.getClassrooms(user.id);
  const [classrooms, setClassrooms] = useState<Classroom[]>(initialClasses);
  const [activeClassId, setActiveClassId] = useState<string>(initialClasses[0]?.id || '');
  
  const [students, setStudents] = useState<Student[]>(storageService.getStudents());
  const [cart, setCart] = useState<SpeakingCartItem[]>(storageService.getCartItems());
  const [dailyChallenges, setDailyChallenges] = useState<DailyChallenge[]>(storageService.getDailyChallenges());
  const [soundEnabled, setSoundEnabledState] = useState<boolean>(true);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  const refreshState = () => {
    const updatedTeachers = storageService.getTeachers();
    const updatedActiveUser = storageService.getCurrentUser();
    const updatedClassrooms = storageService.getClassrooms(updatedActiveUser.id);
    const updatedStudents = storageService.getStudents();

    setTeachers(updatedTeachers);
    setUser(updatedActiveUser);
    setLevelState(updatedActiveUser.level);
    setRoleState(storageService.getCurrentRole());
    setClassrooms(updatedClassrooms);
    setStudents(updatedStudents);
    setCart(storageService.getCartItems());
    setDailyChallenges(storageService.getDailyChallenges());

    if (!updatedClassrooms.some(c => c.id === activeClassId) && updatedClassrooms.length > 0) {
      setActiveClassId(updatedClassrooms[0].id);
    } else if (updatedClassrooms.length === 0) {
      setActiveClassId('');
    }
  };

  useEffect(() => {
    refreshState();
  }, []);

  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { ...toast, id }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Switch Active Teacher
  const switchActiveTeacher = (teacherId: string) => {
    const newActiveTeacher = storageService.switchActiveTeacher(teacherId);
    const teacherClasses = storageService.getClassrooms(newActiveTeacher.id);
    setUser(newActiveTeacher);
    setClassrooms(teacherClasses);
    setActiveClassId(teacherClasses[0]?.id || '');
    soundService.playSuccess();
    addToast({
      type: 'info',
      title: 'Pengajar Aktif Berganti',
      message: `Sekarang mengajar sebagai: ${newActiveTeacher.name}`
    });
  };

  // Create New Teacher
  const createTeacher = (name: string, schoolName?: string, subject?: string) => {
    const created = storageService.createTeacher(name, schoolName, subject);
    refreshState();
    setActiveClassId(storageService.getClassrooms(created.id)[0]?.id || '');
    soundService.playSuccess();
    addToast({
      type: 'success',
      title: 'Pengajar Baru Terdaftar',
      message: `Akun pengajar "${created.name}" siap digunakan.`
    });
  };

  // Delete Teacher
  const deleteTeacher = (teacherId: string) => {
    const ok = storageService.deleteTeacher(teacherId);
    if (!ok) {
      addToast({
        type: 'info',
        title: 'Tidak Bisa Dihapus',
        message: 'Minimal harus ada 1 akun pengajar dalam sistem.'
      });
      return;
    }
    refreshState();
    soundService.playClick();
    addToast({
      type: 'info',
      title: 'Pengajar Dihapus',
      message: 'Akun pengajar dan kelas terkait telah dihapus.'
    });
  };

  const updateTeacherProfile = (updates: Partial<UserProfile>) => {
    const updated = storageService.updateTeacherProfile(updates);
    setUser(updated);
    refreshState();
    soundService.playSuccess();
    addToast({
      type: 'success',
      title: 'Profil Disimpan',
      message: `Profil "${updated.name}" berhasil diperbarui.`
    });
  };

  const addClassroom = (cls: Classroom) => {
    storageService.addClassroom(cls);
    refreshState();
    setActiveClassId(cls.id);
    soundService.playSuccess();
    addToast({
      type: 'success',
      title: 'Kelas Berhasil Dibuat',
      message: `Kelas "${cls.name}" siap digunakan.`
    });
  };

  const deleteClassroom = (classId: string) => {
    storageService.deleteClassroom(classId);
    refreshState();
    soundService.playClick();
    addToast({
      type: 'info',
      title: 'Kelas Dihapus',
      message: 'Kelas dan daftar siswa di dalamnya telah dihapus.'
    });
  };

  const addStudent = (st: Student) => {
    storageService.addStudent(st);
    refreshState();
    soundService.playSuccess();
    addToast({
      type: 'success',
      title: 'Siswa Ditambahkan',
      message: `"${st.name}" berhasil didaftarkan ke kelas.`
    });
  };

  const addStudentsBatch = (newStudents: Student[]) => {
    storageService.addStudentsBatch(newStudents);
    refreshState();
    soundService.playSuccess();
    addToast({
      type: 'success',
      title: 'Daftar Siswa Disimpan',
      message: `${newStudents.length} siswa berhasil didaftarkan.`
    });
  };

  const deleteStudent = (studentId: string) => {
    storageService.deleteStudent(studentId);
    refreshState();
    soundService.playClick();
    addToast({
      type: 'info',
      title: 'Siswa Dihapus',
      message: 'Siswa telah dihapus dari kelas.'
    });
  };

  const loadSampleStudents = (targetClassId?: string) => {
    const clsId = targetClassId || activeClassId;
    if (!clsId) {
      addToast({
        type: 'info',
        title: 'Pilih Kelas Dahulu',
        message: 'Buat atau pilih kelas terlebih dahulu sebelum memuat contoh siswa.'
      });
      return;
    }
    storageService.loadSampleStudents(clsId);
    refreshState();
    soundService.playSuccess();
    addToast({
      type: 'success',
      title: 'Contoh Siswa Dimuat',
      message: 'Siswa contoh berhasil dimasukkan untuk kelas ini.'
    });
  };

  const setLevel = (newLevel: ProficiencyLevel) => {
    const updated = storageService.updateLevel(newLevel);
    setUser(updated);
    setLevelState(newLevel);
    soundService.playClick();
    addToast({
      type: 'info',
      title: 'Tingkat Kemampuan Berubah',
      message: `Materi pembelajaran dialihkan ke ${newLevel.toUpperCase()}.`
    });
  };

  const setRole = (newRole: UserRole) => {
    storageService.switchRole(newRole);
    setRoleState(newRole);
    const updatedUser = storageService.getCurrentUser();
    setUser(updatedUser);
    setLevelState(updatedUser.level);
    soundService.playClick();
  };

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabledState(next);
    soundService.setSoundEnabled(next);
    if (next) soundService.playClick();
  };

  const addToCart = (item: SpeakingCartItem) => {
    storageService.addToCart(item);
    setCart(storageService.getCartItems());
    soundService.playClick();
    addToast({
      type: 'success',
      title: 'Ditambahkan ke Speaking Cart',
      message: `"${item.title}" dimasukkan ke alur sesi mengajar.`
    });
  };

  const removeFromCart = (id: string) => {
    storageService.removeFromCart(id);
    setCart(storageService.getCartItems());
    soundService.playClick();
  };

  const clearCart = () => {
    storageService.clearCart();
    setCart([]);
    soundService.playClick();
  };

  const awardXp = (amount: number, reason: string) => {
    const result = storageService.addXp(amount, reason);
    setUser(storageService.getCurrentUser());
    celebrateReward(result.leveledUp);

    addToast({
      type: result.leveledUp ? 'achievement' : 'xp',
      title: result.leveledUp ? '🎉 Pangkat Naik!' : 'XP Diperoleh!',
      message: `${reason} (+${amount} XP)`,
      xpAmount: amount
    });
  };

  const completeDailyChallenge = (id: string) => {
    const xp = storageService.completeDailyChallenge(id);
    if (xp > 0) {
      refreshState();
      celebrateReward(false);
      addToast({
        type: 'xp',
        title: 'Tantangan Selesai!',
        message: `+${xp} XP`,
        xpAmount: xp
      });
    }
  };

  const resetAllData = () => {
    storageService.resetToFactory();
    refreshState();
    soundService.playSuccess();
    addToast({
      type: 'info',
      title: 'Reset Selesai',
      message: 'Data simulasi telah dibersihkan.'
    });
  };

  const cartDurationMinutes = Math.round(cart.reduce((sum, item) => sum + item.duration, 0) / 60);
  const activeClassStudents = students.filter(s => s.classId === activeClassId);

  return (
    <ArenaContext.Provider
      value={{
        user,
        activeTeacher: user,
        teachers,
        role,
        level,
        activeClassId,
        setActiveClassId,
        cart,
        cartDurationMinutes,
        dailyChallenges,
        soundEnabled,
        toasts,
        activeTab,
        setActiveTab,
        setLevel,
        setRole,
        toggleSound,
        addToCart,
        removeFromCart,
        clearCart,
        awardXp,
        completeDailyChallenge,
        addToast,
        removeToast,
        resetAllData,
        refreshState,
        // Multi-Teacher
        switchActiveTeacher,
        createTeacher,
        deleteTeacher,
        updateTeacherProfile,
        // Classrooms & Students for Active Teacher
        classrooms,
        students,
        activeClassStudents,
        addClassroom,
        deleteClassroom,
        addStudent,
        addStudentsBatch,
        deleteStudent,
        loadSampleStudents
      }}
    >
      {children}
    </ArenaContext.Provider>
  );
};

export const useArena = () => {
  const context = useContext(ArenaContext);
  if (!context) {
    throw new Error('useArena must be used within an ArenaProvider');
  }
  return context;
};
