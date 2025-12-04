import { Link } from "react-router";
import "../../../styles/auth.css";
import facebookLogo from "../../../assets/facebook.png";
import googleLogo from "../../../assets/google.png";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { useLoginForm } from "../hooks/useLoginForm";

const LoginPage = () => {
  const {
    email,
    password,
    rememberMe,
    isLoading,
    error,
    handleEmailChange,
    handlePasswordChange,
    handleRememberMeChange,
    handleSubmit,
  } = useLoginForm();

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1 className="auth-title">Log In</h1>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label htmlFor="login-email">Email</label>
            <Input
              id="login-email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => handleEmailChange(e.target.value)}
              required
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
            />
          </div>

          <div className="auth-field">
            <label htmlFor="login-password">Password</label>
            <Input
              id="login-password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => handlePasswordChange(e.target.value)}
              required
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
            />
          </div>

          <div className="auth-extra-row">
            <label className="remember-me">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => handleRememberMeChange(e.target.checked)}
              />
              Remember Me
            </label>

            <button type="button" className="link-button">
              Forget Password ?
            </button>
          </div>

          <Button
            type="submit"
            className="auth-submit"
            disabled={isLoading}
          >
            {isLoading ? "LOGGING IN..." : "LOGIN"}
          </Button>
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
          Not A Member ? <Link to="/signup">Register Now</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
