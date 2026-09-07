import { Router } from "express";
import { problems, getRandomFiveQuestionSeries } from "../data/problemsData.js";
import { animeHeroes } from "../data/animeData.js";
import { runSubmission } from "../services/judge0Service.js";

const router = Router();

// Full Problem Vault
router.get("/", (req, res) => {
  res.json({ problems });
});

// A fresh 5-question match series
router.get("/series", (req, res) => {
  res.json({ series: getRandomFiveQuestionSeries() });
});

// Anime hero roster (also exposed here for convenience alongside problems/matches)
router.get("/heroes", (req, res) => {
  res.json({ heroes: animeHeroes });
});

// Run/submit code against a problem's tests
router.post("/:problemId/run", async (req, res) => {
  const { code, language } = req.body;
  const problem = problems.find((p) => p.id === req.params.problemId);
  if (!problem) return res.status(404).json({ error: "Problem not found" });

  try {
    const result = await runSubmission({ code, language, tests: problem.tests });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
