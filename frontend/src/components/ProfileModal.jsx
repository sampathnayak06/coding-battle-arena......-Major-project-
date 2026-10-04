import { getHeroById, getTierForElo } from "../data/animeData.js";

export default function ProfileModal({ profile, onClose, onLogout }) {
  if (!profile) return null;

  const hero = getHeroById(profile.heroId || "naruto");
  const tier = getTierForElo(profile.elo || 1000);
  const playerLevel = Math.floor((profile.coins || 0) / 100) + 1;
  const winRate = profile.wins + profile.losses > 0
    ? Math.round((profile.wins / (profile.wins + profile.losses)) * 100)
    : 0;

  return (
    <div className="modal-overlay" style={{ zIndex: 1000 }}>
      <div
        className="glass-panel"
        style={{
          width: "90%",
          maxWidth: 520,
          padding: 28,
          borderRadius: 24,
          border: `2px solid ${hero.color || "var(--neon-cyan)"}`,
          boxShadow: `0 0 35px ${hero.color || "rgba(0, 229, 255, 0.4)"}`,
          position: "relative"
        }}
      >
        <button
          className="hint-close"
          onClick={onClose}
          style={{ position: "absolute", top: 16, right: 20, fontSize: 18, color: "var(--text-dim)" }}
        >
          ✕
        </button>

        {/* Profile Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 20 }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              background: "rgba(0,0,0,0.5)",
              border: `3px solid ${hero.color}`,
              display: "grid",
              placeItems: "center",
              fontSize: 36,
              boxShadow: `0 0 20px ${hero.color}60`
            }}
          >
            {hero.emoji}
          </div>
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 900, color: "#fff", margin: 0 }}>
              {profile.username}
            </h2>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  padding: "3px 10px",
                  borderRadius: 999,
                  background: `${hero.color}25`,
                  color: hero.color,
                  border: `1px solid ${hero.color}60`
                }}
              >
                {tier.name} · LVL {playerLevel}
              </span>
              <span style={{ fontSize: 11, color: "var(--text-dim)" }}>
                {profile.email || "Player Account"}
              </span>
            </div>
          </div>
        </div>

        {/* Main Stats Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 10,
            marginBottom: 20,
            background: "rgba(0,0,0,0.3)",
            padding: 14,
            borderRadius: 14,
            border: "1px solid rgba(255,255,255,0.06)"
          }}
        >
          <div style={{ textAlign: "center" }}>
            <span style={{ fontSize: 10, color: "var(--text-dim)", display: "block" }}>ELO RATING</span>
            <strong style={{ fontSize: 16, color: "var(--neon-cyan)" }}>{profile.elo || 1000}</strong>
          </div>
          <div style={{ textAlign: "center" }}>
            <span style={{ fontSize: 10, color: "var(--text-dim)", display: "block" }}>TOTAL XP</span>
            <strong style={{ fontSize: 16, color: "var(--neon-purple-soft)" }}>{profile.xp || 0}</strong>
          </div>
          <div style={{ textAlign: "center" }}>
            <span style={{ fontSize: 10, color: "var(--text-dim)", display: "block" }}>COINS</span>
            <strong style={{ fontSize: 16, color: "#ffd700" }}>{profile.coins || 0} 🪙</strong>
          </div>
          <div style={{ textAlign: "center" }}>
            <span style={{ fontSize: 10, color: "var(--text-dim)", display: "block" }}>WIN RATE</span>
            <strong style={{ fontSize: 16, color: "#22c55e" }}>{winRate}%</strong>
          </div>
        </div>

        {/* Battle Record */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: "var(--text-dim)", letterSpacing: "0.1em", marginBottom: 8 }}>
            BATTLE RECORD
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <div className="glass-panel" style={{ flex: 1, padding: "10px 14px", textAlign: "center", background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.3)" }}>
              <span style={{ fontSize: 20, fontWeight: 900, color: "#22c55e" }}>{profile.wins || 0}</span>
              <span style={{ display: "block", fontSize: 10, color: "var(--text-dim)" }}>VICTORIES</span>
            </div>
            <div className="glass-panel" style={{ flex: 1, padding: "10px 14px", textAlign: "center", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.3)" }}>
              <span style={{ fontSize: 20, fontWeight: 900, color: "#ef4444" }}>{profile.losses || 0}</span>
              <span style={{ display: "block", fontSize: 10, color: "var(--text-dim)" }}>DEFEATS</span>
            </div>
            <div className="glass-panel" style={{ flex: 1, padding: "10px 14px", textAlign: "center", background: "rgba(255,215,0,0.08)", border: "1px solid rgba(255,215,0,0.3)" }}>
              <span style={{ fontSize: 20, fontWeight: 900, color: "#ffd700" }}>{profile.winStreak || 0} 🔥</span>
              <span style={{ display: "block", fontSize: 10, color: "var(--text-dim)" }}>WIN STREAK</span>
            </div>
          </div>
        </div>

        {/* Hero Skills */}
        {profile.skills && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: "var(--text-dim)", letterSpacing: "0.1em", marginBottom: 8 }}>
              CODING MASTERY SKILLS
            </div>
            <div style={{ display: "grid", gap: 6 }}>
              {Object.entries(profile.skills).map(([skillName, val]) => (
                <div key={skillName} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 11 }}>
                  <span style={{ width: 140, textTransform: "capitalize", color: "var(--text-dim)" }}>{skillName.replace(/([A-Z])/g, ' $1')}</span>
                  <div style={{ flex: 1, height: 6, background: "rgba(255,255,255,0.08)", borderRadius: 999, overflow: "hidden" }}>
                    <div style={{ width: `${val}%`, height: "100%", background: "linear-gradient(90deg, var(--neon-cyan), var(--neon-purple))", borderRadius: 999 }} />
                  </div>
                  <span style={{ width: 36, textAlign: "right", fontWeight: 700, color: "#fff" }}>{val}%</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Badges */}
        {Array.isArray(profile.badges) && profile.badges.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: "var(--text-dim)", letterSpacing: "0.1em", marginBottom: 8 }}>
              EARNED BADGES
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {profile.badges.map((b) => (
                <span key={b} style={{ fontSize: 10, fontWeight: 800, padding: "4px 10px", borderRadius: 8, background: "rgba(0,229,255,0.12)", color: "var(--neon-cyan)", border: "1px solid rgba(0,229,255,0.3)" }}>
                  🏆 {b}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
          <button className="btn btn-ghost" onClick={onClose} style={{ flex: 1 }}>
            Close
          </button>
          {onLogout && (
            <button className="btn back-btn" onClick={onLogout} style={{ flex: 1, background: "rgba(239,68,68,0.15)", borderColor: "#ef4444", color: "#fca5a5" }}>
              🚪 Log Out
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
