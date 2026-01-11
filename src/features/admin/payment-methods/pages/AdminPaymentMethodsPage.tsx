import React, { useState } from 'react';
import {
  usePaymentMethods,
  usePaymentMethodStats,
  useCreatePaymentMethod,
  useUpdatePaymentMethod,
  useDeletePaymentMethod,
  PaymentMethod,
  CreatePaymentMethodRequest,
} from '@/core/services/payment-method.service';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import {
  CreditCard,
  Building2,
  Smartphone,
  QrCode,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
} from 'lucide-react';
import '@/styles/loading.css';

export const AdminPaymentMethodsPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const { data: methodsData, isLoading } = usePaymentMethods({ page, limit: 20 });
  const { data: stats } = usePaymentMethodStats();
  const createMethod = useCreatePaymentMethod();
  const updateMethod = useUpdatePaymentMethod();
  const deleteMethod = useDeletePaymentMethod();

  const [formData, setFormData] = useState<CreatePaymentMethodRequest>({
    methodName: '',
    methodType: 'BankTransfer',
    description: '',
    isActive: true,
  });

  const resetForm = () => {
    setFormData({
      methodName: '',
      methodType: 'BankTransfer',
      description: '',
      isActive: true,
    });
  };

  const handleCreate = async () => {
    try {
      await createMethod.mutateAsync(formData);
      setIsCreateOpen(false);
      resetForm();
    } catch (error) {
      console.error('Create failed:', error);
    }
  };

  const handleUpdate = async () => {
    if (!editingMethod) return;
    try {
      await updateMethod.mutateAsync({
        id: editingMethod.id,
        data: {
          methodName: formData.methodName,
          description: formData.description,
        },
      });
      // Update status separately if needed
      if (editingMethod.isActive !== formData.isActive) {
        await updateMethod.mutateAsync({
          id: editingMethod.id,
          data: {
            methodName: formData.methodName,
            description: formData.description,
          },
        });
      }
      setEditingMethod(null);
      resetForm();
    } catch (error) {
      console.error('Update failed:', error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteMethod.mutateAsync(id);
      setDeletingId(null);
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  const openEditDialog = (method: PaymentMethod) => {
    setEditingMethod(method);
    setFormData({
      methodName: method.methodName,
      methodType: method.methodType,
      description: method.description || '',
      isActive: method.isActive,
    });
  };

  const getMethodIcon = (type: PaymentMethod['methodType']) => {
    switch (type) {
      case 'BankTransfer':
        return Building2;
      case 'CreditCard':
      case 'DebitCard':
        return CreditCard;
      case 'EWallet':
        return Smartphone;
      case 'QRCode':
        return QrCode;
      default:
        return CreditCard;
    }
  };

  const getMethodTypeLabel = (type: PaymentMethod['methodType']) => {
    const labels = {
      BankTransfer: 'Chuyển khoản',
      CreditCard: 'Thẻ tín dụng',
      DebitCard: 'Thẻ ghi nợ',
      EWallet: 'Ví điện tử',
      QRCode: 'QR Code',
      Other: 'Khác',
    };
    return labels[type];
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quản lý Phương thức Thanh toán</h1>
          <p className="text-muted-foreground">Quản lý các phương thức thanh toán cho người dùng</p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Thêm phương thức
        </Button>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-lg">
                <CreditCard className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tổng phương thức</p>
                <p className="text-2xl font-bold">{stats.totalMethods}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-500/10 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Đang hoạt động</p>
                <p className="text-2xl font-bold">{stats.activeMethods}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <Building2 className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Loại phương thức</p>
                <p className="text-2xl font-bold">{stats.methodsByType.length}</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Payment Methods Grid */}
      <Card>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="loading-spinner"></div>
          </div>
        ) : methodsData && methodsData.data.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
              {methodsData.data.map((method) => {
                const Icon = getMethodIcon(method.methodType);
                return (
                  <Card key={method.id} className="p-4 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{method.methodName}</h3>
                          <p className="text-sm text-muted-foreground">
                            {getMethodTypeLabel(method.methodType)}
                          </p>
                        </div>
                      </div>
                      <Badge variant={method.isActive ? 'default' : 'secondary'}>
                        {method.isActive ? 'Hoạt động' : 'Tắt'}
                      </Badge>
                    </div>

                    {method.description && (
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {method.description}
                      </p>
                    )}

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => openEditDialog(method)}
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Sửa
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => setDeletingId(method.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>

            {/* Pagination */}
            {methodsData.totalPages > 1 && (
              <div className="p-4 border-t flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Trang {page} / {methodsData.totalPages} - Tổng {methodsData.total} phương thức
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
                    disabled={page === methodsData.totalPages}
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
            <CreditCard className="h-12 w-12 text-muted-foreground mb-2" />
            <p className="text-lg font-medium">Chưa có phương thức thanh toán</p>
            <p className="text-sm text-muted-foreground mb-4">
              Thêm phương thức thanh toán đầu tiên cho hệ thống
            </p>
            <Button onClick={() => setIsCreateOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Thêm phương thức
            </Button>
          </div>
        )}
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={isCreateOpen || editingMethod !== null} onOpenChange={(open) => {
        if (!open) {
          setIsCreateOpen(false);
          setEditingMethod(null);
          resetForm();
        }
      }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingMethod ? 'Cập nhật phương thức' : 'Thêm phương thức thanh toán'}
            </DialogTitle>
            <DialogDescription>
              {editingMethod
                ? 'Cập nhật thông tin phương thức thanh toán'
                : 'Thêm phương thức thanh toán mới cho hệ thống'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="methodName">Tên phương thức *</Label>
              <Input
                id="methodName"
                value={formData.methodName}
                onChange={(e) => setFormData({ ...formData, methodName: e.target.value })}
                placeholder="VD: Chuyển khoản Vietcombank"
              />
            </div>

            <div>
              <Label htmlFor="methodType">Loại phương thức *</Label>
              <Select
                value={formData.methodType}
                onValueChange={(value) =>
                  setFormData({ ...formData, methodType: value as PaymentMethod['methodType'] })
                }
                disabled={!!editingMethod}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BankTransfer">Chuyển khoản</SelectItem>
                  <SelectItem value="CreditCard">Thẻ tín dụng</SelectItem>
                  <SelectItem value="DebitCard">Thẻ ghi nợ</SelectItem>
                  <SelectItem value="EWallet">Ví điện tử</SelectItem>
                  <SelectItem value="QRCode">QR Code</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="description">Mô tả</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Mô tả về phương thức thanh toán"
                rows={3}
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="isActive" className="font-normal cursor-pointer">
                Kích hoạt phương thức này
              </Label>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateOpen(false);
                setEditingMethod(null);
                resetForm();
              }}
            >
              Hủy
            </Button>
            <Button
              onClick={editingMethod ? handleUpdate : handleCreate}
              disabled={
                !formData.methodName ||
                createMethod.isPending ||
                updateMethod.isPending
              }
            >
              {editingMethod ? 'Cập nhật' : 'Thêm mới'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={deletingId !== null} onOpenChange={() => setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa phương thức thanh toán này? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingId && handleDelete(deletingId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminPaymentMethodsPage;
