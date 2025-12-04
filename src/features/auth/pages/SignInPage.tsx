import { Link } from "react-router";
import "../../../styles/auth.css";
import facebookLogo from "../../../assets/facebook.png";
import googleLogo from "../../../assets/google.png";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { useSignupForm } from "../hooks/useSignupForm";

const SignInPage = () => {
  const {
    formData,
    isLoading,
    error,
    handleFieldChange,
    handleSubmit,
  } = useSignupForm();

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1 className="auth-title">Sign up</h1>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label htmlFor="signup-username">User Name</label>
            <Input
              id="signup-username"
              type="text"
              placeholder="User Name"
              value={formData.username}
              onChange={(e) => handleFieldChange("username")(e.target.value)}
              required
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
            />
          </div>

          <div className="auth-field">
            <label htmlFor="signup-email">Email</label>
            <Input
              id="signup-email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => handleFieldChange("email")(e.target.value)}
              required
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
            />
          </div>

          <div className="auth-field">
            <label htmlFor="signup-password">Password</label>
            <Input
              id="signup-password"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => handleFieldChange("password")(e.target.value)}
              required
              minLength={6}
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
            />
          </div>

          <Button
            type="submit"
            className="auth-submit"
            disabled={isLoading}
          >
            {isLoading ? "SIGNING UP..." : "SIGN UP"}
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
          Already Have An Account ? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default SignInPage;
