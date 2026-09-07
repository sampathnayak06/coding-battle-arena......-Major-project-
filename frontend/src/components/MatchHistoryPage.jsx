import { useState } from "react";
import { animeHeroes } from "../data/animeData.js";

function formatDate(isoStr) {
  if (!isoStr) return "Recently";
  try {
    const date = new Date(isoStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / (3600000 * 24));

    if (diffMins < 2) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
  } catch (e) {
    return "Recently";
  }
}

export default function MatchHistoryPage({ player }) {
  const [filterResult, setFilterResult] = useState("all"); // all | victory | defeat

  const hero = animeHeroes.find((h) => h.id === player.heroId) || animeHeroes[0];
  const history = Array.isArray(player.matchHistory) ? player.matchHistory : [];

  const totalMatches = player.wins + player.losses || history.length || 0;
  const winRate = totalMatches > 0 ? Math.round((player.wins / totalMatches) * 100) : 0;

  const filteredHistory = history.filter((m) => {
    if (filterResult === "victory") return m.result === "VICTORY";
    if (filterResult === "defeat") return m.result === "DEFEAT";
    return true;
  });

  return (
    <div className="history-page glass-panel" style={{ padding: "28px", borderRadius: 16 }}>
      {/* Header Banner */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${hero.color}40, transparent)`,
              border: `2px solid ${hero.color}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 28
            }}
          >
            {hero.emoji}
          </div>
          <div>
            <div className="section-eyebrow" style={{ marginBottom: 2 }}>CAREER LOGS</div>
            <h2 className="section-title" style={{ margin: 0, fontSize: 24 }}>
              Battle History — {player.username || "Player"}
            </h2>
          </div>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <button
            className={`btn ${filterResult === "all" ? "btn-start" : "btn-ghost"}`}
            style={{ padding: "8px 16px", fontSize: 12 }}
            onClick={() => setFilterResult("all")}
          >
            ALL MATCHES ({history.length})
          </button>
          <button
            className={`btn ${filterResult === "victory" ? "btn-start" : "btn-ghost"}`}
            style={{ padding: "8px 16px", fontSize: 12, borderColor: "#22C55E", color: filterResult === "victory" ? "#fff" : "#22C55E" }}
            onClick={() => setFilterResult("victory")}
          >
            🏆 WINS
          </button>
          <button
            className={`btn ${filterResult === "defeat" ? "btn-start" : "btn-ghost"}`}
            style={{ padding: "8px 16px", fontSize: 12, borderColor: "#EF4444", color: filterResult === "defeat" ? "#fff" : "#EF4444" }}
            onClick={() => setFilterResult("defeat")}
          >
            💀 LOSSES
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 14, marginBottom: 24 }}>
        <div className="glass-panel" style={{ padding: "14px 18px", borderRadius: 12 }}>
          <div style={{ fontSize: 11, color: "var(--text-dim)", textTransform: "uppercase" }}>Total Duels</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: "var(--neon-cyan)", marginTop: 4 }}>{totalMatches}</div>
        </div>
        <div className="glass-panel" style={{ padding: "14px 18px", borderRadius: 12 }}>
          <div style={{ fontSize: 11, color: "var(--text-dim)", textTransform: "uppercase" }}>Win Rate</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: winRate >= 50 ? "#22C55E" : "#F59E0B", marginTop: 4 }}>{winRate}%</div>
        </div>
        <div className="glass-panel" style={{ padding: "14px 18px", borderRadius: 12 }}>
          <div style={{ fontSize: 11, color: "var(--text-dim)", textTransform: "uppercase" }}>Current ELO</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: "#FFD700", marginTop: 4 }}>{player.elo || 1000}</div>
        </div>
        <div className="glass-panel" style={{ padding: "14px 18px", borderRadius: 12 }}>
          <div style={{ fontSize: 11, color: "var(--text-dim)", textTransform: "uppercase" }}>Arena Coins</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: "#F97316", marginTop: 4 }}>{player.coins || 0} 🪙</div>
        </div>
      </div>

      {/* History List */}
      {filteredHistory.length === 0 ? (
        <div className="glass-panel" style={{ padding: "40px 20px", textAlign: "center", borderRadius: 12 }}>
          <div style={{ fontSize: 36, marginBottom: 10 }}>📜</div>
          <h3 style={{ margin: "0 0 6px 0", color: "var(--text-primary)" }}>No Match Logs Found</h3>
          <p style={{ margin: 0, fontSize: 13, color: "var(--text-dim)" }}>
            Play an AI Practice duel or 1v1 Battle Arena match to record your career performance here!
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {filteredHistory.map((m, idx) => {
            const isWin = m.result === "VICTORY";
            return (
              <div
                key={m.id || idx}
                className="glass-panel"
                style={{
                  padding: "16px 20px",
                  borderRadius: 12,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 16,
                  borderLeft: `4px solid ${isWin ? "#22C55E" : "#EF4444"}`,
                  background: "rgba(255, 255, 255, 0.02)"
                }}
              >
                {/* Result & Mode */}
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <div
                    style={{
                      padding: "6px 12px",
                      borderRadius: 8,
                      fontWeight: 800,
                      fontSize: 12,
                      background: isWin ? "rgba(34, 197, 94, 0.15)" : "rgba(239, 68, 68, 0.15)",
                      color: isWin ? "#22C55E" : "#EF4444",
                      border: `1px solid ${isWin ? "#22C55E" : "#EF4444"}40`,
                      minWidth: 90,
                      textAlign: "center"
                    }}
                  >
                    {isWin ? "🏆 VICTORY" : "💀 DEFEAT"}
                  </div>

                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15, color: "#fff", display: "flex", alignItems: "center", gap: 8 }}>
                      <span>{m.language || "HTML"}</span>
                      <span style={{ fontSize: 11, opacity: 0.6 }}>•</span>
                      <span style={{ fontSize: 12, color: "var(--neon-cyan)" }}>{m.levelName || "Level 1: Novice"}</span>
                    </div>
                    <div style={{ fontSize: 12, color: "var(--text-dim)", marginTop: 2 }}>
                      {m.mode || "AI Practice"} • {formatDate(m.timestamp)}
                    </div>
                  </div>
                </div>

                {/* Score & Accuracy */}
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>
                    {m.questionsCleared} / {m.totalQuestions || 14} Cleared
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text-dim)", marginTop: 2 }}>
                    {m.accuracy}% Accuracy
                  </div>
                </div>

                {/* Rewards & ELO */}
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontWeight: 800, fontSize: 14, color: isWin ? "#22C55E" : "#EF4444" }}>
                    {m.eloDelta >= 0 ? `+${m.eloDelta}` : m.eloDelta} ELO
                  </div>
                  <div style={{ fontSize: 12, color: "#F97316", marginTop: 2 }}>
                    +{m.coinsEarned || 0} Coins
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
