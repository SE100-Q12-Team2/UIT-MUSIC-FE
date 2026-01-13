import React, { useState } from 'react';
import { X, CreditCard, Wallet, QrCode, Loader2 } from 'lucide-react';
import { SubscriptionPlan } from '@/types/subscription.types';
import { useCreateTransaction, SepayPaymentQRResponse } from '@/core/services/transaction.service';
import { usePaymentMethods, PaymentMethod } from '@/core/services/payment-method.service';
import { toast } from 'sonner';
import { QRCodeModal } from './QRCodeModal';

interface PaymentModalProps {
  plan: SubscriptionPlan;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ plan, isOpen, onClose, onSuccess }) => {
  const [selectedMethod, setSelectedMethod] = useState<number | null>(null);
  const [transactionData, setTransactionData] = useState<SepayPaymentQRResponse | null>(null);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const createTransaction = useCreateTransaction();
  const { data: paymentMethodsResponse, isLoading: isLoadingMethods } = usePaymentMethods();
  const paymentMethods = paymentMethodsResponse?.data || [];

  const getMethodIcon = (methodName: string) => {
    if (methodName.toLowerCase().includes('momo')) return <Wallet className="w-6 h-6" />;
    if (methodName.toLowerCase().includes('bank')) return <CreditCard className="w-6 h-6" />;
    if (methodName.toLowerCase().includes('qr') || methodName.toLowerCase().includes('sepay')) return <QrCode className="w-6 h-6" />;
    return <CreditCard className="w-6 h-6" />;
  };

  const handlePayment = async () => {
    if (!selectedMethod) {
      toast.error('Please select a payment method');
      return;
    }

    try {
      const result = await createTransaction.mutateAsync({
        amount: plan.price,
        paymentMethodId: selectedMethod,
        subscriptionId: undefined,
        metadata: {
          planId: plan.id,
          planName: plan.planName,
        }
      });

      if (result.qrCodeUrl) {
        setTransactionData(result);
        setIsQRModalOpen(true);
        toast.info('Please scan the QR code to complete payment');
      } else {
        toast.success('Payment initiated successfully!');
        onSuccess();
      }
    } catch (error: unknown) {
      console.error('Payment error:', error);
      const errorMessage = error instanceof Error && 'response' in error 
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message 
        : 'Payment failed';
      toast.error(errorMessage || 'Payment failed');
    }
  };

  const handleQRModalClose = () => {
    setIsQRModalOpen(false);
    onClose();
    onSuccess();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm animate-in fade-in duration-200 p-4">
      <div className="relative max-w-2xl w-full max-h-[90vh] flex flex-col bg-gradient-to-br from-vio-900 via-purple-900 to-pink-900 rounded-2xl shadow-2xl border border-white/10 animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex-shrink-0">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Complete Payment</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Plan Summary */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-2">{plan.planName}</h3>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold text-white">{plan.price.toLocaleString('vi-VN')}</span>
              <span className="text-white/70">VND</span>
            </div>
            <p className="text-white/60 text-sm mt-1">{plan.durationMonths} month{plan.durationMonths > 1 ? 's' : ''} access</p>
          </div>

          {/* Payment Methods */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Select Payment Method</h3>
            {isLoadingMethods ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-white" />
              </div>
            ) : (
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                {paymentMethods.filter((m: PaymentMethod) => m.isActive).map((method: PaymentMethod) => (
                  <button
                    key={method.id}
                    onClick={() => setSelectedMethod(method.id)}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                      selectedMethod === method.id
                        ? 'border-white bg-white/10'
                        : 'border-white/10 bg-white/5 hover:border-white/30'
                    }`}
                  >
                    <div className={`p-3 rounded-lg ${selectedMethod === method.id ? 'bg-white text-vio-900' : 'bg-white/10 text-white'}`}>
                      {getMethodIcon(method.methodName)}
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-semibold text-white">{method.methodName}</div>
                      <div className="text-sm text-white/60">Secure payment via {method.methodName}</div>
                    </div>
                    {selectedMethod === method.id && (
                      <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center">
                        <div className="w-2.5 h-2.5 rounded-full bg-vio-900" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/10 flex gap-3 flex-shrink-0 bg-gradient-to-br from-vio-900 via-purple-900 to-pink-900">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold transition-all"
            disabled={createTransaction.isPending}
          >
            Cancel
          </button>
          <button
            onClick={handlePayment}
            disabled={!selectedMethod || createTransaction.isPending}
            className="flex-1 px-6 py-3 bg-white hover:bg-white/90 text-vio-900 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {createTransaction.isPending ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing...
              </>
            ) : (
              'Pay Now'
            )}
          </button>
        </div>
      </div>

      {/* QR Code Modal */}
      <QRCodeModal
        transaction={transactionData}
        isOpen={isQRModalOpen}
        onClose={handleQRModalClose}
      />
    </div>
  );
};
