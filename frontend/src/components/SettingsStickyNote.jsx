import { useState, useEffect, useRef } from "react";
import settingsService from "../services/settingsService.js";
import audioManager from "../services/audioManager.js";
import { applyTheme, loadSavedTheme, COLOR_PRESETS } from "../services/themeService.js";

export default function SettingsStickyNote({ onClose }) {
  const panelRef = useRef(null);
  const [settings, setSettings] = useState(settingsService.getSettings());
  const [themeConfig, setThemeConfig] = useState(loadSavedTheme());
  const [isFullscreen, setIsFullscreen] = useState(!!document.fullscreenElement);
  const [testNotification, setTestNotification] = useState(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        onClose();
      }
    }
    function handleKeyDown(e) {
      if (e.key === "Escape") onClose();
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  function handleClose() {
    audioManager.playClick();
    onClose();
  }

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

  function handleToggleNotifications() {
    audioManager.playClick();
    const updated = settingsService.toggleNotifications();
    setSettings(updated);
  }

  function handleToggleMatchAlerts() {
    audioManager.playClick();
    const updated = settingsService.toggleMatchAlerts();
    setSettings(updated);
  }

  function handleToggleParticles() {
    audioManager.playClick();
    const updated = settingsService.toggleParticles();
    setSettings(updated);
  }

  function handleColorSelect(hex) {
    audioManager.playClick();
    const newConfig = { ...themeConfig, primaryColor: hex };
    applyTheme(newConfig);
    setThemeConfig(newConfig);
  }

  function handleTestNotificationSound() {
    audioManager.playReward();
    setTestNotification("🔔 Sample Notification Alert triggered!");
    setTimeout(() => setTestNotification(null), 3500);
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
    <div className="sticky-note-wrapper settings-sticky" ref={panelRef}>
      {/* HEADER */}
      <div className="sticky-note-header">
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 18 }}>⚙️</span>
          <span className="sticky-note-title">SETTINGS & NOTIFICATIONS</span>
        </div>
        <button className="sticky-close-btn" onClick={handleClose} title="Close Panel">✕</button>
      </div>

      <div className="sticky-note-body">
        {/* Sample Live Notification Alert Banner */}
        {testNotification && (
          <div className="settings-notification-toast">
            <span>✨</span>
            <span>{testNotification}</span>
          </div>
        )}

        {/* SECTION 1: NOTIFICATION & AUDIO ALERTS */}
        <div className="theme-section">
          <label className="theme-section-label">1. NOTIFICATION & AUDIO ALERTS</label>
          
          <div className="settings-toggle-list" style={{ marginBottom: 12 }}>
            <div className="settings-toggle-row">
              <div className="toggle-label-info">
                <strong>Push Notification Banners</strong>
                <span>Show match & level updates in real-time</span>
              </div>
              <button
                className={`toggle-switch ${settings.notificationsEnabled ? "on" : ""}`}
                onClick={handleToggleNotifications}
              >
                <span className="toggle-thumb" />
              </button>
            </div>

            <div className="settings-toggle-row">
              <div className="toggle-label-info">
                <strong>Victory Sound Alerts</strong>
                <span>Play AAA sound FX on victory & rank up</span>
              </div>
              <button
                className={`toggle-switch ${settings.matchAlertsEnabled ? "on" : ""}`}
                onClick={handleToggleMatchAlerts}
              >
                <span className="toggle-thumb" />
              </button>
            </div>
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
              <button className="btn-settings-action secondary" onClick={handleTestNotificationSound}>
                🔔 Test Alert
              </button>
            </div>
          </div>
        </div>

        {/* SECTION 2: SCREEN BRIGHTNESS */}
        <div className="theme-section">
          <label className="theme-section-label">2. SCREEN BRIGHTNESS</label>
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

        {/* SECTION 3: THEME & COLOR ACCENTS */}
        <div className="theme-section">
          <label className="theme-section-label">3. ACCENT COLOR PALETTE</label>
          <div className="settings-theme-grid">
            {COLOR_PRESETS.map((preset) => (
              <button
                key={preset.id}
                className={`settings-theme-chip ${themeConfig.primaryColor === preset.hex ? "active" : ""}`}
                onClick={() => handleColorSelect(preset.hex)}
                style={{ "--chip-color": preset.hex }}
              >
                <span className="theme-dot" style={{ backgroundColor: preset.hex }} />
                <span>{preset.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* SECTION 4: DISPLAY & GRAPHICS */}
        <div className="theme-section">
          <label className="theme-section-label">4. DISPLAY & GRAPHICS</label>
          <div className="settings-toggle-list">
            <div className="settings-toggle-row">
              <div className="toggle-label-info">
                <strong>Background Cyber Particles</strong>
                <span>Canvas particle effects</span>
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
                <strong>Full Screen Mode</strong>
                <span>Immersive window view</span>
              </div>
              <button className="btn-settings-action secondary" onClick={toggleFullscreen}>
                {isFullscreen ? "↙️ Exit" : "⤢ Fullscreen"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="sticky-note-footer">
        <button className="btn btn-start sticky-action-btn" onClick={handleClose} style={{ width: "100%", padding: "10px", fontSize: 13 }}>
          ✅ CLOSE SETTINGS
        </button>
      </div>
    </div>
  );
}
