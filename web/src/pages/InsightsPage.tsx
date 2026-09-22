import { useState, useEffect } from 'react';
import TopNav from '../components/layout/TopNav';
import { insightService } from '../services/insightService';
import { cycleService } from '../services/cycleService';
import { authService } from '../services/authService';
import { getStoredUser } from '../services/api';
import type { HealthInsight, RiskIndicator, Prediction, Cycle, User } from '../types';
import { AlertTriangle, Brain, Moon, Droplets, TrendingUp, ShieldAlert, Sparkles, BatteryLow, Info } from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  'alert-triangle': AlertTriangle,
  brain: Brain,
  moon: Moon,
  droplets: Droplets,
  'battery-low': BatteryLow,
};

export default function InsightsPage() {
  const [insights, setInsights] = useState<HealthInsight[]>([]);
  const [riskIndicators, setRiskIndicators] = useState<RiskIndicator[]>([]);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [currentCycle, setCurrentCycle] = useState<Cycle | null>(null);
  const [user, setUser] = useState<User | null>(getStoredUser());

  useEffect(() => {
    loadInsightsData();
  }, []);

  const loadInsightsData = async () => {
    try {
      const [fetchedInsights, fetchedRisks, fetchedPreds, activeCycle, currentUser] = await Promise.all([
        insightService.getInsights().catch(() => []),
        insightService.getRiskIndicators().catch(() => []),
        insightService.getPredictions().catch(() => []),
        cycleService.getCurrentCycle().catch(() => null),
        authService.getCurrentUser().catch(() => null),
      ]);
      setInsights(fetchedInsights);
      setRiskIndicators(fetchedRisks);
      setPredictions(fetchedPreds);
      if (activeCycle) setCurrentCycle(activeCycle);
      if (currentUser) setUser(currentUser);
    } catch (err) {
      console.error('Failed to load live insights', err);
    }
  };

  const currentCycleDayNumber = (() => {
    if (!currentCycle) return 1;
    const start = new Date(currentCycle.startDate);
    const now = new Date();
    const diff = Math.floor((now.getTime() - start.getTime()) / 86400000) + 1;
    return Math.max(1, diff);
  })();

  const mainInsight = insights[0] || {
    id: 'default_insight',
    title: 'Cycle Health Intelligence',
    description: `Your cycle is currently on Day ${currentCycleDayNumber} of your ${user?.averageCycleLength || 28}-day baseline rhythm.`,
    severity: 'info',
    category: 'health-awareness',
  };
  const deviation = currentCycleDayNumber - (user?.averageCycleLength || 28);

  return (
    <div className="min-h-screen">
      <TopNav title="Health Insights" subtitle="AI-powered analysis of your health patterns & clinical correlations" />

      <div className="p-6 lg:p-8 max-w-7xl w-full mx-auto stagger-children">
        {/* Main Insight Hero */}
        <div className="bg-gradient-to-r from-plum to-plum-light rounded-2xl p-8 text-white shadow-xl shadow-plum/20 mb-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center shrink-0">
              <Sparkles className="w-7 h-7" />
            </div>
            <div className="flex-1">
              <span className="text-xs font-semibold bg-white/20 px-3 py-1 rounded-full">
                RITORA Intelligence
              </span>
              <h2 className="text-2xl font-bold mt-3 mb-2">{mainInsight.title}</h2>
              <p className="text-white/80 leading-relaxed">{mainInsight.description}</p>

              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="bg-white/10 rounded-xl p-4">
                  <p className="text-xs text-white/60">Current Cycle</p>
                  <p className="text-2xl font-bold">{currentCycleDayNumber} days</p>
                </div>
                <div className="bg-white/10 rounded-xl p-4">
                  <p className="text-xs text-white/60">Personal Baseline</p>
                  <p className="text-2xl font-bold">{user?.averageCycleLength || 28} days</p>
                </div>
                <div className="bg-white/10 rounded-xl p-4">
                  <p className="text-xs text-white/60">Deviation</p>
                  <p className="text-2xl font-bold text-amber">
                    {deviation >= 0 ? `+${deviation}` : deviation} days
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Insights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
          {insights.slice(1).map((insight) => {
            const Icon = iconMap[insight.icon || ''] || Info;
            return (
              <div key={insight.id} className="bg-white rounded-2xl border border-lilac/30 p-6 hover:shadow-lg hover:shadow-plum/5 transition-all">
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    insight.severity === 'warning' ? 'bg-amber/10' : 'bg-lavender/20'
                  }`}>
                    <Icon className={`w-5 h-5 ${insight.severity === 'warning' ? 'text-amber-dark' : 'text-lavender-dark'}`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-bold text-charcoal">{insight.title}</h3>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        insight.severity === 'warning' ? 'bg-amber/10 text-amber-dark' : 'bg-lavender/20 text-lavender-dark'
                      }`}>
                        {insight.severity}
                      </span>
                    </div>
                    <p className="text-sm text-charcoal/60 leading-relaxed">{insight.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Risk Indicators */}
        <h3 className="text-xl font-bold text-charcoal mb-4 flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-amber" />
          Health Awareness Indicators
        </h3>
        <div className="space-y-4 mb-6">
          {riskIndicators.map((risk) => (
            <div key={risk.id} className="bg-white rounded-2xl border border-amber/20 p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-amber/10 flex items-center justify-center">
                  <ShieldAlert className="w-5 h-5 text-amber-dark" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-charcoal">{risk.type}</h4>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    risk.level === 'moderate' ? 'bg-amber/20 text-amber-dark' : risk.level === 'high' ? 'bg-red-100 text-red-600' : 'bg-sage/20 text-sage-dark'
                  }`}>
                    {risk.level} awareness
                  </span>
                </div>
              </div>
              <p className="text-sm text-charcoal/60 leading-relaxed mb-3">{risk.explanation}</p>
              <div className="bg-ivory rounded-xl p-3 flex items-start gap-2">
                <Info className="w-4 h-4 text-charcoal/30 shrink-0 mt-0.5" />
                <p className="text-xs text-charcoal/40 italic">{risk.disclaimer}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Predictions */}
        <h3 className="text-xl font-bold text-charcoal mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-lavender" />
          Predictions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {predictions.map((pred) => (
            <div key={pred.id} className="bg-white rounded-2xl border border-lilac/30 p-6">
              <p className="text-sm text-charcoal/50 font-medium mb-1">Next Period Prediction</p>
              <p className="text-2xl font-bold text-charcoal">
                {new Date(pred.predictedDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
              <div className="flex items-center gap-2 mt-3">
                <div className="flex-1 bg-lilac/30 rounded-full h-2">
                  <div className="h-2 rounded-full bg-lavender transition-all" style={{ width: `${pred.confidence}%` }} />
                </div>
                <span className="text-sm font-semibold text-charcoal">{pred.confidence}%</span>
              </div>
              <p className="text-xs text-charcoal/40 mt-3">{pred.basedOn}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
