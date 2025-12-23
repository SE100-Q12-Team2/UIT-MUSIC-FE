import { listeningHistoryApi } from '@/core/api/listening-history.api';
import { ListeningHistoryQuery, ListeningHistoryStatsQuery, TrackSongRequest } from '@/types/listening-history.api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// Track a song play
export function useTrackSong() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: TrackSongRequest) => listeningHistoryApi.trackSong(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['listening-history'] });
		},
	});
}

// Get paginated listening history
export function useListeningHistory(query?: ListeningHistoryQuery) {
	return useQuery({
		queryKey: ['listening-history', query],
		queryFn: () => listeningHistoryApi.getListeningHistory(query),
	});
}

// Get recently played songs
export function useRecentlyPlayed(limit?: number) {
	return useQuery({
		queryKey: ['recently-played', limit],
		queryFn: () => listeningHistoryApi.getRecentlyPlayed(limit),
	});
}

// Get listening statistics
export function useListeningStats(query?: ListeningHistoryStatsQuery) {
	return useQuery({
		queryKey: ['listening-stats', query],
		queryFn: () => listeningHistoryApi.getListeningStats(query),
	});
}

// Clear all listening history
export function useClearHistory() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: () => listeningHistoryApi.clearHistory(),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['listening-history'] });
		},
	});
}

// Delete a specific history item
export function useDeleteHistoryItem() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (id: number) => listeningHistoryApi.deleteHistoryItem(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['listening-history'] });
		},
	});
}
