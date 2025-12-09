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
import { useSignupForm } from "../hooks/useSignupForm";

const SignUpPage = () => {
  const { form, isLoading, isSendingCode, codeSent, onSubmit, sendVerificationCode } = useSignupForm();

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1 className="auth-title">Sign up</h1>

        <Form {...form}>
          <form noValidate className="auth-form" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem className="auth-field">
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Full Name"
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
              name="email"
              render={({ field }) => (
                <FormItem className="auth-field">
                  <FormLabel>Email</FormLabel>
                  <div className="flex gap-2">
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Email"
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                        {...field}
                      />
                    </FormControl>
                    <Button
                      type="button"
                      onClick={sendVerificationCode}
                      disabled={isSendingCode || !field.value}
                      className="whitespace-nowrap px-4 cursor-pointer"
                      variant={codeSent ? "secondary" : "default"}
                    >
                      {isSendingCode ? "Sending..." : codeSent ? "Resend" : "Send Code"}
                    </Button>
                  </div>
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

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem className="auth-field">
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Confirm Password"
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
              name="code"
              render={({ field }) => (
                <FormItem className="auth-field">
                  <FormLabel>Verification Code</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter 6-digit code from email"
                      maxLength={6}
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.formState.errors.root && (
              <div className="text-red-500 text-sm mt-2 p-3 bg-red-500/10 border border-red-500/20 rounded">
                {form.formState.errors.root.message}
              </div>
            )}

            <Button
              type="submit"
              className="auth-submit"
              disabled={isLoading}
            >
              {isLoading ? "SIGNING UP..." : "SIGN UP"}
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
          Already Have An Account ? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;
