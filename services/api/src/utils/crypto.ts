import { createHmac } from "crypto";

/**
 * Hashes Aadhaar using HMAC-SHA256 with a secret key.
 * This prevents rainbow table attacks on the 12-digit number.
 */
export function hashAadhaar(aadhaar: string): string {
  const secret = process.env.AADHAAR_HMAC_SECRET;
  if (!secret) {
    throw new Error("AADHAAR_HMAC_SECRET environment variable is not set");
  }
  return createHmac("sha256", secret)
    .update(aadhaar)
    .digest("hex");
}
