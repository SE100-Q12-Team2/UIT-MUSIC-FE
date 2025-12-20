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
      
      // Get the updated user from auth context to check role
      // The login function already fetches and sets the profile
      // We'll use a small delay to ensure the context is updated
      setTimeout(() => {
        // Redirect based on role will be handled by a separate route guard
        // For now, redirect to a common page that will redirect based on role
        navigate('/home', { replace: true });
      }, 100);
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
