import { useState } from 'react';
import TopNav from '../components/layout/TopNav';
import { mockLifestyle } from '../data/mockData';
import { Moon, Brain, Droplets, Dumbbell, Smile, Plus, X } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

export default function LifestylePage() {
  const [showModal, setShowModal] = useState(false);
  const [entries] = useState(mockLifestyle);

  const chartData = entries.slice(0, 14).reverse().map((e) => ({
    date: new Date(e.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    sleep: e.sleep,
    hydration: e.hydration,
    exercise: e.exercise,
  }));

  const stressMap: Record<string, { color: string; bg: string }> = {
    low: { color: 'text-sage-dark', bg: 'bg-sage/20' },
    moderate: { color: 'text-amber-dark', bg: 'bg-amber/10' },
    high: { color: 'text-amber-dark', bg: 'bg-amber/20' },
    'very-high': { color: 'text-red-600', bg: 'bg-red-50' },
  };

  const moodMap: Record<string, string> = {
    great: '😊',
    good: '🙂',
    okay: '😐',
    low: '😔',
    bad: '😢',
  };

  return (
    <div className="min-h-screen">
      <TopNav title="Lifestyle" subtitle="Track daily habits that impact your health" />

      <div className="p-6 lg:p-8 max-w-7xl w-full mx-auto">
        {/* Log Button */}
        <button
          onClick={() => setShowModal(true)}
          className="mb-6 flex items-center gap-2 px-5 py-3 rounded-xl gradient-plum text-white font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-plum/20"
        >
          <Plus className="w-5 h-5" />
          Log Today's Lifestyle
        </button>

        {/* Charts */}
        <div className="bg-white rounded-2xl border border-lilac/30 p-6 mb-6 animate-fade-in">
          <h3 className="text-lg font-bold text-charcoal mb-6">Lifestyle Trends (14 Days)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EDE4F5" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#24212A80' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#24212A80' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #EDE4F5', borderRadius: '12px', fontSize: '13px' }} />
                <Line type="monotone" dataKey="sleep" stroke="#4A245E" strokeWidth={2} dot={{ r: 3 }} name="Sleep (hrs)" />
                <Line type="monotone" dataKey="hydration" stroke="#B89AD9" strokeWidth={2} dot={{ r: 3 }} name="Hydration (L)" />
                <Line type="monotone" dataKey="exercise" stroke="#A8C3B0" strokeWidth={2} dot={{ r: 3 }} name="Exercise (min)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Entries List */}
        <div className="space-y-3 animate-fade-in">
          {entries.map((entry) => {
            const stressStyle = stressMap[entry.stress] || stressMap.moderate;
            return (
              <div key={entry.id} className="bg-white rounded-2xl border border-lilac/30 p-5 hover:shadow-md hover:shadow-plum/5 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold text-charcoal">
                    {new Date(entry.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                  </h4>
                  <span className="text-xl">{moodMap[entry.mood] || '😐'}</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-plum/5">
                    <Moon className="w-4 h-4 text-plum" />
                    <span className="text-sm text-charcoal">{entry.sleep}h sleep</span>
                  </div>
                  <div className={`flex items-center gap-2 p-2.5 rounded-xl ${stressStyle.bg}`}>
                    <Brain className={`w-4 h-4 ${stressStyle.color}`} />
                    <span className="text-sm text-charcoal capitalize">{entry.stress.replace('-', ' ')} stress</span>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-lavender/10">
                    <Droplets className="w-4 h-4 text-lavender-dark" />
                    <span className="text-sm text-charcoal">{entry.hydration}L water</span>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-sage/10">
                    <Dumbbell className="w-4 h-4 text-sage-dark" />
                    <span className="text-sm text-charcoal">{entry.exercise}min exercise</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-lg mx-4 shadow-2xl animate-fade-in">
              <div className="flex items-center justify-between p-6 border-b border-lilac/20">
                <h3 className="text-lg font-bold text-charcoal">Log Lifestyle</h3>
                <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg hover:bg-lilac/20 transition-colors">
                  <X className="w-5 h-5 text-charcoal/40" />
                </button>
              </div>
              <div className="p-6 space-y-5">
                {[
                  { icon: Moon, label: 'Sleep (hours)', type: 'number', placeholder: '7', step: '0.5', min: '0', max: '24' },
                  { icon: Droplets, label: 'Hydration (liters)', type: 'number', placeholder: '2.0', step: '0.1', min: '0', max: '10' },
                  { icon: Dumbbell, label: 'Exercise (minutes)', type: 'number', placeholder: '30', step: '5', min: '0', max: '300' },
                ].map((field) => (
                  <div key={field.label}>
                    <label className="flex items-center gap-2 text-sm font-medium text-charcoal mb-1.5">
                      <field.icon className="w-4 h-4 text-plum" />
                      {field.label}
                    </label>
                    <input
                      type={field.type}
                      placeholder={field.placeholder}
                      step={field.step}
                      min={field.min}
                      max={field.max}
                      className="w-full px-4 py-3 rounded-xl bg-ivory border border-lilac/50 text-charcoal focus:outline-none focus:ring-2 focus:ring-lavender/50 transition-all"
                    />
                  </div>
                ))}

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-charcoal mb-1.5">
                    <Brain className="w-4 h-4 text-plum" />
                    Stress Level
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {['Low', 'Moderate', 'High', 'Very High'].map((s) => (
                      <button key={s} className="py-2.5 rounded-xl border border-lilac/50 text-sm font-medium text-charcoal hover:border-plum hover:bg-plum/5 transition-all">
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-charcoal mb-1.5">
                    <Smile className="w-4 h-4 text-plum" />
                    Mood
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {Object.entries(moodMap).map(([mood, emoji]) => (
                      <button key={mood} className="py-3 rounded-xl border border-lilac/50 text-center hover:border-plum hover:bg-plum/5 transition-all">
                        <span className="text-xl block">{emoji}</span>
                        <span className="text-[10px] text-charcoal/50 capitalize">{mood}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setShowModal(false)}
                  className="w-full py-3 rounded-xl gradient-plum text-white font-semibold hover:opacity-90 transition-opacity"
                >
                  Save Entry
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
