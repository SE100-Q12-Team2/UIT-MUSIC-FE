import React, { useState, useEffect } from 'react';
import { adminApi, RevenueStatsResponse, DailyStatsResponse, AdvertisementsResponse, CreateAdvertisementRequest, UpdateAdvertisementRequest } from '@/core/api/admin.api';
import Pagination from '@/shared/components/Pagination';
import '@/styles/loading.css';
import '@/styles/subscription.css';

const AdvertisementTab: React.FC = () => {
  const [revenueStats, setRevenueStats] = useState<RevenueStatsResponse | null>(null);
  const [dailyStats, setDailyStats] = useState<DailyStatsResponse | null>(null);
  const [advertisements, setAdvertisements] = useState<AdvertisementsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(8);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [editingAd, setEditingAd] = useState<{
    id: number;
    adName: string;
    adType: 'Audio' | 'Video' | 'Banner';
    filePath: string;
    duration: number;
    ageMin: number;
    ageMax: number;
    gender: 'Male' | 'Female' | 'Other' | 'All';
    subscriptionType: 'Free' | 'Premium' | 'All';
    startDate: string;
    endDate: string;
    isActive: boolean;
  } | null>(null);

  useEffect(() => {
    fetchAdvertisementData();
  }, [currentPage]);

  const getDateRange = () => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);
    
    const formatDate = (date: Date) => date.toISOString().split('T')[0];
    return {
      startDate: formatDate(startDate),
      endDate: formatDate(endDate),
    };
  };

  const fetchAdvertisementData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { startDate, endDate } = getDateRange();
      const [revenue, daily, ads] = await Promise.all([
        adminApi.getRevenueStats(startDate, endDate),
        adminApi.getDailyStats(startDate, endDate),
        adminApi.getAdvertisements(currentPage, limit),
      ]);
      setRevenueStats(revenue);
      setDailyStats(daily);
      setAdvertisements(ads);
    } catch (err) {
      setError('Failed to load advertisement data');
      console.error('Error fetching advertisements:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const formatNumber = (num?: number | null): string => {
    if (num === null || num === undefined || Number.isNaN(num)) {
      return '0';
    }
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toLocaleString();
  };

  const formatCurrency = (amount?: number | null): string => {
    if (!amount) return '$0';
    return `$${formatNumber(amount)}`;
  };

  const calculateTotalImpressions = (): number => {
    if (!dailyStats?.data) return 0;
    return dailyStats.data.reduce((sum, day) => sum + (day.adImpressions || 0), 0);
  };

  const calculateClickRate = (): string => {
    const impressions = calculateTotalImpressions();
    if (impressions === 0) return '0%';
    // Estimate clicks as 3-5% of impressions
    const clickRate = 3.8;
    return `${clickRate.toFixed(1)}%`;
  };

  const getActiveCampaignsCount = (): number => {
    if (!advertisements?.data) return 0;
    return advertisements.data.filter(ad => ad.isActive).length;
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleEditClick = (ad: any) => {
    setEditingAd({
      id: ad.id,
      adName: ad.adName,
      adType: ad.adType,
      filePath: ad.filePath || '',
      duration: ad.duration || 0,
      ageMin: ad.targetAudience?.ageRange?.min || 13,
      ageMax: ad.targetAudience?.ageRange?.max || 100,
      gender: ad.targetAudience?.gender || 'All',
      subscriptionType: ad.targetAudience?.subscriptionType || 'All',
      startDate: ad.startDate?.split('T')[0] || '',
      endDate: ad.endDate?.split('T')[0] || '',
      isActive: ad.isActive,
    });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingAd) return;

    if (!editingAd.adName || !editingAd.startDate || !editingAd.endDate) {
      showNotification('error', 'Please fill in all required fields');
      return;
    }

    setIsSaving(true);
    try {
      const updateData: UpdateAdvertisementRequest = {
        adName: editingAd.adName,
        adType: editingAd.adType,
        filePath: editingAd.filePath || undefined,
        duration: editingAd.duration || undefined,
        targetAudience: {
          ageRange: {
            min: editingAd.ageMin,
            max: editingAd.ageMax,
          },
          gender: editingAd.gender,
          subscriptionType: editingAd.subscriptionType,
        },
        startDate: editingAd.startDate,
        endDate: editingAd.endDate,
        isActive: editingAd.isActive,
      };

      await adminApi.updateAdvertisement(editingAd.id, updateData);
      showNotification('success', 'Advertisement updated successfully!');
      setIsEditModalOpen(false);
      setEditingAd(null);
      fetchAdvertisementData();
    } catch (error: any) {
      showNotification('error', error.response?.data?.message || 'Failed to update advertisement');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateClick = () => {
    setEditingAd({
      id: 0,
      adName: '',
      adType: 'Banner',
      filePath: '',
      duration: 0,
      ageMin: 13,
      ageMax: 100,
      gender: 'All',
      subscriptionType: 'All',
      startDate: '',
      endDate: '',
      isActive: true,
    });
    setIsCreateModalOpen(true);
  };

  const handleSaveCreate = async () => {
    if (!editingAd) return;

    if (!editingAd.adName || !editingAd.startDate || !editingAd.endDate) {
      showNotification('error', 'Please fill in all required fields');
      return;
    }

    setIsSaving(true);
    try {
      const createData: CreateAdvertisementRequest = {
        adName: editingAd.adName,
        adType: editingAd.adType,
        filePath: editingAd.filePath || undefined,
        duration: editingAd.duration || undefined,
        targetAudience: {
          ageRange: {
            min: editingAd.ageMin,
            max: editingAd.ageMax,
          },
          gender: editingAd.gender,
          subscriptionType: editingAd.subscriptionType,
        },
        startDate: editingAd.startDate,
        endDate: editingAd.endDate,
        isActive: editingAd.isActive,
      };

      await adminApi.createAdvertisement(createData);
      showNotification('success', 'Advertisement created successfully!');
      setIsCreateModalOpen(false);
      setEditingAd(null);
      fetchAdvertisementData();
    } catch (error: any) {
      showNotification('error', error.response?.data?.message || 'Failed to create advertisement');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteClick = async (id: number, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) {
      return;
    }

    try {
      await adminApi.deleteAdvertisement(id);
      showNotification('success', 'Advertisement deleted successfully!');
      fetchAdvertisementData();
    } catch (error: any) {
      showNotification('error', error.response?.data?.message || 'Failed to delete advertisement');
    }
  };

  if (isLoading) {
    return (
      <div className="advertisement-tab">
        <div className="loading-container">
          <div className="spinner"></div>
          <p className="loading-text">Loading advertisement data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="advertisement-tab">
        <div className="admin-home__error">
          <p>{error}</p>
          <button onClick={fetchAdvertisementData} className="admin-home__retry-btn">
            Retry
          </button>
        </div>
      </div>
    );
  }

  const stats = revenueStats && dailyStats ? [
    {
      id: 1,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
      ),
      title: 'Active Campaigns',
      value: (advertisements?.pagination?.total || 0).toString(),
      change: 25.0,
      iconColor: '#8B5CF6',
    },
    {
      id: 2,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 18V5l12-2v13" />
          <circle cx="6" cy="18" r="3" />
          <circle cx="18" cy="16" r="3" />
        </svg>
      ),
      title: 'Total Impressions',
      value: formatNumber(calculateTotalImpressions()),
      change: 18.5,
      iconColor: '#3B82F6',
    },
    {
      id: 3,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
      ),
      title: 'Click Rate',
      value: calculateClickRate(),
      change: 5.2,
      iconColor: '#10B981',
    },
    {
      id: 4,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="12" y1="1" x2="12" y2="23" />
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      ),
      title: 'Ad Revenue',
      value: formatCurrency(revenueStats.summary.totalRevenueAds),
      change: 12.3,
      iconColor: '#10B981',
    },
  ] : [];

  const campaigns = advertisements?.data ? advertisements.data.map((ad) => {
    const impressions = ad._count.impressions || 0;
    const clicks = Math.floor(impressions * 0.04); // 4% click rate
    const status = ad.isActive ? 'Active' : 'Paused';
    
    return {
      id: ad.id,
      name: ad.adName,
      impressions: `${formatNumber(impressions)} impressions`,
      clicks: `${formatNumber(clicks)} clicks`,
      status,
      statusClass: status === 'Active' ? 'campaign-status--active' : 'campaign-status--paused',
      originalAd: ad, // Keep original ad data for editing
    };
  }) : [];

  return (
    <div className="advertisement-tab">
      {/* Top Stats */}
      <div className="advertisement-tab__stats">
        {stats.map((stat) => (
          <div key={stat.id} className="analytics-stat-card">
            <div className="analytics-stat-card__icon" style={{ color: stat.iconColor }}>
              {stat.icon}
            </div>
            <div className="analytics-stat-card__content">
              <div className="analytics-stat-card__value">{stat.value}</div>
              <div className="analytics-stat-card__title">{stat.title}</div>
            </div>
            <div className={`analytics-stat-card__change ${stat.change >= 0 ? 'analytics-stat-card__change--positive' : 'analytics-stat-card__change--negative'}`}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d={stat.change >= 0 ? "M12 19V5M5 12l7-7 7 7" : "M12 5v14M19 12l-7 7-7-7"} />
              </svg>
            </div>
          </div>
        ))}
      </div>

      {/* Add Advertisement Button */}
      <div className="advertisement-tab__header">
        <button className="advertisement-tab__add-btn" onClick={handleCreateClick}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Advertisement
        </button>
      </div>

      {/* Active Campaigns */}
      <div className="active-campaigns">
        <h2 className="active-campaigns__title">Active Campaigns</h2>
        <div className="campaigns-list">
          {campaigns.map((campaign) => (
            <div key={campaign.id} className="campaign-item">
              <div className="campaign-item__info">
                <h3 className="campaign-item__name">{campaign.name}</h3>
                <div className="campaign-item__stats">
                  <span className="campaign-item__impressions">{campaign.impressions}</span>
                  <span className="campaign-item__separator">•</span>
                  <span className="campaign-item__clicks">{campaign.clicks}</span>
                </div>
              </div>
              <div className="campaign-item__actions">
                <span className={`campaign-item__status ${campaign.statusClass}`}>
                  {campaign.status}
                </span>
                <button className="campaign-item__edit-btn" onClick={() => handleEditClick(campaign.originalAd)}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </button>
                {/* <button className="campaign-item__delete-btn" onClick={() => handleDeleteClick(campaign.id, campaign.name)}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                </button> */}
              </div>
            </div>
          ))}
        </div>
        {advertisements?.pagination && advertisements.pagination.totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={advertisements.pagination.totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className={`notification-toast notification-toast--${notification.type}`}>
          <div className="notification-toast__icon">
            {notification.type === 'success' ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
            )}
          </div>
          <span className="notification-toast__message">{notification.message}</span>
          <button className="notification-toast__close" onClick={() => setNotification(null)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && editingAd && (
        <div className="modal-overlay" onClick={() => setIsEditModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Edit Advertisement</h2>
              <button className="modal-close" onClick={() => setIsEditModalOpen(false)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Ad Name *</label>
                <input
                  type="text"
                  className="form-input"
                  value={editingAd.adName}
                  onChange={(e) => setEditingAd({ ...editingAd, adName: e.target.value })}
                  placeholder="Enter advertisement name"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Ad Type *</label>
                  <select
                    className="form-input"
                    value={editingAd.adType}
                    onChange={(e) => setEditingAd({ ...editingAd, adType: e.target.value as 'Audio' | 'Video' | 'Banner' })}
                  >
                    <option value="Audio">Audio</option>
                    <option value="Video">Video</option>
                    <option value="Banner">Banner</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Duration (seconds)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={editingAd.duration}
                    onChange={(e) => setEditingAd({ ...editingAd, duration: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                    min="0"
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">File Path</label>
                <input
                  type="text"
                  className="form-input"
                  value={editingAd.filePath}
                  onChange={(e) => setEditingAd({ ...editingAd, filePath: e.target.value })}
                  placeholder="Enter file path (optional)"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Start Date *</label>
                  <input
                    type="date"
                    className="form-input"
                    value={editingAd.startDate}
                    onChange={(e) => setEditingAd({ ...editingAd, startDate: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">End Date *</label>
                  <input
                    type="date"
                    className="form-input"
                    value={editingAd.endDate}
                    onChange={(e) => setEditingAd({ ...editingAd, endDate: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-section-title">Target Audience</div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Age Range (Min)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={editingAd.ageMin}
                    onChange={(e) => setEditingAd({ ...editingAd, ageMin: parseInt(e.target.value) || 13 })}
                    min="13"
                    max="100"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Age Range (Max)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={editingAd.ageMax}
                    onChange={(e) => setEditingAd({ ...editingAd, ageMax: parseInt(e.target.value) || 100 })}
                    min="13"
                    max="100"
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Gender</label>
                  <select
                    className="form-input"
                    value={editingAd.gender}
                    onChange={(e) => setEditingAd({ ...editingAd, gender: e.target.value as any })}
                  >
                    <option value="All">All</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Subscription Type</label>
                  <select
                    className="form-input"
                    value={editingAd.subscriptionType}
                    onChange={(e) => setEditingAd({ ...editingAd, subscriptionType: e.target.value as any })}
                  >
                    <option value="All">All</option>
                    <option value="Free">Free</option>
                    <option value="Premium">Premium</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-checkbox">
                  <input
                    type="checkbox"
                    checked={editingAd.isActive}
                    onChange={(e) => setEditingAd({ ...editingAd, isActive: e.target.checked })}
                  />
                  <span>Active</span>
                </label>
              </div>
            </div>
            <div className="modal-footer">
              <button className="modal-btn modal-btn--cancel" onClick={() => setIsEditModalOpen(false)} disabled={isSaving}>
                Cancel
              </button>
              <button 
                className="modal-btn modal-btn--save" 
                onClick={handleSaveEdit}
                disabled={isSaving || !editingAd.adName || !editingAd.startDate || !editingAd.endDate}
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {isCreateModalOpen && editingAd && (
        <div className="modal-overlay" onClick={() => setIsCreateModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Create Advertisement</h2>
              <button className="modal-close" onClick={() => setIsCreateModalOpen(false)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Ad Name *</label>
                <input
                  type="text"
                  className="form-input"
                  value={editingAd.adName}
                  onChange={(e) => setEditingAd({ ...editingAd, adName: e.target.value })}
                  placeholder="Enter advertisement name"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Ad Type *</label>
                  <select
                    className="form-input"
                    value={editingAd.adType}
                    onChange={(e) => setEditingAd({ ...editingAd, adType: e.target.value as 'Audio' | 'Video' | 'Banner' })}
                  >
                    <option value="Audio">Audio</option>
                    <option value="Video">Video</option>
                    <option value="Banner">Banner</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Duration (seconds)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={editingAd.duration}
                    onChange={(e) => setEditingAd({ ...editingAd, duration: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                    min="0"
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">File Path</label>
                <input
                  type="text"
                  className="form-input"
                  value={editingAd.filePath}
                  onChange={(e) => setEditingAd({ ...editingAd, filePath: e.target.value })}
                  placeholder="Enter file path (optional)"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Start Date *</label>
                  <input
                    type="date"
                    className="form-input"
                    value={editingAd.startDate}
                    onChange={(e) => setEditingAd({ ...editingAd, startDate: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">End Date *</label>
                  <input
                    type="date"
                    className="form-input"
                    value={editingAd.endDate}
                    onChange={(e) => setEditingAd({ ...editingAd, endDate: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-section-title">Target Audience</div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Age Range (Min)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={editingAd.ageMin}
                    onChange={(e) => setEditingAd({ ...editingAd, ageMin: parseInt(e.target.value) || 13 })}
                    min="13"
                    max="100"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Age Range (Max)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={editingAd.ageMax}
                    onChange={(e) => setEditingAd({ ...editingAd, ageMax: parseInt(e.target.value) || 100 })}
                    min="13"
                    max="100"
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Gender</label>
                  <select
                    className="form-input"
                    value={editingAd.gender}
                    onChange={(e) => setEditingAd({ ...editingAd, gender: e.target.value as any })}
                  >
                    <option value="All">All</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Subscription Type</label>
                  <select
                    className="form-input"
                    value={editingAd.subscriptionType}
                    onChange={(e) => setEditingAd({ ...editingAd, subscriptionType: e.target.value as any })}
                  >
                    <option value="All">All</option>
                    <option value="Free">Free</option>
                    <option value="Premium">Premium</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-checkbox">
                  <input
                    type="checkbox"
                    checked={editingAd.isActive}
                    onChange={(e) => setEditingAd({ ...editingAd, isActive: e.target.checked })}
                  />
                  <span>Active</span>
                </label>
              </div>
            </div>
            <div className="modal-footer">
              <button className="modal-btn modal-btn--cancel" onClick={() => setIsCreateModalOpen(false)} disabled={isSaving}>
                Cancel
              </button>
              <button 
                className="modal-btn modal-btn--save" 
                onClick={handleSaveCreate}
                disabled={isSaving || !editingAd.adName || !editingAd.startDate || !editingAd.endDate}
              >
                {isSaving ? 'Creating...' : 'Create Advertisement'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvertisementTab;
