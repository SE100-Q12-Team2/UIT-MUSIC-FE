// ListeningHistory types (should be expanded as needed)
export interface ListeningHistory {
  id: number;
  userId: number;
  songId: number;
  playedAt: string;
  durationListened?: number;
  audioQuality?: string;
  deviceInfo?: string;
  // ...song, album, artists, etc. for details
}

export interface ListeningHistoryQuery {
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
  songId?: number;
}

export interface ListeningHistoryStatsQuery {
  period?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  startDate?: string;
  endDate?: string;
}

export interface TrackSongRequest {
  songId: number;
  durationListened?: number;
  audioQuality?: string;
  deviceInfo?: string;
}

export interface TrackSongResponse {
  id: number;
  playedAt: string;
}

export interface RecentlyPlayedSong {
  songId: number;
  title: string;
  coverImageUrl?: string;
  lastPlayedAt: string;
  playCount: number;
  artists: { id: number; name: string }[];
}

export interface RecentlyPlayedResponse {
  data: RecentlyPlayedSong[];
  totalItems: number;
}

export interface ListeningHistoryStats {
  totalListeningTime: number;
  totalSongsPlayed: number;
  averageListeningTime: number;
  topGenres: { genre: string; count: number; percentage: number }[];
  topArtists: { artistId: number; artistName: string; playCount: number }[];
  topSongs: { songId: number; songTitle: string; playCount: number; totalDuration: number }[];
  listeningByHour: { hour: number; count: number }[];
  listeningByDay: { date: string; count: number; totalDuration: number }[];
}