export type ProficiencyLevel = 'beginner' | 'intermediate' | 'advanced';

export type UserRole = 'student' | 'teacher';

export interface UserProfile {
  id: string;
  name: string;
  username: string;
  role: UserRole;
  avatar: string;
  level: ProficiencyLevel;
  xp: number;
  rank: string;
  streakDays: number;
  lastActiveDate: string;
  completedActivities: number;
  speakingMinutes: number;
  wordsRead: number;
  achievements: string[]; // achievement ids
  classId?: string;
  // Teacher profile fields
  schoolName?: string;
  subject?: string;
  bio?: string;
  email?: string;
  phone?: string;
}

export type SpeakingCardCategory = 
  | 'ice-breaker'
  | 'opinion'
  | 'would-you-rather'
  | 'storytelling'
  | 'debate'
  | 'daily-conversation'
  | 'critical-thinking'
  | 'random-challenge'
  | 'professional';

export interface SpeakingCard {
  id: string;
  title: string;
  level: ProficiencyLevel;
  category: SpeakingCardCategory;
  question: string;
  estimatedDuration: number; // in seconds (e.g. 60, 90, 120)
  suggestedDurationOptions?: number[]; // [30, 60, 90, 120, 180]
  vocabularySuggestions: string[];
  sentenceStarters: string[];
  hints: string[];
  sampleResponse?: string;
  targetTone?: string;
}

export type CartItemType = 'appetizer' | 'main-course' | 'dessert';

export interface SpeakingCartItem {
  id: string;
  title: string;
  type: CartItemType;
  category: string;
  duration: number; // seconds
  level: ProficiencyLevel;
  prompt: string;
  instructions: string;
  vocabulary: string[];
}

export interface ReadingQuestion {
  id: string;
  question: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer';
  options?: string[];
  correctAnswer: string | number; // index or text
  explanation: string;
}

export type ReadingGenre = 
  | 'short-stories' 
  | 'daily-conversations' 
  | 'news-articles' 
  | 'educational' 
  | 'interesting-facts' 
  | 'fiction' 
  | 'professional';

export interface ReadingMaterial {
  id: string;
  title: string;
  genre: ReadingGenre;
  level: ProficiencyLevel;
  wordCount: number;
  summary: string;
  paragraphs: string[];
  vocabularyGlossary: { word: string; definition: string; example: string }[];
  questions: ReadingQuestion[];
}

export interface SecretMission {
  playerRole: 'A' | 'B';
  roleName: string;
  situation: string;
  rules: string[];
  secretObjective: string;
  requiredPhrases: string[];
  forbiddenWords: string[];
}

export interface RoleplayScenario {
  id: string;
  title: string;
  level: ProficiencyLevel;
  context: string;
  playerA: SecretMission;
  playerB: SecretMission;
  vocabularySupport: string[];
  suggestedDuration: number; // in seconds
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'speaking' | 'reading' | 'streak' | 'arena' | 'vocabulary';
  xpReward: number;
  unlockedAt?: string;
  requirement: {
    type: 'activities_count' | 'streak_days' | 'reading_count' | 'debate_count' | 'impromptu_count' | 'words_used';
    threshold: number;
  };
}

export interface DailyChallenge {
  id: string;
  date: string;
  title: string;
  description: string;
  type: 'speaking' | 'vocabulary' | 'reading';
  xpReward: number;
  completed: boolean;
  targetId?: string; // id of speaking card or reading material
}

export interface LeaderboardUser {
  id: string;
  name: string;
  username: string;
  avatar: string;
  level: ProficiencyLevel;
  xp: number;
  completedChallenges: number;
  streak: number;
  rankTitle: string;
  isCurrentUser?: boolean;
  categoryPill?: 'Top Speaker' | 'Most Improved' | 'Consistency Star' | 'Reading Star' | 'Debate Pro' | 'Beginner Rising Star';
}

export interface HeadToHeadBattle {
  id: string;
  title: string;
  category: 'Same Topic' | 'Fast Answer' | 'Vocabulary Battle' | 'Storytelling Battle';
  level: ProficiencyLevel;
  prompt: string;
  timeLimit: number;
  opponent: {
    name: string;
    avatar: string;
    rank: string;
    score?: {
      completion: number;
      vocabUsage: number;
      fluency: number;
      taskFulfillment: number;
      totalXP: number;
      comment: string;
    };
  };
}

export interface TabooCard {
  id: string;
  word: string;
  level: ProficiencyLevel;
  forbiddenWords: string[];
  hints: string;
  category: string;
}

export interface YesAndPrompt {
  id: string;
  scenario: string;
  starterLine: string;
  level: ProficiencyLevel;
  suggestedTwists: string[];
}

export interface SpeedTalkingTopic {
  id: string;
  topic: string;
  category: string;
  level: ProficiencyLevel;
  guideQuestions: string[];
}

export interface ShadowingLesson {
  id: string;
  title: string;
  level: ProficiencyLevel;
  speaker: string;
  accent: string;
  topic: string;
  sentences: {
    id: string;
    text: string;
    emphasisWords: string[];
    phoneticTips?: string;
  }[];
}

export interface VisualStoryPrompt {
  id: string;
  title: string;
  imageUrl: string;
  level: ProficiencyLevel;
  promptQuestions: string[];
  suggestedVocab: string[];
}

export interface StudentSubmission {
  id: string;
  studentId: string;
  studentName: string;
  assignmentTitle: string;
  submittedAt: string;
  durationSeconds: number;
  transcriptOrNotes: string;
  status: 'pending' | 'graded';
  score?: number; // 0-100
  feedback?: string;
  activityType: 'speaking-card' | 'roleplay' | 'running-reading' | 'debate';
}

export interface Student {
  id: string;
  classId: string;
  name: string;
  username?: string;
  avatar?: string;
  level: ProficiencyLevel;
  xp: number;
  completedChallenges: number;
  streak: number;
  rankTitle: string;
  categoryPill?: string;
  notes?: string;
  createdAt?: string;
}

export interface Classroom {
  id: string;
  name: string;
  code?: string;
  teacherId: string;
  studentCount: number;
  description: string;
  gradeLevel?: string;
  grade?: string;
  level?: ProficiencyLevel;
}
