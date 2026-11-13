import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, UserPlus, LogIn, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/authContextBase';
import MagneticButton from '../components/MagneticButton';

const AuthPage = () => {
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [department, setDepartment] = useState('Computer Science (CSE)');
  const [semester, setSemester] = useState('5th Semester');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const { login, registerAccount } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTarget = location.state?.from || null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      if (mode === 'login') {
        const loggedUser = await login(email, password);
        if (redirectTarget) {
          navigate(redirectTarget, { replace: true });
        } else {
          navigate(loggedUser.role === 'admin' ? '/admin' : '/student-dashboard', { replace: true });
        }
      } else {
        await registerAccount({
          name,
          email,
          password,
          rollNumber,
          registrationNumber,
          department,
          semester,
          phone
        });
        navigate('/student-dashboard', { replace: true });
      }
    } catch (err) {
      setError(err.message || 'Authentication failed.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 pt-28 pb-16">
      <div className="glass-panel w-full max-w-lg rounded-3xl p-8">
        <div className="text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white">
            {mode === 'login' ? <LogIn size={22} /> : <UserPlus size={22} />}
          </div>
          <h1 className="text-2xl font-bold text-white sm:text-3xl">
            {mode === 'login' ? 'ABIT FEST 2026 Login' : 'Create Student Account'}
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Secure JWT authentication for Student &amp; Admin Dashboards
          </p>
        </div>

        <div className="mt-6 grid grid-cols-2 rounded-full bg-black/40 p-1">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`rounded-full py-2 text-sm font-semibold transition ${
              mode === 'login' ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' : 'text-slate-400'
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => setMode('register')}
            className={`rounded-full py-2 text-sm font-semibold transition ${
              mode === 'register' ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' : 'text-slate-400'
            }`}
          >
            Student Sign Up
          </button>
        </div>

        {error && (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
            <AlertCircle size={18} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {mode === 'register' && (
            <>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-300">Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm text-white focus:border-blue-400 focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-300">Roll Number</label>
                  <input
                    type="text"
                    value={rollNumber}
                    onChange={(e) => setRollNumber(e.target.value)}
                    placeholder="ABIT23CSE042"
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm text-white focus:border-blue-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-300">Registration No</label>
                  <input
                    type="text"
                    value={registrationNumber}
                    onChange={(e) => setRegistrationNumber(e.target.value)}
                    placeholder="2301294108"
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm text-white focus:border-blue-400 focus:outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-300">Department</label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm text-white focus:border-blue-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-300">Semester</label>
                  <input
                    type="text"
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm text-white focus:border-blue-400 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-300">Phone</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm text-white focus:border-blue-400 focus:outline-none"
                />
              </div>
            </>
          )}

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-300">Email *</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@abit.edu"
              className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm text-white focus:border-blue-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-300">Password *</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm text-white focus:border-blue-400 focus:outline-none"
            />
          </div>

          <MagneticButton type="submit" disabled={busy} className="btn-gradient w-full py-3 text-sm">
            {busy ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </MagneticButton>

          <div className="flex items-center justify-center gap-1.5 pt-2 text-xs text-slate-400">
            <ShieldCheck size={14} className="text-blue-400" />
            <span>Role-based JWT authentication enabled</span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthPage;
