import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header.jsx';
import Sidebar from './Sidebar.jsx';

export default function AppLayout({ theme, toggleTheme, profile }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50/60 dark:bg-slate-950">
      {/* Top Studio Header & Navigation Tabstrip */}
      <Header
        theme={theme}
        toggleTheme={toggleTheme}
        profile={profile}
        mobileNavOpen={mobileNavOpen}
        setMobileNavOpen={setMobileNavOpen}
      />

      {/* Mobile Drawer */}
      <Sidebar
        sidebarOpen={mobileNavOpen}
        setSidebarOpen={setMobileNavOpen}
      />

      {/* Main Studio Viewport */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>

      {/* Quiet Footer */}
      <footer className="mt-16 border-t border-slate-200/80 bg-white py-6 dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 text-xs text-slate-500 sm:flex-row sm:px-6 lg:px-8 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800 dark:text-slate-200">EligibleMe</span>
            <span>·</span>
            <span>Transparent, deterministic rules-based evaluation</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Client-side execution</span>
            <span>·</span>
            <span>Zero cloud analytics</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
