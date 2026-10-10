import React from 'react';
import { NavLink } from 'react-router-dom';
import { X, ShieldCheck } from 'lucide-react';
import { NAV_LINKS } from './Header.jsx';

/**
 * Sidebar Component
 * Serves as the mobile slide-out navigation drawer while keeping desktop
 * wide, modern, and uncluttered.
 */
export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
  if (!sidebarOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex md:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="relative flex w-64 max-w-xs flex-1 flex-col bg-white p-4 shadow-xl dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-600 text-white">
              <ShieldCheck size={16} />
            </div>
            <span className="font-bold text-slate-900 dark:text-slate-100">
              Eligible<span className="text-blue-600">Me</span>
            </span>
          </div>

          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="rounded p-1 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="mt-4 flex-1 space-y-1">
          {NAV_LINKS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 rounded-md px-3 py-2 text-xs font-medium ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 font-semibold dark:bg-blue-950/60 dark:text-blue-300'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800'
                  }`
                }
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
