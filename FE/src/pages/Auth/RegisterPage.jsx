import React, { useState } from "react";
import RegisterBusinessUserForm from "../../components/BusinessUser/RegisterBusinessUserForm";
import OtpVerification from "../../components/OtpVerification/OtpVerification";
import "./Login.scss";

const RegisterPage = () => {
  const [showOtp, setShowOtp] = useState(false);
  const [registerEmail, setRegisterEmail] = useState("");

  const handleRegister = (formData) => {
    setRegisterEmail(formData.email);
    setShowOtp(true);
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="form-container">
          <div className="login-form-wrapper" style={{ position: "relative" }}>
            {!showOtp ? (
              <RegisterBusinessUserForm
                onSubmit={handleRegister}
                mode="signup"
              />
            ) : (
              <OtpVerification
                email={registerEmail}
                onBack={() => setShowOtp(false)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
