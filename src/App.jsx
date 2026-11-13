import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Preloader from './components/Preloader';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import AuthPage from './pages/AuthPage';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';

function AppShell() {
  const [preloaderVisible, setPreloaderVisible] = useState(true);
  const [navbarModalOpen, setNavbarModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setPreloaderVisible(false), 1100);
    return () => clearTimeout(timer);
  }, []);

  const handleGlobalRegisterClick = () => {
    navigate('/');
    setNavbarModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#04060f] text-slate-100">
      <Preloader visible={preloaderVisible} />
      <Navbar onRegisterClick={handleGlobalRegisterClick} />
      <main>
        <Routes>
          <Route
            path="/"
            element={
              <Home
                externalModalOpen={navbarModalOpen}
                onCloseExternalModal={() => setNavbarModalOpen(false)}
              />
            }
          />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/dashboard" element={<StudentDashboard />} />
          <Route path="/admin/*" element={<AdminDashboard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppShell />
      </Router>
    </AuthProvider>
  );
}

export default App;
