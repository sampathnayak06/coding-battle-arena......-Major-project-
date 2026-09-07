import { useState } from "react";
import { signup, setToken } from "../api.js";
import { reconnectSocketWithAuth } from "../socket.js";
import { animeHeroes, getHeroById } from "../data/animeData.js";
import audioManager from "../services/audioManager.js";

export default function SignupPage({ onAuthed, onSwitchToLogin }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [heroId, setHeroId] = useState("kairo");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const selectedHero = getHeroById(heroId);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { token, user } = await signup({ username, email, password, heroId });
      setToken(token);
      reconnectSocketWithAuth();
      onAuthed(user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleSelectHero(id) {
    setHeroId(id);
    audioManager.playClick();
  }

  return (
    <div className="auth-shell">
      <form className="auth-card glass-panel auth-card-wide" onSubmit={handleSubmit} style={{ maxWidth: 880 }}>
        <div className="auth-brand">
          <span className="navbar-brand-mark">⚔️</span>
          <span>CODING BATTLE ARENA</span>
        </div>
        <h2 className="auth-title">Select Your Cyberpunk Champion</h2>
        <p className="auth-subtitle">Pick your main character, inspect their combat matrix, and step into the esports arena.</p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 }}>
          {/* Account Credentials */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div>
              <label className="auth-label">Codename / Username</label>
              <input
                className="auth-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="CyberNetrunner_99"
                autoFocus
                required
              />
            </div>

            <div>
              <label className="auth-label">Neural Link Email</label>
              <input
                className="auth-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@arena.dev"
                required
              />
            </div>

            <div>
              <label className="auth-label">Access Passcode</label>
              <input
                className="auth-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 4 characters"
                required
              />
            </div>

            {/* Character Selector Grid */}
            <label className="auth-label" style={{ marginTop: 8 }}>Select Character</label>
            <div className="hero-picker" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
              {animeHeroes.map((h) => {
                const isSelected = selectedHero.id === h.id;
                return (
                  <button
                    type="button"
                    key={h.id}
                    className={`hero-picker-item ${isSelected ? "selected" : ""}`}
                    style={{
                      "--hero-color": h.color,
                      borderColor: isSelected ? h.color : "rgba(255, 255, 255, 0.1)",
                      background: isSelected ? `${h.color}25` : "rgba(0, 0, 0, 0.4)",
                      padding: "10px 4px",
                      borderRadius: 10,
                      cursor: "pointer",
                      transform: isSelected ? "scale(1.06)" : "scale(1)",
                      transition: "all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
                    }}
                    onClick={() => handleSelectHero(h.id)}
                  >
                    <span style={{ fontSize: 24, display: "block", filter: `drop-shadow(0 0 8px ${h.glow})` }}>{h.emoji}</span>
                    <span style={{ fontSize: 11, fontWeight: 800, color: isSelected ? h.color : "#fff", display: "block", marginTop: 4 }}>
                      {h.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Character Preview Panel */}
          <div
            className="glass-panel"
            style={{
              padding: 20,
              borderRadius: 16,
              border: `2px solid ${selectedHero.color}`,
              boxShadow: `0 0 24px ${selectedHero.glow}30`,
              background: `linear-gradient(180deg, ${selectedHero.color}15, rgba(0, 0, 0, 0.6))`,
              display: "flex",
              flexDirection: "column",
              justify: "space-between"
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 11, fontWeight: 900, background: selectedHero.color, color: "#000", padding: "2px 8px", borderRadius: 6 }}>
                  {selectedHero.rank} · LEVEL {selectedHero.level}
                </span>
                <span style={{ fontSize: 28 }}>{selectedHero.emoji}</span>
              </div>

              <h3 style={{ margin: "8px 0 2px 0", fontSize: 22, color: selectedHero.color }}>{selectedHero.name}</h3>
              <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-dim)", marginBottom: 12 }}>{selectedHero.title}</div>
              <p style={{ fontSize: 11, color: "var(--text-primary)", lineHeight: 1.4, margin: "0 0 12px 0" }}>{selectedHero.description}</p>

              {/* Combat Matrix Stats */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
                {Object.entries(selectedHero.stats).map(([stat, val]) => (
                  <div key={stat} style={{ background: "rgba(0, 0, 0, 0.4)", padding: "6px 8px", borderRadius: 6, border: "1px solid rgba(255, 255, 255, 0.05)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, fontWeight: 800, color: "var(--text-dim)" }}>
                      <span>{stat.toUpperCase()}</span>
                      <span>{val}</span>
                    </div>
                    <div style={{ height: 4, background: "rgba(255, 255, 255, 0.1)", borderRadius: 999, overflow: "hidden", marginTop: 4 }}>
                      <div style={{ width: `${val}%`, height: "100%", background: selectedHero.color }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Abilities Showcase */}
              <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 11 }}>
                <div style={{ background: "rgba(0, 0, 0, 0.4)", padding: 8, borderRadius: 6, borderLeft: `3px solid ${selectedHero.color}` }}>
                  <strong style={{ color: selectedHero.color }}>PASSIVE: </strong>{selectedHero.passive}
                </div>
                <div style={{ background: "rgba(0, 0, 0, 0.4)", padding: 8, borderRadius: 6, borderLeft: "3px solid #00e5ff" }}>
                  <strong style={{ color: "#00e5ff" }}>ABILITY: </strong>{selectedHero.ability}
                </div>
                <div style={{ background: "rgba(0, 0, 0, 0.4)", padding: 8, borderRadius: 6, borderLeft: "3px solid #ff2e88" }}>
                  <strong style={{ color: "#ff2e88" }}>ULTIMATE: </strong>{selectedHero.ultimate}
                </div>
              </div>
            </div>

            <div style={{ marginTop: 12, fontSize: 11, fontStyle: "italic", color: "var(--text-dim)", textAlign: "center" }}>
              "{selectedHero.dialogue.matchStart}"
            </div>
          </div>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <button className="btn btn-start auth-submit" type="submit" disabled={loading} style={{ background: `linear-gradient(90deg, ${selectedHero.color}, #9d4edd)` }}>
          {loading ? "INITIALIZING CHAMPION…" : `⚔️ SELECT ${selectedHero.name} & ENTER ARENA`}
        </button>

        <p className="auth-switch">
          Already registered?{" "}
          <button type="button" className="auth-link" onClick={onSwitchToLogin}>
            Sign in
          </button>
        </p>
      </form>
    </div>
  );
}
