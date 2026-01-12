import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { useActiveAds, useTrackImpression, useTrackClick } from '@/core/services/advertisement.service';
import { cn } from '@/lib/utils';

interface AdDisplayProps {
  placement: 'Homepage' | 'Player' | 'Sidebar' | 'PreRoll' | 'MidRoll' | 'PostRoll';
  className?: string;
}

export const AdDisplay: React.FC<AdDisplayProps> = ({ placement, className }) => {
  const [currentAdIndex, setCurrentAdIndex] = React.useState(0);
  const [isVisible, setIsVisible] = React.useState(true);

  const { data: ads = [] } = useActiveAds({ placement, limit: 5 });
  const trackImpression = useTrackImpression();
  const trackClick = useTrackClick();

  const currentAd = ads[currentAdIndex];

  // Track impression when ad is shown
  useEffect(() => {
    if (currentAd && isVisible) {
      trackImpression.mutate({ id: currentAd.id });
    }
  }, [currentAd?.id, isVisible]);

  // Rotate ads
  useEffect(() => {
    if (ads.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentAdIndex((prev) => (prev + 1) % ads.length);
    }, 15000); // Change ad every 15 seconds

    return () => clearInterval(interval);
  }, [ads.length]);

  const handleClick = () => {
    if (!currentAd) return;

    trackClick.mutate({ id: currentAd.id });

    if (currentAd.targetUrl) {
      window.open(currentAd.targetUrl, '_blank');
    }
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!currentAd || !isVisible) return null;

  // Banner Ad
  if (currentAd.adType === 'Banner') {
    return (
      <div className={cn('relative group', className)}>
        <div
          className="relative rounded-xl overflow-hidden cursor-pointer bg-gradient-to-br from-vio-600 via-purple-600 to-pink-600 shadow-2xl transform hover:scale-[1.02] transition-all duration-300"
          onClick={handleClick}
        >
          {currentAd.imageUrl ? (
            <div className="relative">
              <img
                src={currentAd.imageUrl}
                alt={currentAd.title}
                className="w-full h-48 md:h-64 object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              {/* Gradient overlay for better text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              
              {/* Content overlay on image */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-2xl mb-2 text-white drop-shadow-lg">{currentAd.title}</h3>
                    <p className="text-sm text-white/90 drop-shadow-md line-clamp-2">{currentAd.content}</p>
                    {currentAd.targetUrl && (
                      <button className="mt-3 px-4 py-2 bg-white text-vio-600 rounded-lg font-semibold hover:bg-white/90 transition-all transform hover:scale-105 shadow-lg">
                        Xem ngay →
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 md:p-10 min-h-[200px] flex flex-col justify-center">
              <div className="space-y-4">
                <div className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs text-white font-medium">
                  ✨ Quảng cáo
                </div>
                <h3 className="font-bold text-3xl text-white drop-shadow-lg">{currentAd.title}</h3>
                <p className="text-lg text-white/90 max-w-2xl">{currentAd.content}</p>
                {currentAd.targetUrl && (
                  <button className="mt-4 px-6 py-3 bg-white text-vio-600 rounded-lg font-semibold hover:bg-white/90 transition-all transform hover:scale-105 shadow-xl">
                    Khám phá ngay →
                  </button>
                )}
              </div>
            </div>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleClose();
            }}
            className="absolute top-4 right-4 p-2 bg-black/70 hover:bg-black/90 rounded-full text-white transition-all backdrop-blur-sm shadow-lg"
            aria-label="Close advertisement"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="absolute top-4 left-4 px-3 py-1.5 bg-black/70 backdrop-blur-sm rounded-full text-xs text-white font-medium shadow-lg">
          Quảng cáo
        </div>
      </div>
    );
  }

  // Interstitial Ad (Full screen overlay)
  if (currentAd.adType === 'Interstitial') {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
        <div className="relative max-w-3xl w-full mx-4 animate-in zoom-in-95 duration-300">
          <div className="bg-gradient-to-br from-vio-900 via-purple-900 to-pink-900 rounded-2xl overflow-hidden shadow-2xl border border-white/10">
            {currentAd.imageUrl && (
              <div className="relative">
                <img
                  src={currentAd.imageUrl}
                  alt={currentAd.title}
                  className="w-full h-64 md:h-96 object-cover cursor-pointer"
                  onClick={handleClick}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-vio-900 via-transparent to-transparent" />
              </div>
            )}

            <div className="p-8 md:p-10 bg-gradient-to-br from-vio-900/90 to-purple-900/90 backdrop-blur-xl">
              <div className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs text-white font-medium mb-4">
                ✨ Quảng cáo đặc biệt
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white drop-shadow-lg">
                {currentAd.title}
              </h2>
              <p className="text-lg text-white/90 mb-6 leading-relaxed">
                {currentAd.content}
              </p>

              <div className="flex items-center gap-4 flex-wrap">
                {currentAd.targetUrl && (
                  <button
                    onClick={handleClick}
                    className="px-8 py-3 bg-white text-vio-600 rounded-xl hover:bg-white/90 transition-all font-bold shadow-xl transform hover:scale-105"
                  >
                    Khám phá ngay →
                  </button>
                )}
                <button
                  onClick={handleClose}
                  className="px-8 py-3 bg-white/10 backdrop-blur-sm text-white rounded-xl hover:bg-white/20 transition-all font-semibold border border-white/20"
                >
                  Để sau
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="absolute -top-12 right-0 p-3 text-white hover:text-white/80 transition-all hover:scale-110 bg-white/10 backdrop-blur-sm rounded-full"
            aria-label="Close advertisement"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
      </div>
    );
  }

  // Video Ad (Player ads)
  if (currentAd.adType === 'Video' && currentAd.videoUrl) {
    return (
      <div className={cn('relative rounded-lg overflow-hidden bg-black', className)}>
        <video
          src={currentAd.videoUrl}
          controls
          autoPlay
          className="w-full h-auto"
          onEnded={handleClose}
        />

        <button
          onClick={handleClose}
          className="absolute top-2 right-2 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 rounded text-xs text-white">
          Quảng cáo
        </div>
      </div>
    );
  }

  // Audio Ad
  if (currentAd.adType === 'Audio') {
    return (
      <div className={cn('bg-accent rounded-lg p-4', className)}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-muted-foreground">Quảng cáo âm thanh</span>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-background rounded-full transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <h4 className="font-semibold mb-1">{currentAd.title}</h4>
        <p className="text-sm text-muted-foreground">{currentAd.content}</p>

        {currentAd.targetUrl && (
          <button
            onClick={handleClick}
            className="mt-3 text-sm text-primary hover:underline"
          >
            Tìm hiểu thêm →
          </button>
        )}
      </div>
    );
  }

  return null;
};
