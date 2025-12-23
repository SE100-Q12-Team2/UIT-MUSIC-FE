import React from 'react';
import { X, Play, Heart, Star, Music } from 'lucide-react';
import { LabelSong } from '@/types/label.types';
import { formatTime } from '@/shared/utils/formatTime';
import '@/styles/song-detail-modal.css';

interface SongDetailModalProps {
  song: LabelSong | null;
  isOpen: boolean;
  onClose: () => void;
}

const SongDetailModal: React.FC<SongDetailModalProps> = ({ song, isOpen, onClose }) => {
  if (!isOpen || !song) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString('vi-VN');
  };

  // Calculate like/listening rate (mock data for now)
  const likeCount = 890000; // This should come from API
  const likeListeningRate = ((likeCount / song.playCount) * 100).toFixed(1);

  return (
    <div className="song-detail-modal-overlay" onClick={onClose}>
      <div className="song-detail-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="song-detail-modal__header">
          <h2 className="song-detail-modal__title">Song Detail</h2>
          <button
            className="song-detail-modal__close"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="song-detail-modal__content">
          {/* Song Overview */}
          <div className="song-detail-modal__overview">
            <div className="song-detail-modal__cover">
              <Music size={48} className="song-detail-modal__cover-icon" />
            </div>
            <div className="song-detail-modal__info">
              <h3 className="song-detail-modal__song-title">{song.title}</h3>
              <p className="song-detail-modal__artist">
                {song.songArtists.map((sa) => sa.artist.artistName).join(', ')}
              </p>
              <div className="song-detail-modal__tags">
                <span className="song-detail-modal__tag">{song.genre.genreName}</span>
                <span className="song-detail-modal__tag">{formatDate(song.uploadDate)}</span>
                <span className="song-detail-modal__tag">{formatTime(song.duration)}</span>
              </div>
              <p className="song-detail-modal__description">
                {song.description || 'Retro-inspired synth-pop hit'}
              </p>
            </div>
          </div>

          {/* Statistics Section */}
          <div className="song-detail-modal__section">
            <h4 className="song-detail-modal__section-title">Thống kê</h4>
            <div className="song-detail-modal__stats">
              <div className="song-detail-modal__stat-card">
                <div className="song-detail-modal__stat-icon">
                  <Play size={20} />
                </div>
                <div className="song-detail-modal__stat-content">
                  <span className="song-detail-modal__stat-label">Listening Count</span>
                  <span className="song-detail-modal__stat-value">{formatNumber(song.playCount)}</span>
                </div>
              </div>
              <div className="song-detail-modal__stat-card">
                <div className="song-detail-modal__stat-icon">
                  <Heart size={20} />
                </div>
                <div className="song-detail-modal__stat-content">
                  <span className="song-detail-modal__stat-label">Total Likes</span>
                  <span className="song-detail-modal__stat-value">{formatNumber(likeCount)}</span>
                </div>
              </div>
              <div className="song-detail-modal__stat-card">
                <div className="song-detail-modal__stat-icon">
                  <Star size={20} />
                </div>
                <div className="song-detail-modal__stat-content">
                  <span className="song-detail-modal__stat-label">Rating</span>
                  <div className="song-detail-modal__rating">
                    <span className="song-detail-modal__rating-value">4.9 / 5.0</span>
                    <div className="song-detail-modal__stars">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={16} fill="#FFD700" stroke="#FFD700" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Information Section */}
          <div className="song-detail-modal__section">
            <h4 className="song-detail-modal__section-title">Thông tin chi tiết</h4>
            <div className="song-detail-modal__details-card">
              <div className="song-detail-modal__details-grid">
                <div className="song-detail-modal__detail-item">
                  <span className="song-detail-modal__detail-label">Like/Listening Rate</span>
                  <span className="song-detail-modal__detail-value">{likeListeningRate}%</span>
                </div>
                <div className="song-detail-modal__detail-item">
                  <span className="song-detail-modal__detail-label">Genre</span>
                  <span className="song-detail-modal__detail-value">{song.genre.genreName}</span>
                </div>
                <div className="song-detail-modal__detail-item">
                  <span className="song-detail-modal__detail-label">Publish Date</span>
                  <span className="song-detail-modal__detail-value">{formatDate(song.uploadDate)}</span>
                </div>
                <div className="song-detail-modal__detail-item">
                  <span className="song-detail-modal__detail-label">Duration</span>
                  <span className="song-detail-modal__detail-value">{formatTime(song.duration)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SongDetailModal;

