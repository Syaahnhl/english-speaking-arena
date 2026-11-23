import { TabooCard, YesAndPrompt, SpeedTalkingTopic, ShadowingLesson, VisualStoryPrompt } from '../types';

// 1. TABOO / HOT SEAT
export const TABOO_CARDS: TabooCard[] = [
  {
    id: 'taboo-1',
    word: 'AIRPLANE',
    level: 'beginner',
    category: 'Travel & Transport',
    forbiddenWords: ['Fly', 'Sky', 'Airport', 'Wings', 'Pilot'],
    hints: 'Describe how people travel between distant countries in just a few hours.'
  },
  {
    id: 'taboo-2',
    word: 'SMARTPHONE',
    level: 'beginner',
    category: 'Technology',
    forbiddenWords: ['Call', 'Screen', 'Apple', 'Mobile', 'App'],
    hints: 'A pocket-sized electronic gadget that everyone stares at all day.'
  },
  {
    id: 'taboo-3',
    word: 'COFFEE',
    level: 'beginner',
    category: 'Food & Drink',
    forbiddenWords: ['Drink', 'Morning', 'Black', 'Caffeine', 'Cup'],
    hints: 'A dark, aromatic hot liquid made from roasted beans that wakes people up.'
  },
  {
    id: 'taboo-4',
    word: 'PROCRASTINATION',
    level: 'intermediate',
    category: 'Psychology',
    forbiddenWords: ['Delay', 'Later', 'Lazy', 'Work', 'Deadline'],
    hints: 'The habit of putting off important assignments until the last possible hour.'
  },
  {
    id: 'taboo-5',
    word: 'PARADIGM SHIFT',
    level: 'advanced',
    category: 'Business & Philosophy',
    forbiddenWords: ['Change', 'Idea', 'Model', 'New', 'Revolution'],
    hints: 'A fundamental transformation in the basic concepts and experimental practices of a scientific discipline or culture.'
  }
];

// 2. YES, AND... IMPROVISATION
export const YES_AND_PROMPTS: YesAndPrompt[] = [
  {
    id: 'ya-1',
    scenario: 'Unexpected Discovery in the Attic',
    starterLine: 'I climbed up to my grandfather\'s dusty attic and discovered a glowing wooden chest hidden behind an old mirror.',
    level: 'beginner',
    suggestedTwists: [
      'Yes, and inside there was an ancient map showing our backyard!',
      'Yes, and the chest began playing a music box melody that I recognized from my childhood.',
      'Yes, and when I touched the lock, all the lights in the house turned violet.'
    ]
  },
  {
    id: 'ya-2',
    scenario: 'The Secret Chef at the Luxury Hotel',
    starterLine: 'The head chef suddenly walked out of the kitchen right before the food critic arrived, and you are the only one holding an apron.',
    level: 'intermediate',
    suggestedTwists: [
      'Yes, and we only have three unusual ingredients left: honey, avocado, and chili paste!',
      'Yes, and the critic just asked to see the chef personally to compliment the soup!',
      'Yes, and a food TV camera crew just entered the dining room live on air.'
    ]
  },
  {
    id: 'ya-3',
    scenario: 'Emergency Space Station Airlock',
    starterLine: 'Telemetry indicates an asteroid fragment breached solar array panel four, cutting off main generator life support.',
    level: 'advanced',
    suggestedTwists: [
      'Yes, and our backup batteries have exactly twenty minutes of reserve oxygen.',
      'Yes, and ground control reports an atmospheric interference blocking radio transmission.',
      'Yes, and we have to manually venture outside without tether assistance.'
    ]
  }
];

// 3. 4/3/2 TECHNIQUE PROMPTS
export interface FourThreeTwoTopic {
  id: string;
  title: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  description: string;
  outline: string[];
}

export const FOUR_THREE_TWO_TOPICS: FourThreeTwoTopic[] = [
  {
    id: 'ftt-1',
    title: 'The Most Impactful Teacher or Mentor in Your Life',
    level: 'beginner',
    description: 'Round 1 (4 mins): Tell the full story with all details. Round 2 (3 mins): Sharpen the narrative, removing pauses. Round 3 (2 mins): Deliver the punchy, high-impact essence.',
    outline: [
      'Who this mentor was and where you met',
      'One specific lesson or challenge they guided you through',
      'How that interaction permanently altered your mindset today'
    ]
  },
  {
    id: 'ftt-2',
    title: 'A Critical Turning Point When a Mistake Led to Success',
    level: 'intermediate',
    description: 'Compress a complex narrative from 4 minutes down to 2 minutes while maintaining vivid emotional delivery.',
    outline: [
      'The initial ambitious goal and what went catastrophically wrong',
      'The immediate emotional reaction and how you recalibrated',
      'The unexpected breakthrough that emerged solely because of the failure'
    ]
  },
  {
    id: 'ftt-3',
    title: 'How Emerging Technology Will Reshape Human Empathy by 2040',
    level: 'advanced',
    description: 'A structured analytical speech. Focus on precision vocabulary and elimination of filler phrases across the 3 rounds.',
    outline: [
      'Current trends in hyper-digital isolation vs virtual connection',
      'The psychological dilemma of AI companion relationships',
      'A philosophical framework for safeguarding authentic human vulnerability'
    ]
  }
];

