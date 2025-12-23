import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserProfile } from '@/types/auth.types';

interface ProfileState {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  setProfile: (profile: UserProfile) => void;
  clearProfile: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      profile: null,
      isLoading: false,
      error: null,
      setProfile: (profile) => set({ profile, error: null }),
      clearProfile: () => set({ profile: null, error: null }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
    }),
    {
      name: 'profile-storage',
    }
  )
);
