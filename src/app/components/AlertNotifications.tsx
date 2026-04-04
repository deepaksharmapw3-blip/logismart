import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, CheckCircle2, Info, X, Clock } from 'lucide-react';

interface Alert {
  id: string;
  type: 'delay' | 'route-change' | 'success' | 'info';
  title: string;
  message: string;
  shipmentId: string;
  timestamp: string;
  priority: 'low' | 'medium' | 'high';
}

interface AlertNotificationsProps {
  alerts: Alert[];
  onDismiss: (id: string) => void;
}

export function AlertNotifications({ alerts, onDismiss }: AlertNotificationsProps) {
  const getAlertConfig = (type: Alert['type']) => {
    switch (type) {
      case 'delay':
        return {
          icon: AlertTriangle,
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          iconColor: 'text-red-600',
          iconBg: 'bg-red-100',
        };
      case 'route-change':
        return {
          icon: Info,
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          iconColor: 'text-blue-600',
          iconBg: 'bg-blue-100',
        };
      case 'success':
        return {
          icon: CheckCircle2,
          bgColor: 'bg-emerald-50',
          borderColor: 'border-emerald-200',
          iconColor: 'text-emerald-600',
          iconBg: 'bg-emerald-100',
        };
      case 'info':
        return {
          icon: Info,
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          iconColor: 'text-gray-600',
          iconBg: 'bg-gray-100',
        };
    }
  };

  const getPriorityDot = (priority: Alert['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-amber-500';
      case 'low':
        return 'bg-blue-500';
    }
  };

  return (
    <div className="fixed top-20 right-6 z-50 space-y-2 max-w-md">
      <AnimatePresence mode="popLayout">
        {alerts.map((alert, index) => {
          const config = getAlertConfig(alert.type);
          const Icon = config.icon;

          return (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: 400, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 400, scale: 0.9 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
                delay: index * 0.1
              }}
              layout
              className={`${config.bgColor} ${config.borderColor} border rounded-lg shadow-lg p-4 relative overflow-hidden`}
            >
              {/* Priority Indicator Bar */}
              <div className={`absolute left-0 top-0 bottom-0 w-1 ${getPriorityDot(alert.priority)}`}></div>

              <div className="flex items-start gap-3">
                {/* Icon */}
                <div className={`${config.iconBg} rounded-lg p-2 flex-shrink-0`}>
                  <Icon className={`w-5 h-5 ${config.iconColor}`} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className="font-medium text-sm">{alert.title}</h4>
                    <button
                      onClick={() => onDismiss(alert.id)}
                      className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-sm text-muted-foreground mb-2">
                    {alert.message}
                  </p>

                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <div className="w-1 h-1 rounded-full bg-gray-400"></div>
                      <span>#{alert.shipmentId}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{alert.timestamp}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Auto-dismiss progress bar */}
              <motion.div
                className={`absolute bottom-0 left-0 right-0 h-0.5 ${config.iconColor.replace('text-', 'bg-')} origin-left`}
                initial={{ scaleX: 1 }}
                animate={{ scaleX: 0 }}
                transition={{ duration: 5, ease: "linear" }}
                onAnimationComplete={() => onDismiss(alert.id)}
              />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
