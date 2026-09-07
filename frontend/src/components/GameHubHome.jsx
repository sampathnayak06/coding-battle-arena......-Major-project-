import { getHeroById, getTierForElo, getNextTierProgress } from "../data/animeData.js";

const MODULES = [
  {
    id: "arena",
    icon: "⚔️",
    title: "1v1 Battle Arena",
    desc: "Real-time multiplayer duels — 15-question sprints, live HP & ELO on the line.",
    glow: "#FF2E88"
  },
  {
    id: "ai",
    icon: "🤖",
    title: "AI Practice Mode",
    desc: "Train against AI Opponents (Cyber AI, Viper, Oracle, Glitch) across 10 levels.",
    glow: "#00E5FF"
  },
  {
    id: "history",
    icon: "📜",
    title: "Match History",
    desc: "Review past duels, accuracy rates, ELO gains, and speed performance.",
    glow: "#F59E0B"
  },
  {
    id: "leaderboard",
    icon: "🏆",
    title: "Global Leaderboard",
    desc: "Top coders and live ELO rankings across every tier, Silver to Coding King.",
    glow: "#FFD700"
  },
  {
    id: "profile",
    icon: "👤",
    title: "Player Profile & Stats",
    desc: "Your cyber avatar, skill matrix, unlocked badges, and battle record.",
    glow: "#9D4EDD"
  },
  {
    id: "vault",
    icon: "📚",
    title: "Study Vault",
    desc: "Cheat-sheets, study notes, and personal notepad across 6 programming languages.",
    glow: "#38BDF8"
  }
];

const DAILY_MISSIONS = [
  { id: 1, title: "Win 2 Arena Battles", reward: "+150 XP · 100 Coins", progress: "1/2", done: false },
  { id: 2, title: "Achieve a ×5 Max Combo", reward: "+200 XP · 150 Coins", progress: "0/1", done: false },
  { id: 3, title: "Solve 10 Questions", reward: "+100 XP · 50 Coins", progress: "6/10", done: false }
];

