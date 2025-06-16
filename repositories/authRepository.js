const User = require('../models/User');
const LoyaltyPoints = require('../models/LoyaltyPoints');

const findUserById = async (userId) => {
  return await User.findById(userId).select('email phone name profile role status isEmailVerified');
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

const findPendingBusinessUsers = async () => {
  return await User.find({
    role: { $in: ['hotel_owner', 'tour_provider'] },
    status: 'pending',
    isBusinessVerified: false
  }).select('email name role taxId businessLicenseImage createdAt').lean();
};

const createUser = async (userData) => {
  const user = new User(userData);
  return await user.save();
};

const updateUser = async (user) => {
  return await User.findByIdAndUpdate(user._id, user, { new: true });
};

const updatePassword = async (userId, hashedPassword) => {
  return await User.findByIdAndUpdate(
    userId,
    { password: hashedPassword },
    { new: true }
  );
};

module.exports = {
  findUserById,
  findLoyaltyPointsByUserId,
  updateUserProfile,
  findUserByEmail,
  findPendingBusinessUsers,
  createUser,
  updateUser,
  updatePassword
};