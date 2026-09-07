import mongoose from "mongoose";

const matchPlayerSchema = new mongoose.Schema(
  {
    userId: { type: String, index: true },
    username: { type: String, default: "Guest" },
    heroId: { type: String, default: "naruto" },
    isAI: { type: Boolean, default: false },
    questionsCleared: { type: Number, default: 0 },
    totalQuestions: { type: Number, default: 14 },
    accuracy: { type: Number, default: 0 },
    hp: { type: Number, default: 100 },
    won: { type: Boolean, default: false },
    eloDelta: { type: Number, default: 0 },
    coinsEarned: { type: Number, default: 0 },
    xpEarned: { type: Number, default: 0 }
  },
  { _id: false }
);

const matchSchema = new mongoose.Schema(
  {
    matchId: { type: String, required: true, unique: true, index: true },
    mode: { type: String, default: "1v1 Battle Arena" },
    language: { type: String, required: true },
    difficulty: { type: Number, default: 1 },
    levelName: { type: String, default: "Level 1: Novice" },
    players: [matchPlayerSchema],
    winnerId: { type: String, index: true },
    questionsCleared: { type: Number, default: 0 },
    totalQuestions: { type: Number, default: 14 },
    accuracy: { type: Number, default: 0 },
    eloDelta: { type: Number, default: 0 },
    coinsEarned: { type: Number, default: 0 },
    xpEarned: { type: Number, default: 0 },
    timestamp: { type: Date, default: Date.now, index: true }
  },
  {
    timestamps: true
  }
);

export const Match = mongoose.model("Match", matchSchema);
