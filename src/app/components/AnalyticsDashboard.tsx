import { motion } from 'motion/react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, Package, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';

export function AnalyticsDashboard() {
  const deliveryTrendsData = [
    { day: 'Mon', onTime: 45, delayed: 8, atRisk: 12 },
    { day: 'Tue', onTime: 52, delayed: 6, atRisk: 10 },
    { day: 'Wed', onTime: 48, delayed: 10, atRisk: 15 },
    { day: 'Thu', onTime: 60, delayed: 5, atRisk: 8 },
    { day: 'Fri', onTime: 55, delayed: 7, atRisk: 11 },
    { day: 'Sat', onTime: 38, delayed: 4, atRisk: 6 },
    { day: 'Sun', onTime: 42, delayed: 3, atRisk: 5 },
  ];

  const delayReasonsData = [
    { name: 'Traffic', value: 35, color: '#ef4444' },
    { name: 'Weather', value: 25, color: '#f59e0b' },
    { name: 'Warehouse', value: 20, color: '#6366f1' },
    { name: 'Vehicle', value: 12, color: '#10b981' },
    { name: 'Other', value: 8, color: '#94a3b8' },
  ];

  const routePerformanceData = [
    { route: 'Route A', avgDelay: 25 },
    { route: 'Route B', avgDelay: 18 },
    { route: 'Route C', avgDelay: 32 },
    { route: 'Route D', avgDelay: 15 },
    { route: 'Route E', avgDelay: 28 },
  ];

  const bottleneckData = [
    { location: 'LA Warehouse', delay: 45, severity: 'high' },
    { location: 'I-5 North', delay: 32, severity: 'high' },
    { location: 'Denver Hub', delay: 28, severity: 'medium' },
    { location: 'Phoenix Center', delay: 18, severity: 'medium' },
    { location: 'Seattle Port', delay: 12, severity: 'low' },
  ];

  const stats = [
    {
      label: 'Total Shipments',
      value: '1,247',
      change: '+12.5%',
      trend: 'up' as const,
      icon: Package,
      color: 'bg-gradient-to-br from-indigo-500/20 to-violet-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20',
      glow: 'shadow-[0_0_20px_rgba(99,102,241,0.15)]',
    },
    {
      label: 'On-Time Delivery',
      value: '94.2%',
      change: '+3.2%',
      trend: 'up' as const,
      icon: CheckCircle2,
      color: 'bg-gradient-to-br from-emerald-500/20 to-teal-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20',
      glow: 'shadow-[0_0_20px_rgba(16,185,129,0.15)]',
    },
    {
      label: 'Avg Delay Time',
      value: '23 min',
      change: '-8.4%',
      trend: 'down' as const,
      icon: Clock,
      color: 'bg-gradient-to-br from-amber-500/20 to-orange-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/20',
      glow: 'shadow-[0_0_20px_rgba(245,158,11,0.15)]',
    },
    {
      label: 'Critical Issues',
      value: '8',
      change: '-50%',
      trend: 'down' as const,
      icon: AlertTriangle,
      color: 'bg-gradient-to-br from-red-500/20 to-rose-500/20 text-red-600 dark:text-red-400 border border-red-500/20',
      glow: 'shadow-[0_0_20px_rgba(239,68,68,0.15)]',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-5">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trend === 'up' ? TrendingUp : TrendingDown;
          const trendColor =
            (stat.trend === 'up' && stat.label !== 'Critical Issues') ||
            (stat.trend === 'down' && (stat.label === 'Avg Delay Time' || stat.label === 'Critical Issues'))
              ? 'text-emerald-600 dark:text-emerald-400 bg-gradient-to-r from-emerald-500/10 to-teal-500/10'
              : 'text-red-600 dark:text-red-400 bg-gradient-to-r from-red-500/10 to-rose-500/10';

          return (
            <motion.div
              key={index}
              className={`glass-card rounded-2xl p-5 hover:shadow-glow transition-all duration-300 ${stat.glow}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -4, scale: 1.01 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className={`flex items-center gap-1 text-sm font-bold px-2.5 py-1 rounded-lg ${trendColor}`}>
                  <TrendIcon className="w-4 h-4" />
                  {stat.change}
                </div>
              </div>
              <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-2 gap-6">
        {/* Delivery Trends */}
        <motion.div
          className="glass-card rounded-2xl p-6 hover:shadow-glow transition-all duration-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="font-semibold text-foreground mb-5">Delivery Trends (Last 7 Days)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={deliveryTrendsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(99, 102, 241, 0.1)" />
              <XAxis dataKey="day" stroke="currentColor" className="text-muted-foreground" fontSize={12} />
              <YAxis stroke="currentColor" className="text-muted-foreground" fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(8px)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '12px', fontSize: '12px' }} />
              <Line type="monotone" dataKey="onTime" stroke="#10b981" strokeWidth={3} name="On Time" dot={{ fill: '#10b981', strokeWidth: 2 }} />
              <Line type="monotone" dataKey="atRisk" stroke="#f59e0b" strokeWidth={3} name="At Risk" dot={{ fill: '#f59e0b', strokeWidth: 2 }} />
              <Line type="monotone" dataKey="delayed" stroke="#ef4444" strokeWidth={3} name="Delayed" dot={{ fill: '#ef4444', strokeWidth: 2 }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Delay Reasons */}
        <motion.div
          className="glass-card rounded-2xl p-6 hover:shadow-glow transition-all duration-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="font-semibold text-foreground mb-5">Top Delay Causes</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={delayReasonsData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {delayReasonsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(8px)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Route Performance & Bottlenecks */}
      <div className="grid grid-cols-2 gap-6">
        {/* Route Performance */}
        <motion.div
          className="glass-card rounded-2xl p-6 hover:shadow-glow transition-all duration-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <h3 className="font-semibold text-foreground mb-5">Route Performance (Avg Delay)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={routePerformanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(99, 102, 241, 0.1)" />
              <XAxis dataKey="route" stroke="currentColor" className="text-muted-foreground" fontSize={12} />
              <YAxis stroke="currentColor" className="text-muted-foreground" fontSize={12} label={{ value: 'Minutes', angle: -90, position: 'insideLeft', style: { fontSize: 12 } }} />
              <Tooltip contentStyle={{ backgroundColor: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(8px)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '12px', fontSize: '12px' }} />
              <Bar dataKey="avgDelay" fill="url(#barGradient)" radius={[10, 10, 0, 0]} />
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Bottleneck Detection */}
        <motion.div
          className="glass-card rounded-2xl p-6 hover:shadow-glow transition-all duration-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <h3 className="font-semibold text-foreground mb-5">Detected Bottlenecks</h3>
          <div className="space-y-3">
            {bottleneckData.map((bottleneck, index) => {
              const severityConfig = {
                high: { color: 'bg-gradient-to-r from-red-500/10 to-rose-500/10 text-red-600 dark:text-red-400 border-red-500/20', dot: 'bg-gradient-to-r from-red-500 to-rose-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' },
                medium: { color: 'bg-gradient-to-r from-amber-500/10 to-orange-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20', dot: 'bg-gradient-to-r from-amber-500 to-orange-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]' },
                low: { color: 'bg-gradient-to-r from-indigo-500/10 to-violet-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20', dot: 'bg-gradient-to-r from-indigo-500 to-violet-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]' },
              }[bottleneck.severity];

              return (
                <motion.div
                  key={index}
                  className="flex items-center justify-between p-3.5 glass rounded-xl hover:shadow-glow transition-all duration-300"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  whileHover={{ x: 4 }}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full ${severityConfig.dot} animate-pulse`}></div>
                    <div>
                      <div className="font-semibold text-sm text-foreground">{bottleneck.location}</div>
                      <div className="text-xs text-muted-foreground">Avg delay: {bottleneck.delay} min</div>
                    </div>
                  </div>
                  <div className={`px-2.5 py-1.5 rounded-lg text-xs font-bold border ${severityConfig.color} uppercase tracking-wide`}>
                    {bottleneck.severity}
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-6 pt-5 border-t border-border/50 grid grid-cols-2 gap-4">
            <div className="glass rounded-xl p-3 text-center">
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">{bottleneckData.filter(b => b.severity === 'high').length}</div>
              <div className="text-xs text-muted-foreground font-medium">Critical Bottlenecks</div>
            </div>
            <div className="glass rounded-xl p-3 text-center">
              <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{bottleneckData.filter(b => b.severity === 'medium').length}</div>
              <div className="text-xs text-muted-foreground font-medium">Medium Priority</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
