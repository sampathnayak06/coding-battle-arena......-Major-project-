import mongoose from "mongoose";

const dailyGameResultSchema = new mongoose.Schema(
  {
    date: { type: String, required: true, index: true }, // "YYYY-MM-DD"
    userId: { type: String, required: true, index: true },
    username: { type: String, required: true },
    heroId: { type: String, default: "naruto" },
    score: { type: Number, required: true, index: -1 },
    accuracy: { type: Number, default: 0 },
    completionTimeMs: { type: Number, default: 0 },
    timestamp: { type: Date, default: Date.now }
  },
  {
    timestamps: true
  }
);

export const DailyGameResult = mongoose.model("DailyGameResult", dailyGameResultSchema);
