import React, { useState } from 'react';
import { Building2, User, Mail, Globe, FileText, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';
import { Label } from '@/shared/components/ui/label';
import { useCreateLabel, useUpdateLabel } from '@/core/services/label.service';
import { RecordLabel, CreateLabelRequest, UpdateLabelRequest } from '@/types/label.types';
import { toast } from 'sonner';
import '@/styles/label-form.css';

interface LabelFormProps {
  label?: RecordLabel;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const LabelForm: React.FC<LabelFormProps> = ({ label, onSuccess, onCancel }) => {
  const isEditing = !!label;

  const [formData, setFormData] = useState<CreateLabelRequest>({
    labelName: label?.labelName || '',
    labelType: label?.labelType || 'INDIVIDUAL',
    imageUrl: label?.imageUrl || null,
    description: label?.description || '',
    website: label?.website || '',
    contactEmail: label?.contactEmail || '',
    hasPublicProfile: label?.hasPublicProfile || false,
  });

  const createMutation = useCreateLabel();
  const updateMutation = useUpdateLabel();

  const handleInputChange = (field: keyof CreateLabelRequest, value: string | boolean | null) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.labelName) {
      toast.error('Please enter label name');
      return;
    }

    try {
      if (isEditing && label) {
        const updateData: UpdateLabelRequest = {
          labelName: formData.labelName,
          labelType: formData.labelType,
          imageUrl: formData.imageUrl,
          description: formData.description || undefined,
          website: formData.website || undefined,
          contactEmail: formData.contactEmail || undefined,
          hasPublicProfile: formData.hasPublicProfile,
        };
        await updateMutation.mutateAsync({ labelId: label.id, data: updateData });
        toast.success('Label updated successfully');
      } else {
        await createMutation.mutateAsync(formData);
        toast.success('Label created successfully');
      }
      onSuccess?.();
    } catch (error: unknown) {
      const errorObj = error as { message?: string; response?: { data?: { message?: string } } };
      const errorMsg = errorObj?.message || errorObj?.response?.data?.message || `Failed to ${isEditing ? 'update' : 'create'} label`;
      toast.error(`Failed to ${isEditing ? 'update' : 'create'} label`, { description: errorMsg });
    }
  };

  return (
    <form className="label-form" onSubmit={handleSubmit}>
      <div className="label-form__header">
        <h2 className="label-form__title">
          {isEditing ? 'Edit Record Label' : 'Create Record Label'}
        </h2>
      </div>

      <div className="label-form__fields">
        {/* Label Name */}
        <div className="label-form__field">
          <Label htmlFor="labelName" className="label-form__label">
            Label Name *
          </Label>
          <div className="label-form__input-wrapper">
            <div className="label-form__field-icon">
              <Building2 size={20} />
            </div>
            <Input
              id="labelName"
              type="text"
              placeholder="Enter label name"
              value={formData.labelName}
              onChange={(e) => handleInputChange('labelName', e.target.value)}
              className="label-form__input"
              required
            />
          </div>
        </div>

        {/* Label Type */}
        <div className="label-form__field">
          <Label htmlFor="labelType" className="label-form__label">
            Label Type *
          </Label>
          <div className="label-form__radio-group">
            <label className="label-form__radio">
              <input
                type="radio"
                name="labelType"
                value="INDIVIDUAL"
                checked={formData.labelType === 'INDIVIDUAL'}
                onChange={(e) => handleInputChange('labelType', e.target.value)}
              />
              <span className="label-form__radio-icon">
                <User size={20} />
              </span>
              <div className="label-form__radio-content">
                <span className="label-form__radio-title">Individual Artist</span>
                <span className="label-form__radio-desc">Upload and manage your own music</span>
              </div>
            </label>

            <label className="label-form__radio">
              <input
                type="radio"
                name="labelType"
                value="COMPANY"
                checked={formData.labelType === 'COMPANY'}
                onChange={(e) => handleInputChange('labelType', e.target.value)}
              />
              <span className="label-form__radio-icon">
                <Building2 size={20} />
              </span>
              <div className="label-form__radio-content">
                <span className="label-form__radio-title">Record Label Company</span>
                <span className="label-form__radio-desc">Manage multiple artists</span>
              </div>
            </label>
          </div>
        </div>

        {/* Image URL */}
        <div className="label-form__field">
          <Label htmlFor="imageUrl" className="label-form__label">
            Profile Image URL
          </Label>
          <div className="label-form__input-wrapper">
            <div className="label-form__field-icon">
              <ImageIcon size={20} />
            </div>
            <Input
              id="imageUrl"
              type="url"
              placeholder="https://example.com/image.jpg"
              value={formData.imageUrl || ''}
              onChange={(e) => handleInputChange('imageUrl', e.target.value || null)}
              className="label-form__input"
            />
          </div>
        </div>

        {/* Description */}
        <div className="label-form__field">
          <Label htmlFor="description" className="label-form__label">
            Description
          </Label>
          <div className="label-form__input-wrapper">
            <div className="label-form__field-icon">
              <FileText size={20} />
            </div>
            <Textarea
              id="description"
              placeholder="Tell us about your label..."
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="label-form__textarea"
              rows={4}
            />
          </div>
        </div>

        {/* Website */}
        <div className="label-form__field">
          <Label htmlFor="website" className="label-form__label">
            Website
          </Label>
          <div className="label-form__input-wrapper">
            <div className="label-form__field-icon">
              <Globe size={20} />
            </div>
            <Input
              id="website"
              type="url"
              placeholder="https://your-website.com"
              value={formData.website}
              onChange={(e) => handleInputChange('website', e.target.value)}
              className="label-form__input"
            />
          </div>
        </div>

        {/* Contact Email */}
        <div className="label-form__field">
          <Label htmlFor="contactEmail" className="label-form__label">
            Contact Email
          </Label>
          <div className="label-form__input-wrapper">
            <div className="label-form__field-icon">
              <Mail size={20} />
            </div>
            <Input
              id="contactEmail"
              type="email"
              placeholder="contact@label.com"
              value={formData.contactEmail}
              onChange={(e) => handleInputChange('contactEmail', e.target.value)}
              className="label-form__input"
            />
          </div>
        </div>

        {/* Public Profile */}
        <div className="label-form__field">
          <label className="label-form__checkbox">
            <input
              type="checkbox"
              checked={formData.hasPublicProfile}
              onChange={(e) => handleInputChange('hasPublicProfile', e.target.checked)}
            />
            <span>Make profile public</span>
          </label>
        </div>
      </div>

      <div className="label-form__actions">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button 
          type="submit" 
          disabled={createMutation.isPending || updateMutation.isPending}
        >
          {isEditing ? 'Update Label' : 'Create Label'}
        </Button>
      </div>
    </form>
  );
};

export default LabelForm;
