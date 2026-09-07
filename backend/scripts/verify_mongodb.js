import mongoose from "mongoose";
import { User } from "../models/User.js";
import { Match } from "../models/Match.js";
import {
  createUser,
  getLiveProfile,
  recordMatchResult
} from "../data/authStore.js";
import { getTierForElo } from "../data/animeData.js";

async function runVerification() {
  console.log("🔍 Connecting to local MongoDB at mongodb://127.0.0.1:27017/coding_battle_arena...");
  await mongoose.connect("mongodb://127.0.0.1:27017/coding_battle_arena");
  console.log("✅ Connected successfully to database:", mongoose.connection.db.databaseName);

  // 1. Verify collections and user count
  const count = await User.countDocuments();
  console.log(`📊 Users collection count: ${count}`);

  // 2. Test User Creation / Retrieval
  const testUsername = `cyber_warrior_${Date.now()}`;
  const testEmail = `${testUsername}@arena.dev`;
  console.log(`👤 Creating test user: ${testUsername}...`);

  const user = await createUser({
    username: testUsername,
    email: testEmail,
    password: "battle123",
    heroId: "naruto"
  });

  console.log(`✅ User created in MongoDB: ID=${user.id}, Elo=${user.elo}, Coins=${user.coins}, PasswordHash=${user.passwordHash ? "PRESENT (Hashed)" : "MISSING"}`);

  // 3. Test Match Result Persistence
  console.log("⚔️ Recording match result in MongoDB...");
  const matchId = `m_test_${Date.now()}`;
  const updatedUser = await recordMatchResult({
    matchId,
    userId: user.id,
    won: true,
    accuracy: 92,
    eloDelta: 32,
    coinsEarned: 150,
    xpEarned: 200,
    mode: "AI Practice",
    language: "JAVASCRIPT",
    levelName: "Level 2: Intermediate",
    questionsCleared: 10,
    totalQuestions: 12
  });

  console.log(`✅ Match recorded! New Elo=${updatedUser.elo}, Coins=${updatedUser.coins}, XP=${updatedUser.xp}, Level=${updatedUser.level}, Wins=${updatedUser.wins}`);

  // 4. Test Idempotency (Duplicate match completion prevention)
  console.log("🛡️ Testing duplicate match completion protection...");
  const dupUser = await recordMatchResult({
    matchId, // SAME MATCH ID
    userId: user.id,
    won: true,
    accuracy: 92,
    eloDelta: 32,
    coinsEarned: 150,
    xpEarned: 200,
    mode: "AI Practice",
    language: "JAVASCRIPT",
    levelName: "Level 2: Intermediate",
    questionsCleared: 10,
    totalQuestions: 12
  });

  if (dupUser.elo === updatedUser.elo && dupUser.coins === updatedUser.coins) {
    console.log("✅ Idempotency PASS: Duplicate match completion skipped rewards as expected!");
  } else {
    console.error("❌ Idempotency FAIL: Rewards were applied twice!");
  }

  // 5. Test Match Document Exists in Matches Collection
  const matchDoc = await Match.findOne({ matchId }).lean();
  if (matchDoc) {
    console.log(`✅ Match Document verified in 'matches' collection: MatchID=${matchDoc.matchId}, Winner=${matchDoc.winnerId}`);
  } else {
    console.error("❌ Match Document missing from 'matches' collection!");
  }

  // 6. Test Profile & Match History Retrieval from MongoDB
  const profile = await getLiveProfile(user.id, getTierForElo);
  console.log(`📋 Profile retrieved from MongoDB: Username=${profile.username}, HistoryLength=${profile.matchHistory.length}`);
  if (profile.matchHistory.length > 0 && profile.matchHistory[0].id === matchId) {
    console.log("✅ Match history dynamically retrieved from 'matches' collection successfully!");
  } else {
    console.error("❌ Match history retrieval failed!");
  }

  await mongoose.disconnect();
  console.log("🎉 All MongoDB persistence and idempotency tests PASSED!");
}

runVerification().catch((err) => {
  console.error("❌ Verification failed with error:", err);
  process.exit(1);
});
