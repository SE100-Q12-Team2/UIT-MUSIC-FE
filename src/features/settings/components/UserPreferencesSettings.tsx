import React, { useState } from 'react';
import {
  useUserPreference,
  useUpsertUserPreference,
  UserPreference,
} from '@/core/services/user-preference.service';
import { toast } from 'sonner';
import '@/styles/preferences.css';

export const UserPreferencesSettings: React.FC = () => {
  const { data: preferences, isLoading } = useUserPreference();
  const upsertPreference = useUpsertUserPreference();

  const [settings, setSettings] = useState<Partial<UserPreference>>({
    audioQuality: 'Normal',
    autoPlay: true,
    crossfade: false,
    crossfadeDuration: 5,
    gaplessPlayback: true,
    normalizeVolume: false,
    explicitContentFilter: false,
    language: 'vi',
    notificationsEnabled: true,
    emailNotifications: true,
    pushNotifications: true,
  });

  const [hasChanges, setHasChanges] = useState(false);

  React.useEffect(() => {
    if (preferences) {
      setSettings(preferences);
    }
  }, [preferences]);

  const handleSave = async () => {
    try {
      await upsertPreference.mutateAsync(settings);
      toast.success('Đã lưu cài đặt');
      setHasChanges(false);
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  const updateSetting = <K extends keyof UserPreference>(
    key: K,
    value: UserPreference[K]
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleCancel = () => {
    if (preferences) {
      setSettings(preferences);
      setHasChanges(false);
      toast.info('Đã khôi phục cài đặt');
    }
  };

  if (isLoading) {
    return (
      <div className="preferences-content">
        <div className="preferences-loading">
          <div className="loading-spinner"></div>
          <p>Đang tải cài đặt...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="preferences-content">
      <div className="preferences-container">
        
        {/* Audio Settings */}
        <section className="preferences-section">
          <div className="preferences-section__header">
            <div className="preferences-section__icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 5L6 9H2v6h4l5 4V5z" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
              </svg>
            </div>
            <div>
              <h2 className="preferences-section__title">Chất lượng âm thanh</h2>
              <p className="preferences-section__description">
                Cài đặt phát nhạc và chất lượng âm thanh
              </p>
            </div>
          </div>

          <div className="preferences-section__content">
            <div className="preferences-field">
              <label className="preferences-label" htmlFor="audio-quality">Chất lượng phát</label>
              <select
                id="audio-quality"
                className="preferences-select"
                value={settings.audioQuality}
                onChange={(e) => updateSetting('audioQuality', e.target.value as 'Low' | 'Normal' | 'High' | 'Lossless')}
              >
                <option value="Low">Thấp (96 kbps)</option>
                <option value="Normal">Bình thường (160 kbps)</option>
                <option value="High">Cao (320 kbps)</option>
                <option value="Lossless">Lossless (FLAC)</option>
              </select>
              <p className="preferences-field__hint">
                Chất lượng cao hơn sẽ tiêu tốn nhiều dung lượng dữ liệu hơn
              </p>
            </div>

            <div className="preferences-toggle">
              <div className="preferences-toggle__info">
                <label className="preferences-label">Tự động phát</label>
                <p className="preferences-field__hint">
                  Tự động phát bài hát tiếp theo
                </p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.autoPlay}
                  onChange={(e) => updateSetting('autoPlay', e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="preferences-toggle">
              <div className="preferences-toggle__info">
                <label className="preferences-label">Crossfade</label>
                <p className="preferences-field__hint">
                  Chuyển mượt giữa các bài hát
                </p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.crossfade}
                  onChange={(e) => updateSetting('crossfade', e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            {settings.crossfade && (
              <div className="preferences-field preferences-field--indented">
                <label className="preferences-label">
                  Thời gian Crossfade: {settings.crossfadeDuration}s
                </label>
                <input
                  type="range"
                  className="preferences-slider"
                  min="1"
                  max="12"
                  step="1"
                  value={settings.crossfadeDuration || 5}
                  onChange={(e) => updateSetting('crossfadeDuration', parseInt(e.target.value))}
                />
                <div className="preferences-slider__labels">
                  <span>1s</span>
                  <span>12s</span>
                </div>
              </div>
            )}

            <div className="preferences-toggle">
              <div className="preferences-toggle__info">
                <label className="preferences-label">Phát liền mạch (Gapless)</label>
                <p className="preferences-field__hint">
                  Không có khoảng lặng giữa các bài hát
                </p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.gaplessPlayback}
                  onChange={(e) => updateSetting('gaplessPlayback', e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="preferences-toggle">
              <div className="preferences-toggle__info">
                <label className="preferences-label">Chuẩn hóa âm lượng</label>
                <p className="preferences-field__hint">
                  Giữ âm lượng đồng đều giữa các bài hát
                </p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.normalizeVolume}
                  onChange={(e) => updateSetting('normalizeVolume', e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
        </section>

        {/* Content Settings */}
        <section className="preferences-section">
          <div className="preferences-section__header">
            <div className="preferences-section__icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <div>
              <h2 className="preferences-section__title">Nội dung</h2>
              <p className="preferences-section__description">
                Kiểm soát nội dung hiển thị
              </p>
            </div>
          </div>

          <div className="preferences-section__content">
            <div className="preferences-toggle">
              <div className="preferences-toggle__info">
                <label className="preferences-label">Lọc nội dung nhạy cảm</label>
                <p className="preferences-field__hint">
                  Ẩn các bài hát có nội dung nhạy cảm
                </p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.explicitContentFilter}
                  onChange={(e) => updateSetting('explicitContentFilter', e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="preferences-field">
              <label className="preferences-label" htmlFor="language">Ngôn ngữ</label>
              <select
                id="language"
                className="preferences-select"
                value={settings.language}
                onChange={(e) => updateSetting('language', e.target.value)}
              >
                <option value="vi">Tiếng Việt</option>
                <option value="en">English</option>
                <option value="ko">한국어</option>
                <option value="ja">日本語</option>
              </select>
            </div>
          </div>
        </section>

        {/* Notification Settings */}
        <section className="preferences-section">
          <div className="preferences-section__header">
            <div className="preferences-section__icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            </div>
            <div>
              <h2 className="preferences-section__title">Thông báo</h2>
              <p className="preferences-section__description">
                Quản lý cách bạn nhận thông báo
              </p>
            </div>
          </div>

          <div className="preferences-section__content">
            <div className="preferences-toggle">
              <div className="preferences-toggle__info">
                <label className="preferences-label">Bật thông báo</label>
                <p className="preferences-field__hint">
                  Nhận thông báo về hoạt động và cập nhật
                </p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.notificationsEnabled}
                  onChange={(e) => updateSetting('notificationsEnabled', e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            {settings.notificationsEnabled && (
              <>
                <div className="preferences-toggle preferences-toggle--indented">
                  <div className="preferences-toggle__info">
                    <label className="preferences-label">Thông báo Email</label>
                    <p className="preferences-field__hint">
                      Nhận thông báo qua email
                    </p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={settings.emailNotifications}
                      onChange={(e) => updateSetting('emailNotifications', e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="preferences-toggle preferences-toggle--indented">
                  <div className="preferences-toggle__info">
                    <label className="preferences-label">Thông báo đẩy</label>
                    <p className="preferences-field__hint">
                      Nhận thông báo trên trình duyệt
                    </p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={settings.pushNotifications}
                      onChange={(e) => updateSetting('pushNotifications', e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </>
            )}
          </div>
        </section>

        {/* Action Buttons */}
        {hasChanges && (
          <div className="preferences-actions">
            <button
              className="preferences-btn preferences-btn--secondary"
              onClick={handleCancel}
            >
              Hủy thay đổi
            </button>
            <button
              className="preferences-btn preferences-btn--primary"
              onClick={handleSave}
              disabled={upsertPreference.isPending}
            >
              {upsertPreference.isPending ? 'Đang lưu...' : 'Lưu cài đặt'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
