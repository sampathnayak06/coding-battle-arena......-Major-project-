import { useEffect, useRef, useState } from "react";
import { socket } from "../socket.js";
import { isMobileDevice } from "../utils/device.js";

const LANGUAGES = [
  { key: "html", label: "HTML", icon: "🌐", color: "#FF7A00" },
  { key: "css", label: "CSS", icon: "🎨", color: "#00E5FF" },
  { key: "javascript", label: "JavaScript", icon: "⚡", color: "#FFD700" },
  { key: "python", label: "Python", icon: "🐍", color: "#22C55E" },
  { key: "java", label: "Java", icon: "☕", color: "#EF4444" },
  { key: "cpp", label: "C++", icon: "➕", color: "#9D4EDD" }
];

const LEVELS = [
  { level: 1, name: "Level 1: Novice", tag: "Basic Syntax", icon: "🌱", color: "#22C55E", desc: "100% basic tags, prints & simple syntax" },
  { level: 2, name: "Level 2: Beginner", tag: "Fundamentals", icon: "☘️", color: "#4ADE80", desc: "Core selectors, basic loops & conditionals" },
  { level: 3, name: "Level 3: Elementary", tag: "Core Concepts", icon: "⚡", color: "#A3E635", desc: "Attributes, lists, array methods & styling" },
  { level: 4, name: "Level 4: Inter. Novice", tag: "Functions", icon: "🔥", color: "#FACC15", desc: "Functions, positioning & structure" },
  { level: 5, name: "Level 5: Intermediate", tag: "Standard Dev", icon: "⚔️", color: "#FB923C", desc: "Flexbox, media tags, objects & methods" },
  { level: 6, name: "Level 6: Upper Inter.", tag: "Logic & Forms", icon: "🛡️", color: "#F97316", desc: "Forms, grid, list comprehension & errors" },
  { level: 7, name: "Level 7: Adv. Novice", tag: "Async & OOP", icon: "🔮", color: "#EC4899", desc: "Async/Promises, specificity & closures" },
  { level: 8, name: "Level 8: Advanced", tag: "Deep Execution", icon: "💎", color: "#A855F7", desc: "Event loop, memory allocation & pointers" },
  { level: 9, name: "Level 9: Expert", tag: "Architect", icon: "👑", color: "#8B5CF6", desc: "Performance, virtual tables & GC algorithms" },
  { level: 10, name: "Level 10: Grandmaster", tag: "Mastery", icon: "🏆", color: "#EF4444", desc: "Peak challenge, edge cases & fast AI" }
];

