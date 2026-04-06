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
          bgColor: 'glass-card',
          borderColor: 'border-red-500/15',
          iconColor: 'text-red-600 dark:text-red-400',
          iconBg: 'bg-red-500/10 border border-red-500/15',
        };
      case 'route-change':
        return {
          icon: Info,
          bgColor: 'glass-card',
          borderColor: 'border-primary/15',
          iconColor: 'text-primary',
          iconBg: 'bg-primary/10 border border-primary/15',
        };
      case 'success':
        return {
          icon: CheckCircle2,
          bgColor: 'glass-card',
          borderColor: 'border-teal-500/15',
          iconColor: 'text-teal-600 dark:text-teal-400',
          iconBg: 'bg-teal-500/10 border border-teal-500/15',
        };
      case 'info':
        return {
          icon: Info,
          bgColor: 'glass-card',
          borderColor: 'border-border/40',
          iconColor: 'text-muted-foreground',
          iconBg: 'bg-muted border border-border/40',
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
        return 'bg-primary';
    }
  };

  return (
    <div className="fixed top-28 right-8 z-50 space-y-3 max-w-sm">
      <AnimatePresence mode="popLayout">
        {alerts.map((alert, index) => {
          const config = getAlertConfig(alert.type);
          const Icon = config.icon;

          return (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: 300, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 300, scale: 0.95 }}
              transition={{
                duration: 0.4,
                ease: [0.22, 1, 0.36, 1],
                delay: index * 0.08
              }}
              layout
              className={`${config.bgColor} ${config.borderColor} border rounded-2xl p-5 relative overflow-hidden shadow-glow`}
            >
              {/* Priority Indicator Bar */}
              <div className={`absolute left-0 top-0 bottom-0 w-0.5 ${getPriorityDot(alert.priority)}`}></div>

              <div className="flex items-start gap-4 pl-2">
                {/* Icon */}
                <div className={`${config.iconBg} rounded-xl p-2.5 flex-shrink-0`}>
                  <Icon className={`w-4 h-4 ${config.iconColor}`} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <h4 className="font-medium text-sm text-foreground">{alert.title}</h4>
                    <motion.button
                      onClick={() => onDismiss(alert.id)}
                      className="flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors duration-200 p-1 rounded-lg hover:bg-muted/30"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <X className="w-3.5 h-3.5" />
                    </motion.button>
                  </div>

                  <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                    {alert.message}
                  </p>

                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5 glass px-2 py-1 rounded-md">
                      <div className="w-1 h-1 rounded-full bg-foreground/30"></div>
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
                className={`absolute bottom-0 left-0 right-0 h-0.5 ${config.iconColor.replace('text-', 'bg-').replace('dark:', '')} opacity-40 origin-left`}
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
