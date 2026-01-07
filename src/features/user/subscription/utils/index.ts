import { ApiError } from "@/features/auth/utils/handleApiError";
import { ERROR_MESSAGE_MAP } from "@/features/user/subscription/constants";
import { toast } from "sonner";

export const getTranslatedMessage = (message: string): string => {
  return ERROR_MESSAGE_MAP[message] || message;
};

export const handleSubscriptionError = (error: unknown): void => {
  const apiError = error as ApiError;

  // Handle array of validation errors
  if (apiError?.message && Array.isArray(apiError.message)) {
    const firstError = apiError.message[0];
    if (firstError?.message) {
      const translatedMessage = getTranslatedMessage(firstError.message);
      toast.error(translatedMessage);
      return;
    }
  }

  // Handle nested response.data.message array
  if (apiError?.response?.data?.message && Array.isArray(apiError.response.data.message)) {
    const firstError = apiError.response.data.message[0];
    if (firstError?.message) {
      const translatedMessage = getTranslatedMessage(firstError.message);
      toast.error(translatedMessage);
      return;
    }
  }

  // Handle string message
  if (typeof apiError?.message === 'string') {
    const translatedMessage = getTranslatedMessage(apiError.message);
    toast.error(translatedMessage);
    return;
  }

  // Handle nested string message
  if (typeof apiError?.response?.data?.message === 'string') {
    const translatedMessage = getTranslatedMessage(apiError.response.data.message);
    toast.error(translatedMessage);
    return;
  }

  // Fallback message
  toast.error("Failed to subscribe. Please try again.");
};
