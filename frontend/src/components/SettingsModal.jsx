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

          {/* SECTION 3: THEME & VISUAL FX ("AND ALL") */}
          <div className="settings-section">
            <div className="settings-section-title">
              <span>🎨</span> THEME & VISUAL EXPERIENCE
            </div>

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
