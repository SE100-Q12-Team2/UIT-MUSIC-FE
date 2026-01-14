import React, { useMemo, useState } from 'react';
import { useAuth } from '@/shared/hooks/auth/useAuth';
import { useRecordLabels, useLabelAlbums, useLabelSongs } from '@/core/services/label.service';
import { Music, Disc, TrendingUp, Edit } from 'lucide-react';
import labelAvatar from '@/assets/label-avatar.jpg';
import { EditProfileDialog } from '../components/EditProfileDialog';
import '@/styles/label-home.css';

type TabType = 'albums' | 'songs';

const LabelHomePage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('albums');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  // Fetch record label info
  const { data: labels = [], isLoading: isLoadingLabels } = useRecordLabels(user?.id);
  const label = labels[0]; // Assuming user has one label
  
  // Fetch albums and songs for the label
  const { data: albumsResponse, isLoading: isLoadingAlbums } = useLabelAlbums(label?.id, 1, 100);
  const { data: songsResponse } = useLabelSongs(label?.id, 1, 100);
  
  // Calculate statistics
  const stats = useMemo(() => {
    if (!label) return null;
    
    const totalAlbums = albumsResponse?.total || label._count.albums || 0;
    const totalSongs = songsResponse?.total || 0; // Use actual API response total
    const totalListeningCount = songsResponse?.items.reduce((sum, song) => sum + song.playCount, 0) || 0;
    
    return {
      totalAlbums,
      totalSongs,
      totalListeningCount,
    };
  }, [label, albumsResponse, songsResponse]);
  
  // Get recent albums (first 4)
  const recentAlbums = useMemo(() => {
    return albumsResponse?.items|| [];
  }, [albumsResponse]);
  
  if (isLoadingLabels) {
    return (
      <div className="label-home">
        <div className="label-home__loading">Loading label information...</div>
      </div>
    );
  }
  
  if (!label) {
    return (
      <div className="label-home">
        <div className="label-home__error">No label found for this account</div>
      </div>
    );
  }
  
  return (
    <div className="label-home">
      {/* Header Section */}
      <div className="label-home__header">
        <div className="label-home__logo">
          <img src={labelAvatar} alt="Label Avatar" className="label-home__logo-img" />
        </div>
        <div className="label-home__info">
          <h1 className="label-home__title">{label.labelName}</h1>
          <p className="label-home__description">{label.description}</p>
          <div className="label-home__meta">
            {label.website && (
              <a 
                href={label.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="label-home__link"
              >
                🌐 {label.website}
              </a>
            )}
            {label.contactEmail && (
              <a 
                href={`mailto:${label.contactEmail}`}
                className="label-home__link"
              >
                ✉️ {label.contactEmail}
              </a>
            )}
            <span className="label-home__date">
              📅 Tham gia {new Date(label.createdAt).toLocaleDateString('vi-VN')}
            </span>
          </div>
        </div>
        <button 
          className="label-home__edit-btn"
          onClick={() => setIsEditDialogOpen(true)}
          aria-label="Edit profile"
        >
          <Edit size={20} />
          Edit Profile
        </button>
      </div>
      
      {/* Statistics Section */}
      {stats && (
        <div className="label-home__stats">
          <div className="label-home__stat-card">
            <div className="label-home__stat-icon">
              <Disc size={32} />
            </div>
            <div className="label-home__stat-content">
              <span className="label-home__stat-label">Total Albums Count</span>
              <span className="label-home__stat-value">{stats.totalAlbums}</span>
            </div>
          </div>
          
          <div className="label-home__stat-card">
            <div className="label-home__stat-icon">
              <Music size={32} />
            </div>
            <div className="label-home__stat-content">
              <span className="label-home__stat-label">Total Songs Count</span>
              <span className="label-home__stat-value">{stats.totalSongs}</span>
            </div>
          </div>
          
          <div className="label-home__stat-card">
            <div className="label-home__stat-icon">
              <TrendingUp size={32} />
            </div>
            <div className="label-home__stat-content">
              <span className="label-home__stat-label">Total Listening Count</span>
              <span className="label-home__stat-value">{stats.totalListeningCount.toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}
      
      {/* Albums/Songs Tabs Section */}
      <div className="label-home__section">
        <div className="label-home__tabs">
          <button 
            className={`label-home__tab ${activeTab === 'albums' ? 'label-home__tab--active' : ''}`}
            onClick={() => setActiveTab('albums')}
          >
            <Disc size={20} />
            Albums ({stats?.totalAlbums || 0})
          </button>
          <button 
            className={`label-home__tab ${activeTab === 'songs' ? 'label-home__tab--active' : ''}`}
            onClick={() => setActiveTab('songs')}
          >
            <Music size={20} />
            Songs({stats?.totalSongs || 0})
          </button>
        </div>
        
        {activeTab === 'albums' ? (
          isLoadingAlbums ? (
            <div className="label-home__loading">Loading albums...</div>
          ) : (
            <div className="label-home__albums">
              {recentAlbums.length > 0 ? (
                recentAlbums.map((album) => (
                  <div key={album.id} className="label-home__album-card">
                    <img 
                      src={album.coverImage} 
                      alt={album.albumTitle}
                      className="label-home__album-cover"
                    />
                    <div className="label-home__album-info">
                      <h3 className="label-home__album-title">{album.albumTitle}</h3>
                      <p className="label-home__album-tracks">{album._count.songs} tracks</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="label-home__empty">No albums available</div>
              )}
            </div>
          )
        ) : (
          <div className="label-home__songs">
            {songsResponse?.items && songsResponse.items.length > 0 ? (
              songsResponse.items.map((song) => (
                <div key={song.id} className="label-home__song-item">
                  <img 
                    src={song.album?.coverImage || 'https://via.placeholder.com/40'} 
                    alt={song.title}
                    className="label-home__song-cover"
                  />
                  <div className="label-home__song-info">
                    <h3 className="label-home__song-title">{song.title}</h3>
                    <p className="label-home__song-artist">
                      {(song.contributors || []).map(sa => sa.label.labelName).join(', ') || 'Unknown Artist'}
                    </p>
                  </div>
                  <span className="label-home__song-plays">{song.playCount.toLocaleString()} plays</span>
                </div>
              ))
            ) : (
              <div className="label-home__empty">No songs available</div>
            )}
          </div>
        )}
      </div>

      <EditProfileDialog 
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        label={label}
      />
    </div>
  );
};

export default LabelHomePage;
