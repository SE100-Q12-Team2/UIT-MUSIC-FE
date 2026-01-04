export interface Playlist {
  id: number;
  userId: number;
  playlistName: string;
  description: string;
  tags: string[];
  coverImageUrl: string;
  isFavorite: boolean;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

// Artist info in song
export interface PlaylistSongArtist {
  artist: {
    id: number;
    artistName: string;
  };
}

// Album info in song
export interface PlaylistSongAlbum {
  id: number;
  albumTitle: string;
  coverImage: string;
}

// Song info embedded in playlist track
export interface PlaylistSong {
  id: number;
  title: string;
  duration: number;
  album: PlaylistSongAlbum | null;
  songArtists: PlaylistSongArtist[];
}

export interface PlaylistTrack {
  id: number;
  playlistId: number;
  songId: number;
  position: number;
  addedAt: string;
  song: PlaylistSong;
}

export interface PlaylistsResponse {
  data: Playlist[];
  page: number;
  totalPages: number;
  totalItems: number;
  limit: number;
}

export interface PlaylistTracksResponse {
  data: PlaylistTrack[];
  page: number;
  totalPages: number;
  totalItems: number;
  limit: number;
}