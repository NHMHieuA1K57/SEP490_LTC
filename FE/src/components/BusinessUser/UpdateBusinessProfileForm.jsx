import React, { useState } from 'react';
import './UpdateBusinessProfileForm.css';

export default function UpdateBusinessProfileForm({ onSubmit }) {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    website: '',
    address: '',
    dateOfBirth: '',
    bankDetails: {
      accountNumber: '',
      bankName: '',
      branch: ''
    },
    avatar: null
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'avatar') {
      setForm({ ...form, avatar: files[0] });
    } else if (name.startsWith('bank_')) {
      const bankField = name.split('bank_')[1];
      setForm({
        ...form,
        bankDetails: { ...form.bankDetails, [bankField]: value }
      });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();

    for (const key in form) {
      if (key === 'bankDetails') {
        for (const bankKey in form.bankDetails) {
          data.append(`bankDetails.${bankKey}`, form.bankDetails[bankKey]);
        }
      } else {
        if (form[key]) data.append(key, form[key]);
      }
    }

    if (form.avatar) {
      data.append('files', form.avatar);
    }

    onSubmit(data);
  };

  return (
    <form className="profile-form" onSubmit={handleSubmit}>
      <h2>Cập nhật hồ sơ doanh nghiệp</h2>

      <label>Tên công ty</label>
      <input name="name" onChange={handleChange} />

      <label>Số điện thoại</label>
      <input name="phone" onChange={handleChange} />

      <label>Website</label>
      <input name="website" onChange={handleChange} />

      <label>Địa chỉ</label>
      <input name="address" onChange={handleChange} />

      <label>Ngày sinh</label>
      <input name="dateOfBirth" type="date" onChange={handleChange} />

      <label>Số tài khoản</label>
      <input name="bank_accountNumber" onChange={handleChange} />

      <label>Tên ngân hàng</label>
      <input name="bank_bankName" onChange={handleChange} />

      <label>Chi nhánh</label>
      <input name="bank_branch" onChange={handleChange} />

      <label>Ảnh đại diện</label>
      <input type="file" name="avatar" accept="image/*" onChange={handleChange} />

      <button type="submit">Cập nhật hồ sơ</button>
    </form>
  );
}
