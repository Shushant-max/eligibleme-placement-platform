import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Sun,
  Moon,
  User,
  CheckCircle2,
  AlertCircle,
  Menu,
  X,
  Compass,
  LayoutDashboard,
  UserCheck,
  CheckSquare,
  Sparkles,
  History,
  Settings as SettingsIcon
} from 'lucide-react';

export const NAV_LINKS = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/profile', label: 'My Profile', icon: UserCheck },
  { to: '/opportunities', label: 'Opportunities', icon: Compass },
  { to: '/checker', label: 'Eligibility Checker', icon: CheckSquare },
  { to: '/skills', label: 'Skill Match', icon: Sparkles },
  { to: '/history', label: 'History', icon: History },
  { to: '/settings', label: 'Settings', icon: SettingsIcon },
];

export default function Header({
  theme,
  toggleTheme,
  profile,
  mobileNavOpen,
  setMobileNavOpen
}) {
  const hasCompleteProfile = Boolean(profile?.fullName && profile?.degree && profile?.skills?.length > 0);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/90 bg-white/95 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95">
      {/* Tier 1: Brand Wordmark, Candidate Context, Utilities */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Brand Lockup */}
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2.5 transition hover:opacity-90">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white shadow-xs">
              <ShieldCheck size={20} />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100">
                Eligible<span className="text-blue-600 dark:text-blue-400">Me</span>
              </span>
              <span className="hidden text-[11px] font-medium text-slate-400 sm:block">
                Transparent Eligibility Verification Engine
              </span>
            </div>
          </Link>
        </div>

        {/* Right Action & Context Area */}
        <div className="flex items-center gap-3">
          {/* Light/Dark Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-600 transition hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            aria-label="Toggle display theme"
          >
            {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          {/* Candidate Profile Quick Indicator */}
          <Link
            to="/profile"
            className="flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50/80 px-2.5 py-1.5 text-xs text-slate-700 transition hover:border-slate-300 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800/80 dark:text-slate-300"
          >
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
              <User size={12} />
            </div>
            <span className="max-w-[120px] truncate font-medium sm:max-w-[180px]">
              {profile?.fullName || 'Setup Candidate'}
            </span>
            {hasCompleteProfile ? (
              <CheckCircle2 size={13} className="text-emerald-600 shrink-0" title="Profile configured" />
            ) : (
              <AlertCircle size={13} className="text-amber-500 shrink-0" title="Profile incomplete" />
            )}
          </Link>

          {/* Mobile hamburger menu toggle */}
          <button
            type="button"
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-600 md:hidden dark:border-slate-800 dark:text-slate-300"
            aria-label="Toggle navigation menu"
          >
            {mobileNavOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>

      {/* Tier 2: Horizontal Segmented Tabstrip (Desktop) */}
      <div className="hidden border-t border-slate-100 md:block dark:border-slate-800/80">
        <div className="mx-auto flex max-w-7xl items-center gap-1 px-4 sm:px-6 lg:px-8">
          {NAV_LINKS.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-2 border-b-2 px-3.5 py-2.5 text-xs font-medium transition-all ${
                    isActive
                      ? 'border-blue-600 text-blue-700 font-semibold dark:border-blue-400 dark:text-blue-300'
                      : 'border-transparent text-slate-600 hover:border-slate-300 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                  }`
                }
              >
                <Icon size={14} className="shrink-0" />
                <span>{link.label}</span>
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* Mobile Drawer Navigation (Opened on small screens) */}
      {mobileNavOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-3 shadow-lg md:hidden dark:border-slate-800 dark:bg-slate-900">
          <nav className="space-y-1">
            {NAV_LINKS.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/'}
                  onClick={() => setMobileNavOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 rounded-md px-3 py-2 text-xs font-medium ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 font-semibold dark:bg-blue-950/60 dark:text-blue-300'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800'
                    }`
                  }
                >
                  <Icon size={15} />
                  <span>{link.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
