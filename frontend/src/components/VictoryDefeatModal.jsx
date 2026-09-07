import { getHeroById, getTierForElo, getNextTierProgress } from "../data/animeData.js";
import { socket } from "../socket.js";
import { useEffect, useState } from "react";
import audioManager from "../services/audioManager.js";

export default function VictoryDefeatModal({ result, onContinue }) {
  const { players, winnerSocketId, reason } = result;
  const self = players.find((p) => p.socketId === socket.id);
  const opponent = players.find((p) => p.socketId !== socket.id);
  const didWin = winnerSocketId === socket.id;
  const disconnected = reason === "opponentDisconnected";

  const selfHero = self ? getHeroById(self.heroId) : getHeroById("kairo");
  const opponentHero = opponent ? getHeroById(opponent.heroId) : getHeroById("nyx");

  const [animStep, setAnimStep] = useState(0);

  useEffect(() => {
    if (didWin) {
      audioManager.playWin();
    } else {
      audioManager.playDefeat();
    }

    const t1 = setTimeout(() => setAnimStep(1), 400);
    const t2 = setTimeout(() => setAnimStep(2), 900);
    const t3 = setTimeout(() => setAnimStep(3), 1400);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [didWin]);

  const eloDelta = self?.eloDelta || 0;
  const coinsEarned = self?.coinsEarned || 0;
  const xpEarned = self?.xpEarned || 0;

  return (
    <div className="modal-overlay">
      <div className={`victory-modal glass-panel ${didWin ? "win" : "lose"}`} style={{ maxWidth: 640 }}>
        {/* Banner */}
        <div className="victory-banner">
          <span className="victory-banner-text">
            {disconnected ? "OPPONENT FORFEITED" : didWin ? "⚡ VICTORY ⚡" : "💀 DEFEAT 💀"}
          </span>
        </div>

        {/* Hero Reaction Quote */}
        <div style={{ textAlign: "center", fontStyle: "italic", fontSize: 13, color: "var(--text-dim)", margin: "8px 0 20px 0" }}>
          "{didWin ? selfHero.dialogue.victory : selfHero.dialogue.defeat}"
        </div>

        {/* Side-by-side Comparison */}
        {!disconnected && (
          <div className="victory-compare" style={{ marginBottom: 20 }}>
            <ComparisonCard label="YOU" hero={selfHero} stats={self} highlight={didWin} />
            <div className="victory-vs">VS</div>
            <ComparisonCard label={opponent?.isAI ? "CYBER AI" : "OPPONENT"} hero={opponentHero} stats={opponent} highlight={!didWin} />
          </div>
        )}

        {/* Animated Reward Badges Row */}
        {self && (
          <div className="victory-rewards-row" style={{ display: "flex", justifyContent: "center", gap: 14, margin: "16px 0" }}>
            <div
              className="victory-reward-chip elo"
              style={{
                opacity: animStep >= 1 ? 1 : 0,
                transform: animStep >= 1 ? "scale(1)" : "scale(0.5)",
                transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
              }}
            >
              {eloDelta >= 0 ? "+" : ""}{eloDelta} ELO
            </div>

            <div
              className="victory-reward-chip coins"
              style={{
                opacity: animStep >= 2 ? 1 : 0,
                transform: animStep >= 2 ? "scale(1)" : "scale(0.5)",
                transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
              }}
            >
              +{coinsEarned} Coins
            </div>

            <div
              className="victory-reward-chip xp"
              style={{
                opacity: animStep >= 3 ? 1 : 0,
                transform: animStep >= 3 ? "scale(1)" : "scale(0.5)",
                transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
              }}
            >
              +{xpEarned} XP
            </div>
          </div>
        )}

        <button className="btn btn-start victory-continue" onClick={onContinue} style={{ width: "100%", marginTop: 10 }}>
          CONTINUE TO GAME HUB
        </button>
      </div>
    </div>
  );
}

function ComparisonCard({ label, hero, stats, highlight }) {
  if (!stats) {
    return (
      <div className="comparison-card">
        <span className="comparison-label">{label}</span>
        <span className="comparison-placeholder">—</span>
      </div>
    );
  }

  return (
    <div className={`comparison-card ${highlight ? "highlight" : ""}`}>
      <span className="comparison-emoji" style={{ filter: `drop-shadow(0 0 10px ${hero.glow})` }}>{hero.emoji}</span>
      <span className="comparison-label">{label} ({hero.name})</span>
      <div className="comparison-stat-row">
        <span className="comparison-stat-label">Questions Cleared</span>
        <span className="comparison-stat-value">{stats.questionsCleared} / {stats.totalQuestions}</span>
      </div>
      <div className="comparison-stat-row">
        <span className="comparison-stat-label">Accuracy</span>
        <span className="comparison-stat-value">{stats.accuracy}%</span>
      </div>
      <div className="comparison-stat-row">
        <span className="comparison-stat-label">Max Combo</span>
        <span className="comparison-stat-value" style={{ color: "#ff7a00" }}>×{stats.maxCombo || 1}</span>
      </div>
      <div className="comparison-stat-row">
        <span className="comparison-stat-label">Remaining HP</span>
        <span className="comparison-stat-value">{stats.hp} HP</span>
      </div>
    </div>
  );
}
