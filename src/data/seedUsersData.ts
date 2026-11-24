import { UserProfile, Classroom, StudentSubmission, HeadToHeadBattle, Student } from '../types';

export const DEFAULT_TEACHER: UserProfile = {
  id: 'teacher-1',
  name: 'Teacher 1',
  username: 'teacher_1',
  role: 'teacher',
  avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Teacher+1',
  level: 'intermediate',
  xp: 0,
  rank: 'Instructor',
  streakDays: 1,
  lastActiveDate: new Date().toISOString().split('T')[0],
  completedActivities: 0,
  speakingMinutes: 0,
  wordsRead: 0,
  achievements: [],
  classId: 'cls-main',
  schoolName: 'School / Institution',
  subject: 'Bahasa Inggris',
  bio: 'Fasilitator pembelajaran bahasa Inggris interaktif di kelas.',
  email: '',
  phone: ''
};

export const INITIAL_CLASSROOMS: Classroom[] = [
  {
    id: 'cls-main',
    name: 'Kelas Bahasa Inggris 1',
    teacherId: 'teacher-1',
    studentCount: 0,
    description: 'Kelas aktif latihan speaking spontan, teleprompter reading, dan simulasi percakapan.',
    gradeLevel: 'Umum',
    grade: 'Kelas 10 (SMA/SMK)',
    level: 'intermediate'
  }
];

// Completely clean initial submissions (No dummy data)
export const INITIAL_SUBMISSIONS: StudentSubmission[] = [];

// Clean initial students (No dummy data)
export const INITIAL_STUDENTS: Student[] = [];

// Optional sample students in case teacher wants to test with 1 click
export const SAMPLE_STUDENTS_PRESET: Omit<Student, 'classId'>[] = [
  {
    id: 'sample-st-1',
    name: 'Ahmad Fauzi',
    username: 'ahmad_fauzi',
    level: 'intermediate',
    xp: 240,
    completedChallenges: 8,
    streak: 3,
    rankTitle: 'Challenger',
    categoryPill: 'Top Speaker',
    createdAt: new Date().toISOString().split('T')[0]
  },
  {
    id: 'sample-st-2',
    name: 'Bella Safira',
    username: 'bella_safira',
    level: 'beginner',
    xp: 180,
    completedChallenges: 5,
    streak: 2,
    rankTitle: 'Explorer',
    categoryPill: 'Beginner Rising Star',
    createdAt: new Date().toISOString().split('T')[0]
  },
  {
    id: 'sample-st-3',
    name: 'Citra Dewi',
    username: 'citra_dewi',
    level: 'advanced',
    xp: 320,
    completedChallenges: 11,
    streak: 5,
    rankTitle: 'Speaker',
    categoryPill: 'Debate Pro',
    createdAt: new Date().toISOString().split('T')[0]
  },
  {
    id: 'sample-st-4',
    name: 'Dimas Pratama',
    username: 'dimas_pratama',
    level: 'intermediate',
    xp: 150,
    completedChallenges: 4,
    streak: 1,
    rankTitle: 'Explorer',
    categoryPill: 'Consistency Star',
    createdAt: new Date().toISOString().split('T')[0]
  }
];

export const HEAD_TO_HEAD_BATTLES: HeadToHeadBattle[] = [
  {
    id: 'h2h-1',
    title: 'The Great Remote Work Face-Off',
    category: 'Same Topic',
    level: 'intermediate',
    prompt: 'Should companies enforce strict office return mandates or empower permanent remote flexibility? Both players speak on the topic for 60 seconds.',
    timeLimit: 60,
    opponent: {
      name: 'Peserta 2',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&q=80',
      rank: 'Challenger'
    }
  },
  {
    id: 'h2h-2',
    title: '60-Second Rapid Tongue & Vocab Battle',
    category: 'Fast Answer',
    level: 'beginner',
    prompt: 'Describe your dream vacation destination using 5 vivid adjectives without pausing for more than 2 seconds.',
    timeLimit: 60,
    opponent: {
      name: 'Peserta 2',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
      rank: 'Challenger'
    }
  },
  {
    id: 'h2h-3',
    title: 'The Unprepared Crisis Pitch',
    category: 'Storytelling Battle',
    level: 'advanced',
    prompt: 'You are the captain of a submarine that lost sonar contact near an underwater volcanic ridge. Brief the crew in 90 seconds.',
    timeLimit: 90,
    opponent: {
      name: 'Peserta 2',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=256&q=80',
      rank: 'Speaker'
    }
  }
];
