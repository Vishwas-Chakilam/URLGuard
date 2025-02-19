import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { UrlHistoryProvider } from './contexts/UrlHistoryContext';
import { AuthProvider } from './contexts/AuthContext';
import { GamificationProvider } from './contexts/GamificationContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Analysis from './pages/Analysis';
import About from './pages/About';
import History from './pages/History';
import LoginForm from './components/auth/LoginForm';
import SignupForm from './components/auth/SignupForm';
import UserDashboard from './components/dashboard/UserDashboard';
import { useAuth } from './contexts/AuthContext';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <UrlHistoryProvider>
          <GamificationProvider>
            <Router>
              <Layout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<LoginForm />} />
                  <Route path="/signup" element={<SignupForm />} />
                  <Route
                    path="/analysis"
                    element={
                      <PrivateRoute>
                        <Analysis />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/history"
                    element={
                      <PrivateRoute>
                        <History />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/dashboard"
                    element={
                      <PrivateRoute>
                        <UserDashboard />
                      </PrivateRoute>
                    }
                  />
                  <Route path="/about" element={<About />} />
                </Routes>
              </Layout>
            </Router>
          </GamificationProvider>
        </UrlHistoryProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;