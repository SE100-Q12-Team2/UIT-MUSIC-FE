import { CopyRightStatus } from "@/core/constants/song.constant";

export interface Contributor {
  labelId: number;
  songId: number;
  role: string;
  label: {
    id: number;
    artistName: string;
    labelName: string | null;
  };
}

export interface Song {
  id: number;
  title: string;
  description?: string | null;
  duration: number;
  language: string | null;
  lyrics: string | null;
  albumId: number | null;
  genreId: number | null;
  labelId: number | null;
  uploadDate: string;
  isActive: boolean;
  copyrightStatus: CopyRightStatus;
  playCount: number;
  contributors: Contributor[];
  album: SongAlbum;
  genre: SongGenre;
  label: SongLabel;
  asset?: SongAsset;
  favorites: any[];
}

// Trending song from API GET /songs/trending
export interface TrendingSong {
  id: number;
  title: string;
  description: string | null;
  duration: number;
  language: string | null;
  lyrics: string | null;
  albumId: number;
  genreId: number;
  labelId: number;
  uploadDate: string;
  isActive: boolean;
  copyrightStatus: 'Clear' | 'Disputed' | 'Violation';
  playCount: number;
  contributors: TrendingSongContributor[];
  album: SongAlbum;
  genre: SongGenre;
  label: SongLabel;
  asset?: SongAsset;
  favorites: any[];
}


// Artist info embedded in song
export interface SongArtist {
  id: number;
  artistName: string;
  profileImage: string;
}

// Song artist with role
export interface SongArtistWithRole {
  artistId: number;
  songId: number;
  role: 'MainArtist' | 'FeaturedArtist' | 'Composer' | 'Producer';
  artist: SongArtist;
}

// Album info
export interface SongAlbum {
  id: number;
  albumTitle: string;
  coverImage: string;
}

// Genre info
export interface SongGenre {
  id: number;
  genreName: string;
}

// Label info
export interface SongLabel {
  id: number;
  labelName: string;
}

// Asset info
export interface SongAsset {
  id: number;
  bucket: string;
  keyMaster: string;
}


// Contributor info for trending songs
export interface TrendingSongContributor {
  songId: number;
  labelId: number;
  role: string;
  label: SongLabel;
}

// Trending song from API GET /songs/trending
export interface TrendingSong {
  id: number;
  title: string;
  description: string | null;
  duration: number;
  language: string | null;
  lyrics: string | null;
  albumId: number;
  genreId: number;
  labelId: number;
  uploadDate: string;
  isActive: boolean;
  copyrightStatus: 'Clear' | 'Disputed' | 'Violation';
  playCount: number;
  contributors: TrendingSongContributor[];
  album: SongAlbum;
  genre: SongGenre;
  label: SongLabel;
  asset?: SongAsset;
  favorites: any[];
}

export interface SongFilters {
  page?: number;
  limit?: number;
  order?: 'latest' | 'oldest' | 'popular';
}

export interface SongsResponse {
  items: Song[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface TrendingSongsResponse {
  items: TrendingSong[];
}

export interface TrendingSongsQuery {
  limit?: number; // optional, default: 10, max: 50
  genreId?: number; // optional
}
