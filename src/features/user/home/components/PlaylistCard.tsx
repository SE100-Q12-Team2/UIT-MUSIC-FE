import React from 'react';
import { useNavigate } from 'react-router';
import { Play } from 'lucide-react';
import { Playlist } from '@/types/playlist.types';

interface PlaylistCardProps {
  playlist: Playlist;
}

const PlaylistCard: React.FC<PlaylistCardProps> = ({ playlist }) => {
  const navigate = useNavigate();

  return (
    <div
      className="group cursor-pointer"
      onClick={() => navigate(`/playlists/${playlist.id}`)}
    >
      <div className="relative aspect-square rounded-lg overflow-hidden bg-vio-800 mb-3">
        <img
          src={playlist.coverImageUrl || 'https://via.placeholder.com/300'}
          alt={playlist.playlistName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-vio-accent flex items-center justify-center">
            <Play size={24} fill="white" className="text-white" />
          </div>
        </div>
      </div>
      <h3 className="text-white font-medium truncate">{playlist.playlistName}</h3>
      <p className="text-sm text-gray-400">Playlist</p>
    </div>
  );
};

export default PlaylistCard;

