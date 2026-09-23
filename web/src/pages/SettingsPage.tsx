import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TopNav from '../components/layout/TopNav';
import { authService } from '../services/authService';
import type { User } from '../types';
import { User as UserIcon, Server, LogOut, CheckCircle2, AlertCircle } from 'lucide-react';

export default function SettingsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState('');
  const [age, setAge] = useState(26);
  const [cycleLength, setCycleLength] = useState(28);
  const [periodDuration, setPeriodDuration] = useState(5);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [backendStatus, setBackendStatus] = useState<'checking' | 'connected' | 'offline'>('checking');
  const navigate = useNavigate();

  useEffect(() => {
    loadUser();
    checkBackend();
  }, []);

  const loadUser = async () => {
    try {
      const u = await authService.getCurrentUser();
      if (u) {
        setUser(u);
        setName(u.name || '');
        setAge(u.age || 26);
        setCycleLength(u.averageCycleLength || 28);
        setPeriodDuration(u.averagePeriodDuration || 5);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const checkBackend = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/health');
      if (res.ok) {
        setBackendStatus('connected');
      } else {
        setBackendStatus('offline');
      }
    } catch {
      setBackendStatus('offline');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSaved(false);
    try {
      await authService.updateProfile({
        name,
        age: Number(age),
        averageCycleLength: Number(cycleLength),
        averagePeriodDuration: Number(periodDuration),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error('Failed to update profile', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await authService.logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen">
      <TopNav title="Settings" subtitle="Manage your profile, cycle baseline, and system preferences" />

      <div className="p-6 lg:p-8 max-w-4xl w-full mx-auto space-y-8">
        {/* Backend Connectivity Card */}
        <div className="bg-white rounded-3xl border border-lilac/30 p-6 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-plum/10 flex items-center justify-center shrink-0">
              <Server className="w-6 h-6 text-plum" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-charcoal">Health Intelligence Backend</h4>
              <p className="text-xs text-charcoal/50">http://localhost:3001/api</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {backendStatus === 'connected' ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Live API Connected
              </span>
            ) : backendStatus === 'checking' ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber/10 text-amber">
                Checking...
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-600 border border-red-200">
                <AlertCircle className="w-3.5 h-3.5" />
                Offline Mode
              </span>
            )}
          </div>
        </div>

        {/* Profile & Baseline Settings */}
        <div className="bg-white rounded-3xl border border-lilac/30 p-8 shadow-sm">
          <div className="flex items-center gap-3 pb-6 border-b border-lilac/20 mb-6">
            <div className="w-10 h-10 rounded-xl gradient-plum flex items-center justify-center text-white">
              <UserIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-charcoal">Cycle Baseline & Profile</h3>
              <p className="text-xs text-charcoal/50">Used to detect cycle deviations and customize health intelligence</p>
            </div>
          </div>

          {saved && (
            <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-2.5 text-sm text-emerald-700">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>Settings updated successfully!</span>
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal/60 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-lilac/10 border border-lilac/30 text-charcoal text-sm focus:outline-none focus:ring-2 focus:ring-lavender"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal/60 mb-2">
                  Age
                </label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  min={13}
                  max={65}
                  className="w-full px-4 py-3 rounded-2xl bg-lilac/10 border border-lilac/30 text-charcoal text-sm focus:outline-none focus:ring-2 focus:ring-lavender"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal/60 mb-2">
                  Average Cycle Length (Days)
                </label>
                <input
                  type="number"
                  value={cycleLength}
                  onChange={(e) => setCycleLength(Number(e.target.value))}
                  min={20}
                  max={60}
                  className="w-full px-4 py-3 rounded-2xl bg-lilac/10 border border-lilac/30 text-charcoal text-sm focus:outline-none focus:ring-2 focus:ring-lavender"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal/60 mb-2">
                  Average Period Duration (Days)
                </label>
                <input
                  type="number"
                  value={periodDuration}
                  onChange={(e) => setPeriodDuration(Number(e.target.value))}
                  min={1}
                  max={12}
                  className="w-full px-4 py-3 rounded-2xl bg-lilac/10 border border-lilac/30 text-charcoal text-sm focus:outline-none focus:ring-2 focus:ring-lavender"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal/60 mb-2">
                Registered Email
              </label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full px-4 py-3 rounded-2xl bg-lilac/5 border border-lilac/20 text-charcoal/50 text-sm cursor-not-allowed"
              />
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 rounded-2xl gradient-plum text-white font-semibold text-sm hover:opacity-90 transition-opacity shadow-lg shadow-plum/20 disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Baseline'}
              </button>
            </div>
          </form>
        </div>

        {/* Security & Sign Out Card */}
        <div className="bg-white rounded-3xl border border-lilac/30 p-8 flex items-center justify-between shadow-sm">
          <div>
            <h4 className="text-sm font-bold text-charcoal">Account Session</h4>
            <p className="text-xs text-charcoal/50 mt-0.5">Securely sign out of your RITORA session</p>
          </div>

          <button
            onClick={handleLogout}
            className="px-5 py-2.5 rounded-2xl bg-red-50 hover:bg-red-100 text-red-600 font-semibold text-xs flex items-center gap-2 transition-colors border border-red-200"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
