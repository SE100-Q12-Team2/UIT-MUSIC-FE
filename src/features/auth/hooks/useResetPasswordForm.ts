import { useState } from "react";
import { useForm } from "react-hook-form";
import { resetPasswordSchema, ResetPasswordValues } from "@/features/auth/schemas/auth.schema";
import { useResetPassword } from "@/core/services/auth.service";
import { useNavigate, useLocation } from "react-router";
import { handleApiValidationError } from "@/features/auth/utils/handleApiError";
import { toast } from "sonner";

export const useResetPasswordForm = () => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const resetPasswordMutation = useResetPassword();
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const resetToken = searchParams.get("token") || "";

  const form = useForm<ResetPasswordValues>({
    resolver: undefined,
    defaultValues: {
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const onSubmit = async (data: ResetPasswordValues) => {
    setError("");
    setIsLoading(true);
    try {
      const result = resetPasswordSchema.safeParse(data);
      if (!result.success) {
        setIsLoading(false);
        return;
      }
      if (!resetToken) {
        setError("Token không hợp lệ hoặc đã hết hạn.");
        setIsLoading(false);
        return;
      }
      await resetPasswordMutation.mutateAsync({
        resetToken,
        newPassword: data.newPassword,
        confirmNewPassword: data.confirmNewPassword,
      });
      toast.success("Đặt lại mật khẩu thành công");
      setSuccess(true);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      handleApiValidationError(err, form.setError, setError);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    onSubmit,
    error,
    success,
    isLoading,
  };
};
