import "dotenv/config";
import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";

import authRoutes from "./routes/auth.js";
import leaderboardRoutes from "./routes/leaderboard.js";
import profileRoutes from "./routes/profile.js";
import problemsRoutes from "./routes/problems.js";
import levelsRoutes from "./routes/levels.js";
import dailyGameRoutes from "./routes/dailyGame.js";
import { registerMatchHandlers, attachIoRefForTimers } from "./socket/matchHandlers.js";
import { getUserByToken, publicUser, seedInitialUsers } from "./data/authStore.js";

process.on("uncaughtException", (err) => {
  console.error("⚠️ Uncaught Exception caught:", err.message || err, err.stack);
});

process.on("unhandledRejection", (reason) => {
  console.error("⚠️ Unhandled Rejection caught:", reason);
});

const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || process.env.CLIENT_ORIGIN || "http://localhost:3000";
const ALLOWED_ORIGINS = [
  FRONTEND_URL,
  process.env.CLIENT_ORIGIN,
  "http://127.0.0.1:3000",
  "http://localhost:3000",
  "http://localhost:5173",
  "http://127.0.0.1:5173"
].filter(Boolean);
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/coding_battle_arena";

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile native apps, curl, or same-origin)
    if (!origin) return callback(null, true);
    if (
      ALLOWED_ORIGINS.includes(origin) ||
      /^http:\/\/(localhost|127\.0\.0\.1|192\.168\.\d+\.\d+)(:\d+)?$/.test(origin)
    ) {
      return callback(null, true);
    }
    // Allow all in dev mode for flexibility
    return callback(null, true);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

const app = express();
app.use(cors(corsOptions));
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "online", service: "Coding Battle Arena API", dbState: mongoose.connection.readyState });
});

app.use("/api/auth", authRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/problems", problemsRoutes);
app.use("/api/levels", levelsRoutes);
app.use("/api/daily-game", dailyGameRoutes);

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: true, methods: ["GET", "POST"], credentials: true }
});

attachIoRefForTimers(io);

// Attach the authenticated user (if any) to the socket before handlers run.
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth?.token;
    const user = token ? await getUserByToken(token) : null;
    socket.data.user = user ? publicUser(user) : null;
    next();
  } catch (err) {
    socket.data.user = null;
    next();
  }
});

io.on("connection", (socket) => {
  console.log(`⚡ Player connected: ${socket.id} (${socket.data.user?.username || "guest"})`);
  registerMatchHandlers(io, socket);

  socket.on("disconnect", () => {
    console.log(`👋 Player disconnected: ${socket.id}`);
  });
});

let serverStarted = false;
const startServer = () => {
  if (serverStarted) return;
  serverStarted = true;
  httpServer.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.error(`❌ Error: Port ${PORT} is already in use by another process.`);
      console.error(`👉 Stop the existing process running on port ${PORT} and try again.`);
      process.exit(1);
    } else {
      console.error("❌ Server error:", err);
    }
  });
  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`   Socket.io ready for real-time 1v1 duels`);
  });
};

try {
  await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
  const dbName = mongoose.connection.db ? mongoose.connection.db.databaseName : "coding_battle_arena";
  console.log("✅ MongoDB connected");
  console.log(`📦 Database: ${dbName}`);
  await seedInitialUsers();
  startServer();
} catch (error) {
  console.error("❌ MongoDB connection failed:", error.message || error);
  process.exit(1);
}
