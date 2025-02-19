import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
      <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen">
        <header className="border-b dark:border-gray-700">
          <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link to="/" className="text-xl font-bold">URLGuard</Link>
            <div className="flex items-center gap-6">
              <Link to="/analysis" className="hover:text-blue-600 dark:hover:text-blue-400">Analyze</Link>
              <Link to="/history" className="hover:text-blue-600 dark:hover:text-blue-400">History</Link>
              <Link to="/about" className="hover:text-blue-600 dark:hover:text-blue-400">About</Link>
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                {isDarkMode ? (
                  <SunIcon className="h-5 w-5" />
                ) : (
                  <MoonIcon className="h-5 w-5" />
                )}
              </button>
            </div>
          </nav>
        </header>

        <main className="container mx-auto px-4 py-8">
          {children}
        </main>

        <footer className="border-t dark:border-gray-700">
          <div className="container mx-auto px-4 py-6 text-center text-sm text-gray-600 dark:text-gray-400">
            <p>© 2024 URLGuard. All rights reserved.</p>
            <div className="mt-2 space-x-4">
              <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">Documentation</a>
              <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">Terms of Service</a>
              <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">Contact</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}