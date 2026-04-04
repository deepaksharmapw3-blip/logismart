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
          bgColor: 'glass-card bg-gradient-to-r from-red-500/5 to-rose-500/5',
          borderColor: 'border-red-500/20',
          iconColor: 'text-red-600 dark:text-red-400',
          iconBg: 'bg-gradient-to-br from-red-500/20 to-rose-500/20 border border-red-500/20',
          glow: 'shadow-[0_0_20px_rgba(239,68,68,0.15)]',
        };
      case 'route-change':
        return {
          icon: Info,
          bgColor: 'glass-card bg-gradient-to-r from-indigo-500/5 to-violet-500/5',
          borderColor: 'border-indigo-500/20',
          iconColor: 'text-indigo-600 dark:text-indigo-400',
          iconBg: 'bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-indigo-500/20',
          glow: 'shadow-[0_0_20px_rgba(99,102,241,0.15)]',
        };
      case 'success':
        return {
          icon: CheckCircle2,
          bgColor: 'glass-card bg-gradient-to-r from-emerald-500/5 to-teal-500/5',
          borderColor: 'border-emerald-500/20',
          iconColor: 'text-emerald-600 dark:text-emerald-400',
          iconBg: 'bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/20',
          glow: 'shadow-[0_0_20px_rgba(16,185,129,0.15)]',
        };
      case 'info':
        return {
          icon: Info,
          bgColor: 'glass-card',
          borderColor: 'border-border/50',
          iconColor: 'text-muted-foreground',
          iconBg: 'bg-muted border border-border/50',
          glow: 'shadow-glow',
        };
    }
  };

  const getPriorityDot = (priority: Alert['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-gradient-to-b from-red-500 to-rose-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]';
      case 'medium':
        return 'bg-gradient-to-b from-amber-500 to-orange-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]';
      case 'low':
        return 'bg-gradient-to-b from-indigo-500 to-violet-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]';
    }
  };

  return (
    <div className="fixed top-24 right-6 z-50 space-y-3 max-w-md">
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
              className={`${config.bgColor} ${config.borderColor} ${config.glow} border rounded-2xl p-5 relative overflow-hidden`}
            >
              {/* Priority Indicator Bar */}
              <div className={`absolute left-0 top-0 bottom-0 w-1 ${getPriorityDot(alert.priority)}`}></div>

              <div className="flex items-start gap-4 pl-2">
                {/* Icon */}
                <div className={`${config.iconBg} rounded-xl p-2.5 flex-shrink-0`}>
                  <Icon className={`w-5 h-5 ${config.iconColor}`} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <h4 className="font-semibold text-sm text-foreground">{alert.title}</h4>
                    <motion.button
                      onClick={() => onDismiss(alert.id)}
                      className="flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors p-1 rounded-lg hover:bg-muted/50"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <X className="w-4 h-4" />
                    </motion.button>
                  </div>

                  <p className="text-sm text-muted-foreground mb-3">
                    {alert.message}
                  </p>

                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5 glass px-2 py-1 rounded-lg">
                      <div className="w-1.5 h-1.5 rounded-full bg-foreground/30"></div>
                      <span className="font-medium">#{alert.shipmentId}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3 h-3" />
                      <span>{alert.timestamp}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Auto-dismiss progress bar */}
              <motion.div
                className={`absolute bottom-0 left-0 right-0 h-1 ${config.iconColor.replace('text-', 'bg-').replace('dark:', '')} opacity-50 origin-left rounded-full`}
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
