import "../../../styles/auth.css";
import React from "react";
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
import { Link } from "react-router";
import { useForgotPassword } from "../hooks/useForgotPassword";

const ForgotPasswordPage: React.FC = () => {
  const { form, onSubmit, submitted, error, isLoading } = useForgotPassword();

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1 className="auth-title">Quên mật khẩu</h1>
        {submitted ? (
          <div className="text-green-600 text-center mb-4">
            Link đặt lại mật khẩu đã được gửi đến email của bạn nếu nó tồn tại trong hệ thống. Vui lòng kiểm tra hộp thư đến của bạn.
          </div>
        ) : (
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
                        placeholder="Nhập email của bạn"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {error && <div className="text-red-500 text-sm text-center">{error}</div>}
              <Button type="submit" className="auth-submit" disabled={isLoading || form.formState.isSubmitting}>
                {(isLoading || form.formState.isSubmitting) ? "Đang gửi..." : "Gửi email xác nhận"}
              </Button>
            </form>
          </Form>
        )}
        <p className="auth-footer-text mt-4">
          <Link to="/login">Quay lại đăng nhập</Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
