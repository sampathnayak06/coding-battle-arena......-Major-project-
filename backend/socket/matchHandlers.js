import { customAlphabet } from "nanoid";
import { buildLanguageSeries, parseLevel, stripAnswer, gradeCodeAnswer, LANGUAGES, getQuestionHints, validateHint } from "../data/quizData.js";
import { calculateEloDelta } from "../services/eloService.js";
import { recordMatchResult, findUserById } from "../data/authStore.js";
import { User } from "../models/User.js";


const nanoid = customAlphabet("ABCDEFGHJKLMNPQRSTUVWXYZ23456789", 6);

const MATCH_DURATION_MS = 15 * 60 * 1000; // 15 minutes for a 12-15 question set
const DEFAULT_MATCH_DURATION_MINUTES = 15;
const MIN_MATCH_DURATION_MINUTES = 5;
const MAX_MATCH_DURATION_MINUTES = 30;
const MCQ_DAMAGE = 12; // Base damage for MCQ
const CODE_DAMAGE = 24; // Base damage for code questions
const WRONG_SELF_DAMAGE = 6; // Damage taken for a wrong answer
const HINT_COST = 50; // Arena coins charged per hint

// In-memory room store: { code: Room }
const rooms = new Map();
// In-memory matchmaking queue: [ { socketId, user, language, difficulty, joinedAt } ]
const matchmakingQueue = [];

function freshPlayerState(user) {
  return {
    userId: user.id || null,
    username: user.username || "Guest",
    heroId: user.heroId || "naruto",
    isAI: !!user.isAI,
    hp: 100,
    questionsCleared: 0,
    correctCount: 0,
    answeredCount: 0,
    currentIndex: 0,
    combo: 0,
    maxCombo: 0,
    questionStartTime: Date.now(),
    finished: false,
    coins: typeof user.coins === "number" ? user.coins : 0
  };
}

function clampMinutes(value) {
  const minutes = Number(value);
  if (Number.isNaN(minutes)) return DEFAULT_MATCH_DURATION_MINUTES;
  return Math.min(MAX_MATCH_DURATION_MINUTES, Math.max(MIN_MATCH_DURATION_MINUTES, minutes));
}

function createRoom({ hostSocketId, hostUser, language, difficulty = 1, durationMinutes = DEFAULT_MATCH_DURATION_MINUTES, vsAI = false, platform = "desktop" }) {
  const code = nanoid();
  const levelConfig = parseLevel(difficulty);
  const isMobile = platform === "mobile";
  const series = buildLanguageSeries(language, levelConfig.level, 4, [], isMobile);
  const safeMinutes = clampMinutes(durationMinutes);
  const room = {
    code,
    vsAI,
    platform: isMobile ? "mobile" : "desktop",
    language,
    difficulty: levelConfig.level,
    level: levelConfig,
    series,
    durationMinutes: safeMinutes,
    durationMs: safeMinutes * 60 * 1000,
    players: { [hostSocketId]: freshPlayerState(hostUser) },
    startedAt: null,
    endsAt: null,
    status: "waiting" // waiting | active | finished
  };
  rooms.set(code, room);
  return room;
}

function startRoom(room) {
  room.status = "active";
  room.startedAt = Date.now();
  room.endsAt = room.startedAt + (room.durationMs ?? MATCH_DURATION_MS);
  for (const player of Object.values(room.players)) {
    player.questionStartTime = Date.now();
  }
}

function publicSeries(series) {
  return series.map(stripAnswer);
}

function ack(callback, payload) {
  if (typeof callback === "function") callback(null, payload);
}

function errorAck(callback, code, message) {
  if (typeof callback === "function") callback({ error: code, message });
}

