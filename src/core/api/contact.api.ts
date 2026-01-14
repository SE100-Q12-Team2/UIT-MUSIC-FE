import api from '@/config/api.config';
import { MessageResponse } from '@/types/auth.types';

export interface ContactFormRequest {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  message: string;
  agreePolicy: boolean;
}

export const contactApi = {
  // POST /contact - Submit contact form
  submitContactForm: async (data: ContactFormRequest): Promise<MessageResponse> => {
    return api.post<MessageResponse>('/contact', data);
  },
};

