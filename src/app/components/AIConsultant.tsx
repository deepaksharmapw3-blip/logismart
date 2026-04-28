import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
    BarChart3,
    Package,
    ArrowUpRight,
    Info,
    Sparkles,
    Target
} from 'lucide-react';
import { api, type AIRecommendation, type AISystemInsights, type Shipment, type AIDecision } from '../services/api';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';

interface ShipmentOptimization {
    shipment: Shipment;
    decision: AIDecision | null;
}

interface AIConsultantProps {
    onConfirmExecution?: (shipmentId: string) => Promise<void>;
}

export function AIConsultant({ onConfirmExecution }: AIConsultantProps) {
    const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
    const [insights, setInsights] = useState<AISystemInsights | null>(null);
    const [shipmentOptimizations, setShipmentOptimizations] = useState<ShipmentOptimization[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeSection, setActiveSection] = useState<'strategic' | 'shipments'>('strategic');
    const [executingShipmentId, setExecutingShipmentId] = useState<string | null>(null);
    const [executedShipments, setExecutedShipments] = useState<Set<string>>(new Set());

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [recData, insightData, shipmentsData] = await Promise.all([
                    api.getAIRecommendations(),
                    api.getAISystemInsights(),
                    api.getShipments()
                ]);

                setRecommendations(recData);
                setInsights(insightData);

                // Get decisions for at-risk or delayed shipments
                const criticalShipments = shipmentsData.filter(s => s.status !== 'on-time').slice(0, 3);
                const optimizations = await Promise.all(
                    criticalShipments.map(async (shipment) => {
                        try {
                            const decision = await api.getAIDecision(shipment.id);
                            return { shipment, decision };
                        } catch (e) {
                            return { shipment, decision: null };
                        }
                    })
                );
                setShipmentOptimizations(optimizations);

            } catch (error) {
                console.error('Error fetching AI insights:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleConfirmExecution = async (shipmentId: string) => {
        if (!onConfirmExecution || executingShipmentId) {
            return;
        }

        try {
            setExecutingShipmentId(shipmentId);
            await onConfirmExecution(shipmentId);
            setExecutedShipments(prev => new Set(prev).add(shipmentId));
        } catch (error) {
            console.error('Error confirming shipment optimization:', error);
        } finally {
            setExecutingShipmentId(null);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-24 space-y-6">
                <div className="relative">
                    <div className="w-24 h-24 border-b-4 border-indigo-500 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Brain className="w-10 h-10 text-indigo-400 animate-pulse" />
                    </div>
                </div>
                <div className="text-center space-y-2">
                    <h3 className="text-xl font-bold text-white">Synthesizing Logistics Intelligence</h3>
                    <p className="text-indigo-300/60 font-medium">Running advanced neural simulations...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-20 animate-fade-in">
            {/* Premium Hero Banner */}
            <div className="relative overflow-hidden rounded-[2.5rem] mesh-gradient p-10 text-white shadow-2xl border border-white/10">
                <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
                    <div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-3 mb-6"
                        >
                            <span className="px-4 py-1.5 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full text-xs font-bold uppercase tracking-widest text-indigo-200 flex items-center gap-2">
                                <Sparkles className="w-3.5 h-3.5" /> AI Consultant Alpha
                            </span>
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-5xl font-black mb-6 tracking-tight leading-tight"
                        >
                            Strategic <span className="text-indigo-300">Logistics</span> Intelligence
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-indigo-100/80 text-xl leading-relaxed mb-8 max-w-lg"
                        >
                            Empowered by real-time neural processing, LogiSmart AI provides mission-critical insights to optimize your global supply chain.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="flex flex-wrap gap-4"
                        >
                            <div className="px-6 py-3 premium-card rounded-2xl flex items-center gap-3">
                                <Activity className="w-5 h-5 text-indigo-400" />
                                <div>
                                    <div className="text-[10px] uppercase tracking-wider text-white/40 font-bold">Efficiency</div>
                                    <div className="text-lg font-bold">{insights?.efficiencyScore || 0}%</div>
                                </div>
                            </div>
                            <div className="px-6 py-3 premium-card rounded-2xl flex items-center gap-3">
                                <Shield className="w-5 h-5 text-emerald-400" />
                                <div>
                                    <div className="text-[10px] uppercase tracking-wider text-white/40 font-bold">Operational Status</div>
                                    <div className="text-lg font-bold">Optimal</div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    <div className="hidden lg:block relative">
                        <motion.div
                            animate={{
                                scale: [1, 1.05, 1],
                                rotate: [0, 5, 0]
                            }}
                            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                            className="relative z-10 w-full aspect-square max-w-sm ml-auto premium-card rounded-full flex items-center justify-center border-white/20 p-12 overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-indigo-500/10 blur-[100px] animate-pulse"></div>
                            <Brain className="w-48 h-48 text-indigo-300 opacity-20 absolute" />
                            <Target className="w-32 h-32 text-indigo-400 opacity-40 animate-spin-slow" />
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex gap-4 p-1.5 bg-white/5 border border-white/10 rounded-2xl w-fit">
                <button
                    onClick={() => setActiveSection('strategic')}
                    className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeSection === 'strategic' ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
                >
                    Strategic Overview
                </button>
                <button
                    onClick={() => setActiveSection('shipments')}
                    className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeSection === 'shipments' ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
                >
                    Shipment Optimization
                </button>
            </div>

            <AnimatePresence mode="wait">
                {activeSection === 'strategic' ? (
                    <motion.div
                        key="strategic"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
                    >
                        {/* Recommendations List */}
                        <div className="lg:col-span-2 space-y-6">
                            <h2 className="text-2xl font-black flex items-center gap-3 text-white">
                                <Lightbulb className="w-6 h-6 text-indigo-400" />
                                Core Recommendations
                            </h2>
                            <div className="grid gap-4">
                                {recommendations.map((rec, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="premium-card p-6 group cursor-default"
                                    >
                                        <div className="flex items-start gap-6">
                                            <div className={`p-4 rounded-2xl ${rec.priority === 'high' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                                                    rec.priority === 'medium' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                                                        'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                                }`}>
                                                {rec.type === 'route' ? <TrendingUp className="w-7 h-7" /> :
                                                    rec.type === 'operational' ? <Activity className="w-7 h-7" /> :
                                                        <Shield className="w-7 h-7" />}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-2">
                                                    <h3 className="text-xl font-bold text-white group-hover:text-indigo-300 transition-colors">{rec.title}</h3>
                                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${rec.priority === 'high' ? 'bg-red-500 text-white' :
                                                            rec.priority === 'medium' ? 'bg-amber-500 text-black' :
                                                                'bg-emerald-500 text-white'
                                                        }`}>
                                                        {rec.priority} PRIORITY
                                                    </span>
                                                </div>
                                                <p className="text-white/60 mb-6 leading-relaxed text-lg">{rec.description}</p>
                                                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                                    <div className="flex items-center gap-2">
                                                        <Sparkles className="w-4 h-4 text-emerald-400" />
                                                        <span className="text-sm font-medium text-emerald-400">{rec.expectedBenefit}</span>
                                                    </div>
                                                    <Button className="btn-glass px-6 rounded-xl font-bold gap-2">
                                                        Execute Strategy <ArrowRight className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Sidebar: System Analytics */}
                        <div className="space-y-8">
                            <div className="premium-card p-8 rounded-[2rem] border-glow">
                                <h2 className="text-xl font-black mb-8 flex items-center gap-3">
                                    <BarChart3 className="w-6 h-6 text-indigo-400" />
                                    Analytical Pulse
                                </h2>

                                <div className="space-y-8">
                                    <div className="p-5 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
                                        <div className="text-[10px] uppercase font-black tracking-widest text-indigo-300 mb-3 flex items-center gap-2">
                                            <Brain className="w-3 h-3" /> Strategic Insight
                                        </div>
                                        <p className="text-white/80 italic leading-relaxed text-sm">"{insights?.summary}"</p>
                                    </div>

                                    <div>
                                        <div className="text-[10px] uppercase font-black tracking-widest text-white/40 mb-4">Supply Bottlenecks</div>
                                        <div className="space-y-3">
                                            {insights?.bottlenecks.map((b, i) => (
                                                <div key={i} className="p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all">
                                                    <div className="flex items-center gap-2 mb-1.5">
                                                        <AlertTriangle className="w-4 h-4 text-amber-500" />
                                                        <span className="font-bold text-sm">{b.location}</span>
                                                    </div>
                                                    <p className="text-xs text-white/40 mb-3">{b.impact}</p>
                                                    <div className="p-2 bg-emerald-500/10 rounded-lg text-[10px] text-emerald-400 font-bold flex items-center gap-2 uppercase">
                                                        <CheckCircle2 className="w-3 h-3" /> Suggested: {b.suggestion}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-white/5">
                                        <div className="text-[10px] uppercase font-black tracking-widest text-white/40 mb-4">Neural Advice</div>
                                        <div className="p-5 bg-white/5 rounded-2xl border border-white/10 text-sm leading-relaxed text-indigo-100 font-medium">
                                            {insights?.strategicAdvice}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="shipments"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-8"
                    >
                        <div className="flex items-center justify-between">
                            <h2 className="text-3xl font-black text-white flex items-center gap-3">
                                <Package className="w-8 h-8 text-indigo-400" />
                                At-Risk Shipment Optimization
                            </h2>
                            <div className="px-4 py-2 bg-indigo-500/20 border border-indigo-500/30 rounded-xl text-indigo-300 text-sm font-bold flex items-center gap-2">
                                <Target className="w-4 h-4" /> Targeting {shipmentOptimizations.length} Critical Loads
                            </div>
                        </div>

                        {shipmentOptimizations.length === 0 ? (
                            <div className="premium-card p-20 text-center rounded-[3rem]">
                                <div className="w-20 h-20 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle2 className="w-10 h-10" />
                                </div>
                                <h3 className="text-2xl font-bold mb-2">No Active Threats Detected</h3>
                                <p className="text-white/40">All active shipments are currently processing within nominal neural parameters.</p>
                            </div>
                        ) : (
                            <div className="grid lg:grid-cols-2 gap-8">
                                {shipmentOptimizations.map((opt, idx) => (
                                    <motion.div
                                        key={opt.shipment.id}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="premium-card p-8 rounded-[2.5rem] relative group"
                                    >
                                        <div className="flex items-center justify-between mb-8">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
                                                    <Package className="w-6 h-6 text-white" />
                                                </div>
                                                <div>
                                                    <div className="font-black text-xl tracking-tight">#{opt.shipment.id}</div>
                                                    <div className="text-sm text-white/40 font-medium uppercase tracking-widest">{opt.shipment.status.replace('-', ' ')}</div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Delay Risk</div>
                                                <div className={`text-2xl font-black ${opt.shipment.delayProbability > 70 ? 'text-red-400' : 'text-amber-400'}`}>
                                                    {opt.shipment.delayProbability}%
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            <div className="p-6 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
                                                <div className="flex items-center gap-2 mb-3 text-indigo-300 font-black text-xs uppercase tracking-widest">
                                                    <Brain className="w-4 h-4" /> AI Strategic Decision
                                                </div>
                                                <h4 className="text-xl font-bold mb-3 text-white leading-tight">{opt.decision?.decision || "Optimizing route based on live traffic..."}</h4>
                                                <p className="text-indigo-100/70 text-sm leading-relaxed mb-6">{opt.decision?.rationale}</p>

                                                <div className="grid gap-3 mb-6">
                                                    {opt.decision?.actions.map((action, i) => (
                                                        <div key={i} className="flex items-center gap-3 text-sm font-medium text-white/80 bg-white/5 p-3 rounded-xl border border-white/5">
                                                            <div className="w-5 h-5 bg-indigo-500/20 text-indigo-400 rounded-lg flex items-center justify-center text-[10px] font-black">{i + 1}</div>
                                                            {action}
                                                        </div>
                                                    ))}
                                                </div>

                                                <div className="p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/20 flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <TrendingUp className="w-4 h-4 text-emerald-400" />
                                                        <span className="text-xs font-black uppercase tracking-widest text-emerald-300">Projected Impact</span>
                                                    </div>
                                                    <span className="text-sm font-bold text-emerald-400">{opt.decision?.impact || "+15% On-Time Correction"}</span>
                                                </div>
                                            </div>

                                            <div className="flex gap-4">
                                                <Button
                                                    onClick={() => handleConfirmExecution(opt.shipment.id)}
                                                    disabled={!onConfirmExecution || executingShipmentId === opt.shipment.id || executedShipments.has(opt.shipment.id)}
                                                    className="flex-1 btn-glass h-14 rounded-2xl font-black text-sm tracking-widest uppercase shadow-xl hover:shadow-indigo-500/20 disabled:opacity-60"
                                                >
                                                    {executingShipmentId === opt.shipment.id
                                                        ? 'Executing...'
                                                        : executedShipments.has(opt.shipment.id)
                                                            ? 'Execution Confirmed'
                                                            : 'Confirm Execution'}
                                                </Button>
                                                <Button variant="ghost" className="h-14 w-14 rounded-2xl border border-white/10 hover:bg-white/5">
                                                    <Info className="w-5 h-5" />
                                                </Button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
