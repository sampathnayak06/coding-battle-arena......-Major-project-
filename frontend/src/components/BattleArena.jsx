import { useEffect, useState, useRef } from "react";
import { socket } from "../socket.js";
import { animeHeroes, getTierForElo, getHeroById } from "../data/animeData.js";
import audioManager from "../services/audioManager.js";
import PreMatchLobby from "./PreMatchLobby.jsx";
import { evaluateCodeSubmission } from "../services/codeEvaluator.js";

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

export default function BattleArena({ matchData, player, onMatchEnd, onBack }) {
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
  const [hintToast, setHintToast] = useState(null); // { text, timeRemaining }
  const hintTimerRef = useRef(null);
  const matchEndedRef = useRef(false);
  const [playerCoins, setPlayerCoins] = useState(player?.coins || 0);
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
    if (hintTimerRef.current) {
      clearInterval(hintTimerRef.current);
      hintTimerRef.current = null;
    }
    setHintToast(null);
  }, [currentIndex]);

  useEffect(() => {
    return () => {
      if (hintTimerRef.current) {
        clearInterval(hintTimerRef.current);
        hintTimerRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const tick = setInterval(() => {
      const msLeft = endsAt - Date.now();
      setRemaining(msLeft);
      if (msLeft <= 0 && !matchEndedRef.current) {
        matchEndedRef.current = true;
        clearInterval(tick);
        audioManager.playDefeat();
        triggerHeroDialogue(selfHero.dialogue.defeat);
        addBattleLog("DEFEAT! Match time expired.");

        const totalQ = total;
        const acc = totalQ > 0 ? Math.round((correctCount / totalQ) * 100) : 0;
        const score = Math.max(0, correctCount * 100);

        onMatchEnd({
          reason: "defeat",
          defeatReason: "time_expired",
          winnerSocketId: "opponent",
          bossDefeated: false,
          passed: false,
          players: [
            {
              userId: player.id,
              questionsCleared: correctCount,
              totalQuestions: totalQ,
              accuracy: acc,
              score,
              passed: false,
              bossDefeated: false,
              hp: selfHp
            }
          ]
        });
      }
    }, 1000);
    return () => clearInterval(tick);
  }, [endsAt, correctCount, total, selfHp, onMatchEnd, player?.id]);

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

        setLastResult({
          isCorrect: data.isCorrect,
          correctIndex: data.correctIndex,
          correctAnswer: data.correctAnswer || (question?.options ? question.options[data.correctIndex] : ""),
          explanation: data.explanation || question?.explanation || ""
        });

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
          setSubmitted(false);
          setLastResult(null);
          setLocked(false);
          setSpeedRating(null);
          setTestCaseOutput(null);
        }, 550);
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
    if (selfHp <= 0 && !matchEndedRef.current) {
      matchEndedRef.current = true;
      audioManager.playDefeat();
      triggerHeroDialogue(selfHero.dialogue.defeat);
      addBattleLog(`DEFEAT! ${selfHero.name} was knocked out!`);

      const totalQ = total;
      const acc = totalQ > 0 ? Math.round((correctCount / totalQ) * 100) : 0;
      const score = Math.max(0, correctCount * 100);

      onMatchEnd({
        reason: "defeat",
        defeatReason: "hp_depleted",
        winnerSocketId: "opponent",
        bossDefeated: false,
        passed: false,
        players: [
          {
            userId: player.id,
            questionsCleared: correctCount,
            totalQuestions: totalQ,
            accuracy: acc,
            score,
            passed: false,
            bossDefeated: false,
            hp: 0
          }
        ]
      });
    } else if (selfHp < 30 && selfHp > 0) {
      audioManager.playLowHpWarning();
      triggerHeroDialogue(selfHero.dialogue.lowHp);
    }
  }, [selfHp, correctCount, total, onMatchEnd, player?.id]);

  function handleSelectMcqOption(index) {
    if (submitted || locked) return;
    audioManager.playClick();
    setSelected(index);
  }

  function handleSubmitMcqAnswer() {
    if (selected === null || submitted || !question) return;
    setSubmitted(true);
    audioManager.playClick();

    const isSocketMatch = Boolean(socket && socket.connected && roomCode && matchData?.mode !== "campaign");

    if (isSocketMatch) {
      setLocked(true);
      socket.emit("battle:answer", { roomCode, selectedIndex: selected }, (err, data) => {
        if (err || data?.error) {
          setLocked(false);
          setSubmitted(false);
        }
      });
      return;
    }

    // Single Player / Campaign / Solo Mode Local Grading
    let correctIdx = -1;
    if (Number.isInteger(question.correctIndex) && question.correctIndex >= 0 && question.correctIndex <= 3) {
      correctIdx = question.correctIndex;
    } else if (typeof question.correctAnswer === "string" && Array.isArray(question.options)) {
      correctIdx = question.options.findIndex((opt) => String(opt).trim() === String(question.correctAnswer).trim());
    }
    if (correctIdx === -1) correctIdx = 0;

    const isCorrect = selected === correctIdx;
    const correctAnswerText = question.options ? question.options[correctIdx] : question.correctAnswer;
    const explanation = question.explanation || "";

    setLastResult({
      isCorrect,
      correctIndex: correctIdx,
      correctAnswer: correctAnswerText,
      explanation
    });
    setAnsweredCount((c) => c + 1);

    if (isCorrect) {
      setCorrectCount((c) => c + 1);
      setQuestionsCleared((q) => q + 1);
      setCombo((c) => c + 1);
      setOpponentHp((hp) => Math.max(0, hp - 20));
      audioManager.playCorrect();
      audioManager.playReward();
      triggerLanguageVfx(language);
    } else {
      setCombo(0);
      setSelfHp((hp) => Math.max(0, hp - 10));
      audioManager.playIncorrect();
    }
  }

  function handleNextMcqQuestion() {
    if (hintTimerRef.current) {
      clearInterval(hintTimerRef.current);
      hintTimerRef.current = null;
    }
    setHintToast(null);

    if (currentIndex < total - 1) {
      setCurrentIndex((i) => i + 1);
      setSelected(null);
      setSubmitted(false);
      setLocked(false);
      setLastResult(null);
      setTestCaseOutput(null);
    } else {
      handleFinishLevel();
    }
  }

  function handleFinishLevel() {
    if (matchEndedRef.current) return;
    matchEndedRef.current = true;
    const totalQ = total;
    const acc = totalQ > 0 ? Math.round((correctCount / totalQ) * 100) : 0;
    const bossDefeated = opponentHp <= 0;

    // Scoring system:
    // Base 100 pts per correct answer
    // Accuracy bonus: up to 200 pts
    // Health survival bonus: remaining HP * 2 (up to 200 pts)
    // Boss defeat bonus: 300 pts
    let score = correctCount * 100 + Math.round(acc * 2) + Math.round(selfHp * 2);
    if (bossDefeated) {
      score += 300;
    }

    const targetPassingScore = matchData?.levelConfig?.passingScore || 400;
    let passed = false;
    // Pass if boss is defeated, or accuracy is at least 50%, or answered at least half the questions
    if (bossDefeated || acc >= 50 || correctCount >= Math.ceil(totalQ / 2)) {
      passed = true;
      if (score < targetPassingScore) {
        score = targetPassingScore + Math.max(50, Math.round(selfHp * 1.5));
      }
    } else {
      passed = score >= targetPassingScore;
    }

    if (passed) {
      audioManager.playWin();
      triggerHeroDialogue(selfHero.dialogue.victory);
      addBattleLog(`VICTORY! ${selfHero.name} cleared the mission.`);
    } else {
      audioManager.playDefeat();
      triggerHeroDialogue(selfHero.dialogue.defeat);
      addBattleLog("DEFEAT! Minimum passing score not reached.");
    }

    onMatchEnd({
      reason: "completed",
      winnerSocketId: passed ? socket.id : "opponent",
      bossDefeated,
      passed,
      players: [
        {
          userId: player.id,
          questionsCleared: correctCount,
          totalQuestions: totalQ,
          accuracy: acc,
          score,
          passed,
          bossDefeated,
          hp: selfHp
        }
      ]
    });
  }

  function submitCodeAnswer() {
    if (locked || !question) return;
    setLocked(true);
    audioManager.playClick();

    const isSocketMatch = Boolean(socket && socket.connected && roomCode && matchData?.mode !== "campaign");

    if (isSocketMatch) {
      setTestCaseOutput({
        status: "RUNNING",
        passed: false,
        cases: [
          { id: 1, name: "TEST CASE 01: Syntax & Structural Check", passed: false, time: "0.02s" },
          { id: 2, name: "TEST CASE 02: Keyword & Logic Verification", passed: false, time: "0.03s" },
          { id: 3, name: "TEST CASE 03: Edge Case Performance", passed: false, time: "0.01s" }
        ],
        memory: "14.2 MB",
        time: "0.06s"
      });
      socket.emit("battle:answer", { roomCode, submittedCode: codeDraft });
      return;
    }

    // Campaign / Solo / AI mode local grading with REAL evaluation
    setTestCaseOutput({
      status: "RUNNING",
      passed: false,
      cases: [
        { id: 1, name: "TEST CASE 01: Compilation & Structural Analysis", passed: false, time: "..." },
        { id: 2, name: "TEST CASE 02: Algorithmic Logic & Assertions", passed: false, time: "..." },
        { id: 3, name: "TEST CASE 03: Edge Cases & Boundary Performance", passed: false, time: "..." }
      ],
      memory: "14.2 MB",
      time: "0.06s"
    });

    setTimeout(() => {
      setLocked(false);
      setAnsweredCount((c) => c + 1);

      // Evaluate the code using the universal validation engine
      const evalResult = evaluateCodeSubmission(codeDraft, question, language);
      setTestCaseOutput(evalResult);

      if (evalResult.passed) {
        // ONLY GIVE POINTS IF CODE IS GENUINELY CORRECT
        setSubmitted(true);
        setCorrectCount((c) => c + 1);
        setQuestionsCleared((q) => q + 1);
        setCombo((c) => c + 1);
        setOpponentHp(0); // Boss defeated on genuine successful code challenge!
        audioManager.playCorrect();
        audioManager.playReward();
        triggerLanguageVfx(language);

        setLastResult({
          isCorrect: true,
          explanation: question.explanation || "All automated test cases passed successfully! Boss defeated and code challenge cleared."
        });

        setBattleLogs((prev) => [
          `[${new Date().toLocaleTimeString()}] Critical Hit! Boss defeated with 100% test accuracy.`,
          ...prev
        ]);
      } else {
        // WRONG CODE: DO NOT GIVE POINTS, DO NOT ADVANCE!
        setSubmitted(false); // keep editor unlocked so player can edit and fix their code
        setCombo(0);
        // Boss counter-attacks for 15 damage
        setSelfHp((hp) => Math.max(0, hp - 15));
        audioManager.playIncorrect();

        setLastResult({
          isCorrect: false,
          explanation: `Test cases failed! ${evalResult.message} Boss counter-attacked for 15 damage! Fix your code and click Submit Code again.`
        });

        setBattleLogs((prev) => [
          `[${new Date().toLocaleTimeString()}] FAILED! Tests failed: ${evalResult.message}`,
          ...prev
        ]);
      }
    }, 600);
  }

  function requestHint() {
    if (!question) return;
    audioManager.playClick();

    // Determine relevant hint text for the current question
    let hintText = "";
    if (typeof question.hint === "string" && question.hint.trim().length > 0) {
      hintText = question.hint.trim();
    } else if (Array.isArray(question.hints) && question.hints.length > 0) {
      hintText = question.hints[0];
    } else {
      hintText = `Focus on the core definitions and syntax rules of ${language ? language.toUpperCase() : "this language"}. Eliminate invalid options.`;
    }

    if (hintTimerRef.current) {
      clearInterval(hintTimerRef.current);
      hintTimerRef.current = null;
    }

    // Display hint toast for EXACTLY 20 seconds
    setHintToast({ text: hintText, timeRemaining: 20 });

    const startTime = Date.now();
    const DURATION_MS = 20000;

    hintTimerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remainingSeconds = Math.max(0, Math.ceil((DURATION_MS - elapsed) / 1000));
      if (remainingSeconds <= 0) {
        clearInterval(hintTimerRef.current);
        hintTimerRef.current = null;
        setHintToast(null);
      } else {
        setHintToast((prev) => (prev ? { ...prev, timeRemaining: remainingSeconds } : null));
      }
    }, 250);

    // If connected to multiplayer socket room, sync hint event in background
    if (socket && socket.connected && roomCode && matchData?.mode !== "campaign") {
      socket.emit("battle:hint", { roomCode }, (err, res) => {
        if (res && res.coinsRemaining !== undefined) {
          setPlayerCoins(res.coinsRemaining);
        }
      });
    }
  }

  function closeHintToast() {
    if (hintTimerRef.current) {
      clearInterval(hintTimerRef.current);
      hintTimerRef.current = null;
    }
    setHintToast(null);
    audioManager.playClick();
  }

  if (inPreLobby) {
    return (
      <PreMatchLobby
        matchData={matchData}
        player={player}
        onBack={onBack}
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
      {/* 💡 FLOATING HINT TOAST NOTIFICATION (EXACTLY 20 SECONDS, NON-BLOCKING) */}
      {hintToast && (
        <div className="battle-hint-toast-banner" role="alert">
          <div className="battle-hint-toast-progress-bar">
            <div
              className="battle-hint-toast-progress-fill"
              style={{ width: `${(hintToast.timeRemaining / 20) * 100}%` }}
            />
          </div>
          <div className="battle-hint-toast-header">
            <div className="battle-hint-toast-title">
              <span className="battle-hint-toast-icon">💡</span>
              <span className="battle-hint-toast-label">TACTICAL HINT</span>
              <span className="battle-hint-toast-timer">⏱ {hintToast.timeRemaining}s</span>
            </div>
            <button
              className="battle-hint-toast-close"
              onClick={closeHintToast}
              aria-label="Close Hint"
              title="Close Hint"
            >
              ✕
            </button>
          </div>
          <div className="battle-hint-toast-body">
            {hintToast.text}
          </div>
        </div>
      )}

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

      {/* Top Navigation Row: Back / Leave Arena Button */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <button
          className="back-btn battle-back-btn"
          onClick={() => {
            if (window.confirm("Exit the battle and return? Your current match progress will be lost.")) {
              if (onBack) onBack();
              else if (onMatchEnd) onMatchEnd({ reason: "surrendered", winnerSocketId: "opponent", players: [] });
            }
          }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "8px 16px",
            fontSize: 13,
            fontWeight: 800,
            borderRadius: 8,
            border: "1px solid rgba(255, 255, 255, 0.2)",
            background: "rgba(255, 255, 255, 0.08)",
            color: "#e2e8f0",
            cursor: "pointer"
          }}
        >
          ← EXIT BATTLE
        </button>

        <div style={{ fontSize: 12, color: "var(--text-dim)", fontWeight: 700, letterSpacing: "0.08em" }}>
          MISSION: <strong style={{ color: "var(--neon-cyan)" }}>{matchData?.campaignLevelId ? `LEVEL ${matchData.campaignLevelId}` : "ARENA DUEL"}</strong> · {String(language || "JAVASCRIPT").toUpperCase()}
        </div>
      </div>

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
                  <button className="btn btn-ghost" onClick={requestHint} disabled={locked} style={{ fontSize: 12 }}>
                    💡 {hintToast ? `Hint Active (${hintToast.timeRemaining}s)` : "Get Hint"}
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
                  onKeyDown={(e) => {
                    if (e.key === "Tab") {
                      e.preventDefault();
                      const start = e.target.selectionStart;
                      const end = e.target.selectionEnd;
                      const val = e.target.value;
                      setCodeDraft(val.substring(0, start) + "  " + val.substring(end));
                      setTimeout(() => {
                        e.target.selectionStart = e.target.selectionEnd = start + 2;
                      }, 0);
                    }
                  }}
                  spellCheck={false}
                  placeholder="// Type your code solution here..."
                />
                <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 14 }}>
                  {!submitted ? (
                    <>
                      <button className="btn btn-start code-submit-btn" onClick={submitCodeAnswer} disabled={locked} style={{ padding: "12px 24px", fontSize: 14 }}>
                        {locked ? "⚙️ RUNNING TESTS…" : "⚡ SUBMIT CODE & RUN TESTS"}
                      </button>
                      <button className="btn btn-ghost" onClick={requestHint} style={{ fontSize: 12 }}>
                        💡 {hintToast ? `Hint Active (${hintToast.timeRemaining}s)` : "Get Hint"}
                      </button>
                    </>
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
                      🏆 FINISH LEVEL & CLAIM REWARDS
                    </button>
                  )}
                </div>

                {/* Universal Code Test Case Visualizer */}
                {testCaseOutput && (
                  <div
                    className="code-testcase-panel glass-panel"
                    style={{
                      marginTop: 14,
                      padding: 14,
                      borderRadius: 10,
                      background: "rgba(0, 0, 0, 0.6)",
                      border: testCaseOutput.passed
                        ? "1px solid rgba(34, 197, 94, 0.6)"
                        : "1px solid rgba(239, 68, 68, 0.6)"
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, fontWeight: 800, color: testCaseOutput.passed ? "#22c55e" : "#ef4444", marginBottom: 8 }}>
                      <span>CODE ANALYSIS ENGINE · {testCaseOutput.status}</span>
                      <span>TIME: {testCaseOutput.time} · MEM: {testCaseOutput.memory}</span>
                    </div>
                    {testCaseOutput.cases.map((c) => (
                      <div
                        key={c.id}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          fontSize: 12,
                          padding: "6px 10px",
                          borderRadius: 4,
                          background: c.passed ? "rgba(34, 197, 94, 0.08)" : "rgba(239, 68, 68, 0.08)",
                          marginBottom: 4,
                          borderLeft: `3px solid ${c.passed ? "#22c55e" : "#ef4444"}`
                        }}
                      >
                        <span style={{ color: "#fff", fontWeight: 600 }}>{c.name}</span>
                        {c.passed ? (
                          <span style={{ color: "#22c55e", fontWeight: 800 }}>✓ PASSED ({c.time})</span>
                        ) : (
                          <span style={{ color: "#ef4444", fontWeight: 800 }}>
                            ✗ FAILED {c.error ? `— ${c.error}` : ""}
                          </span>
                        )}
                      </div>
                    ))}
                    {!testCaseOutput.passed && testCaseOutput.status !== "RUNNING" && (
                      <div style={{ fontSize: 12, color: "#fca5a5", marginTop: 8, padding: "8px 10px", background: "rgba(239, 68, 68, 0.12)", borderRadius: 6, border: "1px solid rgba(239, 68, 68, 0.3)" }}>
                        ⚠️ <strong>Verification Failed:</strong> 0 points awarded. Boss counter-attacked! Correct the errors shown above in your code editor and click <em>⚡ SUBMIT CODE & RUN TESTS</em> again.
                      </div>
                    )}
                  </div>
                )}
              </>
            )}

            {lastResult && (
              <div className={`question-feedback ${lastResult.isCorrect ? "correct" : "incorrect"}`} style={{ marginTop: 16 }}>
                <div style={{ fontSize: 16, fontWeight: 900, marginBottom: 4 }}>
                  {lastResult.isCorrect
                    ? "✅ CORRECT! Attack Executed."
                    : `❌ INCORRECT! Correct Answer: ${lastResult.correctAnswer || (question.options ? question.options[lastResult.correctIndex] : "")}`}
                </div>
                {lastResult.explanation && (
                  <div style={{ fontSize: 13, color: "#cbd5e1", lineHeight: 1.5, fontFamily: "var(--font-mono)", maxWidth: 650, margin: "8px auto 0", background: "rgba(0, 0, 0, 0.4)", padding: "10px 14px", borderRadius: 8, borderLeft: `3px solid ${lastResult.isCorrect ? "var(--accent-green)" : "var(--accent-red)"}`, textAlign: "left" }}>
                    💡 <strong>Explanation:</strong> {lastResult.explanation}
                  </div>
                )}
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
