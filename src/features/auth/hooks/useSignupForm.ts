import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpFormSchema, type SignUpFormValues } from "../schemas/auth.schema";
import { useRegister, useSendOTP } from "@/core/services/auth.service";
import { TypeOfVerificationCode } from "@/core/constants/auth.constant";
import { useNavigate } from "react-router";
import { toast } from "sonner";

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
      const error = err as { 
        errors?: unknown;
        message?: Array<{ path: string; message: string }> | string;
        status?: number;
      };

      console.log("err", err);
      
      if (error?.message && Array.isArray(error.message)) {
        const emailError = error.message.find((e: { path: string; message: string }) => e.path === "email");
        if (emailError) {
          form.setError("email", {
            type: "manual",
            message: emailError.message,
          });
          toast.error(emailError.message);
        } else {
          const errorMessage = error.message[0]?.message || "Failed to send verification code";
          form.setError("email", {
            type: "manual",
            message: errorMessage,
          });
          toast.error(errorMessage);
        }
      } else {
        const errorMessage = err instanceof Error ? err.message : "Failed to send verification code";
        form.setError("email", {
          type: "manual",
          message: errorMessage,
        });
        toast.error(errorMessage);
      }
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
      const error = err as { 
        errors?: unknown;
        message?: Array<{ path: string; message: string }> | string;
        status?: number;
        response?: { data?: { message?: Array<{ path: string; message: string }> } }
      };

      if (error?.message && Array.isArray(error.message)) {
        error.message.forEach((validationError: { path: string; message: string }) => {
          const fieldName = validationError.path as keyof SignUpFormValues;
          if (fieldName && fieldName in data) {
            form.setError(fieldName, {
              type: "manual",
              message: validationError.message === "Error.InvalidOTP" 
                ? "Invalid or expired verification code" 
                : validationError.message,
            });
          }
        });
      } 
      else if (error?.response?.data?.message && Array.isArray(error.response.data.message)) {
        error.response.data.message.forEach((validationError: { path: string; message: string }) => {
          const fieldName = validationError.path as keyof SignUpFormValues;
          if (fieldName && fieldName in data) {
            form.setError(fieldName, {
              type: "manual",
              message: validationError.message === "Error.InvalidOTP" 
                ? "Invalid or expired verification code" 
                : validationError.message,
            });
          }
        });
      } 
      else {
        const errorMessage = err instanceof Error ? err.message : "Sign up failed";
        form.setError("root", {
          type: "manual",
          message: errorMessage,
        });
      }
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
