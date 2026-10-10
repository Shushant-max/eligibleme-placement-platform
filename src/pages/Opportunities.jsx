import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Filter,
  GraduationCap,
  Award,
  Briefcase,
  ExternalLink,
  X,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { OPPORTUNITY_CATEGORIES } from '../data/opportunities.js';
import OpportunityCard from '../components/OpportunityCard.jsx';
import EmptyState from '../components/EmptyState.jsx';

export default function Opportunities({ opportunities }) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [sortBy, setSortBy] = useState('title');
  const [detailModalOpp, setDetailModalOpp] = useState(null);

  // Filter and sort opportunities
  const filteredOpportunities = useMemo(() => {
    return (opportunities || []).filter((opp) => {
      const matchesSearch =
        opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        opp.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
        opp.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (opp.requiredSkills || []).some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory =
        selectedCategory === 'All Categories' || opp.category === selectedCategory;

      return matchesSearch && matchesCategory;
    }).sort((a, b) => {
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === 'experience') {
        return (a.minExperience || 0) - (b.minExperience || 0);
      }
      if (sortBy === 'score') {
        return (parseFloat(b.minScore) || 0) - (parseFloat(a.minScore) || 0);
      }
      return 0;
    });
  }, [opportunities, searchQuery, selectedCategory, sortBy]);

  return (
    <div className="space-y-6">
      {/* Header banner */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Opportunity Explorer
          </h2>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            Search roles and fellowships with explicit, verifiable admission and hiring cut-offs.
          </p>
        </div>

        <div className="inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
          <ShieldAlert size={14} className="text-amber-500" />
          <span>Curated benchmark profiles for local rule testing.</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-lg border border-slate-200/90 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          {/* Search input */}
          <div className="relative flex-1">
            <Search size={15} className="absolute top-2.5 left-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search by title, organization, or required skill (e.g. React, Java, SQL)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full rounded-md border border-slate-200 bg-white py-2 pr-3 pl-9 text-xs shadow-2xs focus:border-blue-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>

          {/* Sort Selection */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 shadow-2xs focus:border-blue-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              <option value="title">Title (A-Z)</option>
              <option value="experience">Experience (Low to High)</option>
              <option value="score">Cut-off Score (High to Low)</option>
            </select>
          </div>
        </div>

        {/* Clean Segmented Category Tabs (No pills) */}
        <div className="mt-3 flex flex-wrap items-center gap-1 border-t border-slate-100 pt-3 dark:border-slate-800">
          {OPPORTUNITY_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`rounded px-2.5 py-1 text-xs font-medium transition ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white dark:bg-blue-600'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count & Quick Reset */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span>
          Showing <strong className="font-mono-numbers">{filteredOpportunities.length}</strong> opportunities
        </span>
        {(searchQuery || selectedCategory !== 'All Categories') && (
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All Categories');
            }}
            className="text-blue-600 hover:underline dark:text-blue-400"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Opportunities Grid */}
      {filteredOpportunities.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filteredOpportunities.map((opp) => (
            <OpportunityCard
              key={opp.id}
              opportunity={opp}
              onSelect={(item) => setDetailModalOpp(item)}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Filter}
          title="No opportunities found"
          description="Try broadening your search query or switching categories."
          actionLabel="Clear Filters"
          onAction={() => {
            setSearchQuery('');
            setSelectedCategory('All Categories');
          }}
        />
      )}

      {/* Opportunity Detail Modal */}
      {detailModalOpp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900">
            <button
              type="button"
              onClick={() => setDetailModalOpp(null)}
              className="absolute top-4 right-4 rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>

            <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <span className="font-medium text-slate-700 dark:text-slate-300">{detailModalOpp.category}</span>
              <span>·</span>
              <span>{detailModalOpp.type}</span>
              <span>·</span>
              <span>{detailModalOpp.location}</span>
            </div>

            <h3 className="mt-2 text-xl font-bold text-slate-900 dark:text-slate-100">
              {detailModalOpp.title}
            </h3>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {detailModalOpp.organization}
            </p>

            <div className="mt-4 border-t border-slate-100 pt-4 dark:border-slate-800">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Position Overview
              </h4>
              <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                {detailModalOpp.description}
              </p>
            </div>

            {/* Mandatory Criteria */}
            <div className="mt-4 rounded-md border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-800/50">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                Mandatory Eligibility Criteria
              </h4>

              <div className="mt-3 grid grid-cols-1 gap-2 text-xs sm:grid-cols-3 text-slate-700 dark:text-slate-300">
                <div className="rounded border border-slate-200/80 bg-white p-2 dark:border-slate-700 dark:bg-slate-800">
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block">Required Degree</span>
                  <span className="font-semibold">{detailModalOpp.requiredDegree || 'Open'}</span>
                </div>
                <div className="rounded border border-slate-200/80 bg-white p-2 dark:border-slate-700 dark:bg-slate-800">
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block">Minimum Cutoff</span>
                  <span className="font-semibold">{detailModalOpp.minScore ? `${detailModalOpp.minScore} on ${detailModalOpp.scoreScale || '10'} scale` : 'None'}</span>
                </div>
                <div className="rounded border border-slate-200/80 bg-white p-2 dark:border-slate-700 dark:bg-slate-800">
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block">Min Experience</span>
                  <span className="font-semibold">{detailModalOpp.minExperience !== undefined ? `${detailModalOpp.minExperience} yr(s)` : '0 yr'}</span>
                </div>
              </div>

              {/* Skills */}
              <div className="mt-3">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Mandatory Skills:
                </span>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {detailModalOpp.requiredSkills?.map((s) => (
                    <span
                      key={s}
                      className="rounded bg-white px-2 py-0.5 text-xs font-medium text-slate-800 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Preferred qualifications */}
            {detailModalOpp.preferredQualifications && (
              <div className="mt-4">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Preferred Qualifications
                </h4>
                <ul className="mt-2 space-y-1 text-xs text-slate-600 dark:text-slate-300">
                  {detailModalOpp.preferredQualifications.map((pref, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-blue-500">·</span>
                      <span>{pref}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Modal Actions */}
            <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
              <a
                href={detailModalOpp.applicationUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400"
              >
                <span>Sample External Link</span>
                <ExternalLink size={12} />
              </a>

              <button
                type="button"
                onClick={() => {
                  setDetailModalOpp(null);
                  navigate(`/checker?oppId=${detailModalOpp.id}`);
                }}
                className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700"
              >
                <span>Run Eligibility Check</span>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
