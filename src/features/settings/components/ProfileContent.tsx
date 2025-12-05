import React, { useState, useEffect } from 'react';
import { useAuth } from '@/shared/hooks/useAuth';
import { useUpdateProfile } from '@/core/services/auth.service';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { Label } from '@/components/ui/label';
import { Globe, Languages } from 'lucide-react';
import { toast } from 'sonner';
import '@/styles/profile.css';

interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  language: string;
  bio: string;
}

const countries = [
  'United States',
  'Vietnam',
  'United Kingdom',
  'Canada',
  'Australia',
  'Germany',
  'France',
  'Japan',
  'South Korea',
  'China',
];

const languages = [
  'English',
  'Vietnamese',
  'Spanish',
  'French',
  'German',
  'Japanese',
  'Korean',
  'Chinese',
];

const ProfileContent: React.FC = () => {
  const { user } = useAuth();
  const updateProfileMutation = useUpdateProfile();
  
  // Parse name từ user.fullName hoặc user.name (format: "First Last" hoặc "Full Name")
  const parseName = (fullName: string) => {
    const parts = fullName.trim().split(' ');
    if (parts.length >= 2) {
      return {
        firstName: parts[0],
        lastName: parts.slice(1).join(' '),
      };
    }
    return {
      firstName: parts[0] || '',
      lastName: '',
    };
  };

  const initialName = parseName((user as any)?.fullName || user?.name || '');
  
  const [formData, setFormData] = useState<ProfileFormData>({
    firstName: initialName.firstName,
    lastName: initialName.lastName,
    email: user?.email || '',
    country: 'United States',
    language: 'English',
    bio: '',
  });

  const [hasChanges, setHasChanges] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const maxBioLength = 500;

  // Update form khi user data thay đổi
  useEffect(() => {
    if (user) {
      const fullName = (user as any)?.fullName || user.name || '';
      const nameParts = parseName(fullName);
      setFormData(prev => ({
        ...prev,
        firstName: nameParts.firstName,
        lastName: nameParts.lastName,
        email: user.email || '',
      }));
    }
  }, [user]);

  const handleChange = (field: keyof ProfileFormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleCancel = () => {
    if (user) {
      const fullName = (user as any)?.fullName || user.name || '';
      const nameParts = parseName(fullName);
      setFormData({
        firstName: nameParts.firstName,
        lastName: nameParts.lastName,
        email: user.email || '',
        country: 'United States',
        language: 'English',
        bio: '',
      });
      setHasChanges(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!hasChanges) {
      toast.info('No changes to save');
      return;
    }

    setIsSubmitting(true);

    try {
      const fullName = `${formData.firstName} ${formData.lastName}`.trim();
      
      // Real API call
      await updateProfileMutation.mutateAsync({
        fullName: fullName,
        email: formData.email,
        profileImage: undefined, // Có thể thêm upload image sau
        dateOfBirth: undefined, // Có thể thêm date picker sau
        gender: undefined, // Có thể thêm gender selector sau
      });

      toast.success('Profile updated successfully');
      setHasChanges(false);
    } catch (error: any) {
      console.error('Update profile error:', error);
      const errorMsg = error?.message || error?.response?.data?.message || 'Failed to update profile';
      toast.error('Failed to update profile', { description: errorMsg });
    } finally {
      setIsSubmitting(false);
    }
  };

  const remainingChars = maxBioLength - formData.bio.length;
  const displayName = (user as any)?.fullName || user?.name || 'User';
  const username = user?.email?.split('@')[0] || 'user';
  const avatarUrl = (user as any)?.profileImage || user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=728AAB&color=fff&size=200`;

  return (
    <div className="settings-content profile-content">
      <div className="profile-content__container">
        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-avatar">
            <img src={avatarUrl} alt={displayName} />
          </div>
          <div className="profile-info">
            <h2 className="profile-name">{displayName}</h2>
            <p className="profile-username">@{username}</p>
          </div>
        </div>

        {/* Profile Form */}
        <form className="profile-form" onSubmit={handleSubmit}>
          <div className="profile-form__row">
            <div className="profile-form__field">
              <Label htmlFor="firstName" className="profile-label">
                First Name
              </Label>
              <Input
                id="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleChange('firstName')}
                placeholder="Olivia"
                className="profile-input"
              />
            </div>

            <div className="profile-form__field">
              <Label htmlFor="lastName" className="profile-label">
                Last Name
              </Label>
              <Input
                id="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleChange('lastName')}
                placeholder="Rhye"
                className="profile-input"
              />
            </div>
          </div>

          <div className="profile-form__field profile-form__field--full">
            <Label htmlFor="email" className="profile-label">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={handleChange('email')}
              placeholder="Olivia@Untitledui.Com"
              className="profile-input"
            />
          </div>

          <div className="profile-form__row">
            <div className="profile-form__field">
              <Label htmlFor="country" className="profile-label">
                Country
              </Label>
              <div className="profile-select-wrapper">
                <Globe className="profile-select-icon" size={20} />
                <select
                  id="country"
                  value={formData.country}
                  onChange={handleChange('country')}
                  className="profile-select"
                  title="Select country"
                  aria-label="Select country"
                >
                  {countries.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="profile-form__field">
              <Label htmlFor="language" className="profile-label">
                Language
              </Label>
              <div className="profile-select-wrapper">
                <Languages className="profile-select-icon" size={20} />
                <select
                  id="language"
                  value={formData.language}
                  onChange={handleChange('language')}
                  className="profile-select"
                  title="Select language"
                >
                  {languages.map((lang) => (
                    <option key={lang} value={lang}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="profile-form__field profile-form__field--full">
            <Label htmlFor="bio" className="profile-label">
              Bio
            </Label>
            <textarea
              id="bio"
              value={formData.bio}
              onChange={handleChange('bio')}
              placeholder="We'd love to hear from you. Please fill out this form..."
              className="profile-textarea"
              rows={6}
              maxLength={maxBioLength}
            />
            <div className="profile-char-counter">
              {remainingChars} characters left
            </div>
          </div>

          {/* Form Actions */}
          <div className="profile-form__actions">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting || !hasChanges}
              className="profile-btn profile-btn--cancel"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !hasChanges}
              className="profile-btn profile-btn--save"
            >
              {isSubmitting ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileContent;
