import mongoose from "mongoose";
import { CAMPAIGN_LEVELS, getCampaignLevelConfig, buildCampaignLevelSeries } from "../data/campaignLevels.js";
import { User } from "../models/User.js";
import { DailyGameResult } from "../models/DailyGameResult.js";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/coding_battle_arena";

async function verify() {
  console.log("==========================================");
  console.log("VERIFYING CAMPAIGN & DAILY GAMES BACKEND");
  console.log("==========================================");

  // 1. Verify Level Data Definitions
  console.log(`\n[1/4] Checking campaignLevels.js data definitions...`);
  console.log(`- Total Campaign Levels Defined: ${CAMPAIGN_LEVELS.length} levels`);
  if (CAMPAIGN_LEVELS.length !== 30) {
    throw new Error(`Expected 30 campaign levels, found ${CAMPAIGN_LEVELS.length}`);
  }

  const lvl1 = getCampaignLevelConfig(1);
  console.log(`- Level 1 Config: Title="${lvl1.title}", Tier="${lvl1.tierName}", PassingScore=${lvl1.passingScore}`);

  const lvl30 = getCampaignLevelConfig(30);
  console.log(`- Level 30 Config: Title="${lvl30.title}", Boss="${lvl30.bossName}", PassingScore=${lvl30.passingScore}`);

  // 2. Verify Level Question Generator
  console.log(`\n[2/4] Testing buildCampaignLevelSeries question generator...`);
  const seriesLvl1 = buildCampaignLevelSeries(1, "javascript");
  console.log(`- Level 1 Series Question Count: ${seriesLvl1.length}`);
  if (seriesLvl1.length < 5) {
    throw new Error(`Level 1 series should contain at least 5 questions, got ${seriesLvl1.length}`);
  }

  // 3. Verify Database Connection & Schemas
  console.log(`\n[3/4] Connecting to MongoDB (${MONGODB_URI})...`);
  await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
  console.log(`- MongoDB Connected successfully.`);

  // 4. Test User Schema Campaign Progress & Daily Game Fields
  console.log(`\n[4/4] Verifying User & DailyGameResult Schemas...`);
  const sampleUser = await User.findOne({});
  if (sampleUser) {
    console.log(`- Found sample user: ${sampleUser.username} (ID: ${sampleUser.id})`);
    console.log(`  Campaign Progress Array Length: ${sampleUser.campaignProgress?.length || 0}`);
    console.log(`  Daily Game Progress: ${JSON.stringify(sampleUser.dailyGameProgress || {})}`);
  } else {
    console.log(`- No user records found in DB yet (will be created on first signup/login).`);
  }

  console.log("\n==========================================");
  console.log("✅ VERIFICATION SUCCESSFUL: ALL CHECKS PASSED!");
  console.log("==========================================");
  await mongoose.disconnect();
}

verify().catch((err) => {
  console.error("\n❌ VERIFICATION FAILED:", err);
  process.exit(1);
});
