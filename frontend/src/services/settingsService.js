import audioManager from "./audioManager.js";

const SETTINGS_KEY = "arena_user_settings";

const DEFAULT_SETTINGS = {
  sfxVolume: 70, // 0 - 100
  brightness: 100, // 30 - 150
  isMuted: false,
  notificationsEnabled: true,
  matchAlertsEnabled: true,
  particlesEnabled: true,
  highContrast: false
};

class SettingsService {
  constructor() {
    this.settings = this.loadSettings();
    this.applySettings(this.settings);
  }

  loadSettings() {
    try {
      const saved = localStorage.getItem(SETTINGS_KEY);
      if (saved) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn("[SettingsService] Failed to parse local settings:", e);
    }
    return { ...DEFAULT_SETTINGS };
  }

  saveSettings(newSettings) {
    this.settings = { ...this.settings, ...newSettings };
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(this.settings));
    } catch (e) {
      console.warn("[SettingsService] Failed to save local settings:", e);
    }
    this.applySettings(this.settings);
    return this.settings;
  }

  applySettings(settings) {
    // 1. Apply Brightness to root document element
    const brightnessVal = (settings.brightness ?? 100) / 100;
    document.documentElement.style.setProperty("--app-brightness", brightnessVal);

    // 2. Apply Audio Settings to audioManager
    if (audioManager) {
      const sfxVolFloat = (settings.sfxVolume ?? 70) / 100;
      audioManager.sfxVolume = sfxVolFloat;
      audioManager.isMuted = !!settings.isMuted;
    }

    // 3. High Contrast body class toggle
    if (settings.highContrast) {
      document.body.classList.add("high-contrast");
    } else {
      document.body.classList.remove("high-contrast");
    }
  }

  getSettings() {
    return { ...this.settings };
  }

  setVolume(volPercent) {
    const clamped = Math.min(100, Math.max(0, volPercent));
    return this.saveSettings({ sfxVolume: clamped });
  }

  setBrightness(brightPercent) {
    const clamped = Math.min(150, Math.max(30, brightPercent));
    return this.saveSettings({ brightness: clamped });
  }

  toggleMute() {
    return this.saveSettings({ isMuted: !this.settings.isMuted });
  }

  toggleNotifications() {
    return this.saveSettings({ notificationsEnabled: !this.settings.notificationsEnabled });
  }

  toggleMatchAlerts() {
    return this.saveSettings({ matchAlertsEnabled: !this.settings.matchAlertsEnabled });
  }

  toggleParticles() {
    return this.saveSettings({ particlesEnabled: !this.settings.particlesEnabled });
  }
}

export const settingsService = new SettingsService();
export default settingsService;
