import React, { useState, useEffect } from 'react';
import { useAuth } from '@/shared/hooks/auth/useAuth';
import { useUpdateProfile } from '@/core/services/auth.service';
import { useChangePassword } from '@/core/services/settings.service';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { Label } from '@/components/ui/label';
import { Lock } from 'lucide-react';
import { toast } from 'sonner';
import '@/styles/profile.css';

interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
}

const ProfileContent: React.FC = () => {
  const { user } = useAuth();
  const updateProfileMutation = useUpdateProfile();
  const changePasswordMutation = useChangePassword();
  
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

  const initialName = parseName(user?.fullName || '');
  
  const [formData, setFormData] = useState<ProfileFormData>({
    firstName: initialName.firstName,
    lastName: initialName.lastName,
    email: user?.email || '',
  });

  const [hasChanges, setHasChanges] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Change Password state
  const [passwordData, setPasswordData] = useState({
    password: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Update form khi user data thay đổi
  useEffect(() => {
    if (user) {
      const fullName = user?.fullName || '';
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
      const fullName = user?.fullName || '';
      const nameParts = parseName(fullName);
      setFormData({
        firstName: nameParts.firstName,
        lastName: nameParts.lastName,
        email: user.email || '',
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
    } catch (error: unknown) {
      console.error('Update profile error:', error);
      const errorObj = error as { message?: string; response?: { data?: { message?: string } } };
      const errorMsg = errorObj?.message || errorObj?.response?.data?.message || 'Failed to update profile';
      toast.error('Failed to update profile', { description: errorMsg });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordChange = (field: 'password' | 'newPassword' | 'confirmPassword') => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPasswordData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }

    setIsChangingPassword(true);

    try {
      await changePasswordMutation.mutateAsync({
        password: passwordData.password,
        newPassword: passwordData.newPassword,
        confirmPassword: passwordData.confirmPassword,
      });

      toast.success('Password changed successfully');
      setPasswordData({ password: '', newPassword: '', confirmPassword: '' });
      setShowPasswordSection(false);
    } catch (error: unknown) {
      console.error('Change password error:', error);
      const errorObj = error as { message?: string; response?: { data?: { message?: string } } };
      const errorMsg = errorObj?.message || errorObj?.response?.data?.message || 'Failed to change password';
      toast.error('Failed to change password', { description: errorMsg });
    } finally {
      setIsChangingPassword(false);
    }
  };

  const displayName = user?.fullName || 'User';
  const username = user?.email?.split('@')[0] || 'user';
  const avatarUrl = user?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=728AAB&color=fff&size=200`;

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

        {/* Change Password Section */}
        <div className="profile-password-section" style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#fff', margin: 0 }}>Change Password</h3>
            {!showPasswordSection && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowPasswordSection(true)}
                className="profile-btn"
              >
                Change Password
              </Button>
            )}
          </div>

          {showPasswordSection && (
            <form onSubmit={handlePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="profile-form__field profile-form__field--full">
                <Label htmlFor="currentPassword" className="profile-label">
                  Current Password
                </Label>
                <div style={{ position: 'relative' }}>
                  <Lock className="profile-select-icon" size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#728AAB' }} />
                  <Input
                    id="currentPassword"
                    type="password"
                    value={passwordData.password}
                    onChange={handlePasswordChange('password')}
                    placeholder="Enter current password"
                    className="profile-input"
                    style={{ paddingLeft: '40px' }}
                    required
                  />
                </div>
              </div>

              <div className="profile-form__field profile-form__field--full">
                <Label htmlFor="newPassword" className="profile-label">
                  New Password
                </Label>
                <div style={{ position: 'relative' }}>
                  <Lock className="profile-select-icon" size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#728AAB' }} />
                  <Input
                    id="newPassword"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange('newPassword')}
                    placeholder="Enter new password (min 6 characters)"
                    className="profile-input"
                    style={{ paddingLeft: '40px' }}
                    minLength={6}
                    required
                  />
                </div>
              </div>

              <div className="profile-form__field profile-form__field--full">
                <Label htmlFor="confirmPassword" className="profile-label">
                  Confirm New Password
                </Label>
                <div style={{ position: 'relative' }}>
                  <Lock className="profile-select-icon" size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#728AAB' }} />
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange('confirmPassword')}
                    placeholder="Confirm new password"
                    className="profile-input"
                    style={{ paddingLeft: '40px' }}
                    minLength={6}
                    required
                  />
                </div>
              </div>

              <div className="profile-form__actions">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowPasswordSection(false);
                    setPasswordData({ password: '', newPassword: '', confirmPassword: '' });
                  }}
                  disabled={isChangingPassword}
                  className="profile-btn profile-btn--cancel"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isChangingPassword || !passwordData.password || !passwordData.newPassword || !passwordData.confirmPassword}
                  className="profile-btn profile-btn--save"
                >
                  {isChangingPassword ? 'Changing...' : 'Change Password'}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileContent;
