export default function Terms() {
  return (
    <div className="space-y-6">
      <div>
        <p className="uppercase text-xs tracking-[0.4em] text-slate-500">Terms</p>
        <h1 className="text-3xl font-semibold">Terms of Service</h1>
        <p className="text-slate-500">Last updated Nov 2025</p>
      </div>
      <section className="rounded-3xl border border-slate-200 dark:border-slate-800 p-6 bg-white/80 dark:bg-slate-900/40 space-y-4">
        <h2 className="text-xl font-semibold">Academic use only</h2>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          This project demonstrates how to build a Supabase-backed React experience with a pretend ML model. Do not use
          the predictions to make critical security decisions without replacing the demo model with a vetted API.
        </p>
        <h2 className="text-xl font-semibold">User responsibilities</h2>
        <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-2">
          <li>• Provide accurate contact information when submitting reports.</li>
          <li>• Avoid uploading sensitive data or URLs you do not own.</li>
          <li>• Follow applicable laws when storing domains or reports.</li>
        </ul>
        <h2 className="text-xl font-semibold">Liability</h2>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          URL Guard ships without warranty. Replace `demoModel.ts` with a production-grade service before deployment, and
          ensure your Supabase instance enforces row-level security rules described in the README.
        </p>
      </section>
    </div>
  );
}

