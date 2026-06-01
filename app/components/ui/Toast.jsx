import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { TOAST } from '../../lib/constants';

const typeStyles = {
  [TOAST.TYPES.SUCCESS]: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-800',
    icon: 'text-green-500',
    Icon: CheckCircle,
  },
  [TOAST.TYPES.ERROR]: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-800',
    icon: 'text-red-500',
    Icon: AlertCircle,
  },
  [TOAST.TYPES.WARNING]: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    text: 'text-yellow-800',
    icon: 'text-yellow-500',
    Icon: AlertTriangle,
  },
  [TOAST.TYPES.INFO]: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-800',
    icon: 'text-blue-500',
    Icon: Info,
  },
};

export default function Toast({ toasts, removeToast }) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2 pointer-events-none">
      {toasts.map(toast => {
        const style = typeStyles[toast.type] || typeStyles[TOAST.TYPES.INFO];
        const IconComponent = style.Icon;

        return (
          <div
            key={toast.id}
            className={`${style.bg} ${style.border} border rounded-lg px-4 py-3 flex items-start gap-3 shadow-lg max-w-sm pointer-events-auto animate-in fade-in slide-in-from-bottom-4 duration-300`}
          >
            <IconComponent size={20} className={style.icon} />
            <p className={`text-sm font-medium ${style.text} flex-1`}>{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className={`${style.text} hover:opacity-70 transition flex-shrink-0 mt-0.5`}
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
