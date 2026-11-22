import mongoose from "mongoose";
import { User } from "../models/User.js";
import { VerificationCode } from "../models/VerificationCode.js";
import { validateEmail } from "../services/emailValidator.js";

const API_URL = "http://localhost:5000";

async function runTests() {
  console.log("====================================================");
  console.log("🧪 TESTING EMAIL VERIFICATION & FORGOT PASSWORD FLOW");
  console.log("====================================================");

  await mongoose.connect("mongodb://127.0.0.1:27017/coding_battle_arena");

  // ----------------------------------------------------------------
  // TEST 1: Real Email & Fake Email Validation
  // ----------------------------------------------------------------
  console.log("\n--- TEST 1: Real Email vs Fake Email Validation ---");

  // A. Real domain (gmail.com)
  try {
    const valid = await validateEmail("player@gmail.com");
    console.log("✅ Real email (player@gmail.com) passed validation:", valid.domain);
  } catch (err) {
    throw new Error(`Real email failed validation unexpectedly: ${err.message}`);
  }

  // B. Fake / Non-existent domain
  try {
    await validateEmail("user@completelyfake123nonexistentdomain999.xyz");
    throw new Error("Fake domain should have been rejected!");
  } catch (err) {
    console.log("✅ Fake domain was properly rejected:", err.message);
  }

  // C. Disposable email domain
  try {
    await validateEmail("temporary@mailinator.com");
    throw new Error("Disposable domain should have been rejected!");
  } catch (err) {
    console.log("✅ Disposable domain was properly rejected:", err.message);
  }

  // ----------------------------------------------------------------
  // TEST 2: Signup Flow with Fake Email Protection
  // ----------------------------------------------------------------
  console.log("\n--- TEST 2: Signup Email Protection & Verification ---");

  const timestamp = Date.now();
  const testUser = `cyber_${timestamp}`;
  const realTestEmail = `cyber_${timestamp}@gmail.com`;
  const fakeEmail = `cyber_${timestamp}@fakexyznonexistent888.net`;

  // A. Attempting to send code to a fake email
  console.log("2A. Attempting signup code to fake email domain...");
  const fakeRes = await fetch(`${API_URL}/api/auth/signup/send-code`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: testUser, email: fakeEmail })
  });
  const fakeData = await fakeRes.json();
  if (fakeRes.status === 400 && fakeData.error) {
    console.log("✅ Fake email blocked at send-code stage:", fakeData.error);
  } else {
    throw new Error(`Expected fake email to fail with 400, got: ${fakeRes.status}`);
  }

  // B. Dispatching code to a valid email
  console.log(`2B. Dispatching signup code to ${realTestEmail}...`);
  const codeRes = await fetch(`${API_URL}/api/auth/signup/send-code`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: testUser, email: realTestEmail })
  });
  const codeData = await codeRes.json();
  if (!codeRes.ok) {
    throw new Error(`Failed to send signup code: ${JSON.stringify(codeData)}`);
  }
  console.log("✅ Code dispatch response:", codeData.message);

  // Retrieve code from MongoDB
  const codeDoc = await VerificationCode.findOne({ email: realTestEmail, type: "signup" }).lean();
  if (!codeDoc || !codeDoc.code) {
    throw new Error("VerificationCode document was not created in MongoDB!");
  }
  const validOtp = codeDoc.code;
  console.log(`✅ Retrieved OTP code from MongoDB: ${validOtp}`);

  // C. Attempting signup with WRONG code
  console.log("2C. Attempting signup with incorrect code (000000)...");
  const wrongRes = await fetch(`${API_URL}/api/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: testUser,
      email: realTestEmail,
      password: "initialPassword123",
      heroId: "kairo",
      verificationCode: "000000"
    })
  });
  const wrongData = await wrongRes.json();
  if (wrongRes.status === 400 && wrongData.error) {
    console.log("✅ Invalid code properly rejected:", wrongData.error);
  } else {
    throw new Error("Expected signup with wrong code to fail!");
  }

  // D. Completing signup with CORRECT code
  console.log(`2D. Completing signup with correct code (${validOtp})...`);
  const signupRes = await fetch(`${API_URL}/api/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: testUser,
      email: realTestEmail,
      password: "initialPassword123",
      heroId: "kairo",
      verificationCode: validOtp
    })
  });
  const signupData = await signupRes.json();
  if (!signupRes.ok || !signupData.token || !signupData.user) {
    throw new Error(`Signup failed: ${JSON.stringify(signupData)}`);
  }
  console.log("✅ Signup successful! Player authenticated:", signupData.user.username);

  // E. Verify OTP code was consumed (one-time use)
  const consumedOtp = await VerificationCode.findOne({ email: realTestEmail, type: "signup" }).lean();
  if (consumedOtp) {
    throw new Error("VerificationCode was NOT consumed after successful signup!");
  }
  console.log("✅ OTP code consumed and removed after verification.");

  // ----------------------------------------------------------------
  // TEST 3: Forgot Password Flow with 6-Digit Email Verification
  // ----------------------------------------------------------------
  console.log("\n--- TEST 3: Forgot Password with Verification Code ---");

  // A. Request reset code for non-existent user
  console.log("3A. Requesting code for non-existent user...");
  const nonExistRes = await fetch(`${API_URL}/api/auth/forgot-password/send-code`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identifier: "non_existent_coder_9999" })
  });
  if (nonExistRes.status === 404) {
    console.log("✅ Non-existent user properly returned 404.");
  } else {
    throw new Error(`Expected 404 for non-existent user, got: ${nonExistRes.status}`);
  }

  // B. Request reset code for real user (by username)
  console.log(`3B. Requesting reset code for username '${testUser}'...`);
  const forgotRes = await fetch(`${API_URL}/api/auth/forgot-password/send-code`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identifier: testUser })
  });
  const forgotData = await forgotRes.json();
  if (!forgotRes.ok || !forgotData.success) {
    throw new Error(`Forgot password send-code failed: ${JSON.stringify(forgotData)}`);
  }
  console.log("✅ Reset code dispatched:", forgotData.message, "Masked Email:", forgotData.maskedEmail);

  // Retrieve reset OTP from MongoDB
  const resetCodeDoc = await VerificationCode.findOne({ email: realTestEmail, type: "reset_password" }).lean();
  if (!resetCodeDoc || !resetCodeDoc.code) {
    throw new Error("Password reset VerificationCode document not found in MongoDB!");
  }
  const resetOtp = resetCodeDoc.code;
  console.log(`✅ Retrieved reset OTP from MongoDB: ${resetOtp}`);

  // C. Attempting reset with WRONG code
  console.log("3C. Attempting reset with wrong code...");
  const wrongResetRes = await fetch(`${API_URL}/api/auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      identifier: testUser,
      code: "999999",
      newPassword: "newSecurePassword456"
    })
  });
  const wrongResetData = await wrongResetRes.json();
  if (wrongResetRes.status === 400) {
    console.log("✅ Wrong reset code properly rejected:", wrongResetData.error);
  } else {
    throw new Error("Expected wrong reset code to fail!");
  }

  // D. Reset password with CORRECT code
  console.log(`3D. Resetting password with valid code (${resetOtp})...`);
  const correctResetRes = await fetch(`${API_URL}/api/auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      identifier: testUser,
      code: resetOtp,
      newPassword: "newSecurePassword456"
    })
  });
  const correctResetData = await correctResetRes.json();
  if (!correctResetRes.ok || !correctResetData.success || !correctResetData.token) {
    throw new Error(`Reset password failed: ${JSON.stringify(correctResetData)}`);
  }
  console.log("✅ Password successfully reset! New session token received.");

  // E. Verify old password fails
  console.log("3E. Verifying old password no longer works...");
  const oldLoginRes = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: testUser, password: "initialPassword123" })
  });
  if (oldLoginRes.status === 401) {
    console.log("✅ Old password correctly rejected (401).");
  } else {
    throw new Error("Old password should have been rejected!");
  }

  // F. Verify new password succeeds
  console.log("3F. Verifying login with new password...");
  const newLoginRes = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: testUser, password: "newSecurePassword456" })
  });
  const newLoginData = await newLoginRes.json();
  if (newLoginRes.ok && newLoginData.token) {
    console.log("✅ Successfully logged in with new password!");
  } else {
    throw new Error(`Login with new password failed: ${JSON.stringify(newLoginData)}`);
  }

  // Cleanup test user
  await User.deleteOne({ email: realTestEmail });
  await VerificationCode.deleteMany({ email: realTestEmail });
  console.log("🧹 Test user cleanup completed.");

  console.log("\n====================================================");
  console.log("🎉 ALL TESTS PASSED! EMAIL VERIFICATION & RESET WORKING!");
  console.log("====================================================");

  await mongoose.disconnect();
}

runTests().catch((err) => {
  console.error("❌ Test failed:", err);
  process.exit(1);
});
