import React, { useState, useEffect } from "react";
import "./OtpVerification.scss";
import axios from "axios";
import { loginWithOtp, registerWithOtp } from "../../server/authAPI";

export default function OtpVerification({
  email,
  onBack,
  onSuccess,
  mode = "signup",
}) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showOtherOptions, setShowOtherOptions] = useState(false);
  const [timer, setTimer] = useState(60);

  const isLoginMode = mode === "login";

  useEffect(() => {
    setTimer(60);
  }, [email]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleChange = (element, index) => {
    const newOtp = [...otp];
    newOtp[index] = element.value.slice(-1);
    setOtp(newOtp);
    if (element.nextSibling && element.value) {
      element.nextSibling.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const otpCode = otp.join("");
      let res;
      if (isLoginMode) {
        res = await loginWithOtp(email, otpCode);
      } else {
        res = await registerWithOtp(email, otpCode);
      }
      if (res.success) {
        setSuccess(true);
        if (typeof onSuccess === "function") {
          onSuccess(res.user || { email });
        }
      } else {
        setError(res.message || "Xác thực OTP thất bại");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Xác thực OTP thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    setError("");
    setOtp(["", "", "", "", "", ""]);
    try {
      await axios.post("http://localhost:9999/api/auth/request-otp", { email });
    } catch (err) {
      setError("Không thể gửi lại email.");
    }
  };

  if (success) {
    return (
      <div className="otp-container">
        <h3 className="otp-title">
          {isLoginMode ? "Đăng nhập thành công!" : "Đăng ký thành công!"}
        </h3>
        <p>Bạn có thể sử dụng hệ thống.</p>
      </div>
    );
  }

  return (
    <form className="otp-container" onSubmit={handleSubmit}>
      {onBack && (
        <button
          type="button"
          aria-label="Quay lại"
          onClick={onBack}
          style={{
            background: "none",
            border: "none",
            fontSize: 28,
            color: "#222",
            cursor: "pointer",
            padding: 0,
            lineHeight: 1,
            marginBottom: 8,
            marginLeft: 0,
            alignSelf: "flex-start",
            display: "block",
          }}
        >
          {"<"}
        </button>
      )}
      <div className="otp-title">Đăng nhập bằng OTP</div>
      <span className="otp-description">
        Nhập OTP được cung cấp trong thư điện tử gửi cho <b>{email}</b>.
      </span>
      <div className="otp-input-group">
        {otp.map((digit, index) => (
          <input
            key={index}
            type="text"
            maxLength="1"
            className="otp-input"
            value={digit}
            onChange={(e) => handleChange(e.target, index)}
            required
          />
        ))}
      </div>
      {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}
      <button
        className="otp-button"
        type="submit"
        disabled={submitting || otp.some((d) => !d)}
      >
        Tiếp tục
      </button>
      {/* Countdown resend email */}
      {timer > 0 ? (
        <span className="otp-hint" style={{ marginTop: 12, display: "block" }}>
          <span style={{ color: "#aaa", cursor: "not-allowed" }}>
            Gửi lại email
          </span>
        </span>
      ) : (
        <span className="otp-hint" style={{ marginTop: 12 }}>
          <span
            role="button"
            tabIndex={0}
            style={{ color: "#1976d2", cursor: "pointer" }}
            onClick={handleResend}
          >
            Gửi lại email
          </span>
        </span>
      )}
      {timer > 0 && (
        <div
          style={{
            color: "#222",
            margin: "4px 0 8px 0",
            fontWeight: 500,
            fontSize: 15,
          }}
        >
          00:{timer.toString().padStart(2, "0")}
        </div>
      )}
      <span className="otp-divider">hoặc</span>
      {/* Đăng nhập bằng cách khác */}
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

      <span
        className="otp-terms"
        style={{ fontSize: 12, marginTop: 16, display: "block", color: "#888" }}
      >
        Khi đăng nhập, tôi đồng ý với các{" "}
        <a href="/terms" target="_blank" rel="noopener noreferrer">
          Điều khoản sử dụng
        </a>{" "}
        và{" "}
        <a href="/privacy" target="_blank" rel="noopener noreferrer">
          Chính sách bảo mật
        </a>{" "}
        của QuickStay.
      </span>
    </form>
  );
}
