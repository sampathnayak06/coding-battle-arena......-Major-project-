import nodemailer from "nodemailer";

let transporter = null;

export function isGmailConfigured() {
  const user = process.env.GMAIL_USER || process.env.EMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD || process.env.EMAIL_PASS;
  return Boolean(user && pass && !user.includes("your_email") && !pass.includes("your_16_character"));
}

function getTransporter() {
  if (transporter) return transporter;

  const user = process.env.GMAIL_USER || process.env.EMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD || process.env.EMAIL_PASS;

  if (isGmailConfigured()) {
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: user.trim(),
        pass: pass.trim()
      }
    });
  }

  return transporter;
}

/**
 * Generate a Cyberpunk-themed HTML email template.
 */
function generateEmailHtml({ title, preheader, username, code, actionText, expiryMinutes = 10 }) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #050811; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #e2e8f0;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #050811; padding: 40px 10px;">
    <tr>
      <td align="center">
        <!-- Main Card Container -->
        <table role="presentation" width="100%" style="max-width: 560px; background: linear-gradient(180deg, #0f172a 0%, #090d16 100%); border: 1px solid rgba(0, 229, 255, 0.3); border-radius: 16px; overflow: hidden; box-shadow: 0 10px 40px rgba(0, 229, 255, 0.15);">
          
          <!-- Top Cyberpunk Accent Bar -->
          <tr>
            <td style="height: 4px; background: linear-gradient(90deg, #00e5ff, #7928ca, #ff007a);"></td>
          </tr>

          <!-- Header / Brand -->
          <tr>
            <td style="padding: 32px 36px 20px 36px; text-align: center;">
              <div style="font-size: 32px; line-height: 1; margin-bottom: 8px;">⚔️</div>
              <h1 style="margin: 0; font-size: 20px; font-weight: 800; letter-spacing: 0.15em; color: #00e5ff; text-transform: uppercase;">
                Coding Battle Arena
              </h1>
              <p style="margin: 4px 0 0 0; font-size: 12px; color: #94a3b8; letter-spacing: 0.05em;">
                COMPETITIVE ESPORTS CODING MATRIX
              </p>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding: 0 36px;">
              <div style="height: 1px; background: rgba(255, 255, 255, 0.08);"></div>
            </td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td style="padding: 28px 36px 36px 36px;">
              <h2 style="margin: 0 0 12px 0; font-size: 18px; font-weight: 700; color: #ffffff;">
                ${title}
              </h2>
              
              <p style="margin: 0 0 20px 0; font-size: 14px; line-height: 1.6; color: #cbd5e1;">
                ${username ? `Greetings, <strong style="color: #00e5ff;">${username}</strong>.` : "Greetings, Coder."}
                ${preheader}
              </p>

              <!-- Verification Code Box -->
              <div style="margin: 28px 0; padding: 22px; background: rgba(0, 229, 255, 0.04); border: 1px dashed #00e5ff; border-radius: 12px; text-align: center;">
                <div style="font-size: 11px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: #94a3b8; margin-bottom: 8px;">
                  Your 6-Digit Security Passcode
                </div>
                <div style="font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace; font-size: 38px; font-weight: 900; letter-spacing: 0.25em; color: #00e5ff; text-shadow: 0 0 16px rgba(0, 229, 255, 0.4);">
                  ${code}
                </div>
                <div style="margin-top: 10px; font-size: 12px; color: #f43f5e; font-weight: 600;">
                  ⏱️ Expires in ${expiryMinutes} minutes
                </div>
              </div>

              <p style="margin: 0 0 16px 0; font-size: 13px; line-height: 1.5; color: #94a3b8;">
                ${actionText}
              </p>

              <div style="background: rgba(255, 255, 255, 0.03); border-radius: 8px; padding: 12px 16px; border-left: 3px solid #f59e0b; margin-top: 24px;">
                <p style="margin: 0; font-size: 12px; color: #fbbf24; line-height: 1.4;">
                  <strong>Security Notice:</strong> If you did not request this verification code, please ignore this transmission. Your account credentials remain secure.
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 36px; background-color: #070a12; text-align: center; border-top: 1px solid rgba(255, 255, 255, 0.05);">
              <p style="margin: 0; font-size: 11px; color: #64748b; line-height: 1.5;">
                This automated transmission was dispatched by Google Mail Connection for Coding Battle Arena.<br>
                © 2026 Coding Battle Arena. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

