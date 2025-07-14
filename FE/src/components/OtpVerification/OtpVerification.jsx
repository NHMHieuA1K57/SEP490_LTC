import React, { useState } from 'react';
import './OtpVerification.css';

export default function OtpVerification() {
  const [otp, setOtp] = useState(['', '', '', '']);

  const handleChange = (element, index) => {
    const newOtp = [...otp];
    newOtp[index] = element.value.slice(-1);
    setOtp(newOtp);

    // Focus next input
    if (element.nextSibling && element.value) {
      element.nextSibling.focus();
    }
  };

  const handleResend = () => {
    setOtp(['', '', '', '']);
  };

  return (
    <div className="otp-container">
      <h3 className="otp-title">Mobile phone verification</h3>
      <p className="otp-description">
        Enter the code we just sent to your mobile phone{' '}
        <span className="otp-phone">+1 408 555 1212</span>
      </p>

      <div className="otp-input-group">
        {otp.map((digit, index) => (
          <input
            key={index}
            type="text"
            maxLength="1"
            className="otp-input"
            value={digit}
            onChange={(e) => handleChange(e.target, index)}
          />
        ))}
      </div>

      <hr className="otp-divider" />

      <p className="otp-hint">
        Need another <strong>code</strong>?
      </p>
      <button className="otp-button" onClick={handleResend}>
        Re-send Email
      </button>
    </div>
  );
}
