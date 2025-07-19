import React from "react";
import RegisterBusinessUserForm from "../../components/BusinessUser/RegisterBusinessUserForm";
import "./Login.scss";
import axios from "axios";

const RegisterPage = () => {
  const handleRegister = async (formData) => {
    console.log("Đang gửi registerData:", formData);
    // Xử lý đăng ký với form mới
    try {
      const res = await axios.post(
        "http://localhost:9999/api/auth/register",
        formData,
        {
          withCredentials: true,
        }
      );
      alert("Đăng ký thành công!");
      // Có thể chuyển hướng sang trang đăng nhập hoặc trang chính
    } catch (err) {
      alert(err.response?.data?.message || "Đăng ký thất bại");
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="form-container">
          <div className="login-form-wrapper">
            <RegisterBusinessUserForm onSubmit={handleRegister} mode="signup" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
