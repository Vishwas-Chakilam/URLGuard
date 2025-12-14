export type BadgeTier = {
  id: string;
  name: string;
  threshold: number;
  description: string;
};

export const badgeTiers: BadgeTier[] = [
  { id: 'novice', name: 'Novice Analyst', threshold: 10, description: 'First steps into URL defense.' },
  { id: 'watcher', name: 'Trusted Watcher', threshold: 50, description: 'Consistent vigilance pays off.' },
  { id: 'hunter', name: 'Phish Hunter', threshold: 100, description: 'Expert at spotting phishing attempts.' },
  { id: 'guardian', name: 'Guardian', threshold: 250, description: 'Elite defender of the web.' },
];

