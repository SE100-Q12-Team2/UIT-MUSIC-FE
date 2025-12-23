import { useQuery } from '@tanstack/react-query';
import api from '@/config/api.config';
import { Playlist, PlaylistTrack } from '@/types/playlist.types';
import { useProfileStore } from '@/store/profileStore';
import { Song } from '@/core/services/song.service';

// Extended Playlist type for compatibility with legacy code
interface ExtendedPlaylist extends Playlist {
  coverUrl?: string;
  name?: string;
  trackCount?: number;
}

// Extended Song type for playlist songs (intersection type to avoid conflicts)
export type PlaylistSong = Song & {
  coverUrl?: string;
  artist?: string;
  album?: string | Song['album'];
  audioUrl?: string;
}

// PlaylistDetail type for PlaylistPage
export interface PlaylistDetail extends ExtendedPlaylist {
  songs: PlaylistSong[];
}

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

// Legacy hook placeholder for detail playlist (used by PlaylistPage)
// Hiện tại backend chưa có API detail playlist riêng, nên ta chỉ dùng mock ở dev.
// Hook này chỉ để tránh lỗi import khi build.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const usePlaylist = (_id: string) => {
  return {
    data: undefined,
    isLoading: false,
    error: null,
  } as {
    data: unknown;
    isLoading: boolean;
    error: unknown;
  };
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
