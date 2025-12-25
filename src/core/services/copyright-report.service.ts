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

export const copyrightReportService = {
  getMyReports: async (page = 1, limit = 10): Promise<CopyrightReportsResponse> => {
    return api.get<CopyrightReportsResponse>('/copyright-reports/my-reports', {
      params: { page, limit }
    });
  },

  createReport: async (data: CreateCopyrightReportDto): Promise<CopyrightReport> => {
    return api.post<CopyrightReport>('/copyright-reports', data);
  },
};

export const useMyReports = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ['copyright-reports', 'my-reports', page, limit],
    queryFn: () => copyrightReportService.getMyReports(page, limit),
    enabled: true,
  });
};

export const useCreateReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCopyrightReportDto) => copyrightReportService.createReport(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['copyright-reports', 'my-reports'] });
    },
  });
};
