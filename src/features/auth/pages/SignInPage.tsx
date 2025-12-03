import React from "react";
import "../../../styles/auth.css";
import facebookLogo from "../../../assets/facebook.png";
import googleLogo from "../../../assets/google.png";

const SignInPage: React.FC = () => {
  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1 className="auth-title">Sign up</h1>

        <form className="auth-form">
          <div className="auth-field">
            <label htmlFor="signup-username">User Name</label>
            <input id="signup-username" type="text" placeholder="User Name" />
          </div>

          <div className="auth-field">
            <label htmlFor="signup-email">Email</label>
            <input id="signup-email" type="email" placeholder="Email" />
          </div>

          <div className="auth-field">
            <label htmlFor="signup-password">Password</label>
            <input
              id="signup-password"
              type="password"
              placeholder="Password"
            />
          </div>

          <button type="submit" className="auth-submit">
            SIGN UP
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
          Already Have An Account ? <a href="#">Login</a>
        </p>
      </div>
    </div>
  );
};

export default SignInPage;
