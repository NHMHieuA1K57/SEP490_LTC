const authService = require("../services/authService");
const { findUserByEmail } = require("../repositories/authRepository");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { sendOTPEmail } = require("../services/otpMailService");
const { saveOTP, verifyOTP } = require("../utils/otpCache");

const register = async (req, res) => {
  try {
    const { email, password, name, role, phone } = req.body;
    const result = await authService.register({
      email,
      password,
      name,
      role,
      phone,
    });
    return res.status(201).json({
      success: true,
      message: result.message,
      userId: result.userId,
      otp: result.otp,
      expiryTime: result.expiryTime,
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || "Lỗi hệ thống",
      error: error.error || error.message,
    });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { email, verificationCode } = req.body;
    const result = await authService.verifyOtp({ email, verificationCode });
    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    console.error("Error in verifyOtp:", error);
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || "Lỗi hệ thống",
      error: error.message,
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
      message: "Đăng nhập thành công",
      data: {
        accessToken: data.accessToken,
        user: data.user,
      },
    });
  } catch (error) {
    console.error("Error in login:", error);
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || "Lỗi hệ thống",
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
      messageId: result.messageId,
      otp: result.otp,
      expiryTime: result.expiryTime,
    });
  } catch (error) {
    console.error("Error in forgotPassword:", error);
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || "Lỗi hệ thống",
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, resetCode, newPassword, expiryTime, otp } = req.body;
    const result = await authService.resetPassword(
      email,
      resetCode,
      newPassword,
      expiryTime,
      otp
    );
    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    console.error("Error in resetPassword:", error);
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || "Lỗi hệ thống",
    });
  }
};

const getProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const profile = await authService.getProfile(userId);

    return res.status(200).json({
      success: true,
      message: "Lấy thông tin hồ sơ thành công",
      data: profile,
    });
  } catch (error) {
    console.error("Error in getProfile:", error);
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || "Lỗi hệ thống",
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const updates = req.body || {};
    const files = req.files || [];

    const updatedProfile = await authService.updateProfile(
      userId,
      updates,
      files
    );

    return res.status(200).json({
      success: true,
      message: "Cập nhật thông tin cá nhân thành công",
      data: updatedProfile,
    });
  } catch (error) {
    console.error("Error in updateProfile:", error);
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || "Lỗi hệ thống",
    });
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie("refreshToken");
    return res
      .status(200)
      .json({ success: true, message: "Đăng xuất thành công" });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({ success: false, message: "Lỗi hệ thống" });
  }
};

const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.body.refreshToken || req.cookies.refreshToken;
    if (!refreshToken) {
      return res
        .status(401)
        .json({ success: false, message: "Refresh token is required" });
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await findUserByEmail(decoded.email);
    if (!user) {
      return res
        .status(403)
        .json({ success: false, message: "Invalid refresh token" });
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

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: parseInt(process.env.REFRESH_TOKEN_EXPIRES_IN) * 1000,
    });

    return res.status(200).json({
      success: true,
      accessToken: newAccessToken,
    });
  } catch (error) {
    console.error("Refresh token error:", error.message);
    return res
      .status(403)
      .json({ success: false, message: "Invalid or expired refresh token" });
  }
};

// Đăng ký bước 1: Gửi OTP về email (chưa tạo user)
const requestOtpRegister = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Vui lòng nhập email" });
    }
    // Kiểm tra email đã tồn tại chưa
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Email đã được sử dụng" });
    }
    const expiryMinutes = 10;
    const { success, otp } = await sendOTPEmail(
      email,
      "Người dùng",
      6,
      expiryMinutes,
      "verify"
    );
    if (!success) {
      return res.status(500).json({
        success: false,
        message: "Không thể gửi OTP, vui lòng thử lại",
      });
    }
    saveOTP(email, otp, expiryMinutes);
    return res
      .status(200)
      .json({ success: true, message: "OTP đã được gửi về email", otp });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: error.message || "Lỗi hệ thống" });
  }
};

// Đăng ký bước 2: Xác thực OTP và tạo tài khoản (không cần password)
const registerWithOtp = async (req, res) => {
  try {
    const { email, otp, name } = req.body;
    if (!email || !otp) {
      return res
        .status(400)
        .json({ success: false, message: "Thiếu email hoặc otp" });
    }
    // Kiểm tra email đã tồn tại chưa
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Email đã được sử dụng" });
    }
    // Xác thực OTP
    const { valid, reason } = verifyOTP(email, otp);
    if (!valid) {
      return res.status(400).json({ success: false, message: reason });
    }
    // Tạo user không cần password
    const user = new (require("../models/User"))({
      email,
      name: name || "",
      role: "customer",
      status: "active",
      isEmailVerified: true,
      createdAt: new Date(),
      profile: { updatedAt: new Date() },
    });
    await user.save();
    return res.status(201).json({
      success: true,
      message: "Đăng ký thành công!",
      userId: user._id,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: error.message || "Lỗi hệ thống" });
  }
};

// Đăng nhập bước 1: Gửi OTP về email (chỉ gửi nếu user đã tồn tại)
const requestOtpLogin = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Vui lòng nhập email" });
    }
    // Kiểm tra user đã tồn tại chưa
    const existingUser = await findUserByEmail(email);
    if (!existingUser) {
      return res
        .status(404)
        .json({ success: false, message: "Email chưa đăng ký tài khoản" });
    }
    const expiryMinutes = 10;
    const { success, otp } = await sendOTPEmail(
      email,
      existingUser.name || "Người dùng",
      6,
      expiryMinutes,
      "login"
    );
    if (!success) {
      return res
        .status(500)
        .json({
          success: false,
          message: "Không thể gửi OTP, vui lòng thử lại",
        });
    }
    saveOTP(email, otp, expiryMinutes);
    return res
      .status(200)
      .json({ success: true, message: "OTP đã được gửi về email", otp });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: error.message || "Lỗi hệ thống" });
  }
};

// Đăng nhập bước 2: Xác thực OTP và trả về user, accessToken (không tạo mới user)
const loginWithOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res
        .status(400)
        .json({ success: false, message: "Thiếu email hoặc otp" });
    }
    // Kiểm tra user đã tồn tại chưa
    const user = await findUserByEmail(email);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Email chưa đăng ký tài khoản" });
    }
    // Xác thực OTP
    const { valid, reason } = verifyOTP(email, otp);
    if (!valid) {
      return res.status(400).json({ success: false, message: reason });
    }
    // Tạo accessToken
    const accessToken = jwt.sign(
      { id: user._id, role: user.role, email: user.email },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN }
    );
    return res.status(200).json({
      success: true,
      message: "Đăng nhập thành công!",
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      accessToken,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: error.message || "Lỗi hệ thống" });
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
  refreshToken,
  requestOtpRegister,
  registerWithOtp,
  requestOtpLogin,
  loginWithOtp,
};
