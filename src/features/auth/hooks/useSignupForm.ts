import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpFormSchema, type SignUpFormValues } from "../schemas/auth.schema";
import { useRegister, useSendOTP } from "@/core/services/auth.service";
import { TypeOfVerificationCode } from "@/core/constants/auth.constant";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { handleApiValidationError, handleApiErrorWithSpecificField } from "../utils/handleApiError";

export const useSignupForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const sendOTPMutation = useSendOTP();
  const registerMutation = useRegister()
  const navigate = useNavigate();


  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      code: "",
    },
  });

  const sendVerificationCode = async () => {
    const email = form.getValues("email");
    
    const emailError = signUpFormSchema.shape.email.safeParse(email);
    if (!emailError.success) {
      form.setError("email", {
        type: "manual",
        message: emailError.error.issues[0].message,
      });
      return;
    }

    setIsSendingCode(true);
    try {
      await sendOTPMutation.mutateAsync({ 
        email, 
        type: TypeOfVerificationCode.REGISTER 
      });
      setCodeSent(true);
      toast.success("Verification code sent to your email");
    } catch (err: unknown) {
      handleApiErrorWithSpecificField(err, "email", form.setError, {
        showToast: true,
        fallbackMessage: "Failed to send verification code"
      });
    } finally {
      setIsSendingCode(false);
    }
  };

  const onSubmit = async (data: SignUpFormValues) => {
    setIsLoading(true);
    
    try {
      await registerMutation.mutateAsync({
        fullName: data.fullName,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
        code: data.code
      })
      toast.success("Registration successful! Redirecting to login...");
      navigate('/login', { replace: true });
      
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (err: unknown) {
      handleApiValidationError(err, data, form.setError, {
        showToast: false,
        fallbackMessage: "Sign up failed"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    isLoading,
    isSendingCode,
    codeSent,
    onSubmit,
    sendVerificationCode,
  };
};
