import React, { useState, useEffect } from 'react';
import { X, Copy, Check, ExternalLink, Loader2, CheckCircle2, AlertCircle, CreditCard } from 'lucide-react';
import { toast } from 'sonner';
import { useTransaction } from '@/core/services/transaction.service';

interface TransactionData {
  qrCodeUrl?: string;
  accountNumber?: string;
  accountName?: string;
  amount: number;
  content: string;
  bankName?: string;
  transactionId: number;
  txnRef: string;
}

interface QRCodeModalProps {
  transaction: TransactionData | null;
  isOpen: boolean;
  onClose: () => void;
  onRetry?: () => void; // Retry with same payment method
  onChangeMethod?: () => void; // Go back to select different payment method
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({ 
  transaction, 
  isOpen, 
  onClose, 
  onRetry,
  onChangeMethod 
}) => {
  const [copied, setCopied] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(600);
  const [isChecking, setIsChecking] = useState(false);
  const [showRetryOptions, setShowRetryOptions] = useState(false);
  
  const { data: transactionStatus, refetch } = useTransaction(transaction?.transactionId || 0);

  useEffect(() => {
    if (!isOpen || !transaction) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          toast.error('Payment session expired');
          onClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, transaction, onClose]);

  useEffect(() => {
    if (!isOpen || !transaction) return;

    const statusChecker = setInterval(() => {
      refetch();
    }, 5000);

    return () => clearInterval(statusChecker);
  }, [isOpen, transaction, refetch]);

  useEffect(() => {
    if (transactionStatus?.transactionStatus === 'Completed') {
      toast.success('Payment completed successfully! Your subscription is now active.');
      setTimeout(() => {
        onClose();
      }, 2000);
    }
  }, [transactionStatus, onClose]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCopy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(label);
      toast.success(`${label} copied to clipboard`);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      toast.error('Failed to copy');
    }
  };

  const handleConfirmPayment = async () => {
    setIsChecking(true);
    
    try {
      const { data } = await refetch();

      console.log("data", data)
      
      if (data?.transactionStatus === 'Completed') {
        toast.success('Payment verified! Your subscription is now active.');
        setTimeout(() => {
          onClose();
        }, 1500);
      } else if (data?.transactionStatus === 'Pending') {
        toast.warning('Payment is still pending. Please complete the payment and try again.', {
          duration: 4000,
        });
        setShowRetryOptions(true);
        setIsChecking(false);
      } else if (data?.transactionStatus === 'Failed') {
        toast.error('Payment failed. Please try a different payment method.', {
          duration: 4000,
        });
        setShowRetryOptions(true);
        setIsChecking(false);
      } else {
        toast.info('Payment status is being verified. You can close this and we\'ll notify you once confirmed.');
        setTimeout(() => {
          onClose();
        }, 2000);
      }
    } catch (error) {
      console.error('Error checking payment status:', error);
      toast.error('Unable to verify payment status. Please try again.');
      setShowRetryOptions(true);
      setIsChecking(false);
    }
  };

  const handleRetry = () => {
    setShowRetryOptions(false);
    if (onRetry) {
      onRetry();
    } else {
      toast.info('Generating new payment QR code...');
      onClose();
    }
  };

  const handleChangeMethod = () => {
    setShowRetryOptions(false);
    if (onChangeMethod) {
      onChangeMethod();
    } else {
      onClose();
    }
  };

