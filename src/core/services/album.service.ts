import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/config/query.config';
import api from '@/config/api.config';

// Album info
export interface AlbumSong {
  id: number;
  title: string;
  duration: number;
  playCount: number;
  uploadDate: string;
  songArtists?: {
    role: string;
    artist: {
      id: number;
      artistName: string;
      profileImage: string | null;
    };
  }[];
}

export interface Album {
  id: number;
  albumTitle: string;
  albumDescription: string | null;
  coverImage: string | null;
  releaseDate: string | null;
  labelId: number | null;
  totalTracks: number;
  createdAt: string;
  updatedAt: string;
  songs?: AlbumSong[];
}

export interface AlbumsResponse {
  items: Album[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AlbumsQuery {
  page?: number;
  limit?: number;
  labelId?: number;
  search?: string;
  order?: 'latest' | 'oldest' | 'title' | 'releaseDate';
}

const albumService = {
  // Get all albums
  getAlbums: async (query?: AlbumsQuery): Promise<AlbumsResponse> => {
    return api.get<AlbumsResponse>('/albums', { params: query });
  },

  // Get album by ID
  getAlbum: async (albumId: number, includeSongs?: boolean): Promise<Album> => {
    return api.get<Album>(`/albums/${albumId}`, { 
      params: includeSongs ? { includeSongs: 'true' } : undefined 
    });
  },

  // Get albums by label
  getAlbumsByLabel: async (labelId: number): Promise<Album[]> => {
    return api.get<Album[]>(`/albums/label/${labelId}`);
  },
};

// React Query hook for fetching all albums
export const useAlbums = (query?: AlbumsQuery) => {
  return useQuery({
    queryKey: ['albums', query],
    queryFn: () => albumService.getAlbums(query),
    enabled: true,
  });
};

// React Query hook for fetching album by ID
export const useAlbumDetails = (albumId: number | undefined, includeSongs?: boolean) => {
  return useQuery({
    queryKey: QUERY_KEYS.albums.detail(albumId ?? 0),
    queryFn: () => albumService.getAlbum(albumId!, includeSongs),
    enabled: !!albumId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// React Query hook for fetching albums by label
export const useAlbumsByLabel = (labelId: number | undefined) => {
  return useQuery({
    queryKey: ['albums', 'label', labelId],
    queryFn: () => albumService.getAlbumsByLabel(labelId!),
    enabled: !!labelId && labelId > 0,
  });
};

export default albumService;
