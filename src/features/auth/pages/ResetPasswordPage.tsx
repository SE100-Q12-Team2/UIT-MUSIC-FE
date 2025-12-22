import "../../../styles/auth.css";
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
import { useResetPasswordForm } from "../hooks/useResetPasswordForm";

export default function ResetPasswordPage() {
  const { form, onSubmit, error, success, isLoading } = useResetPasswordForm();

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1 className="auth-title">Đặt lại mật khẩu</h1>
        {success ? (
          <div className="text-green-600 text-center mb-4">
            Đặt lại mật khẩu thành công! Đang chuyển về trang đăng nhập...
          </div>
        ) : (
          <Form {...form}>
            <form className="auth-form" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem className="auth-field">
                    <FormLabel>Mật khẩu mới</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Nhập mật khẩu mới"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmNewPassword"
                render={({ field }) => (
                  <FormItem className="auth-field">
                    <FormLabel>Nhập lại mật khẩu mới</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Nhập lại mật khẩu mới"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {error && <div className="text-red-500 text-sm text-center">{error}</div>}
              <Button type="submit" className="auth-submit" disabled={isLoading || form.formState.isSubmitting}>
                {(isLoading || form.formState.isSubmitting) ? "Đang đặt lại..." : "Đặt lại mật khẩu"}
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
}