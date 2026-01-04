import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/config/query.config';
import api from '@/config/api.config';

// Album info
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
}

const albumService = {
  // Get album by ID
  getAlbum: async (albumId: number): Promise<Album> => {
    return api.get<Album>(`/albums/${albumId}`);
  },
};

// React Query hook for fetching album by ID
export const useAlbumDetails = (albumId: number | undefined) => {
  return useQuery({
    queryKey: QUERY_KEYS.albums.detail(albumId ?? 0),
    queryFn: () => albumService.getAlbum(albumId!),
    enabled: !!albumId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export default albumService;
