import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
    Zap,
    Brain,
    TrendingUp,
    AlertTriangle,
    CheckCircle2,
    Lightbulb,
    ArrowRight,
    Shield,
    Activity,
    BarChart3
} from 'lucide-react';
import { api, type AIRecommendation, type AISystemInsights } from '../services/api';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';

export function AIConsultant() {
    const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
    const [insights, setInsights] = useState<AISystemInsights | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [recData, insightData] = await Promise.all([
                    api.getAIRecommendations(),
                    api.getAISystemInsights()
                ]);
                setRecommendations(recData);
                setInsights(insightData);
            } catch (error) {
                console.error('Error fetching AI insights:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                    <Brain className="w-8 h-8 text-indigo-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                </div>
                <p className="text-indigo-300 font-medium animate-pulse">AI is analyzing your supply chain...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-12">
            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-3xl bg-indigo-600 p-8 text-white shadow-2xl">
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-white/20 rounded-lg backdrop-blur-md">
                            <Zap className="w-6 h-6 text-yellow-300" />
                        </div>
                        <h1 className="text-3xl font-bold">AI Strategic Consultant</h1>
                    </div>
                    <p className="max-w-2xl text-indigo-100 text-lg mb-6">
                        LogiSmart AI has processed your current logistics data. Here is your strategic overview and recommended actions to optimize performance.
                    </p>
                    <div className="flex gap-4">
                        <div className="px-4 py-2 bg-white/10 rounded-full border border-white/20 backdrop-blur-sm transition-all hover:bg-white/20 cursor-default">
                            <span className="text-sm font-medium">Efficiency: {insights?.efficiencyScore || 0}%</span>
                        </div>
                        <div className="px-4 py-2 bg-white/10 rounded-full border border-white/20 backdrop-blur-sm transition-all hover:bg-white/20 cursor-default">
                            <span className="text-sm font-medium">System Health: Optimal</span>
                        </div>
                    </div>
                </div>
                {/* Abstract Background Shapes */}
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-64 h-64 bg-indigo-400/20 rounded-full blur-2xl"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Recommendations */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                            <Lightbulb className="w-5 h-5 text-yellow-400" />
                            Strategic Recommendations
                        </h2>
                    </div>

                    <div className="space-y-4">
                        {recommendations?.map((rec, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="glass-card group relative p-6 rounded-2xl border border-white/10 hover:border-indigo-500/30 transition-all hover:shadow-indigo-500/10 hover:shadow-xl"
                            >
                                <div className="flex items-start gap-4">
                                    <div className={`p-3 rounded-xl ${rec.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                                        rec.priority === 'medium' ? 'bg-amber-500/20 text-amber-400' :
                                            'bg-emerald-500/20 text-emerald-400'
                                        }`}>
                                        {rec.type === 'route' ? <TrendingUp className="w-6 h-6" /> :
                                            rec.type === 'operational' ? <Activity className="w-6 h-6" /> :
                                                <Shield className="w-6 h-6" />}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                            <h3 className="font-bold text-lg text-white group-hover:text-indigo-300 transition-colors">{rec.title}</h3>
                                            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${rec.priority === 'high' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                                                rec.priority === 'medium' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                                                    'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                                }`}>
                                                {rec.priority} Priority
                                            </span>
                                        </div>
                                        <p className="text-white/60 mb-4">{rec.description}</p>
                                        <div className="flex items-center justify-between">
                                            <div className="text-sm">
                                                <span className="text-white/40 italic">Expected Benefit: </span>
                                                <span className="text-emerald-400 font-medium">{rec.expectedBenefit}</span>
                                            </div>
                                            <Button variant="ghost" className="text-indigo-400 hover:text-indigo-300 hover:bg-white/5 gap-2 group-hover:translate-x-1 transition-all">
                                                Implement <ArrowRight className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Right Column: Insights & Stats */}
                <div className="space-y-6">
                    <div className="glass-card p-6 rounded-2xl border border-white/10">
                        <h2 className="text-xl font-semibold flex items-center gap-2 mb-6 text-gradient">
                            <Brain className="w-5 h-5 text-indigo-400" />
                            AI System Analysis
                        </h2>

                        <div className="space-y-6">
                            <div>
                                <div className="text-sm text-white/40 mb-2 uppercase tracking-widest font-bold">Strategic Summary</div>
                                <p className="text-white/80 leading-relaxed italic">
                                    "{insights?.summary}"
                                </p>
                            </div>

                            <div className="border-t border-white/10 pt-6">
                                <div className="text-sm text-white/40 mb-4 uppercase tracking-widest font-bold">Bottleneck Watch</div>
                                <div className="space-y-4">
                                    {insights?.bottlenecks?.map((b: any, idx: number) => (
                                        <div key={idx} className="p-3 bg-white/5 rounded-xl border border-white/10">
                                            <div className="flex items-center gap-2 mb-1">
                                                <AlertTriangle className="w-4 h-4 text-amber-400" />
                                                <span className="font-bold text-sm text-white">{b.location}</span>
                                            </div>
                                            <p className="text-xs text-white/50">{b.impact}</p>
                                            <div className="mt-2 text-xs text-indigo-300 flex items-center gap-1">
                                                <CheckCircle2 className="w-3 h-3" />
                                                {b.suggestion}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="border-t border-white/10 pt-6">
                                <div className="text-sm text-white/40 mb-2 uppercase tracking-widest font-bold">Strategic Advice</div>
                                <div className="p-4 bg-indigo-500/10 rounded-xl border border-indigo-500/20 text-sm text-indigo-200">
                                    {insights?.strategicAdvice}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
