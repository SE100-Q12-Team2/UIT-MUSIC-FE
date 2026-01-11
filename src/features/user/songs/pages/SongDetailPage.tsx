import React, { useContext } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SongRating } from '@/shared/components/SongRating';
import { useSong } from '@/core/services/song.service';
import { useCheckFavorite, useToggleFavorite } from '@/core/services/favorite.service';
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

export const SongDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const { play } = useMusicPlayer();

  const songId = Number(id);
  const userId = authContext?.user?.id;

  // Fetch song data
  const { data: song, isLoading, error } = useSong(songId);

  // Check if song is favorited
  const { data: favoriteData } = useCheckFavorite(userId, songId);
  const isFavorited = favoriteData?.isFavorite || false;

  // Toggle favorite mutation
  const toggleFavorite = useToggleFavorite();

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
      <div className="flex items-center justify-center min-h-screen">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error || !song) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Music2 className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold mb-2">Không tìm thấy bài hát</h2>
        <p className="text-muted-foreground mb-4">Bài hát này không tồn tại hoặc đã bị xóa</p>
        <Button onClick={() => navigate(-1)}>
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
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Back Button */}
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Quay lại
      </Button>

      {/* Song Header */}
      <Card className="p-6 md:p-8 mb-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Album Art */}
          <div className="flex-shrink-0">
            <div className="w-full md:w-64 aspect-square rounded-lg overflow-hidden shadow-lg">
              {song.album?.coverImage ? (
                <img
                  src={song.album.coverImage}
                  alt={song.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                  <Music2 className="h-24 w-24 text-primary/30" />
                </div>
              )}
            </div>
          </div>

          {/* Song Info */}
          <div className="flex-1">
            <div className="mb-4">
              <Badge className="mb-2">{song.genre?.genreName || 'Unknown'}</Badge>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{song.title}</h1>
              <p className="text-xl text-muted-foreground">{artistName}</p>
              {song.album && (
                <p className="text-muted-foreground">Album: {song.album.albumTitle}</p>
              )}
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-4 mb-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Play className="h-4 w-4" />
                <span>{formatNumber(song.playCount)} lượt nghe</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{formatDuration(song.duration)}</span>
              </div>
              <div>
                <span>Phát hành: {formatDate(song.uploadDate)}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <Button size="lg" className="gap-2" onClick={handlePlaySong}>
                <Play className="h-5 w-5" fill="currentColor" />
                Phát nhạc
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="gap-2"
                onClick={handleToggleFavorite}
                disabled={toggleFavorite.isPending}
              >
                <Heart className={`h-5 w-5 ${isFavorited ? 'fill-current text-red-500' : ''}`} />
                {isFavorited ? 'Đã thích' : 'Thích'}
              </Button>
              <Button variant="outline" size="lg" className="gap-2">
                <ListPlus className="h-5 w-5" />
                Thêm vào playlist
              </Button>
              <Button variant="outline" size="lg" onClick={handleShare}>
                <Share2 className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Rating Section */}
      <Card className="p-6 md:p-8 mb-6">
        <h2 className="text-2xl font-bold mb-6">Đánh giá bài hát</h2>
        <SongRating songId={song.id} showStats={true} />
      </Card>

      {/* Additional Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Lyrics Card */}
        <Card className="p-6">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Music2 className="h-5 w-5" />
            Lời bài hát
          </h3>
          {song.lyrics ? (
            <div className="text-sm whitespace-pre-wrap text-muted-foreground max-h-96 overflow-y-auto">
              {song.lyrics}
            </div>
          ) : (
            <p className="text-muted-foreground">
              Lời bài hát sẽ được cập nhật sớm...
            </p>
          )}
        </Card>

        {/* Credits Card */}
        <Card className="p-6">
          <h3 className="text-xl font-bold mb-4">Thông tin</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Ca sĩ chính:</span>
              <span className="font-medium">{artistName}</span>
            </div>
            {song.contributors.filter(sa => sa.role === 'FeaturedArtist').length > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Nghệ sĩ tham gia:</span>
                <span className="font-medium">
                  {song.contributors
                    .filter(sa => sa.role === 'FeaturedArtist')
                    .map(sa => sa.label.artistName)
                    .join(', ')}
                </span>
              </div>
            )}
            {song.album && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Album:</span>
                <span className="font-medium">{song.album.albumTitle}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Thể loại:</span>
              <span className="font-medium">{song.genre?.genreName || 'Unknown'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Nhãn hiệu:</span>
              <span className="font-medium">{song.label?.labelName || 'Unknown'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Ngôn ngữ:</span>
              <span className="font-medium">{song.language || 'Unknown'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Thời lượng:</span>
              <span className="font-medium">{formatDuration(song.duration)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Ngày phát hành:</span>
              <span className="font-medium">{formatDate(song.uploadDate)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Trạng thái:</span>
              <span className="font-medium">
                {song.copyrightStatus === 'Clear' ? 'Đã xác minh' : 
                 song.copyrightStatus === 'Pending' ? 'Đang chờ' : 'Tranh chấp'}
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SongDetailPage;