function EloRing({ elo, size = 118 }) {
  const progress = getNextTierProgress(elo);
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - progress);

  return (
    <svg className="hex-ring" width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4" />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="url(#eloGradient)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ filter: "drop-shadow(0 0 6px #00E5FF)" }}
      />
      <defs>
        <linearGradient id="eloGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00E5FF" />
          <stop offset="100%" stopColor="#9D4EDD" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function GameHubHome({ player, onNavigate }) {
  const hero = getHeroById(player?.heroId || "kairo");
  const tier = getTierForElo(player?.elo || 1000);

  // Evaluate weakest skill from real skill matrix for smart training
  const skills = player?.skills || { arrays: 85, dynamicProgramming: 42, graphs: 51, strings: 88, trees: 74 };
  const sortedSkills = Object.entries(skills).sort((a, b) => a[1] - b[1]);
  const weakestSkill = sortedSkills[0] ? sortedSkills[0][0] : "dynamicProgramming";

  const skillLabels = {
    arrays: "Arrays",
    dynamicProgramming: "Dynamic Programming",
    graphs: "Graph Algorithms",
    strings: "String Manipulation",
    trees: "Tree Traversal"
  };

  const level = Math.floor((player?.coins || 0) / 100) + 1;
  const xpCurrent = ((player?.wins || 0) * 150 + (player?.coins || 0) * 2) % 1000;

  return (
    <>
      {/* Player Status Banner */}
      <section className="hero-banner glass-panel" style={{ padding: 24, borderRadius: 20, marginBottom: 24 }}>
        <div className="hex-frame">
          <EloRing elo={player?.elo || 1000} />
          <div className="hex-clip" style={{ boxShadow: `inset 0 0 24px ${hero.color}55` }}>
            <span style={{ filter: `drop-shadow(0 0 10px ${hero.glow})` }}>{hero.emoji}</span>
          </div>
        </div>

        <div className="hero-info">
          <div className="hero-name-row">
            <span className="hero-name">{player?.username || hero.name}</span>
            <span className="hero-tier-tag" style={{ background: `${hero.color}25`, color: hero.color }}>
              {tier.name} · LEVEL {level}
            </span>
          </div>
          <span className="hero-quote">"{hero.title}"</span>

          {/* Level & XP Bar */}
          <div style={{ margin: "10px 0 14px 0", maxWidth: 360 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, fontWeight: 800, color: "var(--text-dim)", marginBottom: 4 }}>
              <span>PLAYER LEVEL {level}</span>
              <span>{xpCurrent} / 1,000 XP</span>
            </div>
            <div style={{ height: 6, background: "rgba(255, 255, 255, 0.08)", borderRadius: 999, overflow: "hidden" }}>
              <div style={{ width: `${(xpCurrent / 1000) * 100}%`, height: "100%", background: `linear-gradient(90deg, ${hero.color}, #00e5ff)` }} />
            </div>
          </div>

          <div className="hero-stats-row">
            <div className="hero-stat">
              <span className="hero-stat-label">ELO RATING</span>
              <span className="hero-stat-value elo">{player?.elo || 1000}</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-label">ARENA COINS</span>
              <span className="hero-stat-value coins">{player?.coins || 0} 🪙</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-label">BATTLE RECORD</span>
              <span className="hero-stat-value">
                <span className="record-w">{player?.wins || 0}W</span> /{" "}
                <span className="record-l">{player?.losses || 0}L</span>
              </span>
            </div>
          </div>
        </div>

        <div className="hero-elo-gauge">
          <button className="btn btn-start" onClick={() => onNavigate("arena")} style={{ padding: "14px 28px", fontSize: 14 }}>
            ⚔️ QUICK MATCH
          </button>
          <button className="btn btn-ghost" onClick={() => onNavigate("ai")} style={{ marginTop: 8, padding: "8px 16px", fontSize: 12 }}>
            🤖 AI PRACTICE
          </button>
        </div>
      </section>

      {/* Daily Missions & Smart Recommended Training Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 28 }}>
        {/* Daily Missions Panel */}
        <div className="glass-panel" style={{ padding: 20, borderRadius: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 900, color: "#ffd700", letterSpacing: "0.08em", marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
            <span>🔥</span> DAILY MISSIONS
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {DAILY_MISSIONS.map((m) => (
              <div key={m.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", borderRadius: 10, background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.06)" }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 13, color: "#fff" }}>{m.title}</div>
                  <div style={{ fontSize: 11, color: "var(--text-dim)", marginTop: 2 }}>{m.reward}</div>
                </div>
                <span style={{ fontSize: 12, fontWeight: 800, color: "var(--neon-cyan)", background: "rgba(0, 229, 255, 0.15)", padding: "4px 10px", borderRadius: 6 }}>
                  {m.progress}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Smart Recommended Training Panel */}
        <div className="glass-panel" style={{ padding: 20, borderRadius: 16, borderLeft: "4px solid #ff7a00" }}>
          <div style={{ fontSize: 13, fontWeight: 900, color: "#ff7a00", letterSpacing: "0.08em", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
            <span>🎯</span> RECOMMENDED TRAINING
          </div>
          <p style={{ fontSize: 12, color: "var(--text-dim)", margin: "0 0 12px 0", lineHeight: 1.4 }}>
            Based on your battle analytics, your lowest skill area is <strong style={{ color: "#fff" }}>{skillLabels[weakestSkill]} ({skills[weakestSkill]}%)</strong>.
          </p>
          <div style={{ background: "rgba(0, 0, 0, 0.4)", padding: 12, borderRadius: 10, border: "1px solid rgba(255, 122, 0, 0.3)", marginBottom: 14 }}>
            <div style={{ fontWeight: 800, fontSize: 13, color: "#ff7a00" }}>15 MIN HIGH-INTENSITY DRILL</div>
            <div style={{ fontSize: 11, color: "var(--text-primary)", marginTop: 4 }}>Targeted quiz & code questions for {skillLabels[weakestSkill]}.</div>
          </div>
          <button className="btn btn-start" onClick={() => onNavigate("vault")} style={{ width: "100%", padding: "10px 16px", fontSize: 12, background: "linear-gradient(90deg, #ff7a00, #ff2e88)" }}>
            ⚡ START DRILL IN STUDY VAULT
          </button>
        </div>
      </div>

      {/* Quick Launch Module Grid */}
      <div className="section-eyebrow">GAME HUB MODULES</div>
      <h2 className="section-title">Select Battlefield Mode</h2>

      <div className="module-grid">
        {MODULES.map((m) => (
          <button
            key={m.id}
            className="module-card glass-panel"
            style={{ "--card-glow": m.glow }}
            onClick={() => onNavigate(m.id)}
          >
            <span className="module-card-icon">{m.icon}</span>
            <div className="module-card-title">{m.title}</div>
            <div className="module-card-desc">{m.desc}</div>
            <span className="module-card-arrow">ENTER →</span>
          </button>
        ))}
      </div>
    </>
  );
}
