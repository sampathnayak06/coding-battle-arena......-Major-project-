import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    username: { type: String, required: true, unique: true, trim: true, index: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    passwordHash: { type: String, required: true },
    heroId: { type: String, default: "naruto" },
    elo: { type: Number, default: 1000, index: true },
    coins: { type: Number, default: 200 },
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    wins: { type: Number, default: 0 },
    losses: { type: Number, default: 0 },
    winStreak: { type: Number, default: 0 },
    achievements: { type: [String], default: ["First Step"] },
    heroMastery: { type: Map, of: Number, default: {} },
    skills: {
      arrays: { type: Number, default: 60 },
      dynamicProgramming: { type: Number, default: 50 },
      graphs: { type: Number, default: 40 },
      strings: { type: Number, default: 65 },
      trees: { type: Number, default: 45 }
    },
    badges: { type: [String], default: ["Newbie Coder"] },
    tokens: { type: [String], default: [] },
    campaignProgress: [
      {
        levelId: { type: Number, required: true },
        completed: { type: Boolean, default: false },
        stars: { type: Number, default: 0 },
        bestScore: { type: Number, default: 0 },
        attempts: { type: Number, default: 0 },
        completedAt: { type: Date },
        languageProgress: {
          type: Map,
          of: new mongoose.Schema(
            {
              completed: { type: Boolean, default: false },
              stars: { type: Number, default: 0 },
              bestScore: { type: Number, default: 0 },
              attempts: { type: Number, default: 0 },
              completedAt: { type: Date }
            },
            { _id: false }
          ),
          default: {}
        }
      }
    ],
    dailyGameProgress: {
      lastCompletedDate: { type: String, default: "" },
      totalCompleted: { type: Number, default: 0 },
      bestScore: { type: Number, default: 0 }
    }
  },
  {
    timestamps: true
  }
);

export const User = mongoose.model("User", userSchema);
