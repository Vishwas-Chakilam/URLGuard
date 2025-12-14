import type { BadgeRecord } from './auth';

export type GamificationStats = {
  points: number;
  analyses: number;
  reports: number;
  quizzes: number;
};

export type AwardAnalysisResult = {
  delta: number;
  badges: BadgeRecord[];
};

export type GamificationContextValue = {
  stats: GamificationStats;
  badges: BadgeRecord[];
  awardAnalysisPoints: (label: string, options?: { persist?: boolean }) => Promise<AwardAnalysisResult | void>;
  awardReportPoints: () => Promise<void>;
  awardQuizPoints: (score: number) => Promise<void>;
  rollbackAnalysisPoints: (label: string) => Promise<void>;
  refreshFromProfile: () => void;
};