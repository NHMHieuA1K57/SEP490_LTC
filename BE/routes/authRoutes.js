const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { registerValidation,
     verifyEmailValidation, 
     loginValidation, 
     forgotPasswordValidation, 
     resetPasswordValidation } = require('../validations/authValidation');
console.log('authRoutes loaded');
// Đăng ký tài khoản
router.post('/register', registerValidation, authController.register);
// Xác minh OTP
router.post('/verify-otp', verifyEmailValidation, authController.verifyOtp);
// Đăng nhập
router.post('/login', loginValidation ,authController.login);
// Quên mật khẩu
router.post('/forgot-password', forgotPasswordValidation, authController.forgotPassword);
// Đặt lại mật khẩu
router.post('/reset-password', resetPasswordValidation, authController.resetPassword);
module.exports = router;