// 4. SPEED TALKING / FISHBOWL
export const SPEED_TALKING_TOPICS: SpeedTalkingTopic[] = [
  {
    id: 'st-1',
    topic: 'What makes a true friend versus an acquaintance?',
    category: 'Relationships',
    level: 'beginner',
    guideQuestions: [
      'Do you prefer having a large circle or 2-3 deep friends?',
      'What is an absolute deal-breaker in friendship for you?'
    ]
  },
  {
    id: 'st-2',
    topic: 'If you had unlimited funding to solve one global issue, which would you pick?',
    category: 'Global Vision',
    level: 'intermediate',
    guideQuestions: [
      'Would you focus on clean drinking water, education, or climate renewal?',
      'What immediate action would you take in your first 100 days?'
    ]
  },
  {
    id: 'st-3',
    topic: 'Is absolute privacy a fundamental human right, or must it yield to national security?',
    category: 'Ethics & Law',
    level: 'advanced',
    guideQuestions: [
      'How do you view government backdoors in encrypted messaging?',
      'Where is the dividing line between public safety and totalitarian surveillance?'
    ]
  }
];

// 5. SHADOWING PRACTICE LESSONS
export const SHADOWING_LESSONS: ShadowingLesson[] = [
  {
    id: 'shad-1',
    title: 'Mastering Warm Conversational Openers',
    level: 'beginner',
    speaker: 'Emma (US Accent)',
    accent: 'American - Friendly',
    topic: 'Everyday Politeness & Greeting',
    sentences: [
      {
        id: 's1',
        text: 'Good morning! It is really wonderful to finally connect with you in person today.',
        emphasisWords: ['wonderful', 'finally', 'connect', 'person'],
        phoneticTips: 'Link "finally connect" smoothly; do not pause after "is".'
      },
      {
        id: 's2',
        text: 'How has your week been treating you so far? I hope things have not been too hectic.',
        emphasisWords: ['week', 'treating', 'hectic'],
        phoneticTips: 'Soften the "t" in "treating you" like "treatin-you".'
      },
      {
        id: 's3',
        text: 'I would love to grab a cup of coffee and hear all about your latest project.',
        emphasisWords: ['love', 'coffee', 'latest', 'project'],
        phoneticTips: 'Drop the heavy "d" in "I\'d love" into a gentle glottal stop.'
      }
    ]
  },
  {
    id: 'shad-2',
    title: 'Delivering an Inspiring Keynote Opening',
    level: 'intermediate',
    speaker: 'David (UK Accent)',
    accent: 'British - Authoritative',
    topic: 'Public Speaking & Executive Presence',
    sentences: [
      {
        id: 's4',
        text: 'The greatest obstacle to authentic communication is the comforting illusion that it has already taken place.',
        emphasisWords: ['obstacle', 'authentic', 'illusion', 'taken place'],
        phoneticTips: 'Crisp British "t" on "obstacle" and "authentic". Keep pitch deliberate.'
      },
      {
        id: 's5',
        text: 'When we dare to listen with open curiosity rather than defensive anticipation, true collaboration begins.',
        emphasisWords: ['curiosity', 'defensive', 'collaboration', 'begins'],
        phoneticTips: 'Rise on "curiosity", dip slightly on "defensive", then land firmly on "begins".'
      }
    ]
  },
  {
    id: 'shad-3',
    title: 'The Art of Persuasive Executive Negotiation',
    level: 'advanced',
    speaker: 'Victoria (Neutral International)',
    accent: 'International - Crisp & Strategic',
    topic: 'High-Stakes Corporate Negotiations',
    sentences: [
      {
        id: 's6',
        text: 'Our strategic priority is not simply closing a transaction, but establishing an enduring partnership characterized by reciprocal transparency.',
        emphasisWords: ['transaction', 'enduring partnership', 'reciprocal transparency'],
        phoneticTips: 'Sustain cadence through "reciprocal transparency"; do not rush the multisyllabic terms.'
      },
      {
        id: 's7',
        text: 'If we align our core incentives around long-term customer retention, both organizations will realize exponential enterprise value.',
        emphasisWords: ['incentives', 'retention', 'exponential', 'value'],
        phoneticTips: 'Punch the consonants in "core incentives" and "exponential".'
      }
    ]
  }
];

// 6. VISUAL STORYTELLING PROMPTS
export const VISUAL_STORY_PROMPTS: VisualStoryPrompt[] = [
  {
    id: 'vis-1',
    title: 'The Old Clockmaker\'s Secret Blueprint',
    imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80',
    level: 'beginner',
    promptQuestions: [
      'What is happening at this workbench right now?',
      'Who is the craftsman and what rare tool is he holding?',
      'What happened right before this moment?',
      'What miraculous event might happen once the clock ticks midnight?'
    ],
    suggestedVocab: ['Intricate gears', 'Magnifying glass', 'Antique timepiece', 'Whispering tick-tock', 'Masterpiece']
  },
  {
    id: 'vis-2',
    title: 'The Solitary Hiker on the Mist-Covered Ridge',
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
    level: 'intermediate',
    promptQuestions: [
      'Who is this solitary traveler standing above the clouds?',
      'Why did they embark on this solitary climb?',
      'What difficult decision are they contemplating on this summit?',
      'What will they discover when they descend into the opposite valley?'
    ],
    suggestedVocab: ['Breathtaking panoramic view', 'Dense alpine fog', 'Perseverance', 'Solitude', 'Turning point']
  },
  {
    id: 'vis-3',
    title: 'Late Night High-Tech Laboratory Breakthrough',
    imageUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80',
    level: 'advanced',
    promptQuestions: [
      'What high-stakes experiment reached a critical threshold at 2:00 AM?',
      'What conflicting pressures are weighing on the scientist\'s conscience?',
      'Who funded this research and what are their covert motivations?',
      'How could this scientific revelation destabilize global industries tomorrow?'
    ],
    suggestedVocab: ['Breakthrough discovery', 'Fluorescent luminescence', 'Ethical dilemma', 'Spectrometry reading', 'Irreversible consequences']
  }
];
