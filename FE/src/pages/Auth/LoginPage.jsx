import React, { useState } from 'react';
import './Login.css';
import axios from 'axios';
import { GoogleLogin } from '@react-oauth/google';

const LoginPage = () => {
  const [isActive, setIsActive] = useState(false);

  // Signup states
  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    password: '',
  });

  // Login states
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  const handleSignupChange = (e) => {
    setSignupData({ ...signupData, [e.target.name]: e.target.value });
  };

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:9999/api/auth/register', {
        ...signupData,
        role: 'customer', // hoặc tuỳ chỉnh
      });
      alert(res.data.message);
      setIsActive(false); // chuyển sang màn login
    } catch (err) {
      alert(err.response?.data?.message || 'Đăng ký thất bại');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:9999/api/auth/login', loginData, {
        withCredentials: true, // để gửi cookie refresh token nếu có
      });
      alert('Đăng nhập thành công!');
      console.log('User:', res.data.data.user);
      console.log('AccessToken:', res.data.data.accessToken);
    } catch (err) {
      alert(err.response?.data?.message || 'Đăng nhập thất bại');
    }
  };

  return (
    <div className="login-wrapper">
      <div className={`login-container ${isActive ? 'login-active' : ''}`}>
        {/* Sign Up Form */}
        <div className="login-form-container login-sign-up">
          <form onSubmit={handleSignup}>
            <h1>Create Account</h1>
            <div className="login-social-icons">
              <GoogleLogin
                onSuccess={credentialResponse => {
                  console.log(credentialResponse);
                }}
                onError={() => {
                  console.log('Google Login Failed');
                }}
              />
            </div>
            <span>or use your email for registration</span>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={signupData.name}
              onChange={handleSignupChange}
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={signupData.email}
              onChange={handleSignupChange}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={signupData.password}
              onChange={handleSignupChange}
            />
            <p className="mobile-toggle-link" onClick={() => setIsActive(false)}>
              Already have an account? <span>Sign In</span>
            </p>
            <button type="submit">Sign Up</button>
          </form>
        </div>

        {/* Sign In Form */}
        <div className="login-form-container login-sign-in">
          <form onSubmit={handleLogin}>
            <h1>Sign In</h1>
            <div className="login-social-icons">
              <GoogleLogin
                onSuccess={credentialResponse => {
                  console.log(credentialResponse);
                }}
                onError={() => {
                  console.log('Google Login Failed');
                }}
              />
            </div>
            <span>or use your email password</span>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={loginData.email}
              onChange={handleLoginChange}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={loginData.password}
              onChange={handleLoginChange}
            />
            <a href="reset-password">Forget Your Password?</a>
            <p className="mobile-toggle-link" onClick={() => setIsActive(true)}>
              Don't have an account? <span>Sign Up</span>
            </p>
            <button type="submit">Sign In</button>
          </form>
        </div>

        {/* UI Toggle */}
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
