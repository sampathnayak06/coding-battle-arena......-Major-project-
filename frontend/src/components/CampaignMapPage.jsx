import { useEffect, useState, useRef } from "react";
import { fetchLevels, fetchLevelProgress } from "../api.js";
import audioManager from "../services/audioManager.js";

const SUPPORTED_LANGUAGES = [
  { key: "c", label: "C", icon: "⚙️", color: "#38bdf8" },
  { key: "cpp", label: "C++", icon: "➕", color: "#9d4edd" },
  { key: "java", label: "JAVA", icon: "☕", color: "#ef4444" },
  { key: "python", label: "PYTHON", icon: "🐍", color: "#22c55e" },
  { key: "javascript", label: "JAVASCRIPT", icon: "⚡", color: "#ffd700" }
];

export default function CampaignMapPage({ player, onStartLevel, onBack }) {
  const [levels, setLevels] = useState([]);
  const [progress, setProgress] = useState([]);
  const [maxUnlocked, setMaxUnlocked] = useState(1);
  const [totalStars, setTotalStars] = useState(0);
  const [selectedLang, setSelectedLang] = useState("javascript");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedLevel, setSelectedLevel] = useState(null); // Level config for launch modal
  const [lockedAlert, setLockedAlert] = useState(null); // { levelId, requiredLevel }
  const [shakingLevelId, setShakingLevelId] = useState(null);

  const activeNodeRef = useRef(null);

  useEffect(() => {
    loadData(selectedLang);
  }, [selectedLang]);

  async function loadData(lang) {
    setLoading(true);
    try {
      const [levelsRes, progressRes] = await Promise.all([
        fetchLevels(),
        fetchLevelProgress(lang)
      ]);

      setLevels(levelsRes.levels || []);
      setProgress(progressRes.progress || []);
      setMaxUnlocked(progressRes.maxUnlockedLevel || 1);
      setTotalStars(progressRes.totalStars || 0);
    } catch (err) {
      console.error("[CampaignMapPage] load error:", err);
      setError("Failed to load campaign data. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }

  // Scroll active level into view smoothly after load
  useEffect(() => {
    if (activeNodeRef.current) {
      activeNodeRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [loading, maxUnlocked]);

  function handleLangSwitch(langKey) {
    audioManager.playClick();
    setSelectedLang(langKey);
  }

  function handleNodeClick(lvl) {
    const isUnlocked = lvl.levelId <= maxUnlocked;
    audioManager.playClick();

    if (isUnlocked) {
      setSelectedLevel(lvl);
      setLockedAlert(null);
    } else {
      // Locked level clicked: trigger shake animation & show alert
      setShakingLevelId(lvl.levelId);
      setLockedAlert({
        levelId: lvl.levelId,
        requiredLevel: lvl.levelId - 1
      });
      setTimeout(() => setShakingLevelId(null), 600);
    }
  }

  function getLevelProgressInfo(levelId) {
    const p = progress.find((entry) => entry.levelId === levelId);
    if (!p) return { completed: false, stars: 0, bestScore: 0, attempts: 0 };

    if (p.languageProgress) {
      const langMap = p.languageProgress;
      let lp = null;
      if (typeof langMap.get === "function") {
        lp = langMap.get(selectedLang);
      } else if (typeof langMap === "object") {
        lp = langMap[selectedLang];
      }
      if (lp) {
        return {
          completed: lp.completed || false,
          stars: lp.stars || 0,
          bestScore: lp.bestScore || 0,
          attempts: lp.attempts || 0
        };
      }
    }
    return {
      completed: p.completed || false,
      stars: p.stars || 0,
      bestScore: p.bestScore || 0,
      attempts: p.attempts || 0
    };
  }

  if (loading) {
    return (
      <div className="campaign-map-shell glass-panel" style={{ padding: 40, textAlign: "center" }}>
        <p className="lobby-status">Loading Campaign Progression Map for {selectedLang.toUpperCase()}…</p>
      </div>
    );
  }

  const maxStarsPossible = levels.length * 3;

  return (
    <>
      <div className="campaign-map-shell glass-panel">
      {/* --- Top Header / Player Status --- */}
      <div className="campaign-map-header">
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <button className="back-btn" onClick={onBack} style={{ padding: "10px 20px", fontSize: 13 }}>
            ← BACK
          </button>
          <div>
            <h1 className="campaign-title">WORLD LEVELS MAP</h1>
            <p className="campaign-subtitle">Independent Language Campaigns · 30 Cyber Level Realms</p>
          </div>
        </div>

        <div className="campaign-stats-bar">
          <div className="campaign-stat-pill stars">
            <span className="stat-icon">⭐</span>
            <span className="stat-val">{totalStars} / {maxStarsPossible}</span>
            <span className="stat-lbl">STARS</span>
          </div>

          <div className="campaign-stat-pill unlocked">
            <span className="stat-icon">🔓</span>
            <span className="stat-val">LVL {maxUnlocked} / 30</span>
            <span className="stat-lbl">UNLOCKED</span>
          </div>

          <div className="campaign-stat-pill coins">
            <span className="stat-icon">🪙</span>
            <span className="stat-val">{player?.coins || 0}</span>
            <span className="stat-lbl">COINS</span>
          </div>
        </div>
      </div>

      {/* --- Language Selector Tabs --- */}
      <div className="campaign-lang-bar" style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
        {SUPPORTED_LANGUAGES.map((lang) => {
          const isSelected = selectedLang === lang.key;
          return (
            <button
              key={lang.key}
              className={`lang-select-btn ${isSelected ? "selected" : ""}`}
              style={{
                padding: "8px 16px",
                borderRadius: 12,
                fontSize: 12,
                fontWeight: 800,
                border: isSelected ? `2px solid ${lang.color}` : "1px solid rgba(255,255,255,0.1)",
                background: isSelected ? `${lang.color}25` : "rgba(255,255,255,0.03)",
                color: isSelected ? "#fff" : "var(--text-dim)",
                boxShadow: isSelected ? `0 0 15px ${lang.color}40` : "none"
              }}
              onClick={() => handleLangSwitch(lang.key)}
            >
              <span>{lang.icon}</span> <span>{lang.label} CAMPAIGN</span>
            </button>
          );
        })}
      </div>

      {error && <div className="auth-error" style={{ marginBottom: 16 }}>{error}</div>}

      {/* --- Locked Level Alert Bar --- */}
      {lockedAlert && (
        <div className="locked-level-alert glass-panel">
          <span className="locked-alert-icon">🔒</span>
          <span>
            <strong>Level {lockedAlert.levelId} is Locked in {selectedLang.toUpperCase()}!</strong> Complete Level {lockedAlert.requiredLevel} in {selectedLang.toUpperCase()} to unlock this challenge.
          </span>
          <button className="hint-close" onClick={() => setLockedAlert(null)}>✕</button>
        </div>
      )}

      {/* --- CANDY CRUSH STYLE SERPENTINE MAP CONTAINER --- */}
      <div className="serpentine-map-container">
        <div className="serpentine-path-list">
          {levels.map((lvl, index) => {
            const isUnlocked = lvl.levelId <= maxUnlocked;
            const isCurrent = lvl.levelId === maxUnlocked;
            const pInfo = getLevelProgressInfo(lvl.levelId);
            const isBoss = !!lvl.bossName;
            const isShaking = shakingLevelId === lvl.levelId;

            // S-curve positioning (alternating left, center, right columns for Candy Crush serpentine feel)
            const rowPattern = index % 6;
            let alignClass = "center";
            if (rowPattern === 1 || rowPattern === 2) alignClass = "right";
            else if (rowPattern === 4 || rowPattern === 5) alignClass = "left";

            return (
              <div
                key={lvl.levelId}
                ref={isCurrent ? activeNodeRef : null}
                className={`map-node-row ${alignClass}`}
              >
                {/* Connecting Path Line to Next Node */}
                {index < levels.length - 1 && (
                  <div className={`map-path-connector ${isUnlocked ? "unlocked" : "locked"}`} />
                )}

                {/* Level Node Component */}
                <div
                  className={`map-level-node ${isUnlocked ? "unlocked" : "locked"} ${isCurrent ? "current-active" : ""} ${pInfo.completed ? "completed" : ""} ${isBoss ? "boss-node" : ""} ${isShaking ? "shake-node" : ""}`}
                  style={{ "--node-color": lvl.color }}
                  onClick={() => handleNodeClick(lvl)}
                >
                  {/* Node Badge Outer Glow Ring */}
                  <div className="node-glow-ring" />

                  {/* Node Icon / Number */}
                  <div className="node-content">
                    {pInfo.completed ? (
                      <span className="node-check">✓</span>
                    ) : isUnlocked ? (
                      <span className="node-icon">{lvl.icon}</span>
                    ) : (
                      <span className="node-lock">🔒</span>
                    )}

                    <span className="node-level-num">LVL {lvl.levelId}</span>
                  </div>

                  {/* Stars Display for Completed Levels */}
                  {pInfo.completed && (
                    <div className="node-stars-row">
                      {[1, 2, 3].map((starNum) => (
                        <span key={starNum} className={`node-star ${starNum <= pInfo.stars ? "earned" : "empty"}`}>
                          ⭐
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Play Pulse Badge for Current Playable Level */}
                  {isCurrent && (
                    <div className="current-play-badge">
                      <span>PLAY</span>
                    </div>
                  )}

                  {/* Boss Name Tag for Milestone Levels */}
                  {isBoss && (
                    <div className="boss-tag-badge">
                      <span>💀 {lvl.bossName}</span>
                    </div>
                  )}
                </div>

                {/* Hover / Info Label Side Card */}
                <div className="map-node-side-info">
                  <div className="side-info-title">{lvl.title}</div>
                  <div className="side-info-sub">{lvl.difficulty} · {lvl.passingScore} Pts Req</div>
                  {pInfo.bestScore > 0 && (
                    <div className="side-info-best">Best: {pInfo.bestScore} pts</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>

    {/* --- LEVEL START LAUNCH MODAL (MOVED OUTSIDE SHELL FOR FULL-SCREEN VIEWPORT COVERAGE) --- */}
    {selectedLevel && (
      <div
        className="modal-backdrop"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: "100vw",
          height: "100vh",
          zIndex: 99999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(0, 0, 0, 0.88)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          padding: 20
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) setSelectedLevel(null);
        }}
      >
        <div
          className="glass-panel"
          style={{
            width: "100%",
            maxWidth: 560,
            padding: "32px 36px",
            borderRadius: 24,
            border: `2px solid ${selectedLevel.color}`,
            boxShadow: `0 0 50px ${selectedLevel.color}50`,
            textAlign: "center",
            position: "relative"
          }}
        >
          <button
            className="hint-close"
            onClick={() => setSelectedLevel(null)}
            style={{ position: "absolute", top: 16, right: 18, fontSize: 18 }}
          >
            ✕
          </button>

          <div style={{ fontSize: 48, marginBottom: 8, filter: `drop-shadow(0 0 16px ${selectedLevel.color})` }}>
            {selectedLevel.icon}
          </div>
          <div style={{ fontSize: 12, fontWeight: 900, color: selectedLevel.color, letterSpacing: "0.15em", textTransform: "uppercase" }}>
            {selectedLevel.tierName} Realm · {selectedLang.toUpperCase()}
          </div>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: "#fff", margin: "6px 0 8px 0" }}>{selectedLevel.title}</h2>
          <p style={{ color: "var(--text-dim)", fontSize: 14, marginBottom: 22, lineHeight: 1.5 }}>{selectedLevel.subtitle}</p>

          {/* Level Parameters Box */}
          <div style={{ background: "rgba(0, 0, 0, 0.45)", borderRadius: 14, padding: "16px 20px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, textAlign: "left", marginBottom: 20, fontSize: 13, border: "1px solid rgba(255, 255, 255, 0.1)" }}>
            <div>
              <span style={{ color: "var(--text-dim)", display: "block", fontSize: 10, fontWeight: 800 }}>DIFFICULTY</span>
              <strong style={{ color: selectedLevel.color }}>{selectedLevel.difficulty}</strong>
            </div>
            <div>
              <span style={{ color: "var(--text-dim)", display: "block", fontSize: 10, fontWeight: 800 }}>LANGUAGE</span>
              <strong style={{ color: "#fff" }}>{selectedLang.toUpperCase()}</strong>
            </div>
            <div>
              <span style={{ color: "var(--text-dim)", display: "block", fontSize: 10, fontWeight: 800 }}>PASSING SCORE</span>
              <strong style={{ color: "#ffd700" }}>{selectedLevel.passingScore} Pts</strong>
            </div>
            <div>
              <span style={{ color: "var(--text-dim)", display: "block", fontSize: 10, fontWeight: 800 }}>REWARDS</span>
              <strong style={{ color: "#22c55e" }}>+{selectedLevel.xpReward} XP · +{selectedLevel.coinReward} Coins</strong>
            </div>
          </div>

          {/* Star Threshold Info */}
          <div style={{ display: "flex", justifyContent: "space-around", fontSize: 12, background: "rgba(255, 215, 0, 0.08)", padding: "10px 14px", borderRadius: 12, border: "1px solid rgba(255, 215, 0, 0.25)", marginBottom: 24, fontWeight: 700 }}>
            <span>⭐ 1 Star: {selectedLevel.oneStarScore} pts</span>
            <span>⭐⭐ 2 Stars: {selectedLevel.twoStarScore} pts</span>
            <span>⭐⭐⭐ 3 Stars: {selectedLevel.threeStarScore} pts</span>
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            <button className="btn btn-ghost" onClick={() => setSelectedLevel(null)} style={{ flex: 1, padding: "14px 20px", fontSize: 14 }}>
              Cancel
            </button>
            <button
              className="btn btn-start"
              onClick={() => {
                const lvl = selectedLevel;
                const lang = selectedLang;
                setSelectedLevel(null);
                onStartLevel({ levelId: lvl.levelId, levelConfig: lvl, language: lang });
              }}
              style={{ flex: 1.8, padding: "14px 20px", fontSize: 14, background: `linear-gradient(90deg, ${selectedLevel.color}, var(--neon-cyan))` }}
            >
              ⚔️ START LEVEL {selectedLevel.levelId} ({selectedLang.toUpperCase()})
            </button>
          </div>
        </div>
      </div>
    )}
  </>
  );
}
