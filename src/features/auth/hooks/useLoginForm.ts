import { useState, FormEvent } from "react";

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export const useLoginForm = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEmailChange = (email: string) => {
    setFormData(prev => ({ ...prev, email }));
    setError(null);
  };

  const handlePasswordChange = (password: string) => {
    setFormData(prev => ({ ...prev, password }));
    setError(null);
  };

  const handleRememberMeChange = (rememberMe: boolean) => {
    setFormData(prev => ({ ...prev, rememberMe }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      console.log("Login:", formData);
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Login failed";
      setError(errorMessage);
      console.error("Login failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    email: formData.email,
    password: formData.password,
    rememberMe: formData.rememberMe,
    isLoading,
    error,
    handleEmailChange,
    handlePasswordChange,
    handleRememberMeChange,
    handleSubmit,
  };
};
