import { useState, useEffect, useRef } from "react";
import { COLOR_PRESETS, FONT_PRESETS, DEFAULT_THEME, loadSavedTheme, applyTheme, isColorDark } from "../services/themeService.js";
import audioManager from "../services/audioManager.js";

export default function ThemeStickyNote({ onClose }) {
  const panelRef = useRef(null);
  const [themeConfig, setThemeConfig] = useState(loadSavedTheme());
  const [customInputHex, setCustomInputHex] = useState(themeConfig.primaryColor || "#00e5ff");
  const [customFontHex, setCustomFontHex] = useState(themeConfig.fontColor || "#eaf4ff");

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

  function handleModeChange(mode) {
    audioManager.playClick();
    // Automatic Font Color logic: Light mode -> dark font (#0f172a); Dark mode -> light font (#eaf4ff)
    const newFontColor = mode === "light" ? "#0f172a" : "#eaf4ff";
    setCustomFontHex(newFontColor);

    const updated = { ...themeConfig, mode, fontColor: newFontColor };
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

  function handleFontSelect(hex) {
    audioManager.playClick();
    setCustomFontHex(hex);
    const updated = { ...themeConfig, fontColor: hex };
    setThemeConfig(updated);
    applyTheme(updated);
  }

  function handleCustomFontChange(e) {
    const val = e.target.value;
    setCustomFontHex(val);
    const updated = { ...themeConfig, fontColor: val };
    setThemeConfig(updated);
    applyTheme(updated);
  }

  function handleReset() {
    audioManager.playClick();
    setCustomInputHex(DEFAULT_THEME.primaryColor);
    setCustomFontHex(DEFAULT_THEME.fontColor);
    setThemeConfig(DEFAULT_THEME);
    applyTheme(DEFAULT_THEME);
  }

  return (
    <div className="sticky-note-wrapper theme-sticky" ref={panelRef}>
      <div className="sticky-note-header">
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 18 }}>🎨</span>
          <span className="sticky-note-title">THEME & COLOR ENGINE</span>
        </div>
        <button className="sticky-close-btn" onClick={handleClose} title="Close Panel">✕</button>
      </div>

      <div className="sticky-note-body">
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
                <small>Classic Night (Default)</small>
              </div>
            </button>

            <button
              className={`theme-mode-card ${themeConfig.mode === "light" ? "active" : ""}`}
              onClick={() => handleModeChange("light")}
            >
              <span className="mode-icon">☀️</span>
              <div className="mode-details">
                <strong>Cyber Light</strong>
                <small>Clean Day (Dark Font)</small>
              </div>
            </button>

            <button
              className={`theme-mode-card ${themeConfig.mode === "custom" ? "active" : ""}`}
              onClick={() => handleModeChange("custom")}
            >
              <span className="mode-icon">⚡</span>
              <div className="mode-details">
                <strong>Custom</strong>
                <small>Color Engine</small>
              </div>
            </button>
          </div>
        </div>

        {/* SECTION 2: ACCENT COLOR PALETTE */}
        <div className="theme-section">
          <label className="theme-section-label">2. ACCENT COLOR PALETTE</label>
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

          {/* CUSTOM ACCENT PICKER */}
          <div className="custom-color-picker-row">
            <label htmlFor="customColorInput" className="picker-label">
              <span className="picker-icon">🖌️</span> Accent Wheel:
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

        {/* SECTION 3: FONT / TEXT COLOR SELECTOR */}
        <div className="theme-section">
          <label className="theme-section-label">3. FONT & TYPOGRAPHY COLOR</label>
          <div className="color-swatch-grid">
            {FONT_PRESETS.map((preset) => (
              <button
                key={preset.id}
                className={`color-swatch-btn ${themeConfig.fontColor?.toLowerCase() === preset.hex.toLowerCase() ? "selected" : ""}`}
                style={{ "--swatch-color": preset.hex }}
                onClick={() => handleFontSelect(preset.hex)}
                title={preset.name}
              >
                <span className="swatch-circle" style={{ background: preset.hex, border: "1px solid #fff" }} />
                <span className="swatch-name">{preset.name}</span>
              </button>
            ))}
          </div>

          {/* CUSTOM FONT COLOR PICKER */}
          <div className="custom-color-picker-row">
            <label htmlFor="customFontInput" className="picker-label">
              <span className="picker-icon">🔤</span> Font Wheel:
            </label>
            <div className="picker-input-wrapper">
              <input
                id="customFontInput"
                type="color"
                value={customFontHex}
                onChange={handleCustomFontChange}
                className="color-wheel-input"
              />
              <input
                type="text"
                value={customFontHex}
                onChange={handleCustomFontChange}
                className="color-hex-text-input"
                maxLength={7}
              />
            </div>
          </div>
        </div>

        {/* SECTION 4: LIVE ARENA PREVIEW */}
        <div className="theme-section">
          <label className="theme-section-label">4. LIVE ARENA PREVIEW</label>
          <div
            className="theme-preview-card glass-panel"
            style={{
              "--preview-color": themeConfig.primaryColor,
              color: themeConfig.fontColor || (themeConfig.mode === "light" ? "#0f172a" : "#eaf4ff")
            }}
          >
            <div className="preview-header">
              <span className="preview-badge" style={{ borderColor: themeConfig.primaryColor, color: themeConfig.primaryColor }}>
                LIVE
              </span>
              <span className="preview-title" style={{ color: themeConfig.fontColor }}>Cyber Arena Theme</span>
            </div>
            <p style={{ fontSize: 12, marginBottom: 10, color: themeConfig.fontColor }}>
              Typography test sentence: "Welcome to Coding Battle Arena."
            </p>
            <div className="preview-body-row">
              <button className="btn preview-btn-primary" style={{ background: themeConfig.primaryColor, color: "#000" }}>
                PRIMARY
              </button>
              <button className="btn preview-btn-outline" style={{ borderColor: themeConfig.primaryColor, color: themeConfig.primaryColor }}>
                OUTLINE
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="sticky-note-footer">
        <button className="btn btn-ghost sticky-action-btn" onClick={handleReset}>
          [ RESTORE DEFAULT ]
        </button>
        <button className="btn sticky-action-btn" style={{ background: themeConfig.primaryColor, color: "#000" }} onClick={handleClose}>
          [ APPLY & CLOSE ]
        </button>
      </div>
    </div>
  );
}
