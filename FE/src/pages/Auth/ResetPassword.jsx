import React from 'react';
import './ResetPassword.css';

export default function ResetPassword({ setPage }) {
  const handleReset = () => {
    setPage('recovered');
  };

  return (
    <section className="reset-section">
      <div className="reset-container">
        <div className="reset-card">
          <h2 className="reset-title">Change Password</h2>
          <form className="reset-form">
            <div>
              <label htmlFor="password">New Password</label>
              <input type="password" id="password" placeholder="••••••••" required />
            </div>
            <div>
              <label htmlFor="confirm-password">Confirm Password</label>
              <input type="password" id="confirm-password" placeholder="••••••••" required />
            </div>
            <div className="reset-terms">
              <input type="checkbox" id="terms" required />
              <label htmlFor="terms">
                I accept the{' '}
                <a href="#" className="terms-link">
                  Terms and Conditions
                </a>
              </label>
            </div>
          </form>
          <button className="reset-button" onClick={handleReset}>
            Reset Password
          </button>
        </div>
      </div>
    </section>
  );
}
