import { ReadingMaterial } from '../types';

export const READING_MATERIALS: ReadingMaterial[] = [
  // --- BEGINNER 1: Short Story ---
  {
    id: 'read-beg-1',
    title: 'The Cat That Loved Green Apples',
    genre: 'short-stories',
    level: 'beginner',
    wordCount: 145,
    summary: 'A heartwarming story about a curious neighborhood cat named Milo who refused fish and preferred crunchy green fruit.',
    paragraphs: [
      'Milo was not an ordinary ginger cat. While other cats in the quiet village chased mice or begged for tuna, Milo spent his afternoons sitting under Mr. Henderson\'s apple tree.',
      'One sunny morning, a small, bright green apple fell from a branch and landed right before Milo\'s paws. Instead of walking away, Milo tapped it gently with his front claw.',
      'He took a tiny bite. The crisp, sweet juice surprised him. From that day on, Milo visited the garden every morning, waiting patiently for fresh apples.',
      'Mr. Henderson smiled as he watched from his kitchen window. He started placing a sliced green apple on a ceramic saucer every afternoon, creating a unique friendship between an old gardener and an unusual cat.'
    ],
    vocabularyGlossary: [
      { word: 'Ordinary', definition: 'Normal or common; not special.', example: 'It was just an ordinary school day.' },
      { word: 'Gently', definition: 'In a kind, soft, or careful manner.', example: 'She held the newborn puppy gently.' },
      { word: 'Crisp', definition: 'Pleasantly firm, dry, and fresh.', example: 'The morning air was cool and crisp.' },
      { word: 'Saucer', definition: 'A shallow dish used for holding a cup or food.', example: 'He placed the teacup carefully on the saucer.' }
    ],
    questions: [
      {
        id: 'q1',
        question: 'What made Milo different from other village cats?',
        type: 'multiple-choice',
        options: ['He could swim across rivers', 'He liked eating green apples instead of fish', 'He could speak to birds', 'He lived inside the library'],
        correctAnswer: 1,
        explanation: 'The story states that Milo refused tuna and mice, preferring green apples from Mr. Henderson\'s tree.'
      },
      {
        id: 'q2',
        question: 'Mr. Henderson was annoyed by Milo eating his fruit.',
        type: 'true-false',
        options: ['True', 'False'],
        correctAnswer: 1,
        explanation: 'False. Mr. Henderson smiled and started placing sliced apples on a saucer for Milo.'
      },
      {
        id: 'q3',
        question: 'Where did the green apple fall when Milo discovered it?',
        type: 'multiple-choice',
        options: ['Into a river', 'Onto a car roof', 'Right before his paws under the tree', 'Inside the kitchen'],
        correctAnswer: 2,
        explanation: 'A bright green apple fell from a branch and landed right before Milo\'s paws.'
      }
    ]
  },

  // --- BEGINNER 2: Daily Conversation ---
  {
    id: 'read-beg-2',
    title: 'Planning a Weekend Picnic at the Lakeside',
    genre: 'daily-conversations',
    level: 'beginner',
    wordCount: 160,
    summary: 'Two friends discuss their weekend outdoor plans, snacks to bring, and checking the weather forecast.',
    paragraphs: [
      '"Hey Sarah! Are you free this Saturday afternoon? The weather forecast says it will be sunny and breezy," asked Daniel enthusiastically.',
      '"Hi Daniel! Yes, I do not have any classes this weekend. A picnic by the lake sounds like a wonderful idea. What should we pack for lunch?" Sarah replied.',
      '"I can make some chicken sandwiches and bring fresh orange juice. Could you bring potato chips and some chocolate chip cookies?" suggested Daniel.',
      '"Of course! I will also bring a picnic mat and my badminton rackets so we can play together near the pine trees. Don\'t forget your sunscreen and sunglasses!"',
      '"Great idea! Let us meet at the main park gate at eleven in the morning. I am really looking forward to a relaxing day outdoors."'
    ],
    vocabularyGlossary: [
      { word: 'Breezy', definition: 'Pleasantly windy.', example: 'It was a bright and breezy afternoon.' },
      { word: 'Enthusiastically', definition: 'With great excitement and eagerness.', example: 'He agreed enthusiastically to the plan.' },
      { word: 'Forecast', definition: 'A prediction of future weather conditions.', example: 'The weather forecast predicts light rain tomorrow.' },
      { word: 'Sunscreen', definition: 'A lotion applied to skin to protect from sun damage.', example: 'Always put on sunscreen before going to the beach.' }
    ],
    questions: [
      {
        id: 'q1',
        question: 'Where do Sarah and Daniel agree to meet?',
        type: 'multiple-choice',
        options: ['At the train station', 'At Sarah\'s house', 'At the main park gate at 11 AM', 'Inside the cafe'],
        correctAnswer: 2,
        explanation: 'Daniel says: "Let us meet at the main park gate at eleven in the morning."'
      },
      {
        id: 'q2',
        question: 'Sarah agreed to bring chicken sandwiches and orange juice.',
        type: 'true-false',
        options: ['True', 'False'],
        correctAnswer: 1,
        explanation: 'False. Daniel offered to make sandwiches and juice; Sarah offered chips, cookies, and badminton rackets.'
      }
    ]
  },

  // --- INTERMEDIATE 1: Educational / Science ---
  {
    id: 'read-int-1',
    title: 'How Deep-Sea Creatures Glow in the Pitch Dark',
    genre: 'educational',
    level: 'intermediate',
    wordCount: 220,
    summary: 'An exploration of bioluminescence in deep oceanic trenches and how marine animals turn chemical reactions into living light.',
    paragraphs: [
      'In the fathomless depths of the world\'s oceans, beyond two hundred meters below the surface, sunlight completely fades away into total obsidian darkness. The water pressure here is immense, capable of crushing unshielded metal, yet millions of fascinating organisms flourish in this abyss.',
      'To survive without sunlight, more than seventy percent of deep-sea species produce their own light through a biological phenomenon known as bioluminescence. Inside specialized organs called photophores, an enzyme named luciferase catalyzes a reaction with a substrate called luciferin, releasing energy almost entirely as cold visible light rather than heat.',
      'Marine animals exploit this internal illumination for diverse tactical purposes. Anglerfish dangle a glowing bulb above their razor-sharp jaws to lure unsuspecting prey into an ambush. Other organisms, such as deep-water shrimp, eject luminous clouds of liquid to blind predators while they dart to safety.',
      'Scientists are now applying these oceanic biological compounds in biomedical research, using glowing proteins to track cellular diseases and measure environmental pollution levels with unprecedented clarity.'
    ],
    vocabularyGlossary: [
      { word: 'Fathomless', definition: 'Too deep to be measured or understood.', example: 'The mysteries of the fathomless ocean remain partly unsolved.' },
      { word: 'Bioluminescence', definition: 'The biochemical emission of light by living organisms.', example: 'Fireflies and jellyfish display bioluminescence.' },
      { word: 'Prey', definition: 'An animal hunted and killed by another for food.', example: 'The owl circled above looking for small prey.' },
      { word: 'Catalyze', definition: 'To cause or accelerate a chemical reaction.', example: 'Enzymes catalyze vital biological functions.' }
    ],
    questions: [
      {
        id: 'q1',
        question: 'What is the primary biological enzyme that triggers glowing reactions in marine organisms?',
        type: 'multiple-choice',
        options: ['Hemoglobin', 'Luciferase', 'Chlorophyll', 'Insulin'],
        correctAnswer: 1,
        explanation: 'The text highlights that the enzyme luciferase catalyzes a reaction with luciferin to release light.'
      },
      {
        id: 'q2',
        question: 'Most deep-sea bioluminescence produces large amounts of boiling heat.',
        type: 'true-false',
        options: ['True', 'False'],
        correctAnswer: 1,
        explanation: 'False. The text explicitly notes that the energy is released "almost entirely as cold visible light rather than heat."'
      },
      {
        id: 'q3',
        question: 'How do deep-water shrimp use bioluminescence for defense?',
        type: 'multiple-choice',
        options: ['They disguise themselves as rocks', 'They eject luminous clouds to blind predators', 'They flash red lights to call their mother', 'They warm the surrounding water'],
        correctAnswer: 1,
        explanation: 'The article states that deep-water shrimp eject luminous clouds of liquid to blind predators.'
      }
    ]
  },

  // --- INTERMEDIATE 2: News & Articles ---
  {
    id: 'read-int-2',
    title: 'The Global Rise of Smart Micro-Habits in Education',
    genre: 'news-articles',
    level: 'intermediate',
    wordCount: 235,
    summary: 'Why modern cognitive scientists recommend short, consistent five-minute daily study sessions over weekend cramming marathons.',
    paragraphs: [
      'For decades, standard academic folklore celebrated the heroics of the "all-nighter" — students drinking excessive energy drinks and memorizing entire textbooks twenty-four hours before a final exam. Modern neurological research, however, reveals that cramming is one of the least effective methods for long-term retention.',
      'According to researchers in neuroplasticity, memory consolidation occurs primarily during restorative sleep cycles. When students attempt to ingest massive quantities of unstructured data within a compressed timeframe, the brain\'s prefrontal cortex experiences severe cognitive overload, causing newly formed synapses to degrade rapidly within forty-eight hours.',
      'In response, contemporary language apps and progressive classrooms are adopting "micro-learning." By dedicating just ten to fifteen minutes every single day to active recall, spaced repetition, and spontaneous speaking drills, learners build resilient neural pathways without burnout.',
      'The compounding effect of micro-habits is astonishing. A student who practices speaking for ten minutes daily accumulates over sixty hours of focused vocal production across a year, vastly outperforming peers who attend sporadic three-hour lectures once a month.'
    ],
    vocabularyGlossary: [
      { word: 'Consolidation', definition: 'The process where short-term memories transform into stable long-term memories.', example: 'Deep sleep is essential for memory consolidation.' },
      { word: 'Prefrontal Cortex', definition: 'The cerebral cortex covering the front part of the frontal lobe, involved in decision making.', example: 'Stress impairs prefrontal cortex function.' },
      { word: 'Compounding', definition: 'Increasing continuously at an exponential rate.', example: 'Small daily savings yield compounding wealth.' },
      { word: 'Sporadic', definition: 'Occurring at irregular intervals or scattered instances.', example: 'His attendance was too sporadic to achieve fluency.' }
    ],
    questions: [
      {
        id: 'q1',
        question: 'When does human memory consolidation primarily take place according to neurologists?',
        type: 'multiple-choice',
        options: ['While drinking energy drinks', 'During restorative sleep cycles', 'Immediately while writing tests', 'During vigorous physical exercise'],
        correctAnswer: 1,
        explanation: 'Memory consolidation occurs primarily during restorative sleep cycles.'
      },
      {
        id: 'q2',
        question: 'What is the main advantage of micro-learning over occasional cramming sessions?',
        type: 'multiple-choice',
        options: ['It requires no effort at all', 'It builds resilient neural pathways through daily compounding active recall', 'It eliminates the need to speak English', 'It is only useful for mathematics'],
        correctAnswer: 1,
        explanation: 'Ten minutes daily builds durable neural pathways and aggregates into dozens of hours without burnout.'
      }
    ]
  },

  // --- ADVANCED 1: Professional & Academic ---
  {
    id: 'read-adv-1',
    title: 'Algorithmic Governance and the Future of Sovereign Labor Markets',
    genre: 'professional',
    level: 'advanced',
    wordCount: 310,
    summary: 'A critical analysis of automated workplace monitoring, generative enterprise AI, and the legal implications for white-collar employment.',
    paragraphs: [
      'The pervasive integration of artificial intelligence and automated telemetry systems has inaugurated an era of algorithmic governance within the multinational enterprise. Where industrial management historically relied on hierarchical middle tiers to oversee output, contemporary platforms continuously ingest telemetry metrics: keystroke velocity, meeting sentiment, ocular attention tracking, and code synthesis velocity.',
      'Proponents argue that programmatic oversight democratizes performance evaluations by eliminating human subjective bias and favoritism. An impartial algorithm, in theory, evaluates contributions purely through empirical output benchmarks, enabling high-performing contributors to achieve accelerated career mobility regardless of traditional corporate politics.',
      'Conversely, labor sociologists and legal scholars warn of severe psychological and systemic repercussions. The relentless quantification of cognitive labor fosters an environment of pervasive surveillance anxiety. Furthermore, when algorithmic evaluations serve as the deterministic rationale for layoffs, restructuring, or compensation ceilings, employees are denied procedural transparency and meaningful avenues for grievance redress.',
      'Moreover, the concurrent emergence of agentic generative models threatens to cannibalize foundational roles previously reserved for junior analysts, paralegals, and software apprentices. Without an entry-level crucible to cultivate pragmatic domain intuition, organizations risk hollowing out their future leadership pipelines. Progressive corporate governance must therefore reframe artificial intelligence not as an autonomous arbiter of human value, but as an augmentative instrument subordinated to ethical human oversight.'
    ],
    vocabularyGlossary: [
      { word: 'Telemetry', definition: 'The automated gathering and transmission of real-time data from remote sources.', example: 'Telemetry data showed high server engagement.' },
      { word: 'Inaugurate', definition: 'To mark the beginning of a significant new era or enterprise.', example: 'The treaty inaugurated a prolonged period of regional stability.' },
      { word: 'Deterministic', definition: 'Inevitably determined by preceding conditions rather than choice or chance.', example: 'The algorithm applied a deterministic scoring framework.' },
      { word: 'Crucible', definition: 'A severe test or situation in which different elements interact and produce something new.', example: 'Early client presentations served as a tough leadership crucible.' }
    ],
    questions: [
      {
        id: 'q1',
        question: 'What potential danger do researchers foresee regarding the elimination of entry-level junior roles by AI?',
        type: 'multiple-choice',
        options: [
          'Offices will run out of electricity',
          'Organizations will hollow out the pipeline necessary to cultivate future experienced leadership',
          'Salaries will increase too rapidly for executives',
          'Computers will refuse to communicate with managers'
        ],
        correctAnswer: 1,
        explanation: 'Without entry-level roles to cultivate domain intuition, organizations risk hollowing out their future leadership pipelines.'
      },
      {
        id: 'q2',
        question: 'Proponents of algorithmic oversight claim it completely eliminates employee stress.',
        type: 'true-false',
        options: ['True', 'False'],
        correctAnswer: 1,
        explanation: 'False. Proponents claim it reduces human bias; sociologists warn it significantly intensifies surveillance anxiety.'
      },
      {
        id: 'q3',
        question: 'According to the article\'s conclusion, what role should AI occupy in progressive corporate governance?',
        type: 'multiple-choice',
        options: [
          'An autonomous arbiter with final firing power',
          'A banned technology that cannot be used in offices',
          'An augmentative instrument subordinated to ethical human oversight',
          'A replacement for human stockholders'
        ],
        correctAnswer: 2,
        explanation: 'The conclusion emphasizes reframing AI as an augmentative instrument subordinated to ethical human oversight.'
      }
    ]
  },

  // --- ADVANCED 2: Interesting Facts / Geopolitics & Ethics ---
  {
    id: 'read-adv-2',
    title: 'The Geopolitics of Deep-Sea Mining and Ecological Sovereignty',
    genre: 'interesting-facts',
    level: 'advanced',
    wordCount: 290,
    summary: 'The race to harvest polymetallic nodules from the abyssal Clarion-Clipperton Zone to power electric vehicles, set against catastrophic benthic ecosystem risks.',
    paragraphs: [
      'Four thousand meters beneath the surface of the central Pacific Ocean lies the Clarion-Clipperton Zone, an abyssal plain spanning millions of square kilometers. Scattered across this cold, lightless sediment are billions of potato-sized polymetallic nodules. Rich in nickel, cobalt, copper, and manganese, these geological deposits represent the world\'s largest untapped repository of critical minerals essential for electric vehicle batteries and green energy grids.',
      'Mining consortia and resource-scarce nations argue that terrestrial mineral extraction carries catastrophic environmental and humanitarian consequences, including rainforest deforestation and severe freshwater contamination. In contrast, they assert that harvesting abyssal nodules involves zero human community displacement and minimal visible carbon emissions.',
      'Marine biologists and oceanographers, however, advocate for an immediate precautionary moratorium. Deep-sea ecosystems operate on geological timescales; benthic nodules take millions of years to precipitate from seawater. The heavy robotic crawlers designed to scrape the seabed inevitably kick up colossal plumes of suspended sediment that can choke filter-feeding organisms and disrupt bioluminescent communication across hundreds of nautical leagues.',
      'The International Seabed Authority faces an existential quandary: how to balance the imperative of decarbonizing global transport with the solemn international treaty mandate to protect the common heritage of humankind from irrevocable ecological degradation.'
    ],
    vocabularyGlossary: [
      { word: 'Abyssal', definition: 'Relating to or denoting the depths or bed of the ocean between 3,000 and 6,000 meters down.', example: 'Abyssal trenches harbor undiscovered microbial life.' },
      { word: 'Moratorium', definition: 'A temporary prohibition or suspension of an activity.', example: 'Conservationists called for a five-year moratorium on deep drilling.' },
      { word: 'Precipitate', definition: 'To cause a substance to deposit in solid form from a solution.', example: 'Minerals precipitate very slowly onto oceanic nodules.' },
      { word: 'Quandary', definition: 'A state of perplexity or uncertainty over what to do in a difficult situation.', example: 'The minister found herself in a challenging political quandary.' }
    ],
    questions: [
      {
        id: 'q1',
        question: 'Why are polymetallic nodules in high demand internationally?',
        type: 'multiple-choice',
        options: [
          'They contain gold and diamond jewelry',
          'They contain nickel, cobalt, copper, and manganese essential for batteries and green transition',
          'They can be burned directly as rocket fuel',
          'They are used to purify drinking water in cities'
        ],
        correctAnswer: 1,
        explanation: 'They are rich in nickel, cobalt, copper, and manganese needed for EV batteries and green grids.'
      },
      {
        id: 'q2',
        question: 'Sediment plumes kicked up by seabed crawlers have virtually no impact on ocean life.',
        type: 'true-false',
        options: ['True', 'False'],
        correctAnswer: 1,
        explanation: 'False. Sediment plumes can choke filter-feeding organisms and disrupt communication across hundreds of nautical leagues.'
      }
    ]
  }
];
