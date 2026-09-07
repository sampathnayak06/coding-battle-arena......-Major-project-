# Coding Battle Arena

A futuristic, AAA Esports-style competitive coding platform.

## What's built

- ✅ **Auth** — real signup/login (backend/routes/auth.js), session tokens, hero selection at signup
- ✅ **Game Hub** — hero banner (hexagonal avatar + ELO ring), 6 quick-launch module cards
- ✅ **Lobby** — mode selection for AI Practice (instant launch) and 1v1 (create/join room with shareable code), 3-stage difficulty preview
- ✅ **Battle Arena (running stage)** — pick ONE programming language first, then a single-language duel of **10 multiple-choice questions + 2-5 code-typing questions (12-15 total)**, real-time HP bars, 15-minute timer, correct/incorrect feedback, coin/XP reward popups
- ✅ **Language selection** — HTML, CSS, JavaScript, Python, Java, C++ — every question in a match comes from that one language only
- ✅ **Anime-style background** — an original, low-intensity muted cyberpunk cityscape (SVG, no external image dependency) sits behind the whole app
- ✅ **AI Practice** — Cyber AI Bot v3 answers on its own delayed cadence with difficulty-scaled accuracy odds
- ✅ **1v1 Multiplayer** — Socket.io room create/join, synced HP/stage progress between both players in real time
- ✅ **Victory/Defeat modal** — side-by-side accuracy/HP/stages-cleared comparison, ELO delta, coins & XP earned
- ✅ **Leaderboard** — live-updating table (ranks, medals, tier badges, hero avatars, ELO, W/L, coins), backed by real signups
- ⏳ Not yet built: World Campaign Levels, Problem Vault UI, full Profile page, Admin console (still placeholder tabs — nav + `/api/profile` and `/api/problems` are ready for them)

## Project structure

```
coding-battle-arena/
├── backend/
│   ├── server.js                 # Express + Socket.io entry point
│   ├── data/
│   │   ├── authStore.js          # In-memory users, sessions, live leaderboard/profile/ELO recording
│   │   ├── animeData.js          # Hero roster + ELO tier helpers
│   │   ├── quizData.js           # Multi-language question bank (easy/moderate/hard) + 3-stage series builder
│   │   ├── problemsData.js       # Algorithmic problems (Problem Vault, not yet wired to UI)
│   │   └── mockUsers.js          # Seed leaderboard users (login: any username, password "battle123")
│   ├── routes/                   # auth, leaderboard, profile, problems
│   ├── socket/matchHandlers.js   # room:create/join, ai:start, battle:answer, match:end — 3-stage battle engine
│   └── services/
│       ├── eloService.js         # Standard ELO delta calculation
│       └── judge0Service.js      # Mocked code execution (Problem Vault, swap in real Judge0 via .env)
└── frontend/
    └── src/
        ├── components/
        │   ├── LoginPage.jsx / SignupPage.jsx   # Auth screens (hero picker on signup)
        │   ├── LobbyPage.jsx                    # AI Practice / 1v1 create-join room + stage preview
        │   ├── BattleArena.jsx                  # The running 3-stage quiz duel
        │   ├── VictoryDefeatModal.jsx            # Win/Lose comparison + rewards
        │   ├── LeaderboardPage.jsx               # Live leaderboard table
        │   ├── Navbar.jsx / GameHubHome.jsx / ParticleCanvas.jsx / PlaceholderPage.jsx
        ├── data/animeData.js     # Frontend mirror of hero roster
        ├── api.js                # REST helper (auth, leaderboard, profile) + token storage
        ├── socket.js             # socket.io-client, authenticated with the session token
        └── App.jsx               # Auth gate → Hub/Lobby/Battle/Leaderboard routing + victory modal
```

## Running it locally

**Backend** (http://localhost:5000):
```bash
cd backend
cp .env.example .env
npm install
npm run dev      # or: npm start
```

**Frontend** (http://localhost:3000):
```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:3000. You can either **create a new account** (pick a hero at signup) or **log in with a seeded demo account** — any leaderboard username (e.g. `ShadowByte`, `NullPointer_Kun`, `RecursionQueen`) with password `battle123`.

## How a battle works

1. From the Game Hub, click **⚔️ 1v1 Battle Arena** or **🤖 AI Practice Mode**.
2. **Choose your language first** — HTML, CSS, JavaScript, Python, Java, or C++. Every question in the match comes from that language only.
3. **AI Practice**: instantly launches a solo match against Cyber AI Bot v3 — no lobby screens.
4. **1v1**: create a room (get a 6-character code + shareable link) or join one with a friend's code — joining inherits the host's language.
5. The match runs **10 multiple-choice questions, then 2-5 code-typing questions** (12-15 total), all in the chosen language. Answer correctly to deal damage to your opponent; answer wrong and you take damage yourself. Code answers are graded against expected keywords/structure server-side.
6. When both players finish, someone's HP hits 0, or the 15-minute timer runs out, the match ends automatically.
7. The **Victory/Defeat modal** shows a side-by-side comparison (questions cleared, accuracy %, remaining HP) plus your ELO change, coins, and XP earned — then "CONTINUE TO GAME HUB" resets you back to the hub with updated stats.
8. Check the **🏆 Leaderboard** tab any time to see live rankings across every account (including yours).

## Wiring up real Judge0 execution (Problem Vault, not yet UI-connected)

By default `USE_MOCK_JUDGE0=true` in `backend/.env`. To use real Judge0:
1. Get a RapidAPI key: https://rapidapi.com/judge0-official/api/judge0-ce
2. In `backend/.env`, set `JUDGE0_API_KEY=your_key` and `USE_MOCK_JUDGE0=false`
3. Restart the backend

## What's next

1. **Problem Vault UI** — browse the 50+ algorithmic problems already in `problemsData.js`, run code through `judge0Service.js`
2. **Full Profile page** — skill bars, badges, match history (data already served by `/api/profile`)
3. **World Campaign Levels** — single-player realm progression
4. **Admin console** — match moderation, question bank management

