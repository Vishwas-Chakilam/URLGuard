import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="text-center space-y-6">
      <p className="text-sm uppercase tracking-[0.4em] text-slate-500">404</p>
      <h1 className="text-4xl font-semibold">Page not found</h1>
      <p className="text-slate-500">The page you requested does not exist. Try heading back to the analyzer.</p>
      <div className="flex justify-center gap-4">
        <Link to="/" className="px-6 py-3 rounded-2xl border border-slate-300 dark:border-slate-700">
          Go home
        </Link>
        <Link to="/analyze" className="px-6 py-3 rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-slate-900">
          Analyze URL
        </Link>
      </div>
    </div>
  );
}

