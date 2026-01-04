import api from '@/config/api.config';

// Types should be defined or imported from BE model mapping
import { ApiResponse, PaginatedResponse } from '@/core/types';
import { ListeningHistory, ListeningHistoryQuery, ListeningHistoryStats, ListeningHistoryStatsQuery, RecentlyPlayedResponse, TrackSongRequest, TrackSongResponse } from '@/types/listening-history.api';


export const listeningHistoryApi = {
  // Track a song play
  trackSong: async (data: TrackSongRequest): Promise<ApiResponse<TrackSongResponse>> => {
    return api.post('/listening-history/track', data);
  },

  // Get paginated listening history
  getListeningHistory: async (query?: ListeningHistoryQuery): Promise<ApiResponse<PaginatedResponse<ListeningHistory>>> => {
    return api.get('/listening-history/my-history', { params: query });
  },

  // Get recently played songs
  getRecentlyPlayed: async (limit?: number): Promise<RecentlyPlayedResponse> => {
    return api.get<RecentlyPlayedResponse>('/listening-history/recently-played', { params: { limit } });
  },

  // Get listening statistics
  getListeningStats: async (query?: ListeningHistoryStatsQuery): Promise<ApiResponse<ListeningHistoryStats>> => {
    return api.get('/listening-history/stats', { params: query });
  },

  // Clear all listening history
  clearHistory: async (): Promise<ApiResponse<{ deletedCount: number }>> => {
    return api.delete('/listening-history/clear');
  },

  // Delete a specific history item
  deleteHistoryItem: async (id: number): Promise<ApiResponse<{ message: string }>> => {
    return api.delete(`/listening-history/${id}`);
  },
};
