import { Song } from "@/types/song.types";

export interface PlaylistSongRelation {
  id: number;
  playlistId: number;
  songId: number;
  position: number;
  addedAt: string;
  song: Song;
}

export interface Playlist {
  id: number;
  userId: number;
  playlistName: string;
  description: string | null;
  tags: string[];
  coverImageUrl: string | null;
  playlistSongs?: PlaylistSongRelation[];
  isFavorite: boolean;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

// Artist info in track response (from BE /playlists/:id/tracks)
export interface TrackArtist {
  label: {
    id: number;
    labelName: string;
  };
}

// Album info in track response (from BE /playlists/:id/tracks)
export interface TrackAlbum {
  id: number;
  albumTitle: string;
  coverImage?: string;
}

// Song info embedded in playlist track response (from BE /playlists/:id/tracks)
export interface TrackSong {
  id: number;
  title: string;
  duration: number;
  album: TrackAlbum | null;
  contributors: TrackArtist[];
  asset?: {
    id: number;
    bucket: string;
    keyMaster: string;
  };
}

// PlaylistTrack response from GET /playlists/:id/tracks
export interface PlaylistTrack {
  id: number;
  playlistId: number;
  songId: number;
  position: number;
  addedAt: string;
  song: TrackSong;
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