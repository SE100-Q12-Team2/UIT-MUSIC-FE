import React, { useState } from 'react';
import {
  useUserPreference,
  useUpsertUserPreference,
  UserPreference,
} from '@/core/services/user-preference.service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';
import { Volume2, Bell, Shield } from 'lucide-react';

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

  React.useEffect(() => {
    if (preferences) {
      setSettings(preferences);
    }
  }, [preferences]);

  const handleSave = async () => {
    try {
      await upsertPreference.mutateAsync(settings);
      toast.success('Đã lưu cài đặt');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  const updateSetting = <K extends keyof UserPreference>(
    key: K,
    value: UserPreference[K]
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Cài đặt</h2>
        <p className="text-muted-foreground">Tùy chỉnh trải nghiệm nghe nhạc của bạn</p>
      </div>

      {/* Audio Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Volume2 className="h-5 w-5" />
            Chất lượng âm thanh
          </CardTitle>
          <CardDescription>
            Cài đặt phát nhạc và chất lượng âm thanh
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="audio-quality">Chất lượng phát</Label>
            <Select
              value={settings.audioQuality}
              onValueChange={(value: any) => updateSetting('audioQuality', value)}
            >
              <SelectTrigger id="audio-quality">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Low">Thấp (96 kbps)</SelectItem>
                <SelectItem value="Normal">Bình thường (160 kbps)</SelectItem>
                <SelectItem value="High">Cao (320 kbps)</SelectItem>
                <SelectItem value="Lossless">Lossless (FLAC)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              Chất lượng cao hơn sẽ tiêu tốn nhiều dung lượng dữ liệu hơn
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Tự động phát</Label>
              <p className="text-sm text-muted-foreground">
                Tự động phát bài hát tiếp theo
              </p>
            </div>
            <Switch
              checked={settings.autoPlay}
              onCheckedChange={(checked) => updateSetting('autoPlay', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Crossfade</Label>
              <p className="text-sm text-muted-foreground">
                Chuyển mượt giữa các bài hát
              </p>
            </div>
            <Switch
              checked={settings.crossfade}
              onCheckedChange={(checked) => updateSetting('crossfade', checked)}
            />
          </div>

          {settings.crossfade && (
            <div className="space-y-2 ml-4">
              <Label>Thời gian Crossfade: {settings.crossfadeDuration}s</Label>
              <Slider
                value={[settings.crossfadeDuration || 5]}
                onValueChange={([value]) => updateSetting('crossfadeDuration', value)}
                min={1}
                max={12}
                step={1}
                className="w-full"
              />
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Phát liền mạch (Gapless)</Label>
              <p className="text-sm text-muted-foreground">
                Không có khoảng lặng giữa các bài hát
              </p>
            </div>
            <Switch
              checked={settings.gaplessPlayback}
              onCheckedChange={(checked) => updateSetting('gaplessPlayback', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Chuẩn hóa âm lượng</Label>
              <p className="text-sm text-muted-foreground">
                Giữ âm lượng đồng đều giữa các bài hát
              </p>
            </div>
            <Switch
              checked={settings.normalizeVolume}
              onCheckedChange={(checked) => updateSetting('normalizeVolume', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Content Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Nội dung
          </CardTitle>
          <CardDescription>
            Kiểm soát nội dung hiển thị
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Lọc nội dung nhạy cảm</Label>
              <p className="text-sm text-muted-foreground">
                Ẩn các bài hát có nội dung nhạy cảm
              </p>
            </div>
            <Switch
              checked={settings.explicitContentFilter}
              onCheckedChange={(checked) => updateSetting('explicitContentFilter', checked)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="language">Ngôn ngữ</Label>
            <Select
              value={settings.language}
              onValueChange={(value) => updateSetting('language', value)}
            >
              <SelectTrigger id="language">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vi">Tiếng Việt</SelectItem>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="ko">한국어</SelectItem>
                <SelectItem value="ja">日本語</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Thông báo
          </CardTitle>
          <CardDescription>
            Quản lý cách bạn nhận thông báo
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Bật thông báo</Label>
              <p className="text-sm text-muted-foreground">
                Nhận thông báo về hoạt động và cập nhật
              </p>
            </div>
            <Switch
              checked={settings.notificationsEnabled}
              onCheckedChange={(checked) => updateSetting('notificationsEnabled', checked)}
            />
          </div>

          {settings.notificationsEnabled && (
            <>
              <div className="flex items-center justify-between ml-4">
                <div className="space-y-0.5">
                  <Label>Thông báo Email</Label>
                  <p className="text-sm text-muted-foreground">
                    Nhận thông báo qua email
                  </p>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => updateSetting('emailNotifications', checked)}
                />
              </div>

              <div className="flex items-center justify-between ml-4">
                <div className="space-y-0.5">
                  <Label>Thông báo đẩy</Label>
                  <p className="text-sm text-muted-foreground">
                    Nhận thông báo trên trình duyệt
                  </p>
                </div>
                <Switch
                  checked={settings.pushNotifications}
                  onCheckedChange={(checked) => updateSetting('pushNotifications', checked)}
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          onClick={() => {
            if (preferences) {
              setSettings(preferences);
              toast.info('Đã khôi phục cài đặt');
            }
          }}
        >
          Hủy thay đổi
        </Button>
        <Button onClick={handleSave} disabled={upsertPreference.isPending}>
          {upsertPreference.isPending ? 'Đang lưu...' : 'Lưu cài đặt'}
        </Button>
      </div>
    </div>
  );
};
