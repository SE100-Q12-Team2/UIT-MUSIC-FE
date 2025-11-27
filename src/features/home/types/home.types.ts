
export interface Song {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration: string;
  coverUrl: string;
  isLiked?: boolean;
}

export interface Playlist {
  id: string;
  title: string;
  subtitle?: string; 
  coverUrl: string;
  type?: 'playlist' | 'album' | 'artist';
}

export interface Artist {
  id: string;
  name: string;
  imageUrl: string;
}

export interface SectionProps {
  title: string;
  actionText?: string;
  children: React.ReactNode;
}