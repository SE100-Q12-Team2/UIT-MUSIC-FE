import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useCreateUser } from '@/core/services/admin.service';
import '@/styles/admin-modal.css';

interface CreateUserModalProps {
  onClose: () => void;
}

const CreateUserModal: React.FC<CreateUserModalProps> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    roleId: 2, // Default to Listener role
    dateOfBirth: '',
    gender: 'Male' as 'Male' | 'Female' | 'Other',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const createUserMutation = useCreateUser();

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.fullName) {
      newErrors.fullName = 'Full name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    createUserMutation.mutate({
      email: formData.email,
      password: formData.password,
      fullName: formData.fullName,
      roleId: formData.roleId,
      dateOfBirth: formData.dateOfBirth || undefined,
      gender: formData.gender,
    }, {
      onSuccess: () => {
        onClose();
      }
    });
  };

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal-content admin-modal-content--large" onClick={(e) => e.stopPropagation()}>
        <div className="admin-modal-header">
          <h2 className="admin-modal-title">Create New User</h2>
          <button className="admin-modal-close" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="admin-modal-body">
            <div className="admin-form-group">
              <label className="admin-form-label" htmlFor="email">
                Email <span className="admin-form-required">*</span>
              </label>
              <input
                type="email"
                id="email"
                className={`admin-form-input ${errors.email ? 'admin-form-input--error' : ''}`}
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value });
                  setErrors({ ...errors, email: '' });
                }}
                placeholder="user@example.com"
              />
              {errors.email && <span className="admin-form-error">{errors.email}</span>}
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label" htmlFor="fullName">
                Full Name <span className="admin-form-required">*</span>
              </label>
              <input
                type="text"
                id="fullName"
                className={`admin-form-input ${errors.fullName ? 'admin-form-input--error' : ''}`}
                value={formData.fullName}
                onChange={(e) => {
                  setFormData({ ...formData, fullName: e.target.value });
                  setErrors({ ...errors, fullName: '' });
                }}
                placeholder="John Doe"
              />
              {errors.fullName && <span className="admin-form-error">{errors.fullName}</span>}
            </div>

            <div className="admin-form-row">
              <div className="admin-form-group">
                <label className="admin-form-label" htmlFor="password">
                  Password <span className="admin-form-required">*</span>
                </label>
                <input
                  type="password"
                  id="password"
                  className={`admin-form-input ${errors.password ? 'admin-form-input--error' : ''}`}
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value });
                    setErrors({ ...errors, password: '' });
                  }}
                  placeholder="Minimum 6 characters"
                />
                {errors.password && <span className="admin-form-error">{errors.password}</span>}
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label" htmlFor="confirmPassword">
                  Confirm Password <span className="admin-form-required">*</span>
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  className={`admin-form-input ${errors.confirmPassword ? 'admin-form-input--error' : ''}`}
                  value={formData.confirmPassword}
                  onChange={(e) => {
                    setFormData({ ...formData, confirmPassword: e.target.value });
                    setErrors({ ...errors, confirmPassword: '' });
                  }}
                  placeholder="Re-enter password"
                />
                {errors.confirmPassword && <span className="admin-form-error">{errors.confirmPassword}</span>}
              </div>
            </div>

            <div className="admin-form-row">
              <div className="admin-form-group">
                <label className="admin-form-label" htmlFor="roleId">
                  Role <span className="admin-form-required">*</span>
                </label>
                <select
                  id="roleId"
                  className="admin-form-select"
                  value={formData.roleId}
                  onChange={(e) => setFormData({ ...formData, roleId: parseInt(e.target.value) })}
                >
                  <option value={1}>Admin</option>
                  <option value={2}>Listener</option>
                  <option value={3}>Label</option>
                </select>
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
          </div>

          <div className="admin-modal-footer">
            <button
              type="button"
              className="admin-modal-btn admin-modal-btn--secondary"
              onClick={onClose}
              disabled={createUserMutation.isPending}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="admin-modal-btn admin-modal-btn--primary"
              disabled={createUserMutation.isPending}
            >
              {createUserMutation.isPending ? 'Creating...' : 'Create User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUserModal;
