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
          className="relative rounded-lg overflow-hidden cursor-pointer bg-accent"
          onClick={handleClick}
        >
          {currentAd.imageUrl ? (
            <img
              src={currentAd.imageUrl}
              alt={currentAd.title}
              className="w-full h-auto object-cover"
            />
          ) : (
            <div className="p-6">
              <h3 className="font-semibold text-lg mb-2">{currentAd.title}</h3>
              <p className="text-sm text-muted-foreground">{currentAd.content}</p>
            </div>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleClose();
            }}
            className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-black/70 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 rounded text-xs text-white">
          Quảng cáo
        </div>
      </div>
    );
  }

  // Interstitial Ad (Full screen overlay)
  if (currentAd.adType === 'Interstitial') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
        <div className="relative max-w-2xl w-full mx-4">
          <div className="bg-background rounded-lg overflow-hidden">
            {currentAd.imageUrl && (
              <img
                src={currentAd.imageUrl}
                alt={currentAd.title}
                className="w-full h-auto object-cover cursor-pointer"
                onClick={handleClick}
              />
            )}

            <div className="p-6">
              <h2 className="text-2xl font-bold mb-2">{currentAd.title}</h2>
              <p className="text-muted-foreground mb-4">{currentAd.content}</p>

              <div className="flex items-center gap-3">
                {currentAd.targetUrl && (
                  <button
                    onClick={handleClick}
                    className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    Tìm hiểu thêm
                  </button>
                )}
                <button
                  onClick={handleClose}
                  className="px-6 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="absolute -top-12 right-0 p-2 text-white hover:text-white/80 transition-colors"
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
