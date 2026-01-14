import React, { useContext, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { SongRating } from '@/shared/components/SongRating';
import { useSong } from '@/core/services/song.service';
import { useCheckFavorite, useToggleFavorite } from '@/core/services/favorite.service';
import { usePlaylistsWithTrackCounts } from '@/core/services/playlist.service';
import { SelectPlaylistModal, CreatePlaylistModal } from '@/features/user/playlists/components';
import { AuthContext } from '@/contexts/AuthContext';
import { useMusicPlayer } from '@/contexts/MusicPlayerContext';
import { toast } from 'sonner';
import {
  Play,
  Heart,
  ListPlus,
  Share2,
  Clock,
  Music2,
  ArrowLeft,
  MoreHorizontal,
} from 'lucide-react';
import { usePageBackground } from '@/shared/hooks/usePageBackground';
import '@/styles/loading.css';
import '@/styles/song-detail-page.css';

export const SongDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const { play } = useMusicPlayer();

  const songId = Number(id);
  const userId = authContext?.user?.id;

  const [showSelectPlaylistModal, setShowSelectPlaylistModal] = useState(false);
  const [showCreatePlaylistModal, setShowCreatePlaylistModal] = useState(false);

  // Fetch song data
  const { data: song, isLoading, error } = useSong(songId);

  // Check if song is favorited
  const { data: favoriteData } = useCheckFavorite(userId, songId);
  const isFavorited = favoriteData?.isFavorite || false;

  // Toggle favorite mutation
  const toggleFavorite = useToggleFavorite();

  const { data: playlists = [] } = usePlaylistsWithTrackCounts();

  usePageBackground(song?.album?.coverImage || '');

  const handlePlaySong = () => {
    if (!song) return;
    play(song, [song]);
    toast.success(`Đang phát: ${song.title}`);
  };

  const handleToggleFavorite = async () => {
    if (!userId) {
      toast.error('Vui lòng đăng nhập để thích bài hát');
      return;
    }
    if (!songId) return;

    try {
      await toggleFavorite.mutateAsync({
        userId,
        songId,
        isFavorited,
      });
      toast.success(isFavorited ? 'Đã xóa khỏi yêu thích' : 'Đã thêm vào yêu thích');
    } catch {
      toast.error('Có lỗi xảy ra, vui lòng thử lại');
    }
  };

  const handleShare = () => {
    if (!song) return;
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast.success('Đã sao chép link bài hát');
  };

  const handleAddToPlaylist = () => {
    if (!userId) {
      toast.error('Vui lòng đăng nhập để thêm vào playlist');
      return;
    }
    setShowSelectPlaylistModal(true);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-vio-900 via-[#0a0a16] to-[#05050a]">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error || !song) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-vio-900 via-[#0a0a16] to-[#05050a]">
        <Music2 className="h-16 w-16 text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold mb-2 text-white">Không tìm thấy bài hát</h2>
        <p className="text-gray-400 mb-4">Bài hát này không tồn tại hoặc đã bị xóa</p>
        <Button onClick={() => navigate(-1)} className="bg-vio-accent hover:bg-vio-accent/80">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại
        </Button>
      </div>
    );
  }

  // Get main artist
  const mainArtist = song.contributors.find(sa => sa.role === 'MainArtist');
  const artistName = mainArtist?.label.artistName || 'Unknown Artist';

  return (
    <div className="min-h-screen pb-32 bg-gradient-to-b from-vio-900 via-[#0a0a16] to-[#05050a]">
      {/* Hero Section */}
      <div className="relative min-h-[400px] bg-gradient-to-b from-vio-800/40 to-transparent px-8 pt-8 pb-12">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)} 
          className="mb-8 text-white hover:text-white hover:bg-white/10"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại
        </Button>

        <div className="flex flex-col md:flex-row items-start md:items-end gap-8">
          {/* Album Art */}
          <div className="flex-shrink-0">
            <div className="w-64 h-64 rounded-lg overflow-hidden shadow-2xl">
              {song.album?.coverImage ? (
                <img
                  src={song.album.coverImage}
                  alt={song.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-vio-600 to-vio-900 flex items-center justify-center">
                  <Music2 className="h-32 w-32 text-white/20" />
                </div>
              )}
            </div>
          </div>

          {/* Song Info */}
          <div className="flex-1 pb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-sm text-white mb-4">
              <Music2 className="h-3 w-3" />
              {song.genre?.genreName || 'Unknown'}
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{song.title}</h1>
            <p className="text-xl text-gray-300 mb-4">{artistName}</p>
            {song.album && (
              <p className="text-gray-400 mb-4">
                Album: <span className="text-gray-300">{song.album.albumTitle}</span>
              </p>
            )}
            
            {/* Stats */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-6">
              <div className="flex items-center gap-2">
                <Play className="h-4 w-4" />
                <span>{formatNumber(song.playCount)} lượt nghe</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{formatDuration(song.duration)}</span>
              </div>
              <span>•</span>
              <span>{formatDate(song.uploadDate)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-8 py-6 flex flex-wrap items-center gap-4">
        <Button 
          size="lg" 
          className="rounded-full bg-vio-accent hover:bg-vio-accent/80 text-white h-14 px-8 font-semibold"
          onClick={handlePlaySong}
        >
          <Play className="h-5 w-5 mr-2" fill="currentColor" />
          Phát nhạc
        </Button>
        <Button 
          variant="ghost"
          size="icon"
          className={`h-12 w-12 rounded-full ${isFavorited ? 'text-red-500' : 'text-gray-400'} hover:text-white hover:bg-white/10`}
          onClick={handleToggleFavorite}
          disabled={toggleFavorite.isPending}
        >
          <Heart className={`h-6 w-6 ${isFavorited ? 'fill-current' : ''}`} />
        </Button>
        <Button 
          variant="ghost"
          size="icon"
          className="h-12 w-12 rounded-full text-gray-400 hover:text-white hover:bg-white/10"          onClick={handleAddToPlaylist}        >
          <ListPlus className="h-6 w-6" />
        </Button>
        <Button 
          variant="ghost"
          size="icon"
          className="h-12 w-12 rounded-full text-gray-400 hover:text-white hover:bg-white/10"
          onClick={handleShare}
        >
          <Share2 className="h-6 w-6" />
        </Button>
        <Button 
          variant="ghost"
          size="icon"
          className="h-12 w-12 rounded-full text-gray-400 hover:text-white hover:bg-white/10"
        >
          <MoreHorizontal className="h-6 w-6" />
        </Button>
      </div>

      {/* Content Grid */}
      <div className="px-8 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Rating Section */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <h2 className="text-2xl font-bold text-white mb-6">Đánh giá bài hát</h2>
            <SongRating songId={song.id} showStats={true} showAllRatings={true} />
          </div>

          {/* Lyrics Section */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Music2 className="h-5 w-5 text-vio-accent" />
              Lời bài hát
            </h3>
            {song.lyrics ? (
              <div className="text-sm leading-relaxed text-gray-300 whitespace-pre-wrap max-h-96 overflow-y-auto song-detail-page__scrollbar">
                {song.lyrics}
              </div>
            ) : (
              <p className="text-gray-400 italic">
                Lời bài hát sẽ được cập nhật sớm...
              </p>
            )}
          </div>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Song Details */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <h3 className="text-xl font-bold text-white mb-4">Thông tin chi tiết</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-start">
                <span className="text-gray-400">Ca sĩ chính:</span>
                <span className="font-medium text-white text-right">{artistName}</span>
              </div>
              {song.contributors.filter(sa => sa.role === 'FeaturedArtist').length > 0 && (
                <div className="flex justify-between items-start">
                  <span className="text-gray-400">Tham gia:</span>
                  <span className="font-medium text-white text-right">
                    {song.contributors
                      .filter(sa => sa.role === 'FeaturedArtist')
                      .map(sa => sa.label.artistName)
                      .join(', ')}
                  </span>
                </div>
              )}
              {song.album && (
                <div className="flex justify-between items-start">
                  <span className="text-gray-400">Album:</span>
                  <span className="font-medium text-white text-right">{song.album.albumTitle}</span>
                </div>
              )}
              <div className="flex justify-between items-start">
                <span className="text-gray-400">Thể loại:</span>
                <span className="font-medium text-white text-right">{song.genre?.genreName || 'Unknown'}</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-gray-400">Nhãn hiệu:</span>
                <span className="font-medium text-white text-right">{song.label?.labelName || 'Unknown'}</span>
              </div>
              {song.language && (
                <div className="flex justify-between items-start">
                  <span className="text-gray-400">Ngôn ngữ:</span>
                  <span className="font-medium text-white text-right">{song.language}</span>
                </div>
              )}
              <div className="flex justify-between items-start">
                <span className="text-gray-400">Thời lượng:</span>
                <span className="font-medium text-white text-right">{formatDuration(song.duration)}</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-gray-400">Phát hành:</span>
                <span className="font-medium text-white text-right">{formatDate(song.uploadDate)}</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-gray-400">Trạng thái:</span>
                <span className="font-medium text-white text-right">
                  {song.copyrightStatus === 'Clear' ? '✓ Đã xác minh' : 
                   song.copyrightStatus === 'Pending' ? '⏳ Đang chờ' : '⚠ Tranh chấp'}
                </span>
              </div>
            </div>
          </div>

          {/* Stats Card */}
          <div className="bg-gradient-to-br from-vio-600/20 to-vio-900/20 backdrop-blur-sm rounded-xl p-6 border border-vio-500/30">
            <h3 className="text-lg font-bold text-white mb-4">Thống kê</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">Lượt nghe</span>
                  <span className="font-bold text-vio-300">{formatNumber(song.playCount)}</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-vio-500 to-vio-700"
                    style={{ width: '75%' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add to Playlist Modals */}
      <SelectPlaylistModal
        isOpen={showSelectPlaylistModal}
        playlists={playlists}
        trackId={songId}
        onClose={() => setShowSelectPlaylistModal(false)}
        onConfirm={(playlistId) => {
          toast.success('Đã thêm bài hát vào playlist');
          setShowSelectPlaylistModal(false);
        }}
        onCreateNew={() => {
          setShowSelectPlaylistModal(false);
          setShowCreatePlaylistModal(true);
        }}
      />

      <CreatePlaylistModal
        isOpen={showCreatePlaylistModal}
        trackId={songId}
        onClose={() => setShowCreatePlaylistModal(false)}
        onPlaylistCreated={(playlistId) => {
          toast.success('Đã tạo playlist và thêm bài hát');
          setShowCreatePlaylistModal(false);
        }}
      />
    </div>
  );
};

export default SongDetailPage;
