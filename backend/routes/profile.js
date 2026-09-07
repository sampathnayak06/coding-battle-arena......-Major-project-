import { Router } from "express";
import { getLiveProfile } from "../data/authStore.js";
import { getTierForElo, animeHeroes } from "../data/animeData.js";

const router = Router();

router.get("/:userId?", async (req, res) => {
  try {
    const profile = await getLiveProfile(req.params.userId, getTierForElo);
    const hero = animeHeroes.find((h) => h.id === profile?.heroId) || animeHeroes[0];
    res.json({ profile, hero });
  } catch (err) {
    console.error("[profile] error:", err);
    res.status(500).json({ error: err.message || "Failed to fetch profile" });
  }
});

export default router;
