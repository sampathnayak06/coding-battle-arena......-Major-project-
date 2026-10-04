import { useState, useEffect } from "react";
import { getHeroById, getTierForElo } from "../data/animeData.js";
import { fetchLevels, fetchLevelProgress } from "../api.js";
import audioManager from "../services/audioManager.js";

const SUPPORTED_LANGUAGES = [
  { key: "c", label: "C", icon: "⚙️", color: "#38bdf8" },
  { key: "cpp", label: "C++", icon: "➕", color: "#9d4edd" },
  { key: "java", label: "JAVA", icon: "☕", color: "#ef4444" },
  { key: "python", label: "PYTHON", icon: "🐍", color: "#22c55e" },
  { key: "javascript", label: "JAVASCRIPT", icon: "⚡", color: "#ffd700" }
];

export default function MainLevelHub({ player, onStartLevel }) {
  const [levels, setLevels] = useState([]);
  const [progress, setProgress] = useState([]);
  const [maxUnlocked, setMaxUnlocked] = useState(1);
  const [activeLevelId, setActiveLevelId] = useState(1);
  const [selectedLang, setSelectedLang] = useState("javascript");
  const [loading, setLoading] = useState(true);

  const hero = getHeroById(player?.heroId || "naruto");
  const tier = getTierForElo(player?.elo || 1000);

  useEffect(() => {
    loadCampaignData(selectedLang);
  }, [selectedLang]);

  async function loadCampaignData(lang) {
    setLoading(true);
    try {
      const [levelsRes, progressRes] = await Promise.all([
        fetchLevels(),
        fetchLevelProgress(lang)
      ]);
      setLevels(levelsRes.levels || []);
      const userProgress = progressRes.progress || [];
      setProgress(userProgress);
      const unlocked = progressRes.maxUnlockedLevel || 1;
      setMaxUnlocked(unlocked);

      // Default to highest unlocked level or level 1
      setActiveLevelId(unlocked);
    } catch (err) {
      console.error("[MainLevelHub] Failed to load level data:", err);
    } finally {
      setLoading(false);
    }
  }

  const currentLevelConfig = levels.find((l) => l.levelId === activeLevelId) || levels[0] || {
    levelId: 1,
    title: "Level 1: Novice Initiation",
    subtitle: "First Circuit · Fundamental Syntax & Logic",
    difficulty: "EASY",
    passingScore: 300,
    xpReward: 100,
    coinReward: 50,
    color: "#22c55e"
  };

  const levelProgressInfo = progress.find((p) => p.levelId === activeLevelId) || {
    completed: false,
    stars: 0,
    languageProgress: {}
  };

  function getLangProgress(langKey) {
    if (!levelProgressInfo.languageProgress) return null;
    const langMap = levelProgressInfo.languageProgress;
    // Map object or plain object
    if (typeof langMap.get === "function") {
      return langMap.get(langKey);
    }
    return langMap[langKey] || null;
  }

  function handleLangSelect(langKey) {
    audioManager.playClick();
    setSelectedLang(langKey);
  }

  function handleStart() {
    audioManager.playClick();
    onStartLevel({
      levelId: activeLevelId,
      levelConfig: currentLevelConfig,
      language: selectedLang
    });
  }

  const playerLevel = Math.floor((player?.coins || 0) / 100) + 1;

  if (loading) {
    return (
      <div className="main-hub-shell glass-panel" style={{ padding: 40, textAlign: "center" }}>
        <p className="lobby-status">Entering Coding Battle Arena Campaign…</p>
      </div>
    );
  }

  return (
    <div className="main-level-hub-container">
      {/* --- TOP COMPACT PLAYER HEADER --- */}
      <div className="main-hub-top-bar glass-panel">
        <div className="top-player-info">
          <div className="top-avatar-circle" style={{ borderColor: hero.color }}>
            <span>{hero.emoji}</span>
          </div>
          <div>
            <div className="top-player-name">{player?.username || hero.name}</div>
            <div className="top-player-sub">
              <span className="hero-tier-tag" style={{ background: `${hero.color}25`, color: hero.color }}>
                {tier.name} · LVL {playerLevel}
              </span>
            </div>
          </div>
        </div>

        <div className="top-stats-pills">
          <div className="top-stat-chip elo">
            <span>⚔️</span>
            <span>{player?.elo || 1000} ELO</span>
          </div>
          <div className="top-stat-chip coins">
            <span>🪙</span>
            <span>{player?.coins || 0} COINS</span>
          </div>
          <div className="top-stat-chip xp">
            <span>⚡</span>
            <span>{player?.xp || 0} XP</span>
          </div>
        </div>
      </div>

      {/* --- CENTER CAMPAIGN LEVEL CARD --- */}
      <div className="level-main-card glass-panel" style={{ "--level-color": currentLevelConfig.color }}>
        <div className="level-card-header">
          <span className="level-brand-tag">CODING BATTLE ARENA</span>
          <h1 className="main-level-title">LEVEL {currentLevelConfig.levelId}</h1>
          <h2 className="main-level-subtitle">"{currentLevelConfig.title.replace(/^Level \d+: /, '')}"</h2>
        </div>

        {/* ⭐ Stars Earned for this level */}
        <div className="main-level-stars-row">
          {[1, 2, 3].map((starNum) => (
            <span
              key={starNum}
              className={`main-star-icon ${starNum <= (levelProgressInfo.stars || 0) ? "earned" : "empty"}`}
            >
              ⭐
            </span>
          ))}
          <span className="stars-label-text">
            {levelProgressInfo.stars || 0} / 3 STARS
          </span>
        </div>

        {/* Level Details Pill */}
        <div className="level-meta-details-box">
          <div className="meta-detail-item">
            <span className="meta-label">DIFFICULTY</span>
            <strong className="meta-value" style={{ color: currentLevelConfig.color }}>
              {currentLevelConfig.difficulty || "EASY"}
            </strong>
          </div>
          <div className="meta-detail-item">
            <span className="meta-label">PASSING SCORE</span>
            <strong className="meta-value">{currentLevelConfig.passingScore || 300} PTS</strong>
          </div>
          <div className="meta-detail-item">
            <span className="meta-label">REWARDS</span>
            <strong className="meta-value reward">
              +{currentLevelConfig.xpReward || 100} XP · +{currentLevelConfig.coinReward || 50} 🪙
            </strong>
          </div>
        </div>

        {/* Language Selection Grid */}
        <div className="language-selector-section">
          <div className="selector-title-label">SELECT PROGRAMMING LANGUAGE</div>
          <div className="language-buttons-grid">
            {SUPPORTED_LANGUAGES.map((lang) => {
              const langProg = getLangProgress(lang.key);
              const isSelected = selectedLang === lang.key;
              const isLangCompleted = langProg?.completed;
              const langStars = langProg?.stars || 0;

              return (
                <button
                  key={lang.key}
                  className={`lang-select-btn ${isSelected ? "selected" : ""} ${isLangCompleted ? "completed" : ""}`}
                  style={{ "--lang-glow": lang.color }}
                  onClick={() => handleLangSelect(lang.key)}
                >
                  <span className="lang-icon">{lang.icon}</span>
                  <span className="lang-label">{lang.label}</span>
                  {isLangCompleted ? (
                    <span className="lang-status-badge completed">
                      {"⭐".repeat(langStars)} ✓
                    </span>
                  ) : (
                    <span className="lang-status-badge ready">READY</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Start / Continue Button */}
        <div className="main-start-action-container">
          <button className="btn btn-start main-level-start-btn" onClick={handleStart}>
            ⚡ START LEVEL {currentLevelConfig.levelId} ({selectedLang.toUpperCase()})
          </button>
        </div>

        {/* Level Selector Slider if unlocked > 1 */}
        {maxUnlocked > 1 && (
          <div className="level-switcher-row">
            <span className="switcher-label">CAMPAIGN LEVEL:</span>
            <div className="switcher-buttons">
              {levels.slice(0, maxUnlocked).map((lvl) => (
                <button
                  key={lvl.levelId}
                  className={`level-switch-chip ${lvl.levelId === activeLevelId ? "active" : ""}`}
                  onClick={() => setActiveLevelId(lvl.levelId)}
                >
                  LVL {lvl.levelId}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
