import { useEffect, useRef } from "react";
import audioManager from "../services/audioManager.js";

export default function HistoryStickyNote({ player, onClose }) {
  const panelRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        onClose();
      }
    }
    function handleKeyDown(e) {
      if (e.key === "Escape") onClose();
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  function handleClose() {
    audioManager.playClick();
    onClose();
  }

  // Derive history logs from campaignProgress or matchHistory
  const campaignProgress = Array.isArray(player?.campaignProgress) ? player.campaignProgress : [];
  const matchHistory = Array.isArray(player?.matchHistory) ? player.matchHistory : [];

  // Format list items
  const historyEntries = [];

  campaignProgress.forEach((cp) => {
    if (cp.languageProgress) {
      const langEntries = typeof cp.languageProgress.entries === "function"
        ? Array.from(cp.languageProgress.entries())
        : Object.entries(cp.languageProgress);

      langEntries.forEach(([lang, p]) => {
        if (p && (p.attempts > 0 || p.completed)) {
          historyEntries.push({
            levelName: `Level ${cp.levelId}`,
            language: String(lang).toUpperCase(),
            stars: p.stars ? "⭐".repeat(p.stars) : "❌",
            score: p.bestScore || 0,
            result: p.completed ? "Completed" : "Failed",
            passed: p.completed
          });
        }
      });
    }
  });

  // Fallback to matchHistory if no languageProgress entries exist yet
  if (historyEntries.length === 0 && matchHistory.length > 0) {
    matchHistory.slice(0, 5).forEach((m) => {
      const isWin = m.result === "VICTORY";
      historyEntries.push({
        levelName: m.levelName || "Level 1",
        language: (m.language || "Java").toUpperCase(),
        stars: isWin ? "⭐⭐⭐" : "❌",
        score: m.score || (isWin ? 850 : 350),
        result: isWin ? "Completed" : "Failed",
        passed: isWin
      });
    });
  }

  return (
    <div className="sticky-note-wrapper history-sticky" ref={panelRef}>
      <div className="sticky-note-header">
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 18 }}>📜</span>
          <span className="sticky-note-title">BATTLE HISTORY</span>
        </div>
        <button className="sticky-close-btn" onClick={handleClose} title="Close Note">✕</button>
      </div>

      <div className="sticky-note-body">
        {historyEntries.length === 0 ? (
          <div className="sticky-empty-msg">
            No level records yet. Play Level 1 to start recording your progress!
          </div>
        ) : (
          <div className="sticky-history-table">
            <div className="sticky-history-row head">
              <span>LEVEL</span>
              <span>LANG</span>
              <span>STARS</span>
              <span>SCORE</span>
              <span>STATUS</span>
            </div>

            {historyEntries.slice(0, 6).map((item, idx) => (
              <div key={idx} className={`sticky-history-row ${item.passed ? "passed" : "failed"}`}>
                <span className="lvl-col">{item.levelName}</span>
                <span className="lang-col">{item.language}</span>
                <span className="star-col">{item.stars}</span>
                <span className="score-col">{item.score}</span>
                <span className={`status-col ${item.passed ? "pass" : "fail"}`}>
                  {item.result}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="sticky-note-footer">
        <button className="btn btn-ghost sticky-action-btn" onClick={handleClose}>
          [ CLOSE ]
        </button>
      </div>
    </div>
  );
}
