import { useState, useEffect } from "react";
import settingsService from "../services/settingsService.js";
import audioManager from "../services/audioManager.js";
import { applyTheme, loadSavedTheme, COLOR_PRESETS } from "../services/themeService.js";

export default function SettingsModal({ onClose }) {
  const [settings, setSettings] = useState(settingsService.getSettings());
  const [themeConfig, setThemeConfig] = useState(loadSavedTheme());
  const [isFullscreen, setIsFullscreen] = useState(!!document.fullscreenElement);

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  function handleVolumeChange(newVol) {
    const updated = settingsService.setVolume(newVol);
    setSettings(updated);
  }

  function handleBrightnessChange(newBright) {
    const updated = settingsService.setBrightness(newBright);
    setSettings(updated);
  }

  function handleToggleMute() {
    audioManager.playClick();
    const updated = settingsService.toggleMute();
    setSettings(updated);
  }

  function handleToggleParticles() {
    audioManager.playClick();
    const updated = settingsService.toggleParticles();
    setSettings(updated);
  }

  function handleTestSound() {
    audioManager.playReward();
  }

  function handleColorSelect(hex) {
    audioManager.playClick();
    const newConfig = { ...themeConfig, primaryColor: hex };
    applyTheme(newConfig);
    setThemeConfig(newConfig);
  }

  function toggleFullscreen() {
    audioManager.playClick();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="settings-modal-card glass-panel" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="settings-modal-header">
          <div className="settings-header-title">
            <span className="settings-header-icon">⚙️</span>
            <div>
              <h3>System Settings</h3>
              <p>Configure Audio, Screen Brightness & Platform Controls</p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose} title="Close Settings">✕</button>
        </div>

        <div className="settings-modal-body">
          {/* SECTION 1: VOLUME CONTROL */}
          <div className="settings-section">
            <div className="settings-section-title">
              <span>🔊</span> AUDIO & SOUND VOLUME
            </div>
            
            <div className="settings-control-card">
              <div className="settings-row-info">
                <label className="settings-label">Sound FX Volume</label>
                <span className="settings-value-badge">{settings.isMuted ? "MUTED" : `${settings.sfxVolume}%`}</span>
              </div>

              <div className="settings-slider-group">
                <button
                  className="settings-step-btn"
                  onClick={() => handleVolumeChange(settings.sfxVolume - 10)}
                  title="Volume Down"
                  disabled={settings.sfxVolume <= 0}
                >
                  🔉 -
                </button>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={settings.sfxVolume}
                  onChange={(e) => handleVolumeChange(Number(e.target.value))}
                  className="settings-range-input"
                />
                <button
                  className="settings-step-btn"
                  onClick={() => handleVolumeChange(settings.sfxVolume + 10)}
                  title="Volume Up"
                  disabled={settings.sfxVolume >= 100}
                >
                  🔊 +
                </button>
              </div>

              <div className="settings-action-row">
                <button
                  className={`btn-settings-action ${settings.isMuted ? "muted" : ""}`}
                  onClick={handleToggleMute}
                >
                  {settings.isMuted ? "🔇 Mute Active" : "🔊 Audio Active"}
                </button>
                <button className="btn-settings-action secondary" onClick={handleTestSound}>
                  🎵 Test Sound
                </button>
              </div>
            </div>
          </div>

          {/* SECTION 2: BRIGHTNESS CONTROL */}
          <div className="settings-section">
            <div className="settings-section-title">
              <span>☀️</span> SCREEN BRIGHTNESS
            </div>

            <div className="settings-control-card">
              <div className="settings-row-info">
                <label className="settings-label">Display Brightness</label>
                <span className="settings-value-badge">{settings.brightness}%</span>
              </div>

              <div className="settings-slider-group">
                <button
                  className="settings-step-btn"
                  onClick={() => handleBrightnessChange(settings.brightness - 10)}
                  title="Brightness Down"
                  disabled={settings.brightness <= 30}
                >
                  🌙 -
                </button>
                <input
                  type="range"
                  min="30"
                  max="150"
                  step="5"
                  value={settings.brightness}
                  onChange={(e) => handleBrightnessChange(Number(e.target.value))}
                  className="settings-range-input"
                />
                <button
                  className="settings-step-btn"
                  onClick={() => handleBrightnessChange(settings.brightness + 10)}
                  title="Brightness Up"
                  disabled={settings.brightness >= 150}
                >
                  ☀️ +
                </button>
              </div>

              <div className="settings-action-row">
                <button
                  className="btn-settings-action secondary"
                  onClick={() => handleBrightnessChange(100)}
                >
                  ☀️ Reset to 100%
                </button>
              </div>
            </div>
          </div>

          {/* SECTION 3: THEME & VISUAL EXPERIENCE */}
          <div className="settings-section">
            <div className="settings-section-title">
              <span>🎨</span> THEME & VISUAL EXPERIENCE
            </div>

            {/* Mode Selector Tabs */}
            <div className="settings-mode-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px", marginBottom: "14px" }}>
              <button
                className={`theme-mode-card ${themeConfig.mode === "dark" || !themeConfig.mode ? "active" : ""}`}
                onClick={() => {
                  audioManager.playClick();
                  const newFont = "#eaf4ff";
                  const updated = { ...themeConfig, mode: "dark", fontColor: newFont };
                  applyTheme(updated);
                  setThemeConfig(updated);
                }}
                style={{ padding: "10px", textAlign: "center" }}
              >
                <span style={{ fontSize: "16px", display: "block" }}>🌙</span>
                <strong style={{ fontSize: "11px", display: "block", marginTop: "2px" }}>Esports Dark</strong>
              </button>

              <button
                className={`theme-mode-card ${themeConfig.mode === "light" ? "active" : ""}`}
                onClick={() => {
                  audioManager.playClick();
                  const newFont = "#0f172a";
                  const updated = { ...themeConfig, mode: "light", fontColor: newFont };
                  applyTheme(updated);
                  setThemeConfig(updated);
                }}
                style={{ padding: "10px", textAlign: "center" }}
              >
                <span style={{ fontSize: "16px", display: "block" }}>☀️</span>
                <strong style={{ fontSize: "11px", display: "block", marginTop: "2px" }}>Cyber Light</strong>
              </button>

              <button
                className={`theme-mode-card ${themeConfig.mode === "custom" ? "active" : ""}`}
                onClick={() => {
                  audioManager.playClick();
                  const updated = { ...themeConfig, mode: "custom" };
                  applyTheme(updated);
                  setThemeConfig(updated);
                }}
                style={{ padding: "10px", textAlign: "center" }}
              >
                <span style={{ fontSize: "16px", display: "block" }}>⚡</span>
                <strong style={{ fontSize: "11px", display: "block", marginTop: "2px" }}>Custom Chroma</strong>
              </button>
            </div>

            {/* Preset Color Swatches */}
            <div className="settings-theme-grid">
              {COLOR_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  className={`settings-theme-chip ${themeConfig.primaryColor?.toLowerCase() === preset.hex.toLowerCase() ? "active" : ""}`}
                  onClick={() => handleColorSelect(preset.hex)}
                  style={{ "--chip-color": preset.hex }}
                >
                  <span className="theme-dot" style={{ backgroundColor: preset.hex }} />
                  <span>{preset.name}</span>
                </button>
              ))}
            </div>

            {/* Custom Color Wheel Picker */}
            <div className="custom-color-picker-row" style={{ marginTop: "12px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(255, 255, 255, 0.03)", padding: "10px 14px", borderRadius: "8px", border: "1px solid rgba(255, 255, 255, 0.08)" }}>
              <label htmlFor="settingsCustomColorInput" className="picker-label" style={{ fontSize: "12px", display: "flex", alignItems: "center", gap: "6px" }}>
                <span>🖌️</span> Custom Accent Picker:
              </label>
              <div className="picker-input-wrapper" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <input
                  id="settingsCustomColorInput"
                  type="color"
                  value={themeConfig.primaryColor || "#00e5ff"}
                  onChange={(e) => handleColorSelect(e.target.value)}
                  className="color-wheel-input"
                  style={{ width: "32px", height: "32px", border: "none", cursor: "pointer", background: "transparent" }}
                />
                <input
                  type="text"
                  value={themeConfig.primaryColor || "#00e5ff"}
                  onChange={(e) => handleColorSelect(e.target.value)}
                  className="color-hex-text-input"
                  maxLength={7}
                  style={{ width: "75px", padding: "4px 8px", background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "6px", color: "var(--neon-cyan)", fontFamily: "var(--font-mono)", fontSize: "11px", textAlign: "center" }}
                />
              </div>
            </div>

            {/* Interactive Live Theme Preview */}
            <div className="theme-preview-card glass-panel" style={{ marginTop: "12px", padding: "12px 16px", borderRadius: "10px", border: `1px solid ${themeConfig.primaryColor || "#00e5ff"}`, background: "rgba(0,0,0,0.25)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <span className="preview-badge" style={{ fontSize: "10px", padding: "2px 8px", borderRadius: "4px", border: `1px solid ${themeConfig.primaryColor || "#00e5ff"}`, color: themeConfig.primaryColor || "#00e5ff" }}>
                  LIVE PREVIEW
                </span>
                <span style={{ fontSize: "11px", color: "var(--text-dim)" }}>Dynamic Theme Engine</span>
              </div>
              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <button className="btn" style={{ background: themeConfig.primaryColor || "#00e5ff", color: "#000", fontSize: "11px", padding: "6px 14px", fontWeight: "bold", borderRadius: "6px" }}>
                  ACTIVE ACCENT
                </button>
                <div style={{ flex: 1, height: "6px", borderRadius: "3px", background: `linear-gradient(90deg, ${themeConfig.primaryColor || "#00e5ff"}, rgba(255,255,255,0.1))` }} />
              </div>
            </div>
          </div>

          {/* SECTION 4: DISPLAY & GRAPHICS ("AND ALL") */}
          <div className="settings-section">
            <div className="settings-section-title">
              <span>🖥️</span> DISPLAY & GRAPHICS
            </div>

            <div className="settings-toggle-list">
              <div className="settings-toggle-row">
                <div className="toggle-label-info">
                  <strong>Background Cyber Particles</strong>
                  <span>Enable animated canvas particles in the background</span>
                </div>
                <button
                  className={`toggle-switch ${settings.particlesEnabled ? "on" : ""}`}
                  onClick={handleToggleParticles}
                >
                  <span className="toggle-thumb" />
                </button>
              </div>

              <div className="settings-toggle-row">
                <div className="toggle-label-info">
                  <strong>Full Screen Display Mode</strong>
                  <span>Expand window into immersive full-screen view</span>
                </div>
                <button className="btn-settings-action secondary" onClick={toggleFullscreen}>
                  {isFullscreen ? "↙️ Exit Fullscreen" : "⤢ Fullscreen"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="settings-modal-footer">
          <button className="btn btn-start" onClick={onClose} style={{ padding: "10px 28px", fontSize: 13 }}>
            ✅ CLOSE & SAVE
          </button>
        </div>
      </div>
    </div>
  );
}
