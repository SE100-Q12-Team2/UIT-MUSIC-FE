import React from 'react';
import { useCopyrightReports } from '@/core/services/admin.service';
import { AlertTriangle, ExternalLink } from 'lucide-react';
import '@/styles/admin-copyright-reports.css';

const AdminCopyrightReportsPage: React.FC = () => {
  const { data: reportsData, isLoading } = useCopyrightReports();

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
      case 'Under Review':
        return 'admin-copyright-reports__status-badge--review';
      case 'Resolved':
        return 'admin-copyright-reports__status-badge--resolved';
      case 'Rejected':
        return 'admin-copyright-reports__status-badge--rejected';
      default:
        return '';
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

  const reports = reportsData?.items || [];
  const totalReports = reportsData?.total || 0;
  const pendingCount = reportsData?.pending || 0;
  const resolvedCount = reportsData?.resolved || 0;
  const rejectedCount = reportsData?.rejected || 0;

  return (
    <div className="admin-copyright-reports">
      <div className="admin-copyright-reports__content">
        {/* Overview Cards */}
        <div className="admin-copyright-reports__overview">
          <div className="admin-copyright-reports__overview-card">
            <AlertTriangle size={20} className="admin-copyright-reports__card-icon" />
            <div className="admin-copyright-reports__card-content">
              <div className="admin-copyright-reports__card-value">{totalReports}</div>
              <div className="admin-copyright-reports__card-label">Total Reports</div>
            </div>
          </div>
          <div className="admin-copyright-reports__overview-card">
            <AlertTriangle size={20} className="admin-copyright-reports__card-icon" />
            <div className="admin-copyright-reports__card-content">
              <div className="admin-copyright-reports__card-value">{pendingCount}</div>
              <div className="admin-copyright-reports__card-label">Pending</div>
            </div>
          </div>
          <div className="admin-copyright-reports__overview-card">
            <AlertTriangle size={20} className="admin-copyright-reports__card-icon" />
            <div className="admin-copyright-reports__card-content">
              <div className="admin-copyright-reports__card-value">{resolvedCount}</div>
              <div className="admin-copyright-reports__card-label">Resolved</div>
            </div>
          </div>
          <div className="admin-copyright-reports__overview-card">
            <AlertTriangle size={20} className="admin-copyright-reports__card-icon" />
            <div className="admin-copyright-reports__card-content">
              <div className="admin-copyright-reports__card-value">{rejectedCount}</div>
              <div className="admin-copyright-reports__card-label">Rejected</div>
            </div>
          </div>
        </div>

        {/* Recent Reports */}
        <div className="admin-copyright-reports__recent">
          <h2 className="admin-copyright-reports__recent-title">Recent Reports</h2>
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
                    <div className="admin-copyright-reports__report-title">{report.songTitle}</div>
                    <div className="admin-copyright-reports__report-details">
                      Reported by: {report.reportedBy} • {report.reason}
                    </div>
                  </div>
                  <div className="admin-copyright-reports__report-meta">
                    <div className="admin-copyright-reports__report-date">{formatDate(report.createdAt)}</div>
                    <span className={`admin-copyright-reports__status-badge ${getStatusBadgeClass(report.status)}`}>
                      {report.status}
                    </span>
                  </div>
                  <button className="admin-copyright-reports__report-action">
                    <ExternalLink size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminCopyrightReportsPage;

