import { useState, useEffect } from "react";
import { signup, sendSignupCode, setToken } from "../api.js";
import { reconnectSocketWithAuth } from "../socket.js";
import { animeHeroes, getHeroById } from "../data/animeData.js";
import audioManager from "../services/audioManager.js";

export default function SignupPage({ onAuthed, onSwitchToLogin }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [heroId, setHeroId] = useState("kairo");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // Email verification step state
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [devCode, setDevCode] = useState("");
  const [countdown, setCountdown] = useState(0);

  const selectedHero = getHeroById(heroId);

  // Resend cooldown timer
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((c) => c - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  // Step 1: Request Email Verification Code
  async function handleRequestCode(e) {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    const cleanUsername = username.trim();
    const cleanEmail = email.trim();
    const cleanPassword = password.trim();

    if (!cleanUsername) {
      setError("Please choose a Codename / Username (min 3 characters).");
      return;
    }
    if (cleanUsername.length < 3) {
      setError("Codename must be at least 3 characters long.");
      return;
    }
    if (!cleanEmail) {
      setError("Please enter a valid, real email address.");
      return;
    }
    // Basic regex check before hitting server
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setError("Invalid email format. Please provide a real email (e.g. coder@gmail.com).");
      return;
    }
    if (!cleanPassword || cleanPassword.length < 4) {
      setError("Passcode must be at least 4 characters long.");
      return;
    }

    setLoading(true);
    try {
      const res = await sendSignupCode({
        username: cleanUsername,
        email: cleanEmail
      });

      if (res.devCode) {
        setDevCode(res.devCode);
      }
      setSuccessMsg(`Verification code dispatched to ${res.maskedEmail || cleanEmail}!`);
      setIsVerifying(true);
      setCountdown(60);
      audioManager.playClick();
    } catch (err) {
      setError(err.message || "Failed to verify email address. Please ensure it is a real email.");
    } finally {
      setLoading(false);
    }
  }

  // Step 2: Confirm 6-Digit Code and Complete Account Registration
  async function handleVerifyAndSignup(e) {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    const cleanCode = verificationCode.trim();
    if (!cleanCode || cleanCode.length < 6) {
      setError("Please enter the complete 6-digit verification code sent to your email.");
      return;
    }

    setLoading(true);
    try {
      const { token, user } = await signup({
        username: username.trim(),
        email: email.trim(),
        password: password.trim(),
        heroId,
        verificationCode: cleanCode
      });
      setToken(token);
      reconnectSocketWithAuth();
      onAuthed(user);
    } catch (err) {
      setError(err.message || "Failed to verify code and create account.");
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
      {!isVerifying ? (
        <form className="auth-card glass-panel auth-card-wide" onSubmit={handleRequestCode} style={{ maxWidth: 880 }}>
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
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <label className="auth-label" style={{ margin: "12px 0 6px" }}>Real Email Address</label>
                  <span style={{ fontSize: 10, color: "var(--neon-cyan)", fontWeight: 700 }}>GOOGLE MAIL VERIFIED</span>
                </div>
                <input
                  className="auth-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@gmail.com"
                  required
                />
                <span style={{ display: "block", fontSize: 11, color: "var(--text-dim)", marginTop: 4 }}>
                  🛡️ Real email required: A 6-digit verification code will be sent to confirm ownership.
                </span>
              </div>

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <label className="auth-label" style={{ margin: "12px 0 6px" }}>Access Passcode</label>
                  <button
                    type="button"
                    className="auth-link"
                    style={{ fontSize: 11, fontWeight: "600", cursor: "pointer", border: "none", background: "none" }}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "HIDE" : "SHOW"}
                  </button>
                </div>
                <input
                  className="auth-input"
                  type={showPassword ? "text" : "password"}
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
                justifyContent: "space-between"
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
          {successMsg && <div className="auth-success">{successMsg}</div>}

          <button className="btn btn-start auth-submit" type="submit" disabled={loading} style={{ background: `linear-gradient(90deg, ${selectedHero.color}, #9d4edd)` }}>
            {loading ? "VERIFYING EMAIL & DISPATCHING CODE…" : `📨 VERIFY EMAIL & SELECT ${selectedHero.name}`}
          </button>

          <p className="auth-switch">
            Already registered?{" "}
            <button type="button" className="auth-link" onClick={onSwitchToLogin}>
              Sign in
            </button>
          </p>
        </form>
      ) : (
        /* Step 2: Email Verification Code Entry */
        <form className="auth-card glass-panel" onSubmit={handleVerifyAndSignup} style={{ maxWidth: 480 }}>
          <div className="auth-brand">
            <span className="navbar-brand-mark">⚔️</span>
            <span>CODING BATTLE ARENA</span>
          </div>

          <div style={{ textAlign: "center", margin: "10px 0 16px" }}>
            <span style={{ fontSize: 44, display: "inline-block", filter: `drop-shadow(0 0 12px ${selectedHero.glow})` }}>
              {selectedHero.emoji}
            </span>
            <h2 className="auth-title" style={{ marginTop: 8 }}>Confirm Real Email</h2>
            <p className="auth-subtitle">
              We dispatched a 6-digit security code to <br />
              <strong style={{ color: "var(--neon-cyan)" }}>{email}</strong>
            </p>
          </div>

          {devCode && (
            <div style={{ background: "rgba(0, 229, 255, 0.1)", border: "1px dashed var(--neon-cyan)", borderRadius: 8, padding: "8px 12px", margin: "10px 0", fontSize: 12, color: "var(--neon-cyan)", textAlign: "center" }}>
              🔑 <strong>Dev Mode Code:</strong> <code>{devCode}</code>
            </div>
          )}

          <label className="auth-label">Enter 6-Digit Verification Code</label>
          <input
            className="auth-input"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value.replace(/[^0-9]/g, "").slice(0, 6))}
            placeholder="• • • • • •"
            maxLength={6}
            style={{
              textAlign: "center",
              fontSize: "24px",
              fontWeight: 800,
              letterSpacing: "0.3em",
              color: "var(--neon-cyan)"
            }}
            autoFocus
            required
          />

          {error && <div className="auth-error">{error}</div>}
          {successMsg && <div className="auth-success">{successMsg}</div>}

          <button
            className="btn btn-start auth-submit"
            type="submit"
            disabled={loading}
            style={{ background: `linear-gradient(90deg, ${selectedHero.color}, #00e5ff)` }}
          >
            {loading ? "INITIALIZING CHAMPION…" : `⚔️ ACTIVATE ${selectedHero.name} & ENTER ARENA`}
          </button>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 14 }}>
            <button
              type="button"
              className="auth-link"
              style={{ fontSize: "12px", border: "none", background: "none", cursor: countdown > 0 ? "not-allowed" : "pointer", opacity: countdown > 0 ? 0.6 : 1 }}
              disabled={countdown > 0 || loading}
              onClick={handleRequestCode}
            >
              {countdown > 0 ? `Resend Code in ${countdown}s` : "🔄 Resend Code"}
            </button>

            <button
              type="button"
              className="auth-link"
              style={{ fontSize: "12px", border: "none", background: "none", cursor: "pointer", color: "var(--text-dim)" }}
              onClick={() => {
                setIsVerifying(false);
                setVerificationCode("");
                setError("");
                setSuccessMsg("");
              }}
            >
              Edit Details / Email
            </button>
          </div>

          <p className="auth-switch" style={{ marginTop: 20 }}>
            Already have an account?{" "}
            <button type="button" className="auth-link" onClick={onSwitchToLogin}>
              Sign in
            </button>
          </p>
        </form>
      )}
    </div>
  );
}
