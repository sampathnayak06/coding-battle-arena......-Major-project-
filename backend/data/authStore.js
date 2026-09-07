import crypto from "crypto";
import { customAlphabet } from "nanoid";
import { mockUsers } from "./mockUsers.js";
import { User } from "../models/User.js";
import { Match } from "../models/Match.js";

const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789", 24);

export function hashPassword(password) {
  const val = typeof password === "string" ? password.trim() : String(password || "");
  return crypto.createHash("sha256").update(val).digest("hex");
}

export async function seedInitialUsers() {
  try {
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      console.log(`📦 MongoDB already initialized with ${userCount} users. Skipping seed.`);
      return;
    }

    console.log("🌱 Database empty. Seeding initial demo users into MongoDB...");
    const demoPasswordHash = hashPassword("battle123");

    for (const u of mockUsers) {
      const userDoc = new User({
        id: u.id,
        username: u.username,
        email: `${u.username.toLowerCase()}@arena.dev`,
        passwordHash: demoPasswordHash,
        heroId: u.heroId,
        elo: u.elo,
        coins: u.coins,
        xp: u.xp || 300,
        level: u.level || Math.floor((u.xp || 300) / 500) + 1,
        wins: u.wins,
        losses: u.losses,
        winStreak: Math.floor(Math.random() * 4),
        achievements: ["First Blood", "5-Win Streak", "AI Slayer"],
        badges: ["Demo Champion", "Speed Coder"],
        tokens: []
      });
      await userDoc.save();

      // Seed initial demo match for this user
      const matchDoc = new Match({
        matchId: `m_${u.id}_init`,
        mode: "1v1 Battle Arena",
        language: "JAVASCRIPT",
        difficulty: 1,
        levelName: "Level 1: Novice Basics",
        players: [
          {
            userId: u.id,
            username: u.username,
            heroId: u.heroId,
            questionsCleared: 12,
            totalQuestions: 14,
            accuracy: 85,
            hp: 100,
            won: true,
            eloDelta: 24,
            coinsEarned: 150,
            xpEarned: 250
          }
        ],
        winnerId: u.id,
        questionsCleared: 12,
        totalQuestions: 14,
        accuracy: 85,
        eloDelta: 24,
        coinsEarned: 150,
        xpEarned: 250,
        timestamp: new Date(Date.now() - 3600000 * 2)
      });
      await matchDoc.save();
    }
    console.log("✅ Demo users successfully seeded into MongoDB.");
  } catch (error) {
    console.error("❌ Error seeding initial users into MongoDB:", error.message || error);
  }
}

export async function findUserByUsername(username) {
  if (!username || typeof username !== "string") return null;
  const clean = username.trim();
  return await User.findOne({ username: { $regex: new RegExp(`^${clean}$`, "i") } }).lean();
}

export async function findUserByEmail(email) {
  if (!email || typeof email !== "string") return null;
  const clean = email.trim().toLowerCase();
  return await User.findOne({ email: clean }).lean();
}

export async function findUserById(userId) {
  if (!userId || typeof userId !== "string") return null;
  return await User.findOne({ id: userId }).lean();
}

export async function createUser({ username, email, password, heroId }) {
  const id = `u_${nanoid(8)}`;
  const cleanUsername = String(username || "").trim();
  const cleanEmail = String(email || "").trim().toLowerCase();
  const passwordHash = hashPassword(password);

  const userDoc = new User({
    id,
    username: cleanUsername,
    email: cleanEmail,
    passwordHash,
    heroId: heroId || "naruto",
    elo: 1000,
    coins: 200,
    xp: 0,
    level: 1,
    wins: 0,
    losses: 0,
    winStreak: 0,
    achievements: ["First Step"],
    badges: ["Newbie Coder"],
    tokens: []
  });

  await userDoc.save();
  return userDoc.toObject();
}

export async function createSession(userId) {
  const token = nanoid(24);
  await User.updateOne({ id: userId }, { $push: { tokens: token } });
  return token;
}

export async function getUserByToken(token) {
  if (!token || typeof token !== "string") return null;
  return await User.findOne({ tokens: token }).lean();
}

export function publicUser(user) {
  if (!user) return null;
  const { passwordHash, tokens, _id, __v, ...safe } = user;
  return safe;
}

export async function getLiveLeaderboard(getTierForElo) {
  const users = await User.find().sort({ elo: -1 }).limit(100).lean();
  return users.map((u, i) => ({
    rank: i + 1,
    ...publicUser(u),
    tier: getTierForElo(u.elo).name
  }));
}

