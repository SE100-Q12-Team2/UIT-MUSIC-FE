import { useQuery } from '@tanstack/react-query';
import api from '@/config/api.config';
import {
  RecordLabel,
  RecordLabelsResponse,
  LabelAlbumsResponse,
  LabelSongsResponse,
} from '@/types/label.types';

export const labelService = {
  // Get record labels for a user
  getRecordLabels: async (userId: number): Promise<RecordLabel[]> => {
    const response = await api.get<RecordLabelsResponse>('/record-labels', {
      params: { userId },
    });
    return response.items;
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
