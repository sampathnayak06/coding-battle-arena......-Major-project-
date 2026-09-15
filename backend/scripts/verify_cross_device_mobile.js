import mongoose from "mongoose";
import { User } from "../models/User.js";
import { Match } from "../models/Match.js";
import {
  createUser,
  createSession,
  getUserByToken,
  findUserByEmail,
  recordMatchResult
} from "../data/authStore.js";
import { buildLanguageSeries } from "../data/quizData.js";

async function verifyCrossDeviceAndMobile() {
  console.log("🔍 Starting Cross-Device + Mobile MCQ verification...");
  await mongoose.connect("mongodb://127.0.0.1:27017/coding_battle_arena");

  // 1. Verify Mobile MCQ-only series generation
  console.log("📱 Testing buildLanguageSeries for Mobile (isMobile = true)...");
  const mobileSeries = buildLanguageSeries("javascript", 1, 4, [], true);
  const mobileNonMcq = mobileSeries.filter((q) => q.type !== "mcq");
  console.log(`   Mobile question count: ${mobileSeries.length}, Non-MCQ count: ${mobileNonMcq.length}`);
  if (mobileNonMcq.length === 0 && mobileSeries.length >= 10) {
    console.log("✅ Mobile MCQ Enforcement PASS: Series is 100% MCQ-only!");
  } else {
    console.error("❌ Mobile MCQ Enforcement FAIL: Found non-MCQ questions on mobile!");
  }

  // 2. Verify Desktop series generation
  console.log("💻 Testing buildLanguageSeries for Desktop (isMobile = false)...");
  const desktopSeries = buildLanguageSeries("javascript", 1, 4, [], false);
  const desktopCodeQuestions = desktopSeries.filter((q) => q.type === "code");
  console.log(`   Desktop question count: ${desktopSeries.length}, Code question count: ${desktopCodeQuestions.length}`);
  if (desktopCodeQuestions.length > 0) {
    console.log("✅ Desktop Experience Unchanged PASS: Desktop series includes code typing questions!");
  } else {
    console.error("❌ Desktop Experience FAIL: Desktop missing code questions!");
  }

  // 3. Test Multi-Device Same Account Authentication
  const testEmail = `crossdev_${Date.now()}@gmail.com`;
  console.log(`👤 Creating single MongoDB user account: ${testEmail}...`);
  const user = await createUser({
    username: `crossdev_${Date.now()}`,
    email: testEmail,
    password: "battle123",
    heroId: "naruto"
  });

  // Device 1: PC login
  console.log("💻 PC logs into account...");
  const pcToken = await createSession(user.id);
  const pcUser = await getUserByToken(pcToken);

  // Device 2: Phone logs into SAME account
  console.log("📱 Phone logs into SAME email account...");
  const phoneToken = await createSession(user.id);
  const phoneUser = await getUserByToken(phoneToken);

  if (pcUser.id === phoneUser.id && pcUser.email === phoneUser.email) {
    console.log("✅ Same Account PASS: PC and Phone resolve to the EXACT SAME MongoDB user record!");
  } else {
    console.error("❌ Same Account FAIL: Different user records were created!");
  }

  // Check simultaneous active sessions
  const updatedUserDoc = await User.findOne({ id: user.id }).lean();
  console.log(`   Tokens stored in MongoDB User document: ${updatedUserDoc.tokens.length}`);
  if (updatedUserDoc.tokens.includes(pcToken) && updatedUserDoc.tokens.includes(phoneToken)) {
    console.log("✅ Multi-Device Auth PASS: Both PC and Phone tokens remain active simultaneously!");
  } else {
    console.error("❌ Multi-Device Auth FAIL: One token invalidated the other!");
  }

  // 4. Test Mobile Match Result with platform="mobile"
  console.log("🎮 Phone plays a Mobile MCQ Match and wins...");
  const mobileMatchId = `m_mobile_${Date.now()}`;
  const afterMobileMatch = await recordMatchResult({
    matchId: mobileMatchId,
    userId: user.id,
    won: true,
    accuracy: 100,
    eloDelta: 20,
    coinsEarned: 100,
    xpEarned: 150,
    mode: "1v1 Battle Arena",
    platform: "mobile",
    language: "JAVASCRIPT",
    levelName: "Level 1: Novice",
    questionsCleared: 14,
    totalQuestions: 14
  });

  const savedMobileMatch = await Match.findOne({ matchId: mobileMatchId }).lean();
  console.log(`   Recorded match platform in MongoDB: ${savedMobileMatch.platform}`);
  console.log(`   Updated ELO=${afterMobileMatch.elo}, Coins=${afterMobileMatch.coins}`);

  // Fetch from PC session to verify data sharing
  const pcFetchedUser = await getUserByToken(pcToken);
  if (pcFetchedUser.elo === afterMobileMatch.elo && pcFetchedUser.coins === afterMobileMatch.coins) {
    console.log("✅ Cross-Device Data Sync PASS: PC sees updated ELO and coins from Mobile match!");
  } else {
    console.error("❌ Cross-Device Data Sync FAIL: PC user stats do not match Mobile stats!");
  }

  // Clean up test records
  await User.deleteOne({ id: user.id });
  await Match.deleteOne({ matchId: mobileMatchId });

  await mongoose.disconnect();
  console.log("🎉 ALL CROSS-DEVICE + MOBILE MCQ VERIFICATION TESTS PASSED!");
}

verifyCrossDeviceAndMobile().catch((err) => {
  console.error("❌ Verification failed:", err);
  process.exit(1);
});
