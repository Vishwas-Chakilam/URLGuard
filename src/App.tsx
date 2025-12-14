import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { UrlHistoryProvider } from './contexts/UrlHistoryContext';
import { GamificationProvider } from './contexts/GamificationContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Analysis from './pages/Analysis';
import History from './pages/History';
import About from './pages/About';
import Quiz from './pages/Quiz';
import Profile from './pages/Profile';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import HowItWorks from './pages/HowItWorks';
import NotFound from './pages/NotFound';
import LoginForm from './components/auth/LoginForm';
import SignupForm from './components/auth/SignupForm';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

function PrivateRoute({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <p className="text-lg text-gray-500 dark:text-gray-400">Loading your workspace…</p>
      </div>
    );
  }
  return user ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <GamificationProvider>
          <UrlHistoryProvider>
            <BrowserRouter>
              <Layout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<LoginForm />} />
                  <Route path="/signup" element={<SignupForm />} />
                  <Route path="/analyze" element={<Analysis />} />
                  <Route
                    path="/history"
                    element={
                      <PrivateRoute>
                        <History />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <PrivateRoute>
                        <Profile />
                      </PrivateRoute>
                    }
                  />
                  <Route path="/quiz" element={<Quiz />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/how-it-works" element={<HowItWorks />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Layout>
              <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
            </BrowserRouter>
          </UrlHistoryProvider>
        </GamificationProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
