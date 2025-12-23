import { UseFormSetError, FieldValues, Path } from "react-hook-form";
import { toast } from "sonner";

interface ValidationError {
  path: string;
  message: string;
}

interface ApiError {
  errors?: unknown;
  message?: ValidationError[] | string;
  status?: number;
  response?: { 
    data?: { 
      message?: ValidationError[] 
    } 
  };
}

const ERROR_MESSAGE_MAP: Record<string, string> = {
  "Error.InvalidOTP": "Invalid or expired verification code",
};

const getTranslatedMessage = (message: string): string => {
  return ERROR_MESSAGE_MAP[message] || message;
};

export function handleApiValidationError<T extends FieldValues>(
  error: unknown,
  formData: T,
  setError: UseFormSetError<T>,
  options?: {
    showToast?: boolean;
    fallbackMessage?: string;
  }
): boolean {
  const { showToast = false, fallbackMessage = "An error occurred" } = options || {};
  
  const apiError = error as ApiError;

  if (apiError?.message && Array.isArray(apiError.message)) {
    let hasError = false;
    apiError.message.forEach((validationError: ValidationError) => {
      const fieldName = validationError.path as Path<T>;
      if (fieldName && fieldName in formData) {
        const translatedMessage = getTranslatedMessage(validationError.message);
        setError(fieldName, {
          type: "manual",
          message: translatedMessage,
        });
        if (showToast && !hasError) {
          toast.error(translatedMessage);
          hasError = true;
        }
      }
    });
    return true;
  }
  
  if (apiError?.response?.data?.message && Array.isArray(apiError.response.data.message)) {
    let hasError = false;
    apiError.response.data.message.forEach((validationError: ValidationError) => {
      const fieldName = validationError.path as Path<T>;
      if (fieldName && fieldName in formData) {
        const translatedMessage = getTranslatedMessage(validationError.message);
        setError(fieldName, {
          type: "manual",
          message: translatedMessage,
        });
        if (showToast && !hasError) {
          toast.error(translatedMessage);
          hasError = true;
        }
      }
    });
    return true;
  }

  const errorMessage = error instanceof Error ? error.message : fallbackMessage;
  setError("root" as Path<T>, {
    type: "manual",
    message: errorMessage,
  });
  
  if (showToast) {
    toast.error(errorMessage);
  }
  
  return false;
}

export function handleApiErrorWithSpecificField<T extends FieldValues>(
  error: unknown,
  fieldName: Path<T>,
  setError: UseFormSetError<T>,
  options?: {
    showToast?: boolean;
    fallbackMessage?: string;
  }
): void {
  const { showToast = true, fallbackMessage = "An error occurred" } = options || {};
  
  const apiError = error as ApiError;

  if (apiError?.message && Array.isArray(apiError.message)) {
    const fieldError = apiError.message.find((e: ValidationError) => e.path === fieldName);
    
    if (fieldError) {
      const translatedMessage = getTranslatedMessage(fieldError.message);
      setError(fieldName, {
        type: "manual",
        message: translatedMessage,
      });
      
      if (showToast) {
        toast.error(translatedMessage);
      }
      return;
    }
    
    const firstError = apiError.message[0];
    const errorMessage = firstError?.message || fallbackMessage;
    const translatedMessage = getTranslatedMessage(errorMessage);
    
    setError(fieldName, {
      type: "manual",
      message: translatedMessage,
    });
    
    if (showToast) {
      toast.error(translatedMessage);
    }
    return;
  }

  const errorMessage = error instanceof Error ? error.message : fallbackMessage;
  setError(fieldName, {
    type: "manual",
    message: errorMessage,
  });
  
  if (showToast) {
    toast.error(errorMessage);
  }
}
