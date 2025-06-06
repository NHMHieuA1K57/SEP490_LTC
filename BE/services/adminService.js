const UserRepository = require('../repositories/userRepository');

const getPendingBusinessUsersService = async () => {
  const users = await UserRepository.findPendingBusinessUsers();
  return { success: true, data: users };
};

const verifyBusinessUserService = async (data) => {
  const { userId, approve } = data;

  const user = await UserRepository.findUserById(userId);
  if (!user || !['hotel_owner', 'tour_provider'].includes(user.role)) {
    throw new Error('Người dùng không tồn tại hoặc không phải tài khoản kinh doanh');
  }

  if (approve) {
    user.isBusinessVerified = true;
    user.status = 'active';
  } else {
    user.status = 'banned';
  }

  user.updatedAt = new Date(); // Using current date: June 06, 2025, 06:29 PM +07
  await UserRepository.updateUser(user);
  return { success: true, message: approve ? 'Tài khoản đã được kích hoạt' : 'Tài khoản đã bị từ chối' };
};

module.exports = { getPendingBusinessUsersService, verifyBusinessUserService };