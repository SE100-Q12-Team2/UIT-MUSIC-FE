import React, { useState } from 'react';
import {
  useTransactions,
  useTransactionStats,
  useRefundTransaction,
  Transaction,
} from '@/core/services/transaction.service';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Search, RefreshCw, DollarSign, CheckCircle, XCircle, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import '@/styles/loading.css';

export const AdminTransactionsPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [refundingId, setRefundingId] = useState<number | null>(null);

  const { data: transactionsData, isLoading, refetch } = useTransactions({
    page,
    limit: 20,
    status: statusFilter === 'all' ? undefined : (statusFilter as Transaction['status']),
  });

  const { data: stats } = useTransactionStats();
  const refundTransaction = useRefundTransaction();

  const handleRefund = async (id: number, reason: string) => {
    try {
      await refundTransaction.mutateAsync({ id, data: { reason } });
      setRefundingId(null);
    } catch (error) {
      console.error('Refund failed:', error);
    }
  };

  const filteredTransactions = transactionsData?.data.filter((transaction) => {
    if (!searchQuery) return true;
    return (
      transaction.id.toString().includes(searchQuery) ||
      transaction.userId.toString().includes(searchQuery)
    );
  });

  const getStatusBadge = (status: Transaction['status']) => {
    const variants = {
      Pending: { variant: 'secondary' as const, icon: Clock, color: 'text-yellow-500' },
      Completed: { variant: 'default' as const, icon: CheckCircle, color: 'text-green-500' },
      Failed: { variant: 'destructive' as const, icon: XCircle, color: 'text-red-500' },
      Refunded: { variant: 'outline' as const, icon: RefreshCw, color: 'text-blue-500' },
    };
    const config = variants[status];
    const Icon = config.icon;
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className={`h-3 w-3 ${config.color}`} />
        {status}
      </Badge>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quản lý Giao dịch</h1>
          <p className="text-muted-foreground">Theo dõi và quản lý tất cả giao dịch thanh toán</p>
        </div>
        <Button variant="outline" onClick={() => refetch()}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Làm mới
        </Button>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-lg">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tổng doanh thu</p>
                <p className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-500/10 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Thành công</p>
                <p className="text-2xl font-bold">{stats.successfulTransactions}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-yellow-500/10 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Đang xử lý</p>
                <p className="text-2xl font-bold">{stats.pendingTransactions}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-500/10 rounded-lg">
                <XCircle className="h-6 w-6 text-red-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Thất bại</p>
                <p className="text-2xl font-bold">{stats.failedTransactions}</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm theo ID, User ID hoặc mô tả..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Lọc theo trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="Pending">Đang xử lý</SelectItem>
              <SelectItem value="Completed">Thành công</SelectItem>
              <SelectItem value="Failed">Thất bại</SelectItem>
              <SelectItem value="Refunded">Đã hoàn tiền</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Transactions Table */}
      <Card>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="loading-spinner"></div>
          </div>
        ) : filteredTransactions && filteredTransactions.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b">
                  <tr className="text-left">
                    <th className="p-4 font-semibold">ID</th>
                    <th className="p-4 font-semibold">User ID</th>
                    <th className="p-4 font-semibold">Số tiền</th>
                    <th className="p-4 font-semibold">Phương thức</th>
                    <th className="p-4 font-semibold">Trạng thái</th>
                    <th className="p-4 font-semibold">Thời gian</th>
                    <th className="p-4 font-semibold">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((transaction) => (
                    <tr key={transaction.id} className="border-b hover:bg-accent/50 transition-colors">
                      <td className="p-4 font-mono text-sm">#{transaction.id}</td>
                      <td className="p-4">
                        <span className="font-mono text-sm">#{transaction.userId}</span>
                      </td>
                      <td className="p-4 font-semibold">{formatCurrency(transaction.amount)}</td>
                      <td className="p-4 max-w-[200px] truncate">
                        {transaction.paymentMethod?.methodName || `Method #${transaction.paymentMethodId}`}
                      </td>
                      <td className="p-4">{getStatusBadge(transaction.status)}</td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {formatDistanceToNow(new Date(transaction.createdAt), {
                          addSuffix: true,
                          locale: vi,
                        })}
                      </td>
                      <td className="p-4">
                        {transaction.status === 'Completed' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setRefundingId(transaction.id)}
                            disabled={refundTransaction.isPending}
                          >
                            <RefreshCw className="h-3 w-3 mr-1" />
                            Hoàn tiền
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {transactionsData && transactionsData.totalPages > 1 && (
              <div className="p-4 border-t flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Trang {page} / {transactionsData.totalPages} - Tổng {transactionsData.total} giao dịch
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page === 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    Trước
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page === transactionsData.totalPages}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Sau
                  </Button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <DollarSign className="h-12 w-12 text-muted-foreground mb-2" />
            <p className="text-lg font-medium">Không tìm thấy giao dịch</p>
            <p className="text-sm text-muted-foreground">Chưa có giao dịch nào phù hợp với bộ lọc</p>
          </div>
        )}
      </Card>

      {/* Refund Dialog */}
      <AlertDialog open={refundingId !== null} onOpenChange={() => setRefundingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận hoàn tiền</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn hoàn tiền cho giao dịch #{refundingId}? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => refundingId && handleRefund(refundingId, 'Admin refund')}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Xác nhận hoàn tiền
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminTransactionsPage;
