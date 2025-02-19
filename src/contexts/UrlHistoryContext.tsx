import { createContext, useContext, useState } from 'react';

export type UrlAnalysis = {
  url: string;
  status: 'safe' | 'malicious';
  timestamp: Date;
};

type UrlHistoryContextType = {
  history: UrlAnalysis[];
  addAnalysis: (analysis: UrlAnalysis) => void;
};

const UrlHistoryContext = createContext<UrlHistoryContextType | undefined>(undefined);

export function UrlHistoryProvider({ children }: { children: React.ReactNode }) {
  const [history, setHistory] = useState<UrlAnalysis[]>([]);

  const addAnalysis = (analysis: UrlAnalysis) => {
    setHistory(prev => [analysis, ...prev]);
  };

  return (
    <UrlHistoryContext.Provider value={{ history, addAnalysis }}>
      {children}
    </UrlHistoryContext.Provider>
  );
}

export function useUrlHistory() {
  const context = useContext(UrlHistoryContext);
  if (context === undefined) {
    throw new Error('useUrlHistory must be used within a UrlHistoryProvider');
  }
  return context;
}