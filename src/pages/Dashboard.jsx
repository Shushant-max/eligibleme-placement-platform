import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell
} from 'recharts';
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  ChevronRight,
  TrendingUp,
  UserCheck,
  Briefcase,
  Target,
  FileText,
  Upload
} from 'lucide-react';
import StatusBadge from '../components/StatusBadge.jsx';
import EmptyState from '../components/EmptyState.jsx';
import ResumeUploaderModal from '../components/ResumeUploaderModal.jsx';
import { assessEligibility, STATUS } from '../utils/matchingEngine.js';

export default function Dashboard({ profile, setProfile, opportunities = [], history = [] }) {
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);

  // 1. Calculate actual profile completion percentage
  const profileCompletion = useMemo(() => {
    if (!profile) return 0;
    let score = 0;
    if (profile.fullName?.trim()) score += 15;
    if (profile.email?.trim()) score += 10;
    if (profile.degree?.trim()) score += 20;
    if (profile.specialization?.trim()) score += 10;
    if (profile.institution?.trim()) score += 10;
    if (profile.academicScore !== undefined && profile.academicScore !== null && profile.academicScore !== '') score += 15;
    if (Array.isArray(profile.skills) && profile.skills.length > 0) score += 20;
    return Math.min(100, score);
  }, [profile]);

  const hasConfiguredProfile = profileCompletion > 20;

  // 2. Evaluate all catalogue opportunities against current profile
  const catalogueEvaluations = useMemo(() => {
    return (opportunities || []).map(opp => ({
      opp,
      assessment: assessEligibility(profile, opp)
    }));
  }, [profile, opportunities]);

  const eligibleCount = catalogueEvaluations.filter(e => e.assessment.status === STATUS.ELIGIBLE).length;
  const partialCount = catalogueEvaluations.filter(e => e.assessment.status === STATUS.PARTIALLY_MATCHED).length;
  const notEligibleCount = catalogueEvaluations.filter(e => e.assessment.status === STATUS.NOT_ELIGIBLE).length;
  const unmetCount = partialCount + notEligibleCount;
  const incompleteCount = catalogueEvaluations.filter(e => e.assessment.status === STATUS.INCOMPLETE).length;

  const averageSkillCoverage = useMemo(() => {
    if (catalogueEvaluations.length === 0) return 0;
    const total = catalogueEvaluations.reduce((sum, item) => sum + item.assessment.skillCoverage, 0);
    return Math.round(total / catalogueEvaluations.length);
  }, [catalogueEvaluations]);

  // Chart data for outcome distribution
  const chartData = useMemo(() => {
    return [
      { name: 'Eligible', count: eligibleCount, color: '#10b981' },
      { name: 'Partially Matched', count: partialCount, color: '#f59e0b' },
      { name: 'Not Eligible', count: notEligibleCount, color: '#f43f5e' },
      { name: 'Incomplete', count: incompleteCount, color: '#94a3b8' }
    ];
  }, [eligibleCount, partialCount, notEligibleCount, incompleteCount]);

  // Priority next steps
  const nextActions = useMemo(() => {
    const actions = [];
    if (profileCompletion < 100) {
      actions.push({
        title: 'Complete candidate credentials',
        desc: `Profile is currently ${profileCompletion}% complete. Specifying academic score and graduation year unlocks cut-off verification.`,
        link: '/profile',
        btnText: 'Update Profile'
      });
    }

    if (eligibleCount > 0) {
      actions.push({
        title: `${eligibleCount} roles meet all mandatory criteria`,
        desc: 'Your profile satisfies all configured degree, cut-off, experience, and skill requirements for these opportunities.',
        link: '/checker',
        btnText: 'Verify Checklist'
      });
    } else if (hasConfiguredProfile) {
      actions.push({
        title: 'Bridge primary skill gaps',
        desc: 'Review high-demand missing skills in the Skill Match tab to qualify for additional roles.',
        link: '/skills',
        btnText: 'View Gap Analysis'
      });
    }

    if (history.length === 0 && hasConfiguredProfile) {
      actions.push({
        title: 'Log formal evaluation snapshot',
        desc: 'Save an immutable verification record to your audit log for review and tracking.',
        link: '/checker',
        btnText: 'Launch Checker'
      });
    }

    return actions.slice(0, 3);
  }, [profileCompletion, eligibleCount, hasConfiguredProfile, history.length]);

  return (
    <div className="space-y-6">
      {/* Onboarding State if Profile is Unset */}
      {!hasConfiguredProfile ? (
        <div className="rounded-lg border border-slate-200/90 bg-white p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Getting Started
              </span>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                Setup candidate credentials to begin evaluation
              </h2>
              <p className="max-w-2xl text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                EligibleMe tests your degree, CGPA, experience, and skills against opportunity cut-offs.
                Enter your details or load a sample benchmark profile to run instant client-side assessments.
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setIsResumeModalOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700"
              >
                <Upload size={13} />
                <span>Upload Resume (Auto-Fill)</span>
              </button>
              <Link
                to="/profile"
                className="rounded-md border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 shadow-2xs hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                Manual Entry
              </Link>
            </div>
          </div>
        </div>
      ) : (
        /* Active Candidate Status Ribbon */
        <div className="flex flex-col justify-between gap-3 rounded-lg border border-slate-200/90 bg-white px-5 py-4 sm:flex-row sm:items-center dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-700 font-bold dark:bg-blue-950 dark:text-blue-300">
              {profile.fullName?.charAt(0) || 'C'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  {profile.fullName}
                </h2>
                <span className="text-xs text-slate-400">·</span>
                <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                  {profile.degree} {profile.specialization ? `(${profile.specialization})` : ''}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Score: {profile.academicScore ? `${profile.academicScore} on ${profile.gradingScale || '10'} scale` : 'Unspecified'} · {profile.skills?.length || 0} skills active
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="text-right">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Profile Readiness</span>
              <p className="font-mono-numbers text-sm font-bold text-slate-800 dark:text-slate-200">{profileCompletion}%</p>
            </div>
            <button
              type="button"
              onClick={() => setIsResumeModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded border border-blue-200 bg-blue-50/80 px-2.5 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-100 dark:border-blue-900 dark:bg-blue-950/60 dark:text-blue-300"
            >
              <Upload size={13} />
              <span>Update via Resume</span>
            </button>
            <Link
              to="/profile"
              className="rounded border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
            >
              Edit Form
            </Link>
          </div>
        </div>
      )}

      {/* Integrated 4-Column Diagnostic Metric Ribbon (Bespoke layout, not disconnected cards) */}
      <div className="grid grid-cols-2 divide-y divide-slate-100 rounded-lg border border-slate-200/90 bg-white shadow-2xs sm:grid-cols-4 sm:divide-y-0 sm:divide-x dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-900">
        <div className="p-5">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Profile Completion
          </span>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="font-mono-numbers text-2xl font-bold text-slate-900 sm:text-3xl dark:text-slate-100">
              {profileCompletion}%
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {profileCompletion === 100 ? 'All key credentials provided' : 'Add missing education fields'}
          </p>
        </div>

        <div className="p-5">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Catalogue Roles
          </span>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="font-mono-numbers text-2xl font-bold text-slate-900 sm:text-3xl dark:text-slate-100">
              {opportunities.length}
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Curated benchmark positions
          </p>
        </div>

        <div className="p-5">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            All Mandatory Met
          </span>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="font-mono-numbers text-2xl font-bold text-emerald-600 sm:text-3xl dark:text-emerald-400">
              {eligibleCount}
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {hasConfiguredProfile ? 'Qualifies for direct application' : 'Requires profile data'}
          </p>
        </div>

        <div className="p-5">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Unmet Requirements
          </span>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="font-mono-numbers text-2xl font-bold text-amber-600 sm:text-3xl dark:text-amber-400">
              {unmetCount}
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {partialCount} partial · {notEligibleCount} unfulfilled
          </p>
        </div>
      </div>

      {/* Analytical Section: Outcome Spectrum + Actionable Recommendations */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Outcome Chart */}
        <div className="rounded-lg border border-slate-200/90 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900 lg:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Catalogue Eligibility Breakdown
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Evaluation distribution across all {opportunities.length} curated opportunities
              </p>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Mean Skill Match</span>
              <p className="font-mono-numbers text-base font-bold text-blue-600 dark:text-blue-400">
                {averageSkillCoverage}%
              </p>
            </div>
          </div>

          <div className="mt-4 h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(value) => [`${value} Opportunities`, 'Count']}
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#0f172a', fontSize: '12px' }}
                />
                <Bar dataKey="count" radius={[3, 3, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-2 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span>Eligible: <strong className="font-mono-numbers">{eligibleCount}</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              <span>Partially Matched: <strong className="font-mono-numbers">{partialCount}</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-rose-500" />
              <span>Not Eligible: <strong className="font-mono-numbers">{notEligibleCount}</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-slate-400" />
              <span>Incomplete: <strong className="font-mono-numbers">{incompleteCount}</strong></span>
            </div>
          </div>
        </div>

        {/* Actionable Next Steps */}
        <div className="rounded-lg border border-slate-200/90 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
          <div className="border-b border-slate-100 pb-3 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Recommended Next Actions
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Prioritized next moves based on your profile
            </p>
          </div>

          <div className="mt-4 space-y-3">
            {nextActions.map((action, i) => (
              <div
                key={i}
                className="rounded-md border border-slate-100 bg-slate-50/70 p-3.5 transition hover:border-slate-200 dark:border-slate-800 dark:bg-slate-800/40"
              >
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  {action.title}
                </h4>
                <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                  {action.desc}
                </p>
                <div className="mt-2">
                  <Link
                    to={action.link}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
                  >
                    <span>{action.btnText}</span>
                    <ChevronRight size={13} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Evaluations Audit Log Table */}
      <div className="rounded-lg border border-slate-200/90 bg-white shadow-2xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-100 p-5 dark:border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Recent Eligibility Assessments
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Immutable assessment audit logs from client history
            </p>
          </div>
          <Link
            to="/history"
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            View Full Audit Log
          </Link>
        </div>

        {history && history.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-100 bg-slate-50/70 text-slate-500 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-400">
                <tr>
                  <th className="px-5 py-3 font-semibold uppercase tracking-wider">Opportunity</th>
                  <th className="px-4 py-3 font-semibold uppercase tracking-wider">Outcome</th>
                  <th className="px-4 py-3 font-semibold uppercase tracking-wider">Skill Match</th>
                  <th className="px-4 py-3 font-semibold uppercase tracking-wider">Req Coverage</th>
                  <th className="px-5 py-3 text-right font-semibold uppercase tracking-wider">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {history.slice(0, 5).map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30">
                    <td className="px-5 py-3.5">
                      <p className="font-semibold text-slate-900 dark:text-slate-100">{item.opportunityTitle}</p>
                      <p className="text-[11px] text-slate-400">{item.organization} · {item.category}</p>
                    </td>
                    <td className="px-4 py-3.5">
                      <StatusBadge status={item.status} size="sm" />
                    </td>
                    <td className="px-4 py-3.5 font-mono-numbers font-bold text-slate-700 dark:text-slate-200">
                      {item.skillCoverage}%
                    </td>
                    <td className="px-4 py-3.5 font-mono-numbers font-bold text-slate-700 dark:text-slate-200">
                      {item.requirementCoverage}%
                    </td>
                    <td className="px-5 py-3.5 text-right font-mono-numbers text-slate-400">
                      {new Date(item.timestamp).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-slate-400">
            No assessment logs found. Check any opportunity to log an assessment.
          </div>
        )}
      </div>

      {/* Resume Auto-Fill Modal */}
      <ResumeUploaderModal
        isOpen={isResumeModalOpen}
        onClose={() => setIsResumeModalOpen(false)}
        onApplyProfile={setProfile}
      />
    </div>
  );
}
