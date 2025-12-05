import { useEffect } from 'react';
import { useBackground } from '@/contexts/BackgroundContext';

/**
 * Hook to set the page background image
 * The background will be applied to MainLayout and shared with Footer
 * @param backgroundImage - The imported background image or URL string
 */
export const usePageBackground = (backgroundImage: string) => {
  const { setBackgroundImage } = useBackground();

  useEffect(() => {
    setBackgroundImage(backgroundImage);
    
    // Cleanup: reset background when component unmounts
    return () => {
      setBackgroundImage(null);
    };
  }, [backgroundImage, setBackgroundImage]);
};