export default function LobbyPage({ mode, onMatchStart, onCancel }) {
  const [language, setLanguage] = useState(null);
  const [level, setLevel] = useState(1);
  const [subMode, setSubMode] = useState("choose"); // choose | create | join
  const [roomCode, setRoomCode] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [durationMinutes, setDurationMinutes] = useState(15);
  const [busy, setBusy] = useState(false);
  const [connectionError, setConnectionError] = useState("");
  const joinTimeoutRef = useRef(null);
  const createTimeoutRef = useRef(null);

  const isMobile = isMobileDevice();
  const currentPlatform = isMobile ? "mobile" : "desktop";

  useEffect(() => {
    setSubMode("choose");
    setRoomCode("");
    setJoinCode("");
    resetStatus();
    setBusy(false);
  }, [mode]);

  useEffect(() => {
    const onConnectError = (err) => {
      const message = err?.message || "Unable to connect to the game server.";
      setConnectionError(message);
      setBusy(false);
      setStatus("");
    };

    const onConnect = () => {
      setConnectionError("");
    };

    socket.on("connect_error", onConnectError);
    socket.on("connect", onConnect);

    return () => {
      socket.off("connect_error", onConnectError);
      socket.off("connect", onConnect);
      if (joinTimeoutRef.current) clearTimeout(joinTimeoutRef.current);
      if (createTimeoutRef.current) clearTimeout(createTimeoutRef.current);
    };
  }, []);

  function ensureSocketConnected() {
    if (!socket.connected && !socket.connecting) {
      socket.connect();
    }
  }

  function resetStatus() {
    setStatus("");
    setError("");
    setConnectionError("");
  }

  function startAiPractice() {
    resetStatus();
    setStatus(`Launching Cyber AI Bot (Lvl ${level})…`);
    setBusy(true);
    setError("");

    const sendAiStart = () => {
      socket.emit("ai:start", { language, difficulty: level, durationMinutes, platform: currentPlatform }, (err, res) => {
        setBusy(false);
        const payload = err?.error ? err : res;
        if (payload?.error) {
          setError(payload.error);
          setStatus("");
          return;
        }
        setStatus("");
        onMatchStart({ ...payload, vsAI: true });
      });
    };

    ensureSocketConnected();
    if (socket.connected) {
      sendAiStart();
    } else {
      socket.once("connect", sendAiStart);
    }
  }

  function startQuickMatch() {
    resetStatus();
    setBusy(true);
    setSubMode("queue");
    setStatus("Searching for an online opponent with similar ELO…");
    ensureSocketConnected();

    const onMatchFound = (data) => {
      setBusy(false);
      setStatus("");
      onMatchStart({ ...data, vsAI: false });
    };

    socket.once("matchmaking:found", onMatchFound);

    socket.emit("queue:join", { language, difficulty: level, platform: currentPlatform }, (err, res) => {
      const payload = err?.error ? err : res;
      if (payload?.error) {
        setBusy(false);
        setError(payload.error);
        setSubMode("choose");
        return;
      }
      if (payload?.status === "matched") {
        setBusy(false);
        setStatus("");
        onMatchStart({ ...payload, vsAI: false });
      }
    });
  }

  function cancelQuickMatch() {
    socket.emit("queue:leave");
    setBusy(false);
    resetStatus();
    setSubMode("choose");
  }

  function createRoom() {
    resetStatus();
    setBusy(true);
    setSubMode("create");
    setStatus("Generating room code…");
    ensureSocketConnected();

    createTimeoutRef.current = setTimeout(() => {
      setBusy(false);
      setError("Room creation timed out. Please try again.");
      setStatus("");
    }, 10000);

    socket.emit("room:create", { language, difficulty: level, durationMinutes, platform: currentPlatform }, (err, res) => {
      clearTimeout(createTimeoutRef.current);
      createTimeoutRef.current = null;
      setBusy(false);
      const payload = err?.error ? err : res;
      if (payload?.error) {
        setError(payload.error);
        setStatus("");
        return;
      }
      setRoomCode(payload.roomCode);
      setStatus("Waiting for an opponent to join…");
      socket.once("match:start", (data) => onMatchStart({ ...data, vsAI: false }));
    });
  }

  function joinRoom(e) {
    e.preventDefault();
    resetStatus();
    setBusy(true);
    setStatus("Joining room…");
    ensureSocketConnected();
    joinTimeoutRef.current = setTimeout(() => {
      setBusy(false);
      setError("Join timed out. Please check your room code or your connection.");
      setStatus("");
    }, 10000);

    socket.emit("room:join", { roomCode: joinCode.trim().toUpperCase() }, (err, res) => {
      clearTimeout(joinTimeoutRef.current);
      joinTimeoutRef.current = null;
      setBusy(false);
      const payload = err?.error ? err : res;
      if (payload?.error) {
        setError(payload.error);
        setStatus("");
        return;
      }
      setStatus("");
      onMatchStart({ ...payload, vsAI: false });
    });
  }

  function copyLink() {
    const url = `${window.location.origin}/?room=${roomCode}`;
    navigator.clipboard?.writeText(url);
    setStatus("Link copied to clipboard!");
  }

  const selectedLevelObj = LEVELS.find((l) => l.level === level) || LEVELS[0];

  return (
    <div className="lobby-page glass-panel">
      <button className="back-btn lobby-close" onClick={onCancel} style={{ padding: "10px 20px", fontSize: 13 }}>
        ← BACK
      </button>

      <div className="section-eyebrow">{mode === "ai" ? "AI PRACTICE MODE" : "1v1 BATTLE ARENA"}</div>
      <h2 className="section-title">
        {mode === "ai" ? `Train Against Cyber AI Bot (Level ${level})` : "Find Your Opponent"}
      </h2>

      {/* --- Step 1: Language selection --- */}
      <div className="lobby-step-label">STEP 1 — CHOOSE YOUR LANGUAGE</div>
      <div className="language-grid">
        {LANGUAGES.map((l) => (
          <button
            key={l.key}
            data-lang={l.key}
            className={`language-card ${language === l.key ? "selected" : ""}`}
            style={{ "--lang-color": l.color }}
            onClick={() => setLanguage(l.key)}
          >
            <span className="language-icon">{l.icon}</span>
            <span className="language-label">{l.label}</span>
          </button>
        ))}
      </div>

      {language && (
        <>
          {/* --- Step 2: 10-Level Selection --- */}
          <div className="lobby-step-label" style={{ marginTop: 24 }}>
            STEP 2 — SELECT DIFFICULTY LEVEL (LEVEL 1 TO 10)
          </div>

          <div style={{ marginBottom: 12, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: selectedLevelObj.color }}>
              {selectedLevelObj.icon} {selectedLevelObj.name} — <span style={{ opacity: 0.8 }}>{selectedLevelObj.tag}</span>
            </span>
            <span style={{ fontSize: 11, color: "var(--text-dim)" }}>
              Level {level} of 10
            </span>
          </div>

          <div className="level-grid" style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10, marginBottom: 16 }}>
            {LEVELS.map((l) => {
              const isSelected = level === l.level;
              return (
                <button
                  key={l.level}
                  type="button"
                  className={`level-card glass-panel ${isSelected ? "selected" : ""}`}
                  style={{
                    padding: "10px 8px",
                    borderRadius: 8,
                    textAlign: "center",
                    background: isSelected ? `rgba(255, 255, 255, 0.1)` : "rgba(255, 255, 255, 0.02)",
                    border: isSelected ? `2px solid ${l.color}` : "1px solid rgba(255, 255, 255, 0.08)",
                    cursor: "pointer",
                    boxShadow: isSelected ? `0 0 12px ${l.color}40` : "none",
                    transition: "all 0.2s ease"
                  }}
                  onClick={() => setLevel(l.level)}
                >
                  <div style={{ fontSize: 18, marginBottom: 2 }}>{l.icon}</div>
                  <div style={{ fontWeight: 800, fontSize: 13, color: isSelected ? l.color : "#fff" }}>
                    Lvl {l.level}
                  </div>
                  <div style={{ fontSize: 9, color: "var(--text-dim)", marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {l.tag}
                  </div>
                </button>
              );
            })}
          </div>

          <div
            style={{
              padding: "12px 16px",
              borderRadius: 8,
              background: "rgba(0, 0, 0, 0.3)",
              border: `1px solid ${selectedLevelObj.color}40`,
              marginBottom: 20
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 700, color: selectedLevelObj.color, marginBottom: 4 }}>
              {selectedLevelObj.name} Summary
            </div>
            <div style={{ fontSize: 11, color: "var(--text-dim)", lineHeight: 1.4 }}>
              {selectedLevelObj.desc}
            </div>
          </div>

          <div className="question-count-preview">
            <span className="question-count-chip mcq">10 Multiple Choice</span>
            <span className="question-count-plus">+</span>
            <span className="question-count-chip code">2–5 Code Typing</span>
            <span className="question-count-total">
              = 12–15 questions in {LANGUAGES.find((l) => l.key === language).label} ({selectedLevelObj.name})
            </span>
          </div>

          <div className="lobby-duration-panel">
            <div className="lobby-duration-label">TIME LIMIT</div>
            <div className="duration-control">
              <button
                type="button"
                className="duration-btn"
                onClick={() => setDurationMinutes((minutes) => Math.max(5, minutes - 5))}
                disabled={durationMinutes <= 5}
              >
                −
              </button>
              <span className="duration-value">{durationMinutes} min</span>
              <button
                type="button"
                className="duration-btn"
                onClick={() => setDurationMinutes((minutes) => Math.min(30, minutes + 5))}
                disabled={durationMinutes >= 30}
              >
                +
              </button>
            </div>
            <p className="lobby-duration-note">Choose a shorter or longer match time before starting your duel.</p>
          </div>
        </>
      )}

      {/* --- Step 3: Mode action --- */}
      {mode === "ai" && subMode === "choose" && (
        <div className="lobby-actions">
          <p className="lobby-copy">
            Bypass the room screens completely — jump straight into a solo duel against the AI.
          </p>
          <button className="btn btn-start" onClick={startAiPractice} disabled={!language}>
            🤖 START AI PRACTICE
          </button>
          {!language && <p className="lobby-hint">Select a language above to enable AI practice.</p>}
        </div>
      )}

      {language && mode === "arena" && subMode === "choose" && (
        <div className="lobby-mode-grid">
          <button className="lobby-mode-card glass-panel" onClick={startQuickMatch} disabled={busy}>
            <span className="lobby-mode-icon">⚡</span>
            <span className="lobby-mode-title">Quick Match</span>
            <span className="lobby-mode-desc">Auto-match with an online player of similar ELO.</span>
          </button>
          <button className="lobby-mode-card glass-panel" onClick={createRoom} disabled={busy}>
            <span className="lobby-mode-icon">🔑</span>
            <span className="lobby-mode-title">Create Room</span>
            <span className="lobby-mode-desc">Generate a passcode & invite a friend to duel.</span>
          </button>
          <button className="lobby-mode-card glass-panel" onClick={() => { resetStatus(); setSubMode("join"); }}>
            <span className="lobby-mode-icon">🚪</span>
            <span className="lobby-mode-title">Join Room</span>
            <span className="lobby-mode-desc">Enter a friend's 6-character passcode.</span>
          </button>
        </div>
      )}

      {mode === "arena" && subMode === "queue" && (
        <div className="lobby-room-panel">
          <span className="lobby-room-code">SEARCHING…</span>
          <p className="lobby-status">{status || "Finding an online opponent with similar ELO rating…"}</p>
          <span className="lobby-spinner" aria-hidden="true" />
          <button className="btn btn-ghost" onClick={cancelQuickMatch} style={{ marginTop: 12 }}>
            ✕ CANCEL QUEUE
          </button>
        </div>
      )}

      {mode === "arena" && subMode === "create" && (
        <div className="lobby-room-panel">
          <span className="lobby-room-code">{roomCode || "……"}</span>
          <button className="btn btn-ghost" onClick={copyLink} disabled={!roomCode}>
            📋 COPY SHAREABLE LINK
          </button>
          <p className="lobby-status">{status}</p>
          <span className="lobby-spinner" aria-hidden="true" />
        </div>
      )}

      {mode === "arena" && subMode === "join" && (
        <form className="lobby-room-panel" onSubmit={joinRoom}>
          <input
            className="auth-input lobby-code-input"
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value)}
            placeholder="ROOM CODE"
            maxLength={6}
            required
          />
          <button className="btn btn-start" type="submit" disabled={busy || joinCode.trim().length !== 6}>
            ⚔️ JOIN & BATTLE
          </button>
          {status && <p className="lobby-status">{status}</p>}
          {connectionError && <p className="auth-error lobby-error">{connectionError}</p>}
          <p className="lobby-hint">Joining a room uses the host's chosen language and time limit automatically.</p>
        </form>
      )}

      {error && <div className="auth-error lobby-error">{error}</div>}
    </div>
  );
}
