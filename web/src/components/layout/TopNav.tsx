import { Bell, Search } from 'lucide-react';
import { mockUser } from '../../data/mockData';

interface TopNavProps {
  title: string;
  subtitle?: string;
}

export default function TopNav({ title, subtitle }: TopNavProps) {
  return (
    <header className="sticky top-0 z-30 bg-ivory/80 backdrop-blur-lg border-b border-lilac/40">
      <div className="flex items-center justify-between px-8 py-4">
        {/* Page Title */}
        <div>
          <h1 className="text-2xl font-bold text-charcoal">{title}</h1>
          {subtitle && <p className="text-sm text-charcoal/50 mt-0.5">{subtitle}</p>}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal/30" />
            <input
              type="text"
              placeholder="Search..."
              className="w-64 pl-10 pr-4 py-2 rounded-xl bg-white border border-lilac/40 text-sm text-charcoal placeholder:text-charcoal/30 focus:outline-none focus:ring-2 focus:ring-lavender/50 transition-all"
            />
          </div>

          {/* Notifications */}
          <button className="relative p-2.5 rounded-xl bg-white border border-lilac/40 text-charcoal/60 hover:text-plum hover:border-lavender transition-all">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-amber rounded-full border-2 border-white" />
          </button>

          {/* Profile */}
          <div className="flex items-center gap-3 pl-4 border-l border-lilac/40">
            <div className="w-9 h-9 rounded-full gradient-plum flex items-center justify-center">
              <span className="text-white text-sm font-semibold">{mockUser.name[0]}</span>
            </div>
            <div className="hidden lg:block">
              <p className="text-sm font-semibold text-charcoal">{mockUser.name}</p>
              <p className="text-xs text-charcoal/50">{mockUser.email}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
