import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  ArrowPathIcon,
  CheckCircleIcon,
  FlagIcon,
  ClipboardDocumentIcon,
} from '@heroicons/react/24/outline';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import toast from 'react-hot-toast';
import { analyzeUrl } from '../lib/demoModel';
import type { AnalysisResult } from '../types/analysis';
import type { BadgeRecord } from '../types/auth';
import { useUrlHistory } from '../contexts/UrlHistoryContext';
import { useAuth } from '../contexts/AuthContext';
import { useGamification } from '../contexts/GamificationContext';
import { supabase } from '../lib/supabaseClient';

const pipelineSteps = [
  { title: 'Feature extraction', description: 'Extract 20+ URL features for ML analysis.' },
  { title: 'Trusted domain check', description: 'Cross-reference curated trusted domains list.' },
  { title: 'Ensemble voting', description: '5 ML models vote — majority wins!' },
];

const labelThemes: Record<string, string> = {
  Benign: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-300',
  Defacement: 'bg-amber-100 text-amber-800 dark:bg-amber-500/10 dark:text-amber-300',
  Phishing: 'bg-orange-100 text-orange-800 dark:bg-orange-500/10 dark:text-orange-300',
  Malicious: 'bg-red-100 text-red-800 dark:bg-red-500/10 dark:text-red-300',
};

const CHART_COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4', '#6366f1', '#84cc16', '#f43f5e', '#14b8a6', '#a855f7'];

