import dns from "dns";

// Common temporary / disposable email services to block
const DISPOSABLE_DOMAINS = new Set([
  "mailinator.com",
  "10minutemail.com",
  "tempmail.com",
  "temp-mail.org",
  "guerrillamail.com",
  "throwawaymail.com",
  "sharklasers.com",
  "yopmail.com",
  "dispostable.com",
  "trashmail.com",
  "fake.com",
  "test.com",
  "example.com",
  "getnada.com",
  "maildrop.cc",
  "crazymailing.com",
  "mytemp.email"
]);

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

/**
 * Validates whether an email address is syntactically valid, not disposable,
 * and possesses active DNS MX records capable of receiving mail.
 */
export async function validateEmail(email, { checkMx = true } = {}) {
  if (!email || typeof email !== "string") {
    throw new Error("Email address is required.");
  }

  const clean = email.trim().toLowerCase();

  // 1. Length checks
  if (clean.length < 5 || clean.length > 254) {
    throw new Error("Email address length is invalid.");
  }

  // 2. Syntax validation
  if (!EMAIL_REGEX.test(clean)) {
    throw new Error("Invalid email format. Please provide a valid address (e.g. coder@gmail.com).");
  }

  const [localPart, domain] = clean.split("@");

  if (!localPart || !domain) {
    throw new Error("Invalid email format.");
  }

  // Reject overly generic fake addresses
  if (/^(fake|test|asdf|qwerty|none|dummy|noemail|nobody)\d*$/i.test(localPart) && (domain === "fake.com" || domain === "test.com")) {
    throw new Error("Please provide a real, personal email address.");
  }

  // 3. Block disposable email providers
  if (DISPOSABLE_DOMAINS.has(domain)) {
    throw new Error("Disposable or temporary email services are not allowed. Please use a real email address.");
  }

  // 4. DNS MX record check to ensure domain actually exists and accepts emails
  // Allow @arena.dev and @localhost in local development / testing
  const isDevOrTest = process.env.NODE_ENV !== "production";
  if (isDevOrTest && (domain.endsWith("arena.dev") || domain === "localhost")) {
    return { valid: true, email: clean, domain };
  }

  if (checkMx) {
    try {
      const records = await dns.promises.resolveMx(domain);
      if (!records || records.length === 0) {
        throw new Error(`The domain '@${domain}' does not have any active mail servers to receive emails.`);
      }
    } catch (err) {
      if (err.code === "ENOTFOUND" || err.code === "ENODATA") {
        throw new Error(`The domain '@${domain}' does not exist or cannot receive mail. Please use a real email address.`);
      }
      // If network DNS timeout or transient lookup error in dev mode, log and proceed with cautionary check
      console.warn(`[emailValidator] MX resolution warning for ${domain}:`, err.message);
      if (err.code === "SERVFAIL" || err.code === "ETIMEOUT") {
        // DNS lookup timed out, allow if syntax is valid
      } else {
        throw new Error(`Could not verify email domain '@${domain}'. Please check for typos.`);
      }
    }
  }

  return { valid: true, email: clean, domain };
}
