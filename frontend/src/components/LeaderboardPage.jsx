import { useEffect, useState } from "react";
import { fetchLeaderboard } from "../api.js";
import { getHeroById } from "../data/animeData.js";

const MEDALS = ["🥇", "🥈", "🥉"];

export default function LeaderboardPage({ currentUserId }) {
  const [leaderboard, setLeaderboard] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    fetchLeaderboard()
      .then((data) => !cancelled && setLeaderboard(data.leaderboard))
      .catch((err) => !cancelled && setError(err.message));
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div>
      <div className="section-eyebrow">GLOBAL ESPORTS RANKINGS</div>
      <h2 className="section-title">Global Leaderboard & Rank Tiers</h2>

      <div className="leaderboard-panel glass-panel">
        <div className="leaderboard-row leaderboard-head">
          <span>Rank</span>
          <span>Coder & Champion</span>
          <span>Tier</span>
          <span>ELO</span>
          <span>Record</span>
          <span>Coins</span>
        </div>

        {error && <p className="auth-error">{error}</p>}
        {!leaderboard && !error && <p className="lobby-status">Synchronizing global leaderboard rankings…</p>}

        {leaderboard?.map((entry) => {
          const hero = getHeroById(entry.heroId);
          const isMe = entry.id === currentUserId;
          return (
            <div key={entry.id} className={`leaderboard-row ${isMe ? "me" : ""}`}>
              <span className="leaderboard-rank">
                {entry.rank <= 3 ? MEDALS[entry.rank - 1] : `#${entry.rank}`}
              </span>
              <span className="leaderboard-coder">
                <span style={{ color: hero.color, fontSize: 18, filter: `drop-shadow(0 0 6px ${hero.glow})` }}>{hero.emoji}</span>
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
    </div>
  );
}
