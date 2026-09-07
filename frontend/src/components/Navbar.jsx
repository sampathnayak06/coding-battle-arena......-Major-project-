const TABS = [
  { id: "hub", label: "Home Hub" },
  { id: "arena", label: "1v1 Battle Arena" },
  { id: "ai", label: "AI Practice" },
  { id: "world", label: "World Levels" },
  { id: "vault", label: "Vault" },
  { id: "leaderboard", label: "Leaderboard" },
  { id: "profile", label: "Profile" },
  { id: "history", label: "History" }
];

export default function Navbar({ activeTab, onNavigate, canGoBack, onBack, connected, username, onLogout, minimal = false, showAssist = false, onToggleAssist = () => {} }) {
  return (
    <header className={`navbar ${minimal ? "navbar--minimal" : ""}`}>
      <div className="navbar-left">
        <div className="navbar-brand">
          <span className="navbar-brand-mark">⚔️</span>
          CODING BATTLE ARENA
        </div>
        {canGoBack && (
          <button className="back-btn" onClick={onBack}>
            ◄ BACK
          </button>
        )}
        <button className={`assist-btn ${showAssist ? 'active' : ''}`} onClick={onToggleAssist} aria-pressed={showAssist} title="Assist: show controls">
          ASSIST
        </button>
      </div>

      {!minimal && (
        <>
          <nav className="navbar-tabs">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                className={`navbar-tab ${activeTab === tab.id ? "active" : ""}`}
                onClick={() => onNavigate(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          <div className="navbar-status">
            <span className={`status-dot ${connected ? "" : "offline"}`} />
            {connected ? "SERVER ONLINE" : "CONNECTION LOST — RECONNECTING..."}
            {username && (
              <>
                <span className="navbar-username">{username}</span>
                <button className="btn btn-logout navbar-logout" onClick={onLogout}>
                  LOGOUT
                </button>
              </>
            )}
          </div>
        </>
      )}
    </header>
  );
}

export { TABS };