function evaluateSpeedAndDamage({ elapsedMs, isCorrect, type, combo }) {
  if (!isCorrect) {
    return { isCorrect: false, speedRating: "WRONG", damageDealt: 0, isCritical: false, comboMultiplier: 1.0 };
  }
  let speedRating = "SLOW";
  let speedMult = 1.0;
  if (elapsedMs <= 3500) {
    speedRating = "PERFECT";
    speedMult = 1.25;
  } else if (elapsedMs <= 7000) {
    speedRating = "EXCELLENT";
    speedMult = 1.15;
  } else if (elapsedMs <= 11000) {
    speedRating = "GOOD";
    speedMult = 1.05;
  }

  let comboMult = 1.0;
  if (combo >= 5) comboMult = 1.25;
  else if (combo === 4) comboMult = 1.15;
  else if (combo === 3) comboMult = 1.10;
  else if (combo === 2) comboMult = 1.05;

  const isCritical = (speedRating === "PERFECT" || speedRating === "EXCELLENT") && Math.random() < 0.20;
  const critMult = isCritical ? 1.5 : 1.0;

  const baseDamage = type === "mcq" ? MCQ_DAMAGE : CODE_DAMAGE;
  const damageDealt = Math.round(baseDamage * speedMult * comboMult * critMult);

  return { isCorrect: true, speedRating, damageDealt, isCritical, comboMultiplier: comboMult };
}

