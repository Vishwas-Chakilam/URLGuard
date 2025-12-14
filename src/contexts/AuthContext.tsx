import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import toast from 'react-hot-toast';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import type { Profile, SignupFormData } from '../types/auth';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  supabaseReady: boolean;
  isGuest: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (payload: SignupFormData) => Promise<boolean>;
  logout: () => Promise<void>;
  continueAsGuest: () => void;
  refreshProfile: () => Promise<void>;
  updateProfile: (payload: Partial<Profile>) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mapProfile = (row: any): Profile => ({
  id: row.id,
  email: row.email,
  username: row.username,
  displayName: row.display_name,
  bio: row.bio,
  avatarUrl: row.avatar_url,
  points: row.points ?? 0,
  badges: row.badges ?? [],
  createdAt: row.created_at,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(() => sessionStorage.getItem('urlguard_guest') === 'true');

  useEffect(() => {
    let isMounted = true;
    if (!supabase) {
      setLoading(false);
      return;
    }

    const client = supabase;

    const init = async () => {
      const { data } = await client.auth.getSession();
      if (!isMounted) return;
      setSession(data.session ?? null);
      setUser(data.session?.user ?? null);
      setLoading(false);
    };
    init();

    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      if (newSession?.user) {
        setIsGuest(false);
        sessionStorage.removeItem('urlguard_guest');
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!user || !supabase) {
      setProfile(null);
      return;
    }

    const client = supabase;

    const loadProfile = async () => {
      // Profile is auto-created by database trigger on signup
      // Just need to fetch it - may take a moment for trigger to complete
      let retries = 3;
      while (retries > 0) {
        const { data, error } = await client.from('profiles').select('*').eq('id', user.id).single();
        if (data) {
          setProfile(mapProfile(data));
          return;
        }
        if (error && error.code !== 'PGRST116') {
          console.error('Profile load error:', error);
          toast.error('Unable to load profile');
          return;
        }
        // Profile not found yet - trigger may still be running, wait and retry
        retries -= 1;
        if (retries > 0) {
          await new Promise((resolve) => setTimeout(resolve, 500));
        }
      }
      console.warn('Profile not found after retries - trigger may have failed');
    };

    loadProfile();
  }, [user]);

  const continueAsGuest = () => {
    setIsGuest(true);
    sessionStorage.setItem('urlguard_guest', 'true');
    toast.success('Guest session enabled');
  };

  const login = async (email: string, password: string) => {
    if (!supabase) {
      toast.error('Supabase is not configured');
      return false;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (error) {
      toast.error(error.message);
      return false;
    }
    toast.success('Welcome back!');
    return true;
  };

  const signup = async ({ email, password, username, displayName, acceptTerms }: SignupFormData) => {
    if (!acceptTerms) {
      toast.error('Please accept the terms to continue');
      return false;
    }
    if (!supabase) {
      toast.error('Supabase is not configured');
      return false;
    }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          display_name: displayName,
        },
      },
    });
    if (error) {
      toast.error(error.message);
      setLoading(false);
      return false;
    }

    // Profile is auto-created by database trigger (handle_new_user)
    // No manual insert needed - the trigger uses the metadata we passed above
    toast.success('Account created. Please verify your email if required.');
    setLoading(false);
    return true;
  };

  const logout = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setProfile(null);
    setIsGuest(false);
    sessionStorage.removeItem('urlguard_guest');
  };

  const refreshProfile = async () => {
    if (!supabase || !user) return;
    const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    if (!error && data) {
      setProfile(mapProfile(data));
    }
  };

  const updateProfile = async (payload: Partial<Profile>) => {
    if (!supabase || !user) return;
    const updates = {
      display_name: payload.displayName,
      username: payload.username,
      bio: payload.bio,
      avatar_url: payload.avatarUrl,
    };
    const { error, data } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();
    if (error) {
      toast.error('Could not update profile');
      return;
    }
    setProfile(mapProfile(data));
    toast.success('Profile updated');
  };

  const value = useMemo(
    () => ({
      user,
      session,
      profile,
      loading,
      supabaseReady: isSupabaseConfigured,
      isGuest,
      login,
      signup,
      logout,
      continueAsGuest,
      refreshProfile,
      updateProfile,
    }),
    [user, session, profile, loading, isGuest]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
