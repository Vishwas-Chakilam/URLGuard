import { Link } from 'react-router-dom';

const steps = [
  {
    title: '1. Client-side pretend model',
    description:
      'demoModel.ts normalizes the URL, checks protocols + trusted domains, then feeds deterministic values into a pseudo RandomForest scoring function.',
    code: 'src/lib/demoModel.ts',
  },
  {
    title: '2. Optional Flask API',
    description: 'The flask_backend folder exposes /api/predict so you can show a real server call (or swap in a real ML model).',
    code: 'flask_backend/app.py',
  },
  {
    title: '3. Persistence via Supabase',
    description: 'Analyses, reports, quiz results, contact messages, and profiles live inside Supabase tables with SQL provided in the README.',
    code: 'README.md → Supabase schema',
  },
];

export default function HowItWorks() {
  return (
    <div className="space-y-8">
      <div>
        <p className="uppercase text-xs tracking-[0.4em] text-slate-500">Pipeline</p>
        <h1 className="text-3xl font-semibold">How the pretend RandomForest pipeline works</h1>
        <p className="text-slate-500">
          Replace the highlighted files to connect a real model. Everything else (auth, storage, UI, gamification) is production-ready.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {steps.map((step) => (
          <div key={step.title} className="rounded-3xl border border-slate-200 dark:border-slate-800 p-6 bg-white/80 dark:bg-slate-900/40">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500 mb-2">{step.title}</p>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">{step.description}</p>
            <span className="inline-flex text-xs px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700">
              {step.code}
            </span>
          </div>
        ))}
      </div>
      <p className="text-sm text-slate-500">
        Ready to ship a real model? Start by wiring the <code>demoModel.ts</code> output to a Flask endpoint, then send that response into the same UI.
        See the <Link to="/contact" className="text-blue-600">Contact</Link> page if you need help.
      </p>
    </div>
  );
}

