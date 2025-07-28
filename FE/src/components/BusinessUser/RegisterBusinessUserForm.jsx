import React, { useState } from "react";
import "./RegisterBusinessUserForm.css";
import {
  requestOtpRegister,
  registerWithOtp,
  requestOtpLogin,
  loginWithOtp,
} from "../../server/authAPI";
import OtpVerification from "../OtpVerification/OtpVerification.jsx";
import { useNavigate } from "react-router-dom";

export default function RegisterBusinessUserForm({
  onSubmit,
  mode = "signup",
}) {
  const [email, setEmail] = useState("");
  const [showOtherOptions, setShowOtherOptions] = useState(false);
  const [step, setStep] = useState(1); // 1: nhập email, 2: nhập otp
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const navigate = useNavigate();

  const isLoginMode = mode === "login";

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (email) {
      setLoading(true);
      setMessage("");
      let res;
      try {
        if (isLoginMode) {
          res = await requestOtpLogin(email);
        } else {
          res = await requestOtpRegister(email);
        }

        if (res.success) {
          setShowOtp(true); // chuyển sang OTP component
        } else {
          setMessage(res.message || "Có lỗi xảy ra, vui lòng thử lại");
        }
      } catch (error) {
        console.error("Error in handleEmailSubmit:", error);
        setMessage("Có lỗi xảy ra, vui lòng thử lại");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    if (otp && email) {
      setLoading(true);
      let res;
      if (isLoginMode) {
        res = await loginWithOtp(email, otp);
      } else {
        res = await registerWithOtp(email, otp);
      }
      setLoading(false);
      setMessage(res.message);
      if (res.success) {
        // Lưu accessToken nếu có (kiểm tra cả res.data.accessToken và res.accessToken)
        const token = res.accessToken || (res.data && res.data.accessToken);
        if (token) {
          localStorage.setItem("accessToken", token);
        }
        onSubmit && onSubmit({ email });
      }
    }
  };

  const handleSocialLogin = (provider) => {
    console.log("Đăng nhập bằng:", provider);
    // Xử lý đăng nhập social
    onSubmit({ provider });
  };

  if (showOtp) {
    return (
      <OtpVerification
        email={email}
        onBack={() => setShowOtp(false)}
        onSuccess={(user) => {
          console.log("OtpVerification onSuccess called with:", user);
          localStorage.setItem("user", JSON.stringify(user));
          onSubmit && onSubmit(user);
          console.log("Navigating to home page");
          navigate("/");
        }}
        mode={isLoginMode ? "login" : "signup"}
      />
    );
  }

  return (
    <div className="register-form-container">
      <div className="form-inner">
        <h2>
          {isLoginMode
            ? "Đăng nhập hoặc tạo tài khoản"
            : "Đăng nhập hoặc tạo tài khoản"}
        </h2>
        <p className="form-description">
          {isLoginMode
            ? "Đăng nhập để truy cập tài khoản của bạn và nhận các ưu đãi đặc biệt!"
            : "Đăng ký miễn phí hoặc đăng nhập để nhận được các ưu đãi và quyền lợi hấp dẫn!"}
        </p>

        {/* Social Login Buttons */}
        <div className="social-login-buttons">
          <button
            className="social-btn google-btn"
            onClick={() => handleSocialLogin("google")}
          >
            <i className="fab fa-google"></i>
            {isLoginMode ? "Đăng nhập bằng Google" : "Đăng ký bằng Google"}
          </button>

          <button
            className="social-btn facebook-btn"
            onClick={() => handleSocialLogin("facebook")}
          >
            <i className="fab fa-facebook-f"></i>
            {isLoginMode ? "Đăng nhập với Facebook" : "Đăng ký với Facebook"}
          </button>

          <button
            className="social-btn apple-btn"
            onClick={() => handleSocialLogin("apple")}
          >
            <i className="fab fa-apple"></i>
            {isLoginMode ? "Đăng nhập bằng Apple" : "Đăng ký bằng Apple"}
          </button>
        </div>

        {/* Divider */}
        <div className="divider">
          <span>hoặc</span>
        </div>

        {/* Email Form */}
        {step === 1 && (
          <form className="email-input-group" onSubmit={handleEmailSubmit}>
            <label className="email-label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Nhập email của bạn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className="continue-btn" disabled={loading}>
              {loading ? "Đang gửi..." : isLoginMode ? "Đăng nhập" : "Tiếp tục"}
            </button>
          </form>
        )}
        {step === 2 && (
          <form className="email-input-group" onSubmit={handleOtpSubmit}>
            <label className="email-label" htmlFor="otp">
              Nhập mã OTP gửi về email
            </label>
            <input
              id="otp"
              type="text"
              placeholder="Nhập mã OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            <button type="submit" className="continue-btn" disabled={loading}>
              {loading ? "Đang xác thực..." : "Xác nhận"}
            </button>
          </form>
        )}
        {message && (
          <div
            style={{
              color:
                message.includes("lỗi") || message.includes("thất bại")
                  ? "red"
                  : "#007bff",
              textAlign: "center",
              margin: "8px 0",
              fontSize: "14px",
            }}
          >
            {message}
          </div>
        )}

        {/* Other Login Options */}
        <div className="other-login-options">
          <span
            className="other-login-btn"
            role="button"
            tabIndex={0}
            onClick={() => setShowOtherOptions(!showOtherOptions)}
            onKeyPress={(e) => {
              if (e.key === "Enter" || e.key === " ")
                setShowOtherOptions(!showOtherOptions);
            }}
          >
            Đăng nhập bằng cách khác
            <i
              className={`fas fa-chevron-${showOtherOptions ? "up" : "down"}`}
              style={{ marginLeft: 8 }}
            ></i>
          </span>

          {showOtherOptions && (
            <div className="other-options-dropdown">
              <span className="phone-option" title="Gọi điện">
                <i className="fas fa-phone"></i>
              </span>
            </div>
          )}
        </div>

        {/* Terms and Conditions */}
        <div className="terms-section">
          <p>
            Khi đăng nhập, tôi đồng ý với các{" "}
            <a href="/terms" className="terms-link">
              Điều khoản sử dụng
            </a>{" "}
            và{" "}
            <a href="/privacy" className="terms-link">
              Chính sách bảo mật
            </a>{" "}
            của QuickStay.
          </p>
        </div>
      </div>
    </div>
  );
}
