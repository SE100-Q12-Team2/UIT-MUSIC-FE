import { Link } from "react-router";
import "../../../styles/auth.css";
import facebookLogo from "../../../assets/facebook.png";
import googleLogo from "../../../assets/google.png";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { useLoginForm } from "../hooks/useLoginForm";

const LoginPage = () => {
  const { form, isLoading, onSubmit } = useLoginForm();

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1 className="auth-title">Log In</h1>

        <Form {...form}>
          <form className="auth-form" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="auth-field">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Email"
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="auth-field">
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Password"
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="auth-extra-row">
              <Button type="button" className="link-button">
                Forget Password ?
              </Button>
            </div>

            <Button
              type="submit"
              className="auth-submit"
              disabled={isLoading}
            >
              {isLoading ? "LOGGING IN..." : "LOGIN"}
            </Button>
          </form>
        </Form>

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
