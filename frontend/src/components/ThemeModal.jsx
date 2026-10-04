import { useState } from "react";
import { COLOR_PRESETS, DEFAULT_THEME, loadSavedTheme, applyTheme } from "../services/themeService.js";
import audioManager from "../services/audioManager.js";

export default function ThemeModal({ onClose }) {
  const [themeConfig, setThemeConfig] = useState(loadSavedTheme());
  const [customInputHex, setCustomInputHex] = useState(themeConfig.primaryColor || "#00e5ff");

  function handleModeChange(mode) {
    audioManager.playClick();
    const updated = { ...themeConfig, mode };
    setThemeConfig(updated);
    applyTheme(updated);
  }

  function handleColorSelect(hex) {
    audioManager.playClick();
    setCustomInputHex(hex);
    const updated = { ...themeConfig, primaryColor: hex, customHex: hex };
    setThemeConfig(updated);
    applyTheme(updated);
  }

  function handleCustomColorChange(e) {
    const val = e.target.value;
    setCustomInputHex(val);
    const updated = { ...themeConfig, primaryColor: val, customHex: val };
    setThemeConfig(updated);
    applyTheme(updated);
  }

  function handleReset() {
    audioManager.playClick();
    setCustomInputHex(DEFAULT_THEME.primaryColor);
    setThemeConfig(DEFAULT_THEME);
    applyTheme(DEFAULT_THEME);
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog-box theme-modal-box glass-panel" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className="modal-close-btn" onClick={() => { audioManager.playClick(); onClose(); }}>
          ✕
        </button>

        {/* Modal Header */}
        <div className="theme-modal-header">
          <span className="theme-header-icon">🎨</span>
          <h2>THEME & COLOR CUSTOMIZER</h2>
          <p className="theme-modal-subtitle">Personalize your arena layout, lighting, and neon color palette</p>
        </div>

        {/* SECTION 1: THEME MODE SELECTOR */}
        <div className="theme-section">
          <label className="theme-section-label">1. SELECT THEME MODE</label>
          <div className="theme-mode-grid">
            <button
              className={`theme-mode-card ${themeConfig.mode === "dark" ? "active" : ""}`}
              onClick={() => handleModeChange("dark")}
            >
              <span className="mode-icon">🌙</span>
              <div className="mode-details">
                <strong>Esports Dark</strong>
                <small>Classic Esports Cyberpunk Night</small>
              </div>
            </button>

            <button
              className={`theme-mode-card ${themeConfig.mode === "light" ? "active" : ""}`}
              onClick={() => handleModeChange("light")}
            >
              <span className="mode-icon">☀️</span>
              <div className="mode-details">
                <strong>Cyber Light</strong>
                <small>Clean High-Contrast Day Mode</small>
              </div>
            </button>

            <button
              className={`theme-mode-card ${themeConfig.mode === "custom" ? "active" : ""}`}
              onClick={() => handleModeChange("custom")}
            >
              <span className="mode-icon">⚡</span>
              <div className="mode-details">
                <strong>Custom Chroma</strong>
                <small>User Defined Color Engine</small>
              </div>
            </button>
          </div>
        </div>

        {/* SECTION 2: ACCENT COLOR PALETTE */}
        <div className="theme-section">
          <label className="theme-section-label">2. CHOOSE PRIMARY ACCENT COLOR</label>
          <div className="color-swatch-grid">
            {COLOR_PRESETS.map((preset) => (
              <button
                key={preset.id}
                className={`color-swatch-btn ${themeConfig.primaryColor?.toLowerCase() === preset.hex.toLowerCase() ? "selected" : ""}`}
                style={{ "--swatch-color": preset.hex }}
                onClick={() => handleColorSelect(preset.hex)}
                title={preset.name}
              >
                <span className="swatch-circle" style={{ background: preset.hex }} />
                <span className="swatch-name">{preset.name}</span>
              </button>
            ))}
          </div>

          {/* CUSTOM COLOR PICKER */}
          <div className="custom-color-picker-row">
            <label htmlFor="customColorInput" className="picker-label">
              <span className="picker-icon">🖌️</span> Custom Color Picker:
            </label>
            <div className="picker-input-wrapper">
              <input
                id="customColorInput"
                type="color"
                value={customInputHex}
                onChange={handleCustomColorChange}
                className="color-wheel-input"
              />
              <input
                type="text"
                value={customInputHex}
                onChange={handleCustomColorChange}
                className="color-hex-text-input"
                maxLength={7}
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: LIVE INTERACTIVE PREVIEW */}
        <div className="theme-section">
          <label className="theme-section-label">3. LIVE ARENA PREVIEW</label>
          <div className="theme-preview-card glass-panel" style={{ "--preview-color": themeConfig.primaryColor }}>
            <div className="preview-header">
              <span className="preview-badge" style={{ borderColor: themeConfig.primaryColor, color: themeConfig.primaryColor }}>
                LIVE PREVIEW
              </span>
              <span className="preview-title">Cyber Battle Arena HUD</span>
            </div>
            <div className="preview-body-row">
              <button className="btn preview-btn-primary" style={{ background: themeConfig.primaryColor, color: "#000" }}>
                PRIMARY ACTION
              </button>
              <button className="btn preview-btn-outline" style={{ borderColor: themeConfig.primaryColor, color: themeConfig.primaryColor }}>
                OUTLINE BTN
              </button>
            </div>
          </div>
        </div>

        {/* MODAL FOOTER ACTIONS */}
        <div className="theme-modal-footer">
          <button className="btn btn-secondary reset-theme-btn" onClick={handleReset}>
            ↺ RESTORE DEFAULT
          </button>
          <button className="btn btn-primary save-theme-btn" onClick={() => { audioManager.playClick(); onClose(); }}>
            ✓ APPLY & SAVE THEME
          </button>
        </div>
      </div>
    </div>
  );
}
