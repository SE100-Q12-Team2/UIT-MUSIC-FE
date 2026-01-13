import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useActiveAds, useTrackImpression, useTrackClick } from '@/core/services/advertisement.service';
import { useSubscriptionStatus } from '@/core/services/subscription.service';

interface PopupAdProps {
  showDelay?: number; 
  sessionOnly?: boolean;
}

export const PopupAd: React.FC<PopupAdProps> = ({ 
  showDelay = 3000,
  sessionOnly = true 
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const { data: subscriptionStatus } = useSubscriptionStatus();
  const isPremium = subscriptionStatus?.hasActiveSubscription ?? false;

  const { data: ads = [] } = useActiveAds({ placement: 'Homepage', limit: 3 });
  const trackImpression = useTrackImpression();
  const trackClick = useTrackClick();

  const popupAds = ads.filter(ad => ad.adType === 'Interstitial' || ad.adType === 'Banner');
  const currentAd = popupAds[0];

  useEffect(() => {
    if (isPremium) return;
    
    if (sessionOnly) {
      const hasShownAd = sessionStorage.getItem('hasShownPopupAd');
      if (hasShownAd) {
        return;
      }
    }

    if (popupAds.length === 0) return;

    // Show ad after delay
    const timer = setTimeout(() => {
      setIsVisible(true);
      
      // Mark as shown in session
      if (sessionOnly) {
        sessionStorage.setItem('hasShownPopupAd', 'true');
      }
    }, showDelay);

    return () => clearTimeout(timer);
  }, [isPremium, popupAds.length, showDelay, sessionOnly]);

  useEffect(() => {
    if (isPremium) return;
    if (currentAd && isVisible) {
      trackImpression.mutate({ id: currentAd.id });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPremium, currentAd?.id, isVisible]);

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

  if (isPremium || !currentAd || !isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md animate-in fade-in duration-500">
      <div className="relative max-w-3xl w-full mx-4 animate-in zoom-in-95 slide-in-from-bottom-4 duration-500">
        <div className="bg-gradient-to-br from-vio-900 via-purple-900 to-pink-900 rounded-2xl overflow-hidden shadow-2xl border border-white/10">
          {currentAd.imageUrl && (
            <div className="relative">
              <img
                src={currentAd.imageUrl}
                alt={currentAd.title}
                className="w-full h-64 md:h-96 object-cover cursor-pointer hover:scale-105 transition-transform duration-500"
                onClick={handleClick}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
                loading="eager"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-vio-900 via-transparent to-transparent" />
            </div>
          )}

          <div className="p-8 md:p-10 bg-gradient-to-br from-vio-900/90 to-purple-900/90 backdrop-blur-xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm text-white font-medium mb-4 animate-pulse">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
              Ưu đãi đặc biệt
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white drop-shadow-lg leading-tight">
              {currentAd.title}
            </h2>
            <p className="text-lg text-white/90 mb-6 leading-relaxed">
              {currentAd.content}
            </p>

            <div className="flex items-center gap-4 flex-wrap">
              {currentAd.targetUrl && (
                <button
                  onClick={handleClick}
                  className="px-8 py-3 bg-white text-vio-600 rounded-xl hover:bg-white/90 transition-all font-bold shadow-xl transform hover:scale-105 hover:shadow-2xl"
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
          className="absolute -top-12 right-0 p-3 text-white hover:text-white/80 transition-all hover:scale-110 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20"
          aria-label="Close advertisement"
        >
          <X className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
};
