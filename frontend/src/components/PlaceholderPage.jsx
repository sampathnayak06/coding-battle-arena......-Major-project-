const COPY = {
  arena: { icon: "⚔️", title: "1v1 Battle Arena", desc: "Real-time duels, room codes, and the 5-question match engine land in the next build pass." },
  ai: { icon: "🤖", title: "AI Practice Mode", desc: "Instant-launch solo matches against Cyber AI Bot v3 land in the next build pass." },
  world: { icon: "🌍", title: "World Campaign Levels", desc: "10+ coding realms guarded by legendary anime bosses — coming soon." },
  vault: { icon: "📚", title: "Problem Vault", desc: "Browse the full 50+ algorithmic challenge library — coming soon." },
  leaderboard: { icon: "🏆", title: "Global Leaderboard", desc: "Live ELO rankings across every tier — wired to /api/leaderboard, UI coming soon." },
  profile: { icon: "👤", title: "Player Profile & Stats", desc: "Anime avatars, skill bars, and unlocked badges — wired to /api/profile, UI coming soon." },
  admin: { icon: "🛠️", title: "Admin Console", desc: "Match moderation and problem management tools — coming soon." }
};

export default function PlaceholderPage({ tabId }) {
  const copy = COPY[tabId] || { icon: "🚧", title: "Coming Soon", desc: "This module is under construction." };
  return (
    <div className="placeholder-page glass-panel">
      <span className="placeholder-icon">{copy.icon}</span>
      <h2 className="placeholder-title">{copy.title}</h2>
      <p className="placeholder-desc">{copy.desc}</p>
      <span className="placeholder-tag">NEXT BUILD PASS</span>
    </div>
  );
}
