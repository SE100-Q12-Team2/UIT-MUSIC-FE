import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/config/api.config';

// Copyright Report interfaces
export interface CopyrightReportSong {
  id: number;
  title: string;
  artist: string;
}

export interface CopyrightReportReporter {
  id: number;
  fullName: string;
  email: string;
}

export interface CopyrightReport {
  id: number;
  songId: number;
  reporterType: 'System' | 'Label' | 'User';
  reporterId: number;
  reportReason: string;
  status: 'Pending' | 'Resolved' | 'Rejected';
  adminNotes: string | null;
  createdAt: string;
  resolvedAt: string | null;
  song: CopyrightReportSong;
  reporter: CopyrightReportReporter;
}

export interface CopyrightReportPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface CopyrightReportsResponse {
  data: CopyrightReport[];
  pagination: CopyrightReportPagination;
}

export interface CreateCopyrightReportDto {
  songId: number;
  reportReason: string;
}

export interface UpdateReportReasonDto {
  reportReason: string;
}

export const copyrightReportService = {
  getMyReports: async (page = 1, limit = 10, status?: string): Promise<CopyrightReportsResponse> => {
    return api.get<CopyrightReportsResponse>('/copyright-reports/my-reports', {
      params: { page, limit, status }
    });
  },

  getReportedSongIds: async (): Promise<number[]> => {
    return api.get<number[]>('/copyright-reports/my-reported-songs');
  },

  createReport: async (data: CreateCopyrightReportDto): Promise<CopyrightReport> => {
    return api.post<CopyrightReport>('/copyright-reports', data);
  },

  updateReport: async (id: number, data: UpdateReportReasonDto): Promise<CopyrightReport> => {
    return api.patch<CopyrightReport>(`/copyright-reports/my-reports/${id}`, data);
  },

  deleteReport: async (id: number): Promise<void> => {
    return api.delete(`/copyright-reports/my-reports/${id}`);
  },
};

export const useMyReports = (page = 1, limit = 10, status?: string) => {
  return useQuery({
    queryKey: ['copyright-reports', 'my-reports', page, limit, status],
    queryFn: () => copyrightReportService.getMyReports(page, limit, status),
    enabled: true,
  });
};

export const useReportedSongIds = () => {
  return useQuery({
    queryKey: ['copyright-reports', 'reported-song-ids'],
    queryFn: () => copyrightReportService.getReportedSongIds(),
    enabled: true,
  });
};

export const useCreateReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCopyrightReportDto) => copyrightReportService.createReport(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['copyright-reports', 'my-reports'] });
      queryClient.invalidateQueries({ queryKey: ['copyright-reports', 'reported-song-ids'] });
    },
  });
};

export const useUpdateReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateReportReasonDto }) => 
      copyrightReportService.updateReport(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['copyright-reports', 'my-reports'] });
    },
  });
};

export const useDeleteReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => copyrightReportService.deleteReport(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['copyright-reports', 'my-reports'] });
      queryClient.invalidateQueries({ queryKey: ['copyright-reports', 'reported-song-ids'] });
    },
  });
};
