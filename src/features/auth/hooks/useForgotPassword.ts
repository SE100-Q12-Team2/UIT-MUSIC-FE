import { forgotPasswordSchema, ForgotPasswordValues } from "@/features/auth/schemas/auth.schema"
import { handleApiErrorWithSpecificField } from "@/features/auth/utils/handleApiError";
import { useState } from "react";
import { useForm } from "react-hook-form"
import { toast } from "sonner";
import { useForgotPassword as useForgotPasswordMutation } from '@/core/services/auth.service'

export const useForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const forgotPasswordMutation = useForgotPasswordMutation()

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const form = useForm<ForgotPasswordValues>({
    resolver: undefined,
    defaultValues: { email: "" }
  });

  const onSubmit = async (data: ForgotPasswordValues) => {
    setError("");
    setIsLoading(true);
    setIsSendingCode(true);
    try {
      const emailResult = forgotPasswordSchema.shape.email.safeParse(data.email);
      if (!emailResult.success) {
        form.setError("email", {
          type: "manual",
          message: emailResult.error.issues[0].message,
        });
        setIsLoading(false);
        return;
      }
      await forgotPasswordMutation.mutateAsync(data.email);
      setCodeSent(true);
      setSubmitted(true);
      toast.success("Đã gửi email xác nhận thành công!");
    } catch (err: unknown) {
        const errorObj = err as { response?: { data?: { message?: string } } };
        handleApiErrorWithSpecificField(err, "email", form.setError, {
          showToast: false,
          fallbackMessage: "Đã có lỗi xảy ra khi gửi email xác nhận."
        });
        setError(errorObj?.response?.data?.message || "Đã có lỗi xảy ra khi gửi email xác nhận.");  
    } finally {
      setIsLoading(false);
      setIsSendingCode(false)
    }
  };

  return {
    form,
    onSubmit,
    isLoading,
    submitted,
    error,
    isSendingCode,
    codeSent
  }
}
