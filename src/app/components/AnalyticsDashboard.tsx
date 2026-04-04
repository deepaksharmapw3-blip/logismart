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
    { name: 'Warehouse', value: 20, color: '#8b5cf6' },
    { name: 'Vehicle', value: 12, color: '#3b82f6' },
    { name: 'Other', value: 8, color: '#6b7280' },
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
      color: 'bg-blue-100 text-blue-600',
    },
    {
      label: 'On-Time Delivery',
      value: '94.2%',
      change: '+3.2%',
      trend: 'up' as const,
      icon: CheckCircle2,
      color: 'bg-emerald-100 text-emerald-600',
    },
    {
      label: 'Avg Delay Time',
      value: '23 min',
      change: '-8.4%',
      trend: 'down' as const,
      icon: Clock,
      color: 'bg-amber-100 text-amber-600',
    },
    {
      label: 'Critical Issues',
      value: '8',
      change: '-50%',
      trend: 'down' as const,
      icon: AlertTriangle,
      color: 'bg-red-100 text-red-600',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trend === 'up' ? TrendingUp : TrendingDown;
          const trendColor =
            (stat.trend === 'up' && stat.label !== 'Critical Issues') ||
            (stat.trend === 'down' && (stat.label === 'Avg Delay Time' || stat.label === 'Critical Issues'))
              ? 'text-emerald-600'
              : 'text-red-600';

          return (
            <motion.div
              key={index}
              className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-lg transition-all"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className={`flex items-center gap-1 text-sm font-medium ${trendColor}`}>
                  <TrendIcon className="w-4 h-4" />
                  {stat.change}
                </div>
              </div>
              <div className="text-2xl font-bold mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-2 gap-6">
        {/* Delivery Trends */}
        <motion.div
          className="bg-white rounded-lg border border-gray-200 p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="font-medium mb-4">Delivery Trends (Last 7 Days)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={deliveryTrendsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="day" stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '12px' }} />
              <Line type="monotone" dataKey="onTime" stroke="#10b981" strokeWidth={2} name="On Time" />
              <Line type="monotone" dataKey="atRisk" stroke="#f59e0b" strokeWidth={2} name="At Risk" />
              <Line type="monotone" dataKey="delayed" stroke="#ef4444" strokeWidth={2} name="Delayed" />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Delay Reasons */}
        <motion.div
          className="bg-white rounded-lg border border-gray-200 p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="font-medium mb-4">Top Delay Causes</h3>
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
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Route Performance & Bottlenecks */}
      <div className="grid grid-cols-2 gap-6">
        {/* Route Performance */}
        <motion.div
          className="bg-white rounded-lg border border-gray-200 p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <h3 className="font-medium mb-4">Route Performance (Avg Delay)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={routePerformanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="route" stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} label={{ value: 'Minutes', angle: -90, position: 'insideLeft', style: { fontSize: 12 } }} />
              <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '12px' }} />
              <Bar dataKey="avgDelay" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Bottleneck Detection */}
        <motion.div
          className="bg-white rounded-lg border border-gray-200 p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <h3 className="font-medium mb-4">Detected Bottlenecks</h3>
          <div className="space-y-3">
            {bottleneckData.map((bottleneck, index) => {
              const severityConfig = {
                high: { color: 'bg-red-100 text-red-700 border-red-200', dot: 'bg-red-500' },
                medium: { color: 'bg-amber-100 text-amber-700 border-amber-200', dot: 'bg-amber-500' },
                low: { color: 'bg-blue-100 text-blue-700 border-blue-200', dot: 'bg-blue-500' },
              }[bottleneck.severity];

              return (
                <motion.div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${severityConfig.dot} animate-pulse`}></div>
                    <div>
                      <div className="font-medium text-sm">{bottleneck.location}</div>
                      <div className="text-xs text-muted-foreground">Avg delay: {bottleneck.delay} min</div>
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded text-xs font-medium border ${severityConfig.color} uppercase`}>
                    {bottleneck.severity}
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200 grid grid-cols-2 gap-4">
            <div>
              <div className="text-2xl font-bold text-red-600">{bottleneckData.filter(b => b.severity === 'high').length}</div>
              <div className="text-xs text-muted-foreground">Critical Bottlenecks</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-amber-600">{bottleneckData.filter(b => b.severity === 'medium').length}</div>
              <div className="text-xs text-muted-foreground">Medium Priority</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
