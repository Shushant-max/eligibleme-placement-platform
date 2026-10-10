import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  HelpCircle,
  BookmarkCheck,
  GraduationCap,
  Award,
  Briefcase,
  Layers,
  ChevronRight
} from 'lucide-react';
import { assessEligibility, STATUS } from '../utils/matchingEngine.js';
import StatusBadge from '../components/StatusBadge.jsx';

export default function EligibilityChecker({
  profile,
  opportunities,
  history,
  setHistory
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialOppId = searchParams.get('oppId');

  const [selectedOppId, setSelectedOppId] = useState(
    initialOppId || (opportunities && opportunities.length > 0 ? opportunities[0].id : '')
  );

  const [hasSavedSnapshot, setHasSavedSnapshot] = useState(false);

  // Sync state if query param changes
  useEffect(() => {
    if (initialOppId && initialOppId !== selectedOppId) {
      setSelectedOppId(initialOppId);
    }
  }, [initialOppId]);

  const selectedOpportunity = useMemo(() => {
    return (opportunities || []).find(o => o.id === selectedOppId) || null;
  }, [opportunities, selectedOppId]);

  // Compute evaluation via pure local matching engine
  const assessment = useMemo(() => {
    if (!selectedOpportunity) return null;
    return assessEligibility(profile, selectedOpportunity);
  }, [profile, selectedOpportunity]);

  // Handle saving assessment to assessment history
  const handleSaveToHistory = () => {
    if (!selectedOpportunity || !assessment) return;

    const newRecord = {
      id: `eval_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
      opportunityId: selectedOpportunity.id,
      opportunityTitle: selectedOpportunity.title,
      organization: selectedOpportunity.organization,
      category: selectedOpportunity.category,
      type: selectedOpportunity.type,
      status: assessment.status,
      skillCoverage: assessment.skillCoverage,
      requirementCoverage: assessment.requirementCoverage,
      matchedSkills: assessment.matchedSkills,
      missingSkills: assessment.missingSkills,
      snapshot: {
        profileName: profile?.fullName || 'Anonymous Candidate',
        profileDegree: profile?.degree || 'Not specified',
        profileScore: profile?.academicScore || 'Not specified',
        profileSkills: profile?.skills || [],
        oppRequiredSkills: selectedOpportunity.requiredSkills || [],
        oppRequiredDegree: selectedOpportunity.requiredDegree || 'None',
        oppMinScore: selectedOpportunity.minScore || 'None'
      }
    };

    setHistory(prev => [newRecord, ...(prev || [])]);
    setHasSavedSnapshot(true);
    setTimeout(() => setHasSavedSnapshot(false), 3000);
  };

  const hasConfiguredProfile = Boolean(
    profile && (profile.fullName || profile.degree || (profile.skills && profile.skills.length > 0))
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Eligibility Checker
          </h2>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            Rule-by-rule candidate verification against opportunity specifications.
          </p>
        </div>

        {/* Opportunity Selector Dropdown */}
        <div className="flex items-center gap-2">
          <label htmlFor="opp-select" className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Target Role:
          </label>
          <select
            id="opp-select"
            value={selectedOppId}
            onChange={(e) => {
              setSelectedOppId(e.target.value);
              setSearchParams({ oppId: e.target.value });
            }}
            className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-800 shadow-2xs focus:border-blue-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 sm:w-72"
          >
            {(opportunities || []).map((opp) => (
              <option key={opp.id} value={opp.id}>
                {opp.title} ({opp.organization})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Profile Incomplete Notification */}
      {!hasConfiguredProfile && (
        <div className="rounded-lg border border-amber-200 bg-amber-50/70 p-4 dark:border-amber-900/60 dark:bg-amber-950/40">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 shrink-0 text-amber-600 dark:text-amber-400" size={17} />
            <div className="space-y-1">
              <h3 className="text-xs font-bold text-amber-900 dark:text-amber-200">
                Candidate Profile Needs Data
              </h3>
              <p className="text-xs text-amber-800 dark:text-amber-300">
                No saved profile credentials detected. Enter your degree and skills to run assessments.
              </p>
              <Link
                to="/profile"
                className="inline-block mt-1 text-xs font-semibold text-amber-900 underline hover:text-amber-950 dark:text-amber-200"
              >
                Configure Candidate Profile →
              </Link>
            </div>
          </div>
        </div>
      )}

      {selectedOpportunity && assessment && (
        <div className="space-y-6">
          {/* Main Assessment Card */}
          <div className="rounded-lg border border-slate-200/90 bg-white p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
            <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
              <div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                  <span className="font-medium text-slate-700 dark:text-slate-300">{selectedOpportunity.category}</span>
                  <span>·</span>
                  <span>{selectedOpportunity.type}</span>
                  <span>·</span>
                  <span>{selectedOpportunity.location}</span>
                </div>
                <h3 className="mt-1.5 text-lg font-bold text-slate-900 dark:text-slate-100">
                  {selectedOpportunity.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {selectedOpportunity.organization}
                </p>
              </div>

              <div className="flex flex-col items-start gap-1 sm:items-end">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Evaluation Verdict
                </span>
                <StatusBadge status={assessment.status} size="lg" />
              </div>
            </div>

            {/* Coverage Indicators */}
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-md border border-slate-100 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-800/40">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    Mandatory Skill Coverage
                  </span>
                  <span className="font-mono-numbers text-sm font-bold text-slate-900 dark:text-slate-100">
                    {assessment.skillCoverage}%
                  </span>
                </div>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                  <div
                    className={`h-full transition-all duration-300 ${
                      assessment.skillCoverage === 100
                        ? 'bg-emerald-500'
                        : assessment.skillCoverage >= 50
                        ? 'bg-amber-500'
                        : 'bg-rose-500'
                    }`}
                    style={{ width: `${assessment.skillCoverage}%` }}
                  />
                </div>
                <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
                  {assessment.matchedSkills.length} of {selectedOpportunity.requiredSkills?.length || 0} skills matched.
                </p>
              </div>

              <div className="rounded-md border border-slate-100 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-800/40">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    Weighted Overall Coverage
                  </span>
                  <span className="font-mono-numbers text-sm font-bold text-slate-900 dark:text-slate-100">
                    {assessment.requirementCoverage}%
                  </span>
                </div>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                  <div
                    className={`h-full transition-all duration-300 ${
                      assessment.requirementCoverage >= 80
                        ? 'bg-emerald-500'
                        : assessment.requirementCoverage >= 50
                        ? 'bg-amber-500'
                        : 'bg-rose-500'
                    }`}
                    style={{ width: `${assessment.requirementCoverage}%` }}
                  />
                </div>
                <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
                  Evaluated across Degree (25%), Cutoff (20%), Experience (15%), Skills (40%).
                </p>
              </div>
            </div>

            {/* Save snapshot action */}
            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400">
                Calculated purely client-side against local profile.
              </span>
              <button
                type="button"
                onClick={handleSaveToHistory}
                disabled={hasSavedSnapshot}
                className="inline-flex items-center gap-1.5 rounded border border-slate-200 bg-slate-50 px-3 py-1.5 font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 disabled:opacity-50"
              >
                <BookmarkCheck size={14} className={hasSavedSnapshot ? 'text-emerald-500' : 'text-slate-400'} />
                <span>{hasSavedSnapshot ? 'Snapshot Saved' : 'Save Snapshot to Audit Log'}</span>
              </button>
            </div>
          </div>

          {/* Side-by-Side Qualification Audit Table */}
          <div className="rounded-lg border border-slate-200/90 bg-white shadow-2xs dark:border-slate-800 dark:bg-slate-900">
            <div className="border-b border-slate-100 p-4 dark:border-slate-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                Direct Criteria Comparison
              </h4>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-100 bg-slate-50/70 text-slate-500 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-400">
                  <tr>
                    <th className="px-4 py-2.5 font-semibold uppercase">Requirement Parameter</th>
                    <th className="px-4 py-2.5 font-semibold uppercase">Opportunity Specification</th>
                    <th className="px-4 py-2.5 font-semibold uppercase">Your Profile Qualification</th>
                    <th className="px-4 py-2.5 text-right font-semibold uppercase">Audit Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {/* Education */}
                  <tr className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30">
                    <td className="px-4 py-3 font-semibold text-slate-900 dark:text-slate-100">
                      Degree Level
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                      {selectedOpportunity.requiredDegree || 'Open to all degrees'}
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                      {profile.degree || <span className="text-slate-400 italic">Not specified</span>}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {assessment.passedRequirements.some(r => r.id === 'req_education') ? (
                        <span className="font-semibold text-emerald-600">Passed</span>
                      ) : assessment.failedRequirements.some(r => r.id === 'req_education') ? (
                        <span className="font-semibold text-rose-600">Failed</span>
                      ) : (
                        <span className="font-semibold text-slate-400">Unknown</span>
                      )}
                    </td>
                  </tr>

                  {/* Cutoff Score */}
                  <tr className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30">
                    <td className="px-4 py-3 font-semibold text-slate-900 dark:text-slate-100">
                      Academic Score / CGPA
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                      {selectedOpportunity.minScore ? `Min ${selectedOpportunity.minScore} (${selectedOpportunity.scoreScale || '10'} scale)` : 'No cutoff'}
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300 font-mono-numbers">
                      {profile.academicScore ? `${profile.academicScore} (${profile.gradingScale || '10'} scale)` : <span className="text-slate-400 italic">Not specified</span>}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {assessment.passedRequirements.some(r => r.id === 'req_score') ? (
                        <span className="font-semibold text-emerald-600">Passed</span>
                      ) : assessment.failedRequirements.some(r => r.id === 'req_score') ? (
                        <span className="font-semibold text-rose-600">Failed</span>
                      ) : (
                        <span className="font-semibold text-slate-400">Unknown</span>
                      )}
                    </td>
                  </tr>

                  {/* Experience */}
                  <tr className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30">
                    <td className="px-4 py-3 font-semibold text-slate-900 dark:text-slate-100">
                      Minimum Experience
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                      {selectedOpportunity.minExperience ? `Min ${selectedOpportunity.minExperience} year(s)` : '0 years (Freshers)'}
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300 font-mono-numbers">
                      {profile.yearsOfExperience !== undefined && profile.yearsOfExperience !== '' ? `${profile.yearsOfExperience} yr(s)` : <span className="text-slate-400 italic">Not specified</span>}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {assessment.passedRequirements.some(r => r.id === 'req_exp') ? (
                        <span className="font-semibold text-emerald-600">Passed</span>
                      ) : assessment.failedRequirements.some(r => r.id === 'req_exp') ? (
                        <span className="font-semibold text-rose-600">Failed</span>
                      ) : (
                        <span className="font-semibold text-slate-400">Open / Met</span>
                      )}
                    </td>
                  </tr>

                  {/* Skills */}
                  <tr className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30">
                    <td className="px-4 py-3 font-semibold text-slate-900 dark:text-slate-100">
                      Mandatory Skills
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                      {selectedOpportunity.requiredSkills?.join(', ') || 'None'}
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                      {assessment.matchedSkills.length}/{selectedOpportunity.requiredSkills?.length || 0} matched
                    </td>
                    <td className="px-4 py-3 text-right">
                      {assessment.missingSkills.length === 0 ? (
                        <span className="font-semibold text-emerald-600">100% Matched</span>
                      ) : (
                        <span className="font-semibold text-amber-600">Missing {assessment.missingSkills.length}</span>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Satisfied, Unmet, and Unverified 3-Column Dossier */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            <div className="rounded-lg border border-slate-200/90 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center gap-1.5 border-b border-slate-100 pb-2.5 dark:border-slate-800">
                <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                  Satisfied ({assessment.passedRequirements.length})
                </h4>
              </div>
              <ul className="mt-3 space-y-2 text-xs">
                {assessment.passedRequirements.map((r, i) => (
                  <li key={i} className="text-slate-700 dark:text-slate-300">
                    <strong className="text-emerald-700 dark:text-emerald-400">{r.category}:</strong> {r.label}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-lg border border-slate-200/90 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center gap-1.5 border-b border-slate-100 pb-2.5 dark:border-slate-800">
                <XCircle size={15} className="text-rose-600 shrink-0" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                  Unmet ({assessment.failedRequirements.length})
                </h4>
              </div>
              <ul className="mt-3 space-y-2 text-xs">
                {assessment.failedRequirements.length > 0 ? (
                  assessment.failedRequirements.map((r, i) => (
                    <li key={i} className="text-slate-700 dark:text-slate-300">
                      <strong className="text-rose-700 dark:text-rose-400">{r.category}:</strong> {r.label}
                    </li>
                  ))
                ) : (
                  <p className="text-slate-400">No failed mandatory requirements.</p>
                )}
              </ul>
            </div>

            <div className="rounded-lg border border-slate-200/90 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center gap-1.5 border-b border-slate-100 pb-2.5 dark:border-slate-800">
                <HelpCircle size={15} className="text-slate-500 shrink-0" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                  Unverified ({assessment.unknownRequirements.length})
                </h4>
              </div>
              <ul className="mt-3 space-y-2 text-xs">
                {assessment.unknownRequirements.length > 0 ? (
                  assessment.unknownRequirements.map((r, i) => (
                    <li key={i} className="text-slate-700 dark:text-slate-300">
                      {typeof r === 'string' ? r : r.label}
                    </li>
                  ))
                ) : (
                  <p className="text-slate-400">All required candidate attributes specified.</p>
                )}
              </ul>
            </div>
          </div>

          {/* Actionable Recommendations */}
          <div className="rounded-lg border border-slate-200/90 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
              Actionable Recommendations
            </h4>
            <div className="mt-3 space-y-2 text-xs text-slate-600 dark:text-slate-300">
              {assessment.recommendations.map((rec, i) => (
                <p key={i} className="flex items-start gap-2">
                  <span className="font-bold text-blue-600">{i + 1}.</span>
                  <span>{rec}</span>
                </p>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
