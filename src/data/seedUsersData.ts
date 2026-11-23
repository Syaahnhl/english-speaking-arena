import { UserProfile, LeaderboardUser, Classroom, StudentSubmission, HeadToHeadBattle } from '../types';

export const DEMO_STUDENT: UserProfile = {
  id: 'usr-student-01',
  name: 'Aria Pratama',
  username: 'ariapratama',
  role: 'student',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
  level: 'intermediate',
  xp: 430, // Challenger Rank
  rank: 'Challenger',
  streakDays: 4,
  lastActiveDate: new Date().toISOString().split('T')[0],
  completedActivities: 14,
  speakingMinutes: 38,
  wordsRead: 2450,
  achievements: ['ach-first-words', 'ach-brave-speaker'],
  classId: 'cls-10a'
};

export const DEMO_TEACHER: UserProfile = {
  id: 'usr-teacher-01',
  name: 'Ms. Eleanor Vance',
  username: 'teacher_eleanor',
  role: 'teacher',
  avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80',
  level: 'advanced',
  xp: 3200,
  rank: 'Arena Champion',
  streakDays: 42,
  lastActiveDate: new Date().toISOString().split('T')[0],
  completedActivities: 180,
  speakingMinutes: 450,
  wordsRead: 45000,
  achievements: ['ach-first-words', 'ach-brave-speaker', 'ach-no-fear', 'ach-reading-machine', 'ach-debate-master', 'ach-seven-day-streak'],
  classId: 'cls-10a'
};

export const SEED_CLASSROOMS: Classroom[] = [
  {
    id: 'cls-10a',
    name: 'Class 10-A English Orators',
    code: 'ORATOR-2026',
    teacherId: 'usr-teacher-01',
    studentCount: 18,
    description: 'Active speaking club focusing on spontaneous conversation, debate arguments, and speed reading.'
  },
  {
    id: 'cls-beginner-squad',
    name: 'Morning Fluency Jumpstart',
    code: 'JUMP-2026',
    teacherId: 'usr-teacher-01',
    studentCount: 12,
    description: 'Beginner foundational group building speaking confidence, daily vocabulary, and sentence flow.'
  }
];

export const SEED_SUBMISSIONS: StudentSubmission[] = [
  {
    id: 'sub-1',
    studentId: 'usr-student-01',
    studentName: 'Aria Pratama',
    assignmentTitle: 'Hotel Complaint Roleplay - Secret Mission',
    submittedAt: 'Yesterday, 16:30',
    durationSeconds: 120,
    transcriptOrNotes: 'Completed Role A: Polite resolution without saying "bad". Used phrases: "I was expecting...", "Could you check with the chef?".',
    status: 'graded',
    score: 92,
    feedback: 'Excellent vocal modulation and respectful phrasing! Your vocabulary choices were spot-on.',
    activityType: 'roleplay'
  },
  {
    id: 'sub-2',
    studentId: 'usr-student-02',
    studentName: 'Kavita Sharma',
    assignmentTitle: 'AI in the Workforce: Innovation or Threat?',
    submittedAt: 'Today, 10:15',
    durationSeconds: 135,
    transcriptOrNotes: 'Emphasized cognitive augmentation over obsolescence. Addressed potential white-collar labor disruption with clear transitions.',
    status: 'pending',
    activityType: 'debate'
  },
  {
    id: 'sub-3',
    studentId: 'usr-student-03',
    studentName: 'Budi Santoso',
    assignmentTitle: 'Deep Sea Creatures Running Reading Challenge',
    submittedAt: 'Today, 11:45',
    durationSeconds: 98,
    transcriptOrNotes: 'Completed text at 1.25x speed (approx 160 WPM). Scored 100% on the comprehension questions.',
    status: 'graded',
    score: 95,
    feedback: 'Fantastic comprehension speed! Great focus on scientific terminology.',
    activityType: 'running-reading'
  }
];

