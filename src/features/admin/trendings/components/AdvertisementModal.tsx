import React from 'react';
import { AdvertisementFormData } from '../hooks/useAdvertisementModal';

interface AdvertisementModalProps {
  isOpen: boolean;
  mode: 'create' | 'edit';
  formData: AdvertisementFormData | null;
  isSaving: boolean;
  onClose: () => void;
  onSave: () => void;
  onChange: (data: AdvertisementFormData) => void;
}

export const AdvertisementModal: React.FC<AdvertisementModalProps> = ({
  isOpen,
  mode,
  formData,
  isSaving,
  onClose,
  onSave,
  onChange,
}) => {
  if (!isOpen || !formData) return null;

  const title = mode === 'create' ? 'Create Advertisement' : 'Edit Advertisement';
  const saveButtonText = isSaving 
    ? (mode === 'create' ? 'Creating...' : 'Saving...') 
    : (mode === 'create' ? 'Create Advertisement' : 'Save Changes');

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button className="modal-close" onClick={onClose}>
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
              value={formData.adName}
              onChange={(e) => onChange({ ...formData, adName: e.target.value })}
              placeholder="Enter advertisement name"
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Ad Type *</label>
              <select
                className="form-input"
                value={formData.adType}
                onChange={(e) => onChange({ ...formData, adType: e.target.value as 'Audio' | 'Video' | 'Banner' })}
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
                value={formData.duration}
                onChange={(e) => onChange({ ...formData, duration: parseInt(e.target.value) || 0 })}
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
              value={formData.filePath}
              onChange={(e) => onChange({ ...formData, filePath: e.target.value })}
              placeholder="Enter file path (optional)"
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Start Date *</label>
              <input
                type="date"
                className="form-input"
                value={formData.startDate}
                onChange={(e) => onChange({ ...formData, startDate: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">End Date *</label>
              <input
                type="date"
                className="form-input"
                value={formData.endDate}
                onChange={(e) => onChange({ ...formData, endDate: e.target.value })}
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
                value={formData.ageMin}
                onChange={(e) => onChange({ ...formData, ageMin: parseInt(e.target.value) || 13 })}
                min="13"
                max="100"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Age Range (Max)</label>
              <input
                type="number"
                className="form-input"
                value={formData.ageMax}
                onChange={(e) => onChange({ ...formData, ageMax: parseInt(e.target.value) || 100 })}
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
                value={formData.gender}
                onChange={(e) => onChange({ ...formData, gender: e.target.value as any })}
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
                value={formData.subscriptionType}
                onChange={(e) => onChange({ ...formData, subscriptionType: e.target.value as any })}
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
                checked={formData.isActive}
                onChange={(e) => onChange({ ...formData, isActive: e.target.checked })}
              />
              <span>Active</span>
            </label>
          </div>
        </div>
        <div className="modal-footer">
          <button className="modal-btn modal-btn--cancel" onClick={onClose} disabled={isSaving}>
            Cancel
          </button>
          <button 
            className="modal-btn modal-btn--save" 
            onClick={onSave}
            disabled={isSaving || !formData.adName || !formData.startDate || !formData.endDate}
          >
            {saveButtonText}
          </button>
        </div>
      </div>
    </div>
  );
};
