import { useState, FormEvent } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "@/shared/hooks/useAuth";

interface SignupFormData {
  username: string;
  email: string;
  password: string;
}

export const useSignupForm = () => {
  const [formData, setFormData] = useState<SignupFormData>({
    username: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleFieldChange = (field: keyof SignupFormData) => (value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      await register(formData.username, formData.email, formData.password);
      navigate('/home', { replace: true });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Sign up failed";
      setError(errorMessage);
      console.error("Sign up failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    isLoading,
    error,
    handleFieldChange,
    handleSubmit,
  };
};
