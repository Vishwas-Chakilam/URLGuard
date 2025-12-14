export type BadgeRecord = {
  id: string;
  name: string;
  earnedAt: string;
};

export type Profile = {
  id: string;
  email: string;
  username: string | null;
  displayName: string | null;
  bio: string | null;
  avatarUrl: string | null;
  points: number;
  badges: BadgeRecord[];
  createdAt?: string;
};

export type LoginFormData = {
  email: string;
  password: string;
};

export type SignupFormData = {
  email: string;
  password: string;
  username?: string;
  displayName?: string;
  acceptTerms: boolean;
};