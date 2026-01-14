import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/config/api.config';
import {
  RecordLabel,
  RecordLabelsResponse,
  LabelAlbumsResponse,
  LabelSongsResponse,
  UpdateLabelRequest,
  CreateLabelRequest,
  ManagedArtistsResponse,
  AddArtistToCompanyRequest,
} from '@/types/label.types';

export const labelService = {
  // Get record labels for a user
  getRecordLabels: async (userId: number): Promise<RecordLabel[]> => {
    const response = await api.get<RecordLabelsResponse>('/record-labels', {
      params: { userId },
    });
    return response.items;
  },

  // Get a specific record label by ID
  getRecordLabelById: async (labelId: number): Promise<RecordLabel> => {
    return api.get<RecordLabel>(`/record-labels/${labelId}`);
  },

  createLabel: async (data: CreateLabelRequest): Promise<RecordLabel> => {
    return api.post<RecordLabel>('/record-labels', data);
  },

  // Get albums for a label
  getLabelAlbums: async (labelId: number, page = 1, limit = 10): Promise<LabelAlbumsResponse> => {
    return api.get<LabelAlbumsResponse>('/albums', {
      params: { labelId, page, limit },
    });
  },

  // Get songs for a label
  getLabelSongs: async (labelId: number, page = 1, limit = 10): Promise<LabelSongsResponse> => {
    return api.get<LabelSongsResponse>('/songs', {
      params: { labelId, page, limit },
    });
  },

  // Update label profile
  updateLabel: async (labelId: number, data: UpdateLabelRequest): Promise<RecordLabel> => {
    const response = await api.put<RecordLabel>(`/record-labels/${labelId}`, data);
    return response;
  },

  getManagedArtists: async (companyId: number, page = 1, limit = 20, search?: string): Promise<ManagedArtistsResponse> => {
    return api.get<ManagedArtistsResponse>(`/record-labels/${companyId}/managed-artists`, {
      params: { page, limit, search },
    });
  },

  addArtistToCompany: async (companyId: number, data: AddArtistToCompanyRequest): Promise<void> => {
    return api.post(`/record-labels/${companyId}/managed-artists`, data);
  },

  removeArtistFromCompany: async (companyId: number, artistId: number): Promise<void> => {
    return api.delete(`/record-labels/${companyId}/managed-artists/${artistId}`);
  },
};

// React Query hook for record labels
export const useRecordLabels = (userId: number | undefined) => {
  return useQuery({
    queryKey: ['record-labels', userId],
    queryFn: () => {
      if (!userId) throw new Error('User ID not available');
      return labelService.getRecordLabels(userId);
    },
    enabled: !!userId,
  });
};

// React Query hook for label albums
export const useLabelAlbums = (labelId: number | undefined, page = 1, limit = 10) => {
  return useQuery({
    queryKey: ['label-albums', labelId, page, limit],
    queryFn: () => {
      if (!labelId) throw new Error('Label ID not available');
      return labelService.getLabelAlbums(labelId, page, limit);
    },
    enabled: !!labelId,
  });
};

// React Query hook for label songs
export const useLabelSongs = (labelId: number | undefined, page = 1, limit = 10) => {
  return useQuery({
    queryKey: ['label-songs', labelId, page, limit],
    queryFn: () => {
      if (!labelId) throw new Error('Label ID not available');
      return labelService.getLabelSongs(labelId, page, limit);
    },
    enabled: !!labelId,
    retry: false, // Don't retry on error
  });
};

// React Query hook for updating label
export const useUpdateLabel = () => {
  const queryClient = useQueryClient();
  
  return useMutation<RecordLabel, Error, { labelId: number; data: UpdateLabelRequest }>({
    mutationFn: ({ labelId, data }) => labelService.updateLabel(labelId, data),
    onSuccess: (data, variables) => {
      // Invalidate and refetch label data
      queryClient.invalidateQueries({ queryKey: ['record-labels'] });
      queryClient.setQueryData(['record-labels', variables.labelId], data);
    },
  });
};

// React Query hook for getting a specific record label
export const useRecordLabel = (labelId: number | undefined) => {
  return useQuery({
    queryKey: ['record-label', labelId],
    queryFn: () => {
      if (!labelId) throw new Error('Label ID not available');
      return labelService.getRecordLabelById(labelId);
    },
    enabled: !!labelId,
  });
};

export const useCreateLabel = () => {
  const queryClient = useQueryClient();
  
  return useMutation<RecordLabel, Error, CreateLabelRequest>({
    mutationFn: (data) => labelService.createLabel(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['record-labels'] });
    },
  });
};

export const useManagedArtists = (companyId: number | undefined, page = 1, limit = 20, search?: string) => {
  return useQuery({
    queryKey: ['managed-artists', companyId, page, limit, search],
    queryFn: () => {
      if (!companyId) throw new Error('Company ID not available');
      return labelService.getManagedArtists(companyId, page, limit, search);
    },
    enabled: !!companyId,
  });
};

export const useAddArtistToCompany = () => {
  const queryClient = useQueryClient();
  
  return useMutation<void, Error, { companyId: number; data: AddArtistToCompanyRequest }>({
    mutationFn: ({ companyId, data }) => labelService.addArtistToCompany(companyId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['managed-artists', variables.companyId] });
      queryClient.invalidateQueries({ queryKey: ['record-label', variables.companyId] });
    },
  });
};

export const useRemoveArtistFromCompany = () => {
  const queryClient = useQueryClient();
  
  return useMutation<void, Error, { companyId: number; artistId: number }>({
    mutationFn: ({ companyId, artistId }) => labelService.removeArtistFromCompany(companyId, artistId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['managed-artists', variables.companyId] });
      queryClient.invalidateQueries({ queryKey: ['record-label', variables.companyId] });
    },
  });
};