export function registerMatchHandlers(io, socket) {
  const authedUser = socket.data.user;
  if (authedUser?.id) {
    socket.join(`user:${authedUser.id}`);
  }

  // --- Quick Match Matchmaking Queue ---
  socket.on("queue:join", ({ language, difficulty, platform = "desktop" } = {}, callback) => {
    try {
      const user = authedUser || { username: "Guest", elo: 1000 };
      const chosen = Array.isArray(LANGUAGES) && LANGUAGES.includes(language) ? language : "javascript";

      const existingIdx = matchmakingQueue.findIndex((q) => q.socketId === socket.id);
      if (existingIdx >= 0) matchmakingQueue.splice(existingIdx, 1);

      const matchIdx = matchmakingQueue.findIndex(
        (other) => other.socketId !== socket.id && Math.abs((other.user?.elo || 1000) - (user.elo || 1000)) <= 350
      );

      if (matchIdx >= 0) {
        const opponent = matchmakingQueue.splice(matchIdx, 1)[0];
        const matchPlatform = platform === "mobile" || opponent.platform === "mobile" ? "mobile" : "desktop";
        const room = createRoom({
          hostSocketId: opponent.socketId,
          hostUser: opponent.user,
          language: chosen,
          difficulty: difficulty || 1,
          vsAI: false,
          platform: matchPlatform
        });
        room.players[socket.id] = freshPlayerState(user);

        const hostSocket = io.sockets.sockets.get(opponent.socketId);
        if (hostSocket) hostSocket.join(room.code);
        socket.join(room.code);
        startRoom(room);

        const payload = { roomCode: room.code, language: room.language, platform: room.platform, series: publicSeries(room.series), endsAt: room.endsAt };
        io.to(room.code).emit("matchmaking:found", payload);
        io.to(room.code).emit("match:start", payload);
        return ack(callback, { status: "matched", ...payload });
      }

      matchmakingQueue.push({ socketId: socket.id, user, language: chosen, difficulty: difficulty || 1, platform, joinedAt: Date.now() });
      ack(callback, { status: "queued" });
    } catch (err) {
      errorAck(callback, "queue_error", err.message || "Failed to join queue");
    }
  });

  socket.on("queue:leave", (callback) => {
    const idx = matchmakingQueue.findIndex((q) => q.socketId === socket.id);
    if (idx >= 0) matchmakingQueue.splice(idx, 1);
    ack(callback, { status: "left" });
  });

  // --- Room creation (1v1 multiplayer) ---
  socket.on("room:create", ({ language, difficulty, durationMinutes, platform = "desktop" } = {}, callback) => {
    try {
      const chosen = Array.isArray(LANGUAGES) && LANGUAGES.includes(language) ? language : "javascript";
      const room = createRoom({
        hostSocketId: socket.id,
        hostUser: authedUser || { username: "Guest" },
        language: chosen,
        difficulty,
        durationMinutes,
        platform
      });
      socket.join(room.code);
      ack(callback, { roomCode: room.code, language: chosen, platform: room.platform, series: publicSeries(room.series) });
    } catch (error) {
      errorAck(callback, "server_error", error.message || "Unable to create room");
    }
  });

  // --- Room join ---
  socket.on("room:join", ({ roomCode }, callback) => {
    try {
      const room = rooms.get(roomCode);
      if (!room) return errorAck(callback, "room_not_found", "Room not found");
      if (Object.keys(room.players).length >= 2) return errorAck(callback, "room_full", "Room is full");

      room.players[socket.id] = freshPlayerState(authedUser || { username: "Guest" });
      socket.join(roomCode);
      startRoom(room);

      io.to(roomCode).emit("match:start", {
        roomCode,
        language: room.language,
        platform: room.platform,
        series: publicSeries(room.series),
        endsAt: room.endsAt
      });
      ack(callback, { roomCode, language: room.language, platform: room.platform, series: publicSeries(room.series), endsAt: room.endsAt });
    } catch (error) {
      errorAck(callback, "server_error", error.message || "Unable to join room");
    }
  });

  // --- AI Practice ---
  socket.on("ai:start", ({ language, difficulty, durationMinutes, platform = "desktop" } = {}, callback) => {
    try {
      const chosen = Array.isArray(LANGUAGES) && LANGUAGES.includes(language) ? language : "javascript";
      const room = createRoom({
        hostSocketId: socket.id,
        hostUser: authedUser || { username: "Guest" },
        language: chosen,
        difficulty,
        durationMinutes,
        vsAI: true,
        platform
      });
      room.players["AI_BOT"] = freshPlayerState({ username: `Cyber AI Bot (Lvl ${room.level.level})`, heroId: "gojo", isAI: true });
      socket.join(room.code);
      startRoom(room);

      ack(callback, { roomCode: room.code, language: chosen, platform: room.platform, level: room.level, series: publicSeries(room.series), endsAt: room.endsAt });
      runAiOpponent(io, room, socket.id);
    } catch (error) {
      errorAck(callback, "server_error", error.message || "Unable to start AI practice");
    }
  });

  // --- Rejoin match after socket reconnect ---
  socket.on("battle:rejoin", ({ roomCode }, callback) => {
    const room = rooms.get(roomCode);
    if (!room || room.status !== "active") return errorAck(callback, "room_not_found", "Active room not found");

    const player = authedUser ? Object.values(room.players).find((p) => p.userId === authedUser.id) : null;
    if (player) {
      socket.join(roomCode);
      ack(callback, {
        rejoined: true,
        roomCode: room.code,
        language: room.language,
        series: publicSeries(room.series),
        endsAt: room.endsAt,
        playerState: player
      });
    } else {
      errorAck(callback, "not_in_room", "Player not registered in this match");
    }
  });

  // --- Request Hint (Multi-level clues matching current question) ---
  socket.on("battle:hint", async ({ roomCode }, callback) => {
    try {
      const room = rooms.get(roomCode);
      if (!room || room.status !== "active") {
        return errorAck(callback, "MATCH_NOT_ACTIVE", "Active match room not found");
      }
      const player = room.players[socket.id];
      if (!player || player.finished) {
        return errorAck(callback, "NO_ACTIVE_PLAYER", "No active player state found");
      }

      const question = room.series[player.currentIndex];
      if (!question) {
        return errorAck(callback, "NO_QUESTION", "No current question available for hint");
      }

      // Check coin balance from MongoDB or player state
      if (player.userId) {
        const userDoc = await User.findOne({ id: player.userId }).lean();
        if (userDoc) player.coins = userDoc.coins;
      }

      const currentCoins = typeof player.coins === "number" ? player.coins : 0;
      if (currentCoins < HINT_COST) {
        return errorAck(callback, "INSUFFICIENT_COINS", `Insufficient arena coins. Required: ${HINT_COST} coins.`);
      }

      // Retrieve & validate multi-level hints for current question
      const rawHints = getQuestionHints(question, room.language);
      const validHints = rawHints.filter((h) => validateHint(h, question));
      const finalHints = validHints.length >= 3 ? validHints : rawHints;

      if (!finalHints || finalHints.length === 0) {
        return errorAck(callback, "HINT_UNAVAILABLE", "Hint engine temporarily unavailable. No coins were deducted.");
      }

      // DEDUCT COINS IN MONGODB ONLY AFTER SUCCESSFUL HINT GENERATION & VALIDATION
      if (player.userId) {
        const updated = await User.findOneAndUpdate(
          { id: player.userId, coins: { $gte: HINT_COST } },
          { $inc: { coins: -HINT_COST } },
          { new: true }
        );
        if (!updated) {
          return errorAck(callback, "INSUFFICIENT_COINS", `Insufficient arena coins. Required: ${HINT_COST} coins.`);
        }
        player.coins = updated.coins;
        // Broadcast real-time account data sync to other active devices of this user
        io.to(`user:${player.userId}`).emit("user:dataUpdated", { userId: player.userId });
      } else {
        player.coins = Math.max(0, player.coins - HINT_COST);
      }

      const responsePayload = {
        success: true,
        hints: finalHints,
        cost: HINT_COST,
        coinsRemaining: player.coins,
        questionIndex: player.currentIndex
      };

      // Return ONLY to requesting player (multiplayer isolation)
      ack(callback, responsePayload);
    } catch (error) {
      console.error("[matchHandlers] battle:hint error:", error);
      errorAck(callback, "SERVER_ERROR", "An unexpected error occurred while generating hint. No coins were deducted.");
    }
  });

  // --- Submit answer ---
  socket.on("battle:answer", ({ roomCode, selectedIndex, submittedCode }, callback) => {
    try {
      const room = rooms.get(roomCode);
      if (!room || room.status !== "active") return errorAck(callback, "match_not_active", "Match not active");
      const player = room.players[socket.id];
      if (!player || player.finished) return errorAck(callback, "no_player", "No active player state");

      const idx = player.currentIndex;
      const question = room.series[idx];
      if (!question) return errorAck(callback, "no_question", "No question available to answer");

      // Mobile Question Enforcement (Requirement 13 & 15): Mobile matches MUST ONLY support MCQ
      if (room.platform === "mobile" && question.type !== "mcq") {
        return errorAck(callback, "mobile_mcq_only", "Mobile matches only support MCQ questions.");
      }

      const elapsedMs = Date.now() - (player.questionStartTime || Date.now());
      player.questionStartTime = Date.now();

      let isCorrect = false;
      if (question.type === "mcq") {
        isCorrect = selectedIndex === question.correctIndex;
      } else {
        const grade = gradeCodeAnswer(question, submittedCode);
        isCorrect = grade.correct;
      }

      player.answeredCount += 1;
      if (isCorrect) {
        player.correctCount += 1;
        player.questionsCleared += 1;
        player.combo += 1;
        player.maxCombo = Math.max(player.maxCombo, player.combo);
      } else {
        player.combo = 0;
      }

      const evalResult = evaluateSpeedAndDamage({
        elapsedMs,
        isCorrect,
        type: question.type,
        combo: player.combo
      });

      const opponentSocketId = Object.keys(room.players).find((id) => id !== socket.id);
      const opponent = opponentSocketId ? room.players[opponentSocketId] : null;

      if (isCorrect) {
        if (opponent) {
          opponent.hp = Math.max(0, opponent.hp - evalResult.damageDealt);
        }
        player.hp = Math.min(100, player.hp + 4);
      } else {
        player.hp = Math.max(0, player.hp - WRONG_SELF_DAMAGE);
      }

      player.currentIndex += 1;
      if (player.currentIndex >= room.series.length || player.hp <= 0 || (opponent && opponent.hp <= 0)) {
        player.finished = true;
        if (opponent && opponent.hp <= 0) opponent.finished = true;
      }

      const accuracy = Math.round((player.correctCount / player.answeredCount) * 100);

      const progressPayload = {
        socketId: socket.id,
        isCorrect,
        correctIndex: question.type === "mcq" ? question.correctIndex : null,
        questionsCleared: player.questionsCleared,
        totalQuestions: room.series.length,
        accuracy,
        hp: player.hp,
        opponentHp: opponent?.hp ?? null,
        damageDealt: evalResult.damageDealt,
        speedRating: evalResult.speedRating,
        isCritical: evalResult.isCritical,
        combo: player.combo,
        maxCombo: player.maxCombo,
        nextIndex: player.currentIndex,
        finished: player.finished,
        rewards: isCorrect
          ? { coins: 25 + player.combo * 5, xp: 50 + player.combo * 10 }
          : { coins: 0, xp: 10 }
      };

      io.to(roomCode).emit("battle:progress", progressPayload);
      ack(callback, progressPayload);
      maybeFinishMatch(io, room);
    } catch (error) {
      console.error("[matchHandlers] battle:answer error:", error);
      errorAck(callback, "server_error", error.message || "An unexpected error occurred while submitting your answer.");
    }
  });

  socket.on("disconnect", () => {
    const qIdx = matchmakingQueue.findIndex((q) => q.socketId === socket.id);
    if (qIdx >= 0) matchmakingQueue.splice(qIdx, 1);

    for (const room of rooms.values()) {
      if (room.players[socket.id] && room.status === "active") {
        io.to(room.code).emit("match:opponentDisconnected", { socketId: socket.id });
        room.status = "finished";
      }
    }
  });
}

