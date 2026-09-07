import { Router } from "express";
import { getLiveLeaderboard } from "../data/authStore.js";
import { getTierForElo } from "../data/animeData.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const leaderboard = await getLiveLeaderboard(getTierForElo);
    res.json({ leaderboard });
  } catch (err) {
    console.error("[leaderboard] error:", err);
    res.status(500).json({ error: err.message || "Failed to fetch leaderboard" });
  }
});

export default router;
