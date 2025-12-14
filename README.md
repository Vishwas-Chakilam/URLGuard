# URL Guard — React + Supabase + Pretend ML

Apple-inspired, production-ready React application that demonstrates how a RandomForest-like pipeline could classify URLs as **Benign / Defacement / Phishing / Malicious**. Everything is wired to Supabase for authentication, points/badges, history, quiz results, reports, and contact requests. A Flask backend stub mirrors the same deterministic ML logic so you can swap in a real model later.

> 🔒 **Important:** The ML layer is a  deterministic model (`src/lib/demoModel.ts`). Replace it with your API when you are ready for production.

## Feature highlights

- Supabase auth (email/password) with profiles, avatar uploads, points, and badge progression.
- Analyze page with 3-step pipeline, deterministic scoring, toasts, history sync, reports, and guest preview.
- Gamification rules (points, badges, report/quiz bonuses) with progress bars and deletions that rollback points.
- Quiz engine pulling 10 seeded questions per session, with Supabase persistence when logged in.
- Contact form wired to EmailJS + optional Supabase storage.
- About, Profile, History, Quiz, Contact, Privacy, Terms, How-it-works, and 404 pages — all responsive and accessible.
- Optional Flask API (`flask_backend/`) mirroring the pretend model to demonstrate a real inference endpoint.

## Tech stack

- React 18 + TypeScript + Vite
- Tailwind CSS + framer-motion + Heroicons + react-hot-toast
- Supabase (`@supabase/supabase-js`) for auth/storage
- EmailJS (`@emailjs/browser`) for contact notifications
- Flask (optional backend demo)

## Quick start

```bash
# Frontend
npm install
npm run dev

# Optional: Flask API (virtual env recommended)
cd flask_backend
python -m venv .venv && source .venv/bin/activate  # or .venv\Scripts\activate on Windows
pip install -r requirements.txt
python app.py
```

Navigate to `http://localhost:5173` for the client and `http://127.0.0.1:5001/api/health` to verify the Flask API.

## Environment variables

Duplicate `env.example` → `.env` and fill in:

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_CLIENT_URL=http://localhost:5173
VITE_EMAILJS_SERVICE_ID=
VITE_EMAILJS_TEMPLATE_ID=
VITE_EMAILJS_PUBLIC_KEY=
VITE_FLASK_API_URL=http://127.0.0.1:5001/api/predict
```

If you migrate to Next.js later, equivalent `NEXT_PUBLIC_*` keys are already referenced in code.

## Supabase setup

1. Create a new Supabase project.
2. Run `supabase/schema.sql` in the SQL editor to create tables, indexes, and RLS policies:
   - `profiles`
   - `analyses`
   - `reports`
   - `quiz_results`
   - `contacts`
3. Enable the default storage bucket `avatars` (create one if missing) for profile pictures.
4. Update environment variables with the generated URL + anon key.

### RLS reminder

The provided SQL enables row-level security with policies scoped to `auth.uid()`. Confirm they are active before going live.

## Pretend RandomForest pipeline

- File: `src/lib/demoModel.ts`
- Steps:
  1. Normalize URL, strip fragments, ensure protocol.
  2. Check protocol, domain length, heuristic entropy, and trusted domain list (`src/data/trustedDomains.ts`).
  3. Seeded PRNG simulates RandomForest probabilities + metrics (accuracy, precision, recall, support).

Swap it with a real API:

```ts
// demoModel.ts
// const response = await fetch(import.meta.env.VITE_FLASK_API_URL!, {
//   method: 'POST',
//   headers: { 'Content-Type': 'application/json' },
//   body: JSON.stringify({ url }),
// });
// return await response.json();
```

The Flask backend already exposes `/api/predict` using the same deterministic logic (`flask_backend/demo_model.py`). Replace `analyze_url` with your real model call when ready.

## Gamification rules

| Event            | Points |
| ---------------- | ------ |
| Benign result    | +5     |
| Defacement       | +3     |
| Phishing         | +7     |
| Malicious        | +10    |
| Report submission| +2     |
| Quiz             | `2 * correct answers` |

Badges unlock at 10 / 50 / 100 / 250 points (`badgeTiers` in `src/data/badgeTiers.ts`). Deleting a history entry rolls back the awarded points automatically.

## EmailJS configuration

1. Create a service, template, and public key at [EmailJS](https://www.emailjs.com/).
2. Paste the values into the env file (`VITE_EMAILJS_*`).
3. Customize the template fields to match `{ name, email, subject, message }`.
4. Without keys, contact submissions still get saved in Supabase (if configured) and a toast explains that the email step is skipped.

## Testing checklist

| Scenario                         | Steps |
| -------------------------------- | ----- |
| Guest analysis                   | Visit `/analyze`, run `http://example-unsafe.test`, observe toast prompting login. |
| Authenticated analysis           | Sign up, analyze `https://google.com`, confirm history entry and points. |
| Report submission                | Click “Report URL” — toast should confirm and points +2 should apply. |
| History filters & deletion       | Apply label filter, delete entry, ensure point rollback. |
| Quiz flow                        | Answer all 10 questions, submit, and check Supabase `quiz_results`. |
| Contact form                     | Submit message (with EmailJS keys) and verify email + Supabase `contacts` row. |
| Dark mode                        | Toggle header icon; theme preference persists in localStorage. |

Sample URLs for demos:

- Safe: `https://google.com`, `https://github.com`
- Suspicious: `http://login-paypal.com`, `https://very-long-domain-with-random-strings.biz`
- Malicious (pretend): `http://phishy-bank-login.ru`

## Replacing the pretend ML with a real model

1. Deploy your model behind an API (Flask example already included).
2. Update `VITE_FLASK_API_URL` (or any endpoint) and swap the call inside `demoModel.ts`.
3. Optional: move the Supabase persistence to the Flask route if you need server-side control.
4. Keep the trusted domain list in `src/data/trustedDomains.ts` or load it from Supabase storage if you prefer.

## Folder overview

```
src/
  components/        # Layout, auth forms, analysis widgets
  contexts/          # Auth, theme, history, gamification providers
  data/              # Trusted domains, badge tiers, quiz questions
  lib/               # demoModel + Supabase client
  pages/             # All routes (Home, Analyze, History, Profile, etc.)
flask_backend/       # Optional Flask API wrapper
supabase/schema.sql  # Tables + policies
env.example          # Environment template
```

## Licence

MIT — feel free to adapt for your own academic or demo projects. Please swap in a genuine ML model before claiming production readiness.
