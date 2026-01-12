import React, { useState } from 'react';
import { usePlaylistsWithTrackCounts, playlistService, useAllPlaylistSongIds } from '@/core/services/playlist.service';
import { useTrendingSongs } from '@/core/services/song.service';
import { useToggleFavorite, useCheckFavorite } from '@/core/services/favorite.service';
import { useProfileStore } from '@/store/profileStore';
import { Playlist } from '@/types/playlist.types';
import { useQueryClient } from '@tanstack/react-query';
import {
  PlaylistDetail,
  CreatePlaylistModal,
} from '../components';
import '@/styles/user-playlists.css';
import { toast } from 'sonner';

// Grid Section Component
const GridSection: React.FC<{
  title: string;
  items: Playlist[];
  renderItem: (item: Playlist, index: number) => React.ReactNode;
}> = ({ title, items, renderItem }) => {
  return (
    <div className="user-playlist__section">
      <div className="user-playlist__section-header">
        <h2 className="user-playlist__section-title">{title}</h2>
      </div>
      <div className="user-playlist__grid">
        {items.map((item, index) => renderItem(item, index))}
      </div>
    </div>
  );
};

// Playlist Card Component
const PlaylistCard: React.FC<{
  playlist: Playlist;
  onClick: () => void;
}> = ({ playlist, onClick }) => {
  return (
    <div className="playlist-card" onClick={onClick}>
      <div className="playlist-card__image-wrapper">
        <img
          src={playlist.coverImageUrl || '/placeholder-playlist.png'}
          alt={playlist.playlistName}
          className="playlist-card__image"
        />
        <div className="playlist-card__overlay">
          <button className="playlist-card__play-btn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>
        </div>
      </div>
      <div className="playlist-card__info">
        <h3 className="playlist-card__title">{playlist.playlistName}</h3>
        <p className="playlist-card__meta">{playlist.playlistSongs?.length || 0} Tracks</p>
      </div>
      <button className="playlist-card__favorite">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      </button>
    </div>
  );
};

// Track List Item Component
interface TrackInfo {
  id: number;
  title: string;
  artist: string;
  album?: string;
  coverImage?: string;
  duration: number;
}

