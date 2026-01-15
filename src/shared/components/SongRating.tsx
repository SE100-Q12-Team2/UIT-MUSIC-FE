import React, { useState } from 'react';
import { Star, User } from 'lucide-react';
import {
  useMyRating,
  useSongRatingStats,
  useRateSong,
  useDeleteRating,
  useSongRatings,
  Rating,
} from '@/core/services/rating.service';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface SongRatingProps {
  songId: number;
  showStats?: boolean;
  showAllRatings?: boolean;
}

const ratingToNumber = (rating: Rating): number => {
  const map: Record<Rating, number> = {
    'ONE_STAR': 1,
    'TWO_STAR': 2,
    'THREE_STAR': 3,
    'FOUR_STAR': 4,
    'FIVE_STAR': 5,
  };
  return map[rating];
};

const numberToRating = (num: number): Rating => {
  const map: Record<number, Rating> = {
    1: 'ONE_STAR',
    2: 'TWO_STAR',
    3: 'THREE_STAR',
    4: 'FOUR_STAR',
    5: 'FIVE_STAR',
  };
  return map[num];
};

const hasErrorResponse = (error: unknown): error is { response: { data: { message: string } } } => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'response' in error &&
    typeof (error as Record<string, unknown>).response === 'object'
  );
};

export const SongRating: React.FC<SongRatingProps> = ({ songId, showStats = true, showAllRatings = true }) => {
  const [ratingsPage, setRatingsPage] = useState(1);
  const [comment, setComment] = useState('');
  const [showOnlyComments, setShowOnlyComments] = useState(false);
  const [hoveredStar, setHoveredStar] = useState<number>(0);
  const [selectedStars, setSelectedStars] = useState<number>(0);
  const [isEditingComment, setIsEditingComment] = useState(false);
  
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

  const currentRating = myRating ? ratingToNumber(myRating.rating) : 0;

  const handleStarClick = (stars: number) => {
    setSelectedStars(stars);
  };

  const handleSubmitRating = async () => {
    // Bắt buộc phải chọn số sao
    if (selectedStars === 0) {
      toast.error('Vui lòng chọn số sao');
      return;
    }

    try {
      const hasComment = comment.trim().length > 0;
      await rateSongMutation.mutateAsync({
        songId,
        data: { 
          songId, 
          rating: numberToRating(selectedStars), 
          comment: hasComment ? comment.trim() : undefined 
        },
      });
      
      // Refetch data ngay lập tức
      await Promise.all([
        refetchMyRating(),
        refetchStats(),
        refetchAllRatings()
      ]);
      
      if (myRating) {
        toast.success(hasComment ? 'Đã cập nhật đánh giá và nhận xét' : 'Đã cập nhật đánh giá');
      } else {
        toast.success(hasComment ? `Đã đánh giá ${selectedStars} sao và thêm nhận xét` : `Đã đánh giá ${selectedStars} sao`);
      }
      setComment('');
      setSelectedStars(0);
      setIsEditingComment(false);
    } catch (error: unknown) {
      console.error('Error rating song:', error);
      const errorMessage = hasErrorResponse(error) 
        ? error.response?.data?.message 
        : 'Có lỗi xảy ra';
      toast.error(errorMessage || 'Có lỗi xảy ra');
    }
  };

  const handleRemoveRating = async () => {
    if (!myRating) return;

    try {
      await deleteRatingMutation.mutateAsync(songId);
      
      await Promise.all([
        refetchMyRating(),
        refetchStats(),
        refetchAllRatings()
      ]);
      
      toast.success('Đã xóa đánh giá');
      setSelectedStars(0);
    } catch (error: any) {
     
      toast.error(error?.message || 'Có lỗi xảy ra');
    }
  };

  const handleEditComment = () => {
    setComment(myRating?.comment || '');
    setIsEditingComment(true);
    // Tự động chọn sao hiện tại khi edit comment
    setSelectedStars(currentRating);
  };

  const handleCancelEditComment = () => {
    setComment('');
    setIsEditingComment(false);
  };

  const renderStar = (index: number, size: 'sm' | 'md' | 'lg' = 'md', forEditing: boolean = false) => {
    const sizeClass = size === 'sm' ? 'h-4 w-4' : size === 'lg' ? 'h-8 w-8' : 'h-6 w-6';
    const displayRating = forEditing ? (selectedStars || currentRating) : currentRating;
    const filled = index <= (hoveredStar || displayRating);
    
    return (
      <Star
        key={index}
        className={`${sizeClass} cursor-pointer transition-all ${
          filled ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'
        }`}
        onMouseEnter={() => setHoveredStar(index)}
        onMouseLeave={() => setHoveredStar(0)}
        onClick={() => handleStarClick(index)}
      />
    );
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

  return (
    <div className="space-y-6">
      {/* Statistics Section */}
      {showStats && stats && (
        <div className="bg-linear-to-br from-vio-600/20 to-vio-900/20 backdrop-blur-sm rounded-xl p-6 border border-white/10">
          <h3 className="text-lg font-semibold text-white mb-4">Thống kê đánh giá</h3>
          
          {/* Average Rating Display */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-5xl font-bold text-white">{stats.averageRating.toFixed(1)}</span>
              <Star className="h-10 w-10 fill-yellow-400 text-yellow-400" />
            </div>
            <div className="flex items-center justify-center gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-5 w-5 ${
                    star <= Math.round(stats.averageRating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-400'
                  }`}
                />
              ))}
            </div>
            <div className="text-sm text-gray-400">
              {stats.totalRatings} đánh giá
            </div>
          </div>

          {/* Rating Distribution */}
          <div className="space-y-2">
            {[
              { stars: 5, count: stats.fiveStar },
              { stars: 4, count: stats.fourStar },
              { stars: 3, count: stats.threeStar },
              { stars: 2, count: stats.twoStar },
              { stars: 1, count: stats.oneStar },
            ].map(({ stars, count }) => {
              const percentage = stats.totalRatings > 0 ? (count / stats.totalRatings) * 100 : 0;
              return (
                <div key={stars} className="flex items-center gap-2 text-sm">
                  <div className="flex items-center gap-1 w-16">
                    <span className="text-gray-400">{stars}</span>
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  </div>
                  <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-400 transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-gray-400 w-12 text-right">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* User Rating Actions */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
        <h3 className="text-lg font-semibold text-white mb-4">Đánh giá của bạn</h3>
        
        {myRating ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-gray-300">Đánh giá của bạn:</span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-5 w-5 ${
                      star <= currentRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'
                    }`}
                  />
                ))}
              </div>
              <span className="text-yellow-400 font-semibold">
                {currentRating} sao
              </span>
            </div>

            {/* Star rating selector */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Thay đổi đánh giá
              </label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => renderStar(star, 'lg', true))}
              </div>
              {selectedStars > 0 && selectedStars !== currentRating && (
                <p className="text-sm text-yellow-400 mt-2">
                  Đã chọn {selectedStars} sao (chưa lưu)
                </p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm text-gray-400">
                  Nhận xét của bạn
                </label>
                {myRating?.comment && !isEditingComment && (
                  <button
                    onClick={handleEditComment}
                    className="text-sm text-vio-400 hover:text-vio-300 transition-colors text-white cursor-pointer"
                  >
                    Sửa
                  </button>
                )}
              </div>

              {myRating?.comment && !isEditingComment ? (
                // Hiển thị comment hiện tại
                <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                  <p className="text-sm text-gray-300 whitespace-pre-wrap">{myRating.comment}</p>
                </div>
              ) : (
                <>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Chia sẻ suy nghĩ của bạn về bài hát này..."
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-vio-500 resize-none"
                    rows={3}
                    maxLength={500}
                  />
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-gray-500">
                      {comment.length}/500 ký tự
                    </p>
                    {isEditingComment && (
                      <button
                        onClick={handleCancelEditComment}
                        className="text-xs text-gray-400 hover:text-white transition-colors cursor-pointer"
                      >
                        Hủy
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
            
            <div className="space-y-3">
              {/* Hiện nút submit khi có thay đổi */}
              {(selectedStars > 0 || (isEditingComment && comment.trim().length > 0) || (!myRating?.comment && comment.trim().length > 0)) && (
                <Button
                  onClick={handleSubmitRating}
                  variant="default"
                  className="w-full bg-vio-600 hover:bg-vio-700 text-white border cursor-pointer"
                  disabled={rateSongMutation.isPending}
                >
                  {rateSongMutation.isPending ? 'Đang lưu...' : 'Lưu đánh giá'}
                </Button>
              )}
              
              <Button
                onClick={handleRemoveRating}
                variant="ghost"
                className="w-full hover:bg-white/10 text-white border cursor-pointer hover:text-red-500"
                disabled={deleteRatingMutation.isPending}
              >
                Xóa đánh giá
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-gray-300">Bạn đánh giá bài hát này bao nhiêu sao?</p>
            
            {/* Star rating selector */}
            <div>
              <div className="flex items-center justify-center gap-2 py-4">
                {[1, 2, 3, 4, 5].map((star) => renderStar(star, 'lg', true))}
              </div>
              {hoveredStar > 0 && (
                <p className="text-center text-sm text-yellow-400">
                  {hoveredStar} sao
                </p>
              )}
              {selectedStars > 0 && hoveredStar === 0 && (
                <p className="text-center text-sm text-yellow-400">
                  Đã chọn {selectedStars} sao
                </p>
              )}
            </div>
            
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

            {/* Nút submit hiện khi đã chọn sao */}
            {selectedStars > 0 && (
              <Button
                onClick={handleSubmitRating}
                variant="default"
                className="w-full bg-vio-600 hover:bg-vio-700 text-white"
                disabled={rateSongMutation.isPending}
              >
                {rateSongMutation.isPending ? 'Đang gửi...' : 'Gửi đánh giá'}
              </Button>
            )}
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
                setRatingsPage(1);
              }}
              className={`text-sm ${showOnlyComments ? 'text-vio-400 font-medium' : 'text-gray-400'} hover:text-white transition-colors`}
            >
              {/* {showOnlyComments ? '✓ Chỉ nhận xét' : 'Chỉ nhận xét'} */}
            </Button>
          </div>
          
          {loadingAllRatings ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-vio-accent"></div>
            </div>
          ) : allRatings && allRatings.data.length > 0 ? (
            (() => {
              const filteredRatings = allRatings.data
                .filter(rating => !showOnlyComments || rating.comment)
                .sort((a, b) => {
                  if (a.comment && !b.comment) return -1;
                  if (!a.comment && b.comment) return 1;
                  return 0;
                });
              
              const commentCount = allRatings.data.filter(r => r.comment).length;
              
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
                  {commentCount > 0 && !showOnlyComments && (
                    <div className="text-sm text-gray-400 pb-2 border-b border-white/10">
                      {commentCount} người đã để lại nhận xét
                    </div>
                  )}
                  
                  {filteredRatings.map((rating) => (
                    <div 
                      key={`${rating.user?.id || rating.userId}-${rating.songId}`}
                      className="flex items-start gap-3 p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                    >
                      {/* User Avatar */}
                      <div className="shrink-0">
                        {rating.user?.profileImage ? (
                          <img
                            src={rating.user.profileImage}
                            alt={rating.user.fullName}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-linear-to-br from-vio-600 to-vio-900 flex items-center justify-center">
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
                        
                        {/* Star rating */}
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-4 w-4 ${
                                  star <= ratingToNumber(rating.rating)
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-400'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-yellow-400 font-medium">
                            {ratingToNumber(rating.rating)} sao
                          </span>
                        </div>

                        {/* Display comment if exists */}
                        {rating.comment && (
                          <div className="p-3 bg-white/5 rounded-lg border-l-2 border-vio-500">
                            <p className="text-sm text-gray-200 leading-relaxed">
                              {rating.comment}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

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
