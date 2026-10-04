import { useState } from "react";
import { getHeroById, getTierForElo } from "../data/animeData.js";
import ProfileModal from "./ProfileModal.jsx";
import QRCodeModal from "./QRCodeModal.jsx";
import TopThreeDotMenu from "./TopThreeDotMenu.jsx";
import audioManager from "../services/audioManager.js";

export default function TopTaskbar({ player, connected, onHomeClick, onLogout, onOpenAssist, onOpenHistory, onOpenTheme }) {
  const [showProfile, setShowProfile] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);

  const hero = getHeroById(player?.heroId || "naruto");
  const tier = getTierForElo(player?.elo || 1000);
  const playerLevel = Math.floor((player?.coins || 0) / 100) + 1;

  return (
    <>
      <header className="top-taskbar-hud glass-panel">
        {/* Brand & Home Action */}
        <div className="taskbar-brand" onClick={() => { audioManager.playClick(); onHomeClick?.(); }} style={{ cursor: "pointer" }}>
          <div className="taskbar-logo-icon">⚔️</div>
          <div className="taskbar-brand-titles">
            <span className="taskbar-title">CODING BATTLE ARENA</span>
            <span className="taskbar-subtitle">ESPORTS CAMPAIGN PLATFORM</span>
          </div>
        </div>

        {/* User Stats HUD + Online Now on Upper Right side of QR */}
        <div className="taskbar-stats-group">
          <div className="taskbar-stat-chip elo" title="ELO Skill Rating">
            <span>⚔️</span>
            <strong>{player?.elo || 1000}</strong>
          </div>

          <div className="taskbar-stat-chip xp" title="Experience Points">
            <span>⚡</span>
            <strong>{player?.xp || 0} XP</strong>
          </div>

          <div className="taskbar-stat-chip coins" title="Arena Coins">
            <span>🪙</span>
            <strong>{player?.coins || 0}</strong>
          </div>

          {/* QR Access Button */}
          <button
            className="taskbar-icon-btn qr-btn"
            title="Scan QR for Mobile Access"
            onClick={() => { audioManager.playClick(); setShowQRModal(true); }}
          >
            📱 QR
          </button>

          {/* Online Status Pill (To the Right side of QR) */}
          <div className="taskbar-online-pill">
            <span className={`status-dot ${connected ? "" : "offline"}`} />
            <span className="status-text">{connected ? "🟢 ONLINE NOW" : "🔴 CONNECTING..."}</span>
          </div>
        </div>
      </header>

      {/* Floating Card Below Topbar (Profile in Top, 3-Dot in Down) */}
      <div className="taskbar-chroma-box floating-down">
        {/* Row 1 (TOP): Profile Card Trigger */}
        <button
          className="taskbar-profile-trigger"
          onClick={() => { audioManager.playClick(); setShowProfile(true); }}
          style={{ "--hero-color": hero.color }}
        >
          <div className="taskbar-avatar-circle" style={{ borderColor: hero.color }}>
            <span>{hero.emoji}</span>
          </div>
          <div className="taskbar-user-info">
            <span className="user-name">{player?.username || "Player"}</span>
            <span className="user-tier">{tier.name} · LVL {playerLevel}</span>
          </div>
          <span className="profile-btn-icon">👤</span>
        </button>

        {/* Row 2 (DOWN): 3-Dots Menu */}
        <TopThreeDotMenu onOpenAssist={onOpenAssist} onOpenHistory={onOpenHistory} onOpenTheme={onOpenTheme} />
      </div>

      {/* Profile Modal */}
      {showProfile && (
        <ProfileModal
          profile={player}
          onClose={() => setShowProfile(false)}
          onLogout={onLogout}
        />
      )}

      {/* QR Code Modal for Phone Sync */}
      {showQRModal && (
        <QRCodeModal onClose={() => setShowQRModal(false)} />
      )}
    </>
  );
}
