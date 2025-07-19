import React from "react";
import "./Login.scss";
import axios from "axios";
import RegisterBusinessUserForm from "../../components/BusinessUser/RegisterBusinessUserForm";

const LoginPage = () => {
  const handleLogin = async (formData) => {
    console.log("Đang gửi loginData:", formData);
    // Xử lý đăng nhập với form mới
    try {
      const res = await axios.post(
        "http://localhost:9999/api/auth/login",
        formData,
        {
          withCredentials: true,
        }
      );
      alert("Đăng nhập thành công!");
      console.log("User:", res.data.data.user);
      console.log("AccessToken:", res.data.data.accessToken);
    } catch (err) {
      alert(err.response?.data?.message || "Đăng nhập thất bại");
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="form-container">
          <div className="login-form-wrapper">
            <RegisterBusinessUserForm onSubmit={handleLogin} mode="login" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