  if (!isOpen || !transaction) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200 p-4">
      <div className="relative max-w-lg w-full bg-gradient-to-br from-vio-900 via-purple-900 to-pink-900 rounded-2xl shadow-2xl border border-white/10 animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">Scan to Pay</h2>
              <p className="text-white/60 text-sm mt-1">Complete your payment within {formatTime(timeLeft)}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* QR Code */}
          {transaction.qrCodeUrl && (
            <div className="bg-white rounded-xl p-6 flex flex-col items-center">
              <img 
                src={transaction.qrCodeUrl} 
                alt="QR Code" 
                className="w-64 h-64 object-contain"
              />
              <p className="text-gray-600 text-sm mt-4 text-center">
                Scan this QR code with your banking app
              </p>
            </div>
          )}

          {/* Payment Details */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 space-y-3">
            <h3 className="text-lg font-semibold text-white mb-3">Payment Details</h3>
            
            {/* Transaction ID */}
            <div className="flex items-center justify-between py-2 border-b border-white/10">
              <span className="text-white/60 text-sm">Transaction ID</span>
              <div className="flex items-center gap-2">
                <span className="text-white font-mono text-sm">#{transaction.transactionId}</span>
                <button
                  onClick={() => handleCopy(transaction.transactionId.toString(), 'Transaction ID')}
                  className="p-1.5 hover:bg-white/10 rounded transition-colors"
                >
                  {copied === 'Transaction ID' ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4 text-white/60" />
                  )}
                </button>
              </div>
            </div>

            {/* Amount */}
            <div className="flex items-center justify-between py-2 border-b border-white/10">
              <span className="text-white/60 text-sm">Amount</span>
              <span className="text-white font-semibold text-lg">{transaction.amount.toLocaleString('vi-VN')} VND</span>
            </div>

            {/* Bank Name */}
            {transaction.bankName && (
              <div className="flex items-center justify-between py-2 border-b border-white/10">
                <span className="text-white/60 text-sm">Bank</span>
                <span className="text-white font-medium">{transaction.bankName}</span>
              </div>
            )}

            {/* Account Number */}
            {transaction.accountNumber && (
              <div className="flex items-center justify-between py-2 border-b border-white/10">
                <span className="text-white/60 text-sm">Account Number</span>
                <div className="flex items-center gap-2">
                  <span className="text-white font-mono">{transaction.accountNumber}</span>
                  <button
                    onClick={() => handleCopy(transaction.accountNumber!, 'Account Number')}
                    className="p-1.5 hover:bg-white/10 rounded transition-colors"
                  >
                    {copied === 'Account Number' ? (
                      <Check className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4 text-white/60" />
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Account Name */}
            {transaction.accountName && (
              <div className="flex items-center justify-between py-2 border-b border-white/10">
                <span className="text-white/60 text-sm">Account Name</span>
                <span className="text-white font-medium">{transaction.accountName}</span>
              </div>
            )}

            {/* Transfer Content */}
            <div className="flex items-start justify-between py-2">
              <span className="text-white/60 text-sm">Transfer Content</span>
              <div className="flex items-start gap-2 max-w-[60%]">
                <span className="text-white font-mono text-sm text-right break-all">{transaction.content}</span>
                <button
                  onClick={() => handleCopy(transaction.content, 'Transfer Content')}
                  className="p-1.5 hover:bg-white/10 rounded transition-colors flex-shrink-0"
                >
                  {copied === 'Transfer Content' ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4 text-white/60" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
            <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
              <ExternalLink className="w-4 h-4" />
              Payment Instructions
            </h4>
            <ol className="text-white/70 text-sm space-y-1.5 ml-6 list-decimal">
              <li>Open your banking app and scan the QR code above</li>
              <li>Or manually transfer to the account number with the exact transfer content</li>
              <li>Complete the payment within the time limit</li>
              <li>Your subscription will be activated automatically after successful payment</li>
            </ol>
          </div>

          {/* Warning */}
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
            <p className="text-yellow-200 text-sm">
              ⚠️ <strong>Important:</strong> Please copy the transfer content exactly as shown above to ensure your payment is processed correctly.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/10 space-y-3">
          {/* Payment Status Indicator */}
          {transactionStatus && (
            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              transactionStatus.transactionStatus === 'Completed' 
                ? 'bg-green-500/10 border border-green-500/20' 
                : transactionStatus.transactionStatus === 'Pending'
                ? 'bg-yellow-500/10 border border-yellow-500/20'
                : 'bg-red-500/10 border border-red-500/20'
            }`}>
              {transactionStatus.transactionStatus === 'Completed' ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                  <span className="text-green-200 text-sm font-medium">Payment Completed</span>
                </>
              ) : transactionStatus.transactionStatus === 'Pending' ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin text-yellow-400" />
                  <span className="text-yellow-200 text-sm font-medium">Waiting for payment...</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-5 h-5 text-red-400" />
                  <span className="text-red-200 text-sm font-medium">Payment {transactionStatus.transactionStatus}</span>
                </>
              )}
            </div>
          )}

          {/* Retry Options (shown when payment not completed) */}
          {showRetryOptions && (
            <div className="flex gap-2">
              <button
                onClick={handleRetry}
                className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
              >
                <Loader2 className="w-4 h-4" />
                Try Again
              </button>
              <button
                onClick={handleChangeMethod}
                className="flex-1 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
              >
                <CreditCard className="w-4 h-4" />
                Change Method
              </button>
            </div>
          )}

          {/* Main Action Button */}
          {!showRetryOptions && (
            <button
              onClick={handleConfirmPayment}
              disabled={isChecking || transactionStatus?.transactionStatus === 'Completed'}
              className="w-full px-6 py-3 bg-white hover:bg-white/90 text-vio-900 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isChecking ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Verifying Payment...
                </>
              ) : transactionStatus?.transactionStatus === 'Completed' ? (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  Payment Confirmed
                </>
              ) : (
                'I\'ve Completed the Payment'
              )}
            </button>
          )}

          <p className="text-white/50 text-xs text-center">
            {transactionStatus?.transactionStatus === 'Completed' 
              ? 'Your subscription is now active!'
              : showRetryOptions
              ? 'Choose an option to continue'
              : 'We\'ll automatically verify your payment every 5 seconds'
            }
          </p>
        </div>
      </div>
    </div>
  );
};
