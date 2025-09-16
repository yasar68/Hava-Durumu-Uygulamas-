import React, { useEffect } from 'react';
import { X, AlertCircle, CheckCircle } from 'lucide-react';

interface ErrorToastProps {
  message: string | null;
  type?: 'error' | 'success';
  onClose: () => void;
  duration?: number;
}

const ErrorToast: React.FC<ErrorToastProps> = ({ 
  message, 
  type = 'error', 
  onClose, 
  duration = 5000 
}) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [message, duration, onClose]);

  if (!message) return null;

  const bgColor = type === 'error' ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200';
  const textColor = type === 'error' ? 'text-red-800' : 'text-green-800';
  const iconColor = type === 'error' ? 'text-red-500' : 'text-green-500';
  const Icon = type === 'error' ? AlertCircle : CheckCircle;

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      <div className={`flex items-start p-4 rounded-lg border shadow-lg ${bgColor} animate-slide-in`}>
        <Icon className={`flex-shrink-0 mt-0.5 mr-3 ${iconColor}`} size={20} />
        <div className="flex-1">
          <p className={`text-sm font-medium ${textColor}`}>{message}</p>
        </div>
        <button
          onClick={onClose}
          className="ml-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Kapat"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default ErrorToast;