import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheckIcon, SparklesIcon, TrophyIcon } from '@heroicons/react/24/outline';

const highlights = [
  {
    title: 'Deterministic ML demo',
    description: 'RandomForestClassifier (Demo) runs entirely client-side with seeded reproducibility.',
  },
  {
    title: 'Supabase-authenticated',
    description: 'Profiles, history, reports, and quiz scores persist securely in Supabase.',
  },
  {
    title: 'Apple-inspired design',
    description: 'Rounded glass panels, soft gradients, and buttery micro-interactions.',
  },
];

const tips = [
  'Prefer HTTPS and validated domains before sharing credentials.',
  'Double-check shortened links by expanding them in a sandbox.',
  'Report suspicious URLs so the community stays protected.',
];

const testimonials = [
  {
    quote: 'We used URL Guard during our academic defense — the panel loved the polish.',
    author: 'Security Lab, 2024',
  },
  {
    quote: 'Deterministic outputs make demos predictable while still looking ML-backed.',
    author: 'Capstone Mentor',
  },
];

export default function Home() {
  return (
    <div className="space-y-16">
      <section className="grid gap-10 md:grid-cols-2 items-center">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <p className="uppercase tracking-[0.3em] text-xs text-slate-500 mb-4">URL Guard · Supabase · ML Ensemble</p>
          <h1 className="text-4xl md:text-5xl font-semibold leading-tight mb-6">
            Safeguard for spotting{' '}
            <span className="text-blue-600">Benign, Defacement, Phishing, or Malicious</span> URLs.
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 max-w-xl">
            Analyze any URL with our pretend RandomForest pipeline, earn badges, take a safety quiz, and showcase a
            production-ready research project — all with Supabase authentication baked in.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/analyze"
              className="px-6 py-3 rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xl shadow-slate-900/10"
            >
              Analyze URL
            </Link>
            <Link
              to="/quiz"
              className="px-6 py-3 rounded-full border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200"
            >
              Take Quiz
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white/70 dark:bg-slate-900/60 rounded-3xl p-8 border border-white/50 dark:border-slate-800 shadow-2xl shadow-slate-900/10 backdrop-blur"
        >
          <ShieldCheckIcon className="h-10 w-10 text-blue-600" />
          <p className="text-sm uppercase tracking-wide text-slate-500 mt-4 mb-2">Safety score snapshot</p>
          <p className="text-5xl font-semibold mb-2">92/100</p>
          <p className="text-slate-500 mb-6">Benign predictions remain deterministic per URL hash.</p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="rounded-2xl border border-slate-200 dark:border-slate-700 p-4">
              <p className="text-slate-500">Avg accuracy</p>
              <p className="text-2xl font-semibold">0.88</p>
            </div>
            <div className="rounded-2xl border border-slate-200 dark:border-slate-700 p-4">
              <p className="text-slate-500">Badges earned</p>
              <p className="text-2xl font-semibold">24K+</p>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="grid md:grid-cols-3 gap-6">
        {highlights.map((item) => (
          <div
            key={item.title}
            className="rounded-3xl border border-slate-200 dark:border-slate-800 p-6 bg-white/70 dark:bg-slate-900/40 backdrop-blur"
          >
            <SparklesIcon className="h-8 w-8 text-blue-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">{item.description}</p>
          </div>
        ))}
      </section>

      <section className="grid md:grid-cols-2 gap-10">
        <div className="rounded-3xl bg-slate-900 text-white p-8 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <TrophyIcon className="h-8 w-8" />
            <div>
              <p className="text-sm uppercase tracking-wide text-white/60">Gamification</p>
              <h3 className="text-2xl font-semibold">Points & Badges</h3>
            </div>
          </div>
          <ul className="space-y-3 text-white/80 text-sm">
            <li>+5 Benign · +3 Defacement · +7 Phishing · +10 Malicious · +2 Report</li>
            <li>Badges unlock at 10 / 50 / 100 / 250 points.</li>
            <li>Progress synced to Supabase profiles with real-time toasts.</li>
          </ul>
        </div>
        <div className="rounded-3xl border border-slate-200 dark:border-slate-700 p-8 bg-white/70 dark:bg-slate-900/40">
          <p className="text-sm uppercase tracking-wide text-slate-500 mb-4">Testimonials</p>
          <div className="space-y-6">
            {testimonials.map((item) => (
              <blockquote key={item.author}>
                <p className="text-lg leading-relaxed">“{item.quote}”</p>
                <p className="text-sm text-slate-500 mt-2">— {item.author}</p>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 dark:border-slate-800 p-8 bg-gradient-to-br from-blue-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-950">
        <p className="text-sm uppercase tracking-[0.4em] text-slate-500 mb-4">Tips & best practices</p>
        <div className="grid md:grid-cols-3 gap-6">
          {tips.map((tip) => (
            <div key={tip} className="rounded-2xl bg-white/80 dark:bg-slate-900/60 p-6 shadow-lg shadow-slate-900/5">
              <p className="text-slate-700 dark:text-slate-200 text-sm leading-relaxed">{tip}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="text-center rounded-3xl border border-slate-200 dark:border-slate-800 p-10 bg-white/90 dark:bg-slate-900/40 backdrop-blur">
        <p className="uppercase tracking-[0.3em] text-xs text-slate-500 mb-4">Ready to present?</p>
        <h3 className="text-3xl font-semibold mb-4">Swap in a real ML model whenever you’re ready.</h3>
        <p className="text-slate-600 dark:text-slate-300 mb-6">
          The codebase marks every seam where a true API (Flask, Supabase Edge, etc.) can replace the pretend RandomForest
          module.
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/how-it-works" className="px-6 py-3 rounded-full border border-slate-300 dark:border-slate-700">
            See the pipeline
          </Link>
          <Link to="/contact" className="px-6 py-3 rounded-full bg-blue-600 text-white shadow-lg shadow-blue-600/30">
            Contact developer
          </Link>
        </div>
      </section>
    </div>
  );
}
