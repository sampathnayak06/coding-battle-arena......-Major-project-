// Theme & Color Customizer Service for Coding Battle Arena

const STORAGE_KEY = "cba_theme_config";

export const COLOR_PRESETS = [
  { id: "cyan", name: "Cyber Cyan", hex: "#00e5ff" },
  { id: "purple", name: "Neon Purple", hex: "#9d4edd" },
  { id: "green", name: "Matrix Green", hex: "#10b981" },
  { id: "gold", name: "Solar Amber", hex: "#f59e0b" },
  { id: "crimson", name: "Crimson Red", hex: "#ef4444" },
  { id: "pink", name: "Vaporwave Pink", hex: "#ec4899" },
  { id: "electric", name: "Electric Yellow", hex: "#eab308" }
];

export const FONT_PRESETS = [
  { id: "white", name: "Crisp White", hex: "#eaf4ff" },
  { id: "dark_slate", name: "Deep Charcoal", hex: "#0f172a" },
  { id: "cyan_soft", name: "Soft Cyan", hex: "#67e8f9" },
  { id: "gold", name: "Neon Gold", hex: "#ffd700" },
  { id: "slate_blue", name: "Slate Blue", hex: "#334155" },
  { id: "pink_soft", name: "Vapor Pink", hex: "#f472b6" }
];

export const DEFAULT_THEME = {
  mode: "dark", // 'dark' | 'light' | 'custom'
  primaryColor: "#00e5ff",
  fontColor: "#eaf4ff",
  customHex: "#00e5ff"
};

export function loadSavedTheme() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_THEME;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_THEME, ...parsed };
  } catch (err) {
    console.error("[themeService] loadSavedTheme error:", err);
    return DEFAULT_THEME;
  }
}

export function saveTheme(config) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch (err) {
    console.error("[themeService] saveTheme error:", err);
  }
}

export function isColorDark(hex) {
  if (!hex || typeof hex !== "string") return true;
  let cleanHex = hex.replace("#", "");
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split("").map((c) => c + c).join("");
  }
  const r = parseInt(cleanHex.substring(0, 2), 16) || 0;
  const g = parseInt(cleanHex.substring(2, 4), 16) || 0;
  const b = parseInt(cleanHex.substring(4, 6), 16) || 0;
  const hsp = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b));
  return hsp < 127.5;
}

export function applyTheme(config) {
  if (!config) config = DEFAULT_THEME;
  const root = document.documentElement;

  // 1. Set mode attribute for CSS selectors
  const mode = config.mode || "dark";
  root.setAttribute("data-theme", mode);

  // 2. Compute accent colors
  const mainHex = config.primaryColor || "#00e5ff";
  const softHex = adjustBrightness(mainHex, 40);
  const rgbaGlow = hexToRgba(mainHex, 0.45);
  const rgbaSoft = hexToRgba(mainHex, 0.15);

  root.style.setProperty("--neon-cyan", mainHex);
  root.style.setProperty("--neon-cyan-soft", softHex);
  root.style.setProperty("--border-glow", rgbaGlow);
  root.style.setProperty("--card-glow", mainHex);
  root.style.setProperty("--dot-glow", mainHex);
  root.style.setProperty("--theme-accent-soft", rgbaSoft);

  // 3. Compute Font / Text colors (automatic dark font in Light Mode)
  let fontHex = config.fontColor;
  if (mode === "light") {
    // Light Theme -> Force font to be dark (#0f172a) unless explicit dark font is chosen
    if (!fontHex || !isColorDark(fontHex)) {
      fontHex = "#0f172a";
    }
  } else if (mode === "dark") {
    // Dark Theme (Default) -> Force font to be light (#eaf4ff) unless explicit light font is chosen
    if (!fontHex || isColorDark(fontHex)) {
      fontHex = "#eaf4ff";
    }
  }

  const dimFontHex = isColorDark(fontHex) ? "#475569" : "#94a3b8";

  root.style.setProperty("--text-primary", fontHex);
  root.style.setProperty("--text-dim", dimFontHex);

  // 4. Save preference
  saveTheme(config);
}

// Utility: Hex to RGBA string
function hexToRgba(hex, alpha = 1) {
  let cleanHex = hex.replace("#", "");
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split("").map((c) => c + c).join("");
  }
  const r = parseInt(cleanHex.substring(0, 2), 16) || 0;
  const g = parseInt(cleanHex.substring(2, 4), 16) || 0;
  const b = parseInt(cleanHex.substring(4, 6), 16) || 0;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// Utility: Adjust Hex Color Brightness
function adjustBrightness(hex, percent) {
  let cleanHex = hex.replace("#", "");
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split("").map((c) => c + c).join("");
  }
  let r = parseInt(cleanHex.substring(0, 2), 16) || 0;
  let g = parseInt(cleanHex.substring(2, 4), 16) || 0;
  let b = parseInt(cleanHex.substring(4, 6), 16) || 0;

  r = Math.min(255, Math.max(0, r + Math.round((255 - r) * (percent / 100))));
  g = Math.min(255, Math.max(0, g + Math.round((255 - g) * (percent / 100))));
  b = Math.min(255, Math.max(0, b + Math.round((255 - b) * (percent / 100))));

  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}
