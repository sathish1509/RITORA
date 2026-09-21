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
  ArrowUpRight,
  Activity,
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
import {
  mockUser,
  currentCycleDay,
  mockInsights,
  mockRiskIndicators,
  mockSymptoms,
  mockLifestyle,
  mockPredictions,
  cycleTrendData,
  lifestyleChartData,
} from '../data/mockData';

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function DashboardPage() {
  const prediction = mockPredictions[0];
  const mainInsight = mockInsights[0];
  const recentSymptoms = mockSymptoms.slice(0, 5);
  const todayLifestyle = mockLifestyle[0];

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

  return (
    <div className="min-h-screen">
      <TopNav title={`${getGreeting()}, ${mockUser.name}`} subtitle="Here's your health overview for today" />

      <div className="p-8 stagger-children">
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
              Day {currentCycleDay}
            </p>
            <p className="text-xs text-amber font-semibold mt-1">
              +6 days from average
            </p>
          </div>

          {/* Next Period */}
          <div className="bg-white rounded-2xl border border-lilac/30 p-5 hover:shadow-lg hover:shadow-plum/5 transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-lavender/20 flex items-center justify-center">
                <CalendarClock className="w-5 h-5 text-lavender-dark" />
              </div>
              <span className="text-xs font-semibold text-lavender-dark bg-lavender/20 px-2.5 py-1 rounded-full">{prediction.confidence}% conf.</span>
            </div>
            <p className="text-sm text-charcoal/50 font-medium">Next Period</p>
            <p className="text-3xl font-bold text-charcoal mt-0.5">
              ~{Math.ceil((new Date(prediction.predictedDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days
            </p>
            <p className="text-xs text-charcoal/40 mt-1">
              {new Date(prediction.predictedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </p>
          </div>

          {/* Personal Average */}
          <div className="bg-white rounded-2xl border border-lilac/30 p-5 hover:shadow-lg hover:shadow-plum/5 transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-sage/20 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-sage-dark" />
              </div>
              <span className="text-xs font-semibold text-sage-dark bg-sage/20 px-2.5 py-1 rounded-full">4 cycles</span>
            </div>
            <p className="text-sm text-charcoal/50 font-medium">Personal Average</p>
            <p className="text-3xl font-bold text-charcoal mt-0.5">{mockUser.averageCycleLength} days</p>
            <p className="text-xs text-charcoal/40 mt-1">Based on tracked cycles</p>
          </div>

          {/* Cycle Status */}
          <div className="bg-gradient-to-br from-amber/10 to-amber/5 rounded-2xl border border-amber/30 p-5 hover:shadow-lg hover:shadow-amber/10 transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-amber/20 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-amber-dark" />
              </div>
              <span className="text-xs font-semibold text-amber-dark bg-amber/20 px-2.5 py-1 rounded-full">Attention</span>
            </div>
            <p className="text-sm text-charcoal/50 font-medium">Cycle Status</p>
            <p className="text-lg font-bold text-charcoal mt-0.5">Deviation Detected</p>
            <p className="text-xs text-amber-dark font-medium mt-1">+6 days — Review insights</p>
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
                <span className="text-xs font-semibold bg-white/20 px-2.5 py-0.5 rounded-full">RITORA Insight</span>
              </div>
              <h3 className="text-xl font-bold mb-2">{mainInsight.title}</h3>
              <p className="text-white/80 text-sm leading-relaxed">{mainInsight.description}</p>

              <div className="grid grid-cols-3 gap-4 mt-5">
                <div className="bg-white/10 rounded-xl p-3">
                  <p className="text-xs text-white/60">Current Cycle</p>
                  <p className="text-lg font-bold">{currentCycleDay} days</p>
                </div>
                <div className="bg-white/10 rounded-xl p-3">
                  <p className="text-xs text-white/60">Personal Avg</p>
                  <p className="text-lg font-bold">{mockUser.averageCycleLength} days</p>
                </div>
                <div className="bg-white/10 rounded-xl p-3">
                  <p className="text-xs text-white/60">Deviation</p>
                  <p className="text-lg font-bold text-amber">+6 days</p>
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
                <AreaChart data={cycleTrendData}>
                  <defs>
                    <linearGradient id="colorLength" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#B89AD9" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#B89AD9" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#EDE4F5" />
                  <XAxis dataKey="cycle" tick={{ fontSize: 12, fill: '#24212A80' }} axisLine={false} tickLine={false} />
                  <YAxis domain={[24, 38]} tick={{ fontSize: 12, fill: '#24212A80' }} axisLine={false} tickLine={false} />
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
                <BarChart data={lifestyleChartData}>
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
              {recentSymptoms.map((s) => (
                <div key={s.id} className="flex items-center justify-between p-3 rounded-xl bg-ivory hover:bg-lilac/20 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-sm">{symptomLabels[s.type] || s.type}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div
                          key={i}
                          className={`w-2 h-2 rounded-full ${i <= s.severity ? 'bg-plum' : 'bg-lilac/40'}`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-charcoal/40">{new Date(s.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Today's Lifestyle */}
          <div className="bg-white rounded-2xl border border-lilac/30 p-6">
            <h3 className="text-lg font-bold text-charcoal mb-4">Today's Lifestyle</h3>
            <div className="space-y-4">
              {[
                { icon: Moon, label: 'Sleep', value: `${todayLifestyle.sleep} hours`, color: 'plum', warn: todayLifestyle.sleep < 7 },
                { icon: Brain, label: 'Stress', value: todayLifestyle.stress.replace('-', ' '), color: 'amber', warn: ['high', 'very-high'].includes(todayLifestyle.stress) },
                { icon: Droplets, label: 'Hydration', value: `${todayLifestyle.hydration}L`, color: 'lavender', warn: todayLifestyle.hydration < 2 },
                { icon: Dumbbell, label: 'Exercise', value: `${todayLifestyle.exercise} min`, color: 'sage', warn: todayLifestyle.exercise < 30 },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between p-3 rounded-xl bg-ivory">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                      item.color === 'plum' ? 'bg-plum/10' : item.color === 'amber' ? 'bg-amber/10' : item.color === 'lavender' ? 'bg-lavender/20' : 'bg-sage/20'
                    }`}>
                      <item.icon className={`w-4 h-4 ${
                        item.color === 'plum' ? 'text-plum' : item.color === 'amber' ? 'text-amber-dark' : item.color === 'lavender' ? 'text-lavender-dark' : 'text-sage-dark'
                      }`} />
                    </div>
                    <span className="text-sm font-medium text-charcoal">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-semibold capitalize ${item.warn ? 'text-amber-dark' : 'text-charcoal'}`}>
                      {item.value}
                    </span>
                    {item.warn && <ArrowUpRight className="w-3.5 h-3.5 text-amber" />}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Health Awareness */}
          <div className="bg-white rounded-2xl border border-lilac/30 p-6">
            <h3 className="text-lg font-bold text-charcoal mb-4">Health Awareness</h3>
            <div className="space-y-4">
              {mockRiskIndicators.map((risk) => (
                <div key={risk.id} className="p-4 rounded-xl bg-amber/5 border border-amber/20">
                  <div className="flex items-center gap-2 mb-2">
                    <ShieldAlert className="w-4 h-4 text-amber-dark" />
                    <span className="text-sm font-semibold text-charcoal">{risk.type}</span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      risk.level === 'moderate' ? 'bg-amber/20 text-amber-dark' : risk.level === 'high' ? 'bg-red-100 text-red-600' : 'bg-sage/20 text-sage-dark'
                    }`}>
                      {risk.level}
                    </span>
                  </div>
                  <p className="text-xs text-charcoal/60 leading-relaxed mb-2">{risk.explanation.slice(0, 120)}...</p>
                  <p className="text-[10px] text-charcoal/40 italic">{risk.disclaimer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
