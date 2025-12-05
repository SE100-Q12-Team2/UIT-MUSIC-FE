import { QueryClient, DefaultOptions } from '@tanstack/react-query';

const queryConfig: DefaultOptions = {
  queries: {
    refetchOnWindowFocus: false,
    retry: 1,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnMount: true,
  },
  mutations: {
    retry: 0,
  },
};

export const queryClient = new QueryClient({
  defaultOptions: queryConfig,
});

export const QUERY_KEYS = {
  auth: {
    user: ['auth', 'user'] as const,
    profile: ['auth', 'profile'] as const,
  },
  
  songs: {
    all: ['songs'] as const,
    list: (filters?: unknown) => ['songs', 'list', filters] as const,
    detail: (id: string) => ['songs', 'detail', id] as const,
    search: (query: string) => ['songs', 'search', query] as const,
  },
  
  albums: {
    all: ['albums'] as const,
    list: (filters?: unknown) => ['albums', 'list', filters] as const,
    detail: (id: string) => ['albums', 'detail', id] as const,
  },
  
  artists: {
    all: ['artists'] as const,
    list: (filters?: unknown) => ['artists', 'list', filters] as const,
    detail: (id: string) => ['artists', 'detail', id] as const,
  },
  
  playlists: {
    all: ['playlists'] as const,
    list: (filters?: unknown) => ['playlists', 'list', filters] as const,
    detail: (id: string) => ['playlists', 'detail', id] as const,
    user: (userId: string) => ['playlists', 'user', userId] as const,
  },
  
  user: {
    favorites: ['user', 'favorites'] as const,
    history: ['user', 'history'] as const,
    library: ['user', 'library'] as const,
  },
} as const;
