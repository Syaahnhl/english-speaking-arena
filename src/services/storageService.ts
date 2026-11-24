import { UserProfile, SpeakingCard, ReadingMaterial, StudentSubmission, Classroom, DailyChallenge, SpeakingCartItem, ProficiencyLevel } from '../types';
import { DEMO_STUDENT, DEMO_TEACHER, SEED_CLASSROOMS, SEED_SUBMISSIONS } from '../data/seedUsersData';
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
      localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(DEMO_TEACHER));
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
      localStorage.setItem(KEYS.SUBMISSIONS, JSON.stringify(SEED_SUBMISSIONS));
    }
    if (!localStorage.getItem(KEYS.CLASSROOMS)) {
      localStorage.setItem(KEYS.CLASSROOMS, JSON.stringify(SEED_CLASSROOMS));
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

  public getCurrentUser(): UserProfile {
    const role = this.getCurrentRole();
    if (role === 'teacher') {
      return DEMO_TEACHER;
    }
    try {
      const stored = localStorage.getItem(KEYS.CURRENT_USER);
      if (stored) return JSON.parse(stored);
    } catch {
      // fallback
    }
    return DEMO_STUDENT;
  }

  public saveCurrentUser(user: UserProfile) {
    // Ensure rank title is in sync with XP
    const rankDef = getRankByXp(user.xp);
    user.rank = rankDef.name;
    localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
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

  // XP Awarding function with achievement validation
  public addXp(amount: number, reason: string): { newXp: number; leveledUp: boolean; unlockedAchievements: string[] } {
    const user = this.getCurrentUser();
    const oldRank = getRankByXp(user.xp).name;
    
    user.xp += amount;
    user.completedActivities += 1;

    const newRank = getRankByXp(user.xp).name;
    const leveledUp = oldRank !== newRank;

    // Check achievements
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
          user.xp += ach.xpReward; // bonus for unlocking
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

  // Speaking Cards
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

  // Running Reading Materials
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

  // Speaking Cart
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

  // Submissions
  public getSubmissions(): StudentSubmission[] {
    try {
      const data = localStorage.getItem(KEYS.SUBMISSIONS);
      if (data) return JSON.parse(data);
    } catch {
      // fallback
    }
    return SEED_SUBMISSIONS;
  }

  public addSubmission(sub: StudentSubmission) {
    const list = this.getSubmissions();
    list.unshift(sub);
    localStorage.setItem(KEYS.SUBMISSIONS, JSON.stringify(list));
  }

  public gradeSubmission(id: string, score: number, feedback: string) {
    const list = this.getSubmissions();
    const item = list.find(s => s.id === id);
    if (item) {
      item.status = 'graded';
      item.score = score;
      item.feedback = feedback;
      localStorage.setItem(KEYS.SUBMISSIONS, JSON.stringify(list));
    }
  }

  // Classrooms
  public getClassrooms(): Classroom[] {
    try {
      const data = localStorage.getItem(KEYS.CLASSROOMS);
      if (data) return JSON.parse(data);
    } catch {
      // fallback
    }
    return SEED_CLASSROOMS;
  }

  public addClassroom(classroom: Classroom) {
    const list = this.getClassrooms();
    list.push(classroom);
    localStorage.setItem(KEYS.CLASSROOMS, JSON.stringify(list));
  }

  // Reset to initial demo state
  public resetToFactory() {
    localStorage.clear();
    this.initDefaults();
  }
}

export const storageService = new StorageService();
