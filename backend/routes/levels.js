import { Router } from "express";
import { requireAuth } from "./auth.js";
import { CAMPAIGN_LEVELS, getCampaignLevelConfig, buildCampaignLevelSeries } from "../data/campaignLevels.js";
import { User } from "../models/User.js";
import { Match } from "../models/Match.js";
import { publicUser } from "../data/authStore.js";
import { customAlphabet } from "nanoid";

const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789", 12);
const router = Router();

/**
 * Ensures user has campaignProgress initialized in MongoDB.
 * Level 1 starts unlocked by default.
 */
async function getOrInitProgress(userDoc) {
  if (!Array.isArray(userDoc.campaignProgress) || userDoc.campaignProgress.length === 0) {
    const initialProgress = CAMPAIGN_LEVELS.map((lvl) => ({
      levelId: lvl.levelId,
      completed: false,
      stars: 0,
      bestScore: 0,
      attempts: 0
    }));
    userDoc.campaignProgress = initialProgress;
    await userDoc.save();
  }
  return userDoc.campaignProgress;
}

/**
 * Computes highest unlocked level for a user, optionally per language.
 * Level 1 is always unlocked. Level N is unlocked if Level N-1 is completed.
 */
function getMaxUnlockedLevel(progressArray, langKey = null) {
  let maxUnlocked = 1;
  const lKey = langKey ? String(langKey).toLowerCase() : null;

  for (const p of progressArray) {
    let isCompleted = false;
    if (lKey) {
      if (p.languageProgress) {
        if (typeof p.languageProgress.get === "function") {
          const lp = p.languageProgress.get(lKey);
          isCompleted = lp && lp.completed;
        } else if (typeof p.languageProgress === "object") {
          const lp = p.languageProgress[lKey];
          isCompleted = lp && lp.completed;
        }
      }
    } else {
      isCompleted = p.completed;
    }

    if (isCompleted && p.levelId + 1 > maxUnlocked) {
      maxUnlocked = p.levelId + 1;
    }
  }
  return Math.min(maxUnlocked, CAMPAIGN_LEVELS.length);
}

// GET /api/levels — Get all level configurations
router.get("/", (req, res) => {
  res.json({ levels: CAMPAIGN_LEVELS });
});

// GET /api/levels/progress — Get authenticated user's campaign progress
router.get("/progress", requireAuth, async (req, res) => {
  try {
    const userDoc = await User.findOne({ id: req.user.id });
    if (!userDoc) return res.status(404).json({ error: "User not found" });

    const language = req.query.language ? String(req.query.language).toLowerCase() : null;
    const progress = await getOrInitProgress(userDoc);
    const maxUnlocked = getMaxUnlockedLevel(progress, language);
    const globalMaxUnlocked = getMaxUnlockedLevel(progress, null);
    const totalStars = progress.reduce((sum, p) => sum + (p.stars || 0), 0);

    res.json({
      progress,
      language: language || "all",
      maxUnlockedLevel: maxUnlocked,
      globalMaxUnlockedLevel: globalMaxUnlocked,
      totalStars,
      maxStars: CAMPAIGN_LEVELS.length * 3,
      user: publicUser(userDoc.toObject())
    });
  } catch (err) {
    console.error("[levels/progress] error:", err);
    res.status(500).json({ error: err.message || "Failed to fetch level progress" });
  }
});

// GET /api/levels/:levelId — Get details and questions for a specific campaign level
router.get("/:levelId", requireAuth, async (req, res) => {
  try {
    const levelId = Number(req.params.levelId);
    const config = getCampaignLevelConfig(levelId);
    if (!config) return res.status(404).json({ error: "Level not found" });

    const userDoc = await User.findOne({ id: req.user.id });
    if (!userDoc) return res.status(404).json({ error: "User not found" });

    const language = req.query.language || "javascript";
    const progress = await getOrInitProgress(userDoc);
    const maxUnlocked = getMaxUnlockedLevel(progress, language);

    // Validate that level is unlocked for chosen language
    if (levelId > maxUnlocked) {
      return res.status(403).json({
        error: `Level ${levelId} is locked for ${language.toUpperCase()}. Complete Level ${levelId - 1} in ${language.toUpperCase()} to unlock it.`
      });
    }

    const series = buildCampaignLevelSeries(levelId, language);

    res.json({
      level: config,
      series,
      unlocked: true
    });
  } catch (err) {
    console.error("[levels/:levelId] error:", err);
    res.status(500).json({ error: err.message || "Failed to load level details" });
  }
});

