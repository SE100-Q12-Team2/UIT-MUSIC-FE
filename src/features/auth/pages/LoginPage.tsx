import React from "react";
import "../../../styles/auth.css";
import facebookLogo from "../../../assets/facebook.png";
import googleLogo from "../../../assets/google.png";

const LoginPage: React.FC = () => {
  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1 className="auth-title">Log In</h1>

        <form className="auth-form">
          <div className="auth-field">
            <label htmlFor="login-email">Email</label>
            <input id="login-email" type="email" placeholder="Email" />
          </div>

          <div className="auth-field">
            <label htmlFor="login-password">Password</label>
            <input id="login-password" type="password" placeholder="Password" />
          </div>

          <div className="auth-extra-row">
            <label className="remember-me">
              <input type="checkbox" />
              Remember Me
            </label>

            <button type="button" className="link-button">
              Forget Password ?
            </button>
          </div>

          <button type="submit" className="auth-submit">
            LOGIN
          </button>
        </form>

        <div className="auth-social-wrapper">
          <span className="auth-social-title">OR Log In With</span>
          <div className="auth-social">
            <button type="button" className="social-icon">
              <img src={facebookLogo} alt="Facebook" />
            </button>
            <button type="button" className="social-icon">
              <img src={googleLogo} alt="Google" />
            </button>
          </div>
        </div>

        <p className="auth-footer-text">
          Not A Member ? <a href="#">Register Now</a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
