import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-ivory flex">
      {/* Left: Branding */}
      <div className="hidden lg:flex lg:w-1/2 gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        <div className="relative z-10 flex flex-col justify-center items-center w-full p-16">
          <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center mb-8 animate-float">
            <span className="text-4xl font-bold text-white">R</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">RITORA</h1>
          <p className="text-lavender text-lg mb-2">AI-Powered Menstrual Health Intelligence</p>
          <p className="text-white/60 text-sm text-center max-w-sm">
            Understand Your Rhythm. Understand Your Health.
          </p>

          <div className="mt-16 space-y-4 w-full max-w-xs">
            {['Pattern Detection', 'Lifestyle Correlation', 'Health Awareness'].map((feature, i) => (
              <div
                key={feature}
                className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3"
                style={{ animationDelay: `${i * 0.15}s` }}
              >
                <div className="w-2 h-2 rounded-full bg-amber" />
                <span className="text-white/80 text-sm">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
