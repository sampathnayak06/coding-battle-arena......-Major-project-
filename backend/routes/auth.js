import { Router } from "express";
import {
  createUser,
  createSession,
  findUserByUsername,
  findUserByEmail,
  hashPassword,
  getUserByToken,
  publicUser
} from "../data/authStore.js";
import { animeHeroes } from "../data/animeData.js";

const router = Router();

export async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
    const user = token ? await getUserByToken(token) : null;
    if (!user) return res.status(401).json({ error: "Not authenticated" });
    req.user = user;
    req.token = token;
    next();
  } catch (err) {
    res.status(401).json({ error: "Authentication error" });
  }
}

router.post("/signup", async (req, res) => {
  try {
    const cleanUsername = typeof req.body.username === "string" ? req.body.username.trim() : "";
    const cleanEmail = typeof req.body.email === "string" ? req.body.email.trim() : "";
    const cleanPassword = typeof req.body.password === "string" ? req.body.password.trim() : "";
    const heroId = req.body.heroId;

    if (!cleanUsername || !cleanEmail || !cleanPassword) {
      return res.status(400).json({ error: "Username, email, and password are required" });
    }
    if (cleanPassword.length < 4) {
      return res.status(400).json({ error: "Password must be at least 4 characters" });
    }

    const existingName = await findUserByUsername(cleanUsername);
    if (existingName) {
      return res.status(409).json({ error: "That username is already taken" });
    }

    const existingEmail = await findUserByEmail(cleanEmail);
    if (existingEmail) {
      return res.status(409).json({ error: "An account with that email already exists" });
    }

    const validHero = animeHeroes.some((h) => h.id === heroId);
    const user = await createUser({
      username: cleanUsername,
      email: cleanEmail,
      password: cleanPassword,
      heroId: validHero ? heroId : "naruto"
    });

    const token = await createSession(user.id);
    res.status(201).json({ token, user: publicUser(user) });
  } catch (err) {
    console.error("[auth] signup error:", err);
    res.status(500).json({ error: err.message || "Failed to create account" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const cleanUsername = typeof req.body.username === "string" ? req.body.username.trim() : "";
    const cleanPassword = typeof req.body.password === "string" ? req.body.password.trim() : "";

    if (!cleanUsername || !cleanPassword) {
      return res.status(400).json({ error: "Username and password are required" });
    }

    const user = (await findUserByUsername(cleanUsername)) || (await findUserByEmail(cleanUsername));
    if (!user || user.passwordHash !== hashPassword(cleanPassword)) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const token = await createSession(user.id);
    res.json({ token, user: publicUser(user) });
  } catch (err) {
    console.error("[auth] login error:", err);
    res.status(500).json({ error: err.message || "Failed to log in" });
  }
});

router.get("/me", requireAuth, (req, res) => {
  res.json({ user: publicUser(req.user) });
});

export default router;
