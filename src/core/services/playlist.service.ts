import { useQuery } from '@tanstack/react-query';
import api from '@/config/api.config';
import { Playlist, PlaylistTrack } from '@/types/playlist.types';
import { useProfileStore } from '@/store/profileStore';

export const playlistService = {
  // Get all playlists for a user
  getPlaylists: async (ownerId: number): Promise<Playlist[]> => {
    // api.get already unwraps response.data.data, so we get array directly
    const playlists = await api.get<Playlist[]>('/playlists', {
      params: { ownerId },
    });
    return playlists;
  },

  // Get tracks in a playlist
  getPlaylistTracks: async (playlistId: number): Promise<PlaylistTrack[]> => {
    // api.get already unwraps response.data.data, so we get array directly
    const tracks = await api.get<PlaylistTrack[]>(`/playlists/${playlistId}/tracks`);
    return tracks;
  },
};

// React Query hook for user's playlists
export const usePlaylists = () => {
  const profileId = useProfileStore((state) => state.profile?.id);

  return useQuery({
    queryKey: ['playlists', profileId],
    queryFn: () => {
      if (!profileId) throw new Error('Profile ID not available');
      return playlistService.getPlaylists(profileId);
    },
    enabled: !!profileId, // Only fetch when profileId is available
  });
};

// React Query hook for playlist tracks
export const usePlaylistTracks = (playlistId: number) => {
  return useQuery({
    queryKey: ['playlist-tracks', playlistId],
    queryFn: () => playlistService.getPlaylistTracks(playlistId),
    enabled: !!playlistId,
  });
};
