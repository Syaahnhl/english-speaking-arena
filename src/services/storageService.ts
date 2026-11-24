import { UserProfile, SpeakingCard, ReadingMaterial, StudentSubmission, Classroom, Student, DailyChallenge, SpeakingCartItem, ProficiencyLevel, LeaderboardUser } from '../types';
import { DEFAULT_TEACHER, INITIAL_CLASSROOMS, INITIAL_SUBMISSIONS, INITIAL_STUDENTS, SAMPLE_STUDENTS_PRESET } from '../data/seedUsersData';
import { SPEAKING_CARDS } from '../data/speakingCardsData';
import { READING_MATERIALS } from '../data/readingMaterialsData';
import { ACHIEVEMENTS_LIST } from '../data/achievementsData';
import { getRankByXp } from './gamificationService';

const KEYS = {
  CURRENT_USER: 'esa_current_user',
  CURRENT_ROLE: 'esa_current_role',
  SPEAKING_CARDS: 'esa_speaking_cards',
  READING_MATERIALS: 'esa_reading_materials',
  SPEAKING_CART: 'esa_speaking_cart',
  SUBMISSIONS: 'esa_submissions',
  CLASSROOMS: 'esa_classrooms',
  STUDENTS: 'esa_students',
  DAILY_CHALLENGES: 'esa_daily_challenges',
  COMPLETED_CHALLENGES: 'esa_completed_challenges',
};

class StorageService {
  constructor() {
    this.initDefaults();
  }

  private initDefaults() {
    if (typeof window === 'undefined') return;

    if (!localStorage.getItem(KEYS.CURRENT_USER)) {
      localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(DEFAULT_TEACHER));
    }
    if (!localStorage.getItem(KEYS.CURRENT_ROLE)) {
      localStorage.setItem(KEYS.CURRENT_ROLE, 'teacher');
    }
    if (!localStorage.getItem(KEYS.SPEAKING_CARDS)) {
      localStorage.setItem(KEYS.SPEAKING_CARDS, JSON.stringify(SPEAKING_CARDS));
    }
    if (!localStorage.getItem(KEYS.READING_MATERIALS)) {
      localStorage.setItem(KEYS.READING_MATERIALS, JSON.stringify(READING_MATERIALS));
    }
    if (!localStorage.getItem(KEYS.SUBMISSIONS)) {
      localStorage.setItem(KEYS.SUBMISSIONS, JSON.stringify(INITIAL_SUBMISSIONS));
    }
    if (!localStorage.getItem(KEYS.CLASSROOMS)) {
      localStorage.setItem(KEYS.CLASSROOMS, JSON.stringify(INITIAL_CLASSROOMS));
    }
    if (!localStorage.getItem(KEYS.STUDENTS)) {
      localStorage.setItem(KEYS.STUDENTS, JSON.stringify(INITIAL_STUDENTS));
    }
    if (!localStorage.getItem(KEYS.DAILY_CHALLENGES)) {
      this.initDailyChallenges();
    }
  }

  public initDailyChallenges() {
    const today = new Date().toISOString().split('T')[0];
    const initialChallenges: DailyChallenge[] = [
      {
        id: 'dc-1',
        date: today,
        title: 'Morning Voice Warm-Up',
        description: 'Complete 1 Speaking Card in your current level',
        type: 'speaking',
        xpReward: 25,
        completed: false
      },
      {
        id: 'dc-2',
        date: today,
        title: 'Vocabulary In Action',
        description: 'Use at least 3 suggested vocabulary words in a practice session',
        type: 'vocabulary',
        xpReward: 25,
        completed: false
      },
      {
        id: 'dc-3',
        date: today,
        title: 'Speed & Comprehension Sprint',
        description: 'Finish 1 Running Reading article and pass the quiz with 80%+',
        type: 'reading',
        xpReward: 30,
        completed: false
      }
    ];
    localStorage.setItem(KEYS.DAILY_CHALLENGES, JSON.stringify(initialChallenges));
  }

  // --- USER / TEACHER PROFILE ---
  public getCurrentUser(): UserProfile {
    try {
      const stored = localStorage.getItem(KEYS.CURRENT_USER);
      if (stored) {
        const parsed = JSON.parse(stored);
        return { ...DEFAULT_TEACHER, ...parsed };
      }
    } catch {
      // fallback
    }
    return DEFAULT_TEACHER;
  }

  public saveCurrentUser(user: UserProfile) {
    const rankDef = getRankByXp(user.xp);
    user.rank = rankDef.name;
    localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
  }

  public updateTeacherProfile(updates: Partial<UserProfile>): UserProfile {
    const current = this.getCurrentUser();
    const updated = { ...current, ...updates };
    this.saveCurrentUser(updated);
    return updated;
  }

  public getCurrentRole(): 'student' | 'teacher' {
    return (localStorage.getItem(KEYS.CURRENT_ROLE) as 'student' | 'teacher') || 'teacher';
  }

  public switchRole(role: 'student' | 'teacher') {
    localStorage.setItem(KEYS.CURRENT_ROLE, role);
  }

  public updateLevel(level: ProficiencyLevel): UserProfile {
    const user = this.getCurrentUser();
    user.level = level;
    this.saveCurrentUser(user);
    return user;
  }

  public addXp(amount: number, reason: string): { newXp: number; leveledUp: boolean; unlockedAchievements: string[] } {
    const user = this.getCurrentUser();
    const oldRank = getRankByXp(user.xp);
    user.xp += amount;
    const newRank = getRankByXp(user.xp);
    const leveledUp = newRank.minXp > oldRank.minXp;

    const newlyUnlocked: string[] = [];
    ACHIEVEMENTS_LIST.forEach(ach => {
      if (!user.achievements.includes(ach.id)) {
        let satisfied = false;
        if (ach.requirement.type === 'activities_count' && user.completedActivities >= ach.requirement.threshold) {
          satisfied = true;
        } else if (ach.requirement.type === 'streak_days' && user.streakDays >= ach.requirement.threshold) {
          satisfied = true;
        }
        if (satisfied) {
          user.achievements.push(ach.id);
          newlyUnlocked.push(ach.title);
          user.xp += ach.xpReward;
        }
      }
    });

    this.saveCurrentUser(user);
    return {
      newXp: user.xp,
      leveledUp,
      unlockedAchievements: newlyUnlocked
    };
  }

  // --- CLASSROOMS ---
  public getClassrooms(): Classroom[] {
    try {
      const data = localStorage.getItem(KEYS.CLASSROOMS);
      if (data) return JSON.parse(data);
    } catch {
      // fallback
    }
    return INITIAL_CLASSROOMS;
  }

  public saveClassrooms(classrooms: Classroom[]) {
    localStorage.setItem(KEYS.CLASSROOMS, JSON.stringify(classrooms));
  }

  public addClassroom(classroom: Classroom) {
    const list = this.getClassrooms();
    list.push(classroom);
    this.saveClassrooms(list);
  }

  public updateClassroom(classroom: Classroom) {
    const list = this.getClassrooms().map(c => c.id === classroom.id ? classroom : c);
    this.saveClassrooms(list);
  }

  public deleteClassroom(classId: string) {
    const list = this.getClassrooms().filter(c => c.id !== classId);
    this.saveClassrooms(list);
    // Delete students in this class
    const students = this.getStudents().filter(s => s.classId !== classId);
    this.saveStudents(students);
  }

  // --- STUDENTS MANAGEMENT ---
  public getStudents(): Student[] {
    try {
      const data = localStorage.getItem(KEYS.STUDENTS);
      if (data) return JSON.parse(data);
    } catch {
      // fallback
    }
    return [];
  }

  public saveStudents(students: Student[]) {
    localStorage.setItem(KEYS.STUDENTS, JSON.stringify(students));
    // sync student counts across classrooms
    const classrooms = this.getClassrooms();
    let changed = false;
    classrooms.forEach(cls => {
      const count = students.filter(s => s.classId === cls.id).length;
      if (cls.studentCount !== count) {
        cls.studentCount = count;
        changed = true;
      }
    });
    if (changed) {
      this.saveClassrooms(classrooms);
    }
  }

  public getStudentsByClass(classId?: string): Student[] {
    const all = this.getStudents();
    if (!classId) return all;
    return all.filter(s => s.classId === classId);
  }

  public addStudent(student: Student) {
    const list = this.getStudents();
    list.push(student);
    this.saveStudents(list);
  }

  public addStudentsBatch(newStudents: Student[]) {
    const list = this.getStudents();
    list.push(...newStudents);
    this.saveStudents(list);
  }

  public updateStudent(student: Student) {
    const list = this.getStudents().map(s => s.id === student.id ? student : s);
    this.saveStudents(list);
  }

  public deleteStudent(id: string) {
    const list = this.getStudents().filter(s => s.id !== id);
    this.saveStudents(list);
  }

  public clearStudentsByClass(classId: string) {
    const list = this.getStudents().filter(s => s.classId !== classId);
    this.saveStudents(list);
  }

  public awardStudentXp(studentIdentifier: string, xpAmount: number) {
    const list = this.getStudents();
    const student = list.find(s => s.id === studentIdentifier || s.name.toLowerCase() === studentIdentifier.toLowerCase());
    if (student) {
      student.xp = (student.xp || 0) + xpAmount;
      student.completedChallenges = (student.completedChallenges || 0) + 1;
      const rank = getRankByXp(student.xp);
      student.rankTitle = rank.name;
      this.saveStudents(list);
    }
  }

  public loadSampleStudents(classId: string) {
    const currentStudents = this.getStudents();
    const sampleStudents: Student[] = SAMPLE_STUDENTS_PRESET.map((st, i) => ({
      ...st,
      id: `sample-${Date.now()}-${i}`,
      classId,
      avatar: `https://images.unsplash.com/photo-${1534528741775 + i * 100}?auto=format&fit=crop&w=256&q=80`
    }));
    this.saveStudents([...currentStudents, ...sampleStudents]);
    return sampleStudents;
  }

  // --- DYNAMIC LEADERBOARD FROM ACTUAL CLASS STUDENTS ---
  public getClassLeaderboard(classId?: string): LeaderboardUser[] {
    const students = this.getStudentsByClass(classId);
    if (students.length === 0) return [];

    const sorted = [...students].sort((a, b) => b.xp - a.xp);
    return sorted.map((st, index) => {
      let categoryPill: LeaderboardUser['categoryPill'] = undefined;
      if (index === 0) categoryPill = 'Top Speaker';
      else if (st.completedChallenges > 5) categoryPill = 'Debate Pro';
      else if (st.level === 'beginner') categoryPill = 'Beginner Rising Star';
      else if (st.streak >= 3) categoryPill = 'Consistency Star';

      return {
        id: st.id,
        name: st.name,
        username: st.username || st.name.toLowerCase().replace(/[^a-z0-9]/g, '_'),
        avatar: st.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(st.name)}`,
        level: st.level,
        xp: st.xp || 0,
        completedChallenges: st.completedChallenges || 0,
        streak: st.streak || 1,
        rankTitle: st.rankTitle || 'Rookie',
        categoryPill
      };
    });
  }

  // --- SUBMISSIONS ---
  public getSubmissions(): StudentSubmission[] {
    try {
      const data = localStorage.getItem(KEYS.SUBMISSIONS);
      if (data) return JSON.parse(data);
    } catch {
      // fallback
    }
    return INITIAL_SUBMISSIONS;
  }

  public addSubmission(sub: StudentSubmission) {
    const list = this.getSubmissions();
    list.unshift(sub);
    localStorage.setItem(KEYS.SUBMISSIONS, JSON.stringify(list));

    // Also award student XP if they exist in class
    if (sub.score) {
      const xp = Math.round(sub.score * 0.4);
      this.awardStudentXp(sub.studentName, xp);
    }
  }

  public gradeSubmission(id: string, score: number, feedback: string) {
    const list = this.getSubmissions();
    const item = list.find(s => s.id === id);
    if (item) {
      item.status = 'graded';
      item.score = score;
      item.feedback = feedback;
      localStorage.setItem(KEYS.SUBMISSIONS, JSON.stringify(list));
      this.awardStudentXp(item.studentName, Math.round(score * 0.4));
    }
  }

  // --- DAILY CHALLENGES ---
  public getDailyChallenges(): DailyChallenge[] {
    try {
      const data = localStorage.getItem(KEYS.DAILY_CHALLENGES);
      if (data) return JSON.parse(data);
    } catch {
      // fallback
    }
    return [];
  }

  public completeDailyChallenge(id: string): number {
    const list = this.getDailyChallenges();
    const target = list.find(c => c.id === id);
    if (target && !target.completed) {
      target.completed = true;
      localStorage.setItem(KEYS.DAILY_CHALLENGES, JSON.stringify(list));
      this.addXp(target.xpReward, `Completed daily challenge: ${target.title}`);
      return target.xpReward;
    }
    return 0;
  }

  // --- SPEAKING CARDS ---
  public getSpeakingCards(): SpeakingCard[] {
    try {
      const data = localStorage.getItem(KEYS.SPEAKING_CARDS);
      if (data) return JSON.parse(data);
    } catch {
      // fallback
    }
    return SPEAKING_CARDS;
  }

  public addSpeakingCard(card: SpeakingCard) {
    const cards = this.getSpeakingCards();
    cards.unshift(card);
    localStorage.setItem(KEYS.SPEAKING_CARDS, JSON.stringify(cards));
  }

  // --- RUNNING READING ---
  public getReadingMaterials(): ReadingMaterial[] {
    try {
      const data = localStorage.getItem(KEYS.READING_MATERIALS);
      if (data) return JSON.parse(data);
    } catch {
      // fallback
    }
    return READING_MATERIALS;
  }

  public addReadingMaterial(material: ReadingMaterial) {
    const list = this.getReadingMaterials();
    list.unshift(material);
    localStorage.setItem(KEYS.READING_MATERIALS, JSON.stringify(list));
  }

  // --- SPEAKING CART ---
  public getCartItems(): SpeakingCartItem[] {
    try {
      const data = localStorage.getItem(KEYS.SPEAKING_CART);
      if (data) return JSON.parse(data);
    } catch {
      // fallback
    }
    return [];
  }

  public saveCartItems(items: SpeakingCartItem[]) {
    localStorage.setItem(KEYS.SPEAKING_CART, JSON.stringify(items));
  }

  public addToCart(item: SpeakingCartItem) {
    const cart = this.getCartItems();
    if (!cart.some(c => c.id === item.id)) {
      cart.push(item);
      this.saveCartItems(cart);
    }
  }

  public removeFromCart(id: string) {
    const cart = this.getCartItems().filter(c => c.id !== id);
    this.saveCartItems(cart);
  }

  public clearCart() {
    this.saveCartItems([]);
  }

  // --- RESET ALL DATA ---
  public resetToFactory() {
    localStorage.removeItem(KEYS.CURRENT_USER);
    localStorage.removeItem(KEYS.SUBMISSIONS);
    localStorage.removeItem(KEYS.CLASSROOMS);
    localStorage.removeItem(KEYS.STUDENTS);
    this.initDefaults();
  }
}

export const storageService = new StorageService();
