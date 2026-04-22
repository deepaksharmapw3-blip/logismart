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
      <div className="bg-gradient-to-br from-red-900/50 to-slate-900 border border-red-500/30 rounded-xl p-6">
        <p className="text-red-300">Failed to load analytics data</p>
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
    <div className="space-y-6 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = getStatIcon(stat.label);
          const TrendIcon = stat.trend === 'up' ? TrendingUp : TrendingDown;
          const trendColor =
            (stat.trend === 'up' && stat.label !== 'Critical Issues') ||
            (stat.trend === 'down' && (stat.label === 'Avg Delay Time' || stat.label === 'Critical Issues'))
              ? 'text-emerald-400'
              : 'text-red-400';

          const gradients = [
            'from-blue-600 to-blue-700',
            'from-emerald-600 to-emerald-700',
            'from-amber-600 to-amber-700',
            'from-red-600 to-red-700',
          ];

          return (
            <motion.div
              key={index}
              className={`bg-gradient-to-br ${gradients[index]} rounded-xl p-4 hover:shadow-2xl transition-all border border-${['blue', 'emerald', 'amber', 'red'][index]}-500/30 hover:border-${['blue', 'emerald', 'amber', 'red'][index]}-400/50`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className={`flex items-center gap-1 text-sm font-semibold ${trendColor}`}>
                  <TrendIcon className="w-4 h-4" />
                  {stat.change}
                </div>
              </div>
              <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-sm text-blue-100 opacity-90">{stat.label}</div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-2 gap-6">
        {/* Delivery Trends */}
        <motion.div
          className="bg-gradient-to-br from-indigo-900 via-slate-800 to-slate-900 rounded-xl border border-indigo-500/30 p-6 hover:border-indigo-400/50 transition-all"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="font-semibold text-white mb-4">Delivery Trends (Last 7 Days)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={deliveryTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
              <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px', fontSize: '12px', color: '#e2e8f0' }} />
              <Line type="monotone" dataKey="onTime" stroke="#10b981" strokeWidth={3} name="On Time" dot={{ fill: '#10b981', r: 4 }} />
              <Line type="monotone" dataKey="atRisk" stroke="#f59e0b" strokeWidth={3} name="At Risk" dot={{ fill: '#f59e0b', r: 4 }} />
              <Line type="monotone" dataKey="delayed" stroke="#ef4444" strokeWidth={3} name="Delayed" dot={{ fill: '#ef4444', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Delay Reasons */}
        <motion.div
          className="bg-gradient-to-br from-violet-900 via-slate-800 to-slate-900 rounded-xl border border-violet-500/30 p-6 hover:border-violet-400/50 transition-all"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="font-semibold text-white mb-4">Top Delay Causes</h3>
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
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px', fontSize: '12px', color: '#e2e8f0' }} />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Route Performance & Bottlenecks */}
      <div className="grid grid-cols-2 gap-6">
        {/* Route Performance */}
        <motion.div
          className="bg-gradient-to-br from-cyan-900 via-slate-800 to-slate-900 rounded-xl border border-cyan-500/30 p-6 hover:border-cyan-400/50 transition-all"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <h3 className="font-semibold text-white mb-4">Route Performance (Avg Delay)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={routePerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
              <XAxis dataKey="route" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} label={{ value: 'Minutes', angle: -90, position: 'insideLeft', style: { fontSize: 12, fill: '#94a3b8' } }} />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px', fontSize: '12px', color: '#e2e8f0' }} />
              <Bar dataKey="avgDelay" fill="#06b6d4" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Bottleneck Detection */}
        <motion.div
          className="bg-gradient-to-br from-rose-900 via-slate-800 to-slate-900 rounded-xl border border-rose-500/30 p-6 hover:border-rose-400/50 transition-all"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <h3 className="font-semibold text-white mb-4">Detected Bottlenecks</h3>
          <div className="space-y-3">
            {bottlenecks.map((bottleneck: typeof bottlenecks[0], index: number) => {
              const severityConfig = {
                high: { color: 'bg-red-500/20 text-red-300 border-red-500/50', dot: 'bg-red-500' },
                medium: { color: 'bg-amber-500/20 text-amber-300 border-amber-500/50', dot: 'bg-amber-500' },
                low: { color: 'bg-blue-500/20 text-blue-300 border-blue-500/50', dot: 'bg-blue-500' },
              }[bottleneck.severity];

              return (
                <motion.div
                  key={index}
                  className="flex items-center justify-between p-3 bg-slate-700/40 rounded-lg hover:bg-slate-700/60 transition-all border border-slate-600/50"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${severityConfig.dot} animate-pulse`}></div>
                    <div>
                      <div className="font-medium text-sm text-slate-100">{bottleneck.location}</div>
                      <div className="text-xs text-slate-400">Avg delay: {bottleneck.delay} min</div>
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded text-xs font-semibold border ${severityConfig.color} uppercase`}>
                    {bottleneck.severity}
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-600 grid grid-cols-2 gap-4">
            <div className="bg-red-500/10 rounded-lg p-3 border border-red-500/30">
              <div className="text-2xl font-bold text-red-400">{bottlenecks.filter(b => b.severity === 'high').length}</div>
              <div className="text-xs text-slate-300">Critical Bottlenecks</div>
            </div>
            <div className="bg-amber-500/10 rounded-lg p-3 border border-amber-500/30">
              <div className="text-2xl font-bold text-amber-400">{bottlenecks.filter(b => b.severity === 'medium').length}</div>
              <div className="text-xs text-slate-300">Medium Priority</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
