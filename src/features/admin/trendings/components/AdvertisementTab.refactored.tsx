import React, { useState } from 'react';
import Pagination from '@/shared/components/Pagination';
import { AdvertisementStatsCard } from './AdvertisementStatsCard';
import { CampaignItem } from './CampaignItem';
import { NotificationToast } from './NotificationToast';
import { AdvertisementModal } from './AdvertisementModal';
import { useAdvertisementData } from '../hooks/useAdvertisementData';
import { useAdvertisementStats } from '../hooks/useAdvertisementStats';
import { useAdvertisementModal } from '../hooks/useAdvertisementModal';
import { useNotification } from '../hooks/useNotification';
import '@/styles/loading.css';
import '@/styles/subscription.css';

const AdvertisementTab: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(8);

  const { notification, showNotification, hideNotification } = useNotification();
  
  const {
    revenueStats,
    dailyStats,
    advertisements,
    isLoading,
    error,
    refetch,
  } = useAdvertisementData(currentPage, limit);

  const { stats, campaigns } = useAdvertisementStats(revenueStats, dailyStats, advertisements);

  const {
    isEditModalOpen,
    isCreateModalOpen,
    isSaving,
    editingAd,
    setEditingAd,
    openEditModal,
    openCreateModal,
    closeEditModal,
    closeCreateModal,
    handleSaveEdit,
    handleSaveCreate,
  } = useAdvertisementModal(refetch, showNotification);

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
          <button onClick={refetch} className="admin-home__retry-btn">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="advertisement-tab">
      {/* Top Stats */}
      <div className="advertisement-tab__stats">
        {stats.map((stat) => (
          <AdvertisementStatsCard
            key={stat.id}
            iconType={stat.iconType}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            iconColor={stat.iconColor}
          />
        ))}
      </div>

      {/* Add Advertisement Button */}
      <div className="advertisement-tab__header">
        <button className="advertisement-tab__add-btn" onClick={openCreateModal}>
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
            <CampaignItem
              key={campaign.id}
              id={campaign.id}
              name={campaign.name}
              impressions={campaign.impressions}
              clicks={campaign.clicks}
              status={campaign.status}
              statusClass={campaign.statusClass}
              onEdit={() => openEditModal(campaign.originalAd)}
            />
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
        <NotificationToast
          type={notification.type}
          message={notification.message}
          onClose={hideNotification}
        />
      )}

      {/* Edit Modal */}
      <AdvertisementModal
        isOpen={isEditModalOpen}
        mode="edit"
        formData={editingAd}
        isSaving={isSaving}
        onClose={closeEditModal}
        onSave={handleSaveEdit}
        onChange={setEditingAd}
      />

      {/* Create Modal */}
      <AdvertisementModal
        isOpen={isCreateModalOpen}
        mode="create"
        formData={editingAd}
        isSaving={isSaving}
        onClose={closeCreateModal}
        onSave={handleSaveCreate}
        onChange={setEditingAd}
      />
    </div>
  );
};

export default AdvertisementTab;
