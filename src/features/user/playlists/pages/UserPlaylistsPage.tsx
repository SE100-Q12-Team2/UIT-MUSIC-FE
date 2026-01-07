import React, { useState } from 'react';
import { usePlaylistsWithTrackCounts } from '@/core/services/playlist.service';
import { useTrendingSongs } from '@/core/services/song.service';
import { Playlist } from '@/types/playlist.types';
import {
  PlaylistDetail,
  CreatePlaylistModal,
} from '../components';
  import '@/styles/user-playlists.css';

// Carousel Section Component
const CarouselSection: React.FC<{
  title: string;
  items: Playlist[];
  onSeeAll?: () => void;
  renderItem: (item: Playlist, index: number) => React.ReactNode;
}> = ({ title, items, onSeeAll, renderItem }) => {
  return (
    <div className="user-playlist__section">
      <div className="user-playlist__section-header">
        <h2 className="user-playlist__section-title">{title}</h2>
        {onSeeAll && (
          <button className="user-playlist__see-all" onClick={onSeeAll}>
            See All
          </button>
        )}
      </div>
      <div className="user-playlist__carousel">
        <div className="user-playlist__carousel-track">
          {items.map((item, index) => renderItem(item, index))}
        </div>
      </div>
    </div>
  );
};

// Grid Section Component
const GridSection: React.FC<{
  title: string;
  items: Playlist[];
  onSeeAll?: () => void;
  renderItem: (item: Playlist, index: number) => React.ReactNode;
}> = ({ title, items, onSeeAll, renderItem }) => {
  return (
    <div className="user-playlist__section">
      <div className="user-playlist__section-header">
        <h2 className="user-playlist__section-title">{title}</h2>
        {onSeeAll && (
          <button className="user-playlist__see-all" onClick={onSeeAll}>
            See All
          </button>
        )}
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
}> = ({ track, onAddToPlaylist }) => {
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
        <button className="track-list-item__favorite" title="Add to favorites">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
        <button className="track-list-item__add" onClick={onAddToPlaylist} title="Add to playlist">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

const UserPlaylistsPage: React.FC = () => {
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);
  const [showCreatePlaylistModal, setShowCreatePlaylistModal] = useState(false);
  
  // Fetch data
  const { data: playlists = [] } = usePlaylistsWithTrackCounts();
  const { data: trendingResponse } = useTrendingSongs();
  
  const trendingSongs = trendingResponse?.items || [];

  // Mock data for sections (replace with real API calls later)
  const recentlyListened = playlists.slice(0, 4);
  const mostListened = playlists.slice(0, 4);
  const likedTracks = playlists.slice(0, 4);
  const yourPlaylists = playlists.slice(0, 6);
  const updatedPlaylists = playlists.slice(0, 2);
  const subscribedPlaylists = playlists.slice(0, 10);
  const popularPlaylists = playlists.slice(0, 4);
  const recentlySeen = playlists.slice(0, 5);
  const tracksToAdd = trendingSongs.slice(0, 4);

  const handlePlaylistClick = (playlist: Playlist) => {
    setSelectedPlaylist(playlist);
  };

  const handleCloseDetail = () => {
    setSelectedPlaylist(null);
  };

  return (
    <div className="user-playlists-page">
      <div className="user-playlists-page__main">
        {/* Recently Listened */}
        <CarouselSection
          title="Recently Listened"
          items={recentlyListened}
          onSeeAll={() => console.log('See all recently listened')}
          renderItem={(playlist, index) => (
            <PlaylistCard
              key={`recent-${index}`}
              playlist={playlist}
              onClick={() => handlePlaylistClick(playlist)}
            />
          )}
        />

        {/* Most Listened */}
        <CarouselSection
          title="Most Listened"
          items={mostListened}
          onSeeAll={() => console.log('See all most listened')}
          renderItem={(playlist, index) => (
            <PlaylistCard
              key={`most-${index}`}
              playlist={playlist}
              onClick={() => handlePlaylistClick(playlist)}
            />
          )}
        />

        {/* Liked Tracks */}
        <CarouselSection
          title="Liked Tracks"
          items={likedTracks}
          onSeeAll={() => console.log('See all liked tracks')}
          renderItem={(playlist, index) => (
            <PlaylistCard
              key={`liked-${index}`}
              playlist={playlist}
              onClick={() => handlePlaylistClick(playlist)}
            />
          )}
        />

        {/* Your Playlists */}
        <GridSection
          title="Your Playlists"
          items={yourPlaylists}
          onSeeAll={() => console.log('See all your playlists')}
          renderItem={(playlist, index) => (
            <PlaylistCard
              key={`yours-${index}`}
              playlist={playlist}
              onClick={() => handlePlaylistClick(playlist)}
            />
          )}
        />

        {/* Updated Playlists */}
        <GridSection
          title="Updated Playlists"
          items={updatedPlaylists}
          onSeeAll={() => console.log('See all updated playlists')}
          renderItem={(playlist, index) => (
            <PlaylistCard
              key={`updated-${index}`}
              playlist={playlist}
              onClick={() => handlePlaylistClick(playlist)}
            />
          )}
        />

        {/* Subscribed Playlists */}
        <GridSection
          title="Subscribed Playlists"
          items={subscribedPlaylists}
          onSeeAll={() => console.log('See all subscribed playlists')}
          renderItem={(playlist, index) => (
            <PlaylistCard
              key={`subscribed-${index}`}
              playlist={playlist}
              onClick={() => handlePlaylistClick(playlist)}
            />
          )}
        />

        {/* Popular Playlists Based On You */}
        <CarouselSection
          title="Popular Playlists Based On You"
          items={popularPlaylists}
          onSeeAll={() => console.log('See all popular playlists')}
          renderItem={(playlist, index) => (
            <PlaylistCard
              key={`popular-${index}`}
              playlist={playlist}
              onClick={() => handlePlaylistClick(playlist)}
            />
          )}
        />

        {/* Add Tracks To Your Playlists */}
        <div className="user-playlist__section">
          <div className="user-playlist__section-header">
            <h2 className="user-playlist__section-title">Add Tracks To Your Playlists</h2>
            <button className="user-playlist__see-all" onClick={() => console.log('See all tracks')}>
              See All
            </button>
          </div>
          <div className="user-playlist__track-list">
            {tracksToAdd.map((track, index) => (
              <TrackListItem
                key={`track-${index}`}
                track={{
                  id: track.id,
                  title: track.title,
                  artist: track.contributors?.[0]?.label?.labelName || 'Unknown Artist',
                  album: track.album?.albumTitle,
                  coverImage: track.album?.coverImage,
                  duration: track.duration,
                }}
                onAddToPlaylist={() => console.log('Add to playlist:', track.id)}
              />
            ))}
          </div>
        </div>

        {/* Playlists You Recently Seen */}
        <CarouselSection
          title="Playlists You Recently Seen"
          items={recentlySeen}
          onSeeAll={() => console.log('See all recently seen')}
          renderItem={(playlist, index) => (
            <PlaylistCard
              key={`seen-${index}`}
              playlist={playlist}
              onClick={() => handlePlaylistClick(playlist)}
            />
          )}
        />
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
    </div>
  );
};

export default UserPlaylistsPage;
