import { api } from '@/config/api.config';
import { useMutation } from '@tanstack/react-query';

// Types
export interface GenerateImageUploadUrlRequest {
  resource?: 'uploads' | 'products' | 'categories' | 'avatars';
  entityId?: string;
  fileName: string;
  contentType?: string;
}

export interface GenerateImageUploadUrlResponse {
  ok: boolean;
  presignedUrl: string;
  bucket: string;
  key: string;
  publicUrl: string;
  contentType: string;
  expiresIn: number;
}

// API Service
export const uploadService = {
  generateImageUploadUrl: async (data: GenerateImageUploadUrlRequest): Promise<GenerateImageUploadUrlResponse> => {
    const response = await api.post<GenerateImageUploadUrlResponse>('/upload/image/presigned-url', data);
    return response;
  },

  uploadImageToS3: async (presignedUrl: string, file: File): Promise<void> => {
    const response = await fetch(presignedUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
      },
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
    }

    console.log('✅ Upload successful:', response.status);
  },
};

// React Query Hooks
export const useGenerateImageUploadUrl = () => {
  return useMutation({
    mutationFn: (data: GenerateImageUploadUrlRequest) => uploadService.generateImageUploadUrl(data),
  });
};

export const useUploadAvatar = () => {
  const generateUrlMutation = useGenerateImageUploadUrl();

  return useMutation({
    mutationFn: async (file: File) => {
      console.log('🔄 Starting avatar upload for file:', file.name);
      
      // Step 1: Get presigned URL
      const urlData = await generateUrlMutation.mutateAsync({
        resource: 'avatars',
        fileName: file.name,
        contentType: file.type,
      });

      console.log('📝 Generated presigned URL:', {
        key: urlData.key,
        publicUrl: urlData.publicUrl,
      });

      // Step 2: Upload to S3
      await uploadService.uploadImageToS3(urlData.presignedUrl, file);

      console.log('✅ Avatar upload complete. Public URL:', urlData.publicUrl);

      // Return public URL
      return urlData.publicUrl;
    },
  });
};
