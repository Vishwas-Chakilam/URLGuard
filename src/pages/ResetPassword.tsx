import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';

export default function ResetPassword() {
  const { user } = useAuth();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      if (!supabase) return;
      const { data } = await supabase.auth.getSession();
      setSessionReady(Boolean(data.session || user));
    };
    void init();
  }, [user]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!supabase) {
      toast.error('Supabase is not configured.');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success('Password updated. You can now log in with the new password.');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="max-w-md mx-auto rounded-3xl border border-slate-200 dark:border-slate-800 p-8 bg-white/80 dark:bg-slate-900/60 backdrop-blur">
      <p className="uppercase text-xs tracking-[0.4em] text-slate-500 text-center mb-2">Account</p>
      <h1 className="text-3xl font-semibold text-center mb-4">Reset password</h1>
      <p className="text-sm text-slate-500 text-center mb-8">
        {sessionReady
          ? 'Enter a new password below to finish the reset process.'
          : 'Open the password reset link from your email to continue.'}
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="text-sm font-medium text-slate-600 dark:text-slate-200">
          New password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-1 w-full px-4 py-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-slate-900/70 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="••••••••"
            minLength={8}
            required
          />
        </label>
        <label className="text-sm font-medium text-slate-600 dark:text-slate-200">
          Confirm password
          <input
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            className="mt-1 w-full px-4 py-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-slate-900/70 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="••••••••"
            minLength={8}
            required
          />
        </label>
        <button
          type="submit"
          disabled={loading || !sessionReady}
          className="w-full px-4 py-3 rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-medium disabled:opacity-60"
        >
          {loading ? 'Updating…' : 'Update password'}
        </button>
      </form>
    </div>
  );
}

