import api from '@/config/api.config';

export interface PlaybackUrlResponse {
  ok: boolean;
  url?: string;
  type?: string;
  mime?: string;
  quality?: string;
  reason?: string;
}

export interface PlaybackOptions {
  quality?: 'hls' | '320' | '128';
}

export const playbackApi = {
  getPlaybackUrl: async (
    songId: number,
    options: PlaybackOptions = {}
  ): Promise<PlaybackUrlResponse> => {
    const { quality = 'hls' } = options;
    return api.get<PlaybackUrlResponse>(`/playback/track/${songId}`, {
      params: { quality },
    });
  },
};