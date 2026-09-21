import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarHeart,
  Stethoscope,
  Salad,
  Sparkles,
  Bot,
  FileText,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/cycle', label: 'Cycle', icon: CalendarHeart },
  { to: '/symptoms', label: 'Symptoms', icon: Stethoscope },
  { to: '/lifestyle', label: 'Lifestyle', icon: Salad },
  { to: '/insights', label: 'Insights', icon: Sparkles },
  { to: '/assistant', label: 'AI Assistant', icon: Bot },
  { to: '/reports', label: 'Reports', icon: FileText },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  return (
    <aside
      className={`sticky top-0 h-screen shrink-0 bg-charcoal text-white flex flex-col transition-all duration-300 z-40 ${
        collapsed ? 'w-[72px]' : 'w-[260px]'
      }`}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-6 border-b border-white/10">
        <div className="w-9 h-9 rounded-xl gradient-plum flex items-center justify-center shrink-0">
          <span className="text-white font-bold text-sm">R</span>
        </div>
        {!collapsed && (
          <div className="animate-fade-in">
            <h1 className="text-lg font-bold tracking-wide">RITORA</h1>
            <p className="text-[10px] text-lavender/70 -mt-0.5">Health Intelligence</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? 'bg-plum text-white shadow-lg shadow-plum/30'
                  : 'text-white/60 hover:text-white hover:bg-white/8'
              }`
            }
          >
            <item.icon className="w-5 h-5 shrink-0" />
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="border-t border-white/10 p-3 space-y-1">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
              isActive
                ? 'bg-plum text-white shadow-lg shadow-plum/30'
                : 'text-white/60 hover:text-white hover:bg-white/8'
            }`
          }
        >
          <Settings className="w-5 h-5 shrink-0" />
          {!collapsed && <span>Settings</span>}
        </NavLink>

        <button
          onClick={() => navigate('/login')}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/8 transition-all duration-200 w-full"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-charcoal border border-white/20 flex items-center justify-center text-white/60 hover:text-white transition-colors"
      >
        {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </button>
    </aside>
  );
}
