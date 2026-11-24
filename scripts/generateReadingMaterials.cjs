const fs = require('fs');
const path = require('path');

const materials = [
  // ==========================================
  // 1. SHORT STORIES
  // ==========================================
  // --- Beginner 1 ---
  {
    id: 'read-beg-short-1',
    title: 'The Cat That Loved Green Apples',
    genre: 'short-stories',
    level: 'beginner',
    wordCount: 145,
    summary: 'A heartwarming story about a curious neighborhood cat named Milo who refused fish and preferred crunchy green fruit.',
    paragraphs: [
      "Milo was not an ordinary ginger cat. While other cats in the quiet village chased mice or begged for tuna, Milo spent his afternoons sitting under Mr. Henderson's apple tree.",
      "One sunny morning, a small, bright green apple fell from a branch and landed right before Milo's paws. Instead of walking away, Milo tapped it gently with his front claw.",
      "He took a tiny bite. The crisp, sweet juice surprised him. From that day on, Milo visited the garden every morning, waiting patiently for fresh apples.",
      "Mr. Henderson smiled as he watched from his kitchen window. He started placing a sliced green apple on a ceramic saucer every afternoon, creating a unique friendship between an old gardener and an unusual cat."
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
        explanation: "The story states that Milo refused tuna and mice, preferring green apples from Mr. Henderson's tree."
      },
      {
        id: 'q2',
        question: 'Mr. Henderson was annoyed by Milo eating his fruit.',
        type: 'true-false',
        options: ['True', 'False'],
        correctAnswer: 1,
        explanation: 'False. Mr. Henderson smiled and started placing sliced apples on a saucer for Milo.'
      }
    ]
  },

  // --- Beginner 2 ---
  {
    id: 'read-beg-short-2',
    title: 'The Lost Key in the Sunflower Bed',
    genre: 'short-stories',
    level: 'beginner',
    wordCount: 155,
    summary: 'Young Lily helps her grandfather search for a vintage brass key hidden beneath tall yellow sunflowers.',
    paragraphs: [
      "Grandpa Oliver stood by his wooden shed with a worried expression. His small brass key, which unlocked his secret workshop of wooden toys, was nowhere to be found.",
      "'Don't worry, Grandpa! I will help you look everywhere,' said seven-year-old Lily with an energetic jump. She put on her red gardening boots and headed toward the backyard.",
      "The backyard was full of giant yellow sunflowers that danced softly in the morning breeze. Lily kneeled down on the soft black soil and checked near the flower roots.",
      "Suddenly, she saw a bright golden sparkle under a broad green leaf. 'I found it!' she cheered proudly. Grandpa Oliver hugged her warmly and promised to carve a wooden rabbit just for her."
    ],
    vocabularyGlossary: [
      { word: 'Worried', definition: 'Feeling anxious or troubled about something.', example: 'He was worried when he lost his house keys.' },
      { word: 'Energetic', definition: 'Showing or involving great activity and enthusiasm.', example: 'The energetic puppy ran across the lawn.' },
      { word: 'Breeze', definition: 'A light and pleasant wind.', example: 'The sea breeze felt cool in the afternoon.' },
      { word: 'Carve', definition: 'To cut a shape into wood or stone using a sharp tool.', example: 'He carved a wooden bird from pine.' }
    ],
    questions: [
      {
        id: 'q1',
        question: 'What was the missing brass key used for?',
        type: 'multiple-choice',
        options: ['Starting an old tractor', 'Opening the bicycle gate', 'Unlocking Grandpa Oliver\'s toy workshop', 'Opening the treasure chest at the beach'],
        correctAnswer: 2,
        explanation: 'The text explains that the small brass key unlocked Grandpa Oliver\'s workshop of wooden toys.'
      },
      {
        id: 'q2',
        question: 'Where did Lily discover the lost brass key?',
        type: 'multiple-choice',
        options: ['Inside Grandpa\'s pocket', 'Under a green leaf among the sunflowers', 'Inside the kitchen sink', 'Near the front door'],
        correctAnswer: 1,
        explanation: 'Lily saw a golden sparkle under a broad green leaf in the sunflower garden.'
      }
    ]
  },

  // --- Intermediate 1 ---
  {
    id: 'read-int-short-1',
    title: 'The Lighthouse Keeper\'s Midnight Visitor',
    genre: 'short-stories',
    level: 'intermediate',
    wordCount: 225,
    summary: 'During a violent maritime gale, an isolated lighthouse operator shelters a rare peregrine falcon on the high lantern deck.',
    paragraphs: [
      "Thomas had tended the granite beacon on Cape Whispering for over twenty winters, accustomed to howling Atlantic gales that rattled the reinforced glass cupola. On this turbulent November night, however, torrential rain reduced visibility to less than fifty paces, and thunder echoed across the jagged shoals.",
      "As Thomas climbed the spiral cast-iron staircase to replenish the halogen rotation lamps, an abrupt, rhythmic tapping sounded against the seaward observation pane. Cupping his hands against the glass, he discovered a drenched, exhausted peregrine falcon clinging tenaciously to the iron railing.",
      "Carefully unlocking the storm hatch against the gale's furious suction, Thomas extended a heavy canvas glove. The magnificent raptor did not screech or retreat; sensing refuge, it hopped onto his forearm and allowed itself to be carried into the warm sanctuary of the tower.",
      "Throughout the tempest, bird and keeper kept silent vigil over the turbulent waters. By sunrise, the squall had dissipated into gentle sapphire waves, and the falcon took flight toward southern skies, leaving behind a single slate-grey feather as a keepsake."
    ],
    vocabularyGlossary: [
      { word: 'Torrential', definition: 'Falling rapidly and in copious, heavy quantities.', example: 'Torrential rain caused flash floods along the highway.' },
      { word: 'Tenaciously', definition: 'With great determination and a firm grip.', example: 'The climber clung tenaciously to the rock face.' },
      { word: 'Sanctuary', definition: 'A place of safety, refuge, or protection.', example: 'The mountain cabin provided a peaceful sanctuary.' },
      { word: 'Dissipate', definition: 'To disappear or scatter gradually.', example: 'The thick fog dissipated once the sun rose.' }
    ],
    questions: [
      {
        id: 'q1',
        question: 'What unexpected visitor arrived at the lighthouse during the November storm?',
        type: 'multiple-choice',
        options: ['A lost fisherman in a rowboat', 'A drenched peregrine falcon', 'A wandering mountain goat', 'A naval patrol officer'],
        correctAnswer: 1,
        explanation: 'The story describes an exhausted peregrine falcon clinging to the iron railing outside the observation pane.'
      },
      {
        id: 'q2',
        question: 'The falcon attacked Thomas aggressively when he opened the storm hatch.',
        type: 'true-false',
        options: ['True', 'False'],
        correctAnswer: 1,
        explanation: 'False. The raptor sensed refuge, hopped calmly onto his canvas glove, and rested inside the tower.'
      }
    ]
  },

  // --- Intermediate 2 ---
  {
    id: 'read-int-short-2',
    title: 'The Clockmaker\'s Secret Melody',
    genre: 'short-stories',
    level: 'intermediate',
    wordCount: 230,
    summary: 'A quiet horologist in Vienna discovers a hidden musical cylinder inside a centuries-old grandfather clock.',
    paragraphs: [
      "In the cobblestone alleyways of old Vienna, Master Leo operated a modest horology workshop filled with ticking pendulums and polished brass gears. His reputation drew collectors from across the continent, yet his greatest passion lay in restoring forgotten timepieces that had fallen into silence.",
      "An anonymous estate sale brought him an ornate mahogany grandfather clock crafted in 1782. While meticulously dismantling the escapement wheel to remove hardened oil, Leo\'s screwdriver caught on a tiny concealed brass latch behind the chime housing.",
      "With gentle pressure, a secondary compartment slid forward, revealing a hand-tuned mechanical cylinder studded with hundreds of micro-pins. Leo delicately cleaned the rusted comb teeth, wound the counterweight, and released the miniature governor.",
      "Instead of the predictable quarterly Westminster chime, the room was bathed in a haunting, crystalline waltz melody that had remained unheard for over two hundred years. Leo realized the anonymous craftsman had preserved a forgotten lullaby dedicated to an unknown love."
    ],
    vocabularyGlossary: [
      { word: 'Horology', definition: 'The art or science of measuring time and making clocks.', example: 'He studied horology in Switzerland for four years.' },
      { word: 'Meticulously', definition: 'Showing great attention to detail; very thoroughly.', example: 'She meticulously restored the ancient manuscript.' },
      { word: 'Concealed', definition: 'Kept secret or hidden from sight.', example: 'The safe was concealed behind an oil painting.' },
      { word: 'Crystalline', definition: 'Very clear, sharp, or sparkling like crystal.', example: 'Her voice had a crystalline purity.' }
    ],
    questions: [
      {
        id: 'q1',
        question: 'What unexpected mechanism did Master Leo find hidden behind the clock\'s chime housing?',
        type: 'multiple-choice',
        options: ['A cache of silver coins', 'A hand-tuned musical cylinder playing an unknown waltz', 'A secret diary with maps', 'A miniature spy camera'],
        correctAnswer: 1,
        explanation: 'Leo discovered a secondary compartment with a pinned cylinder that played a crystalline, forgotten waltz.'
      },
      {
        id: 'q2',
        question: 'Master Leo bought the ornate 1782 mahogany clock directly from the Austrian Emperor.',
        type: 'true-false',
        options: ['True', 'False'],
        correctAnswer: 1,
        explanation: 'False. The text notes that the timepiece came from an anonymous estate sale.'
      }
    ]
  },

  // --- Advanced 1 ---
  {
    id: 'read-adv-short-1',
    title: 'Echoes in the Obsidian Gallery',
    genre: 'short-stories',
    level: 'advanced',
    wordCount: 310,
    summary: 'A conservator unearths enigmatic Renaissance tempera panels beneath a Florentine palazzo, deciphering optical illusions that challenge artistic dogma.',
    paragraphs: [
      "Clara leaned over the stereomicroscope in the subterranean conservation laboratory beneath the Palazzo Pitti, her scalpel hovering millimeters above a flaking fourteenth-century tempera panel. The archival provenance cataloged the painting merely as a provincial Madonna and Child, yet multispectral infrared reflectography revealed a disquieting underdrawing: an intricate cartographic projection depicting coastlines that cartographers of that era had no empirical means of knowing.",
      "As solvent vapors mingled with the petrichor of Florentine limestone, Clara carefully dissolved the overpainted resin. Beneath layers of centuries-old soot emerged pigments synthesized from pulverized lapis lazuli and rare obsidian dust. The brushwork diverged radically from the conservative Giottesque traditions of the Florentine guild; the anonymous master had deployed anamorphic perspective, an optical technique whereby geometries coalesce into coherent figures only when viewed from an acute, oblique vantage.",
      "Stepping back toward the vaulted chamber's perimeter, Clara aligned her gaze with the painting's vanishing point. The conventional devotional image transformed into an allegorical treatise warning against the hubris of empire and the transience of dynastic hegemony. She realized she was not merely documenting an aesthetic anomaly, but decoding an act of philosophical defiance preserved in mineral and egg tempera."
    ],
    vocabularyGlossary: [
      { word: 'Provenance', definition: 'The place of origin or earliest known history of something, especially art.', example: 'The museum traced the provenance of the painting back to 1540.' },
      { word: 'Reflectography', definition: 'The use of infrared light to reveal drawing layers hidden beneath painted surfaces.', example: 'Infrared reflectography revealed the artist\'s initial sketch.' },
      { word: 'Anamorphic', definition: 'Producing an image that appears distorted unless viewed from a particular angle.', example: 'The skull in Holbein\'s painting is a famous anamorphic illusion.' },
      { word: 'Transience', definition: 'The state or fact of lasting only for a short time.', example: 'The poet meditated on the transience of human glory.' }
    ],
    questions: [
      {
        id: 'q1',
        question: 'What optical technique did the anonymous master employ in the discovered underpainting?',
        type: 'multiple-choice',
        options: ['Pointillism', 'Anamorphic perspective', 'Cubist decomposition', 'Monochrome shading'],
        correctAnswer: 1,
        explanation: 'The text highlights that the master deployed anamorphic perspective, visible only from an acute oblique angle.'
      },
      {
        id: 'q2',
        question: 'When viewed from its oblique vanishing point, what did the painting allegorically convey?',
        type: 'multiple-choice',
        options: [
          'Instructions for making jewelry',
          'A warning against imperial hubris and the transience of dynastic power',
          'A simple celebration of springtime flowers',
          'A recipe for mixing tempera binders'
        ],
        correctAnswer: 1,
        explanation: 'The devotional image transformed into an allegorical treatise warning against the hubris of empire and dynastic transience.'
      }
    ]
  },

  // --- Advanced 2 ---
  {
    id: 'read-adv-short-2',
    title: 'The Solitary Cartographer of Novaya',
    genre: 'short-stories',
    level: 'advanced',
    wordCount: 305,
    summary: 'An expedition surveyor charting retreating subpolar glaciers confronts the epistemological limits of human cartography in an era of rapid planetary transformation.',
    paragraphs: [
      "For three seasons, Dr. Henrik Vane occupied the geodesic weather station perched above the glacial tongue of the Novaya Archipelago. Armed with a brass theodolite and precision LIDAR scanners, his scientific remit was straightforward: document the retreat of the terminus, an icy amphitheater that had shed four hundred meters of ancient firn in less than a decade.",
      "Yet cartography in the Anthropocene felt less like an objective taxonomy of terrain and more like penning an ephemeral eulogy. Fjords that historical Admiralty charts had designated as permanent monolithic cliffs were dissolving into turbulent sapphire estuaries overnight. Skerries and headlands, previously bound by permafrost, collapsed under the thermal erosion of warming oceanic currents.",
      "One dawn, while triangulating coordinates against the granite spires of Mount Sedov, Henrik noticed a newly exposed basalt nunatak piercing through the ice sheet. Embedded in the rock face were petrified fern leaves from the Eocene epoch—tangible proof that this frigid wasteland had once flourished as a subtropical canopy fifty million years prior. In that sublime, solitary instant, his measurements seemed both trivial and profound: he was not witnessing the death of a landscape, but an indifferent planetary cycle reasserting its timeless geological tempo."
    ],
    vocabularyGlossary: [
      { word: 'Theodolite', definition: 'A precision surveying instrument with a rotating telescope for measuring angles.', example: 'The engineer aligned the theodolite to calibrate road elevation.' },
      { word: 'Ephemeral', definition: 'Lasting for a very short time; transient.', example: 'Ephemeral puddles evaporated under the midday sun.' },
      { word: 'Nunatak', definition: 'An isolated peak of rock projecting above a surface of inland ice or snow.', example: 'The arctic expedition pitched camp beside a rocky nunatak.' },
      { word: 'Sublime', definition: 'Inspiring great admiration or awe because of immense grandeur, beauty, or power.', example: 'The thunderous waterfall presented a sublime spectacle.' }
    ],
    questions: [
      {
        id: 'q1',
        question: 'What fossilized discovery did Henrik make on the newly exposed basalt nunatak?',
        type: 'multiple-choice',
        options: ['Fossilized dinosaur teeth', 'Petrified fern leaves from the Eocene epoch', 'A forgotten medieval whaling anchor', 'A meteorite fragment'],
        correctAnswer: 1,
        explanation: 'Henrik found petrified fern leaves from the Eocene epoch embedded in the exposed rock face.'
      },
      {
        id: 'q2',
        question: 'Henrik felt that modern cartography was purely mechanical and completely unchanged by environmental shifts.',
        type: 'true-false',
        options: ['True', 'False'],
        correctAnswer: 1,
        explanation: 'False. He felt cartography in the Anthropocene felt like "penning an ephemeral eulogy" as landscapes dissolved rapidly.'
      }
    ]
  },

  // ==========================================
  // 2. DAILY CONVERSATIONS
  // ==========================================
  // --- Beginner 1 ---
  {
    id: 'read-beg-conv-1',
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

  // --- Beginner 2 ---
  {
    id: 'read-beg-conv-2',
    title: 'Ordering Lunch at the Campus Canteen',
    genre: 'daily-conversations',
    level: 'beginner',
    wordCount: 150,
    summary: 'Two college freshmen choose healthy lunch options, check food allergy labels, and split the bill.',
    paragraphs: [
      '"Excuse me, Maya, the noodle stall has a huge queue today! Shall we try the fresh salad and wrap counter instead?" asked Kevin as they entered the canteen.',
      '"That sounds delicious, Kevin! I am trying to eat more vegetables this semester. Do they offer vegetarian dressings?" Maya asked curiously.',
      '"Yes, look at the menu board. They have lemon vinaigrette and roasted sesame dressing. Both are completely dairy-free," Kevin pointed out.',
      '"Perfect! I will order a grilled tofu wrap with an iced green tea. Can we pay together with the digital student ID card?"',
      '"Sure, you can scan my card at the cashier and transfer your half to my mobile wallet later. Let\'s grab a table near the open window!"'
    ],
    vocabularyGlossary: [
      { word: 'Queue', definition: 'A line of people waiting for their turn.', example: 'We waited in a long queue at the cinema.' },
      { word: 'Vinaigrette', definition: 'A salad dressing of oil, wine vinegar, and seasoning.', example: 'She drizzled vinaigrette over the lettuce.' },
      { word: 'Dairy-free', definition: 'Containing no milk or milk products.', example: 'Almond milk is a popular dairy-free choice.' },
      { word: 'Cashier', definition: 'A person who receives and pays out money in a store.', example: 'The friendly cashier handed me my receipt.' }
    ],
    questions: [
      {
        id: 'q1',
        question: 'Why did Maya and Kevin decide to skip the noodle stall?',
        type: 'multiple-choice',
        options: ['It was closed for cleaning', 'It had a very long queue', 'The prices were too expensive', 'They forgot their money'],
        correctAnswer: 1,
        explanation: 'Kevin pointed out that the noodle stall had a huge queue today.'
      },
      {
        id: 'q2',
        question: 'How do they plan to settle the payment at the counter?',
        type: 'multiple-choice',
        options: [
          'Wash dishes for the canteen',
          'Pay in cash with dollar bills',
          'Scan Kevin\'s student card together and transfer her half via mobile wallet',
          'Wait for a discount coupon'
        ],
        correctAnswer: 2,
        explanation: 'Kevin offers to pay with his student card and Maya will transfer her share to his mobile wallet.'
      }
    ]
  },

  // --- Intermediate 1 ---
  {
    id: 'read-int-conv-1',
    title: 'Negotiating a Group Project Extension',
    genre: 'daily-conversations',
    level: 'intermediate',
    wordCount: 220,
    summary: 'Team members resolve scheduling friction and draft a polite email to their lecturer requesting extra research time.',
    paragraphs: [
      '"Team, we have a serious bottleneck with our market research slide deck," opened Amanda during their Tuesday afternoon video call. "The survey data only arrived this morning, and our presentation is scheduled for Friday at 9 AM."',
      '"I agree, Amanda," chimed in Farhan. "Rushing the statistical breakdown in forty-eight hours will compromise the quality of our regression analysis. Professor Evans explicitly requested primary evidence."',
      '"Could we potentially request a forty-eight-hour extension until Sunday midnight?" suggested Clara. "If we submit the preliminary literature review on Friday to prove our progress, it demonstrates good faith."',
      '"That is a professional compromise," Amanda affirmed. "Farhan, could you draft a concise email to Professor Evans highlighting our completed milestones and detailing why extra time will strengthen our final insights?"',
      '"On it right away. I will share the draft in our team group chat in twenty minutes so everyone can review it before sending."'
    ],
    vocabularyGlossary: [
      { word: 'Bottleneck', definition: 'A point of congestion or blockage that slows down a process.', example: 'Supply chain delays caused a major production bottleneck.' },
      { word: 'Compromise', definition: 'An agreement reached by each side making concessions, or to weaken standard.', example: 'We must not compromise our safety standards.' },
      { word: 'Preliminary', definition: 'Preceding or done in preparation for something fuller or more important.', example: 'Preliminary results show significant revenue growth.' },
      { word: 'Milestone', definition: 'A significant stage or event in the development of something.', example: 'Reaching 10,000 users was a huge milestone for our startup.' }
    ],
    questions: [
      {
        id: 'q1',
        question: 'What caused the project delay for Amanda and Farhan\'s team?',
        type: 'multiple-choice',
        options: [
          'They lost their laptop chargers',
          'The primary survey data only arrived that morning',
          'Professor Evans cancelled the class',
          'Nobody wanted to work on the project'
        ],
        correctAnswer: 1,
        explanation: 'Amanda explains that the survey data only arrived that morning, leaving too little time for regression analysis.'
      },
      {
        id: 'q2',
        question: 'How do they plan to prove their good faith when asking for an extension?',
        type: 'multiple-choice',
        options: [
          'By offering to buy coffee for the lecturer',
          'By submitting their preliminary literature review on Friday',
          'By skipping the presentation entirely',
          'By blaming external survey participants'
        ],
        correctAnswer: 1,
        explanation: 'Clara suggests submitting their preliminary literature review on Friday to prove active progress.'
      }
    ]
  },

  // --- Intermediate 2 ---
  {
    id: 'read-int-conv-2',
    title: 'Booking a Sustainable Homestay in Bali',
    genre: 'daily-conversations',
    level: 'intermediate',
    wordCount: 215,
    summary: 'A conscious traveler inquires about solar energy, composting, and cultural cooking workshops with a local host.',
    paragraphs: [
      '"Om Swastiastu, Wayan! My partner and I are finalizing our itinerary for Ubud next month, and your bamboo eco-villa caught our attention," said Julian over the booking platform\'s call.',
      '"Om Swastiastu, Julian! Thank you for reaching out. Our family manages three traditional pavilions nestled right inside organic permaculture gardens," replied Wayan warmly.',
      '"That sounds heavenly. We are trying to minimize our carbon footprint. Could you tell us how your property handles electricity and drinking water?" Julian asked.',
      '"Certainly. Our entire lighting grid is powered by rooftop solar photovoltaic panels with battery storage. For water, we provide complimentary filtered rainwater stations so guests never need single-use plastic bottles."',
      '"Fantastic! And do you still organize morning village walks and traditional Balinese spice cooking classes?"',
      '"Every Wednesday and Saturday! My mother leads the market visit at 6:30 AM to select fresh lemongrass, turmeric, and galangal. We would love to have you join us."'
    ],
    vocabularyGlossary: [
      { word: 'Permaculture', definition: 'The development of agricultural ecosystems intended to be sustainable and self-sufficient.', example: 'Their permaculture farm produces organic herbs year-round.' },
      { word: 'Photovoltaic', definition: 'Relating to the production of electric current at the junction of two substances exposed to light.', example: 'Photovoltaic cells convert sunlight directly into clean energy.' },
      { word: 'Footprint', definition: 'The impact or measure of resources used by a person or activity.', example: 'Public transit helps reduce your individual carbon footprint.' },
      { word: 'Complimentary', definition: 'Given or supplied free of charge.', example: 'The hotel provides complimentary herbal tea in the lounge.' }
    ],
    questions: [
      {
        id: 'q1',
        question: 'How does Wayan\'s homestay eliminate the need for single-use plastic water bottles?',
        type: 'multiple-choice',
        options: [
          'They require guests to drink coconut water only',
          'They provide complimentary filtered rainwater stations',
          'They sell expensive glass bottles at the reception',
          'They do not provide drinking water'
        ],
        correctAnswer: 1,
        explanation: 'Wayan explains that they offer complimentary filtered rainwater stations for guest refilling.'
      },
      {
        id: 'q2',
        question: 'The traditional cooking workshop includes a morning visit to the local market.',
        type: 'true-false',
        options: ['True', 'False'],
        correctAnswer: 0,
        explanation: 'True. Wayan mentions that his mother leads a market visit at 6:30 AM to choose fresh spices.'
      }
    ]
  },

  // --- Advanced 1 ---
  {
    id: 'read-adv-conv-1',
    title: 'Cross-Functional Strategy Alignment: Tech Debt vs Feature Velocity',
    genre: 'daily-conversations',
    level: 'advanced',
    wordCount: 300,
    summary: 'A VP of Engineering and Head of Product debate architectural refactoring, customer churn, and roadmap pacing during quarterly planning.',
    paragraphs: [
      '"Marcus, I understand enterprise clients are clamoring for the automated compliance module before Q3 closes," argued Priya, VP of Engineering, leaning forward in the executive conference room. "However, our core microservices latency has degraded by thirty-five percent since the last database sharding rollout. If we do not allocate twenty percent of engineering bandwidth to architectural refactoring, our mean-time-to-recovery will spike catastrophically."',
      '"I empathize with the architectural fragility, Priya," replied Marcus, Head of Product, reviewing the revenue forecast dashboard. "Yet our three largest financial enterprise prospects have conditioned their multi-million dollar annual renewals on SOC-2 compliance automation. If we defer that deliverable to Q4, our quarterly net revenue retention will contract, endangering our Series C valuation benchmarks."',
      '"Technical debt is compounding interest, Marcus," Priya countered firmly. "A scheduled maintenance sprint is not an engineering luxury; it is systemic risk mitigation. What if we adopt a phased compromise: decouple the compliance engine via serverless event hooks, allowing your team to demonstrate beta compliance milestones, while we encapsulate the legacy relational database behind modern caching proxies?"',
      '"That decouples the critical path without stalling go-to-market execution," Marcus conceded after reviewing the architecture sketch. "Let us formulate this hybrid roadmap for tomorrow\'s board executive briefing."'
    ],
    vocabularyGlossary: [
      { word: 'Refactoring', definition: 'Restructuring existing computer code without changing its external behavior.', example: 'Refactoring the backend improved query latency significantly.' },
      { word: 'Fragility', definition: 'The quality of being easily broken, damaged, or vulnerable to unexpected shocks.', example: 'Financial fragility often leads to rapid liquidity crises.' },
      { word: 'Mitigation', definition: 'The action of reducing the severity, seriousness, or painfulness of something.', example: 'Building sea walls is a vital flood mitigation strategy.' },
      { word: 'Decouple', definition: 'To separate, disengage, or dissociate elements from one another.', example: 'Decoupling frontend components speeds up deployment cycles.' }
    ],
    questions: [
      {
        id: 'q1',
        question: 'What metric did Priya cite to prove that architectural refactoring was urgently needed?',
        type: 'multiple-choice',
        options: [
          'Engineering salaries had doubled',
          'Core microservices latency had degraded by thirty-five percent',
          'The office internet was down for two days',
          'Competitors had launched cheaper subscriptions'
        ],
        correctAnswer: 1,
        explanation: 'Priya highlighted that core microservices latency had degraded by thirty-five percent since the database rollout.'
      },
      {
        id: 'q2',
        question: 'What hybrid compromise did Priya propose to satisfy both product deadlines and engineering reliability?',
        type: 'multiple-choice',
        options: [
          'Cancel the product entirely and fire all contractors',
          'Decouple compliance via serverless event hooks while caching the legacy database',
          'Postpone all engineering work until next year',
          'Outsource the entire software architecture to a foreign consultancy'
        ],
        correctAnswer: 1,
        explanation: 'Priya proposed decoupling the compliance engine with serverless hooks while caching the legacy database.'
      }
    ]
  },

  // --- Advanced 2 ---
  {
    id: 'read-adv-conv-2',
    title: 'Executive Debrief on Crisis Communication & Data Privacy',
    genre: 'daily-conversations',
    level: 'advanced',
    wordCount: 295,
    summary: 'General Counsel and Chief Communications Officer strategize public disclosures, regulatory notifications, and customer reassurance following a third-party vendor breach.',
    paragraphs: [
      '"Elena, the forensics audit confirmed that the unauthorized intrusion occurred through an unpatched API gateway in our third-party billing aggregator," briefed David, Chief Information Security Officer, closing the secure briefing tablet.',
      '"Under GDPR Article 33 and California consumer protection mandates, our regulatory notification window closes in less than twenty-four hours," stated General Counsel Cynthia Chen calmly. "Our immediate disclosure must balance legal compliance with meticulous factual accuracy. Speculative commentary will expose the firm to derivative shareholder litigation."',
      '"I understand the legal circumspection, Cynthia," replied Elena, Chief Communications Officer. "However, silence in the digital public square creates an information vacuum rapidly colonized by panic and misinformation on social media. If journalists uncover this breach through independent security researchers before our official statement, our brand credibility will suffer irreparable attrition."',
      '"We will issue a proactive, transparent disclosure accompanied by concrete remedial measures," Cynthia agreed. "The press release will explicitly state the perimeter of the incident, confirm that zero plaintext authentication credentials were compromised, and announce complimentary identity monitoring services for all affected customer accounts. David, verify every factual assertion in this draft before we notify regulatory authorities."'
    ],
    vocabularyGlossary: [
      { word: 'Intrusion', definition: 'The act of wrongfully entering or gaining unauthorized access to a system.', example: 'The firewall detected an unauthorized network intrusion.' },
      { word: 'Circumspection', definition: 'Wary and unwilling to take risks; prudence and caution.', example: 'Diplomats navigated the negotiations with utmost circumspection.' },
      { word: 'Attrition', definition: 'The gradual reduction or erosion of strength, value, or numbers.', example: 'Customer attrition rose following the service outage.' },
      { word: 'Remedial', definition: 'Intended as a remedy or to correct a deficiency.', example: 'The company initiated remedial cybersecurity training for all staff.' }
    ],
    questions: [
      {
        id: 'q1',
        question: 'Where did the forensic audit discover that the security breach originated?',
        type: 'multiple-choice',
        options: [
          'An unpatched API gateway in a third-party billing aggregator',
          'A lost company laptop at an international airport',
          'A rogue internal software engineer selling passwords',
          'An outdated email server in the basement'
        ],
        correctAnswer: 0,
        explanation: 'The CISO reported that the intrusion occurred via an unpatched API gateway in a third-party billing aggregator.'
      },
      {
        id: 'q2',
        question: 'Why was Elena, the Chief Communications Officer, concerned about remaining silent?',
        type: 'multiple-choice',
        options: [
          'She wanted to sell advertisement space in newspapers',
          'Silence would create an information vacuum filled with panic and destroy brand credibility',
          'She wanted to win a public relations award',
          'The regulatory authorities forbid issuing statements'
        ],
        correctAnswer: 1,
        explanation: 'Elena emphasized that silence creates a vacuum colonized by panic and misinformation, causing severe brand attrition.'
      }
    ]
  },

  // ==========================================
  // 3. NEWS & ARTICLES
  // ==========================================
  // --- Beginner 1 ---
  {
    id: 'read-beg-news-1',
    title: 'City Council Opens First Public Rooftop Farm',
    genre: 'news-articles',
    level: 'beginner',
    wordCount: 155,
    summary: 'A major urban city turns an abandoned concrete rooftop into a vibrant community garden for local families.',
    paragraphs: [
      "Yesterday morning, the city mayor officially cut the ribbon to open the Green Sky Farm, a large public garden located on top of the old central library building.",
      "The rooftop garden features over sixty wooden planter boxes filled with organic tomatoes, crisp lettuce, mint, and sweet strawberries. Families living in surrounding apartments can reserve a planting box for free.",
      "'Many children in our neighborhood have never seen vegetables growing from seeds before,' explained Maria Santos, the chief project volunteer. 'This garden teaches young students about healthy food, fresh air, and teamwork.'",
      "The city plans to build five more rooftop community gardens next spring across schools and civic centers to create greener, cooler spaces in dense urban areas."
    ],
    vocabularyGlossary: [
      { word: 'Ribbon', definition: 'A long, narrow strip of fabric used for decoration or ceremonial opening.', example: 'The governor cut the golden ribbon at the new hospital.' },
      { word: 'Organic', definition: 'Produced without the use of chemical fertilizers or pesticides.', example: 'She prefers to buy organic apples at the farmers market.' },
      { word: 'Surrounding', definition: 'Lying or being all around something; encircling.', example: 'The castle overlooks the surrounding forest.' },
      { word: 'Civic', definition: 'Relating to a city, town, or the duties of citizenship.', example: 'The town built a modern civic center for public meetings.' }
    ],
    questions: [
      {
        id: 'q1',
        question: 'Where was the Green Sky Farm rooftop garden established?',
        type: 'multiple-choice',
        options: ['On top of a shopping mall', 'On the roof of the old central library building', 'At an international airport', 'Inside a botanical greenhouse'],
        correctAnswer: 1,
        explanation: 'The article states that the garden is located on top of the old central library building.'
      },
      {
        id: 'q2',
        question: 'Local families must pay an expensive monthly fee to use the planter boxes.',
        type: 'true-false',
        options: ['True', 'False'],
        correctAnswer: 1,
        explanation: 'False. The article notes that families living in surrounding apartments can reserve a planting box for free.'
      }
    ]
  },

  // --- Beginner 2 ---
  {
    id: 'read-beg-news-2',
    title: 'High Schoolers Build Solar-Powered Book Tricycles',
    genre: 'news-articles',
    level: 'beginner',
    wordCount: 150,
    summary: 'Teenage engineering volunteers invent mobile libraries on electric bikes to share storybooks with rural villages.',
    paragraphs: [
      "In a small coastal town, six enthusiastic high school students designed a creative solution to bring books to children who live far away from public libraries.",
      "The students converted two heavy cargo tricycles into solar-powered mobile reading stations. Each vehicle carries over one hundred storybooks, audio headphones, and folding wooden stools.",
      "Small solar panels mounted on the tricycle roofs generate clean electricity to recharge digital tablets and power evening reading lamps.",
      "Every Saturday, the team pedals out to three remote mountain villages. 'Seeing the children's eyes light up when we arrive with new books is the best reward,' said student leader Kenji."
    ],
    vocabularyGlossary: [
      { word: 'Tricycle', definition: 'A vehicle similar to a bicycle, but having three wheels.', example: 'The mail carrier rode a cargo tricycle.' },
      { word: 'Cargo', definition: 'Goods or materials carried on a vehicle or ship.', example: 'The cargo van carried boxes of fresh fruit.' },
      { word: 'Remote', definition: 'Situated far from the main centers of population; distant.', example: 'They lived in a remote village high in the mountains.' },
      { word: 'Generate', definition: 'To produce or create energy or electricity.', example: 'Wind turbines generate renewable power.' }
    ],
    questions: [
      {
        id: 'q1',
        question: 'What do the solar panels on the tricycles provide power for?',
        type: 'multiple-choice',
        options: ['Microwave ovens', 'Recharging digital tablets and powering evening reading lamps', 'Racing at high speeds on the highway', 'Operating an ice cream maker'],
        correctAnswer: 1,
        explanation: 'The panels generate electricity to recharge digital tablets and power reading lamps.'
      },
      {
        id: 'q2',
        question: 'How often do the students ride the book tricycles to remote villages?',
        type: 'multiple-choice',
        options: ['Once every year', 'Every Saturday', 'Only on rainy days', 'Every Monday midnight'],
        correctAnswer: 1,
        explanation: 'The text mentions: "Every Saturday, the team pedals out to three remote mountain villages."'
      }
    ]
  },

  // --- Intermediate 1 ---
  {
    id: 'read-int-news-1',
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

  // --- Intermediate 2 ---
  {
    id: 'read-int-news-2',
    title: 'Urban Rewilding: European Metropolises Welcome Native Forests',
    genre: 'news-articles',
    level: 'intermediate',
    wordCount: 240,
    summary: 'Cities from Paris to Milan transform vacant concrete thoroughfares into micro-forests to mitigate urban heat islands and restore biodiversity.',
    paragraphs: [
      "In an audacious bid to combat blistering summer heatwaves, urban planners across major European capitals are tearing up asphalt parking lots and obsolete transit loops to plant densely vegetated 'pocket forests' inspired by the Miyawaki botanical method.",
      "Unlike manicured public parks dominated by thirsty lawns, Miyawaki forests interplant dozens of indigenous tree and shrub species in tight spatial clusters. By simulating the natural evolutionary competition of ancient woodlands, these urban ecosystems grow up to ten times faster and achieve thirty times greater density than conventional parkland.",
      "The ecological dividends are immediate. Ambient street temperatures around newly planted zones drop by as much as three to four degrees Celsius during peak heatwaves, shielding vulnerable senior citizens from heat stress. Concurrently, native songbirds, wild pollinators, and beneficial microorganisms return to districts that were previously ecological deserts.",
      "Civic leaders emphasize that rewilding is not an aesthetic indulgence, but indispensable urban infrastructure to ensure city centers remain livable amid accelerating climate challenges."
    ],
    vocabularyGlossary: [
      { word: 'Rewilding', definition: 'Restoring an area of land to its natural uncultivated state.', example: 'Urban rewilding brings wildlife back into metropolitan centers.' },
      { word: 'Audacious', definition: 'Showing a willingness to take surprisingly bold risks.', example: 'The architect unveiled an audacious design for the floating bridge.' },
      { word: 'Indigenous', definition: 'Originating or occurring naturally in a particular place; native.', example: 'They replanted indigenous oak and birch trees along the canal.' },
      { word: 'Indispensable', definition: 'Absolutely necessary; impossible to do without.', example: 'Clean drinking water is indispensable for human survival.' }
    ],
    questions: [
      {
        id: 'q1',
        question: 'What botanical methodology allows urban pocket forests to grow up to ten times faster than normal parks?',
        type: 'multiple-choice',
        options: ['Artificial genetic modification', 'The Miyawaki method using dense indigenous interplanting', 'Heavy chemical fertilizers', 'Automated glass greenhouse enclosures'],
        correctAnswer: 1,
        explanation: 'Pocket forests inspired by the Miyawaki botanical method interplant indigenous species in dense clusters.'
      },
      {
        id: 'q2',
        question: 'Ambient temperatures around urban pocket forests can drop by up to 3 to 4 degrees Celsius during summer heatwaves.',
        type: 'true-false',
        options: ['True', 'False'],
        correctAnswer: 0,
        explanation: 'True. The article explicitly notes ambient temperatures drop by as much as 3 to 4 degrees Celsius.'
      }
    ]
  },

  // --- Advanced 1 (User's screenshot target!) ---
  {
    id: 'read-adv-news-1',
    title: 'The Geopolitics of Sub-Nanometer Semiconductor Sovereignty',
    genre: 'news-articles',
    level: 'advanced',
    wordCount: 315,
    summary: 'How extreme ultraviolet lithography, strategic silicon cartels, and state-subsidized foundries are reshaping 21st-century multilateral statecraft.',
    paragraphs: [
      "In the contemporary geopolitical landscape, the epicenter of sovereign leverage has shifted irrevocably from hydrocarbon reserves to atomic-scale silicon fabrication. Advanced logic semiconductors—microchips engineered at transistor gates measuring less than three nanometers—constitute the non-negotiable substrate of artificial general intelligence, aerospace defense telemetry, and quantum cryptanalysis.",
      "Yet the planetary supply chain underpinning this critical infrastructure exhibits acute, systemic fragility. The global commercial production of sub-three-nanometer dies is monopolized by a vanishingly small nexus of advanced foundries in East Asia, which in turn depend entirely upon precision extreme ultraviolet (EUV) lithography systems manufactured by a singular Dutch industrial monopoly.",
      "Recognizing this existential chokepoint, major economic blocs have enacted aggressive industrial subsidization legislation, deploying hundreds of billions of dollars to onshore semiconductor fabs within their sovereign territorial boundaries. However, industry technologists warn that capital liquidity alone cannot synthesize decades of tacit metallurgical engineering wisdom, proprietary chemical purity benchmarks, and specialized supplier ecosystems overnight.",
      "Consequently, technology diplomacy now dictates foreign policy agendas. Multilateral coalitions increasingly wield export controls and lithography equipment bans as instruments of economic containment, effectively weaponizing the technological stack in an era of techno-nationalist rivalry."
    ],
    vocabularyGlossary: [
      { word: 'Substrate', definition: 'An underlying substance or layer; the fundamental base upon which everything operates.', example: 'High-speed internet is the digital substrate of the modern economy.' },
      { word: 'Nexus', definition: 'A connection or central link in a complex system or network.', example: 'The financial district serves as the nexus of regional commerce.' },
      { word: 'Chokepoint', definition: 'A narrow or critical passage through which traffic or resources must pass, creating vulnerability.', example: 'The canal is an indispensable maritime trade chokepoint.' },
      { word: 'Weaponize', definition: 'To exploit something as a tool or weapon of aggression or leverage.', example: 'Financial sanctions were weaponized during the diplomatic conflict.' }
    ],
    questions: [
      {
        id: 'q1',
        question: 'Why is the global semiconductor fabrication supply chain considered uniquely vulnerable?',
        type: 'multiple-choice',
        options: [
          'Silicon sand is becoming extinct on beaches',
          'Production relies on a narrow nexus of foundries and a single European supplier of EUV lithography',
          'Computers no longer require microchips',
          'Foundries operate exclusively in space satellites'
        ],
        correctAnswer: 1,
        explanation: 'The text highlights that sub-3nm fabrication is concentrated in East Asia and relies on a singular Dutch EUV monopoly.'
      },
      {
        id: 'q2',
        question: 'Government financial subsidies alone can instantly recreate decades of complex specialized semiconductor engineering ecosystems.',
        type: 'true-false',
        options: ['True', 'False'],
        correctAnswer: 1,
        explanation: 'False. The article notes that capital liquidity cannot synthesize decades of tacit engineering wisdom and supplier networks overnight.'
      }
    ]
  },

  // --- Advanced 2 (User's screenshot target!) ---
  {
    id: 'read-adv-news-2',
    title: 'Autonomous Freight Corridors and the Remaking of Global Logistics',
    genre: 'news-articles',
    level: 'advanced',
    wordCount: 310,
    summary: 'Autonomous electric trucking platoons, digital dry ports, and sensor-fused transshipment hubs revolutionize intermodal supply chains.',
    paragraphs: [
      "Along an eight-hundred-kilometer expanse of Interstate highway cutting through the American Southwest, heavy commercial freight is undergoing an unprecedented operational paradigm shift. Autonomous Class 8 semi-trucks, governed by multimodal sensor suites incorporating lidar, radar, and edge-inference neural networks, now navigate commercial corridors without human operators in the driver's cab.",
      "By utilizing vehicle-to-vehicle telemetry, these robotic haulers travel in aerodynamically synchronized 'platoons,' trailing one another at millimeter-precise intervals to slash aerodynamic drag and reduce energy consumption by up to twenty percent. Coupled with megawatt-scale megachargers at strategic inland dry ports, freight carriers are achieving twenty-four-hour continuous operations previously unachievable under federal driver fatigue regulations.",
      "Nonetheless, labor economists and transportation safety regulators express profound apprehensions. While fleet operators celebrate dramatic operating margin expansions and projected reductions in highway collision fatalities, hundreds of thousands of long-haul truck drivers face the imminent obsolescence of their professional vocation.",
      "The socio-economic challenge of the coming decade will therefore hinge not on the technical viability of autonomous freight, but on whether legislative frameworks can orchestrate equitable transition pathways, retraining displaced workforces before automation permanently alters the blue-collar landscape."
    ],
    vocabularyGlossary: [
      { word: 'Paradigm', definition: 'A distinct set of concepts, thought patterns, or standard framework.', example: 'Quantum mechanics established a new scientific paradigm.' },
      { word: 'Telemetry', definition: 'Automated data recording and wireless transmission from remote apparatus.', example: 'Vehicle telemetry monitored tire pressure and battery temperature in real time.' },
      { word: 'Obsolescence', definition: 'The condition of being no longer used, useful, or current.', example: 'Typewriters fell into obsolescence with the invention of computers.' },
      { word: 'Equitable', definition: 'Fair, just, and impartial to all parties.', example: 'The commission worked to negotiate an equitable distribution of resources.' }
    ],
    questions: [
      {
        id: 'q1',
        question: 'How do synchronized autonomous truck platoons achieve up to a twenty percent reduction in energy consumption?',
        type: 'multiple-choice',
        options: [
          'By turning off their engines while going downhill',
          'By driving in millimeter-precise proximity to slash aerodynamic drag',
          'By carrying lighter cardboard cargo',
          'By using solar-powered sails on highway stretches'
        ],
        correctAnswer: 1,
        explanation: 'They travel in aerodynamically synchronized platoons at precise intervals to slash aerodynamic drag.'
      },
      {
        id: 'q2',
        question: 'What primary socio-economic challenge does the article highlight regarding autonomous trucking?',
        type: 'multiple-choice',
        options: [
          'The difficulty of manufacturing tires',
          'The potential displacement of hundreds of thousands of long-haul commercial drivers',
          'The lack of roads in major countries',
          'The refusal of consumers to buy online goods'
        ],
        correctAnswer: 1,
        explanation: 'The article warns that hundreds of thousands of drivers face professional displacement unless equitable retraining is organized.'
      }
    ]
  },

  // ==========================================
  // 4. EDUCATIONAL
  // ==========================================
  // --- Beginner 1 ---
  {
    id: 'read-beg-edu-1',
    title: 'Why Do Honeybees Dance in Their Hives?',
    genre: 'educational',
    level: 'beginner',
    wordCount: 155,
    summary: 'Learn about the fascinating waggle dance honeybees perform to show their family where to find sweet flower nectar.',
    paragraphs: [
      "Honeybees are among the smartest social insects in the animal kingdom. When a scout bee finds a colorful field of blooming flowers, she does not keep the location a secret.",
      "Instead, she flies directly back to the dark hive and performs a special movement on the honeycomb known as the 'waggle dance.'",
      "By moving in a figure-eight pattern and shaking her abdomen, the scout bee communicates two crucial facts: the exact angle toward the flowers relative to the sun, and how far away they are based on how long she waggles.",
      "Within minutes, dozens of hive sisters understand the directions perfectly and fly straight to the blossoming garden to gather sweet nectar and pollen."
    ],
    vocabularyGlossary: [
      { word: 'Scout', definition: 'A member sent ahead to gather information or search for resources.', example: 'The scout bee flew across the meadow to find clover.' },
      { word: 'Abdomen', definition: 'The rear part of an insect\'s body that contains digestive and reproductive organs.', example: 'The bee waggled its striped abdomen rapidly.' },
      { word: 'Relative to', definition: 'Considered in relation or proportion to something else.', example: 'The boat steered north relative to the coastline.' },
      { word: 'Nectar', definition: 'A sweet sugary liquid produced by flowers to attract pollinators.', example: 'Butterflies sip sweet nectar through their proboscis.' }
    ],
    questions: [
      {
        id: 'q1',
        question: 'What information does a scout bee convey through the waggle dance?',
        type: 'multiple-choice',
        options: [
          'The name of the beekeeper',
          'The exact direction relative to the sun and the distance to the flower nectar',
          'The price of honey at the supermarket',
          'The temperature of the river water'
        ],
        correctAnswer: 1,
        explanation: 'The waggle dance indicates the angle toward the flowers relative to the sun and their distance.'
      },
      {
        id: 'q2',
        question: 'Honeybees perform the waggle dance exclusively in bright sunlight outside the hive.',
        type: 'true-false',
        options: ['True', 'False'],
        correctAnswer: 1,
        explanation: 'False. The text states she flies back to the dark hive and dances on the honeycomb.'
      }
    ]
  },

  // --- Beginner 2 ---
  {
    id: 'read-beg-edu-2',
    title: 'How Clouds Make Rain: The Water Cycle',
    genre: 'educational',
    level: 'beginner',
    wordCount: 150,
    summary: 'A simple, engaging explanation of evaporation, condensation, and precipitation in our planet\'s atmosphere.',
    paragraphs: [
      "Have you ever looked up at fluffy white clouds and wondered where all that water comes from? Every drop of rain falling today was once part of a river, lake, or ocean.",
      "When the warm sun shines down on water surfaces, it warms the liquid and turns it into an invisible gas called water vapor. This process is called evaporation.",
      "As warm water vapor floats high into the colder upper atmosphere, it cools down and clumps together onto tiny dust particles to create water droplets. This is condensation, which forms visible clouds.",
      "When billions of droplets combine, they become too heavy for the wind to support. Gravity pulls them back down to the earth as refreshing rain, replenishing our drinking water and helping plants grow."
    ],
    vocabularyGlossary: [
      { word: 'Vapor', definition: 'A substance diffused or suspended in the air, especially one normally liquid.', example: 'Steam is the visible vapor of boiling water.' },
      { word: 'Condensation', definition: 'The conversion of a vapor or gas to a liquid.', example: 'Cold lemonade glasses gather water droplets through condensation.' },
      { word: 'Gravity', definition: 'The force that attracts a body toward the center of the earth.', example: 'Gravity causes dropped objects to fall to the floor.' },
      { word: 'Replenish', definition: 'To fill something up again; restore to a former level.', example: 'Spring rains replenish dry underground wells.' }
    ],
    questions: [
      {
        id: 'q1',
        question: 'What is the scientific term for liquid water turning into invisible gas when heated by the sun?',
        type: 'multiple-choice',
        options: ['Solidification', 'Evaporation', 'Freezing', 'Sublimation'],
        correctAnswer: 1,
        explanation: 'The warming of water into an invisible gas by sunlight is called evaporation.'
      },
      {
        id: 'q2',
        question: 'Rain occurs when cloud droplets become too heavy for the air currents to hold.',
        type: 'true-false',
        options: ['True', 'False'],
        correctAnswer: 0,
        explanation: 'True. When billions of droplets combine and become too heavy, gravity pulls them down as rain.'
      }
    ]
  },

  // --- Intermediate 1 ---
  {
    id: 'read-int-edu-1',
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
      }
    ]
  },

  // --- Intermediate 2 ---
  {
    id: 'read-int-edu-2',
    title: 'The Circadian Rhythm: Why Morning Sunlight Awakens the Brain',
    genre: 'educational',
    level: 'intermediate',
    wordCount: 230,
    summary: 'How specialized ocular photoreceptors and the suprachiasmatic nucleus synchronize human hormones with planetary day-night cycles.',
    paragraphs: [
      "Every single cell in the human body operates on an internal twenty-four-hour biological schedule known as the circadian rhythm. This biochemical chronometer regulates everything from body temperature and digestion to immune response and deep sleep architecture.",
      "The master pacemaker governing this synchronization is a tiny cluster of neurons located inside the hypothalamus, named the suprachiasmatic nucleus (SCN). The SCN relies on environmental time-givers, primarily natural daylight, to set its internal clock.",
      "When early morning sunlight enters the eye, specialized intrinsically photosensitive retinal ganglion cells detect blue-spectrum photons. Even through closed eyelids, these sensors signal the SCN to trigger a healthy morning surge of cortisol, elevating alertness and heart rate, while concurrently halting the production of melatonin, the hormone of darkness.",
      "Conversely, excessive exposure to artificial digital screens late at night fools the SCN into believing it is still midday. This suppresses melatonin, degrades restorative slow-wave sleep, and impairs next-day memory consolidation."
    ],
    vocabularyGlossary: [
      { word: 'Circadian', definition: 'Recurring naturally on a twenty-four-hour cycle, even in the absence of light.', example: 'Jet lag disrupts your body\'s natural circadian clock.' },
      { word: 'Hypothalamus', definition: 'A region of the forebrain that coordinates both the autonomic nervous system and pituitary gland.', example: 'The hypothalamus regulates hunger and body temperature.' },
      { word: 'Melatonin', definition: 'A hormone secreted by the pineal gland that inhibits melanin formation and facilitates sleep.', example: 'Melatonin levels naturally rise after sunset.' },
      { word: 'Suppress', definition: 'To forcibly put an end to or inhibit the development of something.', example: 'Caffeine can temporarily suppress feelings of fatigue.' }
    ],
    questions: [
      {
        id: 'q1',
        question: 'What is the name of the master biological pacemaker in the human brain that coordinates the circadian rhythm?',
        type: 'multiple-choice',
        options: ['The spinal cord', 'The suprachiasmatic nucleus (SCN)', 'The auditory canal', 'The thyroid gland'],
        correctAnswer: 1,
        explanation: 'The master pacemaker governing circadian rhythm is the suprachiasmatic nucleus (SCN) in the hypothalamus.'
      },
      {
        id: 'q2',
        question: 'Blue light from morning sunlight triggers the release of melatonin to help people sleep.',
        type: 'true-false',
        options: ['True', 'False'],
        correctAnswer: 1,
        explanation: 'False. Morning light stimulates cortisol for alertness and suppresses melatonin production.'
      }
    ]
  },

  // --- Advanced 1 ---
  {
    id: 'read-adv-edu-1',
    title: 'CRISPR Epigenetic Editing: Beyond Genetic Scissors',
    genre: 'educational',
    level: 'advanced',
    wordCount: 320,
    summary: 'How catalytic dead Cas9 (dCas9) and transcriptional effector domains enable targeted gene modulation without double-stranded DNA breaks.',
    paragraphs: [
      "When the canonical CRISPR-Cas9 genome editing platform was first characterized, it was popularized under the ubiquitous metaphor of molecular scissors. By utilizing a synthetic guide RNA to direct the Cas9 endonuclease to a precise genomic locus, the enzyme introduced a double-stranded DNA break (DSB). The cell's endogenous, error-prone repair pathways would then resolve the lesion, frequently inducing insertions or deletions that knocked out the targeted gene.",
      "However, double-stranded breaks entail substantial risks: chromosomal translocations, unintended off-target cleavages, and the activation of tumor-suppressor p53 DNA damage responses. To circumvent these genotoxic hazards, synthetic biologists engineered 'catalytically dead' Cas9 (dCas9). By mutating the RuvC and HNH catalytic nuclease domains, dCas9 retains its exquisite RNA-guided targeting precision while entirely losing the ability to cleave the phosphodiester backbone.",
      "Instead of severing DNA, dCas9 acts as a programmable molecular scaffold. Researchers fuse dCas9 to diverse transcriptional and epigenetic effectors: methyltransferases, histone deacetylases, or synthetic transcription factors. This approach, termed epigenome editing, allows scientists to reversibly silence pathogenic oncogenes or activate dormant therapeutic genes through chromatin remodeling, entirely circumventing the irreversible alterations of structural DNA modification."
    ],
    vocabularyGlossary: [
      { word: 'Endonuclease', definition: 'An enzyme that cleaves a polynucleotide chain by separating nucleotides other than the two end ones.', example: 'Cas9 is an RNA-guided endonuclease.' },
      { word: 'Genotoxic', definition: 'Damaging to the genetic information within a cell causing mutations, which may lead to cancer.', example: 'Certain industrial chemicals pose severe genotoxic risks.' },
      { word: 'Scaffold', definition: 'A supporting framework or structure upon which other components assemble.', example: 'The protein acted as a molecular scaffold for receptor binding.' },
      { word: 'Chromatin', definition: 'The material of which the chromosomes of organisms other than bacteria are composed.', example: 'Chromatin remodeling regulates access to genomic information.' }
    ],
    questions: [
      {
        id: 'q1',
        question: 'How does catalytically dead Cas9 (dCas9) differ fundamentally from canonical wild-type Cas9?',
        type: 'multiple-choice',
        options: [
          'It can only target bacterial DNA',
          'It retains precise RNA targeting but cannot sever the DNA phosphodiester backbone',
          'It requires nuclear radiation to function',
          'It cuts RNA instead of DNA'
        ],
        correctAnswer: 1,
        explanation: 'dCas9 has mutated catalytic nuclease domains, preserving precise targeting without causing double-stranded DNA breaks.'
      },
      {
        id: 'q2',
        question: 'Epigenome editing permanently alters structural DNA nucleotide sequences.',
        type: 'true-false',
        options: ['True', 'False'],
        correctAnswer: 1,
        explanation: 'False. Epigenome editing reversibly modulates gene expression via chromatin remodeling without altering DNA nucleotide sequences.'
      }
    ]
  },

  // --- Advanced 2 ---
  {
    id: 'read-adv-edu-2',
    title: 'Thermodynamic Entropy and the Information Theory Paradox',
    genre: 'educational',
    level: 'advanced',
    wordCount: 310,
    summary: 'Bridging statistical mechanics, Maxwell\'s thought experiment, and Landauer\'s principle to establish the physical nature of digital computation.',
    paragraphs: [
      "In the classical formulation of nineteenth-century thermodynamics, entropy was conceived by Rudolf Clausius as a macroscopic measure of unavailable thermal energy within a closed system. With Ludwig Boltzmann's statistical mechanics, entropy was radically reinterpreted as a logarithmic quantification of microscopic permutations: the number of distinct microstates corresponding to an overarching macrostate.",
      "The intersection of thermodynamics and information theory was immortalized in 1867 by James Clerk Maxwell's famous thought experiment. Maxwell conceived an imaginary microscopic entity—a 'demon'—standing guard at a partition between two gas chambers. By observing molecular velocities and selectively opening a frictionless shutter, the demon sorted fast particles into one chamber and slow particles into the other, apparently decreasing system entropy and violating the Second Law of Thermodynamics without expending work.",
      "The paradox persisted until Rolf Landauer and Charles Bennett resolved it through algorithmic information physics. Landauer demonstrated that information is inherently physical. The act of measuring and processing bits does not inevitably generate heat, but the erasure of a single bit of information from physical memory dissipates a minimum thermodynamic cost of kT ln 2 joules into the environment as heat. Maxwell's demon does not cheat the Second Law; rather, its internal memory must eventually be reset, generating sufficient entropy to preserve the universal thermodynamic ledger."
    ],
    vocabularyGlossary: [
      { word: 'Entropy', definition: 'A thermodynamic quantity representing the unavailability of a system\'s thermal energy for mechanical work.', example: 'Entropy in an isolated system never decreases over time.' },
      { word: 'Permutation', definition: 'A way, especially one of several possible variations, in which a set of things can be ordered or arranged.', example: 'The combination lock had thousands of numerical permutations.' },
      { word: 'Dissipate', definition: 'To cause to disappear; in physics, to waste or convert energy into thermal dispersion.', example: 'Electrical resistors dissipate excess energy as heat.' },
      { word: 'Ledger', definition: 'A principal book or record for recording and balancing transactions or conservation laws.', example: 'Conservation of mass balances the chemical ledger.' }
    ],
    questions: [
      {
        id: 'q1',
        question: 'According to Landauer\'s principle, what computational action fundamentally dissipates thermodynamic heat into the environment?',
        type: 'multiple-choice',
        options: [
          'Reading a file from a hard drive',
          'Erasing a single bit of physical information',
          'Connecting to a wireless network',
          'Writing a line of Python code'
        ],
        correctAnswer: 1,
        explanation: 'Landauer proved that the erasure of information from memory requires a minimum thermodynamic energy dissipation of kT ln 2.'
      },
      {
        id: 'q2',
        question: 'Maxwell\'s demon successfully disproved the Second Law of Thermodynamics permanently.',
        type: 'true-false',
        options: ['True', 'False'],
        correctAnswer: 1,
        explanation: 'False. The paradox was resolved when Bennett and Landauer proved the demon must reset its memory, dissipating entropy.'
      }
    ]
  },

  // ==========================================
  // 5. INTERESTING FACTS
  // ==========================================
  // --- Beginner 1 ---
  {
    id: 'read-beg-fact-1',
    title: 'Three Hearts and Blue Blood: The Amazing Octopus',
    genre: 'interesting-facts',
    level: 'beginner',
    wordCount: 155,
    summary: 'Discover unusual biological wonders of octopuses, from blue copper blood to their ability to squeeze through coin-sized holes.',
    paragraphs: [
      "Did you know that octopuses are some of the most unusual creatures in the entire ocean? For starters, an octopus does not have just one heart—it has three separate hearts working together!",
      "Two of its hearts pump blood to the gills to absorb oxygen, while the third heart circulates oxygenated blood through the rest of its soft body.",
      "Even more surprisingly, octopus blood is not red like human blood. Instead, it is a bright, clear blue! This is because their blood contains hemocyanin, a copper-based protein that is far more efficient at carrying oxygen in cold, dark ocean waters.",
      "Furthermore, because octopuses possess no bones or rigid skeleton, a large octopus can squeeze its entire body through a hole no larger than a small coin."
    ],
    vocabularyGlossary: [
      { word: 'Gills', definition: 'The respiratory organs of aquatic animals that extract oxygen from water.', example: 'Fish breathe by passing water over their gills.' },
      { word: 'Circulate', definition: 'To move continuously through a closed system or circuit.', example: 'The pump circulates water through the cooling pipes.' },
      { word: 'Rigid', definition: 'Unable to bend or be forced out of shape; not flexible.', example: 'The tent was supported by rigid aluminum poles.' },
      { word: 'Efficient', definition: 'Achieving maximum productivity with minimum wasted effort or expense.', example: 'Electric motors are highly efficient.' }
    ],
    questions: [
      {
        id: 'q1',
        question: 'Why is octopus blood blue rather than red?',
        type: 'multiple-choice',
        options: [
          'Because they drink saltwater all day',
          'Because it uses copper-based hemocyanin rather than iron-based hemoglobin',
          'Because they eat blue jellyfish',
          'Because their skin reflects the color of the ocean'
        ],
        correctAnswer: 1,
        explanation: 'Their blood contains hemocyanin, a copper-based protein that turns blue when carrying oxygen.'
      },
      {
        id: 'q2',
        question: 'How many hearts does an octopus have?',
        type: 'multiple-choice',
        options: ['One', 'Two', 'Three', 'Four'],
        correctAnswer: 2,
        explanation: 'The text highlights that an octopus has three separate hearts working together.'
      }
    ]
  },

  // --- Beginner 2 ---
  {
    id: 'read-beg-fact-2',
    title: 'The Secret Underground Internet of Forest Trees',
    genre: 'interesting-facts',
    level: 'beginner',
    wordCount: 150,
    summary: 'How ancient trees share carbon, water, and emergency warning signals through fungal underground networks.',
    paragraphs: [
      "When you walk peacefully through a quiet green forest, it seems like each tree stands alone, competing with its neighbors for sunlight and rainwater.",
      "However, beneath your hiking shoes lies an extraordinary underground network called the mycorrhizal fungal web, often nicknamed the 'Wood Wide Web.'",
      "Microscopic white fungal threads connect the root systems of different trees together. Through this cooperative network, healthy mother trees send sugar and mineral nutrients to tiny seedlings growing in deep shade.",
      "Even more incredible, if a tree is attacked by hungry caterpillars, it transmits chemical alarm signals through the fungal network, warning nearby trees to produce bitter defense toxins before the bugs arrive!"
    ],
    vocabularyGlossary: [
      { word: 'Fungal', definition: 'Relating to or caused by fungi (such as mushrooms and molds).', example: 'Fungal networks thrive in moist forest soil.' },
      { word: 'Seedling', definition: 'A young plant, especially one raised from seed and not from a cutting.', example: 'The gardener nurtured small oak seedlings in pots.' },
      { word: 'Toxin', definition: 'A poisonous substance produced within living cells or organisms.', example: 'Some plants produce bitter toxins to deter herbivores.' },
      { word: 'Cooperative', definition: 'Involving mutual assistance in working toward a common goal.', example: 'Ants are famous for their cooperative social behavior.' }
    ],
    questions: [
      {
        id: 'q1',
        question: 'What is the "Wood Wide Web" made of?',
        type: 'multiple-choice',
        options: [
          'Underground telephone cables',
          'Mycorrhizal fungal networks connecting tree roots',
          'Buried copper pipes for irrigation',
          'Tunnels dug by earthworms'
        ],
        correctAnswer: 1,
        explanation: 'The text explains that the Wood Wide Web is made of microscopic mycorrhizal fungal threads connecting tree roots.'
      },
      {
        id: 'q2',
        question: 'Trees can send chemical alarm warnings through fungal threads when attacked by pests.',
        type: 'true-false',
        options: ['True', 'False'],
        correctAnswer: 0,
        explanation: 'True. Trees transmit chemical alarm signals to neighboring trees to help them produce defense toxins.'
      }
    ]
  },

  // --- Intermediate 1 ---
  {
    id: 'read-int-fact-1',
    title: 'The Voynich Manuscript: History\'s Unsolved Cipher',
    genre: 'interesting-facts',
    level: 'intermediate',
    wordCount: 235,
    summary: 'A 600-year-old illustrated codex written in an unknown alphabet that has baffled Alan Turing, the FBI, and modern AI.',
    paragraphs: [
      "In 1912, an antique book dealer named Wilfrid Voynich purchased a bizarre, leather-bound vellum codex from a Jesuit college in Rome. Radiocarbon dating performed by the University of Arizona confirms that the calfskin parchment dates reliably to the early fifteenth century, between 1404 and 1438.",
      "What makes the Voynich Manuscript world-renowned is its impenetrable script. Written in an elegant, flowing cursive alphabet consisting of roughly twenty-five unique glyphs, the text has never been deciphered. The book contains over two hundred pages adorned with vibrant botanical illustrations of plants that do not exist on Earth, bizarre astronomical charts with unmapped constellations, and strange female figures bathing in green interconnected pipes.",
      "During the Second World War, elite Allied cryptanalysts who cracked the Nazi Enigma machine turned their attention to the manuscript during their spare time, yet failed to decode a single sentence. Modern machine learning algorithms and neural linguistic networks have analyzed character entropy and word frequencies, confirming that the grammar obeys Zipf's Law—the mathematical hallmark of genuine human language—yet its semantic meaning remains completely opaque."
    ],
    vocabularyGlossary: [
      { word: 'Vellum', definition: 'Fine parchment made originally from the skin of a calf.', example: 'Medieval monks transcribed sacred texts onto durable vellum.' },
      { word: 'Impenetrable', definition: 'Impossible to understand, enter, or pierce.', example: 'The dense jungle was impenetrable on foot.' },
      { word: 'Cryptanalyst', definition: 'A specialist in breaking secret codes and ciphers.', example: 'Turing worked as a chief cryptanalyst at Bletchley Park.' },
      { word: 'Opaque', definition: 'Not able to be seen through; obscure or hard to decipher.', example: 'The financial regulations were excessively complex and opaque.' }
    ],
    questions: [
      {
        id: 'q1',
        question: 'What statistical property confirms that the Voynich Manuscript text reflects genuine human language rather than random nonsense?',
        type: 'multiple-choice',
        options: ['Newton\'s First Law', 'Zipf\'s Law of word frequency distribution', 'Moore\'s Law', 'The Doppler effect'],
        correctAnswer: 1,
        explanation: 'Linguistic AI confirmed that character entropy and word frequencies follow Zipf\'s Law, characteristic of human speech.'
      },
      {
        id: 'q2',
        question: 'Allied cryptographers who cracked the Enigma code successfully deciphered the first three chapters of the manuscript.',
        type: 'true-false',
        options: ['True', 'False'],
        correctAnswer: 1,
        explanation: 'False. The article notes that elite Allied codebreakers failed to decode a single sentence.'
      }
    ]
  },

  // --- Intermediate 2 ---
  {
    id: 'read-int-fact-2',
    title: 'The Anechoic Chamber: Inside the Quietest Room on Earth',
    genre: 'interesting-facts',
    level: 'intermediate',
    wordCount: 225,
    summary: 'At Orfield Laboratories in Minnesota, an acoustic chamber measures negative decibels—driving human perception to surreal sensory limits.',
    paragraphs: [
      "In a quiet corner of Minneapolis lies an acoustic research chamber certified by Guinness World Records as the quietest place on Earth. Engineered with one-meter-thick fiberglass acoustic wedges, double insulated steel walls, and a foot-thick concrete outer shell, Orfield Laboratories' anechoic chamber absorbs 99.99 percent of sound reflections, registering a background noise level of negative 9.4 decibels.",
      "In our everyday noisy world, a quiet bedroom at night hovers around thirty decibels. When a human subject enters total sensory acoustic deprivation, the auditory cortex immediately amplifies its sensitivity. Without ambient acoustic cues, the room feels unnervingly heavy.",
      "Within ten minutes, visitors begin to hear their own physiological processes with startling clarity: the rhythmic thumping of their cardiac valve, the bellows-like whoosh of their lungs, and a high-pitched hiss caused by microscopic sensory hair cells firing inside the cochlea.",
      "Because humans rely on subtle reverberations to orient their vestibular balance, spending more than thirty minutes in the dark anechoic chamber causes disorientation, compelling subjects to sit down to avoid falling."
    ],
    vocabularyGlossary: [
      { word: 'Anechoic', definition: 'Free from echoes and reverberations.', example: 'Acoustic engineers test studio microphones in an anechoic chamber.' },
      { word: 'Deprivation', definition: 'The damaging lack of material benefits or sensory input considered to be basic necessities.', example: 'Sleep deprivation causes significant cognitive impairment.' },
      { word: 'Vestibular', definition: 'Relating to the inner ear system that controls balance and spatial orientation.', example: 'The gymnast relied on sharp vestibular balance on the beam.' },
      { word: 'Reverberation', definition: 'Prolongation of a sound; resonance.', example: 'The cathedral possessed a ten-second acoustic reverberation.' }
    ],
    questions: [
      {
        id: 'q1',
        question: 'Why do human visitors begin hearing their own heartbeat and lung sounds inside the anechoic chamber?',
        type: 'multiple-choice',
        options: [
          'The laboratory plays recordings of organs through hidden speakers',
          'The auditory cortex amplifies sensitivity due to the total absence of ambient sound',
          'The air pressure in the room is dangerously elevated',
          'The fiberglass walls vibrate violently'
        ],
        correctAnswer: 1,
        explanation: 'In the total absence of external ambient noise, the auditory cortex heightens its sensitivity to internal physiological sounds.'
      },
      {
        id: 'q2',
        question: 'Prolonged stays in the dark anechoic chamber can cause vestibular disorientation.',
        type: 'true-false',
        options: ['True', 'False'],
        correctAnswer: 0,
        explanation: 'True. Humans rely on subtle sound reverberations to balance, so total silence causes disorientation.'
      }
    ]
  },

  // --- Advanced 1 ---
  {
    id: 'read-adv-fact-1',
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
  },

  // --- Advanced 2 ---
  {
    id: 'read-adv-fact-2',
    title: 'Baryon Asymmetry: The Cosmological Mystery of Matter\'s Survival',
    genre: 'interesting-facts',
    level: 'advanced',
    wordCount: 305,
    summary: 'Why our universe is populated by stars, galaxies, and living observers rather than a sterile vacuum of pure annihilated radiation.',
    paragraphs: [
      "In the foundational framework of modern quantum electrodynamics and the Standard Model of particle physics, matter and antimatter exist in exquisite mathematical symmetry. For every fermion endowed with a positive lepton or baryon number, there corresponds an identical antiparticle possessing opposite electric charge and quantum flavor. When a particle collides with its antiparticle counterpart, mutual annihilation ensues instantaneously, converting their combined rest mass into high-energy gamma-ray photons via Einstein's E=mc².",
      "According to prevailing cosmological models, the Big Bang should have generated precisely equal quantities of matter and antimatter in the primordial thermal plasma. Had this pristine symmetry been upheld during the initial microsecond of cosmic inflation, total annihilation would have annihilated every particle of matter. The cosmos today would be a sterile, isotropic expanse devoid of atomic matter, stars, carbon chemistry, or sentient consciousness.",
      "Yet empirical reality unequivocally refutes this scenario: our observable universe is composed overwhelmingly of matter. This profound cosmological discrepancy is known as the Baryon Asymmetry Problem. In 1967, theoretical physicist Andrei Sakharov formulated three essential mathematical conditions required to produce a net baryon surplus: baryon number violation, C- and CP-symmetry violation, and interactions occurring outside thermodynamic equilibrium. While experiments at the Large Hadron Collider have verified micro-scale CP-violation, the magnitude remains vastly insufficient to account for the observable cosmos, leaving physicists poised before a fundamental lacuna in the laws of nature."
    ],
    vocabularyGlossary: [
      { word: 'Annihilation', definition: 'The total destruction of something; in physics, the conversion of a particle and antiparticle into electromagnetic radiation.', example: 'Positron-electron annihilation produces gamma rays.' },
      { word: 'Primordial', definition: 'Existing at or from the beginning of time; primeval.', example: 'Primordial helium formed during the earliest minutes of the universe.' },
      { word: 'Isotropic', definition: 'Having a physical property which has the same value when measured in different directions.', example: 'Cosmic microwave background radiation is remarkably isotropic.' },
      { word: 'Lacuna', definition: 'An unfilled space, gap, or missing portion in a manuscript, theory, or law.', example: 'The missing experimental proof represents a major lacuna in current physics.' }
    ],
    questions: [
      {
        id: 'q1',
        question: 'What would have occurred if equal quantities of matter and antimatter had completely annihilated after the Big Bang without asymmetry?',
        type: 'multiple-choice',
        options: [
          'Planets would have formed from water instead of rock',
          'The cosmos would be a sterile sea of radiation devoid of atoms, stars, or life',
          'Gravity would have reversed direction',
          'Time would have flowed backwards'
        ],
        correctAnswer: 1,
        explanation: 'Equal annihilation would have wiped out all matter, leaving an empty cosmos of photons devoid of atoms and stars.'
      },
      {
        id: 'q2',
        question: 'Known CP-symmetry violations measured in particle accelerators fully explain the total volume of matter in the universe today.',
        type: 'true-false',
        options: ['True', 'False'],
        correctAnswer: 1,
        explanation: 'False. The text explicitly states that known CP-violation is vastly insufficient to account for the observable surplus.'
      }
    ]
  },

  // ==========================================
  // 6. PROFESSIONAL
  // ==========================================
  // --- Beginner 1 ---
  {
    id: 'read-beg-prof-1',
    title: 'Writing Your First Professional Thank-You Email',
    genre: 'professional',
    level: 'beginner',
    wordCount: 155,
    summary: 'A clear guide on how students and interns can write polite, impactful follow-up emails after an interview or meeting.',
    paragraphs: [
      "After attending a job interview or a formal meeting with a mentor, sending a prompt thank-you email is one of the most effective ways to make a memorable, positive impression.",
      "Always send your message within twenty-four hours of the conversation. Begin with a polite greeting, such as 'Dear Mr. Miller' or 'Hello Ms. Tanaka.'",
      "In the body paragraph, express sincere gratitude for their time and mention one specific topic or project you enjoyed discussing. This shows you were listening attentively during the meeting.",
      "Conclude your email with a respectful closing phrase like 'Best regards' or 'Sincerely,' followed by your full name and contact information. Always proofread carefully to avoid spelling errors."
    ],
    vocabularyGlossary: [
      { word: 'Prompt', definition: 'Done without delay; immediately.', example: 'Thank you for your prompt response to my inquiry.' },
      { word: 'Gratitude', definition: 'The quality of being thankful; readiness to show appreciation.', example: 'She expressed deep gratitude to her teachers.' },
      { word: 'Attentively', definition: 'With great attention or close observation.', example: 'The students listened attentively to the instructions.' },
      { word: 'Proofread', definition: 'To read text carefully to detect and correct spelling or grammar errors.', example: 'Always proofread your resume before applying.' }
    ],
    questions: [
      {
        id: 'q1',
        question: 'When should a professional thank-you email ideally be sent following an interview?',
        type: 'multiple-choice',
        options: ['Within two weeks', 'Within twenty-four hours', 'After one month', 'Immediately during the interview'],
        correctAnswer: 1,
        explanation: 'The guide recommends sending your message within twenty-four hours of the conversation.'
      },
      {
        id: 'q2',
        question: 'Mentioning a specific topic from the conversation demonstrates that you were listening attentively.',
        type: 'true-false',
        options: ['True', 'False'],
        correctAnswer: 0,
        explanation: 'True. Mentioning a specific topic proves you listened attentively during the meeting.'
      }
    ]
  },

  // --- Beginner 2 ---
  {
    id: 'read-beg-prof-2',
    title: 'Basics of Workplace Punctuality and Agenda Preparation',
    genre: 'professional',
    level: 'beginner',
    wordCount: 150,
    summary: 'Key habits for succeeding in internships: arriving early, bringing a notepad, and reviewing meeting agendas.',
    paragraphs: [
      "Starting an internship or a new job can feel overwhelming, but building basic professional habits early creates strong trust with managers and teammates.",
      "First, punctuality is paramount. Arriving five to ten minutes before scheduled meetings demonstrates respect for everyone's busy time. It also gives you a moment to breathe and prepare.",
      "Second, always bring a notebook or a digital tablet to record action items and deadlines. Never rely entirely on your memory when receiving detailed instructions from a supervisor.",
      "Finally, check the meeting agenda beforehand. If you have questions or updates, write them down so you can contribute clearly and concisely when invited to speak."
    ],
    vocabularyGlossary: [
      { word: 'Punctuality', definition: 'The fact or quality of being on time.', example: 'The company values punctuality and reliability.' },
      { word: 'Paramount', definition: 'More important than anything else; supreme.', example: 'Worker safety is paramount in construction.' },
      { word: 'Supervisor', definition: 'A person who manages or oversees a person or activity.', example: 'His supervisor approved the project proposal.' },
      { word: 'Concisely', definition: 'In a way that is brief but comprehensive; clearly.', example: 'She summarized the findings concisely in two bullet points.' }
    ],
    questions: [
      {
        id: 'q1',
        question: 'Why should interns arrive five to ten minutes early for meetings?',
        type: 'multiple-choice',
        options: [
          'To clean the meeting room windows',
          'To demonstrate respect for colleagues\' time and prepare calmly',
          'To lock out other participants',
          'To eat breakfast before anyone arrives'
        ],
        correctAnswer: 1,
        explanation: 'Arriving early shows respect for others\' time and gives you time to prepare calmly.'
      },
      {
        id: 'q2',
        question: 'Relying entirely on memory for complex task instructions is recommended for beginners.',
        type: 'true-false',
        options: ['True', 'False'],
        correctAnswer: 1,
        explanation: 'False. The article warns: "Never rely entirely on your memory when receiving detailed instructions."'
      }
    ]
  },

  // --- Intermediate 1 ---
  {
    id: 'read-int-prof-1',
    title: 'Mastering Constructive Peer Feedback with the SBI Model',
    genre: 'professional',
    level: 'intermediate',
    wordCount: 235,
    summary: 'How modern agile teams deliver actionable, non-defensive critique using the Situation-Behavior-Impact framework.',
    paragraphs: [
      "In high-performing professional environments, feedback is the lifeblood of continuous improvement. Yet when critique is delivered vaguely or emotionally, recipients naturally retreat into defensive postures, sabotaging collaboration and team morale.",
      "To circumvent emotional friction, organizational psychologists developed the SBI framework: Situation, Behavior, and Impact. This methodology anchors observations in empirical facts rather than subjective personality judgments.",
      "First, specify the 'Situation' by providing clear temporal and physical context (e.g., 'During yesterday's client pitch meeting'). Second, describe the observable 'Behavior' without loaded adjectives (e.g., 'You interrupted the marketing director twice while she presented the pricing slide').",
      "Finally, articulate the 'Impact' objectively (e.g., 'This created confusion regarding our pricing tiers and made our team appear uncoordinated'). By focusing strictly on observable actions and measurable outcomes, the SBI model invites collaborative problem-solving instead of defensive argument."
    ],
    vocabularyGlossary: [
      { word: 'Constructive', definition: 'Serving a useful purpose; tending to build up or improve.', example: 'She offered constructive suggestions to enhance the proposal.' },
      { word: 'Critique', definition: 'A detailed evaluation or assessment of something.', example: 'The senior editor provided a rigorous critique of the draft.' },
      { word: 'Posture', definition: 'A particular approach or attitude taken toward something.', example: 'The union adopted a firm bargaining posture.' },
      { word: 'Articulate', definition: 'To express an idea or feeling fluently and coherently.', example: 'He articulated his thoughts with great precision.' }
    ],
    questions: [
      {
        id: 'q1',
        question: 'What do the three letters in the "SBI" professional feedback framework stand for?',
        type: 'multiple-choice',
        options: ['Standard, Benchmark, Instruction', 'Situation, Behavior, Impact', 'Speed, Budget, Iteration', 'System, Blueprint, Implementation'],
        correctAnswer: 1,
        explanation: 'The SBI framework stands for Situation, Behavior, and Impact.'
      },
      {
        id: 'q2',
        question: 'Effective constructive feedback should focus on subjective personality flaws rather than observable behaviors.',
        type: 'true-false',
        options: ['True', 'False'],
        correctAnswer: 1,
        explanation: 'False. The text emphasizes anchoring critique in observable behaviors and empirical facts, not subjective personality judgments.'
      }
    ]
  },

  // --- Intermediate 2 ---
  {
    id: 'read-int-prof-2',
    title: 'Asynchronous Collaboration in Globally Distributed Teams',
    genre: 'professional',
    level: 'intermediate',
    wordCount: 230,
    summary: 'Why documentation-first cultures, asynchronous video briefings, and timezone etiquette outperform constant synchronous meetings.',
    paragraphs: [
      "The rapid globalization of the knowledge economy has rendered the traditional nine-to-five synchronized office schedule obsolete. When software engineers in Jakarta collaborate with product designers in Berlin and marketing analysts in San Francisco, expecting simultaneous real-time attendance generates severe burnout and chronic sleep disruption.",
      "Leading remote enterprises now operate under an 'asynchronous-first' philosophy. In an asynchronous workplace, communication does not assume immediate responses. Instead, team members exchange structured, well-documented project briefs, allowing colleagues in opposite hemispheres to review material during their respective peak cognitive working hours.",
      "Rather than convening hour-long status meetings that could be resolved in writing, contributors record five-minute screencast walkthroughs and maintain searchable documentation wikis. Clear deadlines with explicit timezone indicators (such as UTC) prevent ambiguous expectations.",
      "Organizations that master asynchronous hygiene experience higher employee retention, deeper periods of uninterrupted focus work, and superior documentation trails that outlast individual employee turnover."
    ],
    vocabularyGlossary: [
      { word: 'Asynchronous', definition: 'Not occurring at the same time or requiring simultaneous presence.', example: 'Asynchronous messaging allows team members to reply at their own pace.' },
      { word: 'Obsolete', definition: 'No longer produced or used; out of date.', example: 'Floppy disks are completely obsolete today.' },
      { word: 'Hemisphere', definition: 'A half of the earth, usually divided into northern and southern or eastern and western.', example: 'Winter in the northern hemisphere coincides with summer in the south.' },
      { word: 'Hygiene', definition: 'Practices conducive to maintaining health, or metaphorically, good operational discipline.', example: 'Strong cybersecurity hygiene requires rotating passwords.' }
    ],
    questions: [
      {
        id: 'q1',
        question: 'What is a core tenet of the "asynchronous-first" workplace philosophy?',
        type: 'multiple-choice',
        options: [
          'Employees must work all night without sleeping',
          'Communication does not demand immediate real-time responses and relies on structured documentation',
          'All communication must be conducted through telephone calls',
          'Employees are forbidden from working with foreign colleagues'
        ],
        correctAnswer: 1,
        explanation: 'Asynchronous communication does not assume immediate replies, prioritizing clear documentation and flexible hours.'
      },
      {
        id: 'q2',
        question: 'Five-minute screencast walkthroughs and searchable wikis can often replace lengthy status meetings.',
        type: 'true-false',
        options: ['True', 'False'],
        correctAnswer: 0,
        explanation: 'True. The text explains that contributors record short screencasts and maintain wikis instead of convening hour-long meetings.'
      }
    ]
  },

  // --- Advanced 1 ---
  {
    id: 'read-adv-prof-1',
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
      }
    ]
  },

  // --- Advanced 2 ---
  {
    id: 'read-adv-prof-2',
    title: 'Capital Allocation Frameworks in Volatile Macroeconomic Regimes',
    genre: 'professional',
    level: 'advanced',
    wordCount: 305,
    summary: 'Evaluating treasury optimization, cross-currency hedging, and risk-adjusted hurdle rates for corporate enterprise resilience.',
    paragraphs: [
      "In an era characterized by stagflationary pressures, quantitative tightening, and geopolitical fragmentation, multinational chief financial officers must re-examine orthodox capital allocation models. For over a decade of near-zero benchmark interest rates, corporate treasuries operated under a regime of hyper-abundant liquidity, prioritizing aggressive top-line revenue expansion over free-cash-flow resilience.",
      "The sudden normalization of sovereign yield curves has precipitated a severe repricing of capital risk. Discretionary capital expenditure (CapEx) can no longer be justified by optimistic discounted cash flow projections predicated on static hurdle rates. Financial strategists must institute dynamic hurdle rates that incorporate elevated sovereign credit spreads, currency volatility premiums, and counterparty default risks.",
      "Furthermore, global liquidity management requires sophisticated cross-currency interest rate swaps and programmatic FX hedging. With supply chain disruptions threatening working capital cycles, corporations are transitioning from fragile 'just-in-time' inventory financing to resilient 'just-in-case' strategic balance sheets. Ultimately, enterprise survival in turbulent macroeconomic cycles belongs not to organizations with the most aggressive leverage, but to those possessing fortified solvency buffers and disciplined capital allocation governance."
    ],
    vocabularyGlossary: [
      { word: 'Stagflationary', definition: 'Characterized by slow economic growth, high unemployment, and rising inflation.', example: 'Stagflationary conditions squeezed household purchasing power.' },
      { word: 'Hurdle Rate', definition: 'The minimum rate of return on a project or investment required by a manager or investor.', example: 'The board rejected the expansion because it fell below their 12% hurdle rate.' },
      { word: 'Solvency', definition: 'The ability of a company to meet its long-term financial obligations and debts.', example: 'Strong cash reserves ensured the firm\'s continued solvency.' },
      { word: 'Hedging', definition: 'Making an investment to reduce the risk of adverse price movements in an asset.', example: 'Airlines use oil hedging to protect against sudden jet fuel price spikes.' }
    ],
    questions: [
      {
        id: 'q1',
        question: 'Why can corporate CapEx no longer be evaluated using static historical hurdle rates?',
        type: 'multiple-choice',
        options: [
          'Governments banned all capital expenditure',
          'Elevated sovereign yield curves, credit spreads, and currency volatility demand dynamic risk-adjusted benchmarks',
          'Computers calculate rates too slowly',
          'Bank accounts no longer accept electronic money'
        ],
        correctAnswer: 1,
        explanation: 'Rising yield curves, credit spreads, and FX volatility demand dynamic risk-adjusted hurdle rates.'
      },
      {
        id: 'q2',
        question: 'Under modern macroeconomic uncertainty, firms are moving from "just-in-time" to "just-in-case" balance sheet buffers.',
        type: 'true-false',
        options: ['True', 'False'],
        correctAnswer: 0,
        explanation: 'True. Working capital risks are driving transitions toward resilient "just-in-case" inventory and solvency buffers.'
      }
    ]
  }
];

const fileContent = `import { ReadingMaterial } from '../types';

export const READING_MATERIALS: ReadingMaterial[] = ${JSON.stringify(materials, null, 2)};
`;

fs.writeFileSync(path.join(__dirname, '../src/data/readingMaterialsData.ts'), fileContent, 'utf8');
console.log('Successfully written ' + materials.length + ' reading materials to src/data/readingMaterialsData.ts');
