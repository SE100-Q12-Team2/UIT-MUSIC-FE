export interface Playlist {
  id: string;
  userId: string    
  playlistName: string   
  description: string    
  tags: string[]    
  coverImageUrl: string   
  isFavorite: boolean   
  isPublic: boolean    
  createdAt: string   
  updatedAt: string    
}