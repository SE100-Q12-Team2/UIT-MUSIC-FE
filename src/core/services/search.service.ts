import api from '@/config/api.config';
import { useQuery } from '@tanstack/react-query';

// ==================== Types ====================

export interface SearchResult {
  songs?: {
    items: any[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  albums?: {
    items: any[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  artists?: {
    items: any[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  playlists?: {
    items: any[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface SearchSuggestion {
  type: 'song' | 'artist' | 'album' | 'playlist';
  id: number;
  text: string;
}

export interface SearchSuggestionsResponse {
  suggestions: SearchSuggestion[];
}

export interface TrendingSearch {
  id: number;
  text: string;
  type: 'song' | 'artist' | 'album' | 'playlist';
  artists?: string[];
}

export interface TrendingSearchesResponse {
  trending: TrendingSearch[];
}

export interface SearchQueryParams {
  q: string;
  type?: 'song' | 'album' | 'artist' | 'playlist' | 'all';
  limit?: number;
  offset?: number;
  page?: number;
}

export interface SearchSuggestionsParams {
  query: string;
  limit?: number;
}

// ==================== Service ====================

export const searchService = {
  // Global search
  search: async (params: SearchQueryParams): Promise<SearchResult> => {
    return api.get<SearchResult>('/search', { params });
  },

  // Get search suggestions
  getSuggestions: async (params: SearchSuggestionsParams): Promise<SearchSuggestionsResponse> => {
    return api.get<SearchSuggestionsResponse>('/search/suggestions', { params });
  },

  // Get trending searches
  getTrendingSearches: async (limit?: number): Promise<TrendingSearchesResponse> => {
    return api.get<TrendingSearchesResponse>('/search/trending', {
      params: { limit },
    });
  },
};

// ==================== React Query Hooks ====================

const QUERY_KEYS = {
  search: {
    all: ['search'] as const,
    query: (params: SearchQueryParams) => ['search', 'query', params] as const,
    suggestions: (params: SearchSuggestionsParams) => ['search', 'suggestions', params] as const,
    trending: (limit?: number) => ['search', 'trending', limit] as const,
  },
};

export const useSearch = (params: SearchQueryParams) => {
  return useQuery({
    queryKey: QUERY_KEYS.search.query(params),
    queryFn: () => searchService.search(params),
    enabled: !!params.q && params.q.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useSearchSuggestions = (params: SearchSuggestionsParams) => {
  return useQuery({
    queryKey: QUERY_KEYS.search.suggestions(params),
    queryFn: () => searchService.getSuggestions(params),
    enabled: !!params.query && params.query.length >= 2,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

export const useTrendingSearches = (limit?: number) => {
  return useQuery({
    queryKey: QUERY_KEYS.search.trending(limit),
    queryFn: () => searchService.getTrendingSearches(limit),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};
