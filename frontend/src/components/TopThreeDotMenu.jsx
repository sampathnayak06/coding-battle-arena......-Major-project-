import { useState, useEffect, useRef } from "react";
import audioManager from "../services/audioManager.js";

export default function TopThreeDotMenu({ onOpenAssist, onOpenHistory, onOpenTheme, onOpenSettings }) {
  const [open, setOpen] = useState(false);
  const [sparkle, setSparkle] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    function handleKeyDown(e) {
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  function handleToggle() {
    audioManager.playClick();
    setSparkle(true);
    setTimeout(() => setSparkle(null), 400);
    setOpen((prev) => !prev);
  }

  function handleAction(action) {
    audioManager.playClick();
    setOpen(false);
    if (action === "settings") onOpenSettings?.();
    else if (action === "assist") onOpenAssist();
    else if (action === "history") onOpenHistory();
    else if (action === "theme") onOpenTheme?.();
  }

  return (
    <div className="top-three-dot-menu-wrapper" ref={menuRef}>
      <button
        className={`three-dot-btn ${open ? "active" : ""} ${sparkle ? "sparkle-pulse" : ""}`}
        onClick={handleToggle}
        aria-label="More Options"
        title="More Options"
      >
        <span className="three-dot-icon">⋮</span>
        {sparkle && (
          <span className="dot-sparkle-burst">
            <span className="particle p1" />
            <span className="particle p2" />
            <span className="particle p3" />
            <span className="particle p4" />
          </span>
        )}
      </button>

      {open && (
        <div className="three-dot-dropdown-panel glass-panel">
          <button className="dropdown-item-btn" onClick={() => handleAction("settings")}>
            <span className="dropdown-item-icon">⚙️</span>
            <span className="dropdown-item-label">Settings</span>
          </button>
          <button className="dropdown-item-btn" onClick={() => handleAction("assist")}>
            <span className="dropdown-item-icon">✨</span>
            <span className="dropdown-item-label">Assist</span>
          </button>
          <button className="dropdown-item-btn" onClick={() => handleAction("theme")}>
            <span className="dropdown-item-icon">🎨</span>
            <span className="dropdown-item-label">Theme & Colors</span>
          </button>
        </div>
      )}
    </div>
  );
}
