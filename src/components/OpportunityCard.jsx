import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ArrowUpRight } from 'lucide-react';
import StatusBadge from './StatusBadge.jsx';

/**
 * OpportunityCard Component
 * Follows anti-slop guidelines: no pill sandwich at the top,
 * clean typographic metadata separated by middots,
 * and clear separation between mandatory criteria and description.
 */
export default function OpportunityCard({
  opportunity,
  assessmentResult = null,
  onSelect = null
}) {
  return (
    <div className="flex flex-col justify-between rounded-lg border border-slate-200/90 bg-white p-5 transition hover:border-blue-400/80 hover:shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div>
        {/* Top Header: Title, Org, and Optional Outcome */}
        <div className="flex items-start justify-between gap-3">
          <div>
            {/* Unboxed Metadata Line with typographic separators */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <span className="font-medium text-slate-700 dark:text-slate-300">{opportunity.category}</span>
              <span aria-hidden="true">·</span>
              <span>{opportunity.type}</span>
              <span aria-hidden="true">·</span>
              <span>{opportunity.location}</span>
            </div>

            <h3 className="mt-2 text-base font-bold text-slate-900 dark:text-slate-100">
              {opportunity.title}
            </h3>

            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {opportunity.organization}
            </p>
          </div>

          {assessmentResult && (
            <div className="shrink-0">
              <StatusBadge status={assessmentResult.status} size="sm" />
            </div>
          )}
        </div>

        {/* Concise Description */}
        <p className="mt-3 text-xs leading-relaxed text-slate-600 line-clamp-2 dark:text-slate-300">
          {opportunity.description}
        </p>

        {/* Mandatory Requirements Strip */}
        <div className="mt-4 border-t border-slate-100 pt-3 text-xs dark:border-slate-800">
          <div className="grid grid-cols-3 gap-2 text-slate-600 dark:text-slate-300">
            <div>
              <span className="block text-[10px] uppercase font-semibold text-slate-400">Degree</span>
              <span className="font-medium truncate block">{opportunity.requiredDegree || 'Open'}</span>
            </div>
            <div>
              <span className="block text-[10px] uppercase font-semibold text-slate-400">Cut-off</span>
              <span className="font-medium truncate block">
                {opportunity.minScore ? `${opportunity.minScore} (${opportunity.scoreScale || '10'} scale)` : 'None'}
              </span>
            </div>
            <div>
              <span className="block text-[10px] uppercase font-semibold text-slate-400">Experience</span>
              <span className="font-medium truncate block">
                {opportunity.minExperience !== undefined ? `${opportunity.minExperience} yr` : '0 yr'}
              </span>
            </div>
          </div>
        </div>

        {/* Required Skills Chips */}
        {opportunity.requiredSkills && opportunity.requiredSkills.length > 0 && (
          <div className="mt-3">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Mandatory Skills:
            </span>
            <div className="mt-1 flex flex-wrap gap-1">
              {opportunity.requiredSkills.map((skill) => (
                <span
                  key={skill}
                  className="rounded bg-slate-100 px-1.5 py-0.5 text-[11px] font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
        <Link
          to={`/checker?oppId=${opportunity.id}`}
          className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          <span>Run Eligibility Check</span>
          <ChevronRight size={13} />
        </Link>

        {onSelect && (
          <button
            type="button"
            onClick={() => onSelect(opportunity)}
            className="rounded border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
          >
            Inspect Criteria
          </button>
        )}
      </div>
    </div>
  );
}
