const { registerBusinessUserService } = require('../services/businessUserService');

const registerBusinessUser = async (req, res) => {
  try {
    const result = await registerBusinessUserService(req.body, req.file);
    return res.status(201).json(result);
  } catch (error) {
    console.error('Business User Registration error:', error.message);
    return res.status(500).json({ success: false, message: 'Lỗi server, vui lòng đăng ký lại sau' });
  }
};

module.exports = { registerBusinessUser };