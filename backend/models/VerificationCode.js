import mongoose from "mongoose";

const verificationCodeSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true
    },
    code: {
      type: String,
      required: true,
      trim: true
    },
    type: {
      type: String,
      enum: ["reset_password", "signup"],
      required: true
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 } // MongoDB TTL: document is automatically deleted upon expiration
    }
  },
  {
    timestamps: true
  }
);

// Compound index for fast lookup
verificationCodeSchema.index({ email: 1, type: 1 });

export const VerificationCode = mongoose.model("VerificationCode", verificationCodeSchema);
