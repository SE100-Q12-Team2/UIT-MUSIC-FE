import { useState } from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/shared/hooks/auth/useAuth";
import { loginFormSchema, type LoginFormValues } from "../schemas/auth.schema";

export const useLoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    
    try {
      await login(data.email, data.password);
      navigate('/home', { replace: true });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Login failed";
      form.setError("root", {
        type: "manual",
        message: errorMessage,
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
