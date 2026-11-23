import { Achievement } from '../types';

export const ACHIEVEMENTS_LIST: Achievement[] = [
  {
    id: 'ach-first-words',
    title: 'First Words',
    description: 'Conquered your speaking anxiety and completed your very first speaking challenge!',
    icon: 'Sparkles',
    category: 'speaking',
    xpReward: 50,
    requirement: {
      type: 'activities_count',
      threshold: 1
    }
  },
  {
    id: 'ach-brave-speaker',
    title: 'Brave Speaker',
    description: 'Completed 10 interactive speaking sessions across the Arena.',
    icon: 'Mic',
    category: 'speaking',
    xpReward: 120,
    requirement: {
      type: 'activities_count',
      threshold: 10
    }
  },
  {
    id: 'ach-no-fear',
    title: 'No Fear',
    description: 'Tackled 5 unprepared impromptu & rapid-fire challenges with confidence.',
    icon: 'Zap',
    category: 'speaking',
    xpReward: 150,
    requirement: {
      type: 'impromptu_count',
      threshold: 5
    }
  },
  {
    id: 'ach-reading-machine',
    title: 'Reading Machine',
    description: 'Mastered 5 Running Reading texts and aced the comprehension challenges.',
    icon: 'BookOpen',
    category: 'reading',
    xpReward: 100,
    requirement: {
      type: 'reading_count',
      threshold: 5
    }
  },
  {
    id: 'ach-debate-master',
    title: 'Debate Master',
    description: 'Defended complex arguments and structured 3 debate arena challenges.',
    icon: 'Shield',
    category: 'arena',
    xpReward: 160,
    requirement: {
      type: 'debate_count',
      threshold: 3
    }
  },
  {
    id: 'ach-seven-day-streak',
    title: 'Seven-Day Streak',
    description: 'Maintained relentless daily practice for 7 days in a row.',
    icon: 'Flame',
    category: 'streak',
    xpReward: 200,
    requirement: {
      type: 'streak_days',
      threshold: 7
    }
  },
  {
    id: 'ach-word-collector',
    title: 'Word Collector',
    description: 'Collected and practiced over 30 advanced vocabulary suggestions.',
    icon: 'Layers',
    category: 'vocabulary',
    xpReward: 80,
    requirement: {
      type: 'words_used',
      threshold: 30
    }
  }
];
