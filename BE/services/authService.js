const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { findUserByEmail, saveRefreshToken, saveResetPasswordCode, updatePassword } = require('../repositories/userRepository');
const { sendOTPEmail } = require('./otpMailService');
require('dotenv').config();

const login = async (email, password) => {
  const user = await findUserByEmail(email);
  if (!user) {
    throw { status: 404, message: 'Email không tồn tại' };
  }

  if (user.status !== 'active') {
    throw { status: 403, message: 'Tài khoản chưa được kích hoạt' };
  }

  if (!user.isEmailVerified) {
    throw { status: 403, message: 'Email chưa được xác minh' };
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw { status: 401, message: 'Mật khẩu không đúng' };
  }

  const accessToken = jwt.sign(
    { id: user._id, role: user.role },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN }
  );

  const refreshToken = jwt.sign(
    { id: user._id, role: user.role },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN }
  );

  await saveRefreshToken(user, refreshToken);

  return {
    accessToken,
    refreshToken,
    user: {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role
    }
  };
};

const forgotPassword = async (email) => {
  const user = await findUserByEmail(email);
  if (!user) {
    throw { status: 404, message: 'Email không tồn tại' };
  }

  // Generate and send reset code with forgot-password template
  const expiryMinutes = 10;
  const { success, otp, expiryTime, messageId } = await sendOTPEmail(email, user.name, 6, expiryMinutes, 'forgot-password');
  if (!success) {
    throw { status: 500, message: 'Không thể gửi mã đặt lại, vui lòng thử lại' };
  }

  // Save reset code and expiry
  await saveResetPasswordCode(user, otp, expiryTime);
  return { message: 'Mã đặt lại mật khẩu đã được gửi qua email. Vui lòng kiểm tra hộp thư.', messageId };
};

const resetPassword = async (email, resetCode, newPassword) => {
  const user = await findUserByEmail(email);
  if (!user) {
    throw { status: 404, message: 'Email không tồn tại' };
  }

  // Validate reset code
  if (!user.resetPasswordCode || !user.resetPasswordExpires) {
    throw { status: 400, message: 'Mã đặt lại chưa được tạo' };
  }
  if (user.resetPasswordCode !== resetCode) {
    throw { status: 400, message: 'Mã đặt lại không đúng' };
  }
  if (user.resetPasswordExpires < new Date()) {
    throw { status: 400, message: 'Mã đặt lại đã hết hạn' };
  }

  // Hash new password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  // Update password and clear reset fields
  await updatePassword(user, hashedPassword);
  return { message: 'Đặt lại mật khẩu thành công! Vui lòng đăng nhập với mật khẩu mới.' };
};

module.exports = {
  login,
  forgotPassword,
  resetPassword
};