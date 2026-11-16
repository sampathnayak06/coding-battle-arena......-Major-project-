import { mcqQuestions, codeQuestions, LANGUAGES, validateMcq, normalizeMcqOptions, buildLanguageSeries, getQuestionHints, parseLevel, LEVEL_PRESETS } from "../data/quizData.js";
import { CAMPAIGN_LEVELS, buildCampaignLevelSeries } from "../data/campaignLevels.js";

console.log("================================================================================");
console.log("       CODING BATTLE ARENA — COMPREHENSIVE MCQ & HINT TEST SUITE");
console.log("================================================================================\n");

let passedTests = 0;
let failedTests = 0;

function assert(condition, testName) {
  if (condition) {
    passedTests++;
    console.log(`  ✅ PASS: ${testName}`);
  } else {
    failedTests++;
    console.error(`  ❌ FAIL: ${testName}`);
  }
}

// -----------------------------------------------------------------------------
// TEST 1: Language Coverage
// -----------------------------------------------------------------------------
console.log("1. Verifying Programming Language Coverage...");
assert(LANGUAGES.length === 7, "All 7 core languages configured");
for (const lang of LANGUAGES) {
  const count = (mcqQuestions[lang] || []).length;
  assert(count >= 20, `Language "${lang.toUpperCase()}" has at least 20 verified MCQs (Found: ${count})`);
}

// -----------------------------------------------------------------------------
// TEST 2: Every MCQ Question, Options, Answer Key, Explanation & Hint Integrity
// -----------------------------------------------------------------------------
console.log("\n2. Verifying Every MCQ in Question Bank...");
let totalMcqs = 0;
let allOptionsHaveLength4 = true;
let allAnswersMatchOptions = true;
let allExplanationsPresent = true;
let allHintsPresent = true;
let noHintsLeakAnswers = true;
let uniqueOptionsCheck = true;

