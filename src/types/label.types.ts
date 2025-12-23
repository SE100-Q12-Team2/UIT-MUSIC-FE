// Record Label types
export interface RecordLabel {
  id: number;
  userId: number;
  labelName: string;
  description: string;
  website: string;
  contactEmail: string;
  hasPublicProfile: boolean;
  createdAt: string;
  user: {
    id: number;
    email: string;
    fullName: string;
  };
  _count: {
    albums: number;
    songs: number;
  };
}

export interface UpdateLabelRequest {
  labelName: string;
  description: string;
  website: string;
  contactEmail: string;
  hasPublicProfile: boolean;
}

export interface RecordLabelsResponse {
  items: RecordLabel[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Album types for label
export interface LabelAlbumSongArtist {
  role: string;
  artist: {
    id: number;
    artistName: string;
    profileImage: string;
  };
}

export interface LabelAlbumSong {
  id: number;
  title: string;
  duration: number;
  playCount: number;
  uploadDate: string;
  songArtists: LabelAlbumSongArtist[];
}

export interface LabelAlbum {
  id: number;
  albumTitle: string;
  albumDescription: string;
  coverImage: string;
  releaseDate: string;
  labelId: number;
  totalTracks: number;
  createdAt: string;
  updatedAt: string;
  label: {
    id: number;
    labelName: string;
    hasPublicProfile: boolean;
  };
  songs: LabelAlbumSong[];
  _count: {
    songs: number;
  };
}

export interface LabelAlbumsResponse {
  items: LabelAlbum[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Song types for label (reusing from song.service.ts structure)
export interface LabelSongArtist {
  artistId: number;
  songId: number;
  role: 'MainArtist' | 'FeaturedArtist' | 'Composer' | 'Producer';
  artist: {
    id: number;
    artistName: string;
    profileImage: string;
  };
}

export interface LabelSongAlbum {
  id: number;
  albumTitle: string;
  coverImage: string;
}

export interface LabelSongGenre {
  id: number;
  genreName: string;
}

export interface LabelSongLabel {
  id: number;
  labelName: string;
}

export interface LabelSongAsset {
  id: number;
  bucket: string;
  keyMaster: string;
}

export interface LabelSong {
  id: number;
  title: string;
  description: string;
  duration: number;
  language: string;
  lyrics: string;
  albumId: number;
  genreId: number;
  labelId: number;
  uploadDate: string;
  isActive: boolean;
  copyrightStatus: 'Clear' | 'Pending' | 'Disputed';
  playCount: number;
  isFavorite: boolean;
  songArtists: LabelSongArtist[];
  album: LabelSongAlbum;
  genre: LabelSongGenre;
  label: LabelSongLabel;
  asset: LabelSongAsset;
}

export interface LabelSongsResponse {
  items: LabelSong[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
