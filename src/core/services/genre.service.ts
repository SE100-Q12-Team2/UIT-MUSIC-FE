import { useQuery } from '@tanstack/react-query';
import api from '@/config/api.config';

export interface Genre {
  id: number;
  genreName: string;
  description?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface GenresResponse {
  items: Genre[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GenresQuery {
  page?: number;
  limit?: number;
  q?: string;
}

const genreService = {
  getGenres: async (query?: GenresQuery): Promise<GenresResponse> => {
    return api.get<GenresResponse>('/genres', { params: query });
  },

  getGenreById: async (id: number): Promise<Genre> => {
    return api.get<Genre>(`/genres/${id}`);
  },
};

export const useGenres = (query?: GenresQuery) => {
  return useQuery({
    queryKey: ['genres', query],
    queryFn: () => genreService.getGenres(query),
    enabled: true,
  });
};

export const useGenre = (id: number | undefined) => {
  return useQuery({
    queryKey: ['genres', id],
    queryFn: () => genreService.getGenreById(id!),
    enabled: !!id && id > 0,
  });
};

export default genreService;

