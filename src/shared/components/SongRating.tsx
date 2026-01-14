import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, User } from 'lucide-react';
import {
  useMyRating,
  useSongRatingStats,
  useRateSong,
  useDeleteRating,
  useSongRatings,
} from '@/core/services/rating.service';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface SongRatingProps {
  songId: number;
  showStats?: boolean;
  showAllRatings?: boolean;
}

export const SongRating: React.FC<SongRatingProps> = ({ songId, showStats = true, showAllRatings = true }) => {
  const [ratingsPage, setRatingsPage] = useState(1);
  const [comment, setComment] = useState('');
  const [showOnlyComments, setShowOnlyComments] = useState(false);
  const { data: myRating, isLoading: loadingMyRating, refetch: refetchMyRating } = useMyRating(songId);
  const { data: stats, refetch: refetchStats } = useSongRatingStats(songId);
  const { data: allRatings, isLoading: loadingAllRatings, refetch: refetchAllRatings } = useSongRatings(songId, { 
    page: ratingsPage, 
    limit: 10,
    sortBy: 'ratedAt',
    sortOrder: 'desc'
  });
  const rateSongMutation = useRateSong();
  const deleteRatingMutation = useDeleteRating();

  const handleLike = async () => {
    try {
      const hasComment = comment.trim().length > 0;
      await rateSongMutation.mutateAsync({
        songId,
        data: { songId, rating: 'Like', comment: hasComment ? comment.trim() : undefined },
      });
      
      // Refetch data ngay lập tức
      await Promise.all([
        refetchMyRating(),
        refetchStats(),
        refetchAllRatings()
      ]);
      
      if (myRating?.rating === 'Like') {
        toast.success(hasComment ? 'Đã cập nhật đánh giá và nhận xét' : 'Đã cập nhật đánh giá');
      } else {
        toast.success(hasComment ? 'Đã thích bài hát và thêm nhận xét' : 'Đã thích bài hát');
      }
      setComment('');
    } catch (error: any) {
      console.error('Error liking song:', error);
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  const handleDislike = async () => {
    try {
      const hasComment = comment.trim().length > 0;
      await rateSongMutation.mutateAsync({
        songId,
        data: { songId, rating: 'Dislike', comment: hasComment ? comment.trim() : undefined },
      });
      
      // Refetch data ngay lập tức
      await Promise.all([
        refetchMyRating(),
        refetchStats(),
        refetchAllRatings()
      ]);
      
      if (myRating?.rating === 'Dislike') {
        toast.success(hasComment ? 'Đã cập nhật đánh giá và nhận xét' : 'Đã cập nhật đánh giá');
      } else {
        toast.success(hasComment ? 'Đã không thích bài hát và thêm nhận xét' : 'Đã không thích bài hát');
      }
      setComment('');
    } catch (error: any) {
      console.error('Error disliking song:', error);
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  const handleRemoveRating = async () => {
    if (!myRating) return;

    try {
      await deleteRatingMutation.mutateAsync(songId);
      
      // Refetch data ngay lập tức
      await Promise.all([
        refetchMyRating(),
        refetchStats(),
        refetchAllRatings()
      ]);
      
      toast.success('Đã xóa đánh giá');
    } catch (error: any) {
      console.error('Error removing rating:', error);
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  const handleUpdateComment = async () => {
    if (!myRating) return;
    
    const trimmedComment = comment.trim();
    if (!trimmedComment) {
      toast.error('Vui lòng nhập nhận xét');
      return;
    }

    try {
      // Đảm bảo gửi đúng format cho API
      await rateSongMutation.mutateAsync({
        songId,
        data: { 
          songId: songId,
          rating: myRating.rating,
          comment: trimmedComment 
        },
      });
      
      // Refetch data ngay lập tức
      await Promise.all([
        refetchMyRating(),
        refetchStats(),
        refetchAllRatings()
      ]);
      
      toast.success('Đã cập nhật nhận xét');
      setComment('');
    } catch (error: any) {
      console.error('Error updating comment:', error);
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  if (loadingMyRating) {
    return (
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-vio-accent"></div>
        </div>
      </div>
    );
  }

  const isLiked = myRating?.rating === 'Like';
  const isDisliked = myRating?.rating === 'Dislike';

  return (
    <div className="space-y-6">
      {/* Statistics Section */}
      {showStats && stats && (
        <div className="bg-gradient-to-br from-vio-600/20 to-vio-900/20 backdrop-blur-sm rounded-xl p-6 border border-white/10">
          <h3 className="text-lg font-semibold text-white mb-4">Thống kê đánh giá</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-white/5 rounded-lg">
              <ThumbsUp className="h-8 w-8 text-green-400 mx-auto mb-2" />
              <div className="text-3xl font-bold text-white">{stats.likes}</div>
              <div className="text-sm text-gray-400 mt-1">
                {stats.likePercentage.toFixed(1)}% Thích
              </div>
            </div>
            <div className="text-center p-4 bg-white/5 rounded-lg">
              <ThumbsDown className="h-8 w-8 text-red-400 mx-auto mb-2" />
              <div className="text-3xl font-bold text-white">{stats.dislikes}</div>
              <div className="text-sm text-gray-400 mt-1">
                {stats.dislikePercentage.toFixed(1)}% Không thích
              </div>
            </div>
          </div>
          <div className="mt-4 text-center text-sm text-gray-400">
            Tổng cộng {stats.totalRatings} đánh giá
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="h-3 bg-white/10 rounded-full overflow-hidden flex">
              <div 
                className="bg-green-500 transition-all duration-300"
                style={{ width: `${stats.likePercentage}%` }}
              />
              <div 
                className="bg-red-500 transition-all duration-300"
                style={{ width: `${stats.dislikePercentage}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* User Rating Actions */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
        <h3 className="text-lg font-semibold text-white mb-4">Đánh giá của bạn</h3>
        
        {myRating ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-gray-300">Bạn đã đánh giá:</span>
              {isLiked && (
                <div className="flex items-center gap-2 text-green-400 font-semibold">
                  <ThumbsUp className="h-5 w-5" fill="currentColor" />
                  Thích
                </div>
              )}
              {isDisliked && (
                <div className="flex items-center gap-2 text-red-400 font-semibold">
                  <ThumbsDown className="h-5 w-5" fill="currentColor" />
                  Không thích
                </div>
              )}
            </div>

            {/* Display existing comment */}
            {myRating?.comment && (
              <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                <p className="text-xs text-gray-400 mb-1">Nhận xét của bạn:</p>
                <p className="text-sm text-gray-300">{myRating.comment}</p>
              </div>
            )}

            {/* Comment textarea for updating */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                {myRating?.comment ? 'Cập nhật nhận xét (tùy chọn)' : 'Thêm nhận xét của bạn (tùy chọn)'}
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={myRating?.comment ? 'Nhập nhận xét mới...' : 'Chia sẻ suy nghĩ của bạn về bài hát này...'}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-vio-500 resize-none"
                rows={3}
                maxLength={500}
              />
              <p className="text-xs text-gray-500 mt-1 text-right">
                {comment.length}/500 ký tự
              </p>
            </div>
            
            <div className="space-y-3">
              {/* Nút để lưu nhận xét nếu user đã nhập */}
              {comment.trim().length > 0 && (
                <Button
                  onClick={handleUpdateComment}
                  variant="default"
                  className="w-full bg-vio-600 hover:bg-vio-700 text-white"
                  disabled={rateSongMutation.isPending}
                >
                  {rateSongMutation.isPending ? 'Đang lưu...' : (myRating?.comment ? 'Cập nhật nhận xét' : 'Lưu nhận xét')}
                </Button>
              )}
              
              {/* Các nút thay đổi rating */}
              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={handleLike}
                  variant={isLiked ? 'default' : 'outline'}
                  className={isLiked ? 'bg-green-600 hover:bg-green-700' : 'border-white/20 text-white hover:bg-white/10'}
                  disabled={rateSongMutation.isPending}
                >
                  <ThumbsUp className="h-4 w-4 mr-2" />
                  Thích
                </Button>
                <Button
                  onClick={handleDislike}
                  variant={isDisliked ? 'default' : 'outline'}
                  className={isDisliked ? 'bg-red-600 hover:bg-red-700' : 'border-white/20 text-white hover:bg-white/10'}
                  disabled={rateSongMutation.isPending}
                >
                  <ThumbsDown className="h-4 w-4 mr-2" />
                  Không thích
                </Button>
                <Button
                  onClick={handleRemoveRating}
                  variant="ghost"
                  className="text-gray-400 hover:text-white hover:bg-white/10"
                  disabled={deleteRatingMutation.isPending}
                >
                  Xóa đánh giá
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-gray-300">Bạn thích bài hát này không?</p>
            
            {/* Comment textarea for new rating */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Thêm nhận xét của bạn (tùy chọn)
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Chia sẻ suy nghĩ của bạn về bài hát này..."
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-vio-500 resize-none"
                rows={3}
                maxLength={500}
              />
              <p className="text-xs text-gray-500 mt-1 text-right">
                {comment.length}/500 ký tự
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleLike}
                variant="outline"
                className="flex-1 border-white/20 text-white hover:bg-green-600 hover:border-green-600"
                disabled={rateSongMutation.isPending}
              >
                <ThumbsUp className="h-4 w-4 mr-2" />
                Thích{comment.trim().length > 0 && ' & Lưu'}
              </Button>
              <Button
                onClick={handleDislike}
                variant="outline"
                className="flex-1 border-white/20 text-white hover:bg-red-600 hover:border-red-600"
                disabled={rateSongMutation.isPending}
              >
                <ThumbsDown className="h-4 w-4 mr-2" />
                Không thích{comment.trim().length > 0 && ' & Lưu'}
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* All Ratings List */}
      {showAllRatings && (
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">
              Tất cả đánh giá
              {showOnlyComments && (
                <span className="text-sm text-gray-400 ml-2">(có nhận xét)</span>
              )}
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowOnlyComments(!showOnlyComments);
                setRatingsPage(1); // Reset page khi toggle filter
              }}
              className={`text-sm ${showOnlyComments ? 'text-vio-400 font-medium' : 'text-gray-400'} hover:text-white transition-colors`}
            >
              {showOnlyComments ? '✓ Chỉ nhận xét' : 'Chỉ nhận xét'}
            </Button>
          </div>
          
          {loadingAllRatings ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-vio-accent"></div>
            </div>
          ) : allRatings && allRatings.data.length > 0 ? (
            (() => {
              // Log để debug
              console.log('All ratings data:', allRatings.data);
              console.log('Sample rating:', allRatings.data[0]);
              
              // Calculate filtered results
              const filteredRatings = allRatings.data
                .filter(rating => !showOnlyComments || rating.comment)
                .sort((a, b) => {
                  if (a.comment && !b.comment) return -1;
                  if (!a.comment && b.comment) return 1;
                  return 0;
                });
              
              const hasComments = allRatings.data.some(r => r.comment);
              const commentCount = allRatings.data.filter(r => r.comment).length;
              
              console.log('Has comments:', hasComments);
              console.log('Comment count:', commentCount);
              console.log('Filtered ratings count:', filteredRatings.length);
              
              // Show message if filter removes all results
              if (showOnlyComments && filteredRatings.length === 0) {
                return (
                  <div className="text-center py-8 text-gray-400">
                    <p>Chưa có đánh giá nào với nhận xét</p>
                    <button 
                      onClick={() => setShowOnlyComments(false)}
                      className="text-vio-400 hover:text-vio-300 text-sm mt-2 underline"
                    >
                      Xem tất cả đánh giá
                    </button>
                  </div>
                );
              }
              
              return (
                <div className="space-y-3">
                  {/* Show info about comments */}
                  {hasComments && !showOnlyComments && (
                    <div className="text-sm text-gray-400 pb-2 border-b border-white/10">
                      {commentCount} người đã để lại nhận xét
                    </div>
                  )}
                  
                  {filteredRatings.map((rating) => {
                    // Debug log for each rating
                    console.log('Rating item:', {
                      userId: rating.userId,
                      songId: rating.songId,
                      rating: rating.rating,
                      hasComment: !!rating.comment,
                      commentLength: rating.comment?.length,
                      commentPreview: rating.comment?.substring(0, 50)
                    });
                    
                    return (
                <div 
                  key={`${rating.user?.id || rating.userId}-${rating.songId}`}
                  className="flex items-start gap-3 p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                >
                  {/* User Avatar */}
                  <div className="flex-shrink-0">
                    {rating.user?.profileImage ? (
                      <img
                        src={rating.user.profileImage}
                        alt={rating.user.fullName}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-vio-600 to-vio-900 flex items-center justify-center">
                        <User className="h-5 w-5 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Rating Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-white">
                        {rating.user?.fullName || 'Anonymous'}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(rating.ratedAt).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                    {/* Display comment prominently if exists */}
                    {rating.comment ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          {rating.rating === 'Like' ? (
                            <div className="flex items-center gap-1 text-green-400">
                              <ThumbsUp className="h-4 w-4" fill="currentColor" />
                              <span className="text-sm font-medium">Thích</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 text-red-400">
                              <ThumbsDown className="h-4 w-4" fill="currentColor" />
                              <span className="text-sm font-medium">Không thích</span>
                            </div>
                          )}
                        </div>
                        <div className="p-3 bg-white/5 rounded-lg border-l-2 border-vio-500">
                          <p className="text-sm text-gray-200 leading-relaxed">
                            {rating.comment}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        {rating.rating === 'Like' ? (
                          <div className="flex items-center gap-1 text-green-400">
                            <ThumbsUp className="h-4 w-4" fill="currentColor" />
                            <span className="text-sm">Thích</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-red-400">
                            <ThumbsDown className="h-4 w-4" fill="currentColor" />
                            <span className="text-sm">Không thích</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                    );
                  })}

              {/* Pagination */}
              {allRatings.pagination && allRatings.pagination.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-6">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setRatingsPage(prev => Math.max(1, prev - 1))}
                    disabled={ratingsPage === 1}
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    Trước
                  </Button>
                  <span className="text-sm text-gray-400">
                    Trang {ratingsPage} / {allRatings.pagination.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setRatingsPage(prev => Math.min(allRatings.pagination.totalPages, prev + 1))}
                    disabled={ratingsPage === allRatings.pagination.totalPages}
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    Sau
                  </Button>
                </div>
              )}
                </div>
              );
            })()
          ) : (
            <div className="text-center py-8 text-gray-400">
              <p>Chưa có đánh giá nào</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
