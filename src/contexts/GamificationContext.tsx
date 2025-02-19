import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { Achievement, UserStats } from '../types/gamification';

type GamificationContextType = {
  stats: UserStats;
  achievements: Achievement[];
  addPoints: (points: number) => void;
  checkAchievements: (action: string) => void;
};

const GamificationContext = createContext<GamificationContextType | undefined>(undefined);

export function GamificationProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [stats, setStats] = useState<UserStats>({
    points: 0,
    level: 1,
    streak: 0,
    lastActive: new Date(),
    urlsAnalyzed: 0,
    maliciousDetected: 0,
  });
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    if (user) {
      // Load user stats from localStorage
      const savedStats = localStorage.getItem(`stats_${user.id}`);
      if (savedStats) {
        setStats(JSON.parse(savedStats));
      }
    }
  }, [user]);

  const addPoints = (points: number) => {
    setStats(prev => {
      const newStats = {
        ...prev,
        points: prev.points + points,
        level: Math.floor((prev.points + points) / 100) + 1,
      };
      if (user) {
        localStorage.setItem(`stats_${user.id}`, JSON.stringify(newStats));
      }
      return newStats;
    });
  };

  const checkAchievements = (action: string) => {
    // Implementation of achievement logic
    const newAchievements: Achievement[] = [];
    
    if (action === 'url_analysis' && stats.urlsAnalyzed === 0) {
      newAchievements.push({
        id: 'first_analysis',
        title: 'First Analysis',
        description: 'Completed your first URL analysis',
        icon: '🎯',
      });
    }

    if (newAchievements.length > 0) {
      setAchievements(prev => [...prev, ...newAchievements]);
    }
  };

  return (
    <GamificationContext.Provider value={{ stats, achievements, addPoints, checkAchievements }}>
      {children}
    </GamificationContext.Provider>
  );
}

export function useGamification() {
  const context = useContext(GamificationContext);
  if (context === undefined) {
    throw new Error('useGamification must be used within a GamificationProvider');
  }
  return context;
}