export const WEEKLY_LEADERBOARD: LeaderboardUser[] = [
  {
    id: 'usr-lead-1',
    name: 'Chloe Zhang',
    username: 'chloe_speaks',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=256&q=80',
    level: 'advanced',
    xp: 680,
    completedChallenges: 24,
    streak: 12,
    rankTitle: 'Speaker',
    categoryPill: 'Top Speaker'
  },
  {
    id: 'usr-lead-2',
    name: 'Kavita Sharma',
    username: 'kavita_voice',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&q=80',
    level: 'intermediate',
    xp: 590,
    completedChallenges: 19,
    streak: 9,
    rankTitle: 'Challenger',
    categoryPill: 'Debate Pro'
  },
  {
    id: 'usr-student-01',
    name: 'Aria Pratama (You)',
    username: 'ariapratama',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    level: 'intermediate',
    xp: 430,
    completedChallenges: 14,
    streak: 4,
    rankTitle: 'Challenger',
    isCurrentUser: true,
    categoryPill: 'Most Improved'
  },
  {
    id: 'usr-lead-3',
    name: 'Budi Santoso',
    username: 'budi_learning',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
    level: 'beginner',
    xp: 410,
    completedChallenges: 16,
    streak: 8,
    rankTitle: 'Challenger',
    categoryPill: 'Beginner Rising Star'
  },
  {
    id: 'usr-lead-4',
    name: 'Liam O\'Connor',
    username: 'liam_reads',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80',
    level: 'intermediate',
    xp: 380,
    completedChallenges: 13,
    streak: 14,
    rankTitle: 'Explorer',
    categoryPill: 'Consistency Star'
  },
  {
    id: 'usr-lead-5',
    name: 'Maya Putri',
    username: 'maya_speed',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80',
    level: 'beginner',
    xp: 320,
    completedChallenges: 11,
    streak: 6,
    rankTitle: 'Explorer',
    categoryPill: 'Reading Star'
  }
];

export const MONTHLY_LEADERBOARD: LeaderboardUser[] = [
  {
    id: 'usr-lead-1',
    name: 'Chloe Zhang',
    username: 'chloe_speaks',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=256&q=80',
    level: 'advanced',
    xp: 2450,
    completedChallenges: 78,
    streak: 28,
    rankTitle: 'Fluent Performer',
    categoryPill: 'Top Speaker'
  },
  {
    id: 'usr-lead-4',
    name: 'Liam O\'Connor',
    username: 'liam_reads',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80',
    level: 'intermediate',
    xp: 1980,
    completedChallenges: 62,
    streak: 25,
    rankTitle: 'Fluent Performer',
    categoryPill: 'Consistency Star'
  },
  {
    id: 'usr-lead-2',
    name: 'Kavita Sharma',
    username: 'kavita_voice',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&q=80',
    level: 'intermediate',
    xp: 1720,
    completedChallenges: 55,
    streak: 18,
    rankTitle: 'Fluent Performer',
    categoryPill: 'Debate Pro'
  },
  {
    id: 'usr-student-01',
    name: 'Aria Pratama (You)',
    username: 'ariapratama',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    level: 'intermediate',
    xp: 1450,
    completedChallenges: 46,
    streak: 14,
    rankTitle: 'Speaker',
    isCurrentUser: true,
    categoryPill: 'Most Improved'
  },
  {
    id: 'usr-lead-3',
    name: 'Budi Santoso',
    username: 'budi_learning',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
    level: 'beginner',
    xp: 1290,
    completedChallenges: 42,
    streak: 21,
    rankTitle: 'Speaker',
    categoryPill: 'Beginner Rising Star'
  }
];

export const ALL_TIME_LEADERBOARD: LeaderboardUser[] = [
  {
    id: 'usr-lead-top',
    name: 'Marcus Sterling',
    username: 'marcus_debates',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=256&q=80',
    level: 'advanced',
    xp: 5400,
    completedChallenges: 184,
    streak: 64,
    rankTitle: 'Arena Champion',
    categoryPill: 'Top Speaker'
  },
  {
    id: 'usr-lead-1',
    name: 'Chloe Zhang',
    username: 'chloe_speaks',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=256&q=80',
    level: 'advanced',
    xp: 4920,
    completedChallenges: 156,
    streak: 42,
    rankTitle: 'Arena Champion',
    categoryPill: 'Consistency Star'
  },
  {
    id: 'usr-student-01',
    name: 'Aria Pratama (You)',
    username: 'ariapratama',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    level: 'intermediate',
    xp: 3120,
    completedChallenges: 102,
    streak: 28,
    rankTitle: 'Arena Champion',
    isCurrentUser: true,
    categoryPill: 'Most Improved'
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
      name: 'Kavita Sharma',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&q=80',
      rank: 'Challenger',
      score: {
        completion: 25,
        vocabUsage: 22,
        fluency: 23,
        taskFulfillment: 24,
        totalXP: 94,
        comment: 'Brilliant structural arguments with strong transition words!'
      }
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
      name: 'Budi Santoso',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
      rank: 'Challenger',
      score: {
        completion: 24,
        vocabUsage: 20,
        fluency: 22,
        taskFulfillment: 22,
        totalXP: 88,
        comment: 'High energy and natural enthusiasm!'
      }
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
      name: 'Chloe Zhang',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=256&q=80',
      rank: 'Speaker',
      score: {
        completion: 25,
        vocabUsage: 24,
        fluency: 24,
        taskFulfillment: 25,
        totalXP: 98,
        comment: 'Exceptional poise under pressure and commanding vocabulary.'
      }
    }
  }
];
