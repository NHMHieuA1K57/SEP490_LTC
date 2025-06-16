const bcrypt = require('bcryptjs');
const UserRepository = require('../repositories/authRepository');
const cloudinary = require('../config/cloudinary');

const registerBusinessUserService = async (data, file) => {
  const { email, password, name, role, phone, taxId } = data;

  const existingUser = await UserRepository.findUserByEmail(email.toLowerCase());
  if (existingUser) {
    throw new Error('Email đã được sử dụng');
  }

  if (!['hotel_owner', 'tour_provider'].includes(role)) {
    throw new Error('Vai trò không hợp lệ, phải là hotel_owner hoặc tour_provider');
  }

  if (!taxId && !file) {
    throw new Error('Phải cung cấp mã số thuế hoặc hình ảnh giấy phép kinh doanh');
  }

  let businessLicenseImage = '';
  if (file) {
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream({ folder: 'business_licenses' }, (error, result) => {
        if (error) reject(new Error('Lỗi khi tải lên hình ảnh giấy phép kinh doanh'));
        resolve(result);
      }).end(file.buffer);
    });
    businessLicenseImage = result.secure_url;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const userData = {
    email: email.toLowerCase(),
    password: hashedPassword,
    name,
    role,
    phone,
    taxId,
    businessLicenseImage,
    businessType: role,
    status: 'pending',
    isBusinessVerified: false,
    isBusinessVerified: false,
    isEmailVerified: ['hotel_owner', 'tour_provider'].includes(role),
    createdAt: new Date() 
  };

  await UserRepository.createUser(userData);
  return { success: true, message: 'Đăng ký thành công, vui lòng chờ admin xét duyệt' };
};

module.exports = { registerBusinessUserService };