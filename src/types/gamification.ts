export type UserStats = {
  points: number;
  level: number;
  streak: number;
  lastActive: Date;
  urlsAnalyzed: number;
  maliciousDetected: number;
};

export type Achievement = {
  id: string;
  title: string;
  description: string;
  icon: string;
};