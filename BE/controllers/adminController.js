const {
  getPendingBusinessUsersService,
  verifyBusinessUserService,
  checkTaxCodeService
} = require('../services/adminService');



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

const checkTaxCode = async (req, res) => {
  try {
    const { taxCode } = req.query;
    if (!taxCode) {
      return res.status(400).json({ success: false, message: 'Vui lòng cung cấp mã số thuế' });
    }
    const result = await checkTaxCodeService(taxCode);
    if (result.success) {
      return res.status(200).json(result);
    } else {
      return res.status(400).json(result); 
    }
  } catch (error) {
    console.error('Tax code check error:', error.message);
    return res.status(500).json({ success: false, message: 'Lỗi server, vui lòng thử lại sau' });
  }
};

module.exports = { getPendingBusinessUsers, verifyBusinessUser, checkTaxCode };