import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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

  // Create album
  createAlbum: async (data: {
    albumTitle: string;
    albumDescription?: string;
    coverImage?: string;
    releaseDate?: string;
    totalTracks?: number;
  }): Promise<Album> => {
    return api.post<Album>('/albums', data);
  },

  // Update album
  updateAlbum: async (albumId: number, data: {
    albumTitle?: string;
    albumDescription?: string | null;
    coverImage?: string | null;
    releaseDate?: string | null;
    totalTracks?: number;
  }): Promise<Album> => {
    return api.put<Album>(`/albums/${albumId}`, data);
  },

  // Delete album
  deleteAlbum: async (albumId: number): Promise<void> => {
    return api.delete<void>(`/albums/${albumId}`);
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

// React Query mutation for creating album
export const useCreateAlbum = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      albumTitle: string;
      albumDescription?: string;
      coverImage?: string;
      releaseDate?: string;
      totalTracks?: number;
    }) => albumService.createAlbum(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['albums'] });
      queryClient.invalidateQueries({ queryKey: ['label-albums'] });
    },
  });
};

export const useUpdateAlbum = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ albumId, data }: {
      albumId: number;
      data: {
        albumTitle?: string;
        albumDescription?: string | null;
        coverImage?: string | null;
        releaseDate?: string | null;
        totalTracks?: number;
      };
    }) => albumService.updateAlbum(albumId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['albums'] });
      queryClient.invalidateQueries({ queryKey: ['label-albums'] });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.albums.detail(variables.albumId) });
    },
  });
};

export const useDeleteAlbum = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (albumId: number) => albumService.deleteAlbum(albumId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['albums'] });
      queryClient.invalidateQueries({ queryKey: ['label-albums'] });
    },
  });
};

export default albumService;
