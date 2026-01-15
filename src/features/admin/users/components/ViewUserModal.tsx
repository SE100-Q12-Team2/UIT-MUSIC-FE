import React from 'react';
import { X, Mail, Calendar, User as UserIcon, Shield, Activity } from 'lucide-react';
import { useAdminUserDetail } from '@/core/services/admin.service';
import '@/styles/admin-modal.css';

interface ViewUserModalProps {
  userId: number;
  onClose: () => void;
}

const ViewUserModal: React.FC<ViewUserModalProps> = ({ userId, onClose }) => {
  const { data: user, isLoading, error } = useAdminUserDetail(userId);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (isLoading) {
    return (
      <div className="admin-modal-overlay" onClick={onClose}>
        <div className="admin-modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="admin-modal-loading">Loading user details...</div>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="admin-modal-overlay" onClick={onClose}>
        <div className="admin-modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="admin-modal-error">Failed to load user details</div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal-content admin-modal-content--large" onClick={(e) => e.stopPropagation()}>
        <div className="admin-modal-header">
          <h2 className="admin-modal-title">User Details</h2>
          <button className="admin-modal-close" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <div className="admin-modal-body">
          {/* Profile Section */}
          <div className="user-detail-profile">
            <div className="user-detail-avatar">
              {user.profileImage ? (
                <img src={user.profileImage} alt={user.fullName} />
              ) : (
                <div className="user-detail-avatar-placeholder">
                  {getInitials(user.fullName)}
                </div>
              )}
            </div>
            <div className="user-detail-info">
              <h3 className="user-detail-name">{user.fullName}</h3>
              <p className="user-detail-email">
                <Mail size={16} />
                {user.email}
              </p>
              <div className="user-detail-badges">
                <span className={`user-detail-badge user-detail-badge--${user.accountStatus.toLowerCase()}`}>
                  {user.accountStatus}
                </span>
                {user.role && (
                  <span className="user-detail-badge user-detail-badge--role">
                    <Shield size={14} />
                    {user.role.name}
                  </span>
                )}
                {user.subscriptions && user.subscriptions.length > 0 && (
                  <span className="user-detail-badge user-detail-badge--premium">
                    Premium
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="user-detail-grid">
            <div className="user-detail-item">
              <div className="user-detail-item-icon">
                <UserIcon size={18} />
              </div>
              <div className="user-detail-item-content">
                <span className="user-detail-item-label">Gender</span>
                <span className="user-detail-item-value">{user.gender || 'Not specified'}</span>
              </div>
            </div>

            <div className="user-detail-item">
              <div className="user-detail-item-icon">
                <Calendar size={18} />
              </div>
              <div className="user-detail-item-content">
                <span className="user-detail-item-label">Date of Birth</span>
                <span className="user-detail-item-value">
                  {user.dateOfBirth ? formatDate(user.dateOfBirth) : 'Not specified'}
                </span>
              </div>
            </div>

            <div className="user-detail-item">
              <div className="user-detail-item-icon">
                <Activity size={18} />
              </div>
              <div className="user-detail-item-content">
                <span className="user-detail-item-label">Joined</span>
                <span className="user-detail-item-value">{formatDate(user.createdAt)}</span>
              </div>
            </div>

            {user.updatedAt && (
              <div className="user-detail-item">
                <div className="user-detail-item-icon">
                  <Activity size={18} />
                </div>
                <div className="user-detail-item-content">
                  <span className="user-detail-item-label">Last Updated</span>
                  <span className="user-detail-item-value">{formatDate(user.updatedAt)}</span>
                </div>
              </div>
            )}
          </div>

          {/* Subscription Info */}
          {user.subscriptions && user.subscriptions.length > 0 && (
            <div className="user-detail-section">
              <h4 className="user-detail-section-title">Subscription</h4>
              <div className="user-detail-subscription">
                {user.subscriptions.map((sub) => (
                  <div key={sub.id} className="user-detail-subscription-card">
                    <div className="user-detail-subscription-plan">
                      <Shield size={16} />
                      {sub.plan.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="admin-modal-footer">
          <button className="admin-modal-btn admin-modal-btn--secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewUserModal;
