const crypto = require("crypto");

const OTP_LENGTH = 6;

function generateOtp() {
  const n = crypto.randomInt(0, 10 ** OTP_LENGTH);
  return String(n).padStart(OTP_LENGTH, "0");
}

function hashOtp(otp) {
  return crypto.createHash("sha256").update(String(otp), "utf8").digest("hex");
}

function safeCompareOtpHash(storedHex, plainOtp) {
  const a = Buffer.from(storedHex, "hex");
  const b = Buffer.from(hashOtp(plainOtp), "hex");
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

module.exports = {
  generateOtp,
  hashOtp,
  safeCompareOtpHash,
  OTP_LENGTH,
};
