import React from 'react';
import { Smartphone, Monitor, Tablet, Chrome, Trash2 } from 'lucide-react';
import {
  useDevices,
  useDeviceStats,
  useRevokeDevice,
  useRevokeAllDevices,
  Device,
} from '@/core/services/device.service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { cn } from '@/lib/utils';

export const DeviceManagement: React.FC = () => {
  const { data: devicesData, isLoading } = useDevices();
  const { data: stats } = useDeviceStats();
  const revokeDevice = useRevokeDevice();
  const revokeAllDevices = useRevokeAllDevices();

  const devices = devicesData?.data || [];

  const getDeviceIcon = (deviceType: Device['deviceType']) => {
    switch (deviceType) {
      case 'Mobile':
        return <Smartphone className="h-8 w-8" />;
      case 'Desktop':
        return <Monitor className="h-8 w-8" />;
      case 'Tablet':
        return <Tablet className="h-8 w-8" />;
      case 'Web':
      default:
        return <Chrome className="h-8 w-8" />;
    }
  };

  const handleRevokeDevice = async (id: number, deviceName: string) => {
    try {
      await revokeDevice.mutateAsync(id);
      toast.success(`Đã thu hồi thiết bị "${deviceName}"`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  const handleRevokeAllDevices = async () => {
    try {
      await revokeAllDevices.mutateAsync();
      toast.success('Đã thu hồi tất cả thiết bị khác');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
    }
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Quản lý thiết bị</h2>
          <p className="text-muted-foreground">
            Xem và quản lý các thiết bị đã đăng nhập vào tài khoản của bạn
          </p>
        </div>

        {devices.length > 1 && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="text-destructive">
                Thu hồi tất cả
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Thu hồi tất cả thiết bị?</AlertDialogTitle>
                <AlertDialogDescription>
                  Hành động này sẽ đăng xuất tất cả các thiết bị khác ngoại trừ thiết bị hiện tại.
                  Bạn sẽ cần đăng nhập lại trên các thiết bị đó.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Hủy</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleRevokeAllDevices}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Thu hồi tất cả
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      {/* Device Statistics */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Tổng thiết bị
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalDevices}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Đang hoạt động
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.activeDevices}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Loại thiết bị
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {Object.entries(stats.devicesByType).map(([type, count]) => (
                  <Badge key={type} variant="secondary">
                    {type}: {count}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Device List */}
      <div className="space-y-4">
        {devices.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Monitor className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Không có thiết bị nào</p>
            </CardContent>
          </Card>
        ) : (
          devices.map((device) => (
            <Card
              key={device.id}
              className={cn(
                'transition-all',
                device.isActive && 'border-primary'
              )}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="text-muted-foreground">
                    {getDeviceIcon(device.deviceType)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-lg">{device.deviceName}</h3>
                      {device.isActive && (
                        <Badge variant="default" className="bg-green-600">
                          Hoạt động
                        </Badge>
                      )}
                    </div>

                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p>
                        {device.os && `${device.os} • `}
                        {device.browser && device.browser}
                      </p>
                      <p>
                        Loại: {device.deviceType}
                        {device.ipAddress && ` • IP: ${device.ipAddress}`}
                      </p>
                      <p>
                        Hoạt động lần cuối:{' '}
                        {formatDistanceToNow(new Date(device.lastActive), {
                          addSuffix: true,
                          locale: vi,
                        })}
                      </p>
                      <p className="text-xs">
                        Đăng nhập:{' '}
                        {formatDistanceToNow(new Date(device.createdAt), {
                          addSuffix: true,
                          locale: vi,
                        })}
                      </p>
                    </div>
                  </div>

                  <div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Thu hồi thiết bị?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Bạn sẽ bị đăng xuất khỏi thiết bị "{device.deviceName}".
                            Bạn có thể đăng nhập lại bất cứ lúc nào.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Hủy</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleRevokeDevice(device.id, device.deviceName)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Thu hồi
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
