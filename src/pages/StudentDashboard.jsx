import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  User,
  Ticket,
  Calendar,
  History,
  Bell,
  Download,
  XCircle,
  LogOut,
  CheckCircle
} from 'lucide-react';
import { useAuth } from '../context/authContextBase';
import { apiRequest, downloadAuthorizedFile } from '../services/api';
import RegistrationModal from '../components/RegistrationModal';

const STATUS_BADGE = {
  Approved: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  Pending: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  Rejected: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
  Cancelled: 'bg-slate-500/15 text-slate-300 border-slate-500/30'
};

const StudentDashboard = () => {
  const { user, isAuthenticated, updateProfile, logout } = useAuth();
  const [tab, setTab] = useState('registrations');
  const [registrations, setRegistrations] = useState([]);
  const [events, setEvents] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lookupId, setLookupId] = useState('');
  const [lookupReg, setLookupReg] = useState(null);
  const [lookupErr, setLookupErr] = useState('');

  // Profile edit state
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    rollNumber: user?.rollNumber || '',
    registrationNumber: user?.registrationNumber || '',
    department: user?.department || '',
    semester: user?.semester || '',
    phone: user?.phone || ''
  });
  const [profileSaved, setProfileSaved] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const loadData = async () => {
    try {
      const [evs, notifs] = await Promise.all([apiRequest('/events'), apiRequest('/notifications')]);
      setEvents(evs);
      setNotifications(notifs);
      if (isAuthenticated) {
        const myRegs = await apiRequest('/registrations/my');
        setRegistrations(myRegs);
      }
    } catch {
      // Handled gracefully
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    Promise.all([
      apiRequest('/events'),
      apiRequest('/notifications'),
      isAuthenticated ? apiRequest('/registrations/my') : Promise.resolve([])
    ])
      .then(([evs, notifs, myRegs]) => {
        if (!active) return;
        setEvents(evs);
        setNotifications(notifs);
        setRegistrations(myRegs);
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [isAuthenticated]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setProfileSaved('');
    await updateProfile(profileForm);
    setProfileSaved('Profile updated successfully.');
  };

  const handleCancel = async (id) => {
    try {
      await apiRequest(`/registrations/${id}/cancel`, { method: 'PATCH' });
      await loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleGuestLookup = async (e) => {
    e.preventDefault();
    setLookupErr('');
    setLookupReg(null);
    try {
      const data = await apiRequest(`/registrations/lookup/${encodeURIComponent(lookupId.trim())}`);
      setLookupReg(data);
    } catch (err) {
      setLookupErr(err.message);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-4xl px-4 pt-32 pb-20">
        <div className="glass-panel rounded-3xl p-8 text-center">
          <h1 className="text-3xl font-bold text-white">
            Student <span className="text-gradient-fest">Dashboard</span>
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Sign in with your Student JWT account to manage your profile, registrations, QR passes, PDF receipts, and notifications.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link to="/auth" state={{ from: '/student-dashboard' }} className="btn-gradient px-6 py-3 text-sm">
              Login / Sign Up
            </Link>
          </div>

          <div className="mt-8 border-t border-white/10 pt-6 text-left">
            <h2 className="text-base font-bold text-white">Quick Registration Lookup (By Registration ID)</h2>
            <form onSubmit={handleGuestLookup} className="mt-3 flex flex-wrap gap-3">
              <input
                type="text"
                required
                value={lookupId}
                onChange={(e) => setLookupId(e.target.value)}
                placeholder="Enter Registration ID (e.g. ABIT26-...)"
                className="flex-1 rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm text-white focus:border-blue-400 focus:outline-none"
              />
              <button type="submit" className="btn-gradient px-5 py-2.5 text-sm">Lookup</button>
            </form>
            {lookupErr && <p className="mt-2 text-sm text-rose-300">{lookupErr}</p>}
            {lookupReg && (
              <div className="mt-4 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/40 p-4">
                <div>
                  <div className="font-bold text-blue-400">{lookupReg.registrationId}</div>
                  <div className="text-sm text-white">{lookupReg.studentName} — {lookupReg.eventTitle}</div>
                  <div className="text-xs text-slate-400">Status: {lookupReg.status}</div>
                </div>
                <div className="flex items-center gap-3">
                  <img src={lookupReg.qrDataUrl} alt="QR" className="h-16 w-16 rounded-lg bg-white p-1" />
                  <button
                    type="button"
                    onClick={() => downloadAuthorizedFile(`/registrations/${lookupReg._id}/receipt`, `${lookupReg.registrationId}-receipt.pdf`)}
                    className="btn-gradient inline-flex items-center gap-1.5 px-4 py-2 text-xs"
                  >
                    <Download size={14} /> PDF Receipt
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  const upcomingEvents = events.filter((e) => e.status === 'Upcoming' || e.status === 'Ongoing');

  return (
    <div className="mx-auto max-w-7xl px-4 pt-28 pb-20 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white sm:text-4xl">
            Student <span className="text-gradient-fest">Dashboard</span>
          </h1>
          <p className="text-sm text-slate-400">
            Welcome, <strong className="text-white">{user?.name}</strong> ({user?.rollNumber || user?.email})
          </p>
        </div>
        <button
          type="button"
          onClick={logout}
          className="inline-flex items-center gap-2 rounded-full border border-rose-500/40 px-4 py-2 text-xs font-semibold text-rose-300 hover:bg-rose-500/10"
        >
          <LogOut size={15} /> Logout
        </button>
      </div>

      <div className="glass-panel grid overflow-hidden rounded-3xl lg:grid-cols-[240px_1fr]">
        <aside className="border-b border-white/10 bg-black/30 p-4 lg:border-r lg:border-b-0">
          <div className="flex flex-wrap gap-1.5 lg:flex-col">
            {[
              { id: 'registrations', label: 'My Registrations', icon: Ticket },
              { id: 'upcoming', label: 'Upcoming Events', icon: Calendar },
              { id: 'history', label: 'Registration History', icon: History },
              { id: 'notifications', label: 'Notifications', icon: Bell },
              { id: 'profile', label: 'Profile Management', icon: User }
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setTab(item.id)}
                  className={`flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-left text-sm font-medium transition ${
                    tab === item.id
                      ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white border border-blue-400/30'
                      : 'text-slate-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon size={16} /> {item.label}
                </button>
              );
            })}
          </div>
        </aside>

        <div className="p-6 sm:p-8">
          {loading && <p className="text-sm text-slate-400">Syncing your data...</p>}

          {tab === 'registrations' && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white">My Registrations &amp; QR Passes</h2>
              {registrations.length === 0 ? (
                <div className="rounded-2xl border border-white/10 bg-black/30 p-6 text-center text-sm text-slate-400">
                  No registrations found yet. Register for an event to get your QR code and PDF receipt.
                </div>
              ) : (
                registrations.map((r) => (
                  <div key={r._id} className="flex flex-wrap items-center justify-between gap-5 rounded-2xl border border-white/10 bg-black/30 p-5">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2.5">
                        <span className="font-['Space_Grotesk'] font-bold text-blue-400">{r.registrationId}</span>
                        <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${STATUS_BADGE[r.status] || ''}`}>
                          {r.status}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-white">{r.eventTitle}</h3>
                      <p className="text-xs text-slate-400">
                        {r.participationType} • {r.eventId?.date || ''} • {r.eventId?.venue || 'ABIT Campus'}
                      </p>
                      <div className="flex flex-wrap gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => downloadAuthorizedFile(`/registrations/${r._id}/receipt`, `${r.registrationId}-receipt.pdf`)}
                          className="btn-gradient inline-flex items-center gap-1.5 px-4 py-2 text-xs"
                        >
                          <Download size={14} /> Download Receipt
                        </button>
                        {r.status !== 'Cancelled' && (!r.eventId || r.eventId.status === 'Upcoming') && (
                          <button
                            type="button"
                            onClick={() => handleCancel(r._id)}
                            className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/40 px-4 py-2 text-xs font-semibold text-rose-300 hover:bg-rose-500/10"
                          >
                            <XCircle size={14} /> Cancel
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="text-center">
                      <img src={r.qrDataUrl} alt={`QR for ${r.registrationId}`} className="h-24 w-24 rounded-xl border border-blue-400 bg-white p-1.5" />
                      <div className="mt-1 text-[11px] text-slate-400">Entry QR</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {tab === 'upcoming' && (
            <div>
              <h2 className="mb-4 text-xl font-bold text-white">Upcoming Events</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {upcomingEvents.map((ev) => (
                  <div key={ev._id} className="rounded-2xl border border-white/10 bg-black/30 p-5">
                    <span className="text-xs font-semibold text-blue-300">{ev.category} • {ev.status}</span>
                    <h3 className="mt-1 text-lg font-bold text-white">{ev.title}</h3>
                    <p className="mt-1 text-xs text-slate-400">{ev.date} | {ev.time} | {ev.venue}</p>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedEvent(ev);
                        setModalOpen(true);
                      }}
                      className="btn-gradient mt-4 px-5 py-2 text-xs"
                    >
                      Register Now
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'history' && (
            <div>
              <h2 className="mb-4 text-xl font-bold text-white">Registration History</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-white/10 text-xs text-slate-400 uppercase">
                      <th className="py-3">Reg ID</th>
                      <th>Event</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Receipt</th>
                    </tr>
                  </thead>
                  <tbody>
                    {registrations.map((r) => (
                      <tr key={r._id} className="border-b border-white/5 text-slate-300">
                        <td className="py-3 font-semibold text-blue-400">{r.registrationId}</td>
                        <td>{r.eventTitle}</td>
                        <td>{new Date(r.createdAt).toLocaleDateString()}</td>
                        <td>{r.status}</td>
                        <td>
                          <button
                            type="button"
                            onClick={() => downloadAuthorizedFile(`/registrations/${r._id}/receipt`, `${r.registrationId}-receipt.pdf`)}
                            className="text-blue-400 underline"
                          >
                            PDF
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {tab === 'notifications' && (
            <div className="space-y-3">
              <h2 className="mb-2 text-xl font-bold text-white">Event Notifications</h2>
              {notifications.map((n) => (
                <div key={n._id} className="rounded-2xl border-l-4 border-blue-400 bg-black/30 p-4">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-bold text-white">{n.title}</h4>
                    <span className="text-xs text-slate-500">{new Date(n.createdAt).toLocaleString()}</span>
                  </div>
                  <p className="mt-1 text-sm text-slate-300">{n.message}</p>
                </div>
              ))}
            </div>
          )}

          {tab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="max-w-xl space-y-4">
              <h2 className="text-xl font-bold text-white">Profile Management</h2>
              {profileSaved && (
                <div className="flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-2.5 text-sm text-emerald-300">
                  <CheckCircle size={16} /> {profileSaved}
                </div>
              )}
              <div>
                <label className="mb-1 block text-xs text-slate-300">Full Name</label>
                <input
                  type="text"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs text-slate-300">Roll Number</label>
                  <input
                    type="text"
                    value={profileForm.rollNumber}
                    onChange={(e) => setProfileForm({ ...profileForm, rollNumber: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-slate-300">Registration No</label>
                  <input
                    type="text"
                    value={profileForm.registrationNumber}
                    onChange={(e) => setProfileForm({ ...profileForm, registrationNumber: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm text-white"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs text-slate-300">Department</label>
                  <input
                    type="text"
                    value={profileForm.department}
                    onChange={(e) => setProfileForm({ ...profileForm, department: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-slate-300">Semester</label>
                  <input
                    type="text"
                    value={profileForm.semester}
                    onChange={(e) => setProfileForm({ ...profileForm, semester: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm text-white"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs text-slate-300">Phone</label>
                <input
                  type="tel"
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm text-white"
                />
              </div>
              <button type="submit" className="btn-gradient px-6 py-2.5 text-sm">Save Profile</button>
            </form>
          )}
        </div>
      </div>

      <RegistrationModal
        key={selectedEvent?._id || 'stud-modal'}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        events={events}
        initialEvent={selectedEvent}
        onSuccess={loadData}
      />
    </div>
  );
};

export default StudentDashboard;
