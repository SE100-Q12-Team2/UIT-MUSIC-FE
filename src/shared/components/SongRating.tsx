import React, { useState } from 'react';
import { Star, Edit2, Trash2 } from 'lucide-react';
import {
  useMyRating,
  useSongRatingStats,
  useRateSong,
  useUpdateRating,
  useDeleteRating,
} from '@/core/services/rating.service';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface SongRatingProps {
  songId: number;
  showStats?: boolean;
}

export const SongRating: React.FC<SongRatingProps> = ({ songId, showStats = true }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState('');

  const { data: myRating, isLoading: loadingMyRating } = useMyRating(songId);
  const { data: stats } = useSongRatingStats(songId);
  const rateSong = useRateSong();
  const updateRating = useUpdateRating();
  const deleteRating = useDeleteRating();

  React.useEffect(() => {
    if (myRating) {
      setRating(myRating.rating);
      setReview(myRating.review || '');
    }
  }, [myRating]);

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error('Vui lòng chọn số sao');
      return;
    }

    try {
      if (myRating) {
        await updateRating.mutateAsync({
          songId,
          data: { rating, review: review || undefined },
        });
        toast.success('Đã cập nhật đánh giá');
      } else {
        await rateSong.mutateAsync({
          songId,
          data: { songId, rating, review: review || undefined },
        });
        toast.success('Đã thêm đánh giá');
      }
      setIsEditing(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  const handleDelete = async () => {
    if (!myRating) return;

    try {
      await deleteRating.mutateAsync(songId);
      toast.success('Đã xóa đánh giá');
      setRating(0);
      setReview('');
      setIsEditing(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  const renderStars = (count: number, interactive: boolean = false) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            className={cn(
              'transition-all',
              interactive && 'hover:scale-110 cursor-pointer'
            )}
            onClick={() => interactive && setRating(star)}
            onMouseEnter={() => interactive && setHoverRating(star)}
            onMouseLeave={() => interactive && setHoverRating(0)}
          >
            <Star
              className={cn(
                'h-6 w-6 transition-colors',
                star <= (interactive ? (hoverRating || rating) : count)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              )}
            />
          </button>
        ))}
      </div>
    );
  };

  if (loadingMyRating) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Đánh giá của bạn</span>
          {myRating && !isEditing && (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(true)}
              >
                <Edit2 className="h-4 w-4 mr-1" />
                Chỉnh sửa
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                className="text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Xóa
              </Button>
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Rating Statistics */}
        {showStats && stats && (
          <div className="p-4 bg-accent rounded-lg">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold">{stats.averageRating.toFixed(1)}</div>
                <div className="flex items-center gap-1 mt-1">
                  {renderStars(Math.round(stats.averageRating))}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {stats.totalRatings} đánh giá
                </div>
              </div>

              <div className="flex-1 space-y-1">
                {stats.ratingDistribution
                  .sort((a, b) => b.rating - a.rating)
                  .map((dist) => (
                    <div key={dist.rating} className="flex items-center gap-2">
                      <span className="text-sm w-4">{dist.rating}</span>
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-yellow-400"
                          style={{
                            width: `${(dist.count / stats.totalRatings) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground w-8 text-right">
                        {dist.count}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* User Rating Form */}
        {(!myRating || isEditing) ? (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Chọn số sao
              </label>
              {renderStars(rating, true)}
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Nhận xét (tùy chọn)
              </label>
              <Textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Chia sẻ cảm nhận của bạn về bài hát..."
                rows={4}
              />
            </div>

            <div className="flex items-center gap-2">
              <Button
                onClick={handleSubmit}
                disabled={rating === 0 || rateSong.isPending || updateRating.isPending}
              >
                {myRating ? 'Cập nhật' : 'Gửi đánh giá'}
              </Button>
              {isEditing && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    if (myRating) {
                      setRating(myRating.rating);
                      setReview(myRating.review || '');
                    }
                  }}
                >
                  Hủy
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {renderStars(myRating.rating)}
            {myRating.review && (
              <p className="text-sm text-muted-foreground mt-2">
                {myRating.review}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
