"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.scss";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
    console.log({ email, password, rememberMe });
    alert("Login successful!");
    // Redirect to homepage after successful login
    navigate("/");
  };

  return (
    <div className="login-page">
      <div className="container">
        <div className="login-container">
          <div className="login-image">
            <img
              src="/placeholder.svg?height=600&width=600"
              alt="Hotel lobby"
            />
          </div>
          <div className="login-form-container">
            <div className="login-header">
              <h1>Welcome Back</h1>
              <p>Sign in to access your account and manage your bookings</p>
            </div>

            <form className="login-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </div>

              <div className="form-options">
                <label className="remember-me">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span className="checkmark"></span>
                  Remember me
                </label>
                <button type="button" className="forgot-password">
                  Forgot password?
                </button>
              </div>

              <button type="submit" className="btn btn-primary login-btn">
                Sign In
              </button>

              <div className="divider">
                <span>or continue with</span>
              </div>

              <div className="social-login">
                <button type="button" className="social-btn google">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12.545 10.239v3.821h5.445c-.712 2.315-2.647 3.972-5.445 3.972a6.033 6.033 0 110-12.064c1.498 0 2.866.549 3.921 1.453l2.814-2.814A9.969 9.969 0 0012.545 2C7.021 2 2.543 6.477 2.543 12s4.478 10 10.002 10c8.396 0 10.249-7.85 9.426-11.748l-9.426-.013z" />
                  </svg>
                  Google
                </button>
                <button type="button" className="social-btn facebook">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M13.397 20.997v-8.196h2.765l.411-3.209h-3.176V7.548c0-.926.258-1.56 1.587-1.56h1.684V3.127A22.336 22.336 0 0014.201 3c-2.444 0-4.122 1.492-4.122 4.231v2.355H7.332v3.209h2.753v8.202h3.312z" />
                  </svg>
                  Facebook
                </button>
                <button type="button" className="social-btn apple">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M16.498 0H7.502a.5.5 0 00-.5.5v23a.5.5 0 00.5.5h8.996a.5.5 0 00.5-.5v-23a.5.5 0 00-.5-.5zM12 22.25a1.25 1.25 0 110-2.5 1.25 1.25 0 010 2.5zm4-3.75H8v-16h8v16z" />
                  </svg>
                  Apple
                </button>
              </div>

              <div className="signup-link">
                Don't have an account? <button type="button">Sign up</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
