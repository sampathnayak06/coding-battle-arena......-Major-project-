import { useEffect, useState } from "react";
import audioManager from "../services/audioManager.js";

export default function CampaignVictoryModal({ result, levelConfig, onNextLevel, onRetry, onReturnToMap }) {
  const { passed, stars = 0, score = 0, accuracy = 0, xpEarned = 0, coinsEarned = 0, nextLevelUnlocked } = result || {};
  const [animatedStars, setAnimatedStars] = useState(0);

  useEffect(() => {
    if (passed) {
      audioManager.playWin();
      // Animate stars sequentially
      let count = 0;
      const interval = setInterval(() => {
        if (count < stars) {
          count += 1;
          setAnimatedStars(count);
          audioManager.playReward();
        } else {
          clearInterval(interval);
        }
      }, 450);
      return () => clearInterval(interval);
    } else {
      audioManager.playDefeat();
    }
  }, [passed, stars]);

  const levelId = levelConfig?.levelId || 1;

  return (
    <div
      className="modal-backdrop glass-panel"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(4, 4, 8, 0.9)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)"
      }}
    >
      <div
        className="glass-panel campaign-victory-card"
        style={{
          width: "90%",
          maxWidth: 460,
          padding: "32px 24px",
          borderRadius: 24,
          background: "rgba(10, 11, 20, 0.98)",
          border: passed ? "2px solid #22c55e" : "2px solid #ef4444",
          boxShadow: passed ? "0 0 40px rgba(34, 197, 94, 0.35)" : "0 0 40px rgba(239, 68, 68, 0.35)",
          textAlign: "center",
          position: "relative"
        }}
      >
        {passed ? (
          <>
            <div style={{ fontSize: 12, fontWeight: 900, color: "#22c55e", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 4 }}>
              VICTORY REWARD
            </div>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 900, color: "#fff", margin: "0 0 16px 0" }}>
              LEVEL COMPLETE!
            </h1>

            {/* ⭐ Star Animation Display ⭐ */}
            <div className="victory-stars-container" style={{ display: "flex", justifyContent: "center", gap: 12, marginBottom: 20 }}>
              {[1, 2, 3].map((starNum) => (
                <div
                  key={starNum}
                  className={`victory-star-slot ${starNum <= animatedStars ? "earned animate-pop" : "empty"}`}
                  style={{
                    fontSize: 42,
                    filter: starNum <= animatedStars ? "drop-shadow(0 0 16px #ffd700)" : "grayscale(1) opacity(0.3)",
                    transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
                  }}
                >
                  ⭐
                </div>
              ))}
            </div>

            {/* Score & Rewards Box */}
            <div style={{ background: "rgba(0, 0, 0, 0.5)", borderRadius: 16, padding: "16px 20px", border: "1px solid rgba(255, 255, 255, 0.08)", marginBottom: 20 }}>
              <div style={{ fontSize: 13, color: "var(--text-dim)", marginBottom: 4 }}>FINAL SCORE</div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 900, color: "#ffd700", marginBottom: 12 }}>
                {score} <span style={{ fontSize: 14, color: "var(--text-dim)" }}>/ ACCURACY {accuracy}%</span>
              </div>

              <div style={{ display: "flex", justifyContent: "center", gap: 20, paddingTop: 10, borderTop: "1px solid rgba(255, 255, 255, 0.08)" }}>
                <div>
                  <span style={{ fontSize: 11, color: "var(--text-dim)", display: "block" }}>EXPERIENCE</span>
                  <strong style={{ color: "#00e5ff", fontSize: 16 }}>+{xpEarned} XP</strong>
                </div>
                <div>
                  <span style={{ fontSize: 11, color: "var(--text-dim)", display: "block" }}>ARENA COINS</span>
                  <strong style={{ color: "#ffd700", fontSize: 16 }}>+{coinsEarned} 🪙</strong>
                </div>
              </div>
            </div>

            {/* New Level Unlocked Notification Badge */}
            {nextLevelUnlocked && (
              <div className="new-unlock-badge-row" style={{ background: "rgba(0, 229, 255, 0.15)", border: "1px solid var(--neon-cyan)", padding: "10px 16px", borderRadius: 12, marginBottom: 24, display: "inline-flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 18 }}>🔓</span>
                <span style={{ fontWeight: 800, fontSize: 13, color: "var(--neon-cyan)" }}>
                  NEW LEVEL UNLOCKED! Level {nextLevelUnlocked}
                </span>
              </div>
            )}

            {/* Action Buttons: NEXT LEVEL | LEVEL MAP | RETRY */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {nextLevelUnlocked ? (
                <button
                  className="btn btn-start"
                  onClick={() => onNextLevel(nextLevelUnlocked)}
                  style={{ padding: "14px", fontSize: 14, background: "linear-gradient(90deg, #22c55e, var(--neon-cyan))" }}
                >
                  ⏩ NEXT LEVEL (LEVEL {nextLevelUnlocked})
                </button>
              ) : null}

              <div style={{ display: "flex", gap: 10 }}>
                <button className="btn btn-ghost" onClick={onReturnToMap} style={{ flex: 1, padding: "11px" }}>
                  🗺️ LEVEL MAP
                </button>
                <button className="btn btn-ghost" onClick={() => onRetry(levelId)} style={{ flex: 1, padding: "11px" }}>
                  🔄 RETRY
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            <div style={{ fontSize: 12, fontWeight: 900, color: "#ef4444", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 4 }}>
              MISSION DEFEAT
            </div>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 900, color: "#fff", margin: "0 0 16px 0" }}>
              LEVEL FAILED
            </h1>

            <div style={{ fontSize: 48, marginBottom: 12 }}>💀</div>

            <div style={{ background: "rgba(0, 0, 0, 0.5)", borderRadius: 16, padding: "16px 20px", border: "1px solid rgba(239, 68, 68, 0.2)", marginBottom: 24 }}>
              <div style={{ fontSize: 12, color: "var(--text-dim)", marginBottom: 4 }}>YOUR SCORE</div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 900, color: "#fca5a5" }}>
                {score} Pts
              </div>
              <div style={{ fontSize: 12, color: "var(--text-dim)", marginTop: 6 }}>
                Passing Score Required: <strong style={{ color: "#fff" }}>{levelConfig?.passingScore || 400} Pts</strong>
              </div>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button className="btn btn-start" onClick={() => onRetry(levelId)} style={{ flex: 1, padding: "12px", background: "#ef4444" }}>
                🔄 RETRY LEVEL
              </button>
              <button className="btn btn-ghost" onClick={onReturnToMap} style={{ flex: 1, padding: "12px" }}>
                🗺️ LEVEL MAP
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
