import mongoose from "mongoose";
import { User } from "../models/User.js";

const API_URL = "http://localhost:5000";

async function testAuthFlow() {
  console.log("==========================================");
  console.log("TESTING AUTHENTICATION & MONGODB INTEGRATION");
  console.log("==========================================");

  // 1. Healthcheck backend & DB connection state
  const healthRes = await fetch(`${API_URL}/api/health`);
  const health = await healthRes.json();
  console.log("1. Backend Healthcheck:", health);
  if (health.status !== "online" || health.dbState !== 1) {
    throw new Error("Backend or MongoDB is not healthy!");
  }

  // Connect Mongoose directly to inspect MongoDB
  await mongoose.connect("mongodb://127.0.0.1:27017/coding_battle_arena");
  console.log("2. Direct MongoDB connection established.");

  // 2. Test Sign Up
  const timestamp = Date.now();
  const testUsername = `cyber_coder_${timestamp}`;
  const testEmail = `cyber_${timestamp}@arena.dev`;
  const testPassword = "securepass123";

  console.log(`3. Sending Signup request for ${testUsername} (${testEmail})...`);
  const signupRes = await fetch(`${API_URL}/api/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: testUsername,
      email: testEmail,
      password: testPassword,
      heroId: "kairo"
    })
  });

  const signupData = await signupRes.json();
  console.log("   Signup Status:", signupRes.status);
  console.log("   Signup Response:", signupData);

  if (!signupRes.ok || !signupData.token || !signupData.user) {
    throw new Error(`Signup failed: ${JSON.stringify(signupData)}`);
  }

  // 3. Verify user in MongoDB database directly
  const savedUser = await User.findOne({ email: testEmail }).lean();
  console.log("4. MongoDB Document Lookup Result:");
  console.log("   ID:", savedUser?.id);
  console.log("   Username:", savedUser?.username);
  console.log("   Email:", savedUser?.email);
  console.log("   Elo:", savedUser?.elo);

  if (!savedUser) {
    throw new Error("User was NOT saved to MongoDB!");
  }
  console.log("✅ Sign Up MongoDB Persistence: VERIFIED!");

  // 4. Test Login
  console.log(`5. Testing Login with username '${testUsername}'...`);
  const loginRes = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: testUsername,
      password: testPassword
    })
  });

  const loginData = await loginRes.json();
  console.log("   Login Status:", loginRes.status);
  console.log("   Login Response:", loginData);

  if (!loginRes.ok || !loginData.token) {
    throw new Error(`Login failed: ${JSON.stringify(loginData)}`);
  }
  console.log("✅ Login Retrieval: VERIFIED!");

  // 5. Test Authenticated Session / GET /api/auth/me
  console.log("6. Verifying Authenticated Session (/api/auth/me)...");
  const meRes = await fetch(`${API_URL}/api/auth/me`, {
    headers: {
      Authorization: `Bearer ${loginData.token}`
    }
  });

  const meData = await meRes.json();
  console.log("   /api/auth/me Status:", meRes.status);
  console.log("   User Data:", meData.user?.username, "ID:", meData.user?.id);

  if (!meRes.ok || meData.user?.username !== testUsername) {
    throw new Error("Session authentication failed!");
  }
  console.log("✅ Session Authentication: VERIFIED!");

  console.log("==========================================");
  console.log("🎉 ALL AUTHENTICATION TESTS PASSED SUCCESSFULLY!");
  console.log("==========================================");

  await mongoose.disconnect();
}

testAuthFlow().catch((err) => {
  console.error("❌ Auth test failed:", err);
  process.exit(1);
});
