import { Router } from "express";
import { requireAuth } from "./auth.js";
import { User } from "../models/User.js";
import { DailyGameResult } from "../models/DailyGameResult.js";
import { Match } from "../models/Match.js";
import { mcqQuestions, codeQuestions, stripAnswer } from "../data/quizData.js";
import { publicUser } from "../data/authStore.js";
import { customAlphabet } from "nanoid";

const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789", 12);
const router = Router();

/**
 * Returns formatted date string "YYYY-MM-DD" for today
 */
function getTodayDateString() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

/**
 * Deterministically generates today's 5-question challenge based on the date string
 */
function getDailyChallengeConfig(dateStr) {
  // Simple seed hash from date string
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = (hash << 5) - hash + dateStr.charCodeAt(i);
    hash |= 0;
  }
  const seed = Math.abs(hash);

  const languages = ["javascript", "python", "html", "css", "java", "cpp"];
  const chosenLang = languages[seed % languages.length];

  const mcqs = mcqQuestions[chosenLang] || mcqQuestions.javascript;
  const codes = codeQuestions[chosenLang] || codeQuestions.javascript;

  const q1 = mcqs[seed % mcqs.length];
  const q2 = mcqs[(seed + 3) % mcqs.length];
  const q3 = mcqs[(seed + 7) % mcqs.length];
  const q4 = codes[seed % codes.length] || mcqs[(seed + 2) % mcqs.length];
  const q5 = codes[(seed + 2) % codes.length] || mcqs[(seed + 5) % mcqs.length];

  const rawSeries = [q1, q2, q3, q4, q5].filter(Boolean);
  const series = rawSeries.map(stripAnswer);

  return {
    date: dateStr,
    title: `Daily Challenge — ${dateStr}`,
    subtitle: `Global ${chosenLang.toUpperCase()} Duel of the Day`,
    language: chosenLang,
    difficulty: "Medium",
    timeLimitMinutes: 10,
    rewards: { xp: 100, coins: 50 },
    series
  };
}

// GET /api/daily-game — Get today's challenge and user's completion status
router.get("/", requireAuth, async (req, res) => {
  try {
    const dateStr = getTodayDateString();
    const challenge = getDailyChallengeConfig(dateStr);

    const userDoc = await User.findOne({ id: req.user.id });
    if (!userDoc) return res.status(404).json({ error: "User not found" });

    const completedToday = userDoc.dailyGameProgress?.lastCompletedDate === dateStr;

    res.json({
      challenge,
      completedToday,
      lastCompletedDate: userDoc.dailyGameProgress?.lastCompletedDate || "",
      totalDailyCompleted: userDoc.dailyGameProgress?.totalCompleted || 0
    });
  } catch (err) {
    console.error("[daily-game] error:", err);
    res.status(500).json({ error: err.message || "Failed to load daily game" });
  }
});

// POST /api/daily-game/complete — Submit completion result for today's daily challenge
router.post("/complete", requireAuth, async (req, res) => {
  try {
    const dateStr = getTodayDateString();
    const userDoc = await User.findOne({ id: req.user.id });
    if (!userDoc) return res.status(404).json({ error: "User not found" });

    if (!userDoc.dailyGameProgress) {
      userDoc.dailyGameProgress = { lastCompletedDate: "", totalCompleted: 0, bestScore: 0 };
    }

    const alreadyCompleted = userDoc.dailyGameProgress.lastCompletedDate === dateStr;
    const { score = 0, accuracy = 0, completionTimeMs = 0 } = req.body;
    const numericScore = Number(score) || 0;
    const numericAccuracy = Number(accuracy) || 0;

    let xpEarned = 0;
    let coinsEarned = 0;

    if (!alreadyCompleted) {
      xpEarned = 100;
      coinsEarned = 50;

      userDoc.dailyGameProgress.lastCompletedDate = dateStr;
      userDoc.dailyGameProgress.totalCompleted = (userDoc.dailyGameProgress.totalCompleted || 0) + 1;
      userDoc.dailyGameProgress.bestScore = Math.max(userDoc.dailyGameProgress.bestScore || 0, numericScore);

      userDoc.xp = (userDoc.xp || 0) + xpEarned;
      userDoc.coins = (userDoc.coins || 0) + coinsEarned;
      userDoc.level = Math.floor(userDoc.xp / 500) + 1;

      await userDoc.save();

      // Record entry in DailyGameResult collection for today's leaderboard
      await DailyGameResult.create({
        date: dateStr,
        userId: userDoc.id,
        username: userDoc.username,
        heroId: userDoc.heroId,
        score: numericScore,
        accuracy: numericAccuracy,
        completionTimeMs: Number(completionTimeMs) || 0
      });

      // Record in Match history
      const matchId = `m_daily_${dateStr}_${nanoid(6)}`;
      await Match.create({
        matchId,
        mode: "Daily Game",
        platform: req.body.platform || "desktop",
        language: "JAVASCRIPT",
        difficulty: 5,
        levelName: `Daily Challenge (${dateStr})`,
        players: [
          {
            userId: userDoc.id,
            username: userDoc.username,
            heroId: userDoc.heroId,
            isAI: false,
            questionsCleared: 5,
            totalQuestions: 5,
            accuracy: numericAccuracy,
            hp: 100,
            won: true,
            eloDelta: 0,
            coinsEarned,
            xpEarned
          }
        ],
        winnerId: userDoc.id,
        questionsCleared: 5,
        totalQuestions: 5,
        accuracy: numericAccuracy,
        coinsEarned,
        xpEarned,
        timestamp: new Date()
      });

      // Emit Socket.IO real-time update
      if (globalThis.__io) {
        globalThis.__io.to(`user:${userDoc.id}`).emit("user:dataUpdated", { userId: userDoc.id });
      }
    }

    res.json({
      success: true,
      alreadyCompleted,
      date: dateStr,
      score: numericScore,
      accuracy: numericAccuracy,
      xpEarned,
      coinsEarned,
      user: publicUser(userDoc.toObject())
    });
  } catch (err) {
    console.error("[daily-game/complete] error:", err);
    res.status(500).json({ error: err.message || "Failed to complete daily challenge" });
  }
});

// GET /api/daily-game/leaderboard — Get today's daily leaderboard
router.get("/leaderboard", async (req, res) => {
  try {
    const dateStr = req.query.date || getTodayDateString();
    const results = await DailyGameResult.find({ date: dateStr })
      .sort({ score: -1, completionTimeMs: 1 })
      .limit(50)
      .lean();

    const leaderboard = results.map((r, index) => ({
      rank: index + 1,
      id: r._id,
      userId: r.userId,
      username: r.username,
      heroId: r.heroId,
      score: r.score,
      accuracy: r.accuracy,
      completionTimeMs: r.completionTimeMs,
      date: r.date
    }));

    res.json({ date: dateStr, leaderboard });
  } catch (err) {
    console.error("[daily-game/leaderboard] error:", err);
    res.status(500).json({ error: err.message || "Failed to fetch daily leaderboard" });
  }
});

export default router;
