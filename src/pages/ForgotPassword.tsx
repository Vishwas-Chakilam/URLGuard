import { useState } from 'react';
import toast from 'react-hot-toast';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!isSupabaseConfigured || !supabase) {
      toast.error('Supabase is not configured.');
      return;
    }
    setLoading(true);
    const redirectTo = `${window.location.origin}/reset-password`;
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });
    setLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success('Check your inbox for a password reset link.');
    setEmail('');
  };

  return (
    <div className="max-w-md mx-auto rounded-3xl border border-slate-200 dark:border-slate-800 p-8 bg-white/80 dark:bg-slate-900/60 backdrop-blur">
      <p className="uppercase text-xs tracking-[0.4em] text-slate-500 text-center mb-2">Account</p>
      <h1 className="text-3xl font-semibold text-center mb-6">Forgot password</h1>
      <p className="text-sm text-slate-500 text-center mb-8">
        Enter your email address and we&apos;ll send you a secure link to reset your password.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="text-sm font-medium text-slate-600 dark:text-slate-200">
          Email address
          <input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-1 w-full px-4 py-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-slate-900/70 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="you@example.com"
          />
        </label>
        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-3 rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-medium disabled:opacity-60"
        >
          {loading ? 'Sending link…' : 'Send reset link'}
        </button>
      </form>
    </div>
  );
}

