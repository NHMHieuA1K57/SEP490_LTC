const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { registerValidation,
     verifyEmailValidation, 
     loginValidation, 
     forgotPasswordValidation, 
     resetPasswordValidation } = require('../validations/authValidation');

const{ authMiddleware,roleMiddleware} = require('../middleware/authMiddleware');
const upload = require('../controllers/upload');



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
// profile
router.get('/profile', authMiddleware, roleMiddleware(['customer', 'hotel_owner', 'tour_provider']), authController.getProfile);
router.put('/update-profile', authMiddleware, roleMiddleware(['customer', 'hotel_owner', 'tour_provider']), 
upload.array('avatar', 1),
 authController.updateProfile);
module.exports = router;