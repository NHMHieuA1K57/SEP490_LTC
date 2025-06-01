const User = require('../models/User');
const LoyaltyPoints = require('../models/LoyaltyPoints');

const findUserById = async (userId) => {
  return await User.findById(userId).select('email phone name profile');
};

const findLoyaltyPointsByUserId = async (userId) => {
  return await LoyaltyPoints.findOne({ userId }).select('points history');
};

const updateUserProfile = async (userId, updates) => {
  return await User.findByIdAndUpdate(
    userId,
    { $set: updates },
    { new: true, runValidators: true }
  ).select('email phone name profile');
};

const findUserByEmail = async (email) => {
  return await User.findOne({ email: email.toLowerCase() });
};

const saveRefreshToken = async (user, refreshToken) => {
  user.refreshToken = refreshToken;
  user.lastLogin = new Date();
  return await user.save();
};

const saveResetPasswordCode = async (user, resetCode, expiryTime) => {
  user.resetPasswordCode = resetCode;
  user.resetPasswordExpires = expiryTime;
  return await user.save();
};

const updatePassword = async (user, hashedPassword) => {
  user.password = hashedPassword;
  user.resetPasswordCode = undefined;
  user.resetPasswordExpires = undefined;
  return await user.save();
};

module.exports = {
  findUserById,
  findLoyaltyPointsByUserId,
  updateUserProfile,
  findUserByEmail,
  saveRefreshToken,
  saveResetPasswordCode,
  updatePassword
};