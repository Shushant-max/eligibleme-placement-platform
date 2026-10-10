import React, { useState, useMemo } from 'react';
import {
  History as HistoryIcon,
  Trash2,
  Eye,
  X,
  Calendar
} from 'lucide-react';
import StatusBadge from '../components/StatusBadge.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { STATUS } from '../utils/matchingEngine.js';

export default function AssessmentHistory({ history = [], setHistory }) {
  const [selectedOutcomeFilter, setSelectedOutcomeFilter] = useState('ALL');
  const [viewSnapshotRecord, setViewSnapshotRecord] = useState(null);

  // Filter history
  const filteredHistory = useMemo(() => {
    return (history || []).filter(item => {
      if (selectedOutcomeFilter === 'ALL') return true;
      return item.status === selectedOutcomeFilter;
    });
  }, [history, selectedOutcomeFilter]);

  const handleDeleteItem = (idToDelete) => {
    if (window.confirm('Delete this assessment record from your history?')) {
      setHistory(prev => prev.filter(item => item.id !== idToDelete));
      if (viewSnapshotRecord?.id === idToDelete) {
        setViewSnapshotRecord(null);
      }
    }
  };

  const handleClearAll = () => {
    if (window.confirm('Clear all assessment history? This cannot be undone.')) {
      setHistory([]);
      setViewSnapshotRecord(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Assessment History &amp; Audit Logs
          </h2>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            Immutable snapshots of evaluations saved to local client storage.
          </p>
        </div>

        {history && history.length > 0 && (
          <button
            type="button"
            onClick={handleClearAll}
            className="inline-flex items-center gap-1.5 rounded border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-rose-600 shadow-2xs hover:bg-rose-50 dark:border-slate-700 dark:bg-slate-800 dark:text-rose-400"
          >
            <Trash2 size={13} />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {/* Segmented Filter Bar */}
      {history && history.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200/90 bg-white p-3 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-wrap items-center gap-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 mr-2">
              Outcome:
            </span>
            {['ALL', STATUS.ELIGIBLE, STATUS.PARTIALLY_MATCHED, STATUS.NOT_ELIGIBLE, STATUS.INCOMPLETE].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setSelectedOutcomeFilter(st)}
                className={`rounded px-2.5 py-1 text-xs font-medium transition ${
                  selectedOutcomeFilter === st
                    ? 'bg-slate-900 text-white dark:bg-blue-600'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
                }`}
              >
                {st === 'ALL' ? 'All Outcomes' : st}
              </button>
            ))}
          </div>

          <span className="text-xs text-slate-400 font-mono-numbers">
            {filteredHistory.length} record{filteredHistory.length !== 1 ? 's' : ''}
          </span>
        </div>
      )}

      {/* Table of Assessments */}
      {filteredHistory.length > 0 ? (
        <div className="rounded-lg border border-slate-200/90 bg-white shadow-2xs dark:border-slate-800 dark:bg-slate-900">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-100 bg-slate-50/70 text-slate-500 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-400">
                <tr>
                  <th className="px-5 py-3 font-semibold uppercase tracking-wider">Opportunity</th>
                  <th className="px-4 py-3 font-semibold uppercase tracking-wider">Verdict</th>
                  <th className="px-4 py-3 font-semibold uppercase tracking-wider">Skill Match</th>
                  <th className="px-4 py-3 font-semibold uppercase tracking-wider">Req Coverage</th>
                  <th className="px-4 py-3 font-semibold uppercase tracking-wider">Assessment Date</th>
                  <th className="px-5 py-3 text-right font-semibold uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredHistory.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30">
                    <td className="px-5 py-3.5">
                      <p className="font-semibold text-slate-900 dark:text-slate-100">
                        {item.opportunityTitle}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {item.organization} · {item.category}
                      </p>
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

                    <td className="px-4 py-3.5 text-slate-500 font-mono-numbers dark:text-slate-400">
                      {new Date(item.timestamp).toLocaleDateString()} {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>

                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setViewSnapshotRecord(item)}
                          className="rounded p-1 text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
                          title="View evaluation snapshot details"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteItem(item.id)}
                          className="rounded p-1 text-slate-400 hover:text-rose-600"
                          title="Delete record"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <EmptyState
          icon={HistoryIcon}
          title="No assessment history logged"
          description="Evaluate any opportunity in the Eligibility Checker and save the snapshot to view your historical audit log."
          actionLabel="Go to Eligibility Checker"
          actionTo="/checker"
        />
      )}

      {/* Snapshot Modal */}
      {viewSnapshotRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900">
            <button
              type="button"
              onClick={() => setViewSnapshotRecord(null)}
              className="absolute top-4 right-4 rounded p-1 text-slate-400 hover:text-slate-600"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-2">
              <StatusBadge status={viewSnapshotRecord.status} size="md" />
              <span className="font-mono-numbers text-xs text-slate-400">
                {new Date(viewSnapshotRecord.timestamp).toLocaleString()}
              </span>
            </div>

            <h3 className="mt-3 text-lg font-bold text-slate-900 dark:text-slate-100">
              {viewSnapshotRecord.opportunityTitle}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {viewSnapshotRecord.organization} · {viewSnapshotRecord.category}
            </p>

            <div className="mt-4 grid grid-cols-2 gap-3 rounded-md bg-slate-50 p-3 text-xs dark:bg-slate-800/50">
              <div>
                <span className="text-slate-400">Skill Coverage:</span>
                <p className="font-mono-numbers font-bold text-slate-800 dark:text-slate-200">{viewSnapshotRecord.skillCoverage}%</p>
              </div>
              <div>
                <span className="text-slate-400">Requirement Coverage:</span>
                <p className="font-mono-numbers font-bold text-slate-800 dark:text-slate-200">{viewSnapshotRecord.requirementCoverage}%</p>
              </div>
            </div>

            {viewSnapshotRecord.snapshot && (
              <div className="mt-4 border-t border-slate-100 pt-3 dark:border-slate-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Profile Snapshot At Assessment Time
                </h4>
                <div className="mt-2 space-y-1 text-xs text-slate-700 dark:text-slate-300">
                  <p>Candidate: <strong>{viewSnapshotRecord.snapshot.profileName}</strong></p>
                  <p>Degree: <strong>{viewSnapshotRecord.snapshot.profileDegree}</strong></p>
                  <p>Academic Score: <strong>{viewSnapshotRecord.snapshot.profileScore}</strong></p>
                  <div className="mt-2">
                    <span className="text-slate-400">Skills Held:</span>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {viewSnapshotRecord.snapshot.profileSkills?.map(s => (
                        <span key={s} className="rounded bg-slate-100 px-1.5 py-0.5 text-[11px] dark:bg-slate-800">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setViewSnapshotRecord(null)}
                className="rounded border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
