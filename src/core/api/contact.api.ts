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
  // NOTE: This endpoint is NOT in api-json.json yet
  // TODO: Add this endpoint to backend API
  submitContactForm: async (data: ContactFormRequest): Promise<MessageResponse> => {
    // This will fail until the endpoint is added to backend
    return api.post<MessageResponse>('/contact', data);
  },
};

