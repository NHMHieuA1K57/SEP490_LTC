const otpStore = new Map();

function saveOTP(key, otp, expiresInMinutes = 10) {
  const expiresAt = Date.now() + expiresInMinutes * 60 * 1000;
  otpStore.set(key, { otp, expiresAt });
  console.log(
    `OTP saved for ${key}: ${otp} (expires at ${new Date(
      expiresAt
    ).toLocaleString()})`
  );
}

function verifyOTP(key, otp) {
  console.log(`Verifying OTP for ${key}: submitted=${otp}`);
  const record = otpStore.get(key);
  if (!record) {
    console.log(`No OTP record found for ${key}`);
    return { valid: false, reason: "OTP không tồn tại hoặc đã được sử dụng" };
  }

  console.log(
    `OTP record found: stored=${record.otp}, expires=${new Date(
      record.expiresAt
    ).toLocaleString()}`
  );

  if (Date.now() > record.expiresAt) {
    console.log(`OTP expired for ${key}`);
    otpStore.delete(key);
    return { valid: false, reason: "OTP đã hết hạn" };
  }

  if (record.otp !== otp) {
    console.log(`OTP mismatch for ${key}: expected=${record.otp}, got=${otp}`);
    return { valid: false, reason: "OTP không đúng" };
  }

  console.log(`OTP verified successfully for ${key}`);
  otpStore.delete(key);
  return { valid: true };
}

module.exports = { saveOTP, verifyOTP };
