export default function About() {
  return (
    <div className="space-y-8">
      <div>
        <p className="uppercase text-xs tracking-[0.4em] text-slate-500">About</p>
        <h1 className="text-4xl font-semibold">URL Guard — crafted for academic showcases</h1>
        <p className="text-slate-500">
          Built by Vishwas (Full Stack Developer) with Supabase, React, Tailwind, and a pretend RandomForest pipeline that you can swap later.
        </p>
      </div>
      <section className="grid gap-6 md:grid-cols-3">
        {[
          { title: 'Authentication', detail: 'Supabase email/password, points & badges stored per profile.' },
          { title: 'ML Ensemble', detail: 'Deterministic RandomForest simulator seeded by URL hash and other ML models.' },
          { title: 'Gamification', detail: 'Points, badges, quiz rewards, report bonuses, and history filters.' },
        ].map((card) => (
          <div key={card.title} className="rounded-3xl border border-slate-200 dark:border-slate-800 p-6 bg-white/80 dark:bg-slate-900/40">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">{card.title}</p>
            <p className="text-slate-600 dark:text-slate-300 text-sm mt-2">{card.detail}</p>
          </div>
        ))}
      </section>
      <section className="rounded-3xl border border-slate-200 dark:border-slate-800 p-6 bg-white/90 dark:bg-slate-900/40 space-y-4">
        <h2 className="text-2xl font-semibold">Meet the developer</h2>
        <p className="text-slate-600 dark:text-slate-300">
          I’m Vishwas — a full stack engineer who loves combining clean UI with practical security tooling. This project is meant to look
          production-ready for thesis defenses, demo days, or interviews. Connect with me:
        </p>
        <div className="flex gap-4 text-sm">
          <a href="https://www.linkedin.com/in/vishwas-chakilam" className="text-blue-600">
            LinkedIn
          </a>
          <a href="https://github.com/vishwas-chakilam" className="text-blue-600">
            GitHub
          </a>
          <a href="mailto:work.vishwas1@gmail.com" className="text-blue-600">
            Email
          </a>
        </div>
      </section>
      <section className="rounded-3xl border border-slate-200 dark:border-slate-800 p-6 bg-white/90 dark:bg-slate-900/40 space-y-3">
        <h2 className="text-2xl font-semibold">Highlights</h2>
        <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
          <li>• Apple-inspired layout with light/dark themes and glassmorphism cards.</li>
          <li>• Supabase SQL + README instructions to stand up the backend quickly.</li>
          <li>• Flask backend sample to demonstrate how to replace the pretend ML.</li>
        </ul>
      </section>
    </div>
  );
}
