const UserRepository = require('../repositories/authRepository');
const axios = require('axios');

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
    user.status = 'active'; // Kích hoạt tài khoản ngay lập tức
  } else {
    user.status = 'banned';
  }

  user.updatedAt = new Date(); // Current date: June 06, 2025, 09:00 PM +07
  await UserRepository.updateUser(user);
  return { success: true, message: approve ? 'Tài khoản đã được kích hoạt' : 'Tài khoản đã bị từ chối' };
};

const checkTaxCodeService = async (taxCode) => {
  try {
    // const response = await axios.get(`https://api.vietqr.io/v2/business/taxCode?taxCode=${taxCode}`);
     const response = await axios.get(`https://mst-thue.vercel.app/api/mst/${taxCode}`);
    if (response.status === 200 && response.data.success) {
      return { success: true, data: response.data.data };
    } else {
      return { success: false, message: 'Mã số thuế không hợp lệ hoặc không tìm thấy' };
    }
  } catch (error) {
    return { success: false, message: `Lỗi khi kiểm tra mã số thuế: ${error.message}` };
  }
};

module.exports = { getPendingBusinessUsersService, verifyBusinessUserService, checkTaxCodeService };