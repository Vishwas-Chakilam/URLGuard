import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import type { BadgeRecord } from '../types/auth';
import type { GamificationContextValue, GamificationStats } from '../types/gamification';
import { badgeTiers } from '../data/badgeTiers';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabaseClient';
import type { PredictedLabel } from '../types/analysis';

const defaultStats: GamificationStats = {
  points: 0,
  analyses: 0,
  reports: 0,
  quizzes: 0,
};

const labelPoints: Record<PredictedLabel, number> = {
  Benign: 5,
  Defacement: 3,
  Phishing: 7,
  Malicious: 10,
};

const GamificationContext = createContext<GamificationContextValue | undefined>(undefined);

const maybeAwardNewBadges = (points: number, current: BadgeRecord[]) => {
  const earned: BadgeRecord[] = [];
  badgeTiers.forEach((tier) => {
    const hasBadge = current.some((badge) => badge.id === tier.id);
    if (!hasBadge && points >= tier.threshold) {
      earned.push({
        id: tier.id,
        name: tier.name,
        earnedAt: new Date().toISOString(),
      });
    }
  });
  return earned;
};

export function GamificationProvider({ children }: { children: React.ReactNode }) {
  const { user, profile, refreshProfile } = useAuth();
  const [stats, setStats] = useState<GamificationStats>(defaultStats);
  const [badges, setBadges] = useState<BadgeRecord[]>([]);

  const fetchCounts = async () => {
    if (!user || !supabase) return defaultStats;
    const [analysesRes, reportsRes, quizzesRes] = await Promise.all([
      supabase.from('analyses').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
      supabase.from('reports').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
      supabase.from('quiz_results').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
    ]);

    return {
      points: profile?.points ?? 0,
      analyses: analysesRes.count ?? 0,
      reports: reportsRes.count ?? 0,
      quizzes: quizzesRes.count ?? 0,
    };
  };

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      if (!profile) {
        if (isMounted) {
          setStats(defaultStats);
          setBadges([]);
        }
        return;
      }
      const counts = await fetchCounts();
      if (isMounted) {
        setStats(counts);
        setBadges(profile.badges ?? []);
      }
    };
    void load();
    return () => {
      isMounted = false;
    };
  }, [profile, user?.id]);

  const persistProgress = async (nextPoints: number, nextBadges: BadgeRecord[]) => {
    if (!user || !supabase) return;
    const { error } = await supabase
      .from('profiles')
      .update({
        points: nextPoints,
        badges: nextBadges,
      })
      .eq('id', user.id)
      .select()
      .single();
    if (error) {
      console.error('Points sync error:', error);
      toast.error('Failed to sync points');
      return;
    }
    await refreshProfile();
  };

  const applyPoints = async (delta: number, badgeContext = true, shouldPersist = true) => {
    if (delta === 0) return;
    let totalPoints = 0;
    setStats((prev) => {
      totalPoints = prev.points + delta;
      return { ...prev, points: totalPoints };
    });
    let nextBadges = badges;
    if (badgeContext) {
      const newlyEarned = maybeAwardNewBadges(totalPoints, badges);
      if (newlyEarned.length) {
        toast.success(`Unlocked ${newlyEarned.map((b) => b.name).join(', ')}`);
        nextBadges = [...badges, ...newlyEarned];
        setBadges(nextBadges);
      }
    }
    if (shouldPersist) {
      await persistProgress(totalPoints, nextBadges);
    }
    return nextBadges;
  };

  const awardAnalysisPoints = async (label: string, options?: { persist?: boolean }) => {
    const normalized = label as PredictedLabel;
    const delta = labelPoints[normalized] ?? 0;
    setStats((prev) => ({ ...prev, analyses: prev.analyses + 1 }));
    if (delta) {
      const updatedBadges = await applyPoints(delta, true, options?.persist ?? true);
      toast.success(`Analysis saved — +${delta} points`);
      if (options?.persist === false) {
        return { delta, badges: updatedBadges ?? badges };
      }
    }
  };

  const rollbackAnalysisPoints = async (label: string) => {
    const normalized = label as PredictedLabel;
    const delta = labelPoints[normalized] ?? 0;
    if (delta) {
      await applyPoints(-delta, false);
    }
  };

  const awardReportPoints = async () => {
    setStats((prev) => ({ ...prev, reports: prev.reports + 1 }));
    await applyPoints(2);
  };

  const awardQuizPoints = async (score: number) => {
    const delta = score * 2;
    setStats((prev) => ({ ...prev, quizzes: prev.quizzes + 1 }));
    if (delta) {
      await applyPoints(delta);
    }
  };

  const refreshFromProfile = () => {
    if (profile) {
      setStats((prev) => ({ ...prev, points: profile.points }));
      setBadges(profile.badges ?? []);
      void fetchCounts().then((counts) => setStats(counts));
    }
  };

  const value = useMemo<GamificationContextValue>(
    () => ({
      stats,
      badges,
      awardAnalysisPoints,
      awardReportPoints,
      awardQuizPoints,
      rollbackAnalysisPoints,
      refreshFromProfile,
    }),
    [stats, badges]
  );

  return <GamificationContext.Provider value={value}>{children}</GamificationContext.Provider>;
}

export function useGamification() {
  const context = useContext(GamificationContext);
  if (context === undefined) {
    throw new Error('useGamification must be used within a GamificationProvider');
  }
  return context;
}
