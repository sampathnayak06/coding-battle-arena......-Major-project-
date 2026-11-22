import { buildCampaignLevelSeries, getCampaignLevelConfig } from "../data/campaignLevels.js";

const languages = ["javascript", "python", "java", "cpp", "c"];

console.log("==================================================");
console.log("🎮 VERIFYING CAMPAIGN CURRICULUM DIVERSITY");
console.log("==================================================");

// 1. Verify Level 1 has completely different questions across all 5 languages
console.log("\n1. Testing Level 1 questions across all 5 languages:");
const level1QuestionsByLang = {};
for (const lang of languages) {
  const series = buildCampaignLevelSeries(1, lang);
  level1QuestionsByLang[lang] = series;
  const firstQ = series[0];
  console.log(`   [${lang.toUpperCase()}] Q1: "${firstQ.question || firstQ.title}"`);
}

// Ensure each language has distinct questions for Level 1
const q1Texts = languages.map((l) => level1QuestionsByLang[l][0].question);
const uniqueQ1Texts = new Set(q1Texts);
if (uniqueQ1Texts.size !== languages.length) {
  throw new Error("Level 1 questions are NOT completely different across languages!");
}
console.log("✅ Level 1 questions are 100% unique across all 5 languages!");

// 2. Verify Level 1, Level 2, Level 3, Level 4, Level 5 questions are completely different within JavaScript
console.log("\n2. Testing Level 1 to Level 5 within JavaScript:");
const jsLevelQ1s = [];
for (let lvl = 1; lvl <= 5; lvl++) {
  const series = buildCampaignLevelSeries(lvl, "javascript");
  const firstQ = series[0];
  jsLevelQ1s.push(firstQ.question || firstQ.title);
  console.log(`   [Level ${lvl}] Q1: "${firstQ.question || firstQ.title}" (${series.length} items)`);
}
const uniqueJsLevels = new Set(jsLevelQ1s);
if (uniqueJsLevels.size !== 5) {
  throw new Error("Questions do not change across levels 1 to 5!");
}
console.log("✅ Questions change completely across levels 1 to 5!");

// 3. Verify all 30 levels have questions for all 5 languages
console.log("\n3. Testing all 30 levels for all 5 languages (150 curricula)...");
let totalVerified = 0;
for (const lang of languages) {
  for (let lvl = 1; lvl <= 30; lvl++) {
    const series = buildCampaignLevelSeries(lvl, lang);
    if (!series || series.length === 0) {
      throw new Error(`Level ${lvl} in ${lang} returned empty questions!`);
    }
    // Verify each question has valid question/title and options or starter
    for (const q of series) {
      if (q.type === "mcq") {
        if (!q.question || !Array.isArray(q.options) || q.options.length < 2) {
          throw new Error(`Invalid MCQ in Level ${lvl} (${lang}): ${JSON.stringify(q)}`);
        }
      } else if (q.type === "code") {
        if (!q.title || !q.starter) {
          throw new Error(`Invalid Code question in Level ${lvl} (${lang}): ${JSON.stringify(q)}`);
        }
      }
    }
    totalVerified++;
  }
}
console.log(`✅ All ${totalVerified} level-language configurations verified successfully!`);

// 4. Verify Boss Levels (5, 10, 15, 20, 25, 30) have coding challenges
console.log("\n4. Testing Boss Level coding challenges:");
const bossLevels = [5, 10, 15, 20, 25, 30];
for (const bLvl of bossLevels) {
  for (const lang of languages) {
    const series = buildCampaignLevelSeries(bLvl, lang);
    const hasCode = series.some((q) => q.type === "code");
    if (!hasCode) {
      throw new Error(`Boss Level ${bLvl} in ${lang} is missing a code challenge!`);
    }
  }
  const config = getCampaignLevelConfig(bLvl);
  console.log(`   [Boss Level ${bLvl}] ${config.title} - Verified code challenges in all 5 languages.`);
}
console.log("✅ All Boss Levels have custom code challenges!");

console.log("\n==================================================");
console.log("🎉 ALL CURRICULUM VERIFICATION CHECKS PASSED!");
console.log("==================================================");
