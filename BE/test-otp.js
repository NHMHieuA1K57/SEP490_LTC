const { saveOTP, verifyOTP } = require("./utils/otpCache");

// Test OTP functionality
console.log("Testing OTP functionality...");

const testEmail = "test@example.com";
const testOTP = "123456";

// Save OTP
console.log("Saving OTP...");
saveOTP(testEmail, testOTP, 10);

// Verify OTP
console.log("Verifying OTP...");
const result = verifyOTP(testEmail, testOTP);
console.log("Verification result:", result);

// Test with wrong OTP
console.log("Testing with wrong OTP...");
const wrongResult = verifyOTP(testEmail, "654321");
console.log("Wrong OTP result:", wrongResult);

// Test with non-existent email
console.log("Testing with non-existent email...");
const nonExistentResult = verifyOTP("nonexistent@example.com", "123456");
console.log("Non-existent email result:", nonExistentResult);

console.log("OTP test completed!");
