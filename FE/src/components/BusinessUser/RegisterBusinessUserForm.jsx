import React, { useState } from 'react';
import './RegisterBusinessUserForm.css';

export default function RegisterBusinessUserForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'hotel_owner',
    taxId: '',
    file: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'file') {
      setFormData({ ...formData, file: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = new FormData();
    for (const key in formData) {
      if (formData[key]) data.append(key, formData[key]);
    }

    onSubmit(data);
  };

  return (
    <form className="business-form" onSubmit={handleSubmit}>
      <h2>Đăng ký tài khoản doanh nghiệp</h2>

      <label>Email</label>
      <input type="email" name="email" required onChange={handleChange} />

      <label>Mật khẩu</label>
      <input type="password" name="password" required onChange={handleChange} />

      <label>Vai trò</label>
      <select name="role" onChange={handleChange}>
        <option value="hotel_owner">Chủ khách sạn</option>
        <option value="tour_provider">Nhà cung cấp tour</option>
      </select>

      <label>Mã số thuế (hoặc upload giấy phép)</label>
      <input type="text" name="taxId" onChange={handleChange} />

      <label>Hình ảnh giấy phép kinh doanh</label>
      <input type="file" name="file" accept="image/*" onChange={handleChange} />

      <button type="submit">Đăng ký</button>
    </form>
  );
}
