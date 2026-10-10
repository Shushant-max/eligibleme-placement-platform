import React from 'react';

/**
 * StatCard Component
 * High-density analytical card with tabular numerals and subtle hairline borders.
 */
export default function StatCard({
  title,
  value,
  subtext,
  icon: Icon,
  variant = 'default',
  className = ''
}) {
  const valueColor = {
    default: 'text-slate-900 dark:text-slate-100',
    primary: 'text-blue-700 dark:text-blue-300',
    success: 'text-emerald-700 dark:text-emerald-300',
    warning: 'text-amber-800 dark:text-amber-300',
    danger: 'text-rose-700 dark:text-rose-300'
  }[variant] || 'text-slate-900 dark:text-slate-100';

  return (
    <div
      className={`rounded-lg border border-slate-200/90 bg-white p-5 shadow-2xs transition hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 ${className}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {title}
        </span>
        {Icon && (
          <span className="text-slate-400 dark:text-slate-500">
            <Icon size={16} />
          </span>
        )}
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className={`font-mono-numbers text-2xl font-bold tracking-tight sm:text-3xl ${valueColor}`}>
          {value}
        </span>
      </div>

      {subtext && (
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          {subtext}
        </p>
      )}
    </div>
  );
}
