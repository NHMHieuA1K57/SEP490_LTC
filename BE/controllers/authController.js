const bcrypt = require('bcryptjs');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { sendOTPEmail } = require('../services/otpMailService');
const authService = require('../services/authService');
const LoyaltyPoints = require('../models/LoyaltyPoints');
const { findUserByEmail, saveRefreshToken } = require('../repositories/userRepository');
require('dotenv').config();

const register = async (req, res) => {
  try {
    const { email, password, name, role, phone } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email đã được sử dụng'
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      email,
      password: hashedPassword,
      name,
      role: role || 'customer',
      phone,
      status: 'pending',
      isEmailVerified: false
    });
    await user.save();

    if (user.role === 'customer') {
      const loyaltyPoints = new LoyaltyPoints({
        userId: user._id,
        points: 0,
        history: []
      });
      await loyaltyPoints.save();
    }

    // send OTP email
    const expiryMinutes = 10;
    const { success, otp, expiryTime } = await sendOTPEmail(email, name, 6, expiryMinutes, 'verify');
    if (!success) {
      return res.status(500).json({
        success: false,
        message: 'Không thể gửi OTP, vui lòng thử lại',
        error: 'Email sending failed'
      });
    }

    // Cập nhật user với mã OTP và thời gian hết hạn
    user.emailVerificationCode = otp;
    user.emailVerificationExpires = expiryTime;
    await user.save();

    return res.status(201).json({
      success: true,
      message: 'Đăng ký thành công! Vui lòng kiểm tra email để nhận OTP xác thực.',
      userId: user._id
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error',
      error: error.message
    });
  }
};

// check OTP
const validateOtp = (user, verificationCode) => {
  if (!user.emailVerificationCode || !user.emailVerificationExpires) {
    return { valid: false, message: 'Mã OTP chưa được tạo' };
  }
  if (user.emailVerificationCode !== verificationCode) {
    return { valid: false, message: 'Mã OTP không đúng' };
  }
  if (user.emailVerificationExpires < new Date()) {
    return { valid: false, message: 'Mã OTP đã hết hạn' };
  }
  return { valid: true };
};

const verifyOtp = async (req, res) => {
  try {
    // console.log('Verify OTP request body:', req.body);
    const { email, verificationCode } = req.body;

    // Tìm user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Người dùng không tồn tại'
      });
    }

    const { valid, message } = validateOtp(user, verificationCode);
    if (!valid) {
      return res.status(400).json({
        success: false,
        message
      });
    }

    user.status = 'active';
    user.isEmailVerified = true;
    user.emailVerificationCode = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Xác minh OTP thành công! Tài khoản đã được kích hoạt.'
    });
  } catch (error) {
    console.error('Error in verifyOtp:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi hệ thống',
      error: error.message
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const data = await authService.login(email, password);

    data.setCookie(res);

    return res.status(200).json({
      success: true,
      message: 'Đăng nhập thành công',
      data: {
        accessToken: data.accessToken,
        user: data.user,
      },
    });
  } catch (error) {
    console.error('Error in login:', error);
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Lỗi hệ thống',
    });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const result = await authService.forgotPassword(email);
    return res.status(200).json({
      success: true,
      message: result.message,
      messageId: result.messageId
    });
  } catch (error) {
    console.error('Error in forgotPassword:', error);
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Lỗi hệ thống'
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, resetCode, newPassword } = req.body;
    const result = await authService.resetPassword(email, resetCode, newPassword);
    return res.status(200).json({
      success: true,
      message: result.message
    });
  } catch (error) {
    console.error('Error in resetPassword:', error);
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Lỗi hệ thống'
    });
  }
};
const getProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const profile = await authService.getProfile(userId);

    return res.status(200).json({
      success: true,
      message: 'Lấy thông tin hồ sơ thành công',
      data: profile
    });
  } catch (error) {
    console.error('Error in getProfile:', error);
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Lỗi hệ thống'
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const updates = req.body;
    const files = req.files;
    const updatedProfile = await authService.updateProfile(userId, updates, files);
    return res.status(200).json({
      success: true,
      message: 'Cập nhật thông tin cá nhân thành công',
      data: updatedProfile
    });
  } catch (error) {
    console.error('Error in updateProfile:', error);
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Lỗi hệ thống'
    });
  }
};

const logout = async (req, res) => {
  try {
    const userId = req.user._id;
    await User.updateOne({ _id: userId }, { refreshToken: null });
    res.clearCookie('refreshToken');
    return res.status(200).json({ success: true, message: 'Đăng xuất thành công' });
  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({ success: false, message: 'Lỗi hệ thống' });
  }
};

const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.body.refreshToken || req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ success: false, message: 'Refresh token is required' });
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await findUserByEmail(decoded.email);
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ success: false, message: 'Invalid refresh token' });
    }

    const newAccessToken = jwt.sign(
      { id: user._id, role: user.role, email: user.email },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN }
    );

    const newRefreshToken = jwt.sign(
      { id: user._id, email: user.email },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN }
    );
    await saveRefreshToken(user, newRefreshToken);

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: parseInt(process.env.REFRESH_TOKEN_EXPIRES_IN) * 1000,
    });

    return res.status(200).json({
      success: true,
      accessToken: newAccessToken,
    });
  } catch (error) {
    console.error('Refresh token error:', error.message);
    return res.status(403).json({ success: false, message: 'Invalid or expired refresh token' });
  }
};

module.exports = {
  register,
  verifyOtp,
  login,
  forgotPassword,
  resetPassword,
  getProfile,
  updateProfile,
  logout,
  refreshToken
};