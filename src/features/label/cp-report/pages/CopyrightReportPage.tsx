import React, { useState } from 'react';
import { useMyReports } from '@/core/services/copyright-report.service';
import { ReportList, CreateReportForm, ReportTabs, ReportTab } from '../components';
import '@/styles/copyright-report.css';

const CopyrightReportPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ReportTab>('history');
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [searchTerm, setSearchTerm] = useState('');
  const limit = 10;

  const { data: reportsData, isLoading } = useMyReports(currentPage, limit, statusFilter || undefined);

  const reports = reportsData?.data || [];
  const pagination = reportsData?.pagination;

  const filteredAndSortedReports = React.useMemo(() => {
    let filtered = reports;

    if (searchTerm) {
      filtered = filtered.filter((report) =>
        report.song?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.song?.artist?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.reportReason.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === 'createdAt') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (sortBy === 'createdAt-asc') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else if (sortBy === 'status') {
        return a.status.localeCompare(b.status);
      }
      return 0;
    });

    return sorted;
  }, [reports, searchTerm, sortBy]);

  const handleReportSuccess = () => {
    setActiveTab('history');
    setCurrentPage(1);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'history':
        return (
          <>
            <div className="copyright-report-page__search-bar">
              <div className="copyright-report-page__search">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="m21 21-4.35-4.35"/>
                </svg>
                <input 
                  type="text" 
                  placeholder="Search" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="copyright-report-page__filter-dropdown">
                <select 
                  value={statusFilter} 
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="copyright-report-page__filter"
                >
                  <option value="">All</option>
                  <option value="Pending">Đang Xử Lý</option>
                  <option value="Resolved">Đã Giải Quyết</option>
                  <option value="Rejected">Bị Từ Chối</option>
                </select>
              </div>
              <div className="copyright-report-page__sort-dropdown">
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                  className="copyright-report-page__sort"
                >
                  <option value="createdAt">Mới Nhất</option>
                  <option value="createdAt-asc">Cũ Nhất</option>
                  <option value="status">Trạng Thái</option>
                </select>
              </div>
            </div>

            <ReportList reports={filteredAndSortedReports} isLoading={isLoading} />

            {pagination && pagination.totalPages > 1 && (
              <div className="copyright-report-page__pagination">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                >
                  Previous
                </button>
                <span>
                  Page {currentPage} of {pagination.totalPages}
                </span>
                <button
                  disabled={currentPage === pagination.totalPages}
                  onClick={() => setCurrentPage((prev) => Math.min(pagination.totalPages, prev + 1))}
                >
                  Next
                </button>
              </div>
            )}
          </>
        );
      case 'create':
        return <CreateReportForm onSuccess={handleReportSuccess} />;
      default:
        return null;
    }
  };

  return (
    <div className="copyright-report-page">
      <ReportTabs activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="copyright-report-page__content">{renderContent()}</div>
    </div>
  );
};

export default CopyrightReportPage;
