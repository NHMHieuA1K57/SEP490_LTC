import React, { useState } from "react";
import "./Login.scss";
import RegisterBusinessUserForm from "../../components/BusinessUser/RegisterBusinessUserForm";
import OtpVerification from "../../components/OtpVerification/OtpVerification";

const LoginPage = () => {
  const [showOtp, setShowOtp] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");

  const handleLogin = (formData) => {
    setLoginEmail(formData.email);
    setShowOtp(true);
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="form-container">
          <div className="login-form-wrapper">
            {!showOtp ? (
              <RegisterBusinessUserForm onSubmit={handleLogin} mode="login" />
            ) : (
              <OtpVerification
                email={loginEmail}
                onBack={() => setShowOtp(false)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