const TrackListItem: React.FC<{
  track: TrackInfo;
  onAddToPlaylist: () => void;
  onRemoveFromPlaylists: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  isInPlaylist: boolean;
}> = ({ track, onAddToPlaylist, onRemoveFromPlaylists, isFavorite, onToggleFavorite, isInPlaylist }) => {
  return (
    <div className="track-list-item">
      <div className="track-list-item__image-wrapper">
        <img
          src={track.coverImage || '/placeholder-song.png'}
          alt={track.title}
          className="track-list-item__image"
        />
      </div>
      <div className="track-list-item__info">
        <h4 className="track-list-item__title">{track.title}</h4>
        <p className="track-list-item__artist">{track.artist}</p>
      </div>
      <span className="track-list-item__album">{track.album || 'Unknown Album'}</span>
      <span className="track-list-item__duration">
        {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}
      </span>
      <div className="track-list-item__actions">
        <button 
          className={`track-list-item__favorite ${isFavorite ? 'is-favorite' : ''}`}
          onClick={onToggleFavorite}
          title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
        <button 
          className={`track-list-item__add ${isInPlaylist ? 'is-in-playlist' : ''}`}
          onClick={isInPlaylist ? onRemoveFromPlaylists : onAddToPlaylist}
          title={isInPlaylist ? 'Remove from playlists' : 'Add to playlist'}
        >
          {isInPlaylist ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};

const TrackListItemWrapper: React.FC<{
  track: TrackInfo;
  userId: number;
  allPlaylistSongIds: Set<number>;
  onAddToPlaylist: () => void;
  onRemoveFromPlaylists: () => void;
  onToggleFavorite: (isFavorited: boolean) => void;
}> = ({ track, userId, allPlaylistSongIds, onAddToPlaylist, onRemoveFromPlaylists, onToggleFavorite }) => {
  const { data: favoriteStatus } = useCheckFavorite(userId, track.id);
  const isFavorite = favoriteStatus?.isFavorite || false;
  const isInPlaylist = allPlaylistSongIds.has(track.id);

  return (
    <TrackListItem
      track={track}
      isFavorite={isFavorite}
      onToggleFavorite={() => onToggleFavorite(isFavorite)}
      onAddToPlaylist={onAddToPlaylist}
      onRemoveFromPlaylists={onRemoveFromPlaylists}
      isInPlaylist={isInPlaylist}
    />
  );
};

const AddToPlaylistModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  songId: number;
  songTitle: string;
  playlists: Playlist[];
}> = ({ isOpen, onClose, songId, songTitle, playlists }) => {
  const queryClient = useQueryClient();
  const [adding, setAdding] = useState<number | null>(null);

  const handleAddToPlaylist = async (playlistId: number) => {
    setAdding(playlistId);
    try {
      await playlistService.addTrackToPlaylist(playlistId, songId);
      // Invalidate all playlist-related queries for real-time update
      queryClient.invalidateQueries({ queryKey: ['playlists'] });
      queryClient.invalidateQueries({ queryKey: ['playlists-with-counts'] });
      queryClient.invalidateQueries({ queryKey: ['playlist-tracks'] });
      queryClient.invalidateQueries({ queryKey: ['all-playlist-song-ids'] });
      toast.success('Song added to playlist successfully!');
      onClose();
    } catch (error) {
      console.error('Failed to add song to playlist:', error);
      toast.error('Failed to add song to playlist');
    } finally {
      setAdding(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content add-to-playlist-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add "{songTitle}" to Playlist</h2>
          <button className="modal-close" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div className="modal-body">
          {playlists.length === 0 ? (
            <p className="no-playlists">You don't have any playlists yet. Create one first!</p>
          ) : (
            <div className="playlists-list">
              {playlists.map((playlist) => (
                <button
                  key={playlist.id}
                  className="playlist-item"
                  onClick={() => handleAddToPlaylist(playlist.id)}
                  disabled={adding === playlist.id}
                >
                  <img
                    src={playlist.coverImageUrl || '/placeholder-playlist.png'}
                    alt={playlist.playlistName}
                    className="playlist-item__image"
                  />
                  <div className="playlist-item__info">
                    <h4>{playlist.playlistName}</h4>
                    <p>{playlist.playlistSongs?.length || 0} songs</p>
                  </div>
                  {adding === playlist.id && <span className="loading">Adding...</span>}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const UserPlaylistsPage: React.FC = () => {
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);
  const [showCreatePlaylistModal, setShowCreatePlaylistModal] = useState(false);
  const [addToPlaylistModal, setAddToPlaylistModal] = useState<{ songId: number; songTitle: string } | null>(null);
  const queryClient = useQueryClient();
  
  // Get user profile
  const profile = useProfileStore((state) => state.profile);
  const userId = profile?.id || 0;
  
  // Fetch data
  const { data: playlists = [] } = usePlaylistsWithTrackCounts();
  const { data: trendingResponse } = useTrendingSongs();
  const { data: allPlaylistSongIds = new Set<number>() } = useAllPlaylistSongIds();
  const toggleFavorite = useToggleFavorite();
  
  const trendingSongs = trendingResponse?.items || [];

  // Only use real API data - Your Playlists
  const yourPlaylists = playlists;
  const tracksToAdd = trendingSongs.slice(0, 8);

  const handlePlaylistClick = (playlist: Playlist) => {
    setSelectedPlaylist(playlist);
  };

  const handleCloseDetail = () => {
    setSelectedPlaylist(null);
  };

  const handleToggleFavorite = (songId: number, isFavorited: boolean) => {
    if (!userId) {
      alert('Please log in to add favorites');
      return;
    }
    toggleFavorite.mutate({ userId, songId, isFavorited });
  };

  const handleOpenAddToPlaylist = (songId: number, songTitle: string) => {
    setAddToPlaylistModal({ songId, songTitle });
  };

  const handleCloseAddToPlaylist = () => {
    setAddToPlaylistModal(null);
  };

  const handleRemoveFromPlaylists = async (songId: number, songTitle: string) => {
    if (!userId) {
      toast.error('Please log in to manage playlists');
      return;
    }

    const playlistsWithSong: number[] = [];
    for (const playlist of playlists) {
      const tracks = await playlistService.getPlaylistTracks(playlist.id);
      if (tracks.some(track => track.songId === songId)) {
        playlistsWithSong.push(playlist.id);
      }
    }

    if (playlistsWithSong.length === 0) {
      toast.error('Song not found in any playlist');
      return;
    }

    try {
      await Promise.all(
        playlistsWithSong.map(playlistId =>
          playlistService.removeTrackFromPlaylist(playlistId, songId)
        )
      );

      queryClient.invalidateQueries({ queryKey: ['playlists'] });
      queryClient.invalidateQueries({ queryKey: ['playlists-with-counts'] });
      queryClient.invalidateQueries({ queryKey: ['playlist-tracks'] });
      queryClient.invalidateQueries({ queryKey: ['all-playlist-song-ids'] });

      toast.success(`Removed "${songTitle}" from ${playlistsWithSong.length} playlist(s)`);
    } catch (error) {
      console.error('Failed to remove song from playlists:', error);
      toast.error('Failed to remove song from playlists');
    }
  };

  return (
    <div className="user-playlists-page">
      <div className="user-playlists-page__main">
        <GridSection
          title="Your Playlists"
          items={yourPlaylists}
          renderItem={(playlist, index) => (
            <PlaylistCard
              key={`yours-${index}`}
              playlist={playlist}
              onClick={() => handlePlaylistClick(playlist)}
            />
          )}
        />

        <div className="user-playlist__section">
          <div className="user-playlist__section-header">
            <h2 className="user-playlist__section-title">Add Tracks To Your Playlists</h2>
          </div>
          <div className="user-playlist__track-list">
            {tracksToAdd.map((track, index) => (
              <TrackListItemWrapper
                key={`track-${index}`}
                track={{
                  id: track.id,
                  title: track.title,
                  artist: track.contributors?.[0]?.label?.labelName || 'Unknown Artist',
                  album: track.album?.albumTitle,
                  coverImage: track.album?.coverImage,
                  duration: track.duration,
                }}
                userId={userId}
                allPlaylistSongIds={allPlaylistSongIds}
                onToggleFavorite={(isFavorited) => handleToggleFavorite(track.id, isFavorited)}
                onAddToPlaylist={() => handleOpenAddToPlaylist(track.id, track.title)}
                onRemoveFromPlaylists={() => handleRemoveFromPlaylists(track.id, track.title)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Playlist Detail Panel - Right Sidebar */}
      {selectedPlaylist && (
        <aside className="user-playlists-page__detail">
          <PlaylistDetail
            title={selectedPlaylist.playlistName}
            coverImage={selectedPlaylist.coverImageUrl}
            trackCount={selectedPlaylist.playlistSongs?.length || 0}
            duration="0:00"
            author="You"
            tracks={[]}
            onTrackClick={(track) => console.log('Play track:', track)}
            onRemoveFromPlaylist={() => {}}
            onPlayTrack={() => {}}
            onClose={handleCloseDetail}
          />
        </aside>
      )}

      {/* Create New Playlist Modal */}
      <CreatePlaylistModal
        isOpen={showCreatePlaylistModal}
        onClose={() => setShowCreatePlaylistModal(false)}
        onPlaylistCreated={(playlistId) => {
          console.log('Playlist created:', playlistId);
          setShowCreatePlaylistModal(false);
        }}
      />

      {/* Add To Playlist Modal */}
      {addToPlaylistModal && (
        <AddToPlaylistModal
          isOpen={true}
          onClose={handleCloseAddToPlaylist}
          songId={addToPlaylistModal.songId}
          songTitle={addToPlaylistModal.songTitle}
          playlists={playlists}
        />
      )}
    </div>
  );
};

export default UserPlaylistsPage;
