import React, { useState } from 'react';
import {
  useTransactions,
  useTransactionStats,
  useRefundTransaction,
  Transaction,
} from '@/core/services/transaction.service';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import '@/styles/admin-home.css';
import '@/styles/loading.css';

export const AdminTransactionsPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [refundingId, setRefundingId] = useState<number | null>(null);

  const { data: transactionsData, isLoading, refetch } = useTransactions({
    page,
    limit: 20,
    status: statusFilter === 'all' ? undefined : (statusFilter as Transaction['status']),
  });

  console.log('Transactions Data:', transactionsData);

  const { data: stats } = useTransactionStats();
  const refundTransaction = useRefundTransaction();

  const handleRefund = async (id: number, reason: string) => {
    try {
      await refundTransaction.mutateAsync({ id, data: { reason } });
      setRefundingId(null);
    } catch (error) {
      console.error('Refund failed:', error);
    }
  };

  const filteredTransactions = transactionsData?.data.filter((transaction) => {
    if (!searchQuery) return true;
    return (
      transaction.id.toString().includes(searchQuery) ||
      transaction.userId.toString().includes(searchQuery)
    );
  });

  const getStatusBadge = (status: Transaction['status']) => {
    const statusConfig = {
      Pending: { label: 'Đang xử lý', color: '#FBBF24' },
      Completed: { label: 'Thành công', color: '#34D399' },
      Failed: { label: 'Thất bại', color: '#EF4444' },
      Refunded: { label: 'Đã hoàn', color: '#60A5FA' },
    };
    
    const config = statusConfig[status];
    
    if (!config) {
      return (
        <span className="admin-table__status" style={{ backgroundColor: 'rgba(156, 163, 175, 0.2)', color: '#9CA3AF' }}>
          {status || 'Unknown'}
        </span>
      );
    }
    
    return (
      <span className="admin-table__status" style={{ backgroundColor: `${config.color}20`, color: config.color }}>
        {config.label}
      </span>
    );
  };

  const formatCurrency = (amount?: number | null) => {
    if (amount === null || amount === undefined || isNaN(amount)) {
      return '0 đ';
    }
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const formatNumber = (num?: number | null) => {
    if (num === null || num === undefined || isNaN(num)) {
      return '0';
    }
    return num.toLocaleString('vi-VN');
  };

  return (
    <div className="admin-home">
      {/* Header */}
      <div className="admin-home__header">
        <div>
          <h1 className="admin-home__title">Quản lý Giao dịch</h1>
          <p className="admin-home__subtitle">Theo dõi và quản lý tất cả giao dịch thanh toán</p>
        </div>
        <button className="admin-home__refresh-btn" onClick={() => refetch()}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="23 4 23 10 17 10" />
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
          </svg>
          Làm mới
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="admin-home__top-stats">
        <div className="stat-card">
          <div className="stat-card__icon" style={{ color: '#10B981' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="1" x2="12" y2="23" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
          <div className="stat-card__content">
            <div className="stat-card__value">{formatCurrency(stats?.totalRevenue)}</div>
            <div className="stat-card__title">Tổng doanh thu</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card__icon" style={{ color: '#34D399' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <div className="stat-card__content">
            <div className="stat-card__value">{formatNumber(stats?.successfulTransactions)}</div>
            <div className="stat-card__title">Thành công</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card__icon" style={{ color: '#FBBF24' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
          <div className="stat-card__content">
            <div className="stat-card__value">{formatNumber(stats?.pendingTransactions)}</div>
            <div className="stat-card__title">Đang xử lý</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card__icon" style={{ color: '#EF4444' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          </div>
          <div className="stat-card__content">
            <div className="stat-card__value">{formatNumber(stats?.failedTransactions)}</div>
            <div className="stat-card__title">Thất bại</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="admin-home__filters">
        <div className="admin-home__search">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Tìm kiếm theo ID, User ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="admin-home__search-input"
          />
        </div>
        <select 
          value={statusFilter} 
          onChange={(e) => setStatusFilter(e.target.value)}
          className="admin-home__filter-select"
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="Pending">Đang xử lý</option>
          <option value="Completed">Thành công</option>
          <option value="Failed">Thất bại</option>
          <option value="Refunded">Đã hoàn tiền</option>
        </select>
      </div>

      {/* Transactions Table */}
      <div className="admin-table-container">
        {isLoading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p className="loading-text">Đang tải dữ liệu...</p>
          </div>
        ) : filteredTransactions && filteredTransactions.length > 0 ? (
          <>
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>User ID</th>
                    <th>Số tiền</th>
                    <th>Phương thức</th>
                    <th>Trạng thái</th>
                    <th>Thời gian</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td><span className="admin-table__id">#{transaction.id}</span></td>
                      <td><span className="admin-table__id">#{transaction.userId}</span></td>
                      <td className="admin-table__amount">{formatCurrency(transaction.amount)}</td>
                      <td className="admin-table__method">
                        {transaction.paymentMethod?.methodName || `Method #${transaction.paymentMethodId}`}
                      </td>
                      <td>{getStatusBadge(transaction.status)}</td>
                      <td className="admin-table__time">
                        {formatDistanceToNow(new Date(transaction.createdAt), {
                          addSuffix: true,
                          locale: vi,
                        })}
                      </td>
                      <td>
                        {transaction.status === 'Completed' && (
                          <button
                            className="admin-table__action-btn"
                            onClick={() => setRefundingId(transaction.id)}
                            disabled={refundTransaction.isPending}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="23 4 23 10 17 10" />
                              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                            </svg>
                            Hoàn tiền
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {transactionsData && transactionsData.totalPages > 1 && (
              <div className="admin-table__pagination">
                <span className="admin-table__pagination-info">
                  Trang {page} / {transactionsData.totalPages} - Tổng {transactionsData.total} giao dịch
                </span>
                <div className="admin-table__pagination-controls">
                  <button
                    className="admin-table__pagination-btn"
                    disabled={page === 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    Trước
                  </button>
                  <button
                    className="admin-table__pagination-btn"
                    disabled={page === transactionsData.totalPages}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Sau
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="admin-table__empty">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="1" x2="12" y2="23" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
            <p className="admin-table__empty-title">Không tìm thấy giao dịch</p>
            <p className="admin-table__empty-subtitle">Chưa có giao dịch nào phù hợp với bộ lọc</p>
          </div>
        )}
      </div>

      {/* Refund Modal */}
      {refundingId !== null && (
        <div className="admin-modal-overlay" onClick={() => setRefundingId(null)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal__header">
              <h3 className="admin-modal__title">Xác nhận hoàn tiền</h3>
              <button className="admin-modal__close" onClick={() => setRefundingId(null)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div className="admin-modal__body">
              <p>Bạn có chắc chắn muốn hoàn tiền cho giao dịch #{refundingId}?</p>
              <p className="admin-modal__warning">Hành động này không thể hoàn tác.</p>
            </div>
            <div className="admin-modal__footer">
              <button className="admin-modal__btn admin-modal__btn--cancel" onClick={() => setRefundingId(null)}>
                Hủy
              </button>
              <button 
                className="admin-modal__btn admin-modal__btn--danger"
                onClick={() => refundingId && handleRefund(refundingId, 'Admin refund')}
              >
                Xác nhận hoàn tiền
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTransactionsPage;
