import { useEffect, useState } from "react";
import audioManager from "../services/audioManager.js";

export default function CampaignVictoryModal({ result, levelConfig, onNextLevel, onRetry, onReturnToMap }) {
  const { passed, stars = 0, score = 0, accuracy = 0, xpEarned = 0, coinsEarned = 0, nextLevelUnlocked } = result || {};
  const [animatedStars, setAnimatedStars] = useState(0);

  // Lock document scroll so background doesn't move or scroll automatically
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

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
        background: "rgba(4, 4, 8, 0.92)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        padding: 20
      }}
    >
      <div
        className="glass-panel campaign-victory-card"
        style={{
          width: "100%",
          maxWidth: 480,
          padding: "36px 28px",
          borderRadius: 24,
          background: "rgba(10, 11, 20, 0.98)",
          border: passed ? "2px solid #22c55e" : "2px solid #ef4444",
          boxShadow: passed ? "0 0 50px rgba(34, 197, 94, 0.4)" : "0 0 50px rgba(239, 68, 68, 0.45)",
          textAlign: "center",
          position: "relative"
        }}
      >
        {passed ? (
          <>
            <div style={{ fontSize: 12, fontWeight: 900, color: "#22c55e", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 6 }}>
              MISSION STATUS
            </div>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 900, color: "#fff", textShadow: "0 0 20px rgba(34, 197, 94, 0.6)", margin: "0 0 16px 0", letterSpacing: "0.08em" }}>
              ⚡ VICTORY ⚡
            </h1>
            <div style={{ fontSize: 13, color: "var(--text-dim)", marginBottom: 18 }}>
              Level {levelId}: {levelConfig?.title || "Level Complete"}
            </div>

            {/* ⭐ Star Animation Display ⭐ */}
            <div className="victory-stars-container" style={{ display: "flex", justifyContent: "center", gap: 14, marginBottom: 22 }}>
              {[1, 2, 3].map((starNum) => (
                <div
                  key={starNum}
                  className={`victory-star-slot ${starNum <= animatedStars ? "earned animate-pop" : "empty"}`}
                  style={{
                    fontSize: 44,
                    filter: starNum <= animatedStars ? "drop-shadow(0 0 18px #ffd700)" : "grayscale(1) opacity(0.25)",
                    transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
                  }}
                >
                  ⭐
                </div>
              ))}
            </div>

            {/* Score & Rewards Box */}
            <div style={{ background: "rgba(0, 0, 0, 0.55)", borderRadius: 16, padding: "18px 22px", border: "1px solid rgba(255, 255, 255, 0.08)", marginBottom: 20 }}>
              <div style={{ fontSize: 12, color: "var(--text-dim)", marginBottom: 4, letterSpacing: "0.05em" }}>FINAL SCORE</div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 36, fontWeight: 900, color: "#ffd700", marginBottom: 12 }}>
                {score} <span style={{ fontSize: 15, color: "var(--text-dim)" }}>/ ACCURACY {accuracy}%</span>
              </div>

              <div style={{ display: "flex", justifyContent: "center", gap: 24, paddingTop: 12, borderTop: "1px solid rgba(255, 255, 255, 0.08)" }}>
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
              <div className="new-unlock-badge-row" style={{ background: "rgba(0, 229, 255, 0.15)", border: "1px solid var(--neon-cyan)", padding: "10px 18px", borderRadius: 12, marginBottom: 24, display: "inline-flex", alignItems: "center", gap: 8 }}>
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
                <button className="btn btn-ghost" onClick={onReturnToMap} style={{ flex: 1, padding: "12px", border: "1px solid rgba(255, 255, 255, 0.2)" }}>
                  🗺️ LEVEL MAP
                </button>
                <button className="btn btn-ghost" onClick={() => onRetry(levelId)} style={{ flex: 1, padding: "12px" }}>
                  🔄 RETRY
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            <div style={{ fontSize: 12, fontWeight: 900, color: "#ef4444", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 6 }}>
              MISSION STATUS
            </div>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 900, color: "#ef4444", textShadow: "0 0 20px rgba(239, 68, 68, 0.6)", margin: "0 0 16px 0", letterSpacing: "0.08em" }}>
              💀 DEFEAT 💀
            </h1>
            <div style={{ fontSize: 13, color: "var(--text-dim)", marginBottom: 16 }}>
              Level {levelId}: {levelConfig?.title || "Challenge Failed"}
            </div>

            <div style={{ fontSize: 52, marginBottom: 14, filter: "drop-shadow(0 0 16px rgba(239, 68, 68, 0.5))" }}>
              💀
            </div>

            <div style={{ background: "rgba(0, 0, 0, 0.55)", borderRadius: 16, padding: "18px 22px", border: "1px solid rgba(239, 68, 68, 0.3)", marginBottom: 24 }}>
              <div style={{ fontSize: 12, color: "var(--text-dim)", marginBottom: 4, letterSpacing: "0.05em" }}>YOUR SCORE</div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 36, fontWeight: 900, color: "#fca5a5", marginBottom: 6 }}>
                {score} <span style={{ fontSize: 16, color: "var(--text-dim)" }}>Pts</span>
              </div>
              <div style={{ fontSize: 13, color: "#cbd5e1", marginTop: 4 }}>
                Passing Score Required: <strong style={{ color: "#ffd700", fontWeight: 900 }}>{levelConfig?.passingScore || 400} Pts</strong>
              </div>
              {accuracy !== undefined && (
                <div style={{ fontSize: 12, color: "var(--text-dim)", marginTop: 6 }}>
                  Accuracy Achieved: {accuracy}%
                </div>
              )}
            </div>

            <div style={{ display: "flex", gap: 12 }}>
              <button
                className="btn btn-start"
                onClick={() => onRetry(levelId)}
                style={{ flex: 1.2, padding: "14px", fontSize: 14, background: "linear-gradient(90deg, #ef4444, #dc2626)" }}
              >
                🔄 RETRY LEVEL
              </button>
              <button
                className="btn btn-ghost"
                onClick={onReturnToMap}
                style={{ flex: 1, padding: "14px", fontSize: 14, border: "1px solid rgba(255, 255, 255, 0.2)" }}
              >
                🗺️ LEVEL MAP
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
