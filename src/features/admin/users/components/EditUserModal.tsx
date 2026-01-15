import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useUpdateUser } from '@/core/services/admin.service';
import { AdminUser } from '@/core/api/admin.api';
import '@/styles/admin-modal.css';

interface EditUserModalProps {
  user: AdminUser;
  onClose: () => void;
}

const EditUserModal: React.FC<EditUserModalProps> = ({ user, onClose }) => {
  const [formData, setFormData] = useState({
    fullName: user.fullName,
    dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
    gender: user.gender || 'Male' as 'Male' | 'Female' | 'Other',
  });

  const updateUserMutation = useUpdateUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    updateUserMutation.mutate({
      id: user.id,
      data: {
        fullName: formData.fullName,
        dateOfBirth: formData.dateOfBirth || undefined,
        gender: formData.gender,
      }
    }, {
      onSuccess: () => {
        onClose();
      }
    });
  };

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="admin-modal-header">
          <h2 className="admin-modal-title">Edit User</h2>
          <button className="admin-modal-close" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="admin-modal-body">
            <div className="admin-form-group">
              <label className="admin-form-label" htmlFor="fullName">
                Full Name <span className="admin-form-required">*</span>
              </label>
              <input
                type="text"
                id="fullName"
                className="admin-form-input"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                required
                placeholder="Enter full name"
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="admin-form-input"
                value={user.email}
                disabled
                style={{ opacity: 0.6, cursor: 'not-allowed' }}
              />
              <small className="admin-form-help">Email cannot be changed</small>
            </div>

            <div className="admin-form-row">
              <div className="admin-form-group">
                <label className="admin-form-label" htmlFor="dateOfBirth">
                  Date of Birth
                </label>
                <input
                  type="date"
                  id="dateOfBirth"
                  className="admin-form-input"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label" htmlFor="gender">
                  Gender
                </label>
                <select
                  id="gender"
                  className="admin-form-select"
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'Male' | 'Female' | 'Other' })}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          <div className="admin-modal-footer">
            <button
              type="button"
              className="admin-modal-btn admin-modal-btn--secondary"
              onClick={onClose}
              disabled={updateUserMutation.isPending}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="admin-modal-btn admin-modal-btn--primary"
              disabled={updateUserMutation.isPending}
            >
              {updateUserMutation.isPending ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;
