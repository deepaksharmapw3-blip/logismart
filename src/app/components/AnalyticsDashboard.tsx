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
    { name: 'Traffic', value: 35, color: '#dc2626' },
    { name: 'Weather', value: 25, color: '#f59e0b' },
    { name: 'Warehouse', value: 20, color: '#4338ca' },
    { name: 'Vehicle', value: 12, color: '#0d9488' },
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
      color: 'bg-primary/8 text-primary border border-primary/12',
    },
    {
      label: 'On-Time Delivery',
      value: '94.2%',
      change: '+3.2%',
      trend: 'up' as const,
      icon: CheckCircle2,
      color: 'bg-teal-500/8 text-teal-700 dark:text-teal-400 border border-teal-500/12',
    },
    {
      label: 'Avg Delay Time',
      value: '23 min',
      change: '-8.4%',
      trend: 'down' as const,
      icon: Clock,
      color: 'bg-amber-500/8 text-amber-700 dark:text-amber-400 border border-amber-500/12',
    },
    {
      label: 'Critical Issues',
      value: '8',
      change: '-50%',
      trend: 'down' as const,
      icon: AlertTriangle,
      color: 'bg-red-500/8 text-red-700 dark:text-red-400 border border-red-500/12',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trend === 'up' ? TrendingUp : TrendingDown;
          const trendColor =
            (stat.trend === 'up' && stat.label !== 'Critical Issues') ||
            (stat.trend === 'down' && (stat.label === 'Avg Delay Time' || stat.label === 'Critical Issues'))
              ? 'text-teal-700 dark:text-teal-400 bg-teal-500/8'
              : 'text-red-700 dark:text-red-400 bg-red-500/8';

          return (
            <motion.div
              key={index}
              className="glass-card rounded-2xl p-6 hover:shadow-glow transition-all duration-300"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -3 }}
            >
              <div className="flex items-center justify-between mb-5">
                <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg ${trendColor}`}>
                  <TrendIcon className="w-3.5 h-3.5" />
                  {stat.change}
                </div>
              </div>
              <div className="text-3xl font-semibold text-foreground tabular-nums mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-2 gap-8">
        {/* Delivery Trends */}
        <motion.div
          className="glass-card rounded-2xl p-6 hover:shadow-glow transition-all duration-300"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <h3 className="font-medium text-foreground mb-6">Delivery Trends (Last 7 Days)</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={deliveryTrendsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.5} />
              <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ backgroundColor: 'var(--popover)', backdropFilter: 'blur(12px)', border: '1px solid var(--border)', borderRadius: '12px', fontSize: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} />
              <Line type="monotone" dataKey="onTime" stroke="#0d9488" strokeWidth={2.5} name="On Time" dot={{ fill: '#0d9488', strokeWidth: 0, r: 4 }} activeDot={{ r: 6, strokeWidth: 0 }} />
              <Line type="monotone" dataKey="atRisk" stroke="#f59e0b" strokeWidth={2.5} name="At Risk" dot={{ fill: '#f59e0b', strokeWidth: 0, r: 4 }} activeDot={{ r: 6, strokeWidth: 0 }} />
              <Line type="monotone" dataKey="delayed" stroke="#dc2626" strokeWidth={2.5} name="Delayed" dot={{ fill: '#dc2626', strokeWidth: 0, r: 4 }} activeDot={{ r: 6, strokeWidth: 0 }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Delay Reasons */}
        <motion.div
          className="glass-card rounded-2xl p-6 hover:shadow-glow transition-all duration-300"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <h3 className="font-medium text-foreground mb-6">Top Delay Causes</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={delayReasonsData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={95}
                innerRadius={50}
                fill="#8884d8"
                dataKey="value"
                strokeWidth={0}
              >
                {delayReasonsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: 'var(--popover)', backdropFilter: 'blur(12px)', border: '1px solid var(--border)', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Route Performance & Bottlenecks */}
      <div className="grid grid-cols-2 gap-8">
        {/* Route Performance */}
        <motion.div
          className="glass-card rounded-2xl p-6 hover:shadow-glow transition-all duration-300"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <h3 className="font-medium text-foreground mb-6">Route Performance (Avg Delay)</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={routePerformanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.5} />
              <XAxis dataKey="route" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} label={{ value: 'Minutes', angle: -90, position: 'insideLeft', style: { fontSize: 11, fill: 'var(--muted-foreground)' } }} />
              <Tooltip contentStyle={{ backgroundColor: 'var(--popover)', backdropFilter: 'blur(12px)', border: '1px solid var(--border)', borderRadius: '12px', fontSize: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} />
              <Bar dataKey="avgDelay" fill="var(--primary)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Bottleneck Detection */}
        <motion.div
          className="glass-card rounded-2xl p-6 hover:shadow-glow transition-all duration-300"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <h3 className="font-medium text-foreground mb-6">Detected Bottlenecks</h3>
          <div className="space-y-2.5">
            {bottleneckData.map((bottleneck, index) => {
              const severityConfig = {
                high: { color: 'bg-red-500/8 text-red-700 dark:text-red-400 border border-red-500/12', dot: 'bg-red-500' },
                medium: { color: 'bg-amber-500/8 text-amber-700 dark:text-amber-400 border border-amber-500/12', dot: 'bg-amber-500' },
                low: { color: 'bg-primary/8 text-primary border border-primary/12', dot: 'bg-primary' },
              }[bottleneck.severity];

              return (
                <motion.div
                  key={index}
                  className="flex items-center justify-between p-4 glass rounded-xl hover:shadow-glow transition-all duration-200"
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.06, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ x: 3 }}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${severityConfig.dot}`}></div>
                    <div>
                      <div className="font-medium text-sm text-foreground">{bottleneck.location}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">Avg delay: {bottleneck.delay} min</div>
                    </div>
                  </div>
                  <div className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold ${severityConfig.color} uppercase tracking-wide`}>
                    {bottleneck.severity}
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-6 pt-5 border-t border-border/40 grid grid-cols-2 gap-4">
            <div className="glass rounded-xl p-4 text-center">
              <div className="text-2xl font-semibold text-red-600 dark:text-red-400 tabular-nums">{bottleneckData.filter(b => b.severity === 'high').length}</div>
              <div className="text-xs text-muted-foreground mt-1">Critical Bottlenecks</div>
            </div>
            <div className="glass rounded-xl p-4 text-center">
              <div className="text-2xl font-semibold text-amber-600 dark:text-amber-400 tabular-nums">{bottleneckData.filter(b => b.severity === 'medium').length}</div>
              <div className="text-xs text-muted-foreground mt-1">Medium Priority</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
