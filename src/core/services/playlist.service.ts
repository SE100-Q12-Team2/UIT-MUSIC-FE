import React from 'react';
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
