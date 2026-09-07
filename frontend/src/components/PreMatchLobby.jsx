import { useEffect, useState } from "react";
import { animeHeroes, getTierForElo } from "../data/animeData.js";
import audioManager from "../services/audioManager.js";

function heroFor(heroId) {
  return animeHeroes.find((h) => h.id === heroId) || animeHeroes[0];
}

export default function PreMatchLobby({ matchData, player, onFightStart }) {
  const [countdown, setCountdown] = useState(3);
  const [fightText, setFightText] = useState("");

  const selfHero = heroFor(player?.heroId);
  const selfTier = getTierForElo(player?.elo || 1000);

  const isVsAI = matchData?.vsAI;
  const opponentHero = isVsAI ? heroFor("gojo") : heroFor("saitama");
  const opponentName = isVsAI ? `Cyber AI Bot (Lvl ${matchData?.level?.level || 1})` : "Opponent";
  const opponentElo = isVsAI ? 1200 + (matchData?.level?.level || 1) * 40 : 1240;
  const opponentTier = getTierForElo(opponentElo);

  useEffect(() => {
    audioManager.playCountdownTick();
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setFightText("FIGHT!");
          audioManager.playFightStart();
          setTimeout(() => {
            onFightStart();
          }, 700);
          return 0;
        }
        audioManager.playCountdownTick();
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="pre-match-overlay glass-panel">
      <div className="pre-match-header">
        <span className="pre-match-tag">ESPORTS DUEL INITIALIZING</span>
        <h2 className="pre-match-title">
          {matchData?.language?.toUpperCase()} MATCH · LEVEL {matchData?.level?.level || matchData?.difficulty || 1}
        </h2>
      </div>

      <div className="pre-match-versus-container">
        {/* Player 1 Card */}
        <div className="pre-match-card self">
          <div className="pre-match-avatar-frame" style={{ borderColor: selfHero.color }}>
            <span className="pre-match-avatar" style={{ filter: `drop-shadow(0 0 12px ${selfHero.glow})` }}>
              {selfHero.emoji}
            </span>
          </div>
          <div className="pre-match-info">
            <span className="pre-match-username">{player?.username || "You"}</span>
            <span className="pre-match-tier-badge" style={{ background: `${selfHero.color}30`, color: selfHero.color }}>
              {selfTier.name}
            </span>
            <span className="pre-match-elo">ELO {player?.elo || 1000}</span>
          </div>
        </div>

        {/* VS Badge & Countdown */}
        <div className="pre-match-center">
          <div className="pre-match-vs-badge">VS</div>
          {fightText ? (
            <div className="pre-match-fight-text animated-pulse">{fightText}</div>
          ) : (
            <div className="pre-match-countdown">{countdown}</div>
          )}
        </div>

        {/* Opponent Card */}
        <div className="pre-match-card opponent">
          <div className="pre-match-avatar-frame" style={{ borderColor: opponentHero.color }}>
            <span className="pre-match-avatar" style={{ filter: `drop-shadow(0 0 12px ${opponentHero.glow})` }}>
              {opponentHero.emoji}
            </span>
          </div>
          <div className="pre-match-info">
            <span className="pre-match-username">{opponentName}</span>
            <span className="pre-match-tier-badge" style={{ background: `${opponentHero.color}30`, color: opponentHero.color }}>
              {opponentTier.name}
            </span>
            <span className="pre-match-elo">ELO {opponentElo}</span>
          </div>
        </div>
      </div>

      <div className="pre-match-footer">
        <span>⏱ Match Limit: <strong>{matchData?.durationMinutes || 15} Mins</strong></span>
        <span>⚔ Series: <strong>{matchData?.series?.length || 15} Questions</strong></span>
        <span>🌐 Host Language: <strong>{matchData?.language?.toUpperCase()}</strong></span>
      </div>
    </div>
  );
}
