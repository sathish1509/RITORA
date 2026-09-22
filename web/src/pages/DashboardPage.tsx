import { useState, useEffect } from 'react';
import TopNav from '../components/layout/TopNav';
import {
  CalendarHeart,
  CalendarClock,
  TrendingUp,
  AlertTriangle,
  Droplets,
  Moon,
  Dumbbell,
  Brain,
  ShieldAlert,
  Activity,
  CheckCircle,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import { insightService } from '../services/insightService';
import { authService } from '../services/authService';
import { getStoredUser } from '../services/api';
import type { User, HealthInsight, RiskIndicator, Prediction, Symptom, LifestyleEntry, Cycle } from '../types';

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(getStoredUser());
  const [currentCycle, setCurrentCycle] = useState<Cycle | null>(null);
  const [currentCycleDay, setCurrentCycleDay] = useState<number>(1);
  const [deviationDays, setDeviationDays] = useState<number>(0);
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [insights, setInsights] = useState<HealthInsight[]>([]);
  const [riskIndicators, setRiskIndicators] = useState<RiskIndicator[]>([]);
  const [recentSymptoms, setRecentSymptoms] = useState<Symptom[]>([]);
  const [lifestyleOverview, setLifestyleOverview] = useState<LifestyleEntry[]>([]);
  const [cycleHistory, setCycleHistory] = useState<Cycle[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const data = await insightService.getDashboard();
      if (data) {
        if (data.user) setUser(data.user);
        if (data.currentCycle) setCurrentCycle(data.currentCycle);
        if ((data as any).currentCycleDay) setCurrentCycleDay((data as any).currentCycleDay);
        if ((data as any).deviation !== undefined) setDeviationDays((data as any).deviation);
        if (data.prediction) setPrediction(data.prediction);
        if (data.insights && data.insights.length > 0) setInsights(data.insights);
        if (data.riskIndicators) setRiskIndicators(data.riskIndicators);
        if (data.recentSymptoms) setRecentSymptoms(data.recentSymptoms.slice(0, 5));
        if (data.lifestyleOverview) setLifestyleOverview(data.lifestyleOverview);
        if (data.cycleHistory) setCycleHistory(data.cycleHistory);
      } else {
        const u = await authService.getCurrentUser();
        if (u) setUser(u);
      }
    } catch (err) {
      console.error('Failed to load dashboard data', err);
    }
  };

  const calculatedDay = currentCycleDay || (() => {
    if (!currentCycle) return 1;
    const start = new Date(currentCycle.startDate);
    const now = new Date();
    const diff = Math.floor((now.getTime() - start.getTime()) / 86400000) + 1;
    return Math.max(1, diff);
  })();

  const mainInsight = insights[0] || {
    id: 'default_insight',
    title: 'Cycle Rhythm on Track',
    description: `Your cycle is currently on Day ${calculatedDay} of your ${user?.averageCycleLength || 28}-day baseline rhythm.`,
    severity: 'info' as const,
    category: 'health-awareness' as const,
  };

  const todayLifestyle = lifestyleOverview[0] || {
    id: 'default_lf',
    date: new Date().toISOString().split('T')[0],
    sleep: 7.5,
    stress: 'low' as const,
    hydration: 2.5,
    exercise: 30,
    mood: 'good' as const,
  };

  const symptomLabels: Record<string, string> = {
    cramps: '🔥 Cramps',
    headache: '🤕 Headache',
    bloating: '🎈 Bloating',
    fatigue: '😴 Fatigue',
    'mood-swings': '🎭 Mood Swings',
    'breast-tenderness': '💜 Tenderness',
    acne: '🔵 Acne',
    nausea: '🤢 Nausea',
    'back-pain': '💢 Back Pain',
    insomnia: '🌙 Insomnia',
    anxiety: '😟 Anxiety',
    cravings: '🍫 Cravings',
  };

  const stressColorMap: Record<string, { color: string; bg: string }> = {
    low: { color: 'text-sage-dark', bg: 'bg-sage/20' },
    moderate: { color: 'text-amber-dark', bg: 'bg-amber/10' },
    high: { color: 'text-amber-dark', bg: 'bg-amber/20' },
    'very-high': { color: 'text-red-600', bg: 'bg-red-50' },
  };

  const trendData = cycleHistory.length > 0
    ? cycleHistory.slice().reverse().map((c, i) => ({
        cycle: `Cycle ${i + 1}`,
        length: c.cycleLength || calculatedDay,
        average: user?.averageCycleLength || 28,
      }))
    : [
        { cycle: 'Baseline', length: user?.averageCycleLength || 28, average: user?.averageCycleLength || 28 },
        { cycle: 'Current', length: calculatedDay, average: user?.averageCycleLength || 28 },
      ];

  const lifestyleBarData = lifestyleOverview.length > 0
    ? lifestyleOverview.slice(0, 7).reverse().map((l) => ({
        date: new Date(l.date).toLocaleDateString('en-US', { weekday: 'short' }),
        sleep: l.sleep,
        hydration: l.hydration,
        exercise: Math.round(l.exercise / 10),
      }))
    : [
        { date: 'Today', sleep: 7.5, hydration: 2.5, exercise: 3 },
      ];

  const isDeviation = deviationDays >= 4;

  return (
    <div className="min-h-screen">
      <TopNav
        title={`${getGreeting()}, ${user?.name || 'there'}`}
        subtitle="Here's your personalized health overview for today"
        user={user || undefined}
      />

      <div className="p-6 lg:p-8 max-w-7xl w-full mx-auto stagger-children">
        {/* Stats Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-6">
          {/* Current Cycle */}
          <div className="bg-white rounded-2xl border border-lilac/30 p-5 hover:shadow-lg hover:shadow-plum/5 transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-plum/10 flex items-center justify-center">
                <CalendarHeart className="w-5 h-5 text-plum" />
              </div>
              <span className="text-xs font-semibold text-amber bg-amber/10 px-2.5 py-1 rounded-full">Active</span>
            </div>
            <p className="text-sm text-charcoal/50 font-medium">Current Cycle</p>
            <p className="text-3xl font-bold text-charcoal mt-0.5">
              Day {calculatedDay}
            </p>
            <p className={`text-xs font-semibold mt-1 ${isDeviation ? 'text-amber' : 'text-sage-dark'}`}>
              {isDeviation ? `+${deviationDays} days from average` : 'Within expected rhythm'}
            </p>
          </div>

          {/* Next Period */}
          <div className="bg-white rounded-2xl border border-lilac/30 p-5 hover:shadow-lg hover:shadow-plum/5 transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-lavender/20 flex items-center justify-center">
                <CalendarClock className="w-5 h-5 text-lavender-dark" />
              </div>
              <span className="text-xs font-semibold text-lavender-dark bg-lavender/20 px-2.5 py-1 rounded-full">
                {prediction?.confidence || 85}% conf.
              </span>
            </div>
            <p className="text-sm text-charcoal/50 font-medium">Next Period</p>
            <p className="text-3xl font-bold text-charcoal mt-0.5">
              ~{Math.max(1, Math.ceil((new Date(prediction?.predictedDate || Date.now() + 28 * 86400000).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))} days
            </p>
            <p className="text-xs text-charcoal/40 mt-1">
              {new Date(prediction?.predictedDate || Date.now() + 28 * 86400000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </p>
          </div>

          {/* Personal Average */}
          <div className="bg-white rounded-2xl border border-lilac/30 p-5 hover:shadow-lg hover:shadow-plum/5 transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-sage/20 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-sage-dark" />
              </div>
              <span className="text-xs font-semibold text-sage-dark bg-sage/20 px-2.5 py-1 rounded-full">Baseline</span>
            </div>
            <p className="text-sm text-charcoal/50 font-medium">Personal Average</p>
            <p className="text-3xl font-bold text-charcoal mt-0.5">{user?.averageCycleLength || 28} days</p>
            <p className="text-xs text-charcoal/40 mt-1">Based on tracked cycles</p>
          </div>

          {/* Cycle Status */}
          <div className={`bg-gradient-to-br rounded-2xl border p-5 hover:shadow-lg transition-all duration-300 ${
            isDeviation
              ? 'from-amber/10 to-amber/5 border-amber/30 hover:shadow-amber/10'
              : 'from-sage/10 to-sage/5 border-sage/30 hover:shadow-sage/10'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                isDeviation ? 'bg-amber/20' : 'bg-sage/20'
              }`}>
                {isDeviation ? (
                  <AlertTriangle className="w-5 h-5 text-amber-dark" />
                ) : (
                  <CheckCircle className="w-5 h-5 text-sage-dark" />
                )}
              </div>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                isDeviation ? 'text-amber-dark bg-amber/20' : 'text-sage-dark bg-sage/20'
              }`}>
                {isDeviation ? 'Attention' : 'Regular'}
              </span>
            </div>
            <p className="text-sm text-charcoal/50 font-medium">Cycle Status</p>
            <p className="text-lg font-bold text-charcoal mt-0.5">
              {isDeviation ? 'Deviation Detected' : 'Normal Pattern'}
            </p>
            <p className={`text-xs font-medium mt-1 ${isDeviation ? 'text-amber-dark' : 'text-sage-dark'}`}>
              {isDeviation ? `+${deviationDays} days — Review insights` : 'Within standard baseline'}
            </p>
          </div>
        </div>

        {/* RITORA Insight Card */}
        <div className="bg-gradient-to-r from-plum to-plum-light rounded-2xl p-6 mb-6 text-white shadow-xl shadow-plum/20">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center shrink-0 mt-0.5">
              <Brain className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold bg-white/20 px-2.5 py-0.5 rounded-full">RITORA Intelligence</span>
              </div>
              <h3 className="text-xl font-bold mb-2">{mainInsight.title}</h3>
              <p className="text-white/80 text-sm leading-relaxed">{mainInsight.description}</p>

              <div className="grid grid-cols-3 gap-4 mt-5">
                <div className="bg-white/10 rounded-xl p-3">
                  <p className="text-xs text-white/60">Current Cycle</p>
                  <p className="text-lg font-bold">{calculatedDay} days</p>
                </div>
                <div className="bg-white/10 rounded-xl p-3">
                  <p className="text-xs text-white/60">Personal Avg</p>
                  <p className="text-lg font-bold">{user?.averageCycleLength || 28} days</p>
                </div>
                <div className="bg-white/10 rounded-xl p-3">
                  <p className="text-xs text-white/60">Status</p>
                  <p className={`text-lg font-bold ${isDeviation ? 'text-amber' : 'text-emerald-300'}`}>
                    {isDeviation ? `+${deviationDays}d` : 'On Track'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
          {/* Cycle Trend */}
          <div className="bg-white rounded-2xl border border-lilac/30 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-charcoal">Cycle Trend</h3>
                <p className="text-sm text-charcoal/40">Cycle lengths over time</p>
              </div>
              <Activity className="w-5 h-5 text-lavender" />
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="colorLength" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#B89AD9" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#B89AD9" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#EDE4F5" />
                  <XAxis dataKey="cycle" tick={{ fontSize: 12, fill: '#24212A80' }} axisLine={false} tickLine={false} />
                  <YAxis domain={['auto', 'auto']} tick={{ fontSize: 12, fill: '#24212A80' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #EDE4F5',
                      borderRadius: '12px',
                      fontSize: '13px',
                    }}
                  />
                  <Area type="monotone" dataKey="average" stroke="#A8C3B0" strokeWidth={2} strokeDasharray="6 4" fill="none" name="Average" />
                  <Area type="monotone" dataKey="length" stroke="#4A245E" strokeWidth={2.5} fill="url(#colorLength)" name="Cycle Length" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Lifestyle Overview */}
          <div className="bg-white rounded-2xl border border-lilac/30 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-charcoal">Lifestyle Overview</h3>
                <p className="text-sm text-charcoal/40">Last 7 days</p>
              </div>
              <Dumbbell className="w-5 h-5 text-lavender" />
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={lifestyleBarData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#EDE4F5" />
                  <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#24212A80' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: '#24212A80' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #EDE4F5',
                      borderRadius: '12px',
                      fontSize: '13px',
                    }}
                  />
                  <Bar dataKey="sleep" fill="#4A245E" radius={[4, 4, 0, 0]} name="Sleep (hrs)" />
                  <Bar dataKey="hydration" fill="#B89AD9" radius={[4, 4, 0, 0]} name="Hydration (L)" />
                  <Bar dataKey="exercise" fill="#A8C3B0" radius={[4, 4, 0, 0]} name="Exercise (×10 min)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Recent Symptoms */}
          <div className="bg-white rounded-2xl border border-lilac/30 p-6">
            <h3 className="text-lg font-bold text-charcoal mb-4">Recent Symptoms</h3>
            <div className="space-y-3">
              {recentSymptoms.length > 0 ? (
                recentSymptoms.map((s) => (
                  <div key={s.id} className="flex items-center justify-between p-3 rounded-xl bg-ivory hover:bg-lilac/20 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="text-sm">{symptomLabels[s.type] || s.type}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div
                            key={i}
                            className={`w-3.5 h-1 rounded-full ${
                              i <= s.severity ? 'bg-plum' : 'bg-lilac/30'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-charcoal/30 ml-1">{s.severity}/5</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 rounded-xl bg-lilac/10 text-center text-charcoal/50 text-xs">
                  No symptoms logged yet today.
                </div>
              )}
            </div>
          </div>

          {/* Today's Lifestyle */}
          <div className="bg-white rounded-2xl border border-lilac/30 p-6">
            <h3 className="text-lg font-bold text-charcoal mb-4">Today's Lifestyle</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-ivory">
                <div className="flex items-center gap-2 mb-1">
                  <Moon className="w-4 h-4 text-plum" />
                  <span className="text-xs text-charcoal/50">Sleep</span>
                </div>
                <p className="text-xl font-bold text-charcoal">{todayLifestyle.sleep} hrs</p>
                <span className="text-[10px] text-sage-dark font-medium">Logged</span>
              </div>

              <div className="p-3.5 rounded-xl bg-ivory">
                <div className="flex items-center gap-2 mb-1">
                  <Brain className="w-4 h-4 text-plum" />
                  <span className="text-xs text-charcoal/50">Stress</span>
                </div>
                <p className="text-xl font-bold text-charcoal capitalize">{todayLifestyle.stress.replace('-', ' ')}</p>
                <span className={`text-[10px] font-medium ${stressColorMap[todayLifestyle.stress]?.color || 'text-sage-dark'}`}>
                  Recorded
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-ivory">
                <div className="flex items-center gap-2 mb-1">
                  <Droplets className="w-4 h-4 text-lavender-dark" />
                  <span className="text-xs text-charcoal/50">Hydration</span>
                </div>
                <p className="text-xl font-bold text-charcoal">{todayLifestyle.hydration}L</p>
                <span className="text-[10px] text-sage-dark font-medium">Recorded</span>
              </div>

              <div className="p-3.5 rounded-xl bg-ivory">
                <div className="flex items-center gap-2 mb-1">
                  <Dumbbell className="w-4 h-4 text-sage-dark" />
                  <span className="text-xs text-charcoal/50">Exercise</span>
                </div>
                <p className="text-xl font-bold text-charcoal">{todayLifestyle.exercise} min</p>
                <span className="text-[10px] text-sage-dark font-medium">Active</span>
              </div>
            </div>
          </div>

          {/* Risk Awareness */}
          <div className="bg-white rounded-2xl border border-lilac/30 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-charcoal">Health Awareness</h3>
              <ShieldAlert className="w-5 h-5 text-amber" />
            </div>
            <div className="space-y-3">
              {riskIndicators.length > 0 ? (
                riskIndicators.slice(0, 2).map((risk) => (
                  <div key={risk.id} className="p-3.5 rounded-xl border border-amber/20 bg-amber/5">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-charcoal">{risk.type}</span>
                      <span className="text-[10px] font-semibold text-amber-dark bg-amber/20 px-2 py-0.5 rounded-full capitalize">
                        {risk.level}
                      </span>
                    </div>
                    <p className="text-xs text-charcoal/60 line-clamp-2">{risk.explanation}</p>
                  </div>
                ))
              ) : (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
                  <p className="text-xs font-semibold text-emerald-700">No elevated risk indicators detected</p>
                  <p className="text-[10px] text-emerald-600 mt-0.5">Your indicators are within normal parameters.</p>
                </div>
              )}
              <div className="p-3 rounded-xl bg-lilac/10 text-center">
                <p className="text-[11px] text-charcoal/40 italic">
                  Informational only. Not a medical diagnosis.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