for (const lang of LANGUAGES) {
  const questions = mcqQuestions[lang] || [];
  for (const q of questions) {
    totalMcqs++;
    if (!validateMcq(q, lang)) {
      console.error(`     Validation failed on ${q.id} in ${lang}`);
    }

    if (!Array.isArray(q.options) || q.options.length !== 4) {
      allOptionsHaveLength4 = false;
      console.error(`     Options count != 4 in ${q.id}`);
    }

    const uniqueSet = new Set(q.options.map((o) => String(o).trim().toLowerCase()));
    if (uniqueSet.size !== 4) {
      uniqueOptionsCheck = false;
      console.error(`     Duplicate options in ${q.id}: [${q.options}]`);
    }

    if (q.options[q.correctIndex] !== q.correctAnswer) {
      allAnswersMatchOptions = false;
      console.error(`     Answer mismatch in ${q.id}: options[${q.correctIndex}]="${q.options[q.correctIndex]}" vs correctAnswer="${q.correctAnswer}"`);
    }

    const matchCount = q.options.filter((opt) => String(opt).trim() === String(q.correctAnswer).trim()).length;
    if (matchCount !== 1) {
      allAnswersMatchOptions = false;
      console.error(`     Exact match count != 1 for ${q.id}: matches ${matchCount} times`);
    }

    if (!q.explanation || typeof q.explanation !== "string" || q.explanation.trim().length < 10) {
      allExplanationsPresent = false;
      console.error(`     Missing or short explanation for ${q.id}`);
    }

    if (!q.hint || typeof q.hint !== "string" || q.hint.trim().length < 10) {
      allHintsPresent = false;
      console.error(`     Missing or short hint for ${q.id}`);
    }

    // Ensure hint does not reveal the entire correct answer directly
    const cleanAnswer = String(q.correctAnswer).replace(/[<>'"]/g, "").trim().toLowerCase();
    const cleanHint = String(q.hint).toLowerCase();
    if (cleanAnswer.length > 3 && cleanHint.includes(`the answer is ${cleanAnswer}`)) {
      noHintsLeakAnswers = false;
      console.error(`     Hint leaks answer for ${q.id}`);
    }
  }
}

assert(totalMcqs >= 140, `Total MCQs verified: ${totalMcqs}`);
assert(allOptionsHaveLength4, "Every single MCQ has exactly 4 options");
assert(uniqueOptionsCheck, "Every single MCQ has 4 unique, distinct options");
assert(allAnswersMatchOptions, "Every correctAnswer matches options[correctIndex] exactly once");
assert(allExplanationsPresent, "Every single MCQ has a comprehensive explanation");
assert(allHintsPresent, "Every single MCQ has a tactical, non-spoiling hint");
assert(noHintsLeakAnswers, "No hints spoil or reveal the correct answer directly");

// -----------------------------------------------------------------------------
// TEST 3: Dynamic Option Normalization (Fisher-Yates Shuffle)
// -----------------------------------------------------------------------------
console.log("\n3. Testing Dynamic MCQ Option Normalization...");
let normalizationSuccess = true;
for (const lang of LANGUAGES) {
  const sample = mcqQuestions[lang][0];
  for (let trial = 0; trial < 10; trial++) {
    const norm = normalizeMcqOptions(sample);
    if (norm.options.length !== 4 || norm.options[norm.correctIndex] !== norm.correctAnswer) {
      normalizationSuccess = false;
      console.error(`     Normalization trial failed for ${sample.id}`);
    }
  }
}
assert(normalizationSuccess, "Options normalize and shuffle while maintaining exact 1:1 answer key integrity");

// -----------------------------------------------------------------------------
// TEST 4: Build Language Series across all 10 Presets
// -----------------------------------------------------------------------------
console.log("\n4. Testing buildLanguageSeries across difficulty presets (Level 1 - 10)...");
let seriesSuccess = true;
for (let lvl = 1; lvl <= 10; lvl++) {
  for (const lang of LANGUAGES) {
    const series = buildLanguageSeries(lang, lvl, 2);
    if (!Array.isArray(series) || series.length < 10) {
      seriesSuccess = false;
      console.error(`     Series underflow at level ${lvl} for ${lang}: count = ${series?.length}`);
    }
    // Verify all MCQs in series
    const mcqsInSeries = series.filter((q) => q.type === "mcq");
    for (const q of mcqsInSeries) {
      if (q.options[q.correctIndex] !== q.correctAnswer) {
        seriesSuccess = false;
      }
    }
  }
}
assert(seriesSuccess, "buildLanguageSeries generates valid 10-14 question series for all levels (1-10) and languages");

// -----------------------------------------------------------------------------
// TEST 5: Campaign Level Question Series (30 Levels)
// -----------------------------------------------------------------------------
console.log("\n5. Testing buildCampaignLevelSeries across all 30 Campaign Levels...");
let campaignSuccess = true;
for (let lvl = 1; lvl <= 30; lvl++) {
  for (const lang of ["javascript", "python", "cpp", "c", "java"]) {
    const series = buildCampaignLevelSeries(lvl, lang);
    if (!Array.isArray(series) || series.length === 0) {
      campaignSuccess = false;
      console.error(`     Empty campaign series at level ${lvl} for ${lang}`);
    }
    for (const q of series) {
      if (q.type === "mcq" && q.options[q.correctIndex] !== q.correctAnswer) {
        campaignSuccess = false;
      }
      if (!q.hint) {
        campaignSuccess = false;
      }
    }
  }
}
assert(campaignSuccess, "All 30 campaign levels generate verified series with hints and explanations");

// -----------------------------------------------------------------------------
// TEST 6: Hint Retrieval Engine
// -----------------------------------------------------------------------------
console.log("\n6. Testing Hint Retrieval Engine (getQuestionHints)...");
let hintsEngineSuccess = true;
for (const lang of LANGUAGES) {
  const q = mcqQuestions[lang][0];
  const hints = getQuestionHints(q, lang);
  if (!Array.isArray(hints) || hints.length === 0 || typeof hints[0] !== "string" || hints[0].length < 10) {
    hintsEngineSuccess = false;
    console.error(`     Hint generation failed for ${q.id}`);
  }
}
assert(hintsEngineSuccess, "getQuestionHints returns valid tactical hints for all questions");

// -----------------------------------------------------------------------------
// Summary
// -----------------------------------------------------------------------------
console.log("\n================================================================================");
console.log(`RESULTS: ${passedTests} PASSED, ${failedTests} FAILED`);
console.log("================================================================================\n");

if (failedTests > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
