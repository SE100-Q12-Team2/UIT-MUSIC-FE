import React, { useState } from 'react';
import { useCopyrightReports, useCopyrightReportStats, useUpdateCopyrightReportStatus, useDeleteCopyrightReport } from '@/core/services/admin.service';
import { AlertTriangle, Eye, Edit2, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import '@/styles/admin-copyright-reports.css';

const AdminCopyrightReportsPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const limit = 20;

  const { data: reportsData, isLoading } = useCopyrightReports(page, limit, statusFilter || undefined);
  const { data: statsData } = useCopyrightReportStats();
  
  // Mutations
  const updateStatusMutation = useUpdateCopyrightReportStatus();
  const deleteMutation = useDeleteCopyrightReport();

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getStatusBadgeClass = (status: string): string => {
    switch (status) {
      case 'Pending':
        return 'admin-copyright-reports__status-badge--pending';
      case 'UnderReview':
        return 'admin-copyright-reports__status-badge--review';
      case 'Resolved':
        return 'admin-copyright-reports__status-badge--resolved';
      case 'Dismissed':
        return 'admin-copyright-reports__status-badge--rejected';
      default:
        return '';
    }
  };

  const getStatusLabel = (status: string): string => {
    switch (status) {
      case 'Pending':
        return 'Pending';
      case 'UnderReview':
        return 'Under Review';
      case 'Resolved':
        return 'Resolved';
      case 'Dismissed':
        return 'Dismissed';
      default:
        return status;
    }
  };

  const handleUpdateStatus = (reportId: number, newStatus: string) => {
    updateStatusMutation.mutate({
      id: reportId,
      data: { status: newStatus as any }
    });
  };

  const handleDelete = (reportId: number, songTitle: string) => {
    if (window.confirm(`Are you sure you want to delete the report for "${songTitle}"?`)) {
      deleteMutation.mutate(reportId);
    }
  };

  if (isLoading) {
    return (
      <div className="admin-copyright-reports">
        <div className="admin-copyright-reports__content">
          <div className="admin-copyright-reports__loading">Loading reports...</div>
        </div>
      </div>
    );
  }

  const reports = reportsData?.data || [];
  const pagination = reportsData?.pagination || { page: 1, limit: 20, total: 0, totalPages: 1 };
  const stats = statsData || {
    totalReports: 0,
    pendingReports: 0,
    underReviewReports: 0,
    resolvedReports: 0,
    dismissedReports: 0,
  };

  return (
    <div className="admin-copyright-reports">
      <div className="admin-copyright-reports__content">
        {/* Overview Cards */}
        <div className="admin-copyright-reports__overview">
          <div className="admin-copyright-reports__overview-card">
            <AlertTriangle size={20} className="admin-copyright-reports__card-icon" />
            <div className="admin-copyright-reports__card-content">
              <div className="admin-copyright-reports__card-value">{stats.totalReports}</div>
              <div className="admin-copyright-reports__card-label">Total Reports</div>
            </div>
          </div>
          <div className="admin-copyright-reports__overview-card">
            <AlertTriangle size={20} className="admin-copyright-reports__card-icon" />
            <div className="admin-copyright-reports__card-content">
              <div className="admin-copyright-reports__card-value">{stats.pendingReports}</div>
              <div className="admin-copyright-reports__card-label">Pending</div>
            </div>
          </div>
          <div className="admin-copyright-reports__overview-card">
            <AlertTriangle size={20} className="admin-copyright-reports__card-icon" />
            <div className="admin-copyright-reports__card-content">
              <div className="admin-copyright-reports__card-value">{stats.underReviewReports}</div>
              <div className="admin-copyright-reports__card-label">Under Review</div>
            </div>
          </div>
          <div className="admin-copyright-reports__overview-card">
            <AlertTriangle size={20} className="admin-copyright-reports__card-icon" />
            <div className="admin-copyright-reports__card-content">
              <div className="admin-copyright-reports__card-value">{stats.resolvedReports}</div>
              <div className="admin-copyright-reports__card-label">Resolved</div>
            </div>
          </div>
          <div className="admin-copyright-reports__overview-card">
            <AlertTriangle size={20} className="admin-copyright-reports__card-icon" />
            <div className="admin-copyright-reports__card-content">
              <div className="admin-copyright-reports__card-value">{stats.dismissedReports}</div>
              <div className="admin-copyright-reports__card-label">Dismissed</div>
            </div>
          </div>
        </div>

        {/* Filter */}
        <div className="admin-copyright-reports__filter">
          <select 
            value={statusFilter} 
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="admin-copyright-reports__filter-select"
          >
            <option value="">All Status</option>
            <option value="Pending">Pending</option>
            <option value="UnderReview">Under Review</option>
            <option value="Resolved">Resolved</option>
            <option value="Dismissed">Dismissed</option>
          </select>
        </div>

        {/* Reports List */}
        <div className="admin-copyright-reports__recent">
          <h2 className="admin-copyright-reports__recent-title">Copyright Reports</h2>
          {reports.length === 0 ? (
            <div className="admin-copyright-reports__empty">No reports found</div>
          ) : (
            <div className="admin-copyright-reports__reports-list">
              {reports.map((report) => (
                <div key={report.id} className="admin-copyright-reports__report-item">
                  <div className="admin-copyright-reports__report-icon">
                    <AlertTriangle size={20} />
                  </div>
                  <div className="admin-copyright-reports__report-content">
                    <div className="admin-copyright-reports__report-title">
                      {report.song?.title || `Song ID: ${report.reportedSongId}`}
                    </div>
                    <div className="admin-copyright-reports__report-details">
                      Reported by: {report.reporter?.fullName || 'Unknown'} • {report.reportReason}
                    </div>
                  </div>
                  <div className="admin-copyright-reports__report-meta">
                    <div className="admin-copyright-reports__report-date">{formatDate(report.createdAt)}</div>
                    <span className={`admin-copyright-reports__status-badge ${getStatusBadgeClass(report.status)}`}>
                      {getStatusLabel(report.status)}
                    </span>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="admin-copyright-reports__report-action">
                        <Edit2 size={16} />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="admin-copyright-reports__dropdown-content">
                      <DropdownMenuItem onClick={() => {
                        // View details - can be implemented later
                        console.log('View report', report.id);
                      }}>
                        <Eye size={16} />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {report.status !== 'UnderReview' && (
                        <DropdownMenuItem 
                          onClick={() => handleUpdateStatus(report.id, 'UnderReview')}
                          disabled={updateStatusMutation.isPending}
                        >
                          <Edit2 size={16} />
                          Mark Under Review
                        </DropdownMenuItem>
                      )}
                      {report.status !== 'Resolved' && (
                        <DropdownMenuItem 
                          onClick={() => handleUpdateStatus(report.id, 'Resolved')}
                          disabled={updateStatusMutation.isPending}
                        >
                          <Edit2 size={16} />
                          Mark Resolved
                        </DropdownMenuItem>
                      )}
                      {report.status !== 'Dismissed' && (
                        <DropdownMenuItem 
                          onClick={() => handleUpdateStatus(report.id, 'Dismissed')}
                          disabled={updateStatusMutation.isPending}
                        >
                          <Edit2 size={16} />
                          Mark Dismissed
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => handleDelete(report.id, report.song?.title || `Report #${report.id}`)}
                        variant="destructive"
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 size={16} />
                        Delete Report
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
          )}
          
          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="admin-copyright-reports__pagination">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="admin-copyright-reports__pagination-btn"
              >
                <ChevronLeft size={16} />
                Previous
              </button>
              <span className="admin-copyright-reports__pagination-info">
                Page {pagination.page} of {pagination.totalPages} ({pagination.total} total)
              </span>
              <button
                onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                disabled={page === pagination.totalPages}
                className="admin-copyright-reports__pagination-btn"
              >
                Next
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminCopyrightReportsPage;

