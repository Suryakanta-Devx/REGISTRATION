import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarPlus,
  Clock,
  Users,
  Mic,
  Award,
  Image as ImageIcon,
  FileSpreadsheet,
  FileText,
  Settings,
  Bell,
  LogOut,
  CheckCircle,
  XCircle,
  Pencil,
  Trash2
} from 'lucide-react';
import { useAuth } from '../context/authContextBase';
import { apiRequest, downloadAuthorizedFile } from '../services/api';

const CATEGORIES = ['Technical', 'Robotics', 'Cultural', 'Sports', 'Creative', 'Gaming', 'Academic'];

const EMPTY_EVENT = {
  title: '',
  category: 'Technical',
  description: '',
  posterUrl: '',
  date: '2026-12-18',
  time: '10:00 AM - 04:00 PM',
  venue: 'ABIT Main Auditorium',
  participationMode: 'Both',
  maxTeamSize: 4,
  fee: 0,
  status: 'Upcoming'
};

const AdminDashboard = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [tab, setTab] = useState('overview');

  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [speakers, setSpeakers] = useState([]);
  const [sponsors, setSponsors] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [settings, setSettings] = useState({ festivalDate: '2026-12-18T09:00:00+05:30', festivalName: 'ABIT FEST 2026', venue: '' });

  // Event form
  const [eventForm, setEventForm] = useState(EMPTY_EVENT);
  const [posterFile, setPosterFile] = useState(null);
  const [editingId, setEditingId] = useState(null);

  // Schedule form
  const [schedForm, setSchedForm] = useState({ day: 'Day 1 • Dec 18', time: '10:00 AM', title: '', venue: '', category: 'Technical', speakerOrLead: '', description: '' });
  // Speaker form
  const [speakerForm, setSpeakerForm] = useState({ name: '', designation: '', organization: '', topic: '', bio: '', imageUrl: '' });
  // Sponsor form
  const [sponsorForm, setSponsorForm] = useState({ name: '', tier: 'Gold', logoUrl: '', website: '' });
  // Gallery form
  const [galleryForm, setGalleryForm] = useState({ title: '', mediaType: 'image', url: '', category: 'Highlights' });
  const [galleryFile, setGalleryFile] = useState(null);
  // Notification form
  const [notifForm, setNotifForm] = useState({ title: '', message: '', type: 'announcement' });
  // Participant filter
  const [eventFilter, setEventFilter] = useState('All');
  const [statusMessage, setStatusMessage] = useState('');

  const loadAll = async () => {
    try {
      const [evs, regs, sched, spks, spons, gal, sets] = await Promise.all([
        apiRequest('/events'),
        apiRequest('/registrations'),
        apiRequest('/schedule'),
        apiRequest('/speakers'),
        apiRequest('/sponsors'),
        apiRequest('/gallery'),
        apiRequest('/settings')
      ]);
      setEvents(evs);
      setRegistrations(regs);
      setSchedule(sched);
      setSpeakers(spks);
      setSponsors(spons);
      setGallery(gal);
      setSettings(sets);
    } catch (err) {
      setStatusMessage(err.message);
    }
  };

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) return;
    let active = true;
    Promise.all([
      apiRequest('/events'),
      apiRequest('/registrations'),
      apiRequest('/schedule'),
      apiRequest('/speakers'),
      apiRequest('/sponsors'),
      apiRequest('/gallery'),
      apiRequest('/settings')
    ])
      .then(([evs, regs, sched, spks, spons, gal, sets]) => {
        if (!active) return;
        setEvents(evs);
        setRegistrations(regs);
        setSchedule(sched);
        setSpeakers(spks);
        setSponsors(spons);
        setGallery(gal);
        setSettings(sets);
      })
      .catch((err) => {
        if (active) setStatusMessage(err.message);
      });
    return () => {
      active = false;
    };
  }, [isAuthenticated, isAdmin]);

  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="mx-auto max-w-xl px-4 pt-32 pb-20">
        <div className="glass-panel rounded-3xl p-8 text-center">
          <h1 className="text-2xl font-bold text-white sm:text-3xl">Admin Authorization Required</h1>
          <p className="mt-2 text-sm text-slate-400">
            {isAuthenticated
              ? `Signed in as ${user?.email} (${user?.role}). Only administrator accounts can access the Admin Dashboard.`
              : 'Sign in with an administrator account to manage events, schedules, registrations, speakers, sponsors, gallery, and reports.'}
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link to="/auth" state={{ from: '/admin' }} className="btn-gradient px-6 py-3 text-sm">
              Admin Login
            </Link>
            {isAuthenticated && (
              <button type="button" onClick={logout} className="rounded-full border border-white/15 px-5 py-3 text-sm text-slate-300">
                Switch Account
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  const notify = (msg) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(''), 3500);
  };

  const handleSaveEvent = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(eventForm).forEach(([k, v]) => fd.append(k, String(v)));
    if (posterFile) fd.append('poster', posterFile);

    if (editingId) {
      await apiRequest(`/events/${editingId}`, { method: 'PUT', body: fd });
      notify('Event updated successfully.');
    } else {
      await apiRequest('/events', { method: 'POST', body: fd });
      notify('Event created successfully.');
    }
    setEventForm(EMPTY_EVENT);
    setPosterFile(null);
    setEditingId(null);
    await loadAll();
  };

  const handleDeleteEvent = async (id) => {
    await apiRequest(`/events/${id}`, { method: 'DELETE' });
    notify('Event deleted.');
    await loadAll();
  };

  const handleStatusUpdate = async (regId, status) => {
    await apiRequest(`/registrations/${regId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
    notify(`Registration marked ${status}.`);
    await loadAll();
  };

  const handleAddSchedule = async (e) => {
    e.preventDefault();
    await apiRequest('/schedule', { method: 'POST', body: JSON.stringify(schedForm) });
    setSchedForm({ day: 'Day 1 • Dec 18', time: '10:00 AM', title: '', venue: '', category: 'Technical', speakerOrLead: '', description: '' });
    notify('Schedule item added.');
    await loadAll();
  };

  const handleAddSpeaker = async (e) => {
    e.preventDefault();
    await apiRequest('/speakers', { method: 'POST', body: JSON.stringify(speakerForm) });
    setSpeakerForm({ name: '', designation: '', organization: '', topic: '', bio: '', imageUrl: '' });
    notify('Speaker added.');
    await loadAll();
  };

  const handleAddSponsor = async (e) => {
    e.preventDefault();
    await apiRequest('/sponsors', { method: 'POST', body: JSON.stringify(sponsorForm) });
    setSponsorForm({ name: '', tier: 'Gold', logoUrl: '', website: '' });
    notify('Sponsor added.');
    await loadAll();
  };

  const handleAddGallery = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(galleryForm).forEach(([k, v]) => fd.append(k, String(v)));
    if (galleryFile) fd.append('media', galleryFile);
    await apiRequest('/gallery', { method: 'POST', body: fd });
    setGalleryForm({ title: '', mediaType: 'image', url: '', category: 'Highlights' });
    setGalleryFile(null);
    notify('Gallery item added.');
    await loadAll();
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    await apiRequest('/settings', { method: 'PUT', body: JSON.stringify(settings) });
    notify('Countdown target date & festival settings saved.');
  };

  const handleSendAnnouncement = async (e) => {
    e.preventDefault();
    await apiRequest('/notifications', { method: 'POST', body: JSON.stringify(notifForm) });
    setNotifForm({ title: '', message: '', type: 'announcement' });
    notify('Announcement sent to all Student Dashboards.');
  };

  const filteredParticipants =
    eventFilter === 'All'
      ? registrations
      : registrations.filter((r) => (r.eventId?._id || r.eventId) === eventFilter);

  return (
    <div className="mx-auto max-w-7xl px-4 pt-28 pb-20 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white sm:text-4xl">
            Admin <span className="text-gradient-fest">Control Center</span>
          </h1>
          <p className="text-sm text-slate-400">Manage ABIT FEST 2026 events, posters, schedules, participants, speakers, sponsors, gallery &amp; exports.</p>
        </div>
        <button
          type="button"
          onClick={logout}
          className="inline-flex items-center gap-2 rounded-full border border-rose-500/40 px-4 py-2 text-xs font-semibold text-rose-300"
        >
          <LogOut size={15} /> Logout
        </button>
      </div>

      {statusMessage && (
        <div className="mb-5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
          {statusMessage}
        </div>
      )}

      <div className="glass-panel grid overflow-hidden rounded-3xl lg:grid-cols-[240px_1fr]">
        <aside className="border-b border-white/10 bg-black/30 p-4 lg:border-r lg:border-b-0">
          <div className="flex flex-wrap gap-1.5 lg:flex-col">
            {[
              { id: 'overview', label: 'Overview & Reports', icon: LayoutDashboard },
              { id: 'events', label: 'Events & Posters', icon: CalendarPlus },
              { id: 'registrations', label: 'Registrations & Approval', icon: Users },
              { id: 'schedule', label: 'Event Schedule', icon: Clock },
              { id: 'speakers', label: 'Speakers & Guests', icon: Mic },
              { id: 'sponsors', label: 'Sponsors', icon: Award },
              { id: 'gallery', label: 'Gallery', icon: ImageIcon },
              { id: 'notifications', label: 'Announcements', icon: Bell },
              { id: 'settings', label: 'Countdown & Settings', icon: Settings }
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setTab(item.id)}
                  className={`flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-left text-xs font-medium transition sm:text-sm ${
                    tab === item.id
                      ? 'border border-blue-400/30 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white'
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
          {tab === 'overview' && (
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-4">
                <div className="rounded-2xl border border-white/10 bg-black/30 p-4 text-center">
                  <div className="text-xs text-slate-400">Total Events</div>
                  <div className="mt-1 text-3xl font-bold text-blue-400">{events.length}</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/30 p-4 text-center">
                  <div className="text-xs text-slate-400">Registrations</div>
                  <div className="mt-1 text-3xl font-bold text-purple-400">{registrations.length}</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/30 p-4 text-center">
                  <div className="text-xs text-slate-400">Pending Approval</div>
                  <div className="mt-1 text-3xl font-bold text-amber-300">
                    {registrations.filter((r) => r.status === 'Pending').length}
                  </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/30 p-4 text-center">
                  <div className="text-xs text-slate-400">Approved</div>
                  <div className="mt-1 text-3xl font-bold text-emerald-400">
                    {registrations.filter((r) => r.status === 'Approved').length}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/30 p-6">
                <h2 className="text-lg font-bold text-white">Export Reports</h2>
                <p className="mt-1 text-sm text-slate-400">Download full participant lists directly from MongoDB in Excel (.xlsx) or PDF format.</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => downloadAuthorizedFile('/reports/excel', 'ABIT-FEST-2026-Registrations.xlsx')}
                    className="btn-gradient inline-flex items-center gap-2 px-5 py-2.5 text-sm"
                  >
                    <FileSpreadsheet size={16} /> Export Excel (.xlsx)
                  </button>
                  <button
                    type="button"
                    onClick={() => downloadAuthorizedFile('/reports/pdf', 'ABIT-FEST-2026-Admin-Report.pdf')}
                    className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10"
                  >
                    <FileText size={16} /> Export PDF (.pdf)
                  </button>
                </div>
              </div>
            </div>
          )}

          {tab === 'events' && (
            <div className="space-y-8">
              <form onSubmit={handleSaveEvent} className="space-y-4 rounded-2xl border border-white/10 bg-black/30 p-5">
                <h2 className="text-lg font-bold text-white">{editingId ? 'Edit Event' : 'Create New Event'}</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  <input required placeholder="Event Title" value={eventForm.title} onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })} className="rounded-xl border border-white/10 bg-black/40 px-4 py-2 text-sm text-white" />
                  <select value={eventForm.category} onChange={(e) => setEventForm({ ...eventForm, category: e.target.value })} className="rounded-xl border border-white/10 bg-[#0b1022] px-4 py-2 text-sm text-white">
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <input type="date" required value={eventForm.date} onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })} className="rounded-xl border border-white/10 bg-black/40 px-4 py-2 text-sm text-white" />
                  <input required placeholder="Time (e.g. 10:00 AM - 04:00 PM)" value={eventForm.time} onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })} className="rounded-xl border border-white/10 bg-black/40 px-4 py-2 text-sm text-white" />
                  <input required placeholder="Venue" value={eventForm.venue} onChange={(e) => setEventForm({ ...eventForm, venue: e.target.value })} className="rounded-xl border border-white/10 bg-black/40 px-4 py-2 text-sm text-white" />
                  <select value={eventForm.status} onChange={(e) => setEventForm({ ...eventForm, status: e.target.value })} className="rounded-xl border border-white/10 bg-[#0b1022] px-4 py-2 text-sm text-white">
                    <option value="Upcoming">Upcoming</option>
                    <option value="Ongoing">Ongoing</option>
                    <option value="Completed">Completed</option>
                  </select>
                  <input placeholder="Poster URL (or upload file below)" value={eventForm.posterUrl} onChange={(e) => setEventForm({ ...eventForm, posterUrl: e.target.value })} className="rounded-xl border border-white/10 bg-black/40 px-4 py-2 text-sm text-white" />
                  <input type="file" accept="image/*" onChange={(e) => setPosterFile(e.target.files?.[0] || null)} className="rounded-xl border border-white/10 bg-black/40 px-3 py-1.5 text-xs text-slate-300" />
                </div>
                <textarea required rows={3} placeholder="Event Description" value={eventForm.description} onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })} className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2 text-sm text-white" />
                <div className="flex gap-3">
                  <button type="submit" className="btn-gradient px-6 py-2.5 text-sm">{editingId ? 'Update Event' : 'Add Event'}</button>
                  {editingId && (
                    <button type="button" onClick={() => { setEditingId(null); setEventForm(EMPTY_EVENT); }} className="rounded-full border border-white/15 px-5 py-2 text-sm text-slate-300">Cancel</button>
                  )}
                </div>
              </form>

              <div className="space-y-3">
                {events.map((ev) => (
                  <div key={ev._id} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/30 p-4">
                    <div>
                      <div className="text-xs font-semibold text-blue-300">{ev.category} • {ev.status}</div>
                      <div className="font-bold text-white">{ev.title}</div>
                      <div className="text-xs text-slate-400">{ev.date} | {ev.venue}</div>
                    </div>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => { setEditingId(ev._id); setEventForm(ev); }} className="inline-flex items-center gap-1 rounded-full border border-white/15 px-3 py-1.5 text-xs text-white"><Pencil size={13} /> Edit</button>
                      <button type="button" onClick={() => handleDeleteEvent(ev._id)} className="inline-flex items-center gap-1 rounded-full border border-rose-500/40 px-3 py-1.5 text-xs text-rose-300"><Trash2 size={13} /> Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'registrations' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-lg font-bold text-white">Registered Students &amp; Participants</h2>
                <select value={eventFilter} onChange={(e) => setEventFilter(e.target.value)} className="rounded-xl border border-white/10 bg-[#0b1022] px-4 py-2 text-xs text-white">
                  <option value="All">All Events</option>
                  {events.map((ev) => <option key={ev._id} value={ev._id}>{ev.title}</option>)}
                </select>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-white/10 text-slate-400">
                      <th className="py-3">Reg ID</th>
                      <th>Student</th>
                      <th>Event</th>
                      <th>Participation</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredParticipants.map((r) => (
                      <tr key={r._id} className="border-b border-white/5 text-slate-200">
                        <td className="py-3 font-semibold text-blue-400">{r.registrationId}</td>
                        <td>
                          <div>{r.studentName}</div>
                          <div className="text-xs text-slate-400">{r.rollNumber} • {r.email}</div>
                        </td>
                        <td>{r.eventTitle}</td>
                        <td>{r.participationType}{r.teamName ? ` (${r.teamName})` : ''}</td>
                        <td>{r.status}</td>
                        <td className="space-x-2">
                          <button type="button" onClick={() => handleStatusUpdate(r._id, 'Approved')} className="inline-flex items-center gap-1 text-emerald-400"><CheckCircle size={14} /> Approve</button>
                          <button type="button" onClick={() => handleStatusUpdate(r._id, 'Rejected')} className="inline-flex items-center gap-1 text-rose-400"><XCircle size={14} /> Reject</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {tab === 'schedule' && (
            <div className="space-y-6">
              <form onSubmit={handleAddSchedule} className="grid gap-3 rounded-2xl border border-white/10 bg-black/30 p-5 sm:grid-cols-2">
                <input required placeholder="Day (e.g. Day 1 • Dec 18)" value={schedForm.day} onChange={(e) => setSchedForm({ ...schedForm, day: e.target.value })} className="rounded-xl border border-white/10 bg-black/40 px-4 py-2 text-sm text-white" />
                <input required placeholder="Time (e.g. 11:00 AM)" value={schedForm.time} onChange={(e) => setSchedForm({ ...schedForm, time: e.target.value })} className="rounded-xl border border-white/10 bg-black/40 px-4 py-2 text-sm text-white" />
                <input required placeholder="Session Title" value={schedForm.title} onChange={(e) => setSchedForm({ ...schedForm, title: e.target.value })} className="rounded-xl border border-white/10 bg-black/40 px-4 py-2 text-sm text-white" />
                <input required placeholder="Venue" value={schedForm.venue} onChange={(e) => setSchedForm({ ...schedForm, venue: e.target.value })} className="rounded-xl border border-white/10 bg-black/40 px-4 py-2 text-sm text-white" />
                <input required placeholder="Category" value={schedForm.category} onChange={(e) => setSchedForm({ ...schedForm, category: e.target.value })} className="rounded-xl border border-white/10 bg-black/40 px-4 py-2 text-sm text-white" />
                <input placeholder="Speaker / Lead" value={schedForm.speakerOrLead} onChange={(e) => setSchedForm({ ...schedForm, speakerOrLead: e.target.value })} className="rounded-xl border border-white/10 bg-black/40 px-4 py-2 text-sm text-white" />
                <button type="submit" className="btn-gradient px-5 py-2.5 text-sm sm:col-span-2">Add Schedule Item</button>
              </form>
              <div className="space-y-2">
                {schedule.map((s) => (
                  <div key={s._id} className="flex items-center justify-between rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm">
                    <div><strong className="text-white">{s.title}</strong> <span className="text-slate-400">({s.day} • {s.time} • {s.venue})</span></div>
                    <button type="button" onClick={async () => { await apiRequest(`/schedule/${s._id}`, { method: 'DELETE' }); await loadAll(); }} className="text-rose-400"><Trash2 size={15} /></button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'speakers' && (
            <div className="space-y-6">
              <form onSubmit={handleAddSpeaker} className="grid gap-3 rounded-2xl border border-white/10 bg-black/30 p-5 sm:grid-cols-2">
                <input required placeholder="Speaker Name" value={speakerForm.name} onChange={(e) => setSpeakerForm({ ...speakerForm, name: e.target.value })} className="rounded-xl border border-white/10 bg-black/40 px-4 py-2 text-sm text-white" />
                <input required placeholder="Designation" value={speakerForm.designation} onChange={(e) => setSpeakerForm({ ...speakerForm, designation: e.target.value })} className="rounded-xl border border-white/10 bg-black/40 px-4 py-2 text-sm text-white" />
                <input placeholder="Organization" value={speakerForm.organization} onChange={(e) => setSpeakerForm({ ...speakerForm, organization: e.target.value })} className="rounded-xl border border-white/10 bg-black/40 px-4 py-2 text-sm text-white" />
                <input placeholder="Topic" value={speakerForm.topic} onChange={(e) => setSpeakerForm({ ...speakerForm, topic: e.target.value })} className="rounded-xl border border-white/10 bg-black/40 px-4 py-2 text-sm text-white" />
                <input placeholder="Image URL (optional)" value={speakerForm.imageUrl} onChange={(e) => setSpeakerForm({ ...speakerForm, imageUrl: e.target.value })} className="rounded-xl border border-white/10 bg-black/40 px-4 py-2 text-sm text-white sm:col-span-2" />
                <textarea required placeholder="Short Bio" value={speakerForm.bio} onChange={(e) => setSpeakerForm({ ...speakerForm, bio: e.target.value })} className="rounded-xl border border-white/10 bg-black/40 px-4 py-2 text-sm text-white sm:col-span-2" />
                <button type="submit" className="btn-gradient px-5 py-2.5 text-sm sm:col-span-2">Add Speaker</button>
              </form>
              <div className="space-y-2">
                {speakers.map((sp) => (
                  <div key={sp._id} className="flex items-center justify-between rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm">
                    <div><strong className="text-white">{sp.name}</strong> <span className="text-slate-400">— {sp.designation}</span></div>
                    <button type="button" onClick={async () => { await apiRequest(`/speakers/${sp._id}`, { method: 'DELETE' }); await loadAll(); }} className="text-rose-400"><Trash2 size={15} /></button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'sponsors' && (
            <div className="space-y-6">
              <form onSubmit={handleAddSponsor} className="grid gap-3 rounded-2xl border border-white/10 bg-black/30 p-5 sm:grid-cols-2">
                <input required placeholder="Sponsor Name" value={sponsorForm.name} onChange={(e) => setSponsorForm({ ...sponsorForm, name: e.target.value })} className="rounded-xl border border-white/10 bg-black/40 px-4 py-2 text-sm text-white" />
                <select value={sponsorForm.tier} onChange={(e) => setSponsorForm({ ...sponsorForm, tier: e.target.value })} className="rounded-xl border border-white/10 bg-[#0b1022] px-4 py-2 text-sm text-white">
                  <option value="Title">Title</option><option value="Platinum">Platinum</option><option value="Gold">Gold</option><option value="Community">Community</option>
                </select>
                <input placeholder="Logo URL (optional)" value={sponsorForm.logoUrl} onChange={(e) => setSponsorForm({ ...sponsorForm, logoUrl: e.target.value })} className="rounded-xl border border-white/10 bg-black/40 px-4 py-2 text-sm text-white" />
                <input placeholder="Website URL" value={sponsorForm.website} onChange={(e) => setSponsorForm({ ...sponsorForm, website: e.target.value })} className="rounded-xl border border-white/10 bg-black/40 px-4 py-2 text-sm text-white" />
                <button type="submit" className="btn-gradient px-5 py-2.5 text-sm sm:col-span-2">Add Sponsor</button>
              </form>
              <div className="space-y-2">
                {sponsors.map((sp) => (
                  <div key={sp._id} className="flex items-center justify-between rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm">
                    <div><strong className="text-white">{sp.name}</strong> <span className="text-slate-400">({sp.tier})</span></div>
                    <button type="button" onClick={async () => { await apiRequest(`/sponsors/${sp._id}`, { method: 'DELETE' }); await loadAll(); }} className="text-rose-400"><Trash2 size={15} /></button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'gallery' && (
            <div className="space-y-6">
              <form onSubmit={handleAddGallery} className="grid gap-3 rounded-2xl border border-white/10 bg-black/30 p-5 sm:grid-cols-2">
                <input required placeholder="Caption / Title" value={galleryForm.title} onChange={(e) => setGalleryForm({ ...galleryForm, title: e.target.value })} className="rounded-xl border border-white/10 bg-black/40 px-4 py-2 text-sm text-white" />
                <select value={galleryForm.mediaType} onChange={(e) => setGalleryForm({ ...galleryForm, mediaType: e.target.value })} className="rounded-xl border border-white/10 bg-[#0b1022] px-4 py-2 text-sm text-white">
                  <option value="image">Image</option><option value="video">Video</option>
                </select>
                <input placeholder="Media URL (or upload image)" value={galleryForm.url} onChange={(e) => setGalleryForm({ ...galleryForm, url: e.target.value })} className="rounded-xl border border-white/10 bg-black/40 px-4 py-2 text-sm text-white" />
                <input type="file" accept="image/*" onChange={(e) => setGalleryFile(e.target.files?.[0] || null)} className="rounded-xl border border-white/10 bg-black/40 px-3 py-1.5 text-xs text-slate-300" />
                <button type="submit" className="btn-gradient px-5 py-2.5 text-sm sm:col-span-2">Add Gallery Item</button>
              </form>
              <div className="space-y-2">
                {gallery.map((g) => (
                  <div key={g._id} className="flex items-center justify-between rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm">
                    <div><strong className="text-white">{g.title}</strong> <span className="text-slate-400">({g.mediaType})</span></div>
                    <button type="button" onClick={async () => { await apiRequest(`/gallery/${g._id}`, { method: 'DELETE' }); await loadAll(); }} className="text-rose-400"><Trash2 size={15} /></button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'notifications' && (
            <form onSubmit={handleSendAnnouncement} className="max-w-xl space-y-4">
              <h2 className="text-lg font-bold text-white">Send Announcement</h2>
              <input required placeholder="Announcement Title" value={notifForm.title} onChange={(e) => setNotifForm({ ...notifForm, title: e.target.value })} className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm text-white" />
              <select value={notifForm.type} onChange={(e) => setNotifForm({ ...notifForm, type: e.target.value })} className="w-full rounded-xl border border-white/10 bg-[#0b1022] px-4 py-2.5 text-sm text-white">
                <option value="announcement">Announcement</option><option value="urgent">Urgent</option><option value="schedule">Schedule Update</option>
              </select>
              <textarea required rows={3} placeholder="Message" value={notifForm.message} onChange={(e) => setNotifForm({ ...notifForm, message: e.target.value })} className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm text-white" />
              <button type="submit" className="btn-gradient px-6 py-2.5 text-sm">Broadcast Notification</button>
            </form>
          )}

          {tab === 'settings' && (
            <form onSubmit={handleSaveSettings} className="max-w-xl space-y-4">
              <h2 className="text-lg font-bold text-white">Countdown Target Date &amp; Festival Config</h2>
              <div>
                <label className="mb-1 block text-xs text-slate-300">Target Festival Date &amp; Time (ISO)</label>
                <input
                  type="text"
                  required
                  value={settings.festivalDate}
                  onChange={(e) => setSettings({ ...settings, festivalDate: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm text-white"
                />
                <p className="mt-1 text-xs text-slate-400">Example: 2026-12-18T09:00:00+05:30</p>
              </div>
              <div>
                <label className="mb-1 block text-xs text-slate-300">Festival Tagline</label>
                <input
                  type="text"
                  value={settings.tagline}
                  onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm text-white"
                />
              </div>
              <button type="submit" className="btn-gradient px-6 py-2.5 text-sm">Save Festival Settings</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