export async function getLiveProfile(userId, getTierForElo) {
  let user = userId ? await User.findOne({ id: userId }).lean() : null;
  if (!user) {
    user = await User.findOne().lean();
  }
  if (!user) {
    return {
      id: "u_default",
      username: "Player",
      heroId: "naruto",
      elo: 1000,
      coins: 200,
      xp: 0,
      level: 1,
      wins: 0,
      losses: 0,
      tier: "Bronze",
      matchHistory: []
    };
  }

  // Retrieve user match history dynamically from Match collection
  const rawMatches = await Match.find({ "players.userId": user.id })
    .sort({ timestamp: -1 })
    .limit(30)
    .lean();

  const formattedHistory = rawMatches.map((m) => {
    const p = m.players.find((player) => player.userId === user.id) || m.players[0] || {};
    return {
      id: m.matchId,
      timestamp: m.timestamp ? new Date(m.timestamp).toISOString() : new Date().toISOString(),
      mode: m.mode || "1v1 Battle Arena",
      language: (m.language || "JAVASCRIPT").toUpperCase(),
      levelName: m.levelName || "Level 1: Novice",
      result: p.won ? "VICTORY" : "DEFEAT",
      accuracy: typeof p.accuracy === "number" ? p.accuracy : m.accuracy || 0,
      questionsCleared: p.questionsCleared || m.questionsCleared || 0,
      totalQuestions: p.totalQuestions || m.totalQuestions || 14,
      eloDelta: p.eloDelta || m.eloDelta || 0,
      coinsEarned: p.coinsEarned || m.coinsEarned || 0,
      xpEarned: p.xpEarned || m.xpEarned || 0
    };
  });

  return {
    ...publicUser(user),
    tier: getTierForElo(user.elo).name,
    matchHistory: formattedHistory,
    skills: user.skills || {
      arrays: 92,
      dynamicProgramming: 78,
      graphs: 61,
      strings: 88,
      trees: 74
    },
    badges: user.badges || ["First Blood", "5-Win Streak", "AI Slayer"]
  };
}

/**
 * Idempotent match completion recording into MongoDB.
 * Prevents duplicate rewards if called multiple times for the same matchId.
 */
export async function recordMatchResult({
  matchId,
  userId,
  won,
  accuracy = 0,
  eloDelta = 0,
  coinsEarned = 0,
  xpEarned = 0,
  mode = "AI Practice",
  language = "HTML",
  levelName = "Level 1: Novice",
  questionsCleared = 0,
  totalQuestions = 14,
  allPlayers = []
}) {
  if (!userId) return null;

  // 1. Idempotency Check: Prevent duplicate rewards for the same matchId
  if (matchId) {
    const existingMatch = await Match.findOne({ matchId }).lean();
    if (existingMatch) {
      console.log(`[authStore] Match ${matchId} already recorded in MongoDB. Skipping duplicate reward.`);
      const currentUser = await User.findOne({ id: userId }).lean();
      return publicUser(currentUser);
    }
  }

  // 2. Fetch User & Compute Updated Stats
  const user = await User.findOne({ id: userId });
  if (!user) return null;

  const newElo = Math.max(0, user.elo + eloDelta);
  const newCoins = user.coins + coinsEarned;
  const newXp = (user.xp || 0) + xpEarned;
  const newLevel = Math.floor(newXp / 500) + 1;
  const newWins = won ? user.wins + 1 : user.wins;
  const newLosses = won ? user.losses : user.losses + 1;
  const newStreak = won ? (user.winStreak || 0) + 1 : 0;

  // 3. Atomically Update User in MongoDB
  user.elo = newElo;
  user.coins = newCoins;
  user.xp = newXp;
  user.level = newLevel;
  user.wins = newWins;
  user.losses = newLosses;
  user.winStreak = newStreak;

  await user.save();

  // 4. Create and Save Match Record in MongoDB
  const finalMatchId = matchId || `m_${nanoid(12)}`;
  const matchPlayers = allPlayers.length > 0
    ? allPlayers.map((p) => ({
        userId: p.userId || p.id,
        username: p.username || "Guest",
        heroId: p.heroId || "naruto",
        isAI: !!p.isAI,
        questionsCleared: p.questionsCleared || 0,
        totalQuestions: totalQuestions,
        accuracy: p.accuracy || 0,
        hp: p.hp || 0,
        won: p.won || false,
        eloDelta: p.eloDelta || 0,
        coinsEarned: p.coinsEarned || 0,
        xpEarned: p.xpEarned || 0
      }))
    : [
        {
          userId: user.id,
          username: user.username,
          heroId: user.heroId,
          isAI: false,
          questionsCleared,
          totalQuestions,
          accuracy,
          hp: 100,
          won,
          eloDelta,
          coinsEarned,
          xpEarned
        }
      ];

  const matchDoc = new Match({
    matchId: finalMatchId,
    mode,
    language: String(language).toUpperCase(),
    difficulty: 1,
    levelName: levelName || "Level 1: Novice",
    players: matchPlayers,
    winnerId: won ? user.id : undefined,
    questionsCleared,
    totalQuestions,
    accuracy,
    eloDelta,
    coinsEarned,
    xpEarned,
    timestamp: new Date()
  });

  await matchDoc.save();

  return publicUser(user.toObject());
}
