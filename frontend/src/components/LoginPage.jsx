import { useState } from "react";
import { login, resetPassword, setToken } from "../api.js";
import { reconnectSocketWithAuth } from "../socket.js";
import QRCodeModal from "./QRCodeModal.jsx";
import QRScannerModal from "./QRScannerModal.jsx";
import { isMobileDevice } from "../utils/device.js";

export default function LoginPage({ onAuthed, onLoginGuest, onSwitchToSignup }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [showScannerModal, setShowScannerModal] = useState(false);

  // Forgot Password state
  const [isForgotMode, setIsForgotMode] = useState(false);
  const [forgotIdentifier, setForgotIdentifier] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const isMobile = isMobileDevice();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
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

  async function handleForgotPasswordSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    const cleanId = forgotIdentifier.trim();
    if (!cleanId) {
      setError("Please enter your username or registered email.");
      return;
    }
    if (!newPassword || newPassword.length < 4) {
      setError("New password must be at least 4 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match. Please verify both fields.");
      return;
    }

    setLoading(true);
    try {
      const res = await resetPassword({ identifier: cleanId, newPassword });
      setSuccessMsg("Password reset successfully! Logging you in...");
      setTimeout(() => {
        if (res.token && res.user) {
          setToken(res.token);
          reconnectSocketWithAuth();
          onAuthed(res.user);
        } else {
          setIsForgotMode(false);
          setUsername(cleanId);
          setPassword(newPassword);
          setSuccessMsg("");
        }
      }, 1000);
    } catch (err) {
      setError(err.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-shell">
      {!isForgotMode ? (
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
            placeholder="user@gmail.com or ShadowByte"
            autoFocus
            required
          />

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12, marginBottom: 6 }}>
            <label className="auth-label" style={{ margin: 0 }}>Password</label>
            <button
              type="button"
              className="auth-link"
              style={{ fontSize: "11px", fontWeight: "600", cursor: "pointer", border: "none", background: "none" }}
              onClick={() => {
                setIsForgotMode(true);
                setForgotIdentifier(username);
                setNewPassword("");
                setConfirmPassword("");
                setError("");
                setSuccessMsg("");
              }}
            >
              Forgot Password?
            </button>
          </div>
          <div style={{ position: "relative" }}>
            <input
              className="auth-input"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{ width: "100%", paddingRight: "44px" }}
              required
            />
            <button
              type="button"
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                color: "var(--neon-cyan)",
                fontSize: "11px",
                cursor: "pointer",
                fontWeight: "600"
              }}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "HIDE" : "SHOW"}
            </button>
          </div>

          {error && <div className="auth-error">{error}</div>}
          {successMsg && <div className="auth-success">{successMsg}</div>}

          <button className="btn btn-start auth-submit" type="submit" disabled={loading}>
            {loading ? "SIGNING IN…" : "⚔️ ENTER ARENA"}
          </button>

          <div style={{ display: "flex", gap: 10, marginTop: 10, marginBottom: 10 }}>
            <button type="button" className="btn btn-ghost" style={{ flex: 1, fontSize: 12 }} onClick={onLoginGuest}>
              🎮 PLAY AS GUEST
            </button>
            {!isMobile ? (
              <button type="button" className="btn btn-ghost" style={{ flex: 1, fontSize: 12, border: "1px solid var(--neon-cyan)" }} onClick={() => setShowQrModal(true)}>
                📱 PLAY ON PHONE
              </button>
            ) : (
              <button type="button" className="btn btn-ghost" style={{ flex: 1, fontSize: 12, border: "1px solid var(--neon-cyan)" }} onClick={() => setShowScannerModal(true)}>
                📷 SCAN QR CODE
              </button>
            )}
          </div>

          <p className="auth-switch">
            New here?{" "}
            <button type="button" className="auth-link" onClick={onSwitchToSignup}>
              Create an account
            </button>
          </p>

          <p className="auth-hint">
            Sign up to create your profile & claim your spot on the Global Leaderboard!
          </p>
        </form>
      ) : (
        <form className="auth-card glass-panel" onSubmit={handleForgotPasswordSubmit}>
          <div className="auth-brand">
            <span className="navbar-brand-mark">⚔️</span>
            <span>CODING BATTLE ARENA</span>
          </div>
          <h2 className="auth-title">Reset Your Password</h2>
          <p className="auth-subtitle">Enter your username or email and choose a new password.</p>

          <label className="auth-label">Username or Email</label>
          <input
            className="auth-input"
            value={forgotIdentifier}
            onChange={(e) => setForgotIdentifier(e.target.value)}
            placeholder="user@gmail.com or ShadowByte"
            autoFocus
            required
          />

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12, marginBottom: 6 }}>
            <label className="auth-label" style={{ margin: 0 }}>New Password</label>
            <button
              type="button"
              className="auth-link"
              style={{ fontSize: "11px", fontWeight: "600", cursor: "pointer", border: "none", background: "none" }}
              onClick={() => setShowNewPassword(!showNewPassword)}
            >
              {showNewPassword ? "HIDE" : "SHOW"}
            </button>
          </div>
          <input
            className="auth-input"
            type={showNewPassword ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New password (min 4 characters)"
            required
          />

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12, marginBottom: 6 }}>
            <label className="auth-label" style={{ margin: 0 }}>Confirm New Password</label>
            <button
              type="button"
              className="auth-link"
              style={{ fontSize: "11px", fontWeight: "600", cursor: "pointer", border: "none", background: "none" }}
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? "HIDE" : "SHOW"}
            </button>
          </div>
          <input
            className="auth-input"
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter your new password"
            required
          />

          {error && <div className="auth-error">{error}</div>}
          {successMsg && <div className="auth-success">{successMsg}</div>}

          <button className="btn btn-start auth-submit" type="submit" disabled={loading}>
            {loading ? "UPDATING PASSWORD…" : "🔑 SET NEW PASSWORD & ENTER"}
          </button>

          <p className="auth-switch">
            Remember your password?{" "}
            <button
              type="button"
              className="auth-link"
              onClick={() => {
                setIsForgotMode(false);
                setError("");
                setSuccessMsg("");
              }}
            >
              Back to Sign In
            </button>
          </p>
        </form>
      )}

      {showQrModal && <QRCodeModal onClose={() => setShowQrModal(false)} />}
      {showScannerModal && <QRScannerModal onClose={() => setShowScannerModal(false)} />}
    </div>
  );
}