export default function Analysis() {
  const location = useLocation();
  const [url, setUrl] = useState('');
  const [activeStep, setActiveStep] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [lastRecordId, setLastRecordId] = useState<string | null>(null);
  const { addAnalysis, history } = useUrlHistory();
  const { user, isGuest, continueAsGuest, profile, refreshProfile } = useAuth();
  const { awardAnalysisPoints, awardReportPoints } = useGamification();

  useEffect(() => {
    const state = location.state as { prefillUrl?: string } | null;
    if (state?.prefillUrl) {
      setUrl(state.prefillUrl);
    }
  }, [location.state]);

  const protocolHint = useMemo(() => {
    if (!url) return null;
    if (url.startsWith('https://')) return 'https';
    if (url.startsWith('http://')) return 'http';
    return null;
  }, [url]);

  const handleAnalyze = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!url.trim()) {
      toast.error('Enter a URL to analyze');
      return;
    }
    try {
      setIsAnalyzing(true);
      setResult(null);
      
      for (let index = 0; index < pipelineSteps.length; index += 1) {
        setActiveStep(index);
        await new Promise((resolve) => setTimeout(resolve, 600));
      }
      
      const analysis = await analyzeUrl(url);
      setResult(analysis);
      const saved = await addAnalysis(analysis);
      setLastRecordId(saved?.id ?? null);
      
      if (user) {
        const awardResult = await awardAnalysisPoints(analysis.predictedLabel, { persist: false });
        const delta = awardResult?.delta ?? getPointsForLabel(analysis.predictedLabel);
        const updatedBadges = awardResult?.badges ?? profile?.badges ?? [];
        await persistProfileProgress(delta, updatedBadges);
        toast.success(`Analysis complete — +${delta} points!`);
      } else {
        toast((t) => (
          <div>
            <p className="font-semibold">Guest preview</p>
            <p className="text-sm text-slate-500">Sign in to save analyses & earn badges.</p>
            <button
              type="button"
              className="mt-2 text-blue-500 underline text-sm"
              onClick={() => toast.dismiss(t.id)}
            >
              Got it
            </button>
          </div>
        ));
      }
    } catch (error) {
      console.error(error);
      toast.error('Unable to analyze URL. Check the format and try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getPointsForLabel = (label: string) => {
    const points: Record<string, number> = { Benign: 5, Defacement: 3, Phishing: 7, Malicious: 10 };
    return points[label] || 5;
  };

  const persistProfileProgress = async (delta: number, updatedBadges: BadgeRecord[]) => {
    if (!user || !supabase) return;
    const currentPoints = profile?.points ?? 0;
    const { error } = await supabase
      .from('profiles')
      .update({
        points: currentPoints + delta,
        badges: updatedBadges,
      })
      .eq('id', user.id)
      .select()
      .single();
    if (error) {
      console.error('Profile sync error:', error);
      toast.error('Failed to sync profile points');
    } else {
      await refreshProfile();
    }
  };

  const copyReport = async () => {
    if (!result) return;
    const summary = [
      '🛡️ URL Guard — Analysis Report',
      `URL: ${result.url}`,
      `Prediction: ${result.predictedLabel}`,
      `Safety Score: ${result.safetyScore}/100`,
      `Protocol: ${result.protocol.toUpperCase()}`,
      `Trusted Domain: ${result.isTrusted ? 'Yes' : 'No'}`,
      `Model: ${result.modelName}`,
      '',
      'Explanation:',
      ...result.explanation,
    ].join('\n');
    await navigator.clipboard.writeText(summary);
    toast.success('Report copied to clipboard');
  };

  const reportUrl = async () => {
    if (!result) return;
    if (!supabase) {
      toast.success('Report noted locally — configure Supabase to persist.');
      return;
    }
    const { error } = await supabase.from('reports').insert({
      url: result.url,
      user_id: user?.id ?? null,
      analysis_id: lastRecordId,
      reason: 'Flagged via client UI',
    });
    if (error) {
      toast.error('Unable to log report');
    } else {
      toast.success('Thanks — report received.');
      if (user) {
        await awardReportPoints();
      }
    }
  };

  const helperCard = !user && !isGuest ? (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <p className="font-semibold">Sign in for full access</p>
        <p className="text-sm text-slate-500 dark:text-slate-300">
          Guests can analyze, but saving history & earning badges requires login.
        </p>
      </div>
      <button
        type="button"
        className="text-sm px-4 py-2 rounded-full border border-slate-300 dark:border-slate-700"
        onClick={() => continueAsGuest()}
      >
        Continue as guest
      </button>
    </div>
  ) : null;

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <p className="uppercase text-xs tracking-[0.4em] text-slate-500">URL Analyzer</p>
        <h1 className="text-4xl font-semibold">Analyze URL with ML Ensemble</h1>
        <p className="text-slate-500">
          5 ML models (Random Forest, XGBoost, LightGBM, GBDT, Naive Bayes) vote on each URL — majority wins!
        </p>
      </div>

      {helperCard}

      <form
        onSubmit={handleAnalyze}
        className="rounded-3xl border border-slate-200 dark:border-slate-800 p-6 bg-white/80 dark:bg-slate-900/40 backdrop-blur space-y-4"
      >
        <label htmlFor="url" className="text-sm font-medium text-slate-600 dark:text-slate-300">
          Enter URL to analyze
        </label>
        <div className="flex flex-col gap-3">
          <div className="relative">
            <input
              id="url"
              type="text"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              placeholder="https://example.com/path"
              className="w-full px-4 py-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-slate-900/60 focus:ring-2 focus:ring-blue-500 outline-none pr-24"
            />
            {protocolHint && (
              <span
                className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs px-2 py-1 rounded-full ${
                  protocolHint === 'https' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                }`}
              >
                {protocolHint.toUpperCase()}
              </span>
            )}
          </div>
        </div>
        <button
          type="submit"
          disabled={isAnalyzing}
          className="w-full sm:w-auto px-8 py-3 rounded-2xl bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-60 flex items-center justify-center gap-2 transition-all"
        >
          {isAnalyzing && <ArrowPathIcon className="h-5 w-5 animate-spin" />}
          {isAnalyzing ? 'Analyzing…' : 'Analyze URL'}
        </button>
      </form>

      {/* Pipeline Steps */}
      <section className="grid md:grid-cols-3 gap-4">
        {pipelineSteps.map((step, index) => (
          <div
            key={step.title}
            className={`rounded-2xl border p-4 transition-all ${
              index === activeStep && isAnalyzing
                ? 'border-blue-500 bg-blue-50/60 dark:border-blue-500/40 dark:bg-blue-500/10 scale-[1.02]'
                : index < activeStep && isAnalyzing
                  ? 'border-emerald-300 bg-emerald-50/40 dark:border-emerald-500/30 dark:bg-emerald-500/5'
                  : 'border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/40'
            }`}
          >
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500 mb-2">Step {index + 1}</p>
            <p className="font-semibold">{step.title}</p>
            <p className="text-sm text-slate-500">{step.description}</p>
          </div>
        ))}
      </section>

      {/* Results */}
      {result && (
        <div className="space-y-6">
          {/* Main Result Card */}
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 p-6 bg-white/90 dark:bg-slate-900/40">
            <div className="flex flex-wrap items-center gap-4 justify-between mb-6">
              <div>
                <p className="text-sm uppercase tracking-[0.4em] text-slate-500 mb-2">Prediction</p>
                <p className="text-4xl font-bold">{result.predictedLabel}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className={`px-5 py-2 rounded-full text-sm font-medium ${labelThemes[result.predictedLabel] || labelThemes.Benign}`}>
                  {result.predictedLabel}
                </span>
                <span className="text-xs text-slate-500">{result.modelName}</span>
              </div>
            </div>

            {/* Safety Score */}
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium">Safety Score</span>
                <span className="font-bold text-lg">{result.safetyScore}/100</span>
              </div>
              <div className="relative h-4 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className="absolute inset-y-0 rounded-full transition-all duration-1000 ease-out"
                  style={{
                    width: `${result.safetyScore}%`,
                    background: result.safetyScore >= 70
                      ? 'linear-gradient(90deg, #10b981, #34d399)'
                      : result.safetyScore >= 40
                        ? 'linear-gradient(90deg, #f59e0b, #fbbf24)'
                        : 'linear-gradient(90deg, #ef4444, #f87171)',
                  }}
                />
              </div>
              <p className="mt-2 text-sm text-slate-500">
                {result.protocol.toUpperCase()} · {result.isTrusted ? '✓ Trusted domain' : 'Unlisted domain'}
              </p>
            </div>

            {/* Ensemble Voting Results */}
            {result.ensemblePrediction && (
              <div className="mb-6 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                <p className="text-sm font-medium mb-3">🗳️ Ensemble Voting Results</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {Object.entries(result.ensemblePrediction.model_predictions).map(([modelName, pred]) => (
                    <div
                      key={modelName}
                      className={`text-center p-3 rounded-xl border ${
                        pred.prediction_label === result.ensemblePrediction?.final_prediction
                          ? 'border-emerald-300 bg-emerald-50 dark:border-emerald-500/40 dark:bg-emerald-500/10'
                          : 'border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <p className="text-xs text-slate-500 truncate">{modelName}</p>
                      <p className="font-semibold text-sm capitalize">{pred.prediction_label}</p>
                      {pred.confidence && (
                        <p className="text-xs text-slate-400">{pred.confidence.toFixed(0)}%</p>
                      )}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-slate-500 mt-3 text-center">
                  Vote counts: {Object.entries(result.ensemblePrediction.vote_counts).map(([k, v]) => `${k}: ${v}`).join(' | ')}
                </p>
              </div>
            )}

            {/* Feature Bar Chart */}
            {result.featureChartData && result.featureChartData.length > 0 && (
              <div className="mb-6">
                <p className="text-sm font-medium mb-3">📊 Extracted Features (Count-based)</p>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={result.featureChartData} margin={{ top: 10, right: 10, left: 0, bottom: 40 }}>
                      <XAxis 
                        dataKey="name" 
                        tick={{ fontSize: 10 }} 
                        angle={-45} 
                        textAnchor="end"
                        interval={0}
                      />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 shadow-lg">
                                <p className="font-medium text-sm">{data.fullName}</p>
                                <p className="text-blue-600 font-bold">{data.value}</p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                        {result.featureChartData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Explanation */}
            <div className="mb-6">
              <p className="text-sm font-medium text-slate-500 mb-2">Analysis Explanation</p>
              <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-2">
                {result.explanation.map((line, idx) => (
                  <li key={idx}>{line}</li>
                ))}
              </ul>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-slate-300 dark:border-slate-700 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                onClick={copyReport}
              >
                <ClipboardDocumentIcon className="h-4 w-4" />
                Copy report
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-slate-300 dark:border-slate-700 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                onClick={() => toast(user ? 'Saved automatically.' : 'Sign in to persist history.')}
              >
                <CheckCircleIcon className="h-4 w-4" />
                Save to history
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-red-300 text-red-600 bg-red-50 dark:border-red-500/40 dark:bg-red-500/10 text-sm hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors"
                onClick={reportUrl}
              >
                <FlagIcon className="h-4 w-4" />
                Report URL
              </button>
            </div>
          </div>

          {/* Recent History Sidebar */}
          {history.length > 0 && (
            <div className="rounded-3xl border border-slate-200 dark:border-slate-800 p-6 bg-white/90 dark:bg-slate-900/40">
              <p className="text-sm uppercase tracking-[0.4em] text-slate-500 mb-4">Recent Analyses</p>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                {history.slice(0, 6).map((item) => (
                  <div key={item.id} className="rounded-2xl border border-slate-200 dark:border-slate-700 p-3">
                    <p className="text-sm font-medium truncate">{item.domain}</p>
                    <p className="text-xs text-slate-500">{new Date(item.createdAt ?? '').toLocaleString()}</p>
                    <span className={`mt-1 inline-flex text-xs px-2 py-1 rounded-full ${labelThemes[item.predictedLabel] || ''}`}>
                      {item.predictedLabel}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
