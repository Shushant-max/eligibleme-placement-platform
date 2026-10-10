import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle2,
  XCircle,
  TrendingUp,
  Target,
  ChevronRight
} from 'lucide-react';
import { normalizeSkill } from '../utils/matchingEngine.js';
import EmptyState from '../components/EmptyState.jsx';

export default function SkillMatch({ profile, opportunities }) {
  const profileSkills = useMemo(() => {
    return Array.isArray(profile?.skills) ? profile.skills : [];
  }, [profile]);

  const profileSkillNormSet = useMemo(() => {
    return new Set(profileSkills.map(s => normalizeSkill(s)));
  }, [profileSkills]);

  // Selected opportunity for detailed breakdown, defaults to first opportunity
  const [selectedOppId, setSelectedOppId] = useState(
    opportunities && opportunities.length > 0 ? opportunities[0].id : ''
  );

  const selectedOpp = useMemo(() => {
    return (opportunities || []).find(o => o.id === selectedOppId) || null;
  }, [opportunities, selectedOppId]);

  // Evaluate skill alignment across ALL opportunities
  const opportunitiesAlignment = useMemo(() => {
    return (opportunities || []).map((opp) => {
      const required = Array.isArray(opp.requiredSkills) ? opp.requiredSkills : [];
      const matched = required.filter(s => profileSkillNormSet.has(normalizeSkill(s)));
      const missing = required.filter(s => !profileSkillNormSet.has(normalizeSkill(s)));

      let coverage = 0;
      if (required.length === 0) {
        coverage = 100;
      } else {
        coverage = Math.round((matched.length / required.length) * 100);
      }

      return {
        ...opp,
        matchedSkills: matched,
        missingSkills: missing,
        skillCoverage: coverage
      };
    }).sort((a, b) => b.skillCoverage - a.skillCoverage);
  }, [opportunities, profileSkillNormSet]);

  // Detailed gap breakdown for the selected opportunity
  const currentOpportunityAnalysis = useMemo(() => {
    if (!selectedOpp) return null;
    const required = Array.isArray(selectedOpp.requiredSkills) ? selectedOpp.requiredSkills : [];
    const matched = required.filter(s => profileSkillNormSet.has(normalizeSkill(s)));
    const missing = required.filter(s => !profileSkillNormSet.has(normalizeSkill(s)));

    const oppNormSet = new Set(required.map(s => normalizeSkill(s)));
    const additionalUserSkills = profileSkills.filter(s => !oppNormSet.has(normalizeSkill(s)));

    let coverage = 0;
    if (required.length === 0) {
      coverage = 100;
    } else {
      coverage = Math.round((matched.length / required.length) * 100);
    }

    return {
      matched,
      missing,
      additionalUserSkills,
      coverage,
      totalRequired: required.length
    };
  }, [selectedOpp, profileSkills, profileSkillNormSet]);

  // Aggregate missing skills across all opportunities
  const globalHighDemandSkills = useMemo(() => {
    const frequency = {};
    (opportunities || []).forEach(opp => {
      (opp.requiredSkills || []).forEach(skill => {
        const norm = normalizeSkill(skill);
        if (!profileSkillNormSet.has(norm)) {
          frequency[skill] = (frequency[skill] || 0) + 1;
        }
      });
    });

    return Object.entries(frequency)
      .map(([skill, count]) => ({ skill, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  }, [opportunities, profileSkillNormSet]);

  if (profileSkills.length === 0) {
    return (
      <EmptyState
        icon={Target}
        title="No skills recorded in candidate profile"
        description="Add your technical skills in your profile to analyze skill gaps, calculate coverage percentages, and uncover learning priorities."
        actionLabel="Setup Profile Skills"
        actionTo="/profile"
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div>
        <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Skill Match &amp; Gap Matrix
        </h2>
        <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
          Exact case-normalized comparison between candidate abilities and market requirements.
        </p>
      </div>

      {/* Target Opportunity Selector */}
      <div className="rounded-lg border border-slate-200/90 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <label htmlFor="oppSelect" className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Inspect Opportunity Gap:
          </label>
          <select
            id="oppSelect"
            value={selectedOppId}
            onChange={(e) => setSelectedOppId(e.target.value)}
            className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-800 shadow-2xs focus:border-blue-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 sm:w-80"
          >
            {opportunities.map(o => (
              <option key={o.id} value={o.id}>
                {o.title} ({o.organization})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Selected Opportunity Analysis */}
      {selectedOpp && currentOpportunityAnalysis && (
        <div className="rounded-lg border border-slate-200/90 bg-white p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
            <div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                <span>{selectedOpp.category}</span>
                <span>·</span>
                <span>{selectedOpp.organization}</span>
              </div>
              <h3 className="mt-1 text-base font-bold text-slate-900 dark:text-slate-100">
                {selectedOpp.title}
              </h3>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Skill Match Rate
              </span>
              <p className="font-mono-numbers text-xl font-bold text-slate-900 dark:text-slate-100">
                {currentOpportunityAnalysis.coverage}%
              </p>
            </div>
          </div>

          {/* 3-Column Skill Breakdown */}
          <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-3">
            {/* 1. Matched */}
            <div className="rounded-md border border-slate-100 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-800/40">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                  Matched Skills ({currentOpportunityAnalysis.matched.length})
                </h4>
              </div>
              <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                Requirements directly verified in your candidate profile.
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {currentOpportunityAnalysis.matched.length > 0 ? (
                  currentOpportunityAnalysis.matched.map(s => (
                    <span
                      key={s}
                      className="rounded border border-emerald-200 bg-white px-2 py-0.5 text-xs font-medium text-emerald-800 dark:border-emerald-800 dark:bg-slate-800 dark:text-emerald-300"
                    >
                      {s}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-400">No overlapping skills.</span>
                )}
              </div>
            </div>

            {/* 2. Missing */}
            <div className="rounded-md border border-slate-100 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-800/40">
              <div className="flex items-center gap-1.5">
                <XCircle size={15} className="text-rose-600 shrink-0" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                  Missing Skills ({currentOpportunityAnalysis.missing.length})
                </h4>
              </div>
              <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                Required skills absent from your active profile.
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {currentOpportunityAnalysis.missing.length > 0 ? (
                  currentOpportunityAnalysis.missing.map(s => (
                    <span
                      key={s}
                      className="rounded border border-rose-200 bg-white px-2 py-0.5 text-xs font-medium text-rose-800 dark:border-rose-800 dark:bg-slate-800 dark:text-rose-300"
                    >
                      {s}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-emerald-600 dark:text-emerald-400">All required skills met!</span>
                )}
              </div>
            </div>

            {/* 3. Additional User Skills */}
            <div className="rounded-md border border-slate-100 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-800/40">
              <div className="flex items-center gap-1.5">
                <Target size={15} className="text-blue-600 shrink-0" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                  Additional Profile Strengths ({currentOpportunityAnalysis.additionalUserSkills.length})
                </h4>
              </div>
              <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                Skills in your profile beyond this role's minimum checklist.
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {currentOpportunityAnalysis.additionalUserSkills.length > 0 ? (
                  currentOpportunityAnalysis.additionalUserSkills.map(s => (
                    <span
                      key={s}
                      className="rounded border border-slate-200 bg-white px-2 py-0.5 text-xs font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                    >
                      {s}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-400">None</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Suggested Learning Priorities */}
      <div className="rounded-lg border border-slate-200/90 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-2">
          <TrendingUp size={16} className="text-blue-600" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
            Top High-Impact Learning Priorities
          </h3>
        </div>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Acquiring these missing skills unlocks the greatest number of opportunities across the catalogue:
        </p>

        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {globalHighDemandSkills.map((item, idx) => (
            <div
              key={item.skill}
              className="flex items-center justify-between rounded-md border border-slate-100 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-slate-800/40"
            >
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  {idx + 1}. {item.skill}
                </span>
                <p className="text-[11px] text-slate-400">
                  Required by {item.count} opportunity{item.count > 1 ? 'ies' : ''}
                </p>
              </div>
              <span className="font-mono-numbers text-[11px] font-semibold text-blue-700 dark:text-blue-300">
                +{item.count} Roles
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Ranked Catalogue Opportunities Table */}
      <div className="rounded-lg border border-slate-200/90 bg-white shadow-2xs dark:border-slate-800 dark:bg-slate-900">
        <div className="border-b border-slate-100 p-4 dark:border-slate-800">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
            Catalogue Opportunities Ranked by Skill Coverage
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-100 bg-slate-50/70 text-slate-500 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-400">
              <tr>
                <th className="px-5 py-3 font-semibold uppercase tracking-wider">Opportunity</th>
                <th className="px-4 py-3 font-semibold uppercase tracking-wider">Category</th>
                <th className="px-4 py-3 font-semibold uppercase tracking-wider">Skill Match</th>
                <th className="px-4 py-3 font-semibold uppercase tracking-wider">Matched / Total</th>
                <th className="px-5 py-3 text-right font-semibold uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {opportunitiesAlignment.map((opp) => (
                <tr key={opp.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30">
                  <td className="px-5 py-3.5">
                    <p className="font-semibold text-slate-900 dark:text-slate-100">{opp.title}</p>
                    <p className="text-[11px] text-slate-400">{opp.organization}</p>
                  </td>
                  <td className="px-4 py-3.5 text-slate-600 dark:text-slate-300">
                    {opp.category}
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                        <div
                          className={`h-full ${
                            opp.skillCoverage === 100
                              ? 'bg-emerald-500'
                              : opp.skillCoverage >= 50
                              ? 'bg-amber-500'
                              : 'bg-rose-500'
                          }`}
                          style={{ width: `${opp.skillCoverage}%` }}
                        />
                      </div>
                      <span className="font-mono-numbers font-bold text-slate-700 dark:text-slate-200">
                        {opp.skillCoverage}%
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 font-mono-numbers text-slate-500 dark:text-slate-400">
                    {opp.matchedSkills.length} / {opp.requiredSkills?.length || 0}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <Link
                      to={`/checker?oppId=${opp.id}`}
                      className="inline-flex items-center gap-1 font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
                    >
                      Check All Criteria
                      <ChevronRight size={13} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
