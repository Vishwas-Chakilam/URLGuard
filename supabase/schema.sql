create extension if not exists "uuid-ossp";

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text unique,
  display_name text,
  email text,
  bio text,
  avatar_url text,
  points integer default 0,
  badges jsonb default '[]'::jsonb,
  created_at timestamp with time zone default timezone('utc', now()),
  updated_at timestamp with time zone default timezone('utc', now())
);

-- Auto-update updated_at on profile changes
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$ language plpgsql;

create trigger on_profile_updated
  before update on public.profiles
  for each row execute procedure public.handle_updated_at();

create table if not exists public.analyses (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles (id) on delete set null,
  url text not null,
  domain text,
  protocol text,
  is_trusted boolean default false,
  predicted_label text,
  safety_score integer,
  model_name text,
  metrics jsonb,
  explanation jsonb,
  created_at timestamp with time zone default timezone('utc', now())
);
create index if not exists analyses_user_idx on public.analyses (user_id);

create table if not exists public.reports (
  id uuid primary key default uuid_generate_v4(),
  analysis_id uuid references public.analyses (id) on delete set null,
  url text not null,
  user_id uuid references public.profiles (id) on delete set null,
  reason text,
  created_at timestamp with time zone default timezone('utc', now())
);

create table if not exists public.quiz_results (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles (id) on delete set null,
  score integer not null,
  total integer not null,
  answers jsonb,
  created_at timestamp with time zone default timezone('utc', now())
);
create index if not exists quiz_results_user_idx on public.quiz_results (user_id);

create table if not exists public.contacts (
  id uuid primary key default uuid_generate_v4(),
  name text,
  email text,
  subject text,
  message text,
  created_at timestamp with time zone default timezone('utc', now())
);

-- =============================================
-- ROW LEVEL SECURITY POLICIES
-- Run these in Supabase SQL Editor after creating tables
-- =============================================

-- PROFILES: Users can read/write their own profile
alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- ANALYSES: Users can CRUD their own analyses
alter table public.analyses enable row level security;

create policy "Users can view own analyses"
  on public.analyses for select
  using (auth.uid() = user_id);

create policy "Users can insert own analyses"
  on public.analyses for insert
  with check (auth.uid() = user_id);

create policy "Users can update own analyses"
  on public.analyses for update
  using (auth.uid() = user_id);

create policy "Users can delete own analyses"
  on public.analyses for delete
  using (auth.uid() = user_id);

-- REPORTS: Anyone can insert, users can view their own
alter table public.reports enable row level security;

create policy "Anyone can insert reports"
  on public.reports for insert
  with check (true);

create policy "Users can view own reports"
  on public.reports for select
  using (auth.uid() = user_id or user_id is null);

-- QUIZ_RESULTS: Users can manage their own quiz results
alter table public.quiz_results enable row level security;

create policy "Users can view own quiz results"
  on public.quiz_results for select
  using (auth.uid() = user_id);

create policy "Users can insert own quiz results"
  on public.quiz_results for insert
  with check (auth.uid() = user_id);

-- CONTACTS: Anyone can insert (public contact form)
alter table public.contacts enable row level security;

create policy "Anyone can insert contacts"
  on public.contacts for insert
  with check (true);

