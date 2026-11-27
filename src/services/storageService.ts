import { 
  UserProfile, 
  SpeakingCard, 
  ReadingMaterial, 
  StudentSubmission, 
  Classroom, 
  Student, 
  DailyChallenge, 
  SpeakingCartItem, 
  ProficiencyLevel, 
  LeaderboardUser,
  RoleplayScenario,
  HeadToHeadBattle,
  TabooCard,
  YesAndPrompt,
  FourThreeTwoTopic,
  SpeedTalkingTopic,
  ShadowingLesson,
  VisualStoryPrompt
} from '../types';
import { DEFAULT_TEACHER, INITIAL_CLASSROOMS, INITIAL_SUBMISSIONS, INITIAL_STUDENTS, SAMPLE_STUDENTS_PRESET, HEAD_TO_HEAD_BATTLES } from '../data/seedUsersData';
import { SPEAKING_CARDS } from '../data/speakingCardsData';
import { READING_MATERIALS } from '../data/readingMaterialsData';
import { ROLEPLAY_SCENARIOS } from '../data/roleplayScenariosData';
import { 
  TABOO_CARDS, 
  YES_AND_PROMPTS, 
  FOUR_THREE_TWO_TOPICS, 
  SPEED_TALKING_TOPICS, 
  SHADOWING_LESSONS, 
  VISUAL_STORY_PROMPTS 
} from '../data/interactiveData';
import { ACHIEVEMENTS_LIST } from '../data/achievementsData';
import { getRankByXp } from './gamificationService';

const KEYS = {
  CURRENT_USER: 'esa_current_user',
  CURRENT_ROLE: 'esa_current_role',
  TEACHERS: 'esa_teachers_list',
  ACTIVE_TEACHER_ID: 'esa_active_teacher_id',
  SPEAKING_CARDS: 'esa_speaking_cards',
  READING_MATERIALS: 'esa_reading_materials',
  SPEAKING_CART: 'esa_speaking_cart',
  SUBMISSIONS: 'esa_submissions',
  CLASSROOMS: 'esa_classrooms',
  STUDENTS: 'esa_students',
  DAILY_CHALLENGES: 'esa_daily_challenges',
  COMPLETED_CHALLENGES: 'esa_completed_challenges',
  ROLEPLAY_SCENARIOS: 'esa_roleplay_scenarios',
  HEAD_TO_HEAD_BATTLES: 'esa_h2h_battles',
  TABOO_CARDS: 'esa_taboo_cards',
  YES_AND_PROMPTS: 'esa_yes_and_prompts',
  FOUR_THREE_TWO_TOPICS: 'esa_432_topics',
  SPEED_TALKING_TOPICS: 'esa_speed_talking_topics',
  SHADOWING_LESSONS: 'esa_shadowing_lessons',
  VISUAL_STORY_PROMPTS: 'esa_visual_story_prompts',
};

class StorageService {
  constructor() {
    this.initDefaults();
  }

