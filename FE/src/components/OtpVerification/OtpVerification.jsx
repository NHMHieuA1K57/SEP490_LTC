import React, { useState, useEffect } from "react";
import "./OtpVerification.scss";
import {
  loginWithOtp,
  registerWithOtp,
  requestOtpLogin,
  requestOtpRegister,
} from "../../server/authAPI";
import { useNavigate } from "react-router-dom";

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
  const [resending, setResending] = useState(false);
  const navigate = useNavigate();

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

  // Auto call onSuccess when success becomes true
  useEffect(() => {
    if (success && typeof onSuccess === "function") {
      console.log("Success state changed, calling onSuccess with:", { email });
      onSuccess({ email });
    }
  }, [success, onSuccess, email]);

  // Auto navigate when success becomes true
  useEffect(() => {
    if (success) {
      console.log("Success state changed, navigating to home page");
      // Delay navigation to show success message
      setTimeout(() => {
        navigate("/");
      }, 2000);
    }
  }, [success, navigate]);

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
      console.log("Submitting OTP:", { email, otpCode, isLoginMode });

      // Test mode: bypass actual API call for testing
      if (process.env.NODE_ENV === "development" && otpCode === "123456") {
        console.log("Test mode: using fixed OTP 123456");
        const mockResponse = {
          success: true,
          message: "Đăng ký thành công!",
          user: {
            id: "test-user-id",
            email: email,
            name: "Test User",
            role: "customer",
          },
          accessToken: "test-access-token",
        };

        setSuccess(true);
        if (mockResponse.accessToken) {
          localStorage.setItem("accessToken", mockResponse.accessToken);
          console.log("AccessToken saved:", mockResponse.accessToken);
        }
        if (mockResponse.user) {
          localStorage.setItem("user", JSON.stringify(mockResponse.user));
          console.log("User saved:", mockResponse.user);
        }
        if (typeof onSuccess === "function") {
          console.log("Calling onSuccess callback");
          onSuccess(mockResponse.user || { email });
        }
        return;
      }

      let res;
      if (isLoginMode) {
        res = await loginWithOtp(email, otpCode);
      } else {
        // For registration, pass empty name to avoid validation issues
        res = await registerWithOtp(email, otpCode, "");
      }
      console.log("OTP response:", res);
      if (res.success) {
        setSuccess(true);
        // Lưu accessToken nếu có
        if (res.accessToken) {
          localStorage.setItem("accessToken", res.accessToken);
          console.log("AccessToken saved:", res.accessToken);
        }
        // Lưu thông tin user
        if (res.user) {
          localStorage.setItem("user", JSON.stringify(res.user));
          console.log("User saved:", res.user);
        }
        if (typeof onSuccess === "function") {
          console.log("Calling onSuccess callback");
          onSuccess(res.user || { email });
        }
      } else {
        // Hiển thị lỗi chi tiết hơn
        let errorMessage = res.message || "Xác thực OTP thất bại";
        if (res.errors && res.errors.length > 0) {
          errorMessage = res.errors.map((err) => err.msg).join(", ");
        }
        setError(errorMessage);
      }
    } catch (err) {
      console.error("Error in handleSubmit:", err);
      setError(err.response?.data?.message || "Xác thực OTP thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    setError("");
    setOtp(["", "", "", "", "", ""]);
    setResending(true);
    try {
      let res;
      if (isLoginMode) {
        res = await requestOtpLogin(email);
      } else {
        res = await requestOtpRegister(email);
      }

      if (res.success) {
        setTimer(60);
        setError("");
      } else {
        setError(res.message || "Không thể gửi lại email.");
      }
    } catch (err) {
      setError("Không thể gửi lại email.");
    } finally {
      setResending(false);
    }
  };

  if (success) {
    return (
      <div className="otp-container">
        <div style={{ textAlign: "center", padding: "20px" }}>
          <div
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              color: "#4CAF50",
              marginBottom: "10px",
            }}
          >
            ✅ {isLoginMode ? "Đăng nhập thành công!" : "Đăng ký thành công!"}
          </div>
          <p style={{ color: "#666", marginBottom: "20px" }}>
            Bạn có thể sử dụng hệ thống.
          </p>
          <button
            onClick={() => {
              // Navigate về trang chủ ngay lập tức
              navigate("/");
            }}
            style={{
              backgroundColor: "#1976d2",
              color: "white",
              border: "none",
              padding: "12px 24px",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            Về trang chủ
          </button>
        </div>
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
      {process.env.NODE_ENV === "development" && (
        <div
          style={{
            background: "#fff3cd",
            border: "1px solid #ffeaa7",
            padding: "8px",
            margin: "8px 0",
            borderRadius: "4px",
            fontSize: "12px",
            color: "#856404",
          }}
        >
          🧪 Test Mode: Sử dụng OTP <strong>123456</strong> để test
        </div>
      )}
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
            style={{
              color: resending ? "#aaa" : "#1976d2",
              cursor: resending ? "not-allowed" : "pointer",
            }}
            onClick={resending ? undefined : handleResend}
          >
            {resending ? "Đang gửi..." : "Gửi lại email"}
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
