import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Brain, TrendingUp, Heart, Sparkles, Activity } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F4] overflow-x-hidden">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 w-full z-50 bg-[#FAF8F4]/90 backdrop-blur-lg border-b border-[#EDE4F5]">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#4A245E] to-[#6B3A80] flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-sm">R</span>
            </div>
            <span className="text-xl font-bold text-[#24212A]">RITORA</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-medium text-[#24212A]/70 hover:text-[#4A245E] transition-colors">
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#4A245E] to-[#6B3A80] text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-[#4A245E]/20"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-16 sm:pt-40 sm:pb-24 px-6">
        <div className="max-w-5xl mx-auto text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EDE4F5] text-[#4A245E] text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            AI-Powered Menstrual Health Intelligence
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-[#24212A] tracking-tight leading-[1.15] mb-6">
            Understand Your{' '}
            <span className="bg-gradient-to-r from-[#4A245E] to-[#B89AD9] bg-clip-text text-transparent">Rhythm</span>.
            <br />
            Understand Your{' '}
            <span className="bg-gradient-to-r from-[#9B7BC0] to-[#8FB39A] bg-clip-text text-transparent">Health</span>.
          </h1>

          <p className="text-base sm:text-lg text-[#24212A]/70 max-w-2xl mx-auto mb-10 leading-relaxed">
            RITORA goes beyond simple tracking. Our AI analyzes your cycle patterns, lifestyle factors, and symptoms
            to provide personalized health intelligence — helping you take proactive control of your well-being.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#4A245E] to-[#6B3A80] text-white font-semibold hover:opacity-95 transition-all shadow-lg shadow-[#4A245E]/20"
            >
              Start Your Journey
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-white border border-[#EDE4F5] text-[#24212A] font-semibold hover:border-[#B89AD9] transition-colors shadow-sm"
            >
              Sign In
            </Link>
          </div>

          {/* Hero Visual */}
          <div className="relative w-full max-w-3xl mx-auto">
            <div className="absolute -inset-2 bg-gradient-to-r from-[#4A245E]/10 via-[#B89AD9]/15 to-[#A8C3B0]/15 rounded-3xl blur-xl" />
            <div className="relative bg-white rounded-2xl shadow-xl border border-[#EDE4F5] p-6 sm:p-8">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
                <div className="bg-[#EDE4F5]/40 rounded-xl p-5 border border-[#EDE4F5]">
                  <p className="text-xs font-semibold text-[#4A245E]/70 uppercase tracking-wider">Current Cycle</p>
                  <p className="text-3xl font-extrabold text-[#4A245E] mt-1">Day 35</p>
                  <p className="text-xs font-semibold text-[#D4A54E] mt-1.5">+6 days from average</p>
                </div>
                <div className="bg-[#EDE4F5]/40 rounded-xl p-5 border border-[#EDE4F5]">
                  <p className="text-xs font-semibold text-[#4A245E]/70 uppercase tracking-wider">Pattern Detected</p>
                  <p className="text-lg font-bold text-[#24212A] mt-1">Cycle Extension</p>
                  <p className="text-xs text-[#24212A]/60 mt-1">Stress-correlated deviation</p>
                </div>
                <div className="bg-[#A8C3B0]/20 rounded-xl p-5 border border-[#8FB39A]/30">
                  <p className="text-xs font-semibold text-[#8FB39A] uppercase tracking-wider">Health Insight</p>
                  <p className="text-lg font-bold text-[#24212A] mt-1">Awareness Active</p>
                  <p className="text-xs text-[#24212A]/60 mt-1">2 indicators identified</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 sm:py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#24212A] text-center mb-4">
            Intelligence, Not Just Tracking
          </h2>
          <p className="text-center text-[#24212A]/60 mb-14 max-w-xl mx-auto leading-relaxed">
            RITORA combines cycle data, lifestyle patterns, and symptom trends to deliver insights that matter.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Brain,
                title: 'AI Pattern Detection',
                desc: 'Identifies cycle deviations and correlates them with your lifestyle data to explain why changes happen.',
                bgColor: 'bg-[#4A245E]/10',
                textColor: 'text-[#4A245E]',
              },
              {
                icon: TrendingUp,
                title: 'Lifestyle Correlation',
                desc: 'Tracks sleep, stress, hydration, and exercise — revealing how daily habits shape your menstrual health.',
                bgColor: 'bg-[#B89AD9]/20',
                textColor: 'text-[#9B7BC0]',
              },
              {
                icon: Shield,
                title: 'Health Awareness',
                desc: 'Provides gentle risk awareness indicators backed by your personal data patterns, with appropriate medical disclaimers.',
                bgColor: 'bg-[#A8C3B0]/20',
                textColor: 'text-[#8FB39A]',
              },
              {
                icon: Activity,
                title: 'Cycle Intelligence',
                desc: 'Learns your unique rhythm over time, making predictions more accurate with each logged cycle.',
                bgColor: 'bg-[#E5B96B]/20',
                textColor: 'text-[#D4A54E]',
              },
              {
                icon: Heart,
                title: 'Symptom Insights',
                desc: 'Discovers patterns in your symptoms, showing when they typically occur and what may be contributing factors.',
                bgColor: 'bg-[#4A245E]/10',
                textColor: 'text-[#4A245E]',
              },
              {
                icon: Sparkles,
                title: 'AI Health Assistant',
                desc: 'Chat with our AI assistant to understand your health data, get personalized recommendations, and ask questions.',
                bgColor: 'bg-[#B89AD9]/20',
                textColor: 'text-[#9B7BC0]',
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="p-6 rounded-2xl bg-[#FAF8F4] border border-[#EDE4F5] hover:border-[#B89AD9]/50 hover:shadow-lg transition-all duration-300"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${feature.bgColor} ${feature.textColor}`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-[#24212A] mb-2">{feature.title}</h3>
                <p className="text-sm text-[#24212A]/60 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 sm:py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="bg-gradient-to-r from-[#4A245E] via-[#6B3A80] to-[#B89AD9] rounded-3xl p-8 sm:p-12 shadow-2xl shadow-[#4A245E]/20">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Understand Your Health Better?
            </h2>
            <p className="text-[#EDE4F5] mb-8 max-w-xl mx-auto leading-relaxed">
              Join RITORA and start your personalized health intelligence journey today.
            </p>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-white text-[#4A245E] font-semibold hover:bg-[#FAF8F4] transition-colors shadow-lg"
            >
              Create Free Account
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#EDE4F5] py-8 px-6 bg-[#FAF8F4]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-r from-[#4A245E] to-[#6B3A80] flex items-center justify-center">
              <span className="text-white font-bold text-xs">R</span>
            </div>
            <span className="text-sm font-semibold text-[#24212A]/70">RITORA</span>
          </div>
          <p className="text-xs text-[#24212A]/40 text-center sm:text-right">
            © 2026 RITORA. AI-Powered Menstrual Health Intelligence.
          </p>
        </div>
      </footer>
    </div>
  );
}

