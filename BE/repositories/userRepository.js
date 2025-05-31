const User = require('../models/User');

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
  findUserByEmail,
  saveRefreshToken,
  saveResetPasswordCode,
  updatePassword
};