  private initDefaults() {
    if (typeof window === 'undefined') return;

    if (!localStorage.getItem(KEYS.TEACHERS)) {
      localStorage.setItem(KEYS.TEACHERS, JSON.stringify([DEFAULT_TEACHER]));
    }
    if (!localStorage.getItem(KEYS.ACTIVE_TEACHER_ID)) {
      localStorage.setItem(KEYS.ACTIVE_TEACHER_ID, DEFAULT_TEACHER.id);
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

  // --- MULTI-TEACHER & USER PROFILE ---
  public getTeachers(): UserProfile[] {
    try {
      const data = localStorage.getItem(KEYS.TEACHERS);
      if (data) {
        const parsed: UserProfile[] = JSON.parse(data);
        if (parsed.length > 0) return parsed;
      }
    } catch {}
    return [DEFAULT_TEACHER];
  }

  public saveTeachers(teachers: UserProfile[]) {
    localStorage.setItem(KEYS.TEACHERS, JSON.stringify(teachers));
  }

  public getActiveTeacherId(): string {
    return localStorage.getItem(KEYS.ACTIVE_TEACHER_ID) || DEFAULT_TEACHER.id;
  }

  public setActiveTeacherId(teacherId: string) {
    localStorage.setItem(KEYS.ACTIVE_TEACHER_ID, teacherId);
  }

  public getCurrentUser(): UserProfile {
    const teachers = this.getTeachers();
    const activeId = this.getActiveTeacherId();
    const activeTeacher = teachers.find(t => t.id === activeId);
    if (activeTeacher) return activeTeacher;
    return teachers[0] || DEFAULT_TEACHER;
  }

  public saveCurrentUser(user: UserProfile) {
    const rankDef = getRankByXp(user.xp);
    user.rank = rankDef.name;

    const teachers = this.getTeachers();
    const index = teachers.findIndex(t => t.id === user.id);
    if (index >= 0) {
      teachers[index] = user;
    } else {
      teachers.push(user);
    }
    this.saveTeachers(teachers);
    this.setActiveTeacherId(user.id);
  }

  public createTeacher(name: string, schoolName?: string, subject?: string): UserProfile {
    const id = `teacher-${Date.now()}`;
    const cleanName = name.trim() || `Teacher ${this.getTeachers().length + 1}`;
    const newTeacher: UserProfile = {
      ...DEFAULT_TEACHER,
      id,
      name: cleanName,
      username: cleanName.toLowerCase().replace(/[^a-z0-9]/g, '_'),
      schoolName: schoolName?.trim() || '',
      subject: subject?.trim() || 'Bahasa Inggris',
      bio: 'Fasilitator pembelajaran bahasa Inggris aktif.',
      lastActiveDate: new Date().toISOString().split('T')[0]
    };

    const list = this.getTeachers();
    list.push(newTeacher);
    this.saveTeachers(list);
    this.setActiveTeacherId(id);

    // Otomatis buat 1 kelas bersih awal untuk pengajar baru ini
    const initialClass: Classroom = {
      id: `cls-${Date.now()}`,
      name: `Kelas 1 (${cleanName})`,
      teacherId: id,
      studentCount: 0,
      description: 'Kelas aktif latihan speaking spontan dan teleprompter.',
      gradeLevel: 'Umum',
      grade: 'Kelas 10',
      level: 'intermediate'
    };
    this.addClassroom(initialClass);

    return newTeacher;
  }

  public switchActiveTeacher(teacherId: string): UserProfile {
    this.setActiveTeacherId(teacherId);
    return this.getCurrentUser();
  }

  public deleteTeacher(teacherId: string): boolean {
    const list = this.getTeachers();
    if (list.length <= 1) {
      return false; // Minimal harus ada 1 pengajar
    }

    const filtered = list.filter(t => t.id !== teacherId);
    this.saveTeachers(filtered);

    // Hapus juga kelas dan murid milik pengajar yang dihapus
    const teacherClasses = this.getAllClassrooms().filter(c => c.teacherId === teacherId);
    const teacherClassIds = teacherClasses.map(c => c.id);

    const remainingClasses = this.getAllClassrooms().filter(c => c.teacherId !== teacherId);
    this.saveClassrooms(remainingClasses);

    const remainingStudents = this.getStudents().filter(s => !teacherClassIds.includes(s.classId));
    this.saveStudents(remainingStudents);

    // Jika yang dihapus adalah active teacher, ganti ke pengajar pertama
    if (this.getActiveTeacherId() === teacherId) {
      this.setActiveTeacherId(filtered[0].id);
    }

    return true;
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

  // --- CLASSROOMS (ISOLATED PER TEACHER) ---
  public getAllClassrooms(): Classroom[] {
    try {
      const data = localStorage.getItem(KEYS.CLASSROOMS);
      if (data) return JSON.parse(data);
    } catch {}
    return INITIAL_CLASSROOMS;
  }

  public getClassrooms(teacherId?: string): Classroom[] {
    const targetTeacherId = teacherId || this.getActiveTeacherId();
    const all = this.getAllClassrooms();
    const filtered = all.filter(c => c.teacherId === targetTeacherId);
    return filtered;
  }

  public saveClassrooms(classrooms: Classroom[]) {
    localStorage.setItem(KEYS.CLASSROOMS, JSON.stringify(classrooms));
  }

  public addClassroom(classroom: Classroom) {
    const currentTeacher = this.getCurrentUser();
    classroom.teacherId = classroom.teacherId || currentTeacher.id;

    const all = this.getAllClassrooms();
    all.push(classroom);
    this.saveClassrooms(all);
  }

  public updateClassroom(classroom: Classroom) {
    const all = this.getAllClassrooms().map(c => c.id === classroom.id ? classroom : c);
    this.saveClassrooms(all);
  }

  public deleteClassroom(classId: string) {
    const all = this.getAllClassrooms().filter(c => c.id !== classId);
    this.saveClassrooms(all);
    // Hapus murid di kelas ini
    const students = this.getStudents().filter(s => s.classId !== classId);
    this.saveStudents(students);
  }

  // --- STUDENTS MANAGEMENT ---
  public getStudents(): Student[] {
    try {
      const data = localStorage.getItem(KEYS.STUDENTS);
      if (data) return JSON.parse(data);
    } catch {}
    return [];
  }

  public saveStudents(students: Student[]) {
    localStorage.setItem(KEYS.STUDENTS, JSON.stringify(students));
    // update student count across all classrooms
    const allClassrooms = this.getAllClassrooms();
    let changed = false;
    allClassrooms.forEach(cls => {
      const count = students.filter(s => s.classId === cls.id).length;
      if (cls.studentCount !== count) {
        cls.studentCount = count;
        changed = true;
      }
    });
    if (changed) {
      this.saveClassrooms(allClassrooms);
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

  public addStudentPoints(studentId: string, points: number) {
    this.awardStudentXp(studentId, points);
  }

  public loadSampleStudents(classId: string) {
    const currentStudents = this.getStudents();
    const sampleStudents: Student[] = SAMPLE_STUDENTS_PRESET.map((st, i) => ({
      ...st,
      id: `sample-${Date.now()}-${i}`,
      classId
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
        avatar: '',
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
    } catch {}
    return INITIAL_SUBMISSIONS;
  }

  public addSubmission(sub: StudentSubmission) {
    const list = this.getSubmissions();
    list.unshift(sub);
    localStorage.setItem(KEYS.SUBMISSIONS, JSON.stringify(list));

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
    } catch {}
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
      if (data) {
        const list: SpeakingCard[] = JSON.parse(data);
        const existingIds = new Set(list.map(c => c.id));
        let added = false;
        for (const defaultCard of SPEAKING_CARDS) {
          if (!existingIds.has(defaultCard.id)) {
            list.push(defaultCard);
            existingIds.add(defaultCard.id);
            added = true;
          }
        }
        if (added) {
          localStorage.setItem(KEYS.SPEAKING_CARDS, JSON.stringify(list));
        }
        return list;
      }
    } catch {}
    return SPEAKING_CARDS;
  }

  public addSpeakingCard(card: SpeakingCard) {
    const cards = this.getSpeakingCards();
    cards.unshift(card);
    localStorage.setItem(KEYS.SPEAKING_CARDS, JSON.stringify(cards));
  }

  public deleteSpeakingCard(id: string) {
    try {
      const cards = this.getSpeakingCards().filter(c => c.id !== id);
      localStorage.setItem(KEYS.SPEAKING_CARDS, JSON.stringify(cards));
    } catch {}
  }

  // --- RUNNING READING ---
  public getReadingMaterials(): ReadingMaterial[] {
    try {
      const data = localStorage.getItem(KEYS.READING_MATERIALS);
      if (data) {
        const list: ReadingMaterial[] = JSON.parse(data);
        const existingIds = new Set(list.map(m => m.id));
        let added = false;
        for (const defaultMat of READING_MATERIALS) {
          if (!existingIds.has(defaultMat.id)) {
            list.push(defaultMat);
            existingIds.add(defaultMat.id);
            added = true;
          }
        }
        if (added) {
          localStorage.setItem(KEYS.READING_MATERIALS, JSON.stringify(list));
        }
        return list;
      }
    } catch {}
    return READING_MATERIALS;
  }

  public addReadingMaterial(material: ReadingMaterial) {
    const list = this.getReadingMaterials();
    list.unshift(material);
    localStorage.setItem(KEYS.READING_MATERIALS, JSON.stringify(list));
  }

  public deleteReadingMaterial(id: string) {
    try {
      const materials = this.getReadingMaterials().filter(m => m.id !== id);
      localStorage.setItem(KEYS.READING_MATERIALS, JSON.stringify(materials));
    } catch {}
  }

  // --- SPEAKING CART ---
  public getCartItems(): SpeakingCartItem[] {
    try {
      const data = localStorage.getItem(KEYS.SPEAKING_CART);
      if (data) return JSON.parse(data);
    } catch {}
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

  // --- ROLEPLAY SCENARIOS ---
  public getRoleplayScenarios(): RoleplayScenario[] {
    try {
      const data = localStorage.getItem(KEYS.ROLEPLAY_SCENARIOS);
      if (data) {
        const list: RoleplayScenario[] = JSON.parse(data);
        const existingIds = new Set(list.map(s => s.id));
        let added = false;
        for (const def of ROLEPLAY_SCENARIOS) {
          if (!existingIds.has(def.id)) {
            list.push(def);
            existingIds.add(def.id);
            added = true;
          }
        }
        if (added) {
          localStorage.setItem(KEYS.ROLEPLAY_SCENARIOS, JSON.stringify(list));
        }
        return list;
      }
    } catch {}
    return ROLEPLAY_SCENARIOS;
  }

  public saveCustomRoleplayScenario(scenario: RoleplayScenario) {
    const list = this.getRoleplayScenarios();
    list.unshift(scenario);
    localStorage.setItem(KEYS.ROLEPLAY_SCENARIOS, JSON.stringify(list));
  }

  public deleteRoleplayScenario(id: string) {
    try {
      const list = this.getRoleplayScenarios().filter(s => s.id !== id);
      localStorage.setItem(KEYS.ROLEPLAY_SCENARIOS, JSON.stringify(list));
    } catch {}
  }

  // --- HEAD-TO-HEAD DUEL BATTLES ---
  public getBattles(): HeadToHeadBattle[] {
    try {
      const data = localStorage.getItem(KEYS.HEAD_TO_HEAD_BATTLES);
      if (data) {
        const list: HeadToHeadBattle[] = JSON.parse(data);
        const existingIds = new Set(list.map(b => b.id));
        let added = false;
        for (const def of HEAD_TO_HEAD_BATTLES) {
          if (!existingIds.has(def.id)) {
            list.push(def);
            existingIds.add(def.id);
            added = true;
          }
        }
        if (added) {
          localStorage.setItem(KEYS.HEAD_TO_HEAD_BATTLES, JSON.stringify(list));
        }
        return list;
      }
    } catch {}
    return HEAD_TO_HEAD_BATTLES;
  }

  public saveCustomBattle(battle: HeadToHeadBattle) {
    const list = this.getBattles();
    list.unshift(battle);
    localStorage.setItem(KEYS.HEAD_TO_HEAD_BATTLES, JSON.stringify(list));
  }

  public deleteBattle(id: string) {
    try {
      const list = this.getBattles().filter(b => b.id !== id);
      localStorage.setItem(KEYS.HEAD_TO_HEAD_BATTLES, JSON.stringify(list));
    } catch {}
  }

  // --- INTERACTIVE: TABOO CARDS ---
  public getTabooCards(): TabooCard[] {
    try {
      const data = localStorage.getItem(KEYS.TABOO_CARDS);
      if (data) {
        const list: TabooCard[] = JSON.parse(data);
        const existingIds = new Set(list.map(c => c.id));
        let added = false;
        for (const def of TABOO_CARDS) {
          if (!existingIds.has(def.id)) {
            list.push(def);
            existingIds.add(def.id);
            added = true;
          }
        }
        if (added) {
          localStorage.setItem(KEYS.TABOO_CARDS, JSON.stringify(list));
        }
        return list;
      }
    } catch {}
    return TABOO_CARDS;
  }

  public saveCustomTabooCard(card: TabooCard) {
    const list = this.getTabooCards();
    list.unshift(card);
    localStorage.setItem(KEYS.TABOO_CARDS, JSON.stringify(list));
  }

  public deleteTabooCard(id: string) {
    try {
      const list = this.getTabooCards().filter(c => c.id !== id);
      localStorage.setItem(KEYS.TABOO_CARDS, JSON.stringify(list));
    } catch {}
  }

  // --- INTERACTIVE: YES, AND PROMPTS ---
  public getYesAndPrompts(): YesAndPrompt[] {
    try {
      const data = localStorage.getItem(KEYS.YES_AND_PROMPTS);
      if (data) {
        const list: YesAndPrompt[] = JSON.parse(data);
        const existingIds = new Set(list.map(p => p.id));
        let added = false;
        for (const def of YES_AND_PROMPTS) {
          if (!existingIds.has(def.id)) {
            list.push(def);
            existingIds.add(def.id);
            added = true;
          }
        }
        if (added) {
          localStorage.setItem(KEYS.YES_AND_PROMPTS, JSON.stringify(list));
        }
        return list;
      }
    } catch {}
    return YES_AND_PROMPTS;
  }

  public saveCustomYesAndPrompt(prompt: YesAndPrompt) {
    const list = this.getYesAndPrompts();
    list.unshift(prompt);
    localStorage.setItem(KEYS.YES_AND_PROMPTS, JSON.stringify(list));
  }

  public deleteYesAndPrompt(id: string) {
    try {
      const list = this.getYesAndPrompts().filter(p => p.id !== id);
      localStorage.setItem(KEYS.YES_AND_PROMPTS, JSON.stringify(list));
    } catch {}
  }

  // --- INTERACTIVE: 4/3/2 TOPICS ---
  public getFourThreeTwoTopics(): FourThreeTwoTopic[] {
    try {
      const data = localStorage.getItem(KEYS.FOUR_THREE_TWO_TOPICS);
      if (data) {
        const list: FourThreeTwoTopic[] = JSON.parse(data);
        const existingIds = new Set(list.map(t => t.id));
        let added = false;
        for (const def of FOUR_THREE_TWO_TOPICS) {
          if (!existingIds.has(def.id)) {
            list.push(def);
            existingIds.add(def.id);
            added = true;
          }
        }
        if (added) {
          localStorage.setItem(KEYS.FOUR_THREE_TWO_TOPICS, JSON.stringify(list));
        }
        return list;
      }
    } catch {}
    return FOUR_THREE_TWO_TOPICS;
  }

  public saveCustomFourThreeTwoTopic(topic: FourThreeTwoTopic) {
    const list = this.getFourThreeTwoTopics();
    list.unshift(topic);
    localStorage.setItem(KEYS.FOUR_THREE_TWO_TOPICS, JSON.stringify(list));
  }

  public deleteFourThreeTwoTopic(id: string) {
    try {
      const list = this.getFourThreeTwoTopics().filter(t => t.id !== id);
      localStorage.setItem(KEYS.FOUR_THREE_TWO_TOPICS, JSON.stringify(list));
    } catch {}
  }

  // --- INTERACTIVE: SPEED TALKING TOPICS ---
  public getSpeedTalkingTopics(): SpeedTalkingTopic[] {
    try {
      const data = localStorage.getItem(KEYS.SPEED_TALKING_TOPICS);
      if (data) {
        const list: SpeedTalkingTopic[] = JSON.parse(data);
        const existingIds = new Set(list.map(t => t.id));
        let added = false;
        for (const def of SPEED_TALKING_TOPICS) {
          if (!existingIds.has(def.id)) {
            list.push(def);
            existingIds.add(def.id);
            added = true;
          }
        }
        if (added) {
          localStorage.setItem(KEYS.SPEED_TALKING_TOPICS, JSON.stringify(list));
        }
        return list;
      }
    } catch {}
    return SPEED_TALKING_TOPICS;
  }

  public saveCustomSpeedTalkingTopic(topic: SpeedTalkingTopic) {
    const list = this.getSpeedTalkingTopics();
    list.unshift(topic);
    localStorage.setItem(KEYS.SPEED_TALKING_TOPICS, JSON.stringify(list));
  }

  public deleteSpeedTalkingTopic(id: string) {
    try {
      const list = this.getSpeedTalkingTopics().filter(t => t.id !== id);
      localStorage.setItem(KEYS.SPEED_TALKING_TOPICS, JSON.stringify(list));
    } catch {}
  }

  // --- INTERACTIVE: SHADOWING LESSONS ---
  public getShadowingLessons(): ShadowingLesson[] {
    try {
      const data = localStorage.getItem(KEYS.SHADOWING_LESSONS);
      if (data) {
        const list: ShadowingLesson[] = JSON.parse(data);
        const existingIds = new Set(list.map(l => l.id));
        let added = false;
        for (const def of SHADOWING_LESSONS) {
          if (!existingIds.has(def.id)) {
            list.push(def);
            existingIds.add(def.id);
            added = true;
          }
        }
        if (added) {
          localStorage.setItem(KEYS.SHADOWING_LESSONS, JSON.stringify(list));
        }
        return list;
      }
    } catch {}
    return SHADOWING_LESSONS;
  }

  public saveCustomShadowingLesson(lesson: ShadowingLesson) {
    const list = this.getShadowingLessons();
    list.unshift(lesson);
    localStorage.setItem(KEYS.SHADOWING_LESSONS, JSON.stringify(list));
  }

  public deleteShadowingLesson(id: string) {
    try {
      const list = this.getShadowingLessons().filter(l => l.id !== id);
      localStorage.setItem(KEYS.SHADOWING_LESSONS, JSON.stringify(list));
    } catch {}
  }

  // --- INTERACTIVE: VISUAL STORY PROMPTS ---
  public getVisualStoryPrompts(): VisualStoryPrompt[] {
    try {
      const data = localStorage.getItem(KEYS.VISUAL_STORY_PROMPTS);
      if (data) {
        const list: VisualStoryPrompt[] = JSON.parse(data);
        const existingIds = new Set(list.map(p => p.id));
        let added = false;
        for (const def of VISUAL_STORY_PROMPTS) {
          if (!existingIds.has(def.id)) {
            list.push(def);
            existingIds.add(def.id);
            added = true;
          }
        }
        if (added) {
          localStorage.setItem(KEYS.VISUAL_STORY_PROMPTS, JSON.stringify(list));
        }
        return list;
      }
    } catch {}
    return VISUAL_STORY_PROMPTS;
  }

  public saveCustomVisualStoryPrompt(prompt: VisualStoryPrompt) {
    const list = this.getVisualStoryPrompts();
    list.unshift(prompt);
    localStorage.setItem(KEYS.VISUAL_STORY_PROMPTS, JSON.stringify(list));
  }

  public deleteVisualStoryPrompt(id: string) {
    try {
      const list = this.getVisualStoryPrompts().filter(p => p.id !== id);
      localStorage.setItem(KEYS.VISUAL_STORY_PROMPTS, JSON.stringify(list));
    } catch {}
  }

  // --- RESET ALL DATA ---
  public resetToFactory() {
    localStorage.removeItem(KEYS.CURRENT_USER);
    localStorage.removeItem(KEYS.TEACHERS);
    localStorage.removeItem(KEYS.ACTIVE_TEACHER_ID);
    localStorage.removeItem(KEYS.SUBMISSIONS);
    localStorage.removeItem(KEYS.CLASSROOMS);
    localStorage.removeItem(KEYS.STUDENTS);
    this.initDefaults();
  }
}

export const storageService = new StorageService();
