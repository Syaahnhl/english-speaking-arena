import { SpeakingCard } from '../types';

export const SPEAKING_CARDS: SpeakingCard[] = [
  // --- BEGINNER: Ice Breakers & Daily Conversation ---
  {
    id: 'beg-ice-1',
    title: 'Introduce Yourself',
    level: 'beginner',
    category: 'ice-breaker',
    question: 'Tell us your name, where you live, your current occupation or grade, and what makes you happy.',
    estimatedDuration: 60,
    suggestedDurationOptions: [30, 60, 90, 120],
    vocabularySuggestions: ['Passionate', 'Hometown', 'Student', 'Enjoy', 'Daily life'],
    sentenceStarters: [
      'Hello everyone, my name is...',
      'I am currently living in...',
      'In my free time, I really enjoy...',
      'One thing that always makes me smile is...'
    ],
    hints: ['Speak slowly and smile', 'Mention at least one interesting hobby', 'Do not worry about perfect grammar'],
    sampleResponse: 'Hello! My name is Alex. I live in Jakarta. I am a student who loves learning languages. In my free time, I really enjoy reading comics and playing badminton with my friends. Nice to meet you all!'
  },
  {
    id: 'beg-ice-2',
    title: 'My Family & Loved Ones',
    level: 'beginner',
    category: 'ice-breaker',
    question: 'Describe your family members. Who do you spend the most time with, and why?',
    estimatedDuration: 60,
    suggestedDurationOptions: [30, 60, 90],
    vocabularySuggestions: ['Sibling', 'Supportive', 'Gathering', 'Close-knit', 'Kind-hearted'],
    sentenceStarters: [
      'There are ... people in my family.',
      'My mother/father is someone who...',
      'I am closest with my ... because...',
      'On weekends, our family usually...'
    ],
    hints: ['Describe physical features or personality traits', 'Give one memorable memory together'],
    sampleResponse: 'There are four people in my family: my father, mother, younger sister, and me. I am closest with my sister because we love sharing music and funny stories every evening.'
  },
  {
    id: 'beg-ice-3',
    title: 'My Favorite Food & Cuisine',
    level: 'beginner',
    category: 'ice-breaker',
    question: 'What is your absolute favorite meal? Describe its taste, texture, and when you love to eat it.',
    estimatedDuration: 60,
    suggestedDurationOptions: [30, 60, 90],
    vocabularySuggestions: ['Delicious', 'Crispy', 'Savory', 'Spicy', 'Comfort food'],
    sentenceStarters: [
      'My favorite food of all time is...',
      'It has a unique flavor because it is...',
      'The texture is very crunchy / tender...',
      'Whenever I feel tired, this meal makes me...'
    ],
    hints: ['Use sensory words: aroma, spicy, sweet, crunchy'],
    sampleResponse: 'My favorite food is fried rice with sunny side up eggs. It smells delicious and has a savory taste with a touch of chili. It is my ultimate comfort food.'
  },
  {
    id: 'beg-conv-1',
    title: 'Ordering Food at a Cozy Cafe',
    level: 'beginner',
    category: 'daily-conversation',
    question: 'Imagine you are at a cafe counter. Order a drink, ask for less sugar, and request a pastry.',
    estimatedDuration: 60,
    suggestedDurationOptions: [30, 60, 90],
    vocabularySuggestions: ['I would like to have', 'Could I get', 'Less sweet', 'Takeaway or dine-in', 'Receipt'],
    sentenceStarters: [
      'Good morning, I would like to order...',
      'Could you make it with oat milk and less ice?',
      'Also, do you have any warm croissants available?',
      'How much is the total? Can I pay by card?'
    ],
    hints: ['Use polite phrases like "Please" and "Could I have..."'],
    sampleResponse: 'Good morning! Could I get an iced vanilla latte with oat milk, please? Also, could you make it less sweet? I would also love one warm butter croissant for dine-in. Thank you!'
  },
  {
    id: 'beg-conv-2',
    title: 'Asking for Directions in a New City',
    level: 'beginner',
    category: 'daily-conversation',
    question: 'You are lost near a train station. Ask a friendly local how to reach the central library or park.',
    estimatedDuration: 60,
    suggestedDurationOptions: [30, 60, 90],
    vocabularySuggestions: ['Excuse me', 'Crossroad', 'Turn left / right', 'Within walking distance', 'Straight ahead'],
    sentenceStarters: [
      'Excuse me, could you help me for a moment?',
      'I am looking for the City Library...',
      'Is it far from here, or can I walk there?',
      'Thank you so much for your kind help!'
    ],
    hints: ['Start with a courteous greeting and speak clearly'],
    sampleResponse: 'Excuse me, sir! Could you help me find the nearest train station? Is it within walking distance from here? Should I turn left at the next traffic light? Thank you very much!'
  },
  {
    id: 'beg-story-1',
    title: 'What Happened Today? (Daily Routine)',
    level: 'beginner',
    category: 'storytelling',
    question: 'Walk us through your morning. What was the first thing you did after waking up, and what went well?',
    estimatedDuration: 60,
    suggestedDurationOptions: [30, 60, 90],
    vocabularySuggestions: ['Woke up', 'Refreshed', 'Breakfast', 'Commute', 'Productive'],
    sentenceStarters: [
      'Today I woke up at around...',
      'The first thing I did was...',
      'After having a quick breakfast, I...',
      'The best moment this morning was...'
    ],
    hints: ['Use past simple tense: woke up, ate, washed, walked'],
    sampleResponse: 'Today I woke up early at 6 AM. The morning breeze was fresh. I drank a glass of water, made a toast, and listened to an English podcast. It helped me feel ready for the day.'
  },

  // --- INTERMEDIATE: Opinions, Would You Rather, Roleplay, Fluency ---
  {
    id: 'int-op-1',
    title: 'Is Social Media Good or Bad for Society?',
    level: 'intermediate',
    category: 'opinion',
    question: 'Do social media platforms do more harm than good to young people? Defend your point of view with examples.',
    estimatedDuration: 90,
    suggestedDurationOptions: [60, 90, 120, 180],
    vocabularySuggestions: ['Double-edged sword', 'Mental health', 'Connectivity', 'Distraction', 'Misinformation'],
    sentenceStarters: [
      'In my perspective, social media is a double-edged sword...',
      'On one hand, it enables global connection, but on the other hand...',
      'From personal experience, I have noticed that...',
      'To conclude, the key is mindful usage rather than outright banning.'
    ],
    hints: ['Balance both sides before stating your strong conclusion', 'Provide concrete real-world examples'],
    sampleResponse: 'In my opinion, social media is a double-edged sword. While it bridges distances and allows students to access creative educational content, excessive scrolling harms mental focus and sleep. I believe balanced digital discipline is the real solution.'
  },
  {
    id: 'int-op-2',
    title: 'Should Students Wear School Uniforms?',
    level: 'intermediate',
    category: 'opinion',
    question: 'Explain whether mandatory school uniforms foster equality or suppress personal identity.',
    estimatedDuration: 90,
    suggestedDurationOptions: [60, 90, 120],
    vocabularySuggestions: ['Equality', 'Individuality', 'Socioeconomic gap', 'Belonging', 'Self-expression'],
    sentenceStarters: [
      'This topic has sparked widespread debates among educators...',
      'I firmly believe that uniforms create a sense of equal standing...',
      'However, critics argue that self-expression is restricted...',
      'Overall, the primary purpose of school is learning without social pressure.'
    ],
    hints: ['Mention socioeconomic aspects and daily convenience'],
    sampleResponse: 'I support school uniforms because they eliminate visual wealth disparities among students. When everyone wears the same attire, peer pressure decreases and students can focus entirely on academics.'
  },
  {
    id: 'int-wyr-1',
    title: 'Live Without Internet vs Without Electricity?',
    level: 'intermediate',
    category: 'would-you-rather',
    question: 'Would you rather live one month without internet access or one month without home appliances/electricity?',
    estimatedDuration: 90,
    suggestedDurationOptions: [60, 90, 120],
    vocabularySuggestions: ['Essential utility', 'Digital detox', 'Survival', 'Priceless', 'Inconvenience'],
    sentenceStarters: [
      'If I were forced to choose between these two extreme conditions...',
      'I would definitely choose to sacrifice internet rather than electricity because...',
      'Without electricity, basic needs like refrigeration and lighting disappear...',
      'In fact, a digital detox might even improve my focus!'
    ],
    hints: ['Highlight practical survival needs vs digital habits'],
    sampleResponse: 'I would easily choose to live without internet rather than without electricity. Electricity powers our refrigerators, fans, and clean water pumps. Living offline might feel inconvenient at first, but it can be a great digital detox.'
  },
  {
    id: 'int-fl-1',
    title: 'The 4/3/2 Speed & Fluency Challenge',
    level: 'intermediate',
    category: 'random-challenge',
    question: 'Describe an unforgettable trip or adventure. Challenge: speak continuously without saying "um" or long silences!',
    estimatedDuration: 60,
    suggestedDurationOptions: [60, 90, 120],
    vocabularySuggestions: ['Breathtaking', 'Spontaneous', 'Memorable', 'Overcome obstacles', 'Scenic view'],
    sentenceStarters: [
      'Let me take you back to an unforgettable journey...',
      'The moment we arrived at the destination...',
      'What made this trip stand out was...',
      'That experience taught me to embrace the unknown.'
    ],
    hints: ['Keep sentences rolling smoothly; substitute filler words with steady pauses'],
    sampleResponse: 'Last year I hiked Mount Bromo during sunrise. The temperature was freezing, but the golden horizon over the crater took our breath away. That trip proved to me that perseverance always rewards us.'
  },

  // --- ADVANCED: Debate Arena, Critical Thinking, Professional Communication ---
  {
    id: 'adv-deb-1',
    title: 'AI in the Workforce: Catalyst for Innovation or Mass Threat?',
    level: 'advanced',
    category: 'debate',
    question: 'Deliver a structured 2-minute speech on how generative artificial intelligence will reshape global employment. Are knowledge workers in jeopardy?',
    estimatedDuration: 120,
    suggestedDurationOptions: [60, 90, 120, 180],
    vocabularySuggestions: ['Augmentation', 'Obsolescence', 'Cognitive capability', 'Unprecedented pace', 'Paradigm shift', 'Ethical governance'],
    sentenceStarters: [
      'Distinguished listeners, we stand at the precipice of an economic transformation...',
      'History reminds us that technological disruptions inevitably displace archaic roles...',
      'However, the distinction today lies in the cognitive reach of automated systems...',
      'Therefore, policy makers and educational institutions must pivot immediately toward...'
    ],
    hints: ['Use rhetorical transitions and compelling macroeconomic evidence', 'Conclude with a proactive policy call-to-action'],
    sampleResponse: 'We are witnessing not merely an automation of physical labor, but a profound paradigm shift in cognitive task delegation. AI should not be viewed as an inevitable destroyer of jobs, but rather as an augmentation partner. Those who learn to orchestrate intelligent systems will thrive, while those clinging to repetitive manual workflows face undeniable obsolescence.'
  },
  {
    id: 'adv-crit-1',
    title: 'The Trolley Problem & Autonomous Vehicles',
    level: 'advanced',
    category: 'critical-thinking',
    question: 'When self-driving car software must make a split-second life-or-death decision between protecting its passenger or avoiding pedestrians, what ethical framework should programmers code?',
    estimatedDuration: 120,
    suggestedDurationOptions: [90, 120, 180],
    vocabularySuggestions: ['Utilitarianism', 'Deontological ethics', 'Moral culpability', 'Autonomous algorithms', 'Liability'],
    sentenceStarters: [
      'This classic ethical dilemma presents a modern engineering conundrum...',
      'From a purely utilitarian standpoint, minimizing aggregate casualties seems logical...',
      'Yet, consumer adoption collapses if an autonomous vehicle sacrifices its own occupant...',
      'Thus, we must distinguish between legal liability and ethical programming principles.'
    ],
    hints: ['Contrast utilitarian harm reduction with rights-based deontological philosophy'],
    sampleResponse: 'Programming self-driving algorithms requires navigating profound moral hazards. If cars are programmed purely on utilitarian calculation, consumers may refuse to purchase vehicles that would sacrifice them in rare scenarios. Transparent regulatory consensus is imperative so individual companies do not hold arbitrary power over life and death.'
  },
  {
    id: 'adv-prof-1',
    title: 'The 2-Minute Startup Pitch',
    level: 'advanced',
    category: 'professional',
    question: 'Pitch an innovative green-technology or educational startup to venture capital investors. Define the pain point, market size, unfair advantage, and monetization model.',
    estimatedDuration: 120,
    suggestedDurationOptions: [90, 120, 180],
    vocabularySuggestions: ['Value proposition', 'Scalable ecosystem', 'Customer acquisition cost', 'Unmet demand', 'Retention rate', 'Defensible moat'],
    sentenceStarters: [
      'Imagine a world where language barriers no longer stifle global ambition...',
      'Our platform addresses a 60-billion-dollar market pain point through...',
      'Unlike conventional fragmented learning apps, our proprietary engine provides...',
      'We are projecting profitability within 18 months backed by solid unit economics.'
    ],
    hints: ['Hook the audience in the first 15 seconds', 'Highlight metrics, revenue model, and competitive moat'],
    sampleResponse: 'Good afternoon, investors. Over one billion students worldwide struggle with speaking anxiety despite years of grammar study. Our platform, English Speaking Arena, bridges this divide through real-time gamified speech simulations and dynamic reading velocity pacing. With organic viral acquisition and 74% month-two retention, we are scaling to redefine conversational fluency.'
  },
  {
    id: 'adv-imp-1',
    title: 'Defend an Unpopular Opinion (Impromptu)',
    level: 'advanced',
    category: 'debate',
    question: 'Choose an unpopular stance: "Formal university degrees will become completely obsolete within the next decade." Defend this position persuasively.',
    estimatedDuration: 120,
    suggestedDurationOptions: [60, 90, 120, 180],
    vocabularySuggestions: ['Credentialism', 'Skyrocketing tuition', 'Agile micro-credentials', 'Skill-first hiring', 'Diminishing return'],
    sentenceStarters: [
      'While many still view higher education as the pinnacle of success, the metrics tell a different story...',
      'Employers increasingly prioritize verifiable portfolios over static degrees...',
      'Four years in a traditional lecture hall cannot compete with high-velocity specialized academies...',
      'Ultimately, competence is eclipsing credentialism.'
    ],
    hints: ['Do not apologize for the stance; frame it with confidence and conviction'],
    sampleResponse: 'The four-year degree is suffering from irreversible diminishing returns. In fast-paced technological domains, curricula are obsolete before graduation ceremonies occur. Progressive tech leaders now hire strictly based on verifiable code repositories and real-world problem-solving, proving that competence has superseded traditional credentialism.'
  }
];