function runAiOpponent(io, room, humanSocketId) {
  const levelAccuracy = room.level?.botAccuracy ?? 0.50;
  const baseDelay = room.level?.botDelayMs ?? 7000;

  // AI Personalities: CYBER AI (Balanced), VIPER (Aggressive), ORACLE (Strategic), GLITCH (Unpredictable)
  const personalities = [
    { name: "CYBER AI", trait: "Balanced", speedMult: 1.0, accuracyBonus: 0.0 },
    { name: "VIPER", trait: "Aggressive", speedMult: 0.75, accuracyBonus: -0.05 },
    { name: "ORACLE", trait: "Strategic", speedMult: 1.2, accuracyBonus: 0.10 },
    { name: "GLITCH", trait: "Unpredictable", speedMult: 0.85, accuracyBonus: 0.02 }
  ];
  const personality = personalities[(room.level?.level || 1) % personalities.length];

  function aiAnswerNext() {
    const current = rooms.get(room.code);
    if (!current || current.status !== "active") return;
    const ai = current.players["AI_BOT"];
    if (!ai || ai.finished) return;

    const question = current.series[ai.currentIndex];
    const damage = question.type === "mcq" ? MCQ_DAMAGE : CODE_DAMAGE;
    const accuracy = Math.min(0.95, Math.max(0.20, (question.type === "mcq" ? levelAccuracy : levelAccuracy - 0.15) + personality.accuracyBonus));
    const willBeCorrect = Math.random() < accuracy;
    const human = current.players[humanSocketId];

    ai.answeredCount += 1;
    if (willBeCorrect) {
      ai.correctCount += 1;
      ai.questionsCleared += 1;
      ai.combo += 1;
      ai.maxCombo = Math.max(ai.maxCombo, ai.combo);
      if (human) human.hp = Math.max(0, human.hp - damage);
    } else {
      ai.combo = 0;
      ai.hp = Math.max(0, ai.hp - WRONG_SELF_DAMAGE);
    }
    ai.currentIndex += 1;
    if (ai.currentIndex >= current.series.length || ai.hp <= 0 || (human && human.hp <= 0)) {
      ai.finished = true;
      if (human && human.hp <= 0) human.finished = true;
    }

    io.to(room.code).emit("battle:aiProgress", {
      socketId: "AI_BOT",
      isCorrect: willBeCorrect,
      questionsCleared: ai.questionsCleared,
      hp: ai.hp,
      opponentHp: human?.hp ?? 100,
      damageDealt: willBeCorrect ? damage : 0,
      combo: ai.combo,
      personality: personality.name
    });

    maybeFinishMatch(io, current);

    if (!ai.finished && current.status === "active") {
      const delay = (question.type === "mcq" ? baseDelay + Math.random() * 2500 : baseDelay * 1.4 + Math.random() * 4000) * personality.speedMult;
      setTimeout(aiAnswerNext, Math.max(2500, delay));
    }
  }

  setTimeout(aiAnswerNext, Math.max(2500, (baseDelay - 2000) * personality.speedMult));
}

