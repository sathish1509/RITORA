import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, CalendarHeart, Moon, Activity, Sparkles } from 'lucide-react';
import { authService } from '../services/authService';

const steps = [
  {
    title: 'Cycle Basics',
    subtitle: 'Help us understand your rhythm',
    icon: CalendarHeart,
  },
  {
    title: 'Your Lifestyle',
    subtitle: "Tell us about your daily habits",
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

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [cycleLength, setCycleLength] = useState(29);
  const [periodDuration, setPeriodDuration] = useState(5);
  const navigate = useNavigate();

  const current = steps[step];
  const isLast = step === steps.length - 1;

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
                  className="w-full px-4 py-3 rounded-xl bg-ivory border border-lilac/50 text-charcoal focus:outline-none focus:ring-2 focus:ring-lavender/50 transition-all"
                />
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-charcoal mb-3">Typical sleep (hours per night)</label>
                <div className="grid grid-cols-4 gap-2">
                  {['<5', '5-6', '7-8', '8+'].map((opt) => (
                    <button
                      key={opt}
                      className="py-3 rounded-xl border border-lilac/50 text-sm font-medium text-charcoal hover:border-plum hover:bg-plum/5 focus:border-plum focus:bg-plum/5 transition-all"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-3">General stress level</label>
                <div className="grid grid-cols-4 gap-2">
                  {['Low', 'Moderate', 'High', 'Very High'].map((opt) => (
                    <button
                      key={opt}
                      className="py-3 rounded-xl border border-lilac/50 text-sm font-medium text-charcoal hover:border-plum hover:bg-plum/5 focus:border-plum focus:bg-plum/5 transition-all"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-3">Exercise frequency</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Rarely', '2-3x/week', 'Daily'].map((opt) => (
                    <button
                      key={opt}
                      className="py-3 rounded-xl border border-lilac/50 text-sm font-medium text-charcoal hover:border-plum hover:bg-plum/5 focus:border-plum focus:bg-plum/5 transition-all"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <p className="text-sm text-charcoal/60 mb-2">Select what you'd like RITORA to focus on:</p>
              {[
                { label: 'Cycle Prediction', desc: 'Accurate period predictions based on your data' },
                { label: 'Pattern Detection', desc: 'Identify irregularities and understand why they happen' },
                { label: 'Lifestyle Insights', desc: 'See how sleep, stress, and exercise affect your cycle' },
                { label: 'Health Awareness', desc: 'Gentle awareness indicators for potential health concerns' },
                { label: 'Symptom Tracking', desc: 'Track and understand your symptom patterns' },
              ].map((goal) => (
                <label
                  key={goal.label}
                  className="flex items-start gap-3 p-4 rounded-xl border border-lilac/40 hover:border-lavender cursor-pointer transition-all"
                >
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-lilac text-plum focus:ring-lavender mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-charcoal">{goal.label}</p>
                    <p className="text-xs text-charcoal/50">{goal.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          )}

          {step === 3 && (
            <div className="text-center py-6">
              <div className="w-20 h-20 rounded-full bg-sage/20 flex items-center justify-center mx-auto mb-6 animate-float">
                <Sparkles className="w-10 h-10 text-sage-dark" />
              </div>
              <h3 className="text-xl font-bold text-charcoal mb-2">Your profile is ready!</h3>
              <p className="text-charcoal/50 text-sm mb-4">
                RITORA will now start learning your unique patterns and providing personalized health intelligence.
              </p>
              <div className="bg-lilac/20 rounded-xl p-4 text-left space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-charcoal/60">Cycle length</span>
                  <span className="font-semibold text-charcoal">{cycleLength} days</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-charcoal/60">Period duration</span>
                  <span className="font-semibold text-charcoal">{periodDuration} days</span>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between mt-8">
            {step > 0 ? (
              <button
                onClick={() => setStep(step - 1)}
                className="flex items-center gap-1 text-sm font-medium text-charcoal/50 hover:text-charcoal transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
            ) : (
              <div />
            )}

            <button
              onClick={async () => {
                if (isLast) {
                  try {
                    await authService.updateProfile({
                      averageCycleLength: Number(cycleLength),
                      averagePeriodDuration: Number(periodDuration),
                    });
                  } catch (err) {
                    console.warn('Profile sync failed during onboarding', err);
                  }
                  navigate('/dashboard');
                } else {
                  setStep(step + 1);
                }
              }}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl gradient-plum text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-plum/20"
            >
              {isLast ? 'Go to Dashboard' : 'Continue'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
