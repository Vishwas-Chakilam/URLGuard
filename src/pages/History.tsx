import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ClipboardDocumentIcon, ArrowPathIcon, FlagIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useUrlHistory } from '../contexts/UrlHistoryContext';
import { useGamification } from '../contexts/GamificationContext';
import { supabase } from '../lib/supabaseClient';

const labelFilters = ['All', 'Benign', 'Defacement', 'Phishing', 'Malicious'] as const;

export default function History() {
  const { history, deleteAnalysis, loading } = useUrlHistory();
  const { rollbackAnalysisPoints, awardReportPoints } = useGamification();
  const [labelFilter, setLabelFilter] = useState<(typeof labelFilters)[number]>('All');
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const filteredHistory = useMemo(() => {
    return history.filter((item) => {
      const matchesLabel = labelFilter === 'All' || item.predictedLabel === labelFilter;
      const matchesSearch = item.domain?.toLowerCase().includes(search.toLowerCase()) ?? true;
      return matchesLabel && matchesSearch;
    });
  }, [history, labelFilter, search]);

  const handleReanalyze = (url: string) => {
    navigate('/analyze', { state: { prefillUrl: url } });
  };

  const handleCopy = async (url: string) => {
    await navigator.clipboard.writeText(url);
    toast.success('URL copied');
  };

  const handleReport = async (url: string, analysisId?: string) => {
    if (!supabase) {
      toast.success('Report noted locally (configure Supabase to persist).');
      return;
    }
    const { error } = await supabase.from('reports').insert({
      url,
      analysis_id: analysisId ?? null,
    });
    if (error) {
      toast.error('Unable to report URL.');
    } else {
      toast.success('Report submitted.');
      await awardReportPoints();
    }
  };

  const handleDelete = async (id?: string, label?: string) => {
    if (!id || !label) return;
    await deleteAnalysis(id, label);
    await rollbackAnalysisPoints(label);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <p className="uppercase text-xs tracking-[0.4em] text-slate-500">History</p>
          <h1 className="text-3xl font-semibold">Saved analyses & timeline</h1>
        </div>
        <div className="flex gap-3">
          <select
            value={labelFilter}
            onChange={(event) => setLabelFilter(event.target.value as (typeof labelFilters)[number])}
            className="px-4 py-2 rounded-full border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/40"
          >
            {labelFilters.map((filter) => (
              <option key={filter} value={filter}>
                {filter}
              </option>
            ))}
          </select>
          <input
            placeholder="Search domain"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="px-4 py-2 rounded-full border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/40"
          />
        </div>
      </div>

      <div className="space-y-4">
        {loading && <p className="text-sm text-slate-500">Loading history…</p>}
        {filteredHistory.map((item) => (
          <div
            key={item.id}
            className="rounded-3xl border border-slate-200 dark:border-slate-800 p-6 bg-white/70 dark:bg-slate-900/40 flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
          >
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{item.predictedLabel}</p>
              <p className="text-lg font-semibold">{item.domain}</p>
              <p className="text-sm text-slate-500">{new Date(item.createdAt ?? '').toLocaleString()}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm"
                onClick={() => handleReanalyze(item.url)}
              >
                <ArrowPathIcon className="h-4 w-4" />
                Re-analyze
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm"
                onClick={() => handleCopy(item.url)}
              >
                <ClipboardDocumentIcon className="h-4 w-4" />
                Copy
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm"
                onClick={() => handleReport(item.url, item.id)}
              >
                <FlagIcon className="h-4 w-4" />
                Report
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm text-red-600 border-red-200"
                onClick={() => handleDelete(item.id, item.predictedLabel)}
              >
                <TrashIcon className="h-4 w-4" />
                Delete
              </button>
            </div>
          </div>
        ))}

        {!loading && filteredHistory.length === 0 && (
          <p className="text-sm text-slate-500 text-center py-10">No analyses found for the selected filters.</p>
        )}
      </div>
    </div>
  );
}
