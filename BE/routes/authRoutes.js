const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const {
  registerValidation,
  verifyEmailValidation,
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
} = require("../validations/authValidation");
const {
  authMiddleware,
  roleMiddleware,
} = require("../middleware/authMiddleware");
const upload = require("../utils/upload");
const {
  requestOtpRegister,
  registerWithOtp,
  requestOtpLogin,
  loginWithOtp,
} = require("../controllers/authController");

router.post("/register", registerValidation, authController.register);
router.post("/verify-otp", verifyEmailValidation, authController.verifyOtp);
router.post("/login", loginValidation, authController.login);
router.post(
  "/forgot-password",
  forgotPasswordValidation,
  authController.forgotPassword
);
router.post(
  "/reset-password",
  resetPasswordValidation,
  authController.resetPassword
);
router.post("/refresh-token", authController.refreshToken);
router.post(
  "/logout",
  authMiddleware,
  roleMiddleware(["customer", "hotel_owner", "tour_provider", "admin"]),
  authController.logout
);
router.post("/request-otp", requestOtpRegister);
router.post("/register-otp", registerWithOtp);
router.post("/request-otp-login", requestOtpLogin);
router.post("/login-otp", loginWithOtp);
router.get(
  "/profile",
  authMiddleware,
  roleMiddleware(["customer", "hotel_owner", "tour_provider"]),
  authController.getProfile
);
router.put(
  "/update-profile",
  authMiddleware,
  roleMiddleware(["customer"]),
  upload.single("avatar"),
  authController.updateProfile
);

module.exports = router;
