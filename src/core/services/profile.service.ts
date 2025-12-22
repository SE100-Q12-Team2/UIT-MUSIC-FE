import { useQuery } from '@tanstack/react-query';
import api from '@/config/api.config';
import { UserProfile } from '@/types/auth.types';
import { useProfileStore } from '@/store/profileStore';

export const profileService = {
  // Fetch current user profile
  getProfile: async (): Promise<UserProfile> => {
    const response = await api.get<UserProfile>('/profile');
    return response;
  },
};

// React Query hook for profile
export const useProfile = () => {
  const { setProfile, setLoading, setError } = useProfileStore();

  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      setLoading(true);
      try {
        const profile = await profileService.getProfile();
        setProfile(profile);
        return profile;
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to fetch profile');
        throw error;
      } finally {
        setLoading(false);
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to get profile from store (for use in other components)
export const useProfileData = () => {
  return useProfileStore((state) => state.profile);
};

// Hook to get profile ID
export const useProfileId = () => {
  return useProfileStore((state) => state.profile?.id);
};
