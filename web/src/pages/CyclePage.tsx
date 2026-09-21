import { useState, useEffect } from 'react';
import TopNav from '../components/layout/TopNav';
import { cycleService } from '../services/cycleService';
import { insightService } from '../services/insightService';
import { authService } from '../services/authService';
import { mockCycles, currentCycleDay as fallbackCycleDay, mockPredictions, mockUser } from '../data/mockData';
import type { Cycle, Prediction, User } from '../types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function CyclePage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [cycles, setCycles] = useState<Cycle[]>(mockCycles);
  const [currentCycle, setCurrentCycle] = useState<Cycle | null>(null);
  const [prediction, setPrediction] = useState<Prediction>(mockPredictions[0]);
  const [user, setUser] = useState<User>(mockUser);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [fetchedCycles, activeCycle, preds, currentUser] = await Promise.all([
        cycleService.getCycles(),
        cycleService.getCurrentCycle(),
        insightService.getPredictions(),
        authService.getCurrentUser(),
      ]);
      if (fetchedCycles.length > 0) setCycles(fetchedCycles);
      if (activeCycle) setCurrentCycle(activeCycle);
      if (preds.length > 0) setPrediction(preds[0]);
      if (currentUser) setUser(currentUser);
    } catch (err) {
      console.error('Failed to load cycle data', err);
    }
  };

  const currentCycleDayNumber = (() => {
    if (!currentCycle) return fallbackCycleDay;
    const start = new Date(currentCycle.startDate);
    const now = new Date();
    const diff = Math.floor((now.getTime() - start.getTime()) / 86400000) + 1;
    return Math.max(1, diff);
  })();

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => setCurrentMonth(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(year, month + 1, 1));

  // Mark cycle days on calendar
  const getCycleDayType = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    for (const cycle of cycles) {
      const start = new Date(cycle.startDate);
      const end = cycle.endDate ? new Date(cycle.endDate) : new Date();
      const check = new Date(dateStr);
      if (check >= start && check <= end) {
        if (cycle.isActive) return 'active';
        return 'past';
      }
    }
    const predDate = new Date(prediction.predictedDate);
    const check = new Date(dateStr);
    if (Math.abs(check.getTime() - predDate.getTime()) < 3 * 86400000) return 'predicted';
    return null;
  };

  const today = new Date();
  const isToday = (day: number) =>
    today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;

  return (
    <div className="min-h-screen">
      <TopNav title="Cycle Tracking" subtitle="Monitor your menstrual cycle patterns and predictions" />

      <div className="p-6 lg:p-8 max-w-7xl w-full mx-auto">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Calendar */}
          <div className="xl:col-span-2 bg-white rounded-2xl border border-lilac/30 p-6 animate-fade-in">
            {/* Month Navigator */}
            <div className="flex items-center justify-between mb-6">
              <button onClick={prevMonth} className="p-2 rounded-xl hover:bg-lilac/20 transition-colors">
                <ChevronLeft className="w-5 h-5 text-charcoal/60" />
              </button>
              <h3 className="text-lg font-bold text-charcoal">
                {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h3>
              <button onClick={nextMonth} className="p-2 rounded-xl hover:bg-lilac/20 transition-colors">
                <ChevronRight className="w-5 h-5 text-charcoal/60" />
              </button>
            </div>

            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-2 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                <div key={d} className="text-center text-xs font-semibold text-charcoal/40 py-2">{d}</div>
              ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const type = getCycleDayType(day);
                const todayMark = isToday(day);
                return (
                  <div
                    key={day}
                    className={`aspect-square rounded-xl flex items-center justify-center text-sm font-medium transition-all cursor-pointer hover:scale-105 ${
                      type === 'active'
                        ? 'bg-plum text-white shadow-md shadow-plum/20'
                        : type === 'past'
                        ? 'bg-lavender/30 text-plum'
                        : type === 'predicted'
                        ? 'bg-amber/15 text-amber-dark border border-amber/30 border-dashed'
                        : todayMark
                        ? 'bg-charcoal text-white'
                        : 'text-charcoal/70 hover:bg-lilac/20'
                    }`}
                  >
                    {day}
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-6 mt-6 pt-4 border-t border-lilac/20">
              {[
                { color: 'bg-plum', label: 'Current period' },
                { color: 'bg-lavender/30', label: 'Past periods' },
                { color: 'bg-amber/15 border border-amber/30 border-dashed', label: 'Predicted' },
                { color: 'bg-charcoal', label: 'Today' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded ${item.color}`} />
                  <span className="text-xs text-charcoal/50">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Side Panel */}
          <div className="space-y-5 animate-fade-in">
            {/* Current Cycle */}
            <div className="bg-gradient-to-br from-plum to-plum-light rounded-2xl p-5 text-white shadow-lg shadow-plum/20">
              <p className="text-sm text-white/70 font-medium">Current Cycle</p>
              <p className="text-4xl font-bold mt-1">Day {currentCycleDayNumber}</p>
              <div className="mt-4 w-full bg-white/20 rounded-full h-2">
                <div className="h-2 rounded-full bg-amber" style={{ width: `${Math.min((currentCycleDayNumber / 40) * 100, 100)}%` }} />
              </div>
              <div className="flex justify-between mt-2 text-xs text-white/50">
                <span>Day 1</span>
                <span>Avg: {user.averageCycleLength}d</span>
                <span>Day {currentCycleDayNumber}</span>
              </div>
            </div>

            {/* Prediction */}
            <div className="bg-white rounded-2xl border border-lilac/30 p-5">
              <p className="text-sm text-charcoal/50 font-medium">Next Period Prediction</p>
              <p className="text-2xl font-bold text-charcoal mt-1">
                {new Date(prediction.predictedDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex-1 bg-lilac/30 rounded-full h-1.5">
                  <div className="h-1.5 rounded-full bg-lavender" style={{ width: `${prediction.confidence}%` }} />
                </div>
                <span className="text-xs text-charcoal/50">{prediction.confidence}%</span>
              </div>
              <p className="text-xs text-charcoal/40 mt-2">{prediction.basedOn}</p>
            </div>

            {/* Previous Cycles */}
            <div className="bg-white rounded-2xl border border-lilac/30 p-5">
              <p className="text-sm font-semibold text-charcoal mb-3">Previous Cycles</p>
              <div className="space-y-2">
                {cycles.filter((c) => !c.isActive).slice(0, 5).map((cycle) => (
                  <div key={cycle.id} className="flex items-center justify-between p-3 rounded-xl bg-ivory">
                    <span className="text-sm text-charcoal/60">
                      {new Date(cycle.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                    <span className="text-sm font-semibold text-charcoal">{cycle.cycleLength || 28} days</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
