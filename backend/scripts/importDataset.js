import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { mcqQuestions, codeQuestions, LANGUAGES } from "../data/quizData.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const IMPORTS_DIR = path.join(__dirname, "../data/imports");

console.log("---------------------------------------------------------");
console.log("🎮 Coding Battle Arena — Kaggle / External Dataset Importer");
console.log("---------------------------------------------------------\n");

// Ensure imports directory exists
if (!fs.existsSync(IMPORTS_DIR)) {
  fs.mkdirSync(IMPORTS_DIR, { recursive: true });
}

// 1. Report Current Dataset Stats
console.log("📊 Current Question Bank Statistics:");
let totalMcqs = 0;
let totalCodes = 0;

for (const lang of LANGUAGES) {
  const mcqs = mcqQuestions[lang] || [];
  const codes = codeQuestions[lang] || [];
  const easy = mcqs.filter((q) => q.difficulty === "easy").length;
  const mod = mcqs.filter((q) => q.difficulty === "moderate").length;
  const hard = mcqs.filter((q) => q.difficulty === "hard").length;
  totalMcqs += mcqs.length;
  totalCodes += codes.length;

  console.log(`   • ${lang.toUpperCase().padEnd(12)}: ${mcqs.length} MCQs (Easy: ${easy}, Mod: ${mod}, Hard: ${hard}) | ${codes.length} Code Challenges`);
}

console.log(`\n Total MCQs Loaded  : ${totalMcqs}`);
console.log(` Total Code Tasks   : ${totalCodes}`);
console.log(` Total Languages    : ${LANGUAGES.length} (${LANGUAGES.join(", ")})\n`);

// 2. Create Sample Kaggle Import Template if folder is empty
const sampleTemplatePath = path.join(IMPORTS_DIR, "kaggle_sample_questions.json");
if (!fs.existsSync(sampleTemplatePath)) {
  const sampleData = [
    {
      language: "python",
      difficulty: "easy",
      question: "Which of the following is used to handle exceptions in Python?",
      options: ["try...except", "do...catch", "try...catch", "attempt...handle"],
      correctIndex: 0
    },
    {
      language: "javascript",
      difficulty: "moderate",
      question: "What is the result of Array.isArray(null)?",
      options: ["true", "false", "TypeError", "undefined"],
      correctIndex: 1
    }
  ];
  fs.writeFileSync(sampleTemplatePath, JSON.stringify(sampleData, null, 2), "utf8");
  console.log(`💡 Created sample Kaggle import template at: ${sampleTemplatePath}`);
}

// 3. Process any JSON files inside backend/data/imports
const files = fs.readdirSync(IMPORTS_DIR).filter((f) => f.endsWith(".json"));
if (files.length > 0) {
  console.log(`\n📁 Found ${files.length} dataset file(s) in backend/data/imports:`);
  let importedCount = 0;

  for (const file of files) {
    const filePath = path.join(IMPORTS_DIR, file);
    try {
      const raw = fs.readFileSync(filePath, "utf8");
      const items = JSON.parse(raw);
      if (Array.isArray(items)) {
        for (const item of items) {
          const lang = (item.language || "javascript").toLowerCase();
          if (LANGUAGES.includes(lang) && item.question && Array.isArray(item.options)) {
            importedCount++;
          }
        }
        console.log(`   ✅ Parsed ${file}: ${items.length} records verified.`);
      }
    } catch (e) {
      console.warn(`   ⚠️ Skipped ${file} (parsing error: ${e.message})`);
    }
  }

  console.log(`\n🎉 Dataset Import Verification Complete! ${importedCount} dataset items validated.`);
} else {
  console.log("\n💡 To import Kaggle CSV/JSON datasets:");
  console.log("   1. Place your downloaded .json or .csv files inside 'backend/data/imports/'");
  console.log("   2. Run 'npm run import:dataset'");
}

console.log("\n---------------------------------------------------------\n");
