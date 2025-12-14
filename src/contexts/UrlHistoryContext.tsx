import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import type { AnalysisRecord, AnalysisResult } from '../types/analysis';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from './AuthContext';

type UrlHistoryContextType = {
  history: AnalysisRecord[];
  loading: boolean;
  addAnalysis: (result: AnalysisResult) => Promise<AnalysisRecord | null>;
  deleteAnalysis: (id: string, label: string) => Promise<void>;
  refreshHistory: () => Promise<void>;
};

const HISTORY_KEY = 'urlguard_guest_history';
const UrlHistoryContext = createContext<UrlHistoryContextType | undefined>(undefined);

const mapRow = (row: any): AnalysisRecord => ({
  id: row.id,
  url: row.url,
  domain: row.domain,
  protocol: row.protocol,
  isTrusted: row.is_trusted ?? false,
  safetyScore: row.safety_score,
  predictedLabel: row.predicted_label,
  modelName: row.model_name,
  metrics: row.metrics,
  explanation: row.explanation ?? [],
  userId: row.user_id,
  createdAt: row.created_at,
});

export function UrlHistoryProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [history, setHistory] = useState<AnalysisRecord[]>([]);
  const [loading, setLoading] = useState(false);

  const loadGuestHistory = () => {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) {
      setHistory([]);
      return;
    }
    try {
      const parsed = JSON.parse(raw);
      setHistory(parsed);
    } catch {
      setHistory([]);
    }
  };

  const persistGuestHistory = (records: AnalysisRecord[]) => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(records));
  };

  const refreshHistory = async () => {
    if (!user || !supabase) {
      loadGuestHistory();
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('analyses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('History load error:', error);
        toast.error(`Unable to load history: ${error.message}`);
        return;
      }
      setHistory((data ?? []).map(mapRow));
    } catch (err) {
      console.error('History fetch exception:', err);
      toast.error('Network error loading history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      void refreshHistory();
    } else {
      loadGuestHistory();
    }
  }, [user?.id]);

  const addAnalysis = async (result: AnalysisResult) => {
    if (!user || !supabase) {
      const guestRecord: AnalysisRecord = {
        ...result,
        id: crypto.randomUUID(),
        userId: null,
        createdAt: new Date().toISOString(),
      };
      setHistory((prev) => {
        const next = [guestRecord, ...prev].slice(0, 25);
        persistGuestHistory(next);
        return next;
      });
      return guestRecord;
    }

    const payload = {
      user_id: user.id,
      url: result.url,
      domain: result.domain,
      protocol: result.protocol,
      is_trusted: result.isTrusted,
      predicted_label: result.predictedLabel,
      safety_score: result.safetyScore,
      model_name: result.modelName,
      metrics: result.metrics,
      explanation: result.explanation,
    };

    const { data, error } = await supabase.from('analyses').insert(payload).select().single();
    if (error) {
      console.error('Save analysis error:', error);
      toast.error(`Failed to save analysis: ${error.message}`);
      return null;
    }
    const record = mapRow(data);
    setHistory((prev) => [record, ...prev]);
    return record;
  };

  const deleteAnalysis = async (id: string, _label: string) => {
    setHistory((prev) => {
      const next = prev.filter((item) => item.id !== id);
      if (!user || !supabase) {
        persistGuestHistory(next);
      }
      return next;
    });
    if (!user || !supabase) return;
    const { error } = await supabase.from('analyses').delete().eq('id', id).eq('user_id', user.id);
    if (error) {
      toast.error('Unable to delete entry');
    } else {
      toast.success('Entry removed');
    }
  };

  const value = useMemo(
    () => ({
      history,
      loading,
      addAnalysis,
      deleteAnalysis,
      refreshHistory,
    }),
    [history, loading]
  );

  return <UrlHistoryContext.Provider value={value}>{children}</UrlHistoryContext.Provider>;
}

export function useUrlHistory() {
  const context = useContext(UrlHistoryContext);
  if (context === undefined) {
    throw new Error('useUrlHistory must be used within a UrlHistoryProvider');
  }
  return context;
}
