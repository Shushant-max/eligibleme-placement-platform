import React, { useState } from 'react';
import {
  Sun,
  Moon,
  RotateCcw,
  Trash2,
  Database,
  CheckCircle2,
  AlertTriangle,
  Info
} from 'lucide-react';
import { INITIAL_OPPORTUNITIES } from '../data/opportunities.js';
import { DEFAULT_SAMPLE_PROFILE } from './Profile.jsx';

export default function Settings({
  theme,
  setTheme,
  profile,
  setProfile,
  opportunities,
  setOpportunities,
  history,
  setHistory
}) {
  const [statusMessage, setStatusMessage] = useState(null);

  const showNotification = (msg, type = 'success') => {
    setStatusMessage({ msg, type });
    setTimeout(() => setStatusMessage(null), 4000);
  };

  const handleRestoreSampleOpportunities = () => {
    if (window.confirm('Restore default curated opportunity catalogue? This will reset the opportunities list to the original benchmarks.')) {
      setOpportunities(INITIAL_OPPORTUNITIES);
      showNotification('Curated opportunity catalogue restored successfully.');
    }
  };

  const handleClearProfile = () => {
    if (window.confirm('Clear all saved candidate profile data? You will need to re-enter your details to run assessments.')) {
      setProfile({});
      showNotification('Candidate profile cleared.');
    }
  };

  const handleLoadSampleProfile = () => {
    setProfile(DEFAULT_SAMPLE_PROFILE);
    showNotification('Sample candidate profile loaded.');
  };

  const handleClearHistory = () => {
    if (window.confirm('Clear all historical assessment logs? This action cannot be reversed.')) {
      setHistory([]);
      showNotification('Assessment history cleared.');
    }
  };

  const handleClearAllData = () => {
    if (window.confirm('CRITICAL ACTION: Reset ALL application data? This removes your profile, clears all assessment history, and resets opportunities.')) {
      window.localStorage.clear();
      setProfile({});
      setHistory([]);
      setOpportunities(INITIAL_OPPORTUNITIES);
      showNotification('All application data cleared and reset to initial state.', 'warning');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div>
        <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Settings &amp; Platform Controls
        </h2>
        <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
          Manage visual presentation, benchmark data seeding, and local browser persistence.
        </p>
      </div>

      {/* Notification banner */}
      {statusMessage && (
        <div
          className={`flex items-center gap-2 rounded-md p-3.5 text-xs font-medium ${
            statusMessage.type === 'warning'
              ? 'border border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200'
              : 'border border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-200'
          }`}
        >
          {statusMessage.type === 'warning' ? (
            <AlertTriangle size={16} className="shrink-0 text-amber-600" />
          ) : (
            <CheckCircle2 size={16} className="shrink-0 text-emerald-600" />
          )}
          <span>{statusMessage.msg}</span>
        </div>
      )}

      {/* 1. Theme Configuration */}
      <div className="rounded-lg border border-slate-200/90 bg-white p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
          1. Appearance &amp; Display Theme
        </h3>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Select between light (default) and dark mode. Preference is saved in browser localStorage.
        </p>

        <div className="mt-3 flex flex-wrap gap-2.5">
          <button
            type="button"
            onClick={() => setTheme('light')}
            className={`inline-flex items-center gap-2 rounded-md border px-3.5 py-2 text-xs font-semibold shadow-2xs transition ${
              theme === 'light'
                ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold dark:border-blue-500 dark:bg-blue-950/60 dark:text-blue-300'
                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
            }`}
          >
            <Sun size={15} />
            <span>Light Theme (Standard)</span>
          </button>

          <button
            type="button"
            onClick={() => setTheme('dark')}
            className={`inline-flex items-center gap-2 rounded-md border px-3.5 py-2 text-xs font-semibold shadow-2xs transition ${
              theme === 'dark'
                ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold dark:border-blue-500 dark:bg-blue-950/60 dark:text-blue-300'
                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
            }`}
          >
            <Moon size={15} />
            <span>Dark Theme</span>
          </button>
        </div>
      </div>

      {/* 2. Sample Data Controls */}
      <div className="rounded-lg border border-slate-200/90 bg-white p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
          2. Benchmark Data Management
        </h3>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Seed candidate profile or restore benchmark opportunities for placement demonstration.
        </p>

        <div className="mt-3 flex flex-wrap gap-2.5">
          <button
            type="button"
            onClick={handleLoadSampleProfile}
            className="inline-flex items-center gap-1.5 rounded border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-2xs hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            <Database size={14} className="text-blue-500" />
            <span>Load Sample Profile (B.Tech, 8.4 CGPA)</span>
          </button>

          <button
            type="button"
            onClick={handleRestoreSampleOpportunities}
            className="inline-flex items-center gap-1.5 rounded border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-2xs hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            <RotateCcw size={14} className="text-blue-500" />
            <span>Restore Default Opportunities ({INITIAL_OPPORTUNITIES.length} roles)</span>
          </button>
        </div>
      </div>

      {/* 3. Destructive Data Actions */}
      <div className="rounded-lg border border-slate-200/90 bg-white p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
        <h3 className="text-xs font-bold uppercase tracking-wider text-rose-800 dark:text-rose-400">
          3. Local Data Reset
        </h3>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Clear local browser states. Requires user confirmation before execution.
        </p>

        <div className="mt-3 flex flex-wrap gap-2.5">
          <button
            type="button"
            onClick={handleClearProfile}
            className="inline-flex items-center gap-1.5 rounded border border-rose-200 bg-rose-50/70 px-3 py-1.5 text-xs font-medium text-rose-700 hover:bg-rose-100 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300"
          >
            <Trash2 size={13} />
            <span>Clear Profile</span>
          </button>

          <button
            type="button"
            onClick={handleClearHistory}
            className="inline-flex items-center gap-1.5 rounded border border-rose-200 bg-rose-50/70 px-3 py-1.5 text-xs font-medium text-rose-700 hover:bg-rose-100 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300"
          >
            <Trash2 size={13} />
            <span>Clear History</span>
          </button>

          <button
            type="button"
            onClick={handleClearAllData}
            className="inline-flex items-center gap-1.5 rounded bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-rose-700"
          >
            <Trash2 size={13} />
            <span>Reset All Local Application Data</span>
          </button>
        </div>
      </div>

      {/* 4. Architecture Info */}
      <div className="rounded-lg border border-slate-200/90 bg-white p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
        <div className="border-b border-slate-100 pb-3 dark:border-slate-800">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
            About EligibleMe Architecture
          </h3>
        </div>

        <div className="mt-3 grid grid-cols-1 gap-4 text-xs sm:grid-cols-2 text-slate-600 dark:text-slate-300">
          <div>
            <span className="font-semibold text-slate-900 dark:text-slate-100">Release Version:</span>
            <p className="text-slate-500 font-mono-numbers">1.0.0 Production</p>
          </div>

          <div>
            <span className="font-semibold text-slate-900 dark:text-slate-100">Engine Execution:</span>
            <p className="text-slate-500">Pure client-side synchronous evaluation</p>
          </div>

          <div>
            <span className="font-semibold text-slate-900 dark:text-slate-100">Persistence Layer:</span>
            <p className="text-slate-500">W3C LocalStorage Sandbox</p>
          </div>

          <div>
            <span className="font-semibold text-slate-900 dark:text-slate-100">Automated Tests:</span>
            <p className="text-slate-500 font-mono-numbers">13 Passing Vitest Test Suites</p>
          </div>
        </div>
      </div>
    </div>
  );
}
