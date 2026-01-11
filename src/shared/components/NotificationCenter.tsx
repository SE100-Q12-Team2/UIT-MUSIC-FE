import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Bell, Check, Trash2 } from 'lucide-react';
import {
  useNotifications,
  useNotificationStats,
  useMarkAsRead,
  useMarkAllAsRead,
  useDeleteNotification,
  Notification,
} from '@/core/services/notification.service';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

export const NotificationCenter: React.FC = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [page, setPage] = useState(1);

  const { data: notificationsData, isLoading } = useNotifications({ page, limit: 10 });
  const { data: stats } = useNotificationStats();
  const markAsRead = useMarkAsRead();
  const markAllAsRead = useMarkAllAsRead();
  const deleteNotification = useDeleteNotification();

  const unreadCount = stats?.unread || 0;
  const notifications = notificationsData?.data || [];

  const handleMarkAsRead = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    await markAsRead.mutateAsync(id);
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead.mutateAsync();
  };

  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    await deleteNotification.mutateAsync(id);
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      markAsRead.mutate(notification.id);
    }
    if (notification.actionUrl) {
      // Check if it's an external URL
      if (notification.actionUrl.startsWith('http://') || notification.actionUrl.startsWith('https://')) {
        window.open(notification.actionUrl, '_blank', 'noopener,noreferrer');
      } else {
        // Internal navigation
        navigate(notification.actionUrl);
      }
    }
    setIsOpen(false);
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'System':
        return '🔔';
      case 'Song':
        return '🎵';
      case 'Playlist':
        return '📝';
      case 'Album':
        return '💿';
      case 'Follow':
        return '👤';
      case 'Subscription':
        return '⭐';
      case 'Copyright':
        return '⚠️';
      default:
        return '📢';
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[380px] p-0">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold text-lg">Thông báo</h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllAsRead}
              className="text-xs"
            >
              <Check className="h-4 w-4 mr-1" />
              Đánh dấu tất cả đã đọc
            </Button>
          )}
        </div>

        <ScrollArea className="h-[400px]">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Bell className="h-12 w-12 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                Không có thông báo nào
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    'p-4 hover:bg-accent cursor-pointer transition-colors group',
                    !notification.isRead && 'bg-accent/50'
                  )}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start gap-3">
                    <div className="text-2xl flex-shrink-0">
                      {notification.imageUrl ? (
                        <img
                          src={notification.imageUrl}
                          alt=""
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <span>{getNotificationIcon(notification.type)}</span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm line-clamp-1">
                            {notification.title}
                          </p>
                          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {formatDistanceToNow(new Date(notification.createdAt), {
                              addSuffix: true,
                              locale: vi,
                            })}
                          </p>
                        </div>

                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {!notification.isRead && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={(e) => handleMarkAsRead(notification.id, e)}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-destructive"
                            onClick={(e) => handleDelete(notification.id, e)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {!notification.isRead && (
                        <div className="absolute right-4 top-4">
                          <div className="h-2 w-2 rounded-full bg-primary"></div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {notificationsData && notificationsData.totalPages > 1 && (
          <div className="p-4 border-t flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Trước
            </Button>
            <span className="text-sm text-muted-foreground">
              {page} / {notificationsData.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page === notificationsData.totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Sau
            </Button>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
