import React, { useState, useEffect } from 'react';
import { Icons } from '../constants';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: () => void;
  amount: number;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, onPaymentSuccess, amount }) => {
  const [isChecking, setIsChecking] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes countdown

  useEffect(() => {
    if (!isOpen) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleMockPaymentCheck = () => {
    setIsChecking(true);
    // 模拟网络请求检查支付状态
    setTimeout(() => {
      setIsChecking(false);
      // 这里模拟“支付成功”，在真实环境中，这里应该根据后端API返回的状态判断
      // 假设用户点击“我已支付”后，系统确认收到了款项
      const isPaid = true; 
      
      if (isPaid) {
        onPaymentSuccess();
      } else {
        alert("尚未查询到支付信息，请稍后再试。");
      }
    }, 1500);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#fcfcf7] w-full max-w-sm rounded-xl overflow-hidden shadow-2xl border-4 border-purple-900 relative">
        
        {/* Header */}
        <div className="bg-purple-900 p-4 text-center relative">
          <h3 className="text-xl font-bold text-white brush-font tracking-widest">润金支付</h3>
          <button 
            onClick={onClose}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-purple-200 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col items-center space-y-6">
          
          <div className="text-center space-y-1">
            <p className="text-purple-900 font-bold text-lg">天机神算 · 卦金</p>
            <div className="flex items-baseline justify-center text-red-700 font-mono font-bold">
              <span className="text-2xl">¥</span>
              <span className="text-5xl">{amount.toFixed(2)}</span>
            </div>
            <p className="text-xs text-gray-500">支付完成后自动解卦</p>
          </div>

          {/* QR Code Container */}
          <div className="relative group w-48 h-48 bg-white p-2 border-2 border-dashed border-purple-300 rounded-lg flex items-center justify-center">
            {/* Replace this src with your real payment QR code API or static image */}
            <img 
              src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=simulate_wechat_pay_url" 
              alt="Payment QR Code" 
              className="w-full h-full opacity-90"
            />
            
            {/* Center Logo Overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="bg-white p-1 rounded-md shadow-md">
                 <span className="text-xl">🧧</span>
              </div>
            </div>
          </div>

          <div className="w-full space-y-3">
             <div className="flex justify-between text-xs text-gray-500 px-4">
               <span>订单失效时间</span>
               <span className="font-mono text-red-600">{formatTime(timeLeft)}</span>
             </div>

             <button
              onClick={handleMockPaymentCheck}
              disabled={isChecking}
              className={`w-full py-3 rounded-lg text-lg font-bold shadow-lg transition-all transform active:scale-95 ${
                isChecking 
                  ? 'bg-gray-400 text-white cursor-wait' 
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
             >
               {isChecking ? '查询支付状态...' : '我已支付，立即解卦'}
             </button>
             
             <p className="text-xs text-center text-gray-400">
               支持 微信支付 / 支付宝
             </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PaymentModal;