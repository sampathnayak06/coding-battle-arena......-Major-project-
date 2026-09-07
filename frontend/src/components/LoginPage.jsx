import { useState } from "react";
import { login, setToken } from "../api.js";
import { reconnectSocketWithAuth } from "../socket.js";

export default function LoginPage({ onAuthed, onLoginGuest, onSwitchToSignup }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { token, user } = await login({ username, password });
      setToken(token);
      reconnectSocketWithAuth();
      onAuthed(user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-shell">
      <form className="auth-card glass-panel" onSubmit={handleSubmit}>
        <div className="auth-brand">
          <span className="navbar-brand-mark">⚔️</span>
          <span>CODING BATTLE ARENA</span>
        </div>
        <h2 className="auth-title">Welcome Back, Coder</h2>
        <p className="auth-subtitle">Sign in to enter the arena.</p>

        <label className="auth-label">Username or Email</label>
        <input
          className="auth-input"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="ShadowByte"
          autoFocus
          required
        />

        <label className="auth-label">Password</label>
        <input
          className="auth-input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
        />

        {error && <div className="auth-error">{error}</div>}

        <button className="btn btn-start auth-submit" type="submit" disabled={loading}>
          {loading ? "SIGNING IN…" : "⚔️ ENTER ARENA"}
        </button>

        <button type="button" className="btn btn-ghost auth-guest" onClick={onLoginGuest}>
          🎮 PLAY AS GUEST
        </button>

        <p className="auth-switch">
          New here?{" "}
          <button type="button" className="auth-link" onClick={onSwitchToSignup}>
            Create an account
          </button>
        </p>

        <p className="auth-hint">
          Try a demo account: any leaderboard username (e.g. <b>ShadowByte</b>) · password <b>battle123</b>
        </p>
      </form>
    </div>
  );
}
