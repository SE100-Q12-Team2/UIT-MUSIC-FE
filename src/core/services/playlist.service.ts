import React from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
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
    const response = await api.get<Playlist[] | { data: Playlist[] }>('/playlists', {
      params: { ownerId },
    });
    // Handle both direct array and object with data property
    const playlists = Array.isArray(response) ? response : (response.data || []);
    return playlists;
  },

  // Get tracks in a playlist
  getPlaylistTracks: async (playlistId: number): Promise<PlaylistTrack[]> => {
    const response = await api.get<PlaylistTrack[] | { data: PlaylistTrack[] }>(`/playlists/${playlistId}/tracks`);
    // Handle both direct array and object with data property
    const tracks = Array.isArray(response) ? response : (response.data || []);
    return tracks;
  },

  // Get track count for multiple playlists
  getPlaylistsWithTrackCounts: async (ownerId: number): Promise<(Playlist & { trackCount: number })[]> => {
    const response = await api.get<Playlist[] | { data: Playlist[] }>('/playlists', {
      params: { ownerId },
    });
    
    // Handle both direct array and object with data property
    const playlists = Array.isArray(response) ? response : (response.data || []);
    
    // If no playlists, return empty array
    if (!Array.isArray(playlists) || playlists.length === 0) {
      return [];
    }
    
    // Fetch track counts for all playlists
    const playlistsWithCounts = await Promise.all(
      playlists.map(async (playlist) => {
        const tracksResponse = await api.get<PlaylistTrack[] | { data: PlaylistTrack[] }>(`/playlists/${playlist.id}/tracks`);
        const tracks = Array.isArray(tracksResponse) ? tracksResponse : (tracksResponse.data || []);
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
    const response = await api.get<Playlist[] | { data: Playlist[] }>('/playlists', {
      params: { ownerId },
    });
    
    // Handle both direct array and object with data property
    const playlists = Array.isArray(response) ? response : (response.data || []);
    const allSongIds = new Set<number>();
    
    // If no playlists, return empty set
    if (!Array.isArray(playlists) || playlists.length === 0) {
      return allSongIds;
    }
    
    // Fetch all tracks from all playlists
    await Promise.all(
      playlists.map(async (playlist) => {
        const tracksResponse = await api.get<PlaylistTrack[] | { data: PlaylistTrack[] }>(`/playlists/${playlist.id}/tracks`);
        const tracks = Array.isArray(tracksResponse) ? tracksResponse : (tracksResponse.data || []);
        tracks.forEach(track => allSongIds.add(track.songId));
      })
    );
    
    return allSongIds;
  },

  // Create a new playlist
  createPlaylist: async (data: {
    userId: number;
    playlistName: string;
    description?: string;
    coverImageUrl?: string;
    isPublic?: boolean;
    tags?: string[];
  }): Promise<Playlist> => {
    return api.post<Playlist>('/playlists', data);
  },

  // Add a track to a playlist
  addTrackToPlaylist: async (playlistId: number, trackId: number): Promise<void> => {
    return api.post<void>(`/playlists/${playlistId}/tracks`, { trackId });
  },

  // Remove a track from a playlist
  removeTrackFromPlaylist: async (playlistId: number, trackId: number): Promise<void> => {
    return api.delete<void>(`/playlists/${playlistId}/tracks/${trackId}`);
  },
};

// Hook to get a single playlist with its tracks
export const usePlaylist = (id: string) => {
  const playlistId = id ? parseInt(id, 10) : null;
  
  // Get all playlists to find the one we need
  const { data: playlists, isLoading: playlistsLoading } = usePlaylists();
  
  // Get tracks for this playlist
  const { data: tracks, isLoading: tracksLoading } = usePlaylistTracks(playlistId || 0);
  
  // Combine data using useMemo to create PlaylistDetail
  const playlistDetail = React.useMemo(() => {
    if (!playlistId || !playlists || !tracks) return null;
    
    // Find the playlist from the list
    const playlist = playlists.find(p => p.id === playlistId);
    if (!playlist) return null;
    
    // Convert tracks to songs format
    const songs: PlaylistSong[] = tracks.map(track => {
      const playlistSong = track.song;
      return {
        id: playlistSong.id,
        title: playlistSong.title,
        description: '',
        duration: playlistSong.duration,
        language: '',
        lyrics: '',
        albumId: playlistSong.album?.id || 0,
        genreId: 0,
        labelId: 0,
        uploadDate: '',
        isActive: true,
        copyrightStatus: 'Clear' as const,
        playCount: 0,
        isFavorite: false,
        songArtists: playlistSong.songArtists.map(sa => ({
          artistId: sa.artist.id,
          songId: playlistSong.id,
          role: 'MainArtist' as const,
          artist: {
            id: sa.artist.id,
            artistName: sa.artist.artistName,
            profileImage: '',
          },
        })),
        album: playlistSong.album ? {
          id: playlistSong.album.id,
          albumTitle: playlistSong.album.albumTitle,
          coverImage: '',
        } : {
          id: 0,
          albumTitle: '',
          coverImage: '',
        },
        genre: {
          id: 0,
          genreName: '',
        },
        label: {
          id: 0,
          labelName: '',
        },
      } as PlaylistSong;
    });
    
    // Return PlaylistDetail
    return {
      ...playlist,
      coverUrl: playlist.coverImageUrl,
      name: playlist.playlistName,
      trackCount: songs.length,
      songs,
    } as PlaylistDetail;
  }, [playlistId, playlists, tracks]);
  
  return {
    data: playlistDetail,
    isLoading: playlistsLoading || tracksLoading,
    error: null,
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

// Mutation hook to create a new playlist
export const useCreatePlaylist = () => {
  const queryClient = useQueryClient();
  const profileId = useProfileStore((state) => state.profile?.id);

  return useMutation({
    mutationFn: (data: Parameters<typeof playlistService.createPlaylist>[0]) =>
      playlistService.createPlaylist(data),
    onSuccess: () => {
      // Invalidate playlists queries to refresh the list
      queryClient.invalidateQueries({ queryKey: ['playlists-with-counts', profileId] });
      queryClient.invalidateQueries({ queryKey: ['all-playlist-song-ids', profileId] });
    },
  });
};

// Mutation hook to add a track to a playlist
export const useAddTrackToPlaylist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ playlistId, trackId }: { playlistId: number; trackId: number }) =>
      playlistService.addTrackToPlaylist(playlistId, trackId),
    onSuccess: (_, variables) => {
      // Invalidate specific playlist tracks query
      queryClient.invalidateQueries({ queryKey: ['playlist-tracks', variables.playlistId] });
      queryClient.invalidateQueries({ queryKey: ['all-playlist-song-ids'] });
    },
  });
};

// Mutation hook to remove a track from a playlist
export const useRemoveTrackFromPlaylist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ playlistId, trackId }: { playlistId: number; trackId: number }) =>
      playlistService.removeTrackFromPlaylist(playlistId, trackId),
    onSuccess: (_, variables) => {
      // Invalidate specific playlist tracks query
      queryClient.invalidateQueries({ queryKey: ['playlist-tracks', variables.playlistId] });
      queryClient.invalidateQueries({ queryKey: ['all-playlist-song-ids'] });
    },
  });
};
