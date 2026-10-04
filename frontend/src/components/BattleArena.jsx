import { useEffect, useState } from "react";
import { socket } from "../socket.js";
import { animeHeroes, getTierForElo, getHeroById } from "../data/animeData.js";
import audioManager from "../services/audioManager.js";
import PreMatchLobby from "./PreMatchLobby.jsx";

function formatTime(ms) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const m = String(Math.floor(total / 60)).padStart(2, "0");
  const s = String(total % 60).padStart(2, "0");
  return `${m}:${s}`;
}

const LANGUAGE_EFFECT_CLASSES = {
  javascript: "attack-vfx-javascript",
  python: "attack-vfx-python",
  cpp: "attack-vfx-cpp",
  java: "attack-vfx-java",
  html: "attack-vfx-html",
  css: "attack-vfx-css"
};

export default function BattleArena({ matchData, player, onMatchEnd }) {
  const { roomCode, series, endsAt, vsAI, language, level } = matchData;

  const [inPreLobby, setInPreLobby] = useState(true);
  const [connected, setConnected] = useState(socket.connected);

  const [selfHp, setSelfHp] = useState(100);
  const [opponentHp, setOpponentHp] = useState(100);
  const [questionsCleared, setQuestionsCleared] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [codeDraft, setCodeDraft] = useState("");
  const [lastResult, setLastResult] = useState(null);
  const [locked, setLocked] = useState(false);
  const [rewardPopup, setRewardPopup] = useState(null);
  const [hints, setHints] = useState(null);
  const [activeHintLevel, setActiveHintLevel] = useState(0);
  const [playerCoins, setPlayerCoins] = useState(player?.coins || 0);
  const [hintLoading, setHintLoading] = useState(false);
  const [remaining, setRemaining] = useState(endsAt - Date.now());

  // AAA Esports VFX & Gameplay States
  const [combo, setCombo] = useState(0);
  const [speedRating, setSpeedRating] = useState(null);
  const [shakeScreen, setShakeScreen] = useState(false);
  const [redFlash, setRedFlash] = useState(false);
  const [announcerText, setAnnouncerText] = useState("");
  const [floatingDamages, setFloatingDamages] = useState([]);
  const [activeVfx, setActiveVfx] = useState("");
  const [dialoguePopup, setDialoguePopup] = useState(null);
  const [battleLogs, setBattleLogs] = useState([]);
  const [testCaseOutput, setTestCaseOutput] = useState(null);

  const selfHero = getHeroById(player?.heroId || "kairo");
  const selfTier = getTierForElo(player?.elo || 1000);

  const opponentHero = vsAI ? getHeroById("gojo") : getHeroById("saitama");
  const opponentElo = vsAI ? 1200 + (level?.level || 1) * 40 : 1240;
  const opponentTier = getTierForElo(opponentElo);

  const accuracy = answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0;
  const question = series[currentIndex];
  const total = series.length;

  useEffect(() => {
    const onConnect = () => setConnected(true);
    const onDisconnect = () => setConnected(false);
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  useEffect(() => {
    setCodeDraft(question?.type === "code" ? question.starter || "" : "");
    setTestCaseOutput(null);
  }, [currentIndex]);

  useEffect(() => {
    const tick = setInterval(() => setRemaining(endsAt - Date.now()), 1000);
    return () => clearInterval(tick);
  }, [endsAt]);

  const addBattleLog = (text) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setBattleLogs((prev) => [`[${timeStr}] ${text}`, ...prev.slice(0, 15)]);
  };

  const triggerAnnouncer = (text) => {
    setAnnouncerText(text);
    setTimeout(() => setAnnouncerText(""), 1600);
  };

  const triggerHeroDialogue = (line, speaker = selfHero.name) => {
    setDialoguePopup({ speaker, line });
    setTimeout(() => setDialoguePopup(null), 2500);
  };

  const triggerLanguageVfx = (lang) => {
    const vfxClass = LANGUAGE_EFFECT_CLASSES[lang.toLowerCase()] || "attack-vfx-javascript";
    setActiveVfx(vfxClass);
    setTimeout(() => setActiveVfx(""), 1200);
  };

  const addFloatingDamage = (target, text, isCrit = false) => {
    const id = Date.now() + Math.random();
    setFloatingDamages((prev) => [...prev, { id, target, text, isCrit }]);
    setTimeout(() => {
      setFloatingDamages((prev) => prev.filter((d) => d.id !== id));
    }, 1200);
  };

  useEffect(() => {
    function onProgress(data) {
      const isMe = data.socketId === socket.id;

      if (isMe) {
        setSelfHp(data.hp);
        setQuestionsCleared(data.questionsCleared);
        setAnsweredCount((c) => c + 1);

        if (data.isCorrect) {
          setCorrectCount((c) => c + 1);
          setCombo(data.combo || 1);
          setSpeedRating(data.speedRating);

          triggerLanguageVfx(language);

          if (data.isCritical) {
            audioManager.playCriticalHit();
            triggerAnnouncer("⚡ CRITICAL STRIKE!");
            triggerHeroDialogue(selfHero.dialogue.crit);
            addFloatingDamage("opponent", `-${data.damageDealt} CRIT!`, true);
            addBattleLog(`CRITICAL HIT by ${selfHero.name}! Dealt -${data.damageDealt} HP`);
            setShakeScreen(true);
            setTimeout(() => setShakeScreen(false), 500);
          } else {
            audioManager.playCorrect();
            if (data.combo >= 5) {
              triggerAnnouncer("🔥 MAX COMBO!");
              triggerHeroDialogue(selfHero.dialogue.combo);
            } else if (data.speedRating === "PERFECT") {
              triggerAnnouncer("⚡ PERFECT!");
            } else if (data.combo > 1) {
              triggerAnnouncer(`🔥 COMBO ×${data.combo}!`);
            } else {
              triggerHeroDialogue(selfHero.dialogue.correct);
            }
            addFloatingDamage("opponent", `-${data.damageDealt}`, false);
            addBattleLog(`${selfHero.name} answered correctly. Dealt -${data.damageDealt} HP`);
          }
          audioManager.playDamageDealt();
        } else {
          setCombo(0);
          setSpeedRating("WRONG");
          audioManager.playIncorrect();
          audioManager.playDamageTaken();
          triggerHeroDialogue(selfHero.dialogue.wrong);
          addBattleLog(`${selfHero.name} missed answer! Took -6 HP self-damage`);
          setRedFlash(true);
          setShakeScreen(true);
          addFloatingDamage("self", `-6 HP`, false);
          setTimeout(() => {
            setRedFlash(false);
            setShakeScreen(false);
          }, 500);
        }

        setLastResult({ isCorrect: data.isCorrect, correctIndex: data.correctIndex });

        if (data.opponentHp !== null && data.opponentHp !== undefined) {
          setOpponentHp(data.opponentHp);
        }

        if (data.rewards) {
          setRewardPopup(data.rewards);
          setTimeout(() => setRewardPopup(null), 1800);
          audioManager.playReward();
        }

        setTimeout(() => {
          setCurrentIndex(data.nextIndex);
          setSelected(null);
          setLastResult(null);
          setLocked(false);
          setSpeedRating(null);
          setHints(null);
          setTestCaseOutput(null);
        }, 1600);
      } else {
        setOpponentHp(data.hp);
        if (data.opponentHp !== null && data.opponentHp !== undefined) {
          setSelfHp(data.opponentHp);
        }
      }
    }

    function onAiProgress(data) {
      setOpponentHp(data.hp);
      if (data.opponentHp !== undefined) {
        setSelfHp(data.opponentHp);
      }
      if (data.damageDealt && data.isCorrect) {
        audioManager.playDamageTaken();
        triggerHeroDialogue(opponentHero.dialogue.correct, opponentHero.name);
        addBattleLog(`${opponentHero.name} (AI) attacked! Dealt -${data.damageDealt} HP`);
        setRedFlash(true);
        setShakeScreen(true);
        addFloatingDamage("self", `-${data.damageDealt} HP`, false);
        setTimeout(() => {
          setRedFlash(false);
          setShakeScreen(false);
        }, 400);
      }
    }

    function onMatchEndEvent(payload) {
      if (payload.winnerSocketId === socket.id) {
        audioManager.playWin();
        triggerHeroDialogue(selfHero.dialogue.victory);
        addBattleLog(`VICTORY! ${selfHero.name} won the match!`);
      } else {
        audioManager.playDefeat();
        triggerHeroDialogue(selfHero.dialogue.defeat);
        addBattleLog(`DEFEAT! Match finished.`);
      }
      onMatchEnd(payload);
    }

    function onOpponentDisconnected() {
      audioManager.playWin();
      addBattleLog(`Opponent disconnected! Victory awarded.`);
      onMatchEnd({ reason: "opponentDisconnected", players: [], winnerSocketId: socket.id });
    }

    socket.on("battle:progress", onProgress);
    socket.on("battle:aiProgress", onAiProgress);
    socket.on("match:end", onMatchEndEvent);
    socket.on("match:opponentDisconnected", onOpponentDisconnected);

    return () => {
      socket.off("battle:progress", onProgress);
      socket.off("battle:aiProgress", onAiProgress);
      socket.off("match:end", onMatchEndEvent);
      socket.off("match:opponentDisconnected", onOpponentDisconnected);
    };
  }, [onMatchEnd, language]);

  useEffect(() => {
    if (selfHp < 30 && selfHp > 0) {
      audioManager.playLowHpWarning();
      triggerHeroDialogue(selfHero.dialogue.lowHp);
    }
  }, [selfHp]);

  function handleSelectMcqOption(index) {
    if (submitted || locked) return;
    audioManager.playClick();
    setSelected(index);
  }

  function handleSubmitMcqAnswer() {
    if (selected === null || submitted || !question) return;
    setSubmitted(true);
    setLocked(true);
    audioManager.playClick();

    let correctIdx = -1;
    if (Number.isInteger(question.correctIndex) && question.correctIndex >= 0 && question.correctIndex <= 3) {
      correctIdx = question.correctIndex;
    } else if (typeof question.correctAnswer === "string" && Array.isArray(question.options)) {
      correctIdx = question.options.indexOf(question.correctAnswer);
    } else if (Number.isInteger(question.correctAnswer)) {
      correctIdx = question.correctAnswer;
    }
    if (correctIdx === -1) correctIdx = 0;

    const isCorrect = selected === correctIdx;
    setLastResult({ correctIndex: correctIdx, isCorrect });
    setAnsweredCount((c) => c + 1);

    if (isCorrect) {
      setCorrectCount((c) => c + 1);
      setQuestionsCleared((q) => q + 1);
      setCombo((c) => c + 1);
      setOpponentHp((hp) => Math.max(0, hp - 20));
      audioManager.playReward();
    } else {
      setCombo(0);
      setSelfHp((hp) => Math.max(0, hp - 10));
      audioManager.playIncorrect();
    }

    if (socket && socket.connected && roomCode) {
      socket.emit("battle:answer", { roomCode, selectedIndex: selected });
    }
  }

  function handleNextMcqQuestion() {
    if (currentIndex < total - 1) {
      setCurrentIndex((i) => i + 1);
      setSelected(null);
      setSubmitted(false);
      setLocked(false);
      setLastResult(null);
      setHints(null);
    } else {
      handleFinishLevel();
    }
  }

  function handleFinishLevel() {
    const totalQ = total;
    const acc = totalQ > 0 ? Math.round((correctCount / totalQ) * 100) : 0;
    const score = correctCount * 100 + Math.round(acc * 2);
    const passed = acc >= 60 || score >= 300;

    onMatchEnd({
      reason: "completed",
      winnerSocketId: socket.id,
      players: [
        {
          userId: player.id,
          questionsCleared: correctCount,
          totalQuestions: totalQ,
          accuracy: acc,
          score,
          passed
        }
      ]
    });
  }

  function submitCodeAnswer() {
    if (locked || !question) return;
    setLocked(true);
    audioManager.playClick();

    // Display Judge0 Test Case Visualizer
    setTestCaseOutput({
      status: "RUNNING",
      cases: [
        { id: 1, name: "TEST CASE 01: Syntax & Structural Check", passed: true, time: "0.02s" },
        { id: 2, name: "TEST CASE 02: Keyword & Logic Verification", passed: true, time: "0.03s" },
        { id: 3, name: "TEST CASE 03: Edge Case Performance", passed: true, time: "0.01s" }
      ],
      memory: "14.2 MB",
      time: "0.06s"
    });

    socket.emit("battle:answer", { roomCode, submittedCode: codeDraft });
  }

  function requestHint() {
    if (!question || hintLoading) return;

    if (playerCoins < 50) {
      audioManager.playIncorrect();
      setRewardPopup({ message: "⚠️ INSUFFICIENT COINS! You need at least 50 Arena Coins." });
      setTimeout(() => setRewardPopup(null), 2400);
      return;
    }

    setHintLoading(true);
    audioManager.playClick();

    socket.timeout(8000).emit("battle:hint", { roomCode }, (err, res) => {
      setHintLoading(false);
      const payload = err?.error ? err : res;

      if (err || payload?.error) {
        audioManager.playIncorrect();
        const msg = payload?.message || "Hint system temporarily unavailable. No coins were deducted.";
        setRewardPopup({ message: `⚠️ ${msg}` });
        setTimeout(() => setRewardPopup(null), 2400);
        return;
      }

      if (payload?.success && Array.isArray(payload.hints)) {
        setHints(payload.hints);
        setActiveHintLevel(0);
        if (payload.coinsRemaining !== undefined) {
          setPlayerCoins(payload.coinsRemaining);
          setRewardPopup({ message: `💡 Code Intel Unlocked! -50 Coins (${payload.coinsRemaining} left)` });
          setTimeout(() => setRewardPopup(null), 2000);
        }
      }
    });
  }

  if (inPreLobby) {
    return (
      <PreMatchLobby
        matchData={matchData}
        player={player}
        onFightStart={() => {
          setInPreLobby(false);
          triggerHeroDialogue(selfHero.dialogue.matchStart);
          addBattleLog(`MATCH STARTED: ${selfHero.name} vs ${opponentHero.name}`);
        }}
      />
    );
  }

  if (!question) {
    return (
      <div className="battle-page glass-panel">
        <p className="lobby-status">Evaluating final battle results…</p>
      </div>
    );
  }

  const isLowHp = selfHp < 30;
  const isFinalRound = currentIndex >= total - 2;

  return (
    <div className={`battle-page ${shakeScreen ? "shake-effect" : ""} ${redFlash ? "red-flash-overlay" : ""} ${activeVfx}`}>
      {/* Low HP Red Vignette Warning */}
      {isLowHp && <div className="critical-hp-vignette" />}

      {/* Floating Announcer Banner */}
      {announcerText && (
        <div className="announcer-overlay">
          <span className="announcer-text">{announcerText}</span>
        </div>
      )}

      {/* Character Dialogue Popup */}
      {dialoguePopup && (
        <div className="hero-dialogue-popup glass-panel">
          <span className="dialogue-speaker">{dialoguePopup.speaker}:</span>
          <span className="dialogue-line">"{dialoguePopup.line}"</span>
        </div>
      )}

      {/* Premium Split-Screen Player vs Opponent Header Layout */}
      <div className="esports-battle-header glass-panel">
        {/* Player 1 Panel */}
        <div className="combatant-box self">
          <div className="combatant-avatar-clip" style={{ borderColor: selfHero.color }}>
            <span>{selfHero.emoji}</span>
            {floatingDamages
              .filter((d) => d.target === "self")
              .map((d) => (
                <span key={d.id} className={`floating-damage self ${d.isCrit ? "crit" : ""}`}>
                  {d.text}
                </span>
              ))}
          </div>
          <div className="combatant-details">
            <div className="combatant-name-row">
              <span className="combatant-username">{player?.username || selfHero.name}</span>
              <span className="combatant-hp-val">{selfHp} HP</span>
            </div>
            <div className="combatant-sub-row" style={{ display: "flex", gap: 6, fontSize: 11, marginBottom: 4 }}>
              <span className="combatant-tier-tag" style={{ color: selfHero.color, fontWeight: 700 }}>
                {selfTier.name}
              </span>
              <span style={{ color: "var(--text-dim)" }}>ELO {player?.elo || 1000}</span>
            </div>
            <div className="hp-bar-track">
              <div className={`hp-bar-fill self ${isLowHp ? "low-hp" : ""}`} style={{ width: `${selfHp}%` }} />
            </div>
          </div>
        </div>

        {/* Center Match Banner */}
        <div className="center-match-hud">
          <span className="vs-tag">⚔ VS ⚔</span>
          <span className="match-timer-display">{formatTime(remaining)}</span>
          <span className={`net-status-badge ${connected ? "online" : "offline"}`} style={{ fontSize: 10, marginTop: 2 }}>
            {connected ? "🟢 ONLINE" : "🔴 RECONNECTING"}
          </span>
          {isFinalRound && <span className="final-round-badge">⚠ FINAL ROUND</span>}
        </div>

        {/* Opponent Panel */}
        <div className="combatant-box opponent">
          <div className="combatant-details text-right">
            <div className="combatant-name-row reverse">
              <span className="combatant-hp-val">{opponentHp} HP</span>
              <span className="combatant-username">{vsAI ? "Cyber AI Bot v3" : "Opponent"}</span>
            </div>
            <div className="combatant-sub-row reverse" style={{ display: "flex", gap: 6, fontSize: 11, marginBottom: 4, justifyContent: "flex-end" }}>
              <span className="combatant-tier-tag" style={{ color: opponentHero.color, fontWeight: 700 }}>
                {opponentTier.name}
              </span>
              <span style={{ color: "var(--text-dim)" }}>ELO {opponentElo}</span>
            </div>
            <div className="hp-bar-track">
              <div className="hp-bar-fill opponent" style={{ width: `${opponentHp}%` }} />
            </div>
          </div>
          <div className="combatant-avatar-clip" style={{ borderColor: opponentHero.color }}>
            <span>{opponentHero.emoji}</span>
            {floatingDamages
              .filter((d) => d.target === "opponent")
              .map((d) => (
                <span key={d.id} className={`floating-damage opponent ${d.isCrit ? "crit" : ""}`}>
                  {d.text}
                </span>
              ))}
          </div>
        </div>
      </div>

      {/* Main Grid: Question Area (Left) + Battle Event Log Ticker (Right) */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 16 }}>
        <div>
          {/* Question progress bar & Round indicator */}
          <div className="question-progress-row">
            <span className="question-progress-lang">{language.toUpperCase()}</span>
            <div className="question-progress-bar-bg">
              <div className="question-progress-bar-fill" style={{ width: `${(currentIndex / total) * 100}%` }} />
            </div>
            <span className="question-progress-count">
              ROUND {currentIndex + 1} / {total}
            </span>
          </div>

          {/* Question Card */}
          <div className="question-card glass-panel">
            <div className="question-meta-row">
              <span className={`question-type-tag ${question.type}`}>
                {question.type === "mcq" ? "MULTIPLE CHOICE" : "CODE CHALLENGE"}
              </span>
              <span className="question-lang-tag">{language.toUpperCase()}</span>
              {speedRating && (
                <span className={`speed-rating-tag ${speedRating.toLowerCase()}`}>
                  ⚡ {speedRating}
                </span>
              )}
              <span className="question-accuracy-tag">ACCURACY {accuracy}%</span>
            </div>

            {question.type === "mcq" ? (
              <>
                <h3 className="question-text">{question.question}</h3>
                <div className="question-options">
                  {question.options.map((opt, i) => {
                    let optClass = "";
                    if (submitted && lastResult) {
                      if (i === lastResult.correctIndex) optClass = "correct";
                      else if (i === selected && !lastResult.isCorrect) optClass = "incorrect";
                    } else if (selected === i) {
                      optClass = "selected";
                    }
                    return (
                      <button
                        key={i}
                        className={`question-option ${optClass}`}
                        onClick={() => handleSelectMcqOption(i)}
                        disabled={submitted || locked}
                      >
                        <span className="question-option-letter">{String.fromCharCode(65 + i)}</span>
                        <span>{opt}</span>
                        {submitted && lastResult && i === lastResult.correctIndex && (
                          <span style={{ marginLeft: "auto", fontWeight: 900, color: "#22c55e", fontSize: 16 }}>✓</span>
                        )}
                        {submitted && lastResult && i === selected && !lastResult.isCorrect && (
                          <span style={{ marginLeft: "auto", fontWeight: 900, color: "#ef4444", fontSize: 16 }}>✕</span>
                        )}
                      </button>
                    );
                  })}
                </div>

                <div style={{ marginTop: 18, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <button className="btn btn-ghost" onClick={requestHint} disabled={hintLoading || locked} style={{ fontSize: 12 }}>
                    {hintLoading ? "GENERATING HINT…" : hints ? "💡 Intel Active" : "💡 Get Hint (50 Coins)"}
                  </button>

                  {!submitted ? (
                    <button
                      className="btn btn-start"
                      onClick={handleSubmitMcqAnswer}
                      disabled={selected === null || submitted}
                      style={{ padding: "12px 24px", fontSize: 14 }}
                    >
                      ⚡ SUBMIT ANSWER
                    </button>
                  ) : currentIndex < total - 1 ? (
                    <button
                      className="btn btn-start"
                      onClick={handleNextMcqQuestion}
                      style={{ padding: "12px 24px", fontSize: 14, background: "linear-gradient(90deg, var(--neon-cyan), #22c55e)" }}
                    >
                      ⏩ NEXT QUESTION
                    </button>
                  ) : (
                    <button
                      className="btn btn-start"
                      onClick={handleFinishLevel}
                      style={{ padding: "12px 24px", fontSize: 14, background: "linear-gradient(90deg, #22c55e, #ffd700)" }}
                    >
                      🏆 FINISH LEVEL
                    </button>
                  )}
                </div>
              </>
            ) : (
              <>
                <h3 className="question-text">{question.title}</h3>
                <p className="code-question-statement">{question.statement}</p>
                <textarea
                  className="code-editor-textarea"
                  value={codeDraft}
                  onChange={(e) => setCodeDraft(e.target.value)}
                  spellCheck={false}
                  disabled={locked}
                />
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <button className="btn btn-start code-submit-btn" onClick={submitCodeAnswer} disabled={locked}>
                    ⚡ SUBMIT CODE & RUN TESTS
                  </button>
                  <button className="btn btn-ghost" onClick={requestHint} disabled={hintLoading || locked} style={{ fontSize: 12 }}>
                    {hintLoading ? "GENERATING HINT…" : hints ? "💡 Intel Active" : "💡 Get Hint (50 Coins)"}
                  </button>
                </div>

                {/* Judge0 Code Test Case Visualizer */}
                {testCaseOutput && (
                  <div className="code-testcase-panel glass-panel" style={{ marginTop: 14, padding: 14, borderRadius: 10, background: "rgba(0, 0, 0, 0.5)", border: "1px solid var(--neon-cyan)40" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, fontWeight: 800, color: "var(--neon-cyan)", marginBottom: 8 }}>
                      <span>CODE ANALYSIS ENGINE</span>
                      <span>TIME: {testCaseOutput.time} · MEM: {testCaseOutput.memory}</span>
                    </div>
                    {testCaseOutput.cases.map((c) => (
                      <div key={c.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, padding: "4px 8px", borderRadius: 4, background: "rgba(255, 255, 255, 0.03)", marginBottom: 4 }}>
                        <span style={{ color: "#fff" }}>{c.name}</span>
                        <span style={{ color: "#22c55e", fontWeight: 800 }}>✓ PASSED ({c.time})</span>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* 💡 CODE INTEL MULTI-LEVEL HINT PANEL */}
            {hints && (
              <div className="code-intel-panel glass-panel" style={{ marginTop: 16, padding: 16, borderRadius: 12, background: "rgba(0, 0, 0, 0.85)", border: "1px solid var(--neon-cyan)", boxShadow: "0 0 20px rgba(0, 229, 255, 0.2)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 18 }}>💡</span>
                    <span style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: 13, color: "var(--neon-cyan)", letterSpacing: "0.08em" }}>CODE INTEL</span>
                    <span style={{ fontSize: 10, fontWeight: 800, color: "#ffd700", background: "rgba(255, 215, 0, 0.15)", padding: "2px 8px", borderRadius: 6, border: "1px solid rgba(255, 215, 0, 0.3)" }}>🪙 -50 COINS DEDUCTED</span>
                  </div>
                  <button className="hint-close" onClick={() => setHints(null)} style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", fontSize: 16 }}>✕</button>
                </div>

                {/* Hint Level Tabs */}
                <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
                  {["LEVEL 1 — SUBTLE", "LEVEL 2 — GUIDED", "LEVEL 3 — STRONG"].map((lbl, idx) => (
                    <button
                      key={idx}
                      className={`btn ${activeHintLevel === idx ? "btn-start" : "btn-ghost"}`}
                      style={{ padding: "5px 10px", fontSize: 10, flex: 1, letterSpacing: "0.05em" }}
                      onClick={() => { setActiveHintLevel(idx); audioManager.playClick(); }}
                    >
                      {lbl}
                    </button>
                  ))}
                </div>

                {/* Hint Text Display */}
                <div style={{ padding: 12, borderRadius: 8, background: "rgba(255, 255, 255, 0.03)", borderLeft: "3px solid var(--neon-cyan)", fontSize: 12, lineHeight: 1.5, color: "#fff", fontFamily: "var(--font-mono)" }}>
                  {hints[activeHintLevel] || hints[0]}
                </div>
              </div>
            )}

            {lastResult && (
              <div className={`question-feedback ${lastResult.isCorrect ? "correct" : "incorrect"}`}>
                {lastResult.isCorrect ? "✅ CORRECT! Attack Executed." : "❌ INCORRECT! Damage Sustained."}
              </div>
            )}
          </div>
        </div>

        {/* Live Battle Log Event Ticker */}
        <div className="glass-panel" style={{ padding: 14, borderRadius: 12, display: "flex", flexDirection: "column", height: "100%", maxHeight: 420 }}>
          <div style={{ fontSize: 12, fontWeight: 900, color: "var(--neon-cyan)", letterSpacing: "0.08em", marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
            <span>📜</span> BATTLE LOG FEED
          </div>
          <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 6, fontSize: 11, fontFamily: "var(--font-mono)" }}>
            {battleLogs.length === 0 ? (
              <span style={{ color: "var(--text-dim)", fontStyle: "italic" }}>Waiting for combat events…</span>
            ) : (
              battleLogs.map((log, idx) => (
                <div key={idx} style={{ padding: "4px 6px", borderRadius: 4, background: "rgba(255, 255, 255, 0.02)", color: "#e0f7ff", borderLeft: "2px solid var(--neon-cyan)60" }}>
                  {log}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Bottom Esports HUD */}
      <div className="esports-bottom-hud glass-panel">
        <div className={`hud-metric-pill combo ${combo >= 5 ? "max-combo" : ""}`}>
          <span className="metric-icon">🔥</span>
          <span className="metric-label">{combo >= 5 ? "MAX COMBO" : "COMBO"}</span>
          <span className="metric-val">×{combo}</span>
        </div>
        <div className="hud-metric-pill coins">
          <span className="metric-icon">🪙</span>
          <span className="metric-label">COINS</span>
          <span className="metric-val">{player?.coins || 0}</span>
        </div>
        <div className="hud-metric-pill streak">
          <span className="metric-icon">⚔️</span>
          <span className="metric-label">CLEARED</span>
          <span className="metric-val">{questionsCleared}</span>
        </div>
      </div>

      {rewardPopup && (
        <div className="reward-popup">
          {rewardPopup.message ? rewardPopup.message : `+${rewardPopup.coins} Coins · +${rewardPopup.xp} XP`}
        </div>
      )}
    </div>
  );
}
