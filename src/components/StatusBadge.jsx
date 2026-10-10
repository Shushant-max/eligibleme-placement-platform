import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, XCircle } from 'lucide-react';
import { STATUS } from '../utils/matchingEngine.js';

/**
 * StatusBadge Component
 * Refined, un-inflated status indicators with subtle hairline borders
 * and color-blind accessible icons.
 */
export default function StatusBadge({ status, size = 'md', className = '' }) {
  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 gap-1 font-medium',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-medium',
    lg: 'text-xs sm:text-sm px-3 py-1.5 gap-2 font-semibold'
  }[size] || 'text-xs px-2.5 py-1 gap-1.5 font-medium';

  const iconSizes = {
    sm: 12,
    md: 13,
    lg: 15
  }[size] || 13;

  switch (status) {
    case STATUS.ELIGIBLE:
      return (
        <span
          className={`inline-flex items-center rounded border border-emerald-300/80 bg-emerald-50/80 text-emerald-800 dark:border-emerald-800/80 dark:bg-emerald-950/40 dark:text-emerald-300 ${sizeClasses} ${className}`}
        >
          <CheckCircle2 size={iconSizes} className="shrink-0 text-emerald-600 dark:text-emerald-400" />
          <span>Eligible</span>
        </span>
      );

    case STATUS.PARTIALLY_MATCHED:
      return (
        <span
          className={`inline-flex items-center rounded border border-amber-300/80 bg-amber-50/80 text-amber-900 dark:border-amber-800/80 dark:bg-amber-950/40 dark:text-amber-300 ${sizeClasses} ${className}`}
        >
          <AlertTriangle size={iconSizes} className="shrink-0 text-amber-600 dark:text-amber-400" />
          <span>Partially Matched</span>
        </span>
      );

    case STATUS.INCOMPLETE:
      return (
        <span
          className={`inline-flex items-center rounded border border-slate-300 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 ${sizeClasses} ${className}`}
        >
          <AlertCircle size={iconSizes} className="shrink-0 text-slate-500 dark:text-slate-400" />
          <span>Incomplete</span>
        </span>
      );

    case STATUS.NOT_ELIGIBLE:
      return (
        <span
          className={`inline-flex items-center rounded border border-rose-300/80 bg-rose-50/80 text-rose-800 dark:border-rose-800/80 dark:bg-rose-950/40 dark:text-rose-300 ${sizeClasses} ${className}`}
        >
          <XCircle size={iconSizes} className="shrink-0 text-rose-600 dark:text-rose-400" />
          <span>Not Eligible</span>
        </span>
      );

    default:
      return (
        <span
          className={`inline-flex items-center rounded border border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 ${sizeClasses} ${className}`}
        >
          <span>{status}</span>
        </span>
      );
  }
}
