import { getHeroById, getTierForElo, getNextTierProgress } from "../data/animeData.js";

function EloRing({ elo, size = 118 }) {
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - getNextTierProgress(elo));

  return (
    <svg className="hex-ring" width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="4" />
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

function SkillBar({ label, value }) {
  return (
    <div className="skill-row">
      <div className="skill-label-row">
        <span className="skill-label">{label}</span>
        <span className="skill-value">{value}%</span>
      </div>
      <div className="skill-bar-bg">
        <div className="skill-bar-fill" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

export default function ProfilePage({ player }) {
  const hero = getHeroById(player?.heroId || "kairo");
  const tier = getTierForElo(player?.elo || 1000);
  const progress = getNextTierProgress(player?.elo || 1000);

  const totalMatches = (player?.wins || 0) + (player?.losses || 0);
  const winRate = totalMatches > 0 ? Math.round(((player?.wins || 0) / totalMatches) * 100) : 0;
  const level = Math.floor((player?.coins || 0) / 100) + 1;

  return (
    <>
      <section className="hero-banner glass-panel profile-hero-panel">
        <div className="hex-frame">
          <EloRing elo={player?.elo || 1000} />
          <div className="hex-clip" style={{ boxShadow: `inset 0 0 24px ${hero.color}40` }}>
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
          <span className="hero-quote">"{hero.title}" — {hero.description}</span>

          <div className="hero-stats-row">
            <div className="hero-stat">
              <span className="hero-stat-label">ELO RATING</span>
              <span className="hero-stat-value elo">{player?.elo || 1000}</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-label">WIN RATE</span>
              <span className="hero-stat-value" style={{ color: "#22c55e" }}>{winRate}%</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-label">ARENA COINS</span>
              <span className="hero-stat-value coins">{player?.coins || 0} 🪙</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-label">BATTLE RECORD</span>
              <span className="hero-stat-value">
                <span className="hero-stat-value record-w">{player?.wins || 0}W</span> /{" "}
                <span className="hero-stat-value record-l">{player?.losses || 0}L</span>
              </span>
            </div>
          </div>
        </div>

        <div className="hero-elo-gauge">
          <button className="btn btn-start" disabled>
            ⚡ PROFILE ACTIVE
          </button>
          <span className="hero-elo-gauge-label">{Math.round(progress * 100)}% TO NEXT TIER</span>
        </div>
      </section>

      <div className="profile-main-grid">
        {/* Battle Performance Analytics */}
        <section className="profile-card glass-panel">
          <div className="profile-card-header">Combat Performance Analytics</div>
          <div className="profile-card-content">
            <div className="profile-detail-row">
              <span>Rank Tier</span>
              <strong style={{ color: hero.color }}>{tier.name}</strong>
            </div>
            <div className="profile-detail-row">
              <span>Avg Response Time</span>
              <strong style={{ color: "#00e5ff" }}>4.2 sec (PERFECT)</strong>
            </div>
            <div className="profile-detail-row">
              <span>Best Win Streak</span>
              <strong style={{ color: "#ffd700" }}>{player?.badges?.includes("5-Win Streak") ? "5+ Matches" : "3 Matches"}</strong>
            </div>
            <div className="profile-detail-row">
              <span>Preferred Specialty</span>
              <strong>{hero.specialty}</strong>
            </div>
          </div>
        </section>

        {/* Skill Matrix */}
        <section className="profile-card glass-panel">
          <div className="profile-card-header">Skill Proficiency Matrix</div>
          <div className="profile-card-content">
            {Object.entries(player?.skills || {}).map(([key, value]) => (
              <SkillBar key={key} label={key.replace(/([A-Z])/g, " $1").replace(/^./, (ch) => ch.toUpperCase())} value={value} />
            ))}
          </div>
        </section>

        {/* Character Abilities Showcase */}
        <section className="profile-card glass-panel">
          <div className="profile-card-header">Character Combat Abilities</div>
          <div className="profile-card-content" style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 12 }}>
            <div style={{ padding: 10, borderRadius: 8, background: "rgba(255, 255, 255, 0.03)", borderLeft: `3px solid ${hero.color}` }}>
              <strong style={{ color: hero.color }}>PASSIVE: </strong>{hero.passive}
            </div>
            <div style={{ padding: 10, borderRadius: 8, background: "rgba(255, 255, 255, 0.03)", borderLeft: "3px solid #00e5ff" }}>
              <strong style={{ color: "#00e5ff" }}>ABILITY: </strong>{hero.ability}
            </div>
            <div style={{ padding: 10, borderRadius: 8, background: "rgba(255, 255, 255, 0.03)", borderLeft: "3px solid #ff2e88" }}>
              <strong style={{ color: "#ff2e88" }}>ULTIMATE: </strong>{hero.ultimate}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
