import { useMutation } from '@tanstack/react-query';
import { contactApi, ContactFormRequest } from '@/core/api/contact.api';
import { MessageResponse } from '@/types/auth.types';
import { toast } from 'sonner';

export const useSubmitContactForm = () => {
  return useMutation<MessageResponse, Error, ContactFormRequest>({
    mutationFn: (data: ContactFormRequest) => contactApi.submitContactForm(data),
    onSuccess: () => {
      toast.success('Your message has been sent successfully! We will get back to you soon.');
    },
    onError: (error: any) => {
      // If API endpoint doesn't exist, show a helpful message
      if (error?.response?.status === 404) {
        toast.error('Contact form API endpoint is not available yet. Please contact support directly.');
      } else {
        toast.error(error?.response?.data?.message || 'Failed to send message. Please try again.');
      }
    },
  });
};

