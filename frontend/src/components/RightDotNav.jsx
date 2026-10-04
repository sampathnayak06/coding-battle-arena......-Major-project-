import { useState } from "react";
import audioManager from "../services/audioManager.js";

const NAV_DOTS = [
  { id: "arena", label: "1v1 Battle Arena", icon: "⚔️", color: "#FF2E88" },
  { id: "ai", label: "AI Practice", icon: "🤖", color: "#00E5FF" },
  { id: "world", label: "World Levels", icon: "🗺️", color: "#22C55E" },
  { id: "vault", label: "Vault", icon: "📚", color: "#38BDF8" },
  { id: "leaderboard", label: "Leaderboard", icon: "🏆", color: "#FFD700" },
  { id: "history", label: "Battle History", icon: "📜", color: "#9D4EDD" }
];

export default function RightDotNav({ activeSection, onSelectSection }) {
  const [animatingId, setAnimatingId] = useState(null);

  function handleDotClick(dotId) {
    audioManager.playClick();
    setAnimatingId(dotId);
    setTimeout(() => setAnimatingId(null), 450);
    onSelectSection(dotId);
  }

  return (
    <div className="right-dot-nav-container" aria-label="Vertical Navigation">
      <div className="dot-nav-line" />
      <div className="dot-nav-nodes">
        {NAV_DOTS.map((dot) => {
          const isActive = activeSection === dot.id;
          const isAnimating = animatingId === dot.id;

          return (
            <button
              key={dot.id}
              className={`dot-node-btn ${isActive ? "active" : ""} ${isAnimating ? "sparkle-pulse" : ""}`}
              style={{ "--dot-glow": dot.color }}
              onClick={() => handleDotClick(dot.id)}
              title={dot.label}
              aria-label={dot.label}
            >
              <span className="dot-glowing-core" />
              <span className="dot-tooltip">{dot.icon} {dot.label}</span>

              {/* Sparkle Particle Burst Effect */}
              {isAnimating && (
                <span className="dot-sparkle-burst">
                  <span className="particle p1" />
                  <span className="particle p2" />
                  <span className="particle p3" />
                  <span className="particle p4" />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
