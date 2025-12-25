import React, { useState } from 'react';
import { useMyReports } from '@/core/services/copyright-report.service';
import { ReportList, CreateReportForm, ReportTabs, ReportTab } from '../components';
import '@/styles/copyright-report.css';

const CopyrightReportPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ReportTab>('history');
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  const { data: reportsData, isLoading } = useMyReports(currentPage, limit);

  const reports = reportsData?.data || [];
  const pagination = reportsData?.pagination;

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
                <input type="text" placeholder="Search" />
              </div>
              <button className="copyright-report-page__filter">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
                </svg>
                <span>All</span>
              </button>
              <button className="copyright-report-page__sort">
                <span>Sort by</span>
              </button>
            </div>

            <ReportList reports={reports} isLoading={isLoading} />

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
