import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, CalendarHeart, Moon, Activity, Sparkles, Check, CheckCircle2 } from 'lucide-react';
import { authService } from '../services/authService';

const steps = [
  {
    title: 'Cycle Basics',
    subtitle: 'Help us understand your rhythm',
    icon: CalendarHeart,
  },
  {
    title: 'Your Lifestyle',
    subtitle: 'Tell us about your daily habits',
    icon: Moon,
  },
  {
    title: 'Health Goals',
    subtitle: 'What matters most to you?',
    icon: Activity,
  },
  {
    title: 'All Set!',
    subtitle: 'Your RITORA profile is ready',
    icon: Sparkles,
  },
];

const sleepOptions = ['<5', '5-6', '7-8', '8+'];
const stressOptions = ['Low', 'Moderate', 'High', 'Very High'];
const exerciseOptions = ['Rarely', '2-3x/week', 'Daily'];

const goalOptions = [
  { label: 'Cycle Prediction', desc: 'Accurate period predictions based on your data' },
  { label: 'Pattern Detection', desc: 'Identify irregularities and understand why they happen' },
  { label: 'Lifestyle Insights', desc: 'See how sleep, stress, and exercise affect your cycle' },
  { label: 'Health Awareness', desc: 'Gentle awareness indicators for potential health concerns' },
  { label: 'Symptom Tracking', desc: 'Track and understand your symptom patterns' },
];

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [cycleLength, setCycleLength] = useState(29);
  const [periodDuration, setPeriodDuration] = useState(5);
  const [lastPeriodStart, setLastPeriodStart] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 14);
    return d.toISOString().split('T')[0];
  });

  // Step 1: Lifestyle Habits State
  const [sleep, setSleep] = useState('7-8');
  const [stress, setStress] = useState('Moderate');
  const [exercise, setExercise] = useState('2-3x/week');

  // Step 2: Health Goals State
  const [goals, setGoals] = useState<string[]>([
    'Cycle Prediction',
    'Pattern Detection',
    'Lifestyle Insights',
    'Health Awareness',
    'Symptom Tracking',
  ]);

  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const current = steps[step];
  const isLast = step === steps.length - 1;

  const toggleGoal = (label: string) => {
    setGoals((prev) =>
      prev.includes(label) ? prev.filter((g) => g !== label) : [...prev, label]
    );
  };

  const handleFinish = async () => {
    setSubmitting(true);
    try {
      await authService.submitOnboarding({
        averageCycleLength: Number(cycleLength),
        averagePeriodDuration: Number(periodDuration),
        lastPeriodStart,
        sleep,
        stress,
        exercise,
        goals,
      });
    } catch (err) {
      console.warn('Onboarding sync failed, attempting profile fallback', err);
      try {
        await authService.updateProfile({
          averageCycleLength: Number(cycleLength),
          averagePeriodDuration: Number(periodDuration),
          lastPeriodStart,
          sleep,
          stress,
          exercise,
        });
      } catch (e) {
        console.error('Profile fallback failed', e);
      }
    } finally {
      setSubmitting(false);
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-ivory flex items-center justify-center p-6">
      <div className="w-full max-w-lg animate-fade-in">
        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                i <= step ? 'bg-plum' : 'bg-lilac/50'
              }`}
            />
          ))}
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-lilac/30 shadow-xl shadow-plum/5 p-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-xl bg-plum/10 flex items-center justify-center">
              <current.icon className="w-6 h-6 text-plum" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-charcoal">{current.title}</h2>
              <p className="text-sm text-charcoal/50">{current.subtitle}</p>
            </div>
          </div>

          {/* Content */}
          {step === 0 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-charcoal mb-3">
                  Average cycle length: <span className="text-plum font-bold">{cycleLength} days</span>
                </label>
                <input
                  type="range"
                  min={20}
                  max={45}
                  value={cycleLength}
                  onChange={(e) => setCycleLength(Number(e.target.value))}
                  className="w-full h-2 bg-lilac/30 rounded-lg appearance-none cursor-pointer accent-plum"
                />
                <div className="flex justify-between text-xs text-charcoal/30 mt-1">
                  <span>20 days</span>
                  <span>45 days</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-3">
                  Average period duration: <span className="text-plum font-bold">{periodDuration} days</span>
                </label>
                <input
                  type="range"
                  min={2}
                  max={10}
                  value={periodDuration}
                  onChange={(e) => setPeriodDuration(Number(e.target.value))}
                  className="w-full h-2 bg-lilac/30 rounded-lg appearance-none cursor-pointer accent-plum"
                />
                <div className="flex justify-between text-xs text-charcoal/30 mt-1">
                  <span>2 days</span>
                  <span>10 days</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-3">When did your last period start?</label>
                <input
                  type="date"
                  value={lastPeriodStart}
                  onChange={(e) => setLastPeriodStart(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-ivory border border-lilac/50 text-charcoal focus:outline-none focus:ring-2 focus:ring-lavender/50 transition-all cursor-pointer font-medium"
                />
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-6">
              {/* Sleep Hours Question */}
              <div>
                <label className="block text-sm font-medium text-charcoal mb-3 flex items-center justify-between">
                  <span>Typical sleep (hours per night)</span>
                  <span className="text-xs font-bold text-plum bg-plum/10 px-2 py-0.5 rounded-md">
                    Selected: {sleep} hrs
                  </span>
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {sleepOptions.map((opt) => {
                    const isSelected = sleep === opt;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setSleep(opt)}
                        className={`py-3 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer text-center ${
                          isSelected
                            ? 'bg-plum text-white shadow-md shadow-plum/20 ring-2 ring-plum/30 scale-[1.02]'
                            : 'border border-lilac/50 bg-white text-charcoal/80 hover:border-plum/50 hover:bg-plum/5'
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Stress Level Question */}
              <div>
                <label className="block text-sm font-medium text-charcoal mb-3 flex items-center justify-between">
                  <span>General stress level</span>
                  <span className="text-xs font-bold text-plum bg-plum/10 px-2 py-0.5 rounded-md">
                    Selected: {stress}
                  </span>
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {stressOptions.map((opt) => {
                    const isSelected = stress === opt;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setStress(opt)}
                        className={`py-3 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer text-center ${
                          isSelected
                            ? 'bg-plum text-white shadow-md shadow-plum/20 ring-2 ring-plum/30 scale-[1.02]'
                            : 'border border-lilac/50 bg-white text-charcoal/80 hover:border-plum/50 hover:bg-plum/5'
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Exercise Frequency Question */}
              <div>
                <label className="block text-sm font-medium text-charcoal mb-3 flex items-center justify-between">
                  <span>Exercise frequency</span>
                  <span className="text-xs font-bold text-plum bg-plum/10 px-2 py-0.5 rounded-md">
                    Selected: {exercise}
                  </span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {exerciseOptions.map((opt) => {
                    const isSelected = exercise === opt;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setExercise(opt)}
                        className={`py-3 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer text-center ${
                          isSelected
                            ? 'bg-plum text-white shadow-md shadow-plum/20 ring-2 ring-plum/30 scale-[1.02]'
                            : 'border border-lilac/50 bg-white text-charcoal/80 hover:border-plum/50 hover:bg-plum/5'
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <p className="text-sm text-charcoal/60 mb-2">Select what you'd like RITORA to focus on:</p>
              {goalOptions.map((goal) => {
                const isChecked = goals.includes(goal.label);
                return (
                  <label
                    key={goal.label}
                    onClick={() => toggleGoal(goal.label)}
                    className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                      isChecked
                        ? 'border-plum bg-plum/5 ring-1 ring-plum/20'
                        : 'border-lilac/40 hover:border-lavender bg-white'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors mt-0.5 ${
                        isChecked ? 'bg-plum text-white' : 'border border-lilac bg-white'
                      }`}
                    >
                      {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-charcoal">{goal.label}</p>
                      <p className="text-xs text-charcoal/50">{goal.desc}</p>
                    </div>
                  </label>
                );
              })}
            </div>
          )}

          {step === 3 && (
            <div className="text-center py-6">
              <div className="w-20 h-20 rounded-full bg-sage/20 flex items-center justify-center mx-auto mb-6 animate-float">
                <Sparkles className="w-10 h-10 text-sage-dark" />
              </div>
              <h3 className="text-xl font-bold text-charcoal mb-2">Your profile is ready!</h3>
              <p className="text-charcoal/50 text-sm mb-6">
                RITORA will now start learning your unique patterns and providing personalized health intelligence.
              </p>

              <div className="bg-lilac/15 rounded-2xl p-5 text-left space-y-3 border border-lilac/30">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-charcoal/60">Cycle Length</span>
                  <span className="font-bold text-charcoal">{cycleLength} days</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-charcoal/60">Period Duration</span>
                  <span className="font-bold text-charcoal">{periodDuration} days</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-charcoal/60">Last Period Start</span>
                  <span className="font-bold text-charcoal">{lastPeriodStart}</span>
                </div>
                <div className="border-t border-lilac/30 pt-2 flex justify-between items-center text-sm">
                  <span className="text-charcoal/60">Typical Sleep</span>
                  <span className="font-bold text-plum">{sleep} hrs/night</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-charcoal/60">Stress Level</span>
                  <span className="font-bold text-plum">{stress}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-charcoal/60">Exercise Frequency</span>
                  <span className="font-bold text-plum">{exercise}</span>
                </div>
                <div className="border-t border-lilac/30 pt-2 flex justify-between items-center text-sm">
                  <span className="text-charcoal/60">Active Focus Areas</span>
                  <span className="font-semibold text-charcoal flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-plum" />
                    {goals.length} areas configured
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between mt-8">
            {step > 0 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                disabled={submitting}
                className="flex items-center gap-1 text-sm font-medium text-charcoal/50 hover:text-charcoal transition-colors disabled:opacity-50"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
            ) : (
              <div />
            )}

            <button
              type="button"
              disabled={submitting}
              onClick={async () => {
                if (isLast) {
                  await handleFinish();
                } else {
                  setStep(step + 1);
                }
              }}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl gradient-plum text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-plum/20 disabled:opacity-50 cursor-pointer"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Saving Profile...</span>
                </>
              ) : (
                <>
                  <span>{isLast ? 'Go to Dashboard' : 'Continue'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
