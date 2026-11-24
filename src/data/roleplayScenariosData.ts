import { RoleplayScenario } from '../types';

export const ROLEPLAY_SCENARIOS: RoleplayScenario[] = [
  // --- INTERMEDIATE 1: Restaurant Complaint (Prompt Example) ---
  {
    id: 'role-int-1',
    title: 'The Cold Steak & Misunderstood Order',
    level: 'intermediate',
    context: 'A fine-dining restaurant during a busy Friday evening. A customer received a cold dish that was completely different from what they ordered.',
    suggestedDuration: 180, // 3 minutes
    vocabularySupport: [
      'Discrepancy', 'Medium-rare', 'Appetite', 'Complimentary', 'Expedite', 'Rectify the situation', 'Apologies for the inconvenience'
    ],
    playerA: {
      playerRole: 'A',
      roleName: 'The Disappointed Diner',
      situation: 'You ordered a medium-rare steak with baked potatoes, but received lukewarm salmon with mashed pumpkin after waiting 40 minutes.',
      rules: [
        'Stay composed and polite throughout the conversation.',
        'Express your hunger and evening schedule constraints.'
      ],
      secretObjective: 'Get a replacement meal prepared with highest priority without sounding aggressive or rude.',
      requiredPhrases: ['I was expecting...', 'Could you please check with the chef?', 'I appreciate your assistance'],
      forbiddenWords: ['bad', 'terrible', 'angry', 'stupid', 'horrible']
    },
    playerB: {
      playerRole: 'B',
      roleName: 'The Head Waiter / Floor Manager',
      situation: 'The kitchen is currently short-staffed and overloaded. A replacement steak will take at least 20 minutes to cook from scratch.',
      rules: [
        'Acknowledge the mistake graciously without blaming kitchen colleagues.',
        'Maintain a calm, professional tone.'
      ],
      secretObjective: 'Do not immediately offer a full financial refund. Provide at least two alternative satisfying solutions first.',
      requiredPhrases: ['I completely understand your frustration', 'Allow me to rectify this', 'On the house'],
      forbiddenWords: ['impossible', 'your fault', 'no problem', 'calm down']
    }
  },

  // --- BEGINNER: Hotel Check-in & Room Request ---
  {
    id: 'role-beg-1',
    title: 'Hotel Check-In & Missing Reservation',
    level: 'beginner',
    context: 'A tourist arrives at a downtown boutique hotel after a long flight, but the front desk cannot immediately locate the booking.',
    suggestedDuration: 120,
    vocabularySupport: [
      'Reservation', 'Confirmation email', 'Passport', 'Keycard', 'Luggage', 'Comfortable', 'Top floor'
    ],
    playerA: {
      playerRole: 'A',
      roleName: 'Tired Traveler',
      situation: 'You booked a quiet room with a double bed two weeks ago online. You are very sleepy and want to check in quickly.',
      rules: ['Speak clearly and provide your booking details politely.'],
      secretObjective: 'Ask if you can get a room on a quiet high floor and request the Wi-Fi password.',
      requiredPhrases: ['I have a reservation under...', 'Could I get a room with...', 'Thank you very much'],
      forbiddenWords: ['liar', 'cheat', 'hate']
    },
    playerB: {
      playerRole: 'B',
      roleName: 'Hotel Receptionist',
      situation: 'The guest reservation was filed under their middle name instead of their surname. You have found it after a brief search.',
      rules: ['Welcome the guest with warmth and check their identification.'],
      secretObjective: 'Compliment the guest on their journey and offer them a complimentary welcome beverage.',
      requiredPhrases: ['Welcome to our hotel', 'May I see your passport?', 'Enjoy your stay with us'],
      forbiddenWords: ['lost', 'problem', 'go away']
    }
  },

  // --- INTERMEDIATE 2: Job Interview & Salary Range ---
  {
    id: 'role-int-2',
    title: 'The High-Stakes Job Interview',
    level: 'intermediate',
    context: 'A final round interview for a Project Coordinator position at an international tech non-profit.',
    suggestedDuration: 180,
    vocabularySupport: [
      'Proven track record', 'Collaborative mindset', 'Cross-functional', 'Milestone', 'Compensation package', 'Core strengths'
    ],
    playerA: {
      playerRole: 'A',
      roleName: 'The Job Candidate',
      situation: 'You have three years of relevant project experience and thrive under fast deadlines, but you want to negotiate flexible work hours.',
      rules: ['Highlight one real problem you solved in the past.', 'Present confidence without arrogance.'],
      secretObjective: 'Mention how your collaboration skills increased team productivity by 30% and ask about remote flexibility.',
      requiredPhrases: ['In my previous role, I succeeded in...', 'I am particularly drawn to your mission because...', 'Could you elaborate on the team culture?'],
      forbiddenWords: ['maybe', 'i don\'t know', 'money', 'lazy']
    },
    playerB: {
      playerRole: 'B',
      roleName: 'The Hiring Director',
      situation: 'You have interviewed three solid candidates. You need someone who stays calm during crisis and takes initiative.',
      rules: ['Probe the candidate on handling unexpected project delays.'],
      secretObjective: 'Challenge the candidate with an unexpected scenario (e.g. key team member quits right before launch) and see their response.',
      requiredPhrases: ['How would you prioritize...', 'Tell me about a time when...', 'We value proactive initiative'],
      forbiddenWords: ['easy', 'whatever', 'unimportant']
    }
  },

  // --- ADVANCED 1: Airport Overbooking Crisis ---
  {
    id: 'role-adv-1',
    title: 'Flight Overbooked: The Boarding Gate Confrontation',
    level: 'advanced',
    context: 'An international flight to London is oversold by six seats. A business consultant must deliver a keynote presentation tomorrow morning.',
    suggestedDuration: 180,
    vocabularySupport: [
      'Involuntary bumping', 'Non-negotiable commitment', 'Voucher compensation', 'Rerouting options', 'Reputational damage', 'Executive duty'
    ],
    playerA: {
      playerRole: 'A',
      roleName: 'The Keynote Speaker Passenger',
      situation: 'You are arriving in London to deliver the opening address for a 500-person summit at 9:00 AM tomorrow. Your seat was just given away due to overbooking.',
      rules: ['Demonstrate gravitas and articulacy without shouting or causing a public security disturbance.'],
      secretObjective: 'Persuade the supervisor to find a passenger willing to accept voluntary compensation or re-route you on a competitor airline via Frankfurt.',
      requiredPhrases: ['My attendance is non-negotiable', 'Under aviation passenger rights...', 'What immediate alternative routing can you execute?'],
      forbiddenWords: ['sue', 'jail', 'idiot', 'garbage']
    },
    playerB: {
      playerRole: 'B',
      roleName: 'The Airport Station Supervisor',
      situation: 'The aircraft is at absolute maximum capacity. Company policy strictly caps hotel vouchers at $300 and travel vouchers at $800.',
      rules: ['De-escalate the passenger\'s distress with absolute professionalism and firm adherence to FAA/CAA safety rules.'],
      secretObjective: 'Offer an upgraded first-class itinerary leaving on a partner alliance flight in three hours, plus lounge access.',
      requiredPhrases: ['I recognize the immense stakes of your commitment', 'I am actively exploring partner carrier options', 'Let us resolve this discreetly'],
      forbiddenWords: ['calm down', 'not my fault', 'deal with it', 'shut up']
    }
  },

  // --- ADVANCED 2: Crisis Management Press Conference ---
  {
    id: 'role-adv-2',
    title: 'Cybersecurity Data Breach Press Conference',
    level: 'advanced',
    context: 'A major fintech company experienced an unauthorized database intrusion affecting 2 million user accounts.',
    suggestedDuration: 180,
    vocabularySupport: [
      'Data breach', 'Mitigation protocols', 'Forensic investigation', 'Transparency', 'Vulnerability patched', 'Regulatory compliance'
    ],
    playerA: {
      playerRole: 'A',
      roleName: 'Investigative Tech Journalist',
      situation: 'You obtained leaked internal memos indicating the vulnerability was reported three months ago and ignored.',
      rules: ['Press for accountability and clear timelines on customer remediation.'],
      secretObjective: 'Force the executive to acknowledge the internal warning memo on record without letting them deflect with PR jargon.',
      requiredPhrases: ['Is it not true that internal warnings were flagged...', 'What specific remediation are affected consumers guaranteed?', 'On the record...'],
      forbiddenWords: ['criminal', 'scam', 'liar']
    },
    playerB: {
      playerRole: 'B',
      roleName: 'Chief Information Security Officer (CISO)',
      situation: 'You have contained the breach, patched the zero-day exploit, and notified international regulatory agencies.',
      rules: ['Reassure the public, protect ongoing law enforcement investigations, and maintain investor confidence.'],
      secretObjective: 'Clarify that financial credentials and passwords were encrypted while outlining the comprehensive identity protection package provided free of charge.',
      requiredPhrases: ['We take full accountability for our ecosystem', 'All customer credentials remained cryptographically salted and hashed', 'A third-party forensic audit is underway'],
      forbiddenWords: ['we panicked', 'we ignored it', 'no idea']
    }
  },

  // --- BEGINNER 2: Airport Baggage Claim Desk ---
  {
    id: 'role-beg-2',
    title: 'The Lost Suitcase at Airport Baggage Claim',
    level: 'beginner',
    context: 'A tired passenger arrives at their destination airport, but their black luggage did not appear on the carousel belt.',
    suggestedDuration: 120,
    vocabularySupport: [
      'Baggage carousel', 'Luggage tag', 'Boarding pass', 'Suitcase', 'Color and brand', 'Delivery address', 'Tracking number'
    ],
    playerA: {
      playerRole: 'A',
      roleName: 'The Exhausted Traveler',
      situation: 'Your flight landed 45 minutes ago. All bags have cleared the belt, but your medium black hard-shell suitcase with a yellow ribbon is missing.',
      rules: ['Speak politely despite being tired.', 'Provide clear descriptions of your bag.'],
      secretObjective: 'Ask the agent to deliver the suitcase directly to your hotel for free once it is located.',
      requiredPhrases: ['My bag did not come out on carousel 3', 'It has a bright yellow ribbon on the handle', 'Could you arrange delivery to my hotel?'],
      forbiddenWords: ['terrible airline', 'thief', 'incompetent', 'sue you']
    },
    playerB: {
      playerRole: 'B',
      roleName: 'Airport Baggage Service Officer',
      situation: 'A flight delay at the transit hub caused twenty bags to be transferred to the subsequent flight arriving in three hours.',
      rules: ['Apologize for the inconvenience.', 'Collect luggage claim tags and passenger contact information.'],
      secretObjective: 'Locate the bag in the baggage tracking database and confirm complimentary courier delivery within 6 hours.',
      requiredPhrases: ['May I please see your baggage claim receipt?', 'I will trace your bag in our global locator system', 'We will deliver it directly to your address'],
      forbiddenWords: ['not my problem', 'lost forever', 'too bad', 'go away']
    }
  }
];
