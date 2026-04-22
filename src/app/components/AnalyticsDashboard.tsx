import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, Package, Clock, AlertTriangle, CheckCircle2, Loader2 } from 'lucide-react';
import { api, type AnalyticsData } from '../services/api';

export function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const data = await api.getAnalytics();
        setAnalytics(data);
      } catch (err) {
        console.error('Error fetching analytics:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch analytics');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <p className="text-red-600">Failed to load analytics data</p>
      </div>
    );
  }

  const { deliveryTrends, delayReasons, routePerformance, bottlenecks, stats } = analytics;

  // Icon mapping for stats
  const getStatIcon = (label: string) => {
    switch (label) {
      case 'Total Shipments': return Package;
      case 'On-Time Delivery': return CheckCircle2;
      case 'Avg Delay Time': return Clock;
      case 'Critical Issues': return AlertTriangle;
      default: return Package;
    }
  };

  // Color mapping for stats
  const getStatColor = (label: string) => {
    switch (label) {
      case 'Total Shipments': return 'bg-blue-100 text-blue-600';
      case 'On-Time Delivery': return 'bg-emerald-100 text-emerald-600';
      case 'Avg Delay Time': return 'bg-amber-100 text-amber-600';
      case 'Critical Issues': return 'bg-red-100 text-red-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = getStatIcon(stat.label);
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
                <div className={`w-10 h-10 ${getStatColor(stat.label)} rounded-lg flex items-center justify-center`}>
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
            <LineChart data={deliveryTrends}>
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
                data={delayReasons}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {delayReasons.map((entry: typeof delayReasons[0], index: number) => (
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
            <BarChart data={routePerformance}>
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
            {bottlenecks.map((bottleneck: typeof bottlenecks[0], index: number) => {
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
              <div className="text-2xl font-bold text-red-600">{bottlenecks.filter(b => b.severity === 'high').length}</div>
              <div className="text-xs text-muted-foreground">Critical Bottlenecks</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-amber-600">{bottlenecks.filter(b => b.severity === 'medium').length}</div>
              <div className="text-xs text-muted-foreground">Medium Priority</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
