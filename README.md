# English Speaking Arena 🎙️
### Gamified English Fluency & Speed Reading Platform

**English Speaking Arena** is an interactive, gamified English learning platform engineered to help students overcome speaking anxiety, formulate articulate ideas on demand, and rapidly train conversational and reading velocity across three structured proficiency tiers: **Beginner**, **Intermediate**, and **Advanced**.

---

## 🌟 Core Feature Suite

### 1. Three Proficiency Modes
- **Beginner Mode (Confidence & Everyday Communication):**
  - Ice breakers (*Introduce Yourself*, *My Family*, *Favorite Food*), daily conversation (*Ordering at a Cafe*, *Asking for Directions*), vocabulary builder, and simple storytelling.
  - Generous scaffolding: sentence starters, vocabulary suggestions, and unlockable sample model responses.
- **Intermediate Mode (Fluency & Argumentation):**
  - Opinion challenges (*Social Media impact*, *School uniforms*), *Would You Rather* debates, 4/3/2 fluency sprints, and situational roleplays.
- **Advanced Mode (Debate, Critical Thinking & Executive Communication):**
  - Oxford-style debate arena (*AI in the Workforce*, *Autonomous Vehicle Ethics*), impromptu defense of unpopular opinions, startup venture pitches, and crisis management press conferences.

### 2. Speaking Cards (Feature 1)
- Digital card deck categorized across Ice Breakers, Opinions, Debates, Daily Conversations, and Impromptu Challenges.
- **Interactive Practice Modal:** Distraction-free interface with customizable countdown timers (30s, 60s, 90s, 2m, 3m), Web Speech API audio pronunciation, sentence starters, strategy hints, and +20 XP completion rewards.

### 3. Speaking Cart / Menu (Feature 2)
- Innovative multi-course practice builder modeled after a dining menu:
  - **Appetizer:** Small Talk, Ice Breaker, Quick Questions (1-2 mins).
  - **Main Course:** Roleplay, Debate, Storytelling, Opinion Challenge (3-4 mins).
  - **Dessert:** Rapid Fire, Vocabulary Cascade, Tongue Twister Sprint (1 min).
- **Presets Available:** Quick Practice (5 mins), Daily Fluency Workout (10 mins), Intensive Arena Bootcamp (20 mins).
- **Step-by-step Session Runner:** Guides the learner through each course seamlessly with auto-pacing and aggregated reward tokens.

### 4. Running Reading (Feature 4 - Core Highlight)
- A professional speed reading and comprehension trainer:
  - **Curated Reading Library:** Short stories, daily conversations, educational science texts, news articles, fiction, and professional academic essays across all 3 difficulty tiers.
  - **Precision Speed Control:** 0.5x, 0.75x, 1.0x, 1.25x, 1.5x, 2.0x velocity presets.
  - **Display Modes:** Auto-Scroll, Manual Scroll, Sentence-by-Sentence Focus, and Paragraph Isolation.
  - **Comfort Customization:** Font size (Small to XL), Line Spacing (Normal, Relaxed, Loose), Themes (Clean Light, Warm Paper, Dark Night).
  - **Dynamic Highlight Tracking:** Automatically emphasizes active sentences in real time.
  - **Text-to-Speech Voice Assistant:** Embedded natural speech player synced to user's selected speed multiplier.
  - **Comprehension Challenge Quiz:** Instant multiple-choice, true/false, and short-answer retention checks calculating actual reading time, estimated WPM, accuracy %, and XP rewards.

### 5. Roleplay Secret Missions (Feature 3)
- Real-world conflict scenarios: *The Cold Steak Restaurant Complaint*, *Hotel Check-in Discrepancy*, *High-Stakes Job Interview*, *Flight Overbooking Gate Negotiation*, and *Cybersecurity Data Breach Press Conference*.
- **Secret Objectives:** Each player (A and B) receives confidential instructions with forbidden words (e.g. do not say "bad" or "liar"), required transition phrases, and objective performance scoring.

### 6. Competitive Mode — Speaking Arena (Feature 5)
- **Inclusive Leaderboards:** Weekly, Monthly, and All-Time leaderboards spotlighting not only top scorers but also *Most Improved*, *Consistency Champion*, and *Beginner Rising Star*.
- **Head-to-Head Topical Battles:** Side-by-side or solo showdowns with comparative scoring rubrics (Completion, Vocabulary, Fluency, Task Fulfillment).
- **Rank Ladder:** 6 ranks from *Rookie* to *Arena Champion* with visual badges and level-up celebrations.
- **Dynamic Achievements:** Badges unlocked by real activities (*First Words*, *Brave Speaker*, *No Fear*, *Reading Machine*, *Debate Master*, *Seven-Day Streak*).
- **Daily Missions:** 3 daily tasks (Speaking, Vocabulary, Reading) with XP rewards.

### 7. Interactive Methods Studio (Phase 3)
1. **Taboo / Hot Seat:** Explain target concepts without uttering forbidden trap words.
2. **Yes, And... Improv:** Accept the narrative premise and escalate the storyline.
3. **4/3/2 Technique:** Maurice Nation's renowned fluency method (4 min -> 3 min -> 2 min compression).
4. **Speed Talking / Fishbowl:** High-velocity prompt rotation with guiding questions.
5. **Shadowing Studio:** Phrase-by-phrase native rhythm mirroring with phonetic tips and variable playback speed.
6. **Visual Storytelling:** Unsplash photo situations with structured narrative prompts.

### 8. Teacher / Admin Dashboard (Phase 5)
- **Student Roster:** Inspect student level, XP, daily streak, and completed tasks.
- **Review & Grading:** Evaluate student audio/transcript submissions, assign 0-100 scores, and return written feedback.
- **Curriculum Authoring:** Publish custom Speaking Cards and Running Reading texts directly into the student curriculum.
- **Classroom Cohorts:** Generate cohorts and share invite codes.

---

## 🛠️ Technology Stack
- **Framework:** React 19 + TypeScript
- **Bundler:** Vite
- **Styling:** Tailwind CSS + PostCSS + Autoprefixer
- **Icons:** Lucide React
- **Audio Feedback:** Synthesized Web Audio API sound effects (no external mp3 files required)
- **Speech Synthesis:** Web Speech API for TTS reading assistance
- **Gamification:** Canvas Confetti animations + LocalStorage persistence layer

---

## 🚀 Local Installation & Running

1. Clone or navigate to the repository directory:
   ```bash
   cd d:/englishproject
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Build for production:
   ```bash
   npm run build
   ```
5. Preview production build:
   ```bash
   npm run preview
   ```

---

## 🌐 Netlify Deployment

The repository includes pre-configured Netlify deployment rules:
- **`netlify.toml`**:
  ```toml
  [build]
    command = "npm run build"
    publish = "dist"

  [[redirects]]
    from = "/*"
    to = "/index.html"
    status = 200
  ```

### Deploy Options:
1. **Netlify Drop (Drag & Drop):**
   - Run `npm run build` to generate the `dist` folder.
   - Go to [app.netlify.com/drop](https://app.netlify.com/drop).
   - Drag and drop the `d:\englishproject\dist` folder into the drop zone.
   - Your site will be published instantly with a live `.netlify.app` URL.

2. **Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   netlify login
   netlify deploy --prod --dir=dist
   ```

3. **Git Integration (Continuous Deployment):**
   - Push the repository to GitHub / GitLab / Bitbucket.
   - Import the repository in Netlify.
   - Build command: `npm run build`
   - Publish directory: `dist`
