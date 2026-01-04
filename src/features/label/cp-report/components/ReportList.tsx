import React from 'react';
import { CopyrightReport } from '@/core/services/copyright-report.service';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

interface ReportListProps {
  reports: CopyrightReport[];
  isLoading: boolean;
}

const ReportList: React.FC<ReportListProps> = ({ reports, isLoading }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return '#FFA726';
      case 'Resolved':
        return '#66BB6A';
      case 'Rejected':
        return '#EF5350';
      default:
        return '#9E9E9E';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'Đang Xử Lý';
      case 'Resolved':
        return 'Đã Giải Quyết';
      case 'Rejected':
        return 'Bị Từ Chối';
      default:
        return status;
    }
  };

  if (isLoading) {
    return (
      <div className="report-list">
        <div className="report-list__loading">Đang tải...</div>
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <div className="report-list">
        <div className="report-list__empty">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5">
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
          <p>Chưa Có Báo Cáo Nào</p>
        </div>
      </div>
    );
  }

  return (
    <div className="report-list">
      {reports.map((report) => (
        <div key={report.id} className="report-item">
          <div className="report-item__header">
            <div className="report-item__song">
              <h3>{report.song.title}</h3>
              <p>{report.song.artist}</p>
            </div>
            <div 
              className="report-item__status"
              style={{ color: getStatusColor(report.status) }}
            >
              {getStatusText(report.status)}
            </div>
          </div>
          <div className="report-item__reason">{report.reportReason}</div>
          {report.adminNotes && (
            <div className="report-item__notes">
              <strong>Ghi chú admin:</strong> {report.adminNotes}
            </div>
          )}
          <div className="report-item__footer">
            <span>
              Báo cáo {formatDistanceToNow(new Date(report.createdAt), { addSuffix: true, locale: vi })}
            </span>
            {report.resolvedAt && (
              <span>
                Giải quyết {formatDistanceToNow(new Date(report.resolvedAt), { addSuffix: true, locale: vi })}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReportList;
