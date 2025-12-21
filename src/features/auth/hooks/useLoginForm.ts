import { useState } from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginFormSchema, type LoginFormValues } from "../schemas/auth.schema";
import { useAuth } from "@/shared/hooks/auth/useAuth";
import { toast } from "sonner";
import { handleApiValidationError } from "../utils/handleApiError";

export const useLoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    
    try {
      await login(data.email, data.password);
      toast.success("Login successful");
      navigate('/home', { replace: true });
    } catch (err) {
      handleApiValidationError(err, data, form.setError, {
        showToast: true,
        fallbackMessage: "Login failed"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    isLoading,
    onSubmit,
  };
};
