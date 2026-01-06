// Recommendation types for FE, based on BE models

export interface RecommendationReason {
  score: number;
  reasons: string[];
}

export interface RecommendationSong {
  id: number;
  title: string;
  description?: string | null;
  duration: number;
  language?: string | null;
  lyrics?: string | null;
  albumId?: number | null;
  genreId?: number | null;
  labelId?: number;
  uploadDate?: string;
  isActive?: boolean;
  copyrightStatus?: 'Clear' | 'Disputed' | 'Violation';
  playCount?: number;
  isFavorite?: boolean;
  album?: {
    id: number;
    albumTitle: string;
    coverImage: string | null;
    totalTracks: number;
  } | null;
  genre?: {
    id: number;
    genreName: string;
  } | null;
  label?: {
    id: number;
    labelName: string;
  };
  asset?: {
    id: number;
    bucket: string;
    keyMaster: string;
  } | null;
  contributors?: Array<{
    labelId: number;
    songId: number;
    role: string;
    label: {
      id: number;
      artistName: string;
      labelName: string | null;
    };
  }>;
  recommendationScore?: number;
  recommendationReasons?: string[];
}

export interface RecommendationMix {
  id: string;
  title: string;
  description: string;
  songs: RecommendationSong[];
}
