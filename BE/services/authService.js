const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { findUserByEmail, saveRefreshToken, saveResetPasswordCode, 
  updatePassword, findUserById, findLoyaltyPointsByUserId, updateUserProfile } = require('../repositories/userRepository');
const { sendOTPEmail } = require('./otpMailService');
const cloudinary = require('../config/cloudinary');
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
    { id: user._id, role: user.role, email: user.email },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN }
  );

  const refreshToken = jwt.sign(
    { id: user._id, email: user.email },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN }
  );

  await saveRefreshToken(user, refreshToken);

  return {
    accessToken,
    user: {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
    setCookie: (res) => {
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
        maxAge: parseInt(process.env.REFRESH_TOKEN_EXPIRES_IN) * 1000,
      });
    },
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

const getProfile = async (userId) => {
  const user = await findUserById(userId);
  if (!user) {
    throw { status: 404, message: 'Người dùng không tồn tại' };
  }

  const loyaltyPoints = await findLoyaltyPointsByUserId(userId);
  if (!loyaltyPoints && user.role === 'customer') {
    throw { status: 404, message: 'Điểm tích lũy không tồn tại' };
  }

  return {
    email: user.email,
    phone: user.phone,
    name: user.name,
    address: user.profile.address,
    dateOfBirth: user.profile.dateOfBirth,
    avatar: user.profile.avatar,
    loyaltyPoints: loyaltyPoints ? {
      points: loyaltyPoints.points,
      history: loyaltyPoints.history
    } : null
  };
};

const updateProfile = async (userId, updates, files) => {
  const profileUpdates = {};
    if (updates.name) profileUpdates.name = updates.name;
  if (updates.address) profileUpdates['profile.address'] = updates.address;
  if (updates.dateOfBirth) profileUpdates['profile.dateOfBirth'] = updates.dateOfBirth;

  if (files && files.length > 0) {
    const file = files[0];

    try {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: 'SEP490/avatars', 
            resource_type: 'image'
          },
          (error, result) => {
            if (error) {
              console.error('Cloudinary upload error:', error);
              reject(error);
            } else {
              resolve(result);
            }
          }
        );
        stream.end(file.buffer);
      });

      profileUpdates['profile.avatar'] = result.secure_url;

    } catch (error) {
      console.error('Upload error details:', error);
      throw { status: 500, message: 'Lỗi khi upload ảnh lên Cloudinary' };
    }
  }
  profileUpdates['profile.updatedAt'] = new Date();
  const updatedUser = await updateUserProfile(userId, profileUpdates);
  if (!updatedUser) {
    throw { status: 404, message: 'Người dùng không tồn tại' };
  }
  return {
    email: updatedUser.email,
    phone: updatedUser.phone,
    name: updatedUser.name,
    address: updatedUser.profile.address,
    dateOfBirth: updatedUser.profile.dateOfBirth,
    avatar: updatedUser.profile.avatar
  };
};

module.exports = {
  login,
  forgotPassword,
  resetPassword,
  getProfile,
  updateProfile
};