/**
 * Dispatches a verification code email via Google Mail (Gmail SMTP)
 * with a developer console fallback if Gmail credentials are not configured.
 */
export async function sendVerificationCodeEmail({ to, code, type, username = "" }) {
  const isReset = type === "reset_password";
  const title = isReset ? "Password Reset Verification Code" : "Account Email Verification Code";
  const subject = isReset
    ? `🔑 [Coding Battle Arena] ${code} is your Password Reset Code`
    : `⚔️ [Coding Battle Arena] ${code} is your Email Verification Code`;

  const preheader = isReset
    ? "A password reset request was initiated for your Coding Battle Arena account. Use the one-time verification passcode below to authorize this change."
    : "Welcome to Coding Battle Arena! Please verify that this real email address belongs to you to complete your combat account activation.";

  const actionText = isReset
    ? "Enter this verification code into the password reset screen along with your new password to restore access to the arena."
    : "Enter this verification code into the registration screen to confirm your identity and launch into the battle arena.";

  const html = generateEmailHtml({
    title,
    preheader,
    username,
    code,
    actionText,
    expiryMinutes: 10
  });

  const text = `
⚔️ CODING BATTLE ARENA - SECURITY TRANSMISSION

${title.toUpperCase()}
Greetings ${username || "Coder"},

${preheader}

YOUR 6-DIGIT VERIFICATION CODE: ${code}
(Expires in 10 minutes)

${actionText}

If you did not make this request, please disregard this email.
© 2026 Coding Battle Arena
  `.trim();

  const mailUser = process.env.GMAIL_USER || process.env.EMAIL_USER;

  if (isGmailConfigured()) {
    try {
      const activeTransporter = getTransporter();
      const info = await activeTransporter.sendMail({
        from: `"Coding Battle Arena" <${mailUser}>`,
        to,
        subject,
        text,
        html
      });
      console.log(`✅ [Google Mail] Verification email delivered to ${to} (Message ID: ${info.messageId})`);
      return { delivered: true, devMode: false, messageId: info.messageId };
    } catch (err) {
      console.error(`❌ [Google Mail] Failed to deliver email to ${to}:`, err.message || err);
      // Fall through to dev display so development / testing is not completely blocked
      logDevBox({ to, code, type, error: err.message });
      return {
        delivered: false,
        devMode: true,
        code,
        error: `Google Mail delivery failed: ${err.message}`
      };
    }
  } else {
    // Development Mode Fallback
    logDevBox({ to, code, type });
    return {
      delivered: true,
      devMode: true,
      code
    };
  }
}

function logDevBox({ to, code, type, error }) {
  console.log("\n" + "=".repeat(66));
  console.log("📨 [CODING BATTLE ARENA] EMAIL VERIFICATION CODE");
  console.log("=".repeat(66));
  console.log(`  To:            ${to}`);
  console.log(`  Type:          ${type}`);
  console.log(`  Passcode (OTP): \x1b[36m\x1b[1m[ ${code} ]\x1b[0m`);
  console.log(`  Expires:       10 minutes`);
  if (error) {
    console.log(`  ⚠️ Notice:      Gmail SMTP attempted (${error})`);
  } else {
    console.log(`  ℹ️ Google Mail: Not configured. Set GMAIL_USER & GMAIL_APP_PASSWORD in backend/.env`);
  }
  console.log("=".repeat(66) + "\n");
}
