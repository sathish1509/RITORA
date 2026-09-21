import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', age: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate('/onboarding');
    }, 800);
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <div className="lg:hidden flex items-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-lg gradient-plum flex items-center justify-center">
            <span className="text-white font-bold text-sm">R</span>
          </div>
          <span className="text-xl font-bold text-charcoal">RITORA</span>
        </div>
        <h2 className="text-2xl font-bold text-charcoal">Create your account</h2>
        <p className="text-charcoal/50 mt-1">Start your personalized health journey</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-charcoal mb-1.5">Full Name</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-white border border-lilac/50 text-charcoal placeholder:text-charcoal/30 focus:outline-none focus:ring-2 focus:ring-lavender/50 focus:border-lavender transition-all"
            placeholder="Your name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-charcoal mb-1.5">Age</label>
          <input
            type="number"
            value={form.age}
            onChange={(e) => setForm({ ...form, age: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-white border border-lilac/50 text-charcoal placeholder:text-charcoal/30 focus:outline-none focus:ring-2 focus:ring-lavender/50 focus:border-lavender transition-all"
            placeholder="Your age"
            min={13}
            max={65}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-charcoal mb-1.5">Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-white border border-lilac/50 text-charcoal placeholder:text-charcoal/30 focus:outline-none focus:ring-2 focus:ring-lavender/50 focus:border-lavender transition-all"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-charcoal mb-1.5">Password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-white border border-lilac/50 text-charcoal placeholder:text-charcoal/30 focus:outline-none focus:ring-2 focus:ring-lavender/50 focus:border-lavender transition-all pr-12"
              placeholder="Create a strong password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal/30 hover:text-charcoal/60 transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <input type="checkbox" className="w-4 h-4 rounded border-lilac/50 text-plum focus:ring-lavender mt-0.5" />
          <span className="text-sm text-charcoal/60">
            I agree to the Terms of Service and Privacy Policy
          </span>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded-xl gradient-plum text-white font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-lg shadow-plum/20 disabled:opacity-60"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              Create Account
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <p className="text-center text-sm text-charcoal/50 mt-6">
        Already have an account?{' '}
        <Link to="/login" className="text-plum font-semibold hover:text-plum-dark transition-colors">
          Sign In
        </Link>
      </p>
    </div>
  );
}
