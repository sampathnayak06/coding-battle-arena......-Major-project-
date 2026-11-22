import { Router } from "express";
import {
  createUser,
  createSession,
  findUserByUsername,
  findUserByEmail,
  hashPassword,
  getUserByToken,
  publicUser,
  resetUserPassword,
  createAndSendVerificationCode,
  verifyAndConsumeCode,
  maskEmail
} from "../data/authStore.js";
import { animeHeroes } from "../data/animeData.js";
import { validateEmail } from "../services/emailValidator.js";

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

/**
 * Validates whether an email address is real, has valid domain MX records,
 * and is not a disposable address.
 */
router.post("/validate-email", async (req, res) => {
  try {
    const email = typeof req.body.email === "string" ? req.body.email.trim() : "";
    const result = await validateEmail(email);
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(400).json({ error: err.message || "Invalid email address." });
  }
});

/**
 * Step 1 of Signup:
 * Validates real email, checks username/email availability,
 * and sends a 6-digit verification code to the email via Google Mail.
 */
router.post("/signup/send-code", async (req, res) => {
  try {
    const cleanUsername = typeof req.body.username === "string" ? req.body.username.trim() : "";
    const cleanEmail = typeof req.body.email === "string" ? req.body.email.trim() : "";

    if (!cleanUsername || !cleanEmail) {
      return res.status(400).json({ error: "Codename and email are required to request a verification code." });
    }

    if (cleanUsername.length < 3) {
      return res.status(400).json({ error: "Username must be at least 3 characters long." });
    }

    // 1. Verify that the email is a REAL email (proper syntax, real MX mail server, not disposable)
    await validateEmail(cleanEmail);

    // 2. Check for duplicate username
    const existingName = await findUserByUsername(cleanUsername);
    if (existingName) {
      return res.status(409).json({ error: "That username is already taken. Please choose another." });
    }

    // 3. Check for duplicate email
    const existingEmail = await findUserByEmail(cleanEmail);
    if (existingEmail) {
      return res.status(409).json({ error: "An account with that email already exists. Please sign in instead." });
    }

    // 4. Dispatch 6-digit verification code via Google Mail
    const result = await createAndSendVerificationCode({
      email: cleanEmail,
      type: "signup",
      username: cleanUsername
    });

    res.json({
      success: true,
      message: `Verification code sent to ${result.maskedEmail}. Please check your inbox and spam folder.`,
      maskedEmail: result.maskedEmail,
      devMode: result.devMode,
      devCode: result.devCode
    });
  } catch (err) {
    console.error("[auth] signup/send-code error:", err);
    res.status(400).json({ error: err.message || "Failed to dispatch verification code." });
  }
});

/**
 * Step 2 of Signup:
 * Verifies the 6-digit code sent to the real email address,
 * and creates the player's account.
 */
router.post("/signup", async (req, res) => {
  try {
    const cleanUsername = typeof req.body.username === "string" ? req.body.username.trim() : "";
    const cleanEmail = typeof req.body.email === "string" ? req.body.email.trim() : "";
    const cleanPassword = typeof req.body.password === "string" ? req.body.password.trim() : "";
    const verificationCode = typeof req.body.verificationCode === "string" ? req.body.verificationCode.trim() : "";
    const heroId = req.body.heroId;

    if (!cleanUsername || !cleanEmail || !cleanPassword) {
      return res.status(400).json({ error: "Username, email, and password are required." });
    }
    if (cleanPassword.length < 4) {
      return res.status(400).json({ error: "Password must be at least 4 characters long." });
    }

    // Re-verify real email
    await validateEmail(cleanEmail);

    const existingName = await findUserByUsername(cleanUsername);
    if (existingName) {
      return res.status(409).json({ error: "That username is already taken." });
    }

    const existingEmail = await findUserByEmail(cleanEmail);
    if (existingEmail) {
      return res.status(409).json({ error: "An account with that email already exists." });
    }

    // Require valid 6-digit email verification code
    if (!verificationCode) {
      return res.status(400).json({ error: "Verification code is required to confirm your email." });
    }

    await verifyAndConsumeCode({
      email: cleanEmail,
      code: verificationCode,
      type: "signup"
    });

    const validHero = animeHeroes.some((h) => h.id === heroId);
    const user = await createUser({
      username: cleanUsername,
      email: cleanEmail,
      password: cleanPassword,
      heroId: validHero ? heroId : "kairo"
    });

    const token = await createSession(user.id);
    res.status(201).json({ token, user: publicUser(user) });
  } catch (err) {
    console.error("[auth] signup error:", err);
    const status = err.message && err.message.includes("Verification code") ? 400 : 400;
    res.status(status).json({ error: err.message || "Failed to create account." });
  }
});

