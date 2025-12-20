import { useState } from 'react';
import { X, Building2, FileText, Globe, Mail } from 'lucide-react';
import { useUpdateLabel } from '@/core/services/label.service';
import type { RecordLabel, UpdateLabelRequest } from '@/types/label.types';
import { toast } from 'sonner';

interface EditProfileDialogProps {
  isOpen: boolean;
  onClose: () => void;
  label: RecordLabel;
}

export const EditProfileDialog = ({ isOpen, onClose, label }: EditProfileDialogProps) => {
  const [formData, setFormData] = useState<UpdateLabelRequest>({
    labelName: label.labelName,
    description: label.description,
    website: label.website,
    contactEmail: label.contactEmail,
    hasPublicProfile: label.hasPublicProfile,
  });

  const updateLabelMutation = useUpdateLabel();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleClose = () => {
    // Reset form data to label props when closing
    setFormData({
      labelName: label.labelName,
      description: label.description,
      website: label.website,
      contactEmail: label.contactEmail,
      hasPublicProfile: label.hasPublicProfile,
    });
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await updateLabelMutation.mutateAsync({
        labelId: label.id,
        data: formData,
      });
      
      toast.success('Profile updated successfully');
      handleClose();
    } catch (error) {
      toast.error('Failed to update profile');
      console.error('Update error:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="edit-profile-overlay" onClick={handleClose} />
      <div className="edit-profile-dialog">
        <div className="edit-profile-header">
          <h2 className="edit-profile-title">Edit Profile</h2>
          <button 
            className="edit-profile-close"
            onClick={handleClose}
            aria-label="Close dialog"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="edit-profile-form">
          <div className="edit-profile-field">
            <label htmlFor="labelName" className="edit-profile-label">
              Label/Artist Name
            </label>
            <div className="edit-profile-input-wrapper">
              <Building2 size={20} className="edit-profile-icon" />
              <input
                type="text"
                id="labelName"
                name="labelName"
                value={formData.labelName}
                onChange={handleChange}
                className="edit-profile-input"
                required
              />
            </div>
          </div>

          <div className="edit-profile-field">
            <label htmlFor="description" className="edit-profile-label">
              Description
            </label>
            <div className="edit-profile-input-wrapper">
              <FileText size={20} className="edit-profile-icon" />
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="edit-profile-textarea"
                rows={4}
                maxLength={228}
                required
              />
            </div>
            <span className="edit-profile-char-count">
              {formData.description?.length} ký tự
            </span>
          </div>

          <div className="edit-profile-field">
            <label htmlFor="website" className="edit-profile-label">
              Website
            </label>
            <div className="edit-profile-input-wrapper">
              <Globe size={20} className="edit-profile-icon" />
              <input
                type="url"
                id="website"
                name="website"
                value={formData.website}
                onChange={handleChange}
                className="edit-profile-input"
                required
              />
            </div>
          </div>

          <div className="edit-profile-field">
            <label htmlFor="contactEmail" className="edit-profile-label">
              Contact Email
            </label>
            <div className="edit-profile-input-wrapper">
              <Mail size={20} className="edit-profile-icon" />
              <input
                type="email"
                id="contactEmail"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleChange}
                className="edit-profile-input"
                required
              />
            </div>
          </div>

          <div className="edit-profile-actions">
            <button
              type="button"
              onClick={handleClose}
              className="edit-profile-cancel"
              disabled={updateLabelMutation.isPending}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="edit-profile-submit"
              disabled={updateLabelMutation.isPending}
            >
              {updateLabelMutation.isPending ? 'Saving...' : 'Save changes'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};