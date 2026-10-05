import { useEffect, useState } from "react";
import { fetchLeaderboard } from "../api.js";
import { getHeroById, eloTiers } from "../data/animeData.js";
import audioManager from "../services/audioManager.js";

const MEDALS = ["🥇", "🥈", "🥉"];

const TIER_DETAILS = [
  { name: "Silver", min: 0, icon: "🛡️", color: "#9CA3AF", perk: "Unlocks Basic 1v1 Battle Arena & AI Training" },
  { name: "Gold", min: 1200, icon: "⚔️", color: "#FBBF24", perk: "+10% Coin Bonus on all battle victories" },
  { name: "Platinum", min: 1600, icon: "💠", color: "#38BDF8", perk: "Unlocks Advanced Campaign Map Challenges" },
  { name: "Diamond", min: 2000, icon: "💎", color: "#A855F7", perk: "+25% XP Bonus & Exclusive Diamond Profile Badge" },
  { name: "Master", min: 2400, icon: "👑", color: "#EC4899", perk: "Unlocks Master Hero Dialogue & Special Sound FX" },
  { name: "Grandmaster", min: 2800, icon: "🔥", color: "#EF4444", perk: "+50% Coin & XP Match Rewards" },
  { name: "Legend", min: 3200, icon: "⚡", color: "#10B981", perk: "Global Legend Status & Hall of Fame Badge" },
  { name: "Coding King", min: 3600, icon: "🌟", color: "#FFD700", perk: "Ultimate Apex Coder Crown & Unlimited Arena Access" }
];

export default function LeaderboardPage({ currentUserId, onBack }) {
  const [leaderboard, setLeaderboard] = useState(null);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("leaderboard"); // 'leaderboard' | 'tiers'

  useEffect(() => {
    let cancelled = false;
    fetchLeaderboard()
      .then((data) => !cancelled && setLeaderboard(data.leaderboard || []))
      .catch((err) => !cancelled && setError(err.message));
    return () => {
      cancelled = true;
    };
  }, []);

  function handleTabChange(tab) {
    audioManager.playClick();
    setActiveTab(tab);
  }

  return (
    <div className="full-screen-section-container">
      {onBack && (
        <div style={{ marginBottom: 20 }}>
          <button className="back-btn" onClick={onBack} style={{ padding: "10px 20px", fontSize: 13 }}>
            ← BACK
          </button>
        </div>
      )}
      
      <div className="section-eyebrow">GLOBAL ESPORTS RANKINGS</div>
      <h2 className="section-title">Global Leaderboard & Rank Tiers</h2>

      {/* TABS NAVIGATION */}
      <div className="leaderboard-tabs-bar">
        <button
          className={`leaderboard-tab-btn ${activeTab === "leaderboard" ? "active" : ""}`}
          onClick={() => handleTabChange("leaderboard")}
        >
          🏆 Live Global Leaderboard
        </button>
        <button
          className={`leaderboard-tab-btn ${activeTab === "tiers" ? "active" : ""}`}
          onClick={() => handleTabChange("tiers")}
        >
          🎖️ Rank Tiers & Requirements
        </button>
      </div>

      {activeTab === "leaderboard" ? (
        <div className="leaderboard-panel glass-panel">
          <div className="leaderboard-row leaderboard-head">
            <span>Rank</span>
            <span>Coder & Champion</span>
            <span>Tier</span>
            <span>ELO</span>
            <span>Record</span>
            <span>Coins</span>
          </div>

          {error && <p className="auth-error" style={{ margin: "20px 0" }}>{error}</p>}
          {!leaderboard && !error && (
            <p className="lobby-status" style={{ padding: 30 }}>Synchronizing live global leaderboard rankings…</p>
          )}

          {leaderboard && leaderboard.length === 0 && (
            <div className="leaderboard-empty-state">
              <span className="empty-icon">🏆</span>
              <h4>No Registered Coders Yet</h4>
              <p>Be the first player to complete battles and claim Rank #1 on the Global Leaderboard!</p>
            </div>
          )}

          {leaderboard?.map((entry) => {
            const hero = getHeroById(entry.heroId);
            const isMe = entry.id === currentUserId;
            return (
              <div key={entry.id} className={`leaderboard-row ${isMe ? "me" : ""}`}>
                <span className="leaderboard-rank">
                  {entry.rank <= 3 ? MEDALS[entry.rank - 1] : `#${entry.rank}`}
                </span>
                <span className="leaderboard-coder">
                  <span style={{ color: hero.color, fontSize: 18, filter: `drop-shadow(0 0 6px ${hero.glow})` }}>
                    {hero.emoji}
                  </span>
                  <span>{entry.username}</span>
                  <span style={{ fontSize: 10, color: "var(--text-dim)", marginLeft: 4 }}>({hero.name})</span>
                  {isMe && <span className="leaderboard-you-tag">YOU</span>}
                </span>
                <span className="leaderboard-tier-tag" style={{ color: hero.color }}>{entry.tier}</span>
                <span className="leaderboard-elo">{entry.elo}</span>
                <span>
                  <span className="record-w">{entry.wins}W</span> / <span className="record-l">{entry.losses}L</span>
                </span>
                <span className="leaderboard-coins">{entry.coins} 🪙</span>
              </div>
            );
          })}
        </div>
      ) : (
        /* RANK TIERS SHOWCASE */
        <div className="rank-tiers-grid">
          {TIER_DETAILS.map((t) => (
            <div key={t.name} className="rank-tier-card glass-panel" style={{ "--tier-color": t.color }}>
              <div className="tier-card-header">
                <span className="tier-icon">{t.icon}</span>
                <div>
                  <h3 className="tier-name" style={{ color: t.color }}>{t.name}</h3>
                  <span className="tier-elo-range">Required ELO: {t.min}+</span>
                </div>
              </div>
              <p className="tier-perk">{t.perk}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
