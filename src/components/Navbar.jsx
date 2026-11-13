import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Sparkles, User, Shield } from 'lucide-react';
import { useAuth } from '../context/authContextBase';
import MagneticButton from './MagneticButton';

const NAV_ITEMS = [
  { label: 'Home', hash: '#home' },
  { label: 'About', hash: '#about' },
  { label: 'Events', hash: '#events' },
  { label: 'Schedule', hash: '#schedule' },
  { label: 'Gallery', hash: '#gallery' },
  { label: 'Sponsors', hash: '#sponsors' },
  { label: 'Team', hash: '#team' },
  { label: 'Contact', hash: '#contact' }
];

const Navbar = ({ onRegisterClick }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleAnchor = (hash) => {
    setMobileOpen(false);
    if (location.pathname !== '/') {
      navigate(`/${hash}`);
      setTimeout(() => {
        const el = document.querySelector(hash);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 120);
      return;
    }
    const target = document.querySelector(hash);
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'border-b border-white/10 bg-[#04060f]/85 py-3 backdrop-blur-xl'
          : 'bg-transparent py-4'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-white">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 shadow-lg shadow-purple-500/30">
            <Sparkles size={18} className="text-white" />
          </span>
          <span>
            ABIT FEST <span className="text-gradient-fest">2026</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-5 lg:flex" aria-label="Main navigation">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => handleAnchor(item.hash)}
              className="text-sm font-medium text-slate-300 transition-colors hover:text-white"
            >
              {item.label}
            </button>
          ))}

          <Link
            to="/student-dashboard"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-300 transition-colors hover:text-white"
          >
            <User size={15} /> {isAuthenticated ? 'Dashboard' : 'Student Portal'}
          </Link>

          <Link
            to="/admin"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-pink-300 transition-colors hover:text-white"
          >
            <Shield size={15} /> {isAdmin ? 'Admin Console' : 'Admin'}
          </Link>

          <MagneticButton
            onClick={() => {
              if (onRegisterClick) onRegisterClick();
              else handleAnchor('#events');
            }}
            className="btn-gradient px-5 py-2.5 text-sm"
          >
            Register Now
          </MagneticButton>
        </nav>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label="Toggle navigation menu"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white lg:hidden"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="border-t border-white/10 bg-[#050816]/95 px-6 py-5 backdrop-blur-xl lg:hidden">
          <div className="flex flex-col gap-3">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => handleAnchor(item.hash)}
                className="py-1.5 text-left text-base font-medium text-slate-200 hover:text-white"
              >
                {item.label}
              </button>
            ))}
            <div className="my-2 h-px bg-white/10" />
            <Link
              to="/student-dashboard"
              onClick={() => setMobileOpen(false)}
              className="py-1.5 text-base font-medium text-blue-300"
            >
              Student Dashboard
            </Link>
            <Link
              to="/admin"
              onClick={() => setMobileOpen(false)}
              className="py-1.5 text-base font-medium text-pink-300"
            >
              Admin Dashboard
            </Link>
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                if (onRegisterClick) onRegisterClick();
                else handleAnchor('#events');
              }}
              className="btn-gradient mt-2 w-full py-3 text-center text-sm"
            >
              Register Now
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
