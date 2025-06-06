const { getPendingBusinessUsersService, verifyBusinessUserService } = require('../services/adminService');



const getPendingBusinessUsers = async (req, res) => {
  try {
    const result = await getPendingBusinessUsersService();
    return res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching pending users:', error.message);
    return res.status(500).json({ success: false, message: 'Lỗi server, vui lòng thử lại sau' });
  }
};

const verifyBusinessUser = async (req, res) => {
  try {
    const result = await verifyBusinessUserService(req.body);
    return res.status(200).json(result);
  } catch (error) {
    console.error('Verification error:', error.message);
    return res.status(500).json({ success: false, message: 'Lỗi server, vui lòng thử lại sau' });
  }
};

module.exports = { getPendingBusinessUsers, verifyBusinessUser };