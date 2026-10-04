import { useEffect, useState } from "react";
import { fetchDailyGame, fetchDailyLeaderboard } from "../api.js";
import { getHeroById } from "../data/animeData.js";
import audioManager from "../services/audioManager.js";

export default function DailyGamesPage({ player, onStartDailyGame, onBack }) {
  const [challenge, setChallenge] = useState(null);
  const [completedToday, setCompletedToday] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [gameRes, boardRes] = await Promise.all([
        fetchDailyGame(),
        fetchDailyLeaderboard()
      ]);

      setChallenge(gameRes.challenge);
      setCompletedToday(gameRes.completedToday);
      setLeaderboard(boardRes.leaderboard || []);
    } catch (err) {
      console.error("[DailyGamesPage] load error:", err);
      setError("Failed to load daily game details.");
    } finally {
      setLoading(false);
    }
  }

  function handleStart() {
    if (completedToday || !challenge) return;
    audioManager.playClick();
    onStartDailyGame(challenge);
  }

  if (loading) {
    return (
      <div className="daily-page glass-panel" style={{ padding: 40, textAlign: "center" }}>
        <p className="lobby-status">Loading Daily Challenge & Leaderboard…</p>
      </div>
    );
  }

  return (
    <div className="daily-page glass-panel">
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <button className="back-btn" onClick={onBack}>
            ◄ HOME HUB
          </button>
          <div>
            <h1 className="campaign-title">🔥 DAILY GAMES</h1>
            <p className="campaign-subtitle">One global challenge every 24 hours · Play & rank on the Daily Leaderboard</p>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(255, 215, 0, 0.1)", padding: "8px 14px", borderRadius: 12, border: "1px solid rgba(255, 215, 0, 0.3)" }}>
          <span style={{ fontSize: 18 }}>📅</span>
          <span style={{ fontWeight: 800, fontSize: 13, color: "#ffd700", fontFamily: "var(--font-mono)" }}>
            {challenge?.date}
          </span>
        </div>
      </div>

      {error && <div className="auth-error" style={{ marginBottom: 16 }}>{error}</div>}

      {/* Main Grid: Today's Challenge Card (Left) + Daily Leaderboard (Right) */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        {/* Today's Challenge Panel */}
        <div className="glass-panel" style={{ padding: 24, borderRadius: 20, border: "1px solid var(--neon-cyan)", boxShadow: "0 0 24px rgba(0, 229, 255, 0.2)" }}>
          <div style={{ fontSize: 11, fontWeight: 900, color: "var(--neon-cyan)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 6 }}>
            TODAY'S FEATURED CHALLENGE
          </div>
          <h2 style={{ fontSize: 24, fontWeight: 900, color: "#fff", margin: "0 0 6px 0" }}>
            {challenge?.title || "Daily Duel"}
          </h2>
          <p style={{ color: "var(--text-dim)", fontSize: 13, marginBottom: 20 }}>
            {challenge?.subtitle || "Global contest for all arena players."}
          </p>

          {/* Details Pill Matrix */}
          <div style={{ background: "rgba(0,0,0,0.4)", borderRadius: 14, padding: 16, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24, border: "1px solid rgba(255,255,255,0.08)" }}>
            <div>
              <span style={{ fontSize: 10, color: "var(--text-dim)", display: "block" }}>LANGUAGE</span>
              <strong style={{ color: "#ffd700", textTransform: "uppercase", fontSize: 14 }}>{challenge?.language}</strong>
            </div>
            <div>
              <span style={{ fontSize: 10, color: "var(--text-dim)", display: "block" }}>DIFFICULTY</span>
              <strong style={{ color: "#22c55e", fontSize: 14 }}>{challenge?.difficulty}</strong>
            </div>
            <div>
              <span style={{ fontSize: 10, color: "var(--text-dim)", display: "block" }}>TIME LIMIT</span>
              <strong style={{ color: "#fff", fontSize: 14 }}>{challenge?.timeLimitMinutes} Mins</strong>
            </div>
            <div>
              <span style={{ fontSize: 10, color: "var(--text-dim)", display: "block" }}>DAILY REWARDS</span>
              <strong style={{ color: "#00e5ff", fontSize: 14 }}>+{challenge?.rewards?.xp || 100} XP · +{challenge?.rewards?.coins || 50} 🪙</strong>
            </div>
          </div>

          {/* Completion Status / Start Button */}
          {completedToday ? (
            <div style={{ background: "rgba(34, 197, 94, 0.15)", border: "1px solid #22c55e", padding: 16, borderRadius: 14, textAlign: "center" }}>
              <div style={{ fontSize: 24, marginBottom: 4 }}>✓</div>
              <div style={{ fontWeight: 900, fontSize: 15, color: "#22c55e" }}>
                DAILY CHALLENGE COMPLETED
              </div>
              <div style={{ fontSize: 12, color: "var(--text-dim)", marginTop: 4 }}>
                Rewards claimed! Come back tomorrow for the next challenge.
              </div>
            </div>
          ) : (
            <button
              className="btn btn-start"
              onClick={handleStart}
              style={{ width: "100%", padding: "16px", fontSize: 15, background: "linear-gradient(90deg, #ff7a00, var(--neon-cyan))" }}
            >
              🔥 PLAY TODAY'S CHALLENGE
            </button>
          )}
        </div>

        {/* Daily Leaderboard Panel */}
        <div className="glass-panel" style={{ padding: 24, borderRadius: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 900, color: "#ffd700", letterSpacing: "0.1em", display: "flex", alignItems: "center", gap: 6 }}>
              <span>🏆</span> TODAY'S LEADERBOARD
            </div>
            <span style={{ fontSize: 11, color: "var(--text-dim)" }}>Top 50 Coders</span>
          </div>

          <div className="daily-leaderboard-table-wrapper" style={{ maxHeight: 380, overflowY: "auto" }}>
            {leaderboard.length === 0 ? (
              <p style={{ color: "var(--text-dim)", fontStyle: "italic", textAlign: "center", padding: 30 }}>
                No completions recorded yet today. Be the first to claim the #1 spot!
              </p>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", color: "var(--text-dim)", textAlign: "left", fontSize: 11 }}>
                    <th style={{ padding: 8 }}>RANK</th>
                    <th style={{ padding: 8 }}>PLAYER</th>
                    <th style={{ padding: 8, textAlign: "right" }}>SCORE</th>
                    <th style={{ padding: 8, textAlign: "right" }}>ACCURACY</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((entry) => {
                    const hero = getHeroById(entry.heroId || "naruto");
                    const isMe = entry.userId === player?.id;
                    return (
                      <tr
                        key={entry.id}
                        style={{
                          borderBottom: "1px solid rgba(255,255,255,0.04)",
                          background: isMe ? "rgba(0, 229, 255, 0.12)" : "transparent"
                        }}
                      >
                        <td style={{ padding: "10px 8px", fontWeight: 800, color: entry.rank === 1 ? "#ffd700" : entry.rank === 2 ? "#e2e8f0" : entry.rank === 3 ? "#b45309" : "var(--text-dim)" }}>
                          #{entry.rank}
                        </td>
                        <td style={{ padding: "10px 8px", display: "flex", alignItems: "center", gap: 8 }}>
                          <span>{hero.emoji}</span>
                          <span style={{ fontWeight: isMe ? 800 : 600, color: isMe ? "var(--neon-cyan)" : "#fff" }}>
                            {entry.username} {isMe ? "(You)" : ""}
                          </span>
                        </td>
                        <td style={{ padding: "10px 8px", textAlign: "right", fontWeight: 800, color: "#ffd700" }}>
                          {entry.score}
                        </td>
                        <td style={{ padding: "10px 8px", textAlign: "right", color: "#22c55e" }}>
                          {entry.accuracy}%
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