// POST /api/levels/:levelId/complete — Submit completion result for a level
router.post("/:levelId/complete", requireAuth, async (req, res) => {
  try {
    const levelId = Number(req.params.levelId);
    const config = getCampaignLevelConfig(levelId);
    if (!config) return res.status(404).json({ error: "Level not found" });

    const userDoc = await User.findOne({ id: req.user.id });
    if (!userDoc) return res.status(404).json({ error: "User not found" });

    const {
      score = 0,
      accuracy = 0,
      questionsCleared = 0,
      totalQuestions = 5,
      language = "JAVASCRIPT"
    } = req.body;

    const langKey = String(language || "javascript").toLowerCase();
    const progress = await getOrInitProgress(userDoc);
    const maxUnlocked = getMaxUnlockedLevel(progress, langKey);

    if (levelId > maxUnlocked) {
      return res.status(403).json({ error: `Level ${levelId} is locked for ${langKey.toUpperCase()}.` });
    }

    const numericScore = Number(score) || 0;
    const numericAccuracy = Number(accuracy) || 0;

    // Determine completion & stars earned
    const passed = numericScore >= config.passingScore || numericAccuracy >= 60;
    let stars = 0;
    if (passed) {
      if (numericScore >= config.threeStarScore) stars = 3;
      else if (numericScore >= config.twoStarScore) stars = 2;
      else stars = 1;
    }

    // Find level progress entry in User document
    let levelEntry = userDoc.campaignProgress.find((p) => p.levelId === levelId);
    if (!levelEntry) {
      levelEntry = { levelId, completed: false, stars: 0, bestScore: 0, attempts: 0, languageProgress: new Map() };
      userDoc.campaignProgress.push(levelEntry);
    }

    if (!levelEntry.languageProgress) {
      levelEntry.languageProgress = new Map();
    }

    let langProg = levelEntry.languageProgress.get(langKey) || {
      completed: false,
      stars: 0,
      bestScore: 0,
      attempts: 0
    };

    langProg.attempts = (langProg.attempts || 0) + 1;
    langProg.bestScore = Math.max(langProg.bestScore || 0, numericScore);

    const wasCompletedBefore = levelEntry.completed;
    const wasLangCompletedBefore = langProg.completed;
    levelEntry.attempts += 1;
    levelEntry.bestScore = Math.max(levelEntry.bestScore || 0, numericScore);

    let xpEarned = 0;
    let coinsEarned = 0;

    if (passed) {
      langProg.completed = true;
      langProg.stars = Math.max(langProg.stars || 0, stars);
      langProg.completedAt = new Date();
      levelEntry.languageProgress.set(langKey, langProg);

      levelEntry.completed = true;
      let maxStars = 0;
      for (const [, v] of levelEntry.languageProgress.entries()) {
        if (v && v.stars > maxStars) maxStars = v.stars;
      }
      levelEntry.stars = Math.max(levelEntry.stars || 0, maxStars, stars);
      levelEntry.completedAt = new Date();

      // Award XP & coins (first time language completion gives full reward, repeats give partial)
      xpEarned = wasLangCompletedBefore ? Math.round(config.xpReward * 0.4) : config.xpReward;
      coinsEarned = wasLangCompletedBefore ? Math.round(config.coinReward * 0.4) : config.coinReward;

      userDoc.xp = (userDoc.xp || 0) + xpEarned;
      userDoc.coins = (userDoc.coins || 0) + coinsEarned;
      userDoc.wins = (userDoc.wins || 0) + 1;
      userDoc.winStreak = (userDoc.winStreak || 0) + 1;
      userDoc.level = Math.floor(userDoc.xp / 500) + 1;
    } else {
      levelEntry.languageProgress.set(langKey, langProg);
      userDoc.losses = (userDoc.losses || 0) + 1;
      userDoc.winStreak = 0;
    }

    await userDoc.save();

    // Record Match document in MongoDB for match history
    const matchId = `m_camp_${levelId}_${nanoid(8)}`;
    const matchDoc = new Match({
      matchId,
      mode: "Bot Campaign",
      platform: req.body.platform || "desktop",
      language: String(language).toUpperCase(),
      difficulty: levelId,
      levelName: config.title,
      players: [
        {
          userId: userDoc.id,
          username: userDoc.username,
          heroId: userDoc.heroId,
          isAI: false,
          questionsCleared,
          totalQuestions,
          accuracy: numericAccuracy,
          hp: passed ? 100 : 0,
          won: passed,
          eloDelta: 0,
          coinsEarned,
          xpEarned
        }
      ],
      winnerId: passed ? userDoc.id : undefined,
      questionsCleared,
      totalQuestions,
      accuracy: numericAccuracy,
      coinsEarned,
      xpEarned,
      timestamp: new Date()
    });
    await matchDoc.save();

    // Emit Socket.IO real-time update to user's devices
    if (globalThis.__io) {
      globalThis.__io.to(`user:${userDoc.id}`).emit("user:dataUpdated", { userId: userDoc.id });
    }

    const updatedProgress = userDoc.campaignProgress;
    const newMaxUnlocked = getMaxUnlockedLevel(updatedProgress, langKey);

    res.json({
      success: true,
      passed,
      stars,
      score: numericScore,
      accuracy: numericAccuracy,
      xpEarned,
      coinsEarned,
      nextLevelUnlocked: passed && levelId < CAMPAIGN_LEVELS.length ? levelId + 1 : null,
      maxUnlockedLevel: newMaxUnlocked,
      totalStars: updatedProgress.reduce((s, p) => s + (p.stars || 0), 0),
      user: publicUser(userDoc.toObject())
    });
  } catch (err) {
    console.error("[levels/:levelId/complete] error:", err);
    res.status(500).json({ error: err.message || "Failed to record level completion" });
  }
});

export default router;