router.post("/login", async (req, res) => {
  try {
    const cleanUsername = typeof req.body.username === "string" ? req.body.username.trim() : "";
    const cleanPassword = typeof req.body.password === "string" ? req.body.password.trim() : "";

    if (!cleanUsername || !cleanPassword) {
      return res.status(400).json({ error: "Username and password are required." });
    }

    const user = (await findUserByUsername(cleanUsername)) || (await findUserByEmail(cleanUsername));
    if (!user || user.passwordHash !== hashPassword(cleanPassword)) {
      return res.status(401).json({ error: "Invalid username or password." });
    }

    const token = await createSession(user.id);
    res.json({ token, user: publicUser(user) });
  } catch (err) {
    console.error("[auth] login error:", err);
    res.status(500).json({ error: err.message || "Failed to log in." });
  }
});

/**
 * Step 1 of Forgot Password:
 * Finds user by username or email, and dispatches a 6-digit verification code
 * to their registered email address using Google Mail (Gmail SMTP).
 */
router.post("/forgot-password/send-code", async (req, res) => {
  try {
    const rawIdentifier = req.body.identifier || req.body.username || req.body.email || "";
    const cleanIdentifier = typeof rawIdentifier === "string" ? rawIdentifier.trim() : "";

    if (!cleanIdentifier) {
      return res.status(400).json({ error: "Please enter your username or registered email." });
    }

    const user = (await findUserByUsername(cleanIdentifier)) || (await findUserByEmail(cleanIdentifier));
    if (!user) {
      return res.status(404).json({ error: "No account found with that username or email." });
    }

    // Send 6-digit code to the user's real registered email
    const result = await createAndSendVerificationCode({
      email: user.email,
      type: "reset_password",
      username: user.username
    });

    res.json({
      success: true,
      message: `Verification code sent to ${result.maskedEmail}. Please check your inbox and spam folder.`,
      maskedEmail: result.maskedEmail,
      devMode: result.devMode,
      devCode: result.devCode
    });
  } catch (err) {
    console.error("[auth] forgot-password/send-code error:", err);
    res.status(400).json({ error: err.message || "Failed to send reset code." });
  }
});

/**
 * Step 2 of Forgot Password:
 * Verifies the 6-digit code and resets the user's password.
 */
router.post("/reset-password", async (req, res) => {
  try {
    const rawIdentifier = req.body.identifier || req.body.username || req.body.email || "";
    const cleanIdentifier = typeof rawIdentifier === "string" ? rawIdentifier.trim() : "";
    const cleanCode = typeof req.body.code === "string" ? req.body.code.trim() : "";
    const cleanPassword = typeof req.body.newPassword === "string" ? req.body.newPassword.trim() : "";

    if (!cleanIdentifier) {
      return res.status(400).json({ error: "Username or email is required." });
    }
    if (!cleanCode) {
      return res.status(400).json({ error: "6-digit verification code is required." });
    }
    if (!cleanPassword || cleanPassword.length < 4) {
      return res.status(400).json({ error: "New password must be at least 4 characters long." });
    }

    const updatedUser = await resetUserPassword(cleanIdentifier, cleanPassword, cleanCode);
    const token = await createSession(updatedUser.id);

    res.json({
      success: true,
      message: "Password updated successfully!",
      token,
      user: publicUser(updatedUser)
    });
  } catch (err) {
    console.error("[auth] reset-password error:", err);
    const status = err.message && err.message.includes("No account found") ? 404 : 400;
    res.status(status).json({ error: err.message || "Failed to reset password." });
  }
});

router.get("/me", requireAuth, (req, res) => {
  res.json({ user: publicUser(req.user) });
});

export default router;
