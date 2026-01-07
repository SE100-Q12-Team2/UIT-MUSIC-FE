import { useMutation } from '@tanstack/react-query';
import { playbackApi, PlaybackOptions } from '@/core/api/playback.api';

export function useGetPlaybackUrl() {
  return useMutation({
    mutationFn: ({ songId, options }: { songId: number; options?: PlaybackOptions }) =>
      playbackApi.getPlaybackUrl(songId, options),
  });
}
