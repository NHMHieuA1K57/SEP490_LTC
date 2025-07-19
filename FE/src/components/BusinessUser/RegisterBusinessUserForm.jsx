import React, { useState } from "react";
import "./RegisterBusinessUserForm.css";

export default function RegisterBusinessUserForm({
  onSubmit,
  mode = "signup",
}) {
  const [email, setEmail] = useState("");
  const [showOtherOptions, setShowOtherOptions] = useState(false);

  const isLoginMode = mode === "login";

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (email) {
      // Xử lý tiếp tục với email
      console.log("Tiếp tục với email:", email);
      onSubmit({ email });
    }
  };

  const handleSocialLogin = (provider) => {
    console.log("Đăng nhập bằng:", provider);
    // Xử lý đăng nhập social
    onSubmit({ provider });
  };

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

        <div className="email-input-group">
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
          <button type="submit" className="continue-btn">
            {isLoginMode ? "Đăng nhập" : "Tiếp tục"}
          </button>
        </div>

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