function maybeFinishMatch(io, room) {
  if (room.status === "finished") return;
  const players = Object.values(room.players);
  const bothDone = players.every((p) => p.finished);
  const anyKO = players.some((p) => p.hp <= 0);
  const timeUp = room.endsAt && Date.now() >= room.endsAt;
  if (!bothDone && !anyKO && !timeUp) return;
  finishMatch(io, room);
}

async function finishMatch(io, room) {
  if (room.status === "finished") return;
  room.status = "finished";

  const entries = Object.entries(room.players);

  const results = entries.map(([socketId, p]) => {
    const accuracy = p.answeredCount > 0 ? Math.round((p.correctCount / p.answeredCount) * 100) : 0;
    return { socketId, ...p, accuracy, totalQuestions: room.series.length };
  });

  let winner = results[0];
  if (results.length > 1) {
    winner = [...results].sort((a, b) => {
      if (b.questionsCleared !== a.questionsCleared) return b.questionsCleared - a.questionsCleared;
      if (b.accuracy !== a.accuracy) return b.accuracy - a.accuracy;
      return b.hp - a.hp;
    })[0];
  }

  for (const r of results) {
    if (!r.userId || r.isAI) continue;
    const didWin = r.socketId === winner.socketId && results.length > 1;
    const opponent = results.find((o) => o.socketId !== r.socketId);

    let opponentElo = 1400;
    if (opponent?.userId) {
      const oppUser = await User.findOne({ id: opponent.userId }).lean();
      if (oppUser) opponentElo = oppUser.elo;
    }

    const currUser = await User.findOne({ id: r.userId }).lean();
    const currentElo = currUser?.elo ?? 1000;
    const eloDelta = results.length > 1 ? calculateEloDelta(currentElo, opponentElo, didWin) : 0;
    const coinsEarned = r.correctCount * 25 + (didWin ? 100 : 20);
    const xpEarned = r.correctCount * 50 + (didWin ? 150 : 30);

    r.eloDelta = eloDelta;
    r.coinsEarned = coinsEarned;
    r.xpEarned = xpEarned;
    r.won = didWin;

    await recordMatchResult({
      matchId: room.code,
      userId: r.userId,
      won: didWin,
      accuracy: r.accuracy,
      eloDelta,
      coinsEarned,
      xpEarned,
      mode: room.vsAI ? "AI Practice" : "1v1 Battle Arena",
      platform: room.platform || "desktop",
      language: room.language,
      levelName: room.level?.name || "Level 1: Novice",
      questionsCleared: r.questionsCleared,
      totalQuestions: room.series.length,
      allPlayers: results
    });

    // Broadcast real-time cross-device sync event to all active sessions for this account
    io.to(`user:${r.userId}`).emit("user:dataUpdated", { userId: r.userId });
  }

  io.to(room.code).emit("match:end", {
    reason: "completed",
    winnerSocketId: winner.socketId,
    language: room.language,
    players: results
  });
}

setInterval(() => {
  const now = Date.now();
  for (const room of rooms.values()) {
    if (room.status === "active" && room.endsAt && now >= room.endsAt) {
      maybeFinishMatch(globalThis.__io, room);
    }
  }
}, 1000);

export function attachIoRefForTimers(io) {
  globalThis.__io = io;
}