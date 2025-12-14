import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { useGamification } from '../contexts/GamificationContext';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { badgeTiers } from '../data/badgeTiers';

const AVATAR_BUCKET = import.meta.env.VITE_SUPABASE_AVATAR_BUCKET ?? 'normal';

export default function Profile() {
  const { profile, updateProfile, refreshProfile } = useAuth();
  const { stats, badges } = useGamification();
  const [form, setForm] = useState({
    displayName: profile?.displayName ?? '',
    username: profile?.username ?? '',
    bio: profile?.bio ?? '',
    avatarUrl: profile?.avatarUrl ?? '',
  });
  const [saving, setSaving] = useState(false);
  const [emailInput, setEmailInput] = useState(profile?.email ?? '');

  useEffect(() => {
    if (profile) {
      setForm({
        displayName: profile.displayName ?? '',
        username: profile.username ?? '',
        bio: profile.bio ?? '',
        avatarUrl: profile.avatarUrl ?? '',
      });
    }
  }, [profile]);

  const nextBadge = useMemo(() => badgeTiers.find((tier) => tier.threshold > stats.points), [stats.points]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    await updateProfile({
      displayName: form.displayName,
      username: form.username,
      bio: form.bio,
      avatarUrl: form.avatarUrl,
    });
    setSaving(false);
  };

  const handleEmailChange = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!supabase || !profile) return;
    if (!emailInput || emailInput === profile.email) {
      toast('Enter a new email address first.');
      return;
    }
    const { error } = await supabase.auth.updateUser({
      email: emailInput,
    });
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success('Verification email sent. Check your inbox to confirm.');
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !profile) return;
    if (!isSupabaseConfigured) {
      toast.error('Configure Supabase to upload avatars.');
      return;
    }
    const client = supabase;
    if (!client) {
      toast.error('Supabase client unavailable.');
      return;
    }
    const bucket = client.storage.from(AVATAR_BUCKET);
    const filePath = `${profile.id}/${Date.now()}-${file.name}`;
    const { error } = await bucket.upload(filePath, file, { upsert: true });
    if (error) {
      console.error('Avatar upload error:', error);
      toast.error(error.message ?? 'Avatar upload failed');
      return;
    }
    const {
      data: { publicUrl },
    } = bucket.getPublicUrl(filePath);
    setForm((prev) => ({ ...prev, avatarUrl: publicUrl }));
    await updateProfile({ avatarUrl: publicUrl });
    await refreshProfile();
    toast.success('Avatar updated');
  };

  const handleDataDeletion = () => {
    toast(
      'Use Supabase dashboard or a serverless function to delete user data + auth — see README privacy section.',
      { duration: 6000 }
    );
  };

  return (
    <div className="grid gap-8 md:grid-cols-[2fr,1fr]">
      <section className="rounded-3xl border border-slate-200 dark:border-slate-800 p-8 bg-white/80 dark:bg-slate-900/40 backdrop-blur space-y-6">
        <div className="flex items-center gap-4">
          <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-slate-200 to-slate-100 dark:from-slate-800 dark:to-slate-900 overflow-hidden">
            {form.avatarUrl ? (
              <img src={form.avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-2xl font-semibold text-slate-500">
                {profile?.displayName?.[0] ?? 'U'}
              </div>
            )}
          </div>
          <div>
            <p className="uppercase text-xs tracking-[0.4em] text-slate-500">Profile</p>
            <h1 className="text-3xl font-semibold">{profile?.displayName ?? 'Unnamed analyst'}</h1>
            <p className="text-sm text-slate-500">{profile?.email}</p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm">
            Display name
            <input
              className="mt-1 w-full px-4 py-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-slate-900/70"
              value={form.displayName}
              onChange={(event) => setForm((prev) => ({ ...prev, displayName: event.target.value }))}
            />
          </label>
            <label className="text-sm">
              Username
              <input
                className="mt-1 w-full px-4 py-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-slate-900/70"
                value={form.username}
                onChange={(event) => setForm((prev) => ({ ...prev, username: event.target.value }))}
              />
            </label>
          </div>
          <label className="text-sm">
            Bio
            <textarea
              className="mt-1 w-full px-4 py-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-slate-900/70"
              rows={4}
              value={form.bio}
              onChange={(event) => setForm((prev) => ({ ...prev, bio: event.target.value }))}
            />
          </label>
          <label className="text-sm flex flex-col gap-2">
            Avatar
            <input type="file" accept="image/*" onChange={handleAvatarUpload} />
          </label>
          <form onSubmit={handleEmailChange} className="space-y-2 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 p-4">
            <p className="text-sm font-medium text-slate-600 dark:text-slate-200">Email address</p>
            <input
              type="email"
              value={emailInput}
              onChange={(event) => setEmailInput(event.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-slate-900/70"
            />
            <button
              type="submit"
              className="w-full sm:w-auto px-4 py-2 rounded-full border border-slate-300 dark:border-slate-700 text-sm hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              Send verification link
            </button>
            <p className="text-xs text-slate-500">
              Supabase will send a confirmation email. Your email is updated only after you confirm the link.
            </p>
          </form>
          <p className="text-xs text-slate-500">
            Need to update your password?{' '}
            <a href="/reset-password" className="text-blue-600 hover:underline">
              Go to reset page
            </a>
            .
          </p>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-medium disabled:opacity-60"
          >
            {saving ? 'Saving changes…' : 'Save profile'}
          </button>
        </form>
      </section>

      <aside className="space-y-6">
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 p-6 bg-white/70 dark:bg-slate-900/40">
          <p className="uppercase text-xs tracking-[0.4em] text-slate-500 mb-3">Stats</p>
          <p className="text-4xl font-semibold mb-1">{stats.points} pts</p>
          <p className="text-sm text-slate-500">
            {nextBadge
              ? `${nextBadge.threshold - stats.points} points to ${nextBadge.name}`
              : 'All badges unlocked'}
          </p>
          <div className="mt-4 h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-400 via-amber-400 to-red-500"
              style={{
                width: `${Math.min(
                  100,
                  nextBadge ? (stats.points / nextBadge.threshold) * 100 : 100
                )}%`,
              }}
            />
          </div>
          <div className="grid grid-cols-3 gap-3 text-sm text-center mt-4">
            <div>
              <p className="text-slate-500">Analyses</p>
              <p className="text-lg font-semibold">{stats.analyses}</p>
            </div>
            <div>
              <p className="text-slate-500">Reports</p>
              <p className="text-lg font-semibold">{stats.reports}</p>
            </div>
            <div>
              <p className="text-slate-500">Quizzes</p>
              <p className="text-lg font-semibold">{stats.quizzes}</p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 p-6 bg-white/70 dark:bg-slate-900/40 space-y-3">
          <p className="uppercase text-xs tracking-[0.4em] text-slate-500">Badges</p>
          {badges.length === 0 && <p className="text-sm text-slate-500">Earn badges by analyzing URLs.</p>}
          <div className="flex flex-wrap gap-3">
            {badges.map((badge) => (
              <span key={badge.id} className="px-4 py-2 rounded-full text-sm border border-slate-200 dark:border-slate-700">
                {badge.name}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-red-200 dark:border-red-500/40 p-6 bg-red-50/60 dark:bg-red-500/10 space-y-3">
          <p className="text-sm font-semibold text-red-600">Privacy controls</p>
          <p className="text-sm text-red-600/80">
            Need to delete your Supabase data? Trigger the deletion flow and scrub both auth + profile tables.
          </p>
          <button
            type="button"
            className="px-4 py-2 rounded-full border border-red-200 text-red-600 text-sm"
            onClick={handleDataDeletion}
          >
            Request data deletion
          </button>
        </div>
      </aside>
    </div>
  );
}

