import fs from "fs";
import path from "path";

function testQrConfig() {
  console.log("🔍 Checking QR Code Configuration & Environment Setup...");

  // 1. Check game-logo.svg asset
  const logoPath = path.resolve("public/game-logo.svg");
  if (fs.existsSync(logoPath)) {
    console.log("✅ Game Logo SVG verified at public/game-logo.svg");
  } else {
    console.error("❌ Game Logo SVG missing!");
  }

  // 2. Check .env and .env.production files
  const envPath = path.resolve(".env");
  const envProdPath = path.resolve(".env.production");

  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, "utf-8");
    console.log(`✅ .env verified: ${content.trim()}`);
  } else {
    console.error("❌ .env missing!");
  }

  if (fs.existsSync(envProdPath)) {
    const content = fs.readFileSync(envProdPath, "utf-8");
    console.log(`✅ .env.production verified:\n${content.trim()}`);
  } else {
    console.error("❌ .env.production missing!");
  }

  console.log("🎉 QR Configuration Verification Completed!");
}

testQrConfig();
