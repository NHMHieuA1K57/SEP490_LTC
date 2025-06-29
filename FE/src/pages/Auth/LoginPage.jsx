import React, { useState } from 'react';
import './Login.css';

const LoginPage = () => {
  const [isActive, setIsActive] = useState(false);

  return (
    <div className="login-wrapper">
    <div className={`login-container ${isActive ? 'login-active' : ''}`}>
      <div className="login-form-container login-sign-up">
        <form>
          <h1>Create Account</h1>
          <div className="login-social-icons">
            <a href="#" className="login-icon"><i className="fa-brands fa-google-plus-g"></i></a>
            <a href="#" className="login-icon"><i className="fa-brands fa-facebook-f"></i></a>
            <a href="#" className="login-icon"><i className="fa-brands fa-github"></i></a>
            <a href="#" className="login-icon"><i className="fa-brands fa-linkedin-in"></i></a>
          </div>
          <span>or use your email for registration</span>
          <input type="text" placeholder="Name" />
          <input type="email" placeholder="Email" />
          <input type="password" placeholder="Password" />
          <p className="mobile-toggle-link" onClick={() => setIsActive(false)}>
  Already have an account? <span>Sign In</span>
</p>

          <button>Sign Up</button>
        </form>
      </div>

      <div className="login-form-container login-sign-in">
        <form>
          <h1>Sign In</h1>
          <div className="login-social-icons">
            <a href="#" className="login-icon"><i className="fa-brands fa-google-plus-g"></i></a>
            <a href="#" className="login-icon"><i className="fa-brands fa-facebook-f"></i></a>
            <a href="#" className="login-icon"><i className="fa-brands fa-github"></i></a>
            <a href="#" className="login-icon"><i className="fa-brands fa-linkedin-in"></i></a>
          </div>
          <span>or use your email password</span>
          <input type="email" placeholder="Email" />
          <input type="password" placeholder="Password" />
          <a href="#">Forget Your Password?</a>
          <p className="mobile-toggle-link" onClick={() => setIsActive(true)}>
  Don't have an account? <span>Sign Up</span>
</p>
          <button>Sign In</button>
        </form>
      </div>

      <div className="login-toggle-container">
        <div className="login-toggle">
          <div className="login-toggle-panel login-toggle-left">
            <h1>Welcome Back!</h1>
            <p>Enter your personal details to use all of site features</p>
            <button className="login-hidden" onClick={() => setIsActive(false)}>Sign In</button>
          </div>
          <div className="login-toggle-panel login-toggle-right">
            <h1>Hello, Friend!</h1>
            <p>Register with your personal details to use all of site features</p>
            <button className="login-hidden" onClick={() => setIsActive(true)}>Sign Up</button>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default LoginPage;
