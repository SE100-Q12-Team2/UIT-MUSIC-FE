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

  // Get track count for multiple playlists
  getPlaylistsWithTrackCounts: async (ownerId: number): Promise<(Playlist & { trackCount: number })[]> => {
    const playlists = await api.get<Playlist[]>('/playlists', {
      params: { ownerId },
    });
    
    // Fetch track counts for all playlists
    const playlistsWithCounts = await Promise.all(
      playlists.map(async (playlist) => {
        const tracks = await api.get<PlaylistTrack[]>(`/playlists/${playlist.id}/tracks`);
        return {
          ...playlist,
          trackCount: tracks.length,
        };
      })
    );
    
    return playlistsWithCounts;
  },
  
  // Get all song IDs from all user's playlists
  getAllPlaylistSongIds: async (ownerId: number): Promise<Set<number>> => {
    const playlists = await api.get<Playlist[]>('/playlists', {
      params: { ownerId },
    });
    
    const allSongIds = new Set<number>();
    
    // Fetch all tracks from all playlists
    await Promise.all(
      playlists.map(async (playlist) => {
        const tracks = await api.get<PlaylistTrack[]>(`/playlists/${playlist.id}/tracks`);
        tracks.forEach(track => allSongIds.add(track.songId));
      })
    );
    
    return allSongIds;
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

// React Query hook for user's playlists with track counts
export const usePlaylistsWithTrackCounts = () => {
  const profileId = useProfileStore((state) => state.profile?.id);

  return useQuery({
    queryKey: ['playlists-with-counts', profileId],
    queryFn: () => {
      if (!profileId) throw new Error('Profile ID not available');
      return playlistService.getPlaylistsWithTrackCounts(profileId);
    },
    enabled: !!profileId,
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

// React Query hook to get all song IDs in user's playlists
export const useAllPlaylistSongIds = () => {
  const profileId = useProfileStore((state) => state.profile?.id);

  return useQuery({
    queryKey: ['all-playlist-song-ids', profileId],
    queryFn: () => {
      if (!profileId) throw new Error('Profile ID not available');
      return playlistService.getAllPlaylistSongIds(profileId);
    },
    enabled: !!profileId,
  });
};
