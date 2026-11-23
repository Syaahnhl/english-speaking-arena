import { SpeakingCartItem } from '../types';

export const SPEAKING_CART_LIBRARY: SpeakingCartItem[] = [
  // --- APPETIZERS ---
  {
    id: 'app-1',
    title: 'Morning Vibe Check',
    type: 'appetizer',
    category: 'Small Talk',
    duration: 60,
    level: 'beginner',
    prompt: 'How are you feeling right now on a scale of 1 to 10? Describe the energy of your surroundings.',
    instructions: 'Speak for 60 seconds without long hesitations. Warm up your vocal cords!',
    vocabulary: ['Grateful', 'Energized', 'Productive', 'Chilly morning', 'Looking forward to']
  },
  {
    id: 'app-2',
    title: 'Two Truths and One Dream',
    type: 'appetizer',
    category: 'Ice Breaker',
    duration: 90,
    level: 'intermediate',
    prompt: 'Share two real facts about yourself and one ambitious future dream as if it already happened.',
    instructions: 'Tell your story smoothly, making the listener guess which one is the future dream.',
    vocabulary: ['Aspiration', 'Milestone', 'Fascinated by', 'Turning point']
  },
  {
    id: 'app-3',
    title: '30-Second Rapid Fire Questions',
    type: 'appetizer',
    category: 'Quick Questions',
    duration: 60,
    level: 'beginner',
    prompt: 'Answer rapidly: Favorite season? Coffee or tea? Mountains or beach? Cats or dogs? Explain why in 1 sentence each.',
    instructions: 'Answer with zero hesitation. The goal is instant vocal reflex.',
    vocabulary: ['Prefer', 'Because', 'Vibrant', 'Calming', 'Atmosphere']
  },

  // --- MAIN COURSES ---
  {
    id: 'main-1',
    title: 'Deep Opinion: The Cashless Society Debate',
    type: 'main-course',
    category: 'Opinion Challenge',
    duration: 180,
    level: 'intermediate',
    prompt: 'Should countries completely abandon physical paper currency in favor of digital e-wallets? Address financial privacy versus convenience.',
    instructions: 'Present a structured argument: Opening thesis -> 2 concrete arguments -> Counterargument -> Strong conclusion.',
    vocabulary: ['Digital transaction', 'Financial surveillance', 'Unbanked population', 'Convenience', 'Counterfeit']
  },
  {
    id: 'main-2',
    title: 'Storytelling: The Mysterious Midnight Letter',
    type: 'main-course',
    category: 'Storytelling',
    duration: 180,
    level: 'intermediate',
    prompt: 'You found an unsealed envelope with your name on your doorstep at midnight. Inside is an old train ticket and a key. What do you do?',
    instructions: 'Build suspense, describe sensory details (sound of rustling paper, cool night air), and craft a dramatic twist.',
    vocabulary: ['Perplexed', 'Curiosity', 'Enigmatic', 'Heart pounding', 'Flickering streetlights']
  },
  {
    id: 'main-3',
    title: 'Executive Roleplay: Project Delay Crisis',
    type: 'main-course',
    category: 'Roleplay',
    duration: 240,
    level: 'advanced',
    prompt: 'Your software team discovered a critical database vulnerability 12 hours before client launch. Convince the enterprise stakeholder to postpone the launch by 48 hours without losing their contract.',
    instructions: 'Project executive authority. Balance transparency with reassurance and present an emergency contingency plan.',
    vocabulary: ['Vulnerability mitigation', 'Stakeholder alignment', 'Contingency plan', 'Reputational risk', 'Ironclad SLA']
  },
  {
    id: 'main-4',
    title: 'Oxford-Style Mini Debate: Remote Work Forever?',
    type: 'main-course',
    category: 'Debate',
    duration: 240,
    level: 'advanced',
    prompt: 'Defend: "Mandatory return-to-office policies reflect an outdated failure of management rather than a productivity requirement."',
    instructions: 'Deliver a persuasive persuasive speech with rhetorical questions, data citations, and workplace psychology insights.',
    vocabulary: ['Autonomy', 'Micromanagement', 'Asynchronous workflows', 'Discretionary effort', 'Talent attrition']
  },

  // --- DESSERTS ---
  {
    id: 'des-1',
    title: 'Tongue Twister Sprint: The Woodchuck & Sea Shells',
    type: 'dessert',
    category: 'Tongue Twister',
    duration: 60,
    level: 'beginner',
    prompt: 'Repeat clearly 3 times: "She sells seashells by the seashore, and the shells she sells are seashells, I\'m sure!" Then do: "How much wood would a woodchuck chuck if a woodchuck could chuck wood?"',
    instructions: 'Enunciate every consonant. Focus on crisp "s", "sh", and "w" sounds.',
    vocabulary: ['Articulation', 'Enunciation', 'Consonants', 'Rhythm', 'Crispness']
  },
  {
    id: 'des-2',
    title: '60-Second Vocabulary Cascade',
    type: 'dessert',
    category: 'Vocabulary Challenge',
    duration: 60,
    level: 'intermediate',
    prompt: 'Use these three words in one coherent, spontaneous mini-story: "Serendipity", "Thunderstorm", "Notebook".',
    instructions: 'Craft a mini narrative that connects all three words naturally without pausing.',
    vocabulary: ['Serendipity', 'Thunderstorm', 'Notebook', 'Spontaneous', 'Coherent']
  },
  {
    id: 'des-3',
    title: 'Rapid Fire: Pitch an Absurd Invention',
    type: 'dessert',
    category: 'Rapid Fire',
    duration: 90,
    level: 'intermediate',
    prompt: 'In 60 seconds, invent and sell us an absurd gadget (e.g. "Socks that never lose their pair" or "An alarm clock that bakes cookies"). Give it a catchy name, price, and guarantee!',
    instructions: 'High energy, enthusiastic salesman persona! Make the audience smile.',
    vocabulary: ['Revolutionary', 'Guaranteed satisfaction', 'State-of-the-art', 'Limited offer', 'Must-have']
  }
];

export interface CartPreset {
  id: string;
  name: string;
  description: string;
  targetDurationMinutes: number;
  itemIds: string[];
  badge: string;
}

export const CART_PRESETS: CartPreset[] = [
  {
    id: 'preset-quick',
    name: 'Quick Practice',
    description: 'Perfect 5-minute morning booster to wake up your speaking fluency.',
    targetDurationMinutes: 5,
    itemIds: ['app-1', 'main-2', 'des-1'], // 1m + 3m + 1m = 5m
    badge: '5 Mins'
  },
  {
    id: 'preset-daily',
    name: 'Daily Fluency Workout',
    description: 'Balanced 10-minute session combining rapid response, opinion presentation, and vocab agility.',
    targetDurationMinutes: 10,
    itemIds: ['app-3', 'app-2', 'main-1', 'des-2', 'des-3'], // 1m + 1.5m + 3m + 1m + 1.5m ~ 8-10m
    badge: '10 Mins'
  },
  {
    id: 'preset-intensive',
    name: 'Intensive Arena Bootcamp',
    description: 'Challenging 20-minute comprehensive session with executive debate and storytelling.',
    targetDurationMinutes: 20,
    itemIds: ['app-2', 'main-3', 'main-4', 'des-2', 'des-3'], // ~15-20m
    badge: '20 Mins'
  }
];
