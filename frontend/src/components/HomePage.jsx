import audioManager from "../services/audioManager.js";

export default function HomePage({ player, onEnterArena, onNavigateSection }) {
  const featureCards = [
    {
      id: "arena",
      icon: "⚔️",
      title: "1v1 BATTLE ARENA",
      subtitle: "REAL-TIME MULTIPLAYER",
      description: "Compete against another player in real-time coding battles and MCQ speed duels.",
      color: "var(--neon-pink)",
      badge: "LIVE PVP"
    },
    {
      id: "ai",
      icon: "🤖",
      title: "AI PRACTICE",
      subtitle: "SOLO & PRACTICE MODE",
      description: "Practice coding and MCQs against an AI opponent to sharpen your programming speed.",
      color: "var(--neon-cyan)",
      badge: "PRACTICE"
    },
    {
      id: "world",
      icon: "🌍",
      title: "WORLD LEVELS",
      subtitle: "CAMPAIGN PROGRESSION",
      description: "Progress through language-specific coding campaigns across 30 cyber level realms.",
      color: "var(--accent-green)",
      badge: "30 LEVELS"
    },
    {
      id: "leaderboard",
      icon: "🏆",
      title: "LEADERBOARD",
      subtitle: "GLOBAL RANKINGS",
      description: "Compete with other players worldwide and track your ELO rating and level ranking.",
      color: "var(--neon-gold)",
      badge: "RANKINGS"
    },
    {
      id: "vault",
      icon: "💎",
      title: "VAULT",
      subtitle: "REWARDS & STUDY",
      description: "Collect your rewards, stars, achievements, and unlockable code cheatsheets.",
      color: "var(--neon-purple-soft)",
      badge: "REWARDS"
    }
  ];

  return (
    <div className="home-page-container">
      {/* Hero Banner Section */}
      <div className="home-hero-card glass-panel">
        <div className="home-hero-glow" />
        <div className="home-hero-header">
          <span className="home-brand-badge">CODING BATTLE ARENA</span>
          <h1 className="home-main-title">THE ULTIMATE CODING ARENA</h1>
          <p className="home-main-desc">
            An interactive coding battle platform where players can practice programming, compete against AI, challenge other players, complete coding levels, and climb the leaderboard.
          </p>

          <div className="home-hero-actions">
            <button
              className="btn btn-start home-enter-btn"
              onClick={() => {
                audioManager.playClick();
                onEnterArena();
              }}
            >
              ⚡ ENTER ARENA (LEVEL 1 CAMPAIGN) ⚡
            </button>
          </div>
        </div>

        {/* Player Quick Glance Bar */}
        {player && (
          <div className="home-player-bar">
            <div className="home-player-left">
              <span>WELCOME BACK, <strong>{player.username}</strong></span>
              <span className="home-player-elo">⚔️ {player.elo || 1000} ELO</span>
            </div>
            <div className="home-player-stats">
              <span>🪙 {player.coins || 0} Coins</span>
              <span>⚡ {player.xp || 0} XP</span>
              <span>🏆 {player.wins || 0} Wins</span>
            </div>
          </div>
        )}
      </div>

      {/* Feature Cards Grid */}
      <div className="home-features-section">
        <h2 className="features-section-title">ARENA MODES & FEATURES</h2>
        <div className="home-features-grid">
          {featureCards.map((card) => (
            <div
              key={card.id}
              className="feature-card glass-panel"
              style={{ "--card-color": card.color }}
              onClick={() => {
                audioManager.playClick();
                onNavigateSection(card.id);
              }}
            >
              <div className="feature-card-header">
                <span className="feature-card-icon">{card.icon}</span>
                <span className="feature-card-badge" style={{ borderColor: card.color, color: card.color }}>
                  {card.badge}
                </span>
              </div>
              <h3 className="feature-card-title">{card.title}</h3>
              <span className="feature-card-subtitle">{card.subtitle}</span>
              <p className="feature-card-desc">{card.description}</p>
              <div className="feature-card-footer">
                <span className="feature-action-btn" style={{ color: card.color }}>
                  EXPLORE {card.title} →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
