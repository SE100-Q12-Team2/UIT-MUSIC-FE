import { useState, useRef } from 'react';
import { X, Building2, FileText, Globe, Mail, ImagePlus, Loader2 } from 'lucide-react';
import { useUpdateLabel } from '@/core/services/label.service';
import { useUploadAvatar } from '@/core/services/upload.service';
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
    imageUrl: label.imageUrl,
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(label.imageUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateLabelMutation = useUpdateLabel();
  const uploadAvatarMutation = useUploadAvatar();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please select a valid image file (JPG, PNG, GIF, or WebP)');
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    setSelectedImage(file);
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleClose = () => {
    // Reset form data to label props when closing
    setFormData({
      labelName: label.labelName,
      description: label.description,
      website: label.website,
      contactEmail: label.contactEmail,
      hasPublicProfile: label.hasPublicProfile,
      imageUrl: label.imageUrl,
    });
    setSelectedImage(null);
    setPreviewUrl(label.imageUrl);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let imageUrl = formData.imageUrl;

      if (selectedImage) {
        toast.info('Uploading image...');
        imageUrl = await uploadAvatarMutation.mutateAsync(selectedImage);
        console.log('✅ Image uploaded successfully:', imageUrl);
      }

      await updateLabelMutation.mutateAsync({
        labelId: label.id,
        data: {
          ...formData,
          imageUrl,
        },
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
          {/* Image Upload Section */}
          <div className="edit-profile-field">
            <label className="edit-profile-label">Profile Image</label>
            <div className="edit-profile-image-container">
              <div 
                className="edit-profile-image-preview" 
                onClick={handleImageClick}
                style={{ cursor: 'pointer' }}
              >
                {previewUrl ? (
                  <img 
                    src={previewUrl} 
                    alt="Profile preview" 
                    className="edit-profile-image"
                  />
                ) : (
                  <div className="edit-profile-image-placeholder">
                    <ImagePlus size={48} />
                    <span>Click to upload image</span>
                  </div>
                )}
                {uploadAvatarMutation.isPending && (
                  <div className="edit-profile-image-uploading">
                    <Loader2 size={24} className="animate-spin" />
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                onChange={handleImageSelect}
                style={{ display: 'none' }}
              />
              <p className="edit-profile-image-hint">
                Recommended: Square image, max 5MB (JPG, PNG, GIF, WebP)
              </p>
            </div>
          </div>

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
              disabled={updateLabelMutation.isPending || uploadAvatarMutation.isPending}
            >
              {uploadAvatarMutation.isPending ? 'Uploading image...' : updateLabelMutation.isPending ? 'Saving...' : 'Save changes'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};