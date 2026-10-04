import { useEffect, useRef } from "react";
import audioManager from "../services/audioManager.js";

export default function AssistStickyNote({ onClose }) {
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

  return (
    <div className="sticky-note-wrapper assist-sticky" ref={panelRef}>
      <div className="sticky-note-header">
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 18 }}>✨</span>
          <span className="sticky-note-title">BATTLE ASSIST INTEL</span>
        </div>
        <button className="sticky-close-btn" onClick={handleClose} title="Close Note">✕</button>
      </div>

      <div className="sticky-note-body">
        <div className="sticky-hint-card">
          <span className="sticky-hint-tag">TACTICAL HINT</span>
          <p className="sticky-hint-text">
            "Look at the loop condition first. Check how many times the loop executes before evaluating the print statement."
          </p>
        </div>

        <div className="sticky-intel-row">
          <span>💡 Need more help? Press <strong>Get Hint</strong> during any battle to eliminate incorrect choices for 50 Arena Coins.</span>
        </div>
      </div>

      <div className="sticky-note-footer">
        <button className="btn btn-ghost sticky-action-btn" onClick={handleClose}>
          [ CLOSE ]
        </button>
      </div>
    </div>
  );
}
