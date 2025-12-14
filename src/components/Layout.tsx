import { Link, NavLink } from 'react-router-dom';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

const navLinks = [
  { label: 'Analyze', to: '/analyze' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const { isDarkMode, toggleTheme } = useTheme();
  const { user, isGuest, logout } = useAuth();

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-slate-50/60 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
        <header className="sticky top-0 z-20 backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 border-b border-slate-200/60 dark:border-slate-800">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
            <Link to="/" className="font-semibold text-xl tracking-tight">
              URL<span className="text-blue-600">Guard</span>
            </Link>
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
              {navLinks.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `transition-colors hover:text-blue-600 ${
                      isActive ? 'text-blue-600' : 'text-slate-600 dark:text-slate-300'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
              {!user && (
                <NavLink
                  to="/quiz"
                  className={({ isActive }) =>
                    `transition-colors hover:text-blue-600 ${
                      isActive ? 'text-blue-600' : 'text-slate-600 dark:text-slate-300'
                    }`
                  }
                >
                  Quiz
                </NavLink>
              )}
              {user && (
                <NavLink
                  to="/profile"
                  className={({ isActive }) =>
                    `transition-colors hover:text-blue-600 ${
                      isActive ? 'text-blue-600' : 'text-slate-600 dark:text-slate-300'
                    }`
                  }
                >
                  Profile
                </NavLink>
              )}
              {user && (
                <NavLink
                  to="/history"
                  className={({ isActive }) =>
                    `transition-colors hover:text-blue-600 ${
                      isActive ? 'text-blue-600' : 'text-slate-600 dark:text-slate-300'
                    }`
                  }
                >
                  History
                </NavLink>
              )}
              <NavLink
                to="/how-it-works"
                className="transition-colors hover:text-blue-600 text-slate-600 dark:text-slate-300"
              >
                How it works
              </NavLink>
            </nav>
            <div className="flex items-center gap-2">
              {isGuest && (
                <span className="text-xs uppercase tracking-wide bg-slate-200/70 dark:bg-slate-800 px-3 py-1 rounded-full">
                  Guest Mode
                </span>
              )}
              <button
                type="button"
                onClick={toggleTheme}
                className="p-2 rounded-full border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Toggle theme"
              >
                {isDarkMode ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
              </button>
              {user ? (
                <>
                  <Link
                    to="/profile"
                    className="hidden sm:inline-flex px-4 py-2 rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-sm"
                  >
                    Dashboard
                  </Link>
                  <button
                    type="button"
                    onClick={() => logout()}
                    className="px-3 py-2 text-sm text-slate-600 dark:text-slate-300 hover:text-blue-600"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-3 py-2 text-sm text-slate-600 dark:text-slate-200 hover:text-blue-600"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/signup"
                    className="hidden sm:inline-flex px-4 py-2 rounded-full bg-blue-600 text-white text-sm shadow-lg shadow-blue-600/30"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 py-10">{children}</main>

        <footer className="border-t border-slate-200 dark:border-slate-800 mt-16">
          <div className="max-w-6xl mx-auto px-4 py-10 grid gap-6 md:grid-cols-3 text-sm text-slate-500 dark:text-slate-400">
            <div>
              <p className="font-semibold text-slate-800 dark:text-white mb-2">URLGuard</p>
              <p className="text-sm">
                Academic-ready demo showcasing how a RandomForest model could power URL protection.
              </p>
            </div>
            <div className="space-y-2">
              <p className="font-semibold text-slate-800 dark:text-white">Product</p>
              <Link to="/analyze" className="block hover:text-blue-600">
                Analyzer
              </Link>
              <Link to="/profile" className="block hover:text-blue-600">
                Profile
              </Link>
              <Link to="/history" className="block hover:text-blue-600">
                History
              </Link>
            </div>
            <div className="space-y-2">
              <p className="font-semibold text-slate-800 dark:text-white">Company</p>
              <Link to="/about" className="block hover:text-blue-600">
                About
              </Link>
              <Link to="/contact" className="block hover:text-blue-600">
                Contact
              </Link>
              <Link to="/privacy" className="block hover:text-blue-600">
                Privacy
              </Link>
              <Link to="/terms" className="block hover:text-blue-600">
                Terms
              </Link>
            </div>
          </div>
          <p className="text-center text-xs text-slate-500 pb-6">© {new Date().getFullYear()} URLGuard.</p>
        </footer>
      </div>
    </div>
  );
}
