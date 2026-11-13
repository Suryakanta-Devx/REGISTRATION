import { useState } from 'react';
import {
  LayoutDashboard,
  CalendarPlus,
  Users,
  CheckCircle,
  XCircle,
  LogOut,
  ShieldAlert,
  Pencil,
  Trash2,
  Bell,
  FileSpreadsheet,
  FileText,
  Ticket
} from 'lucide-react';
import {
  EVENT_CATEGORIES,
  getEvents,
  addEvent,
  updateEvent,
  deleteEvent,
  getRegistrations,
  updateRegistrationStatus,
  getNotifications,
  addNotification
} from '../utils/eventStore';
import { exportRegistrationsExcelCsv, downloadAdminReportPdf } from '../utils/pdfGenerator';
import { getStoredBookings, toggleReceiptCollected } from '../utils/ticketStore';

const EMPTY_EVENT_FORM = {
  name: '',
  category: EVENT_CATEGORIES[0],
  image: '',
  date: '2026-11-30',
  time: '10:00 AM - 04:00 PM',
  venue: 'ABIT College Auditorium',
  description: '',
  status: 'Upcoming',
  fee: 199
};

const AdminPanel = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [secretCode, setSecretCode] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  // Events CRUD state
  const [events, setEvents] = useState(() => getEvents());
  const [eventForm, setEventForm] = useState(EMPTY_EVENT_FORM);
  const [editingEventId, setEditingEventId] = useState(null);

  // Registrations & Participants state
  const [registrations, setRegistrations] = useState(() => getRegistrations());
  const [regSearch, setRegSearch] = useState('');
  const [participantEventFilter, setParticipantEventFilter] = useState('All');

  // Notifications state
  const [notifications, setNotifications] = useState(() => getNotifications());
  const [notifTitle, setNotifTitle] = useState('');
  const [notifMessage, setNotifMessage] = useState('');
  const [notifType, setNotifType] = useState('announcement');

  // Ticket receipts state
  const [bookings, setBookings] = useState(() => getStoredBookings());

  const EXPECTED_SECRET = 'qwertyuiopasdfghjklzxcvbnm@#$%^&*()1234567890';
  const EXPECTED_PASSWORD = 'ABIT_ADMIN@2026';

  const handleLogin = (e) => {
    e.preventDefault();
    if (secretCode === EXPECTED_SECRET && password === EXPECTED_PASSWORD) {
      setEvents(getEvents());
      setRegistrations(getRegistrations());
      setNotifications(getNotifications());
      setBookings(getStoredBookings());
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Invalid credentials. Unauthorized access detected.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setSecretCode('');
    setPassword('');
    setActiveTab('overview');
  };

  const handleSaveEvent = (e) => {
    e.preventDefault();
    if (editingEventId) {
      const updated = updateEvent(editingEventId, eventForm);
      setEvents(updated);
      setEditingEventId(null);
    } else {
      const updated = addEvent(eventForm);
      setEvents(updated);
    }
    setEventForm(EMPTY_EVENT_FORM);
    setActiveTab('events');
  };

  const handleStartEditEvent = (ev) => {
    setEditingEventId(ev.id);
    setEventForm({
      name: ev.name,
      category: ev.category,
      image: ev.image,
      date: ev.date,
      time: ev.time,
      venue: ev.venue,
      description: ev.description,
      status: ev.status,
      fee: ev.fee || 0
    });
    setActiveTab('add-event');
  };

  const handleDeleteEvent = (eventId) => {
    setEvents(deleteEvent(eventId));
  };

  const handleRegStatusChange = (registrationId, status) => {
    const updated = updateRegistrationStatus(registrationId, status);
    setRegistrations(updated);
    setNotifications(getNotifications());
  };

  const handleSendNotification = (e) => {
    e.preventDefault();
    const updated = addNotification({
      title: notifTitle.trim(),
      message: notifMessage.trim(),
      type: notifType
    });
    setNotifications(updated);
    setNotifTitle('');
    setNotifMessage('');
  };

  const handleToggleTicketCollected = (ticketNumber) => {
    setBookings(toggleReceiptCollected(ticketNumber));
  };

  const pendingCount = registrations.filter((r) => r.status === 'Pending Approval').length;
  const approvedCount = registrations.filter((r) => r.status === 'Approved').length;

  const filteredRegistrations = registrations.filter(
    (r) =>
      r.studentName.toLowerCase().includes(regSearch.toLowerCase()) ||
      r.registrationId.toLowerCase().includes(regSearch.toLowerCase()) ||
      r.rollNumber.toLowerCase().includes(regSearch.toLowerCase()) ||
      r.eventName.toLowerCase().includes(regSearch.toLowerCase())
  );

  const filteredParticipants =
    participantEventFilter === 'All'
      ? registrations.filter((r) => r.status !== 'Cancelled' && r.status !== 'Rejected')
      : registrations.filter(
          (r) => r.eventId === participantEventFilter && r.status !== 'Cancelled' && r.status !== 'Rejected'
        );

  if (!isAuthenticated) {
    return (
      <div className="page-enter-active container section-padding" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="glass-card" style={{ maxWidth: '500px', width: '100%', padding: '3rem', border: '1px solid rgba(255, 0, 60, 0.3)', background: 'rgba(20, 0, 0, 0.5)' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <ShieldAlert size={48} color="#ff003c" style={{ margin: '0 auto 1rem' }} />
            <h2 style={{ color: '#ff003c', fontSize: '2rem' }}>Admin Command Center</h2>
            <p style={{ color: 'var(--text-muted)' }}>Ignitron 2K26 Events, Registrations &amp; Receipts</p>
          </div>

          {error && (
            <div style={{ padding: '1rem', background: 'rgba(255,0,0,0.1)', border: '1px solid #ff003c', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem', color: '#ff003c', textAlign: 'center' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">Admin Secret Code</label>
              <input
                type="password"
                className="input-field"
                placeholder="Enter 46-character secret code"
                value={secretCode}
                onChange={(e) => setSecretCode(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Master Password</label>
              <input
                type="password"
                className="input-field"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', background: 'linear-gradient(135deg, #ff003c, #990024)', boxShadow: '0 0 20px rgba(255, 0, 60, 0.4)' }}>
              Authorize &amp; Enter
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="page-enter-active container section-padding">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h1>Ignitron 2K26 <span className="text-gradient">Admin Dashboard</span></h1>
        <button onClick={handleLogout} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderColor: '#ff003c', color: '#ff003c' }}>
          <LogOut size={18} /> Terminate Session
        </button>
      </div>

      <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
        <div className="dashboard-grid">
          {/* Sidebar */}
          <div className="sidebar" style={{ borderRight: 'var(--glass-border)', background: 'rgba(0,0,0,0.3)' }}>
            <div className="sidebar-menu">
              <button className={`sidebar-link ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
                <LayoutDashboard size={18} /> Dashboard
              </button>
              <button className={`sidebar-link ${activeTab === 'events' ? 'active' : ''}`} onClick={() => setActiveTab('events')}>
                <CalendarPlus size={18} /> Manage Events
              </button>
              <button
                className={`sidebar-link ${activeTab === 'add-event' ? 'active' : ''}`}
                onClick={() => {
                  setEditingEventId(null);
                  setEventForm(EMPTY_EVENT_FORM);
                  setActiveTab('add-event');
                }}
              >
                <CalendarPlus size={18} /> Add Event
              </button>
              <button className={`sidebar-link ${activeTab === 'registrations' ? 'active' : ''}`} onClick={() => setActiveTab('registrations')}>
                <CheckCircle size={18} /> Registrations &amp; Approval
              </button>
              <button className={`sidebar-link ${activeTab === 'participants' ? 'active' : ''}`} onClick={() => setActiveTab('participants')}>
                <Users size={18} /> Participants
              </button>
              <button className={`sidebar-link ${activeTab === 'reports' ? 'active' : ''}`} onClick={() => setActiveTab('reports')}>
                <FileSpreadsheet size={18} /> Reports (Excel/PDF)
              </button>
              <button className={`sidebar-link ${activeTab === 'notifications' ? 'active' : ''}`} onClick={() => setActiveTab('notifications')}>
                <Bell size={18} /> Notifications
              </button>
              <button className={`sidebar-link ${activeTab === 'tickets' ? 'active' : ''}`} onClick={() => setActiveTab('tickets')}>
                <Ticket size={18} /> Ticket Receipts
              </button>
            </div>
          </div>

          {/* Dashboard Content */}
          <div style={{ padding: '2rem', maxHeight: '850px', overflowY: 'auto' }}>
            {activeTab === 'overview' && (
              <div>
                <h2 style={{ marginBottom: '1.5rem', color: 'var(--primary-glow)' }}>Dashboard Overview</h2>
                <div className="grid-4" style={{ gap: '1.25rem', marginBottom: '2rem' }}>
                  <div className="glass-card" style={{ padding: '1.25rem', textAlign: 'center', background: 'rgba(0, 240, 255, 0.05)' }}>
                    <h4 style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Total Events</h4>
                    <h1 style={{ fontSize: '2.5rem', color: 'var(--primary-glow)', margin: '0.4rem 0' }}>{events.length}</h1>
                  </div>
                  <div className="glass-card" style={{ padding: '1.25rem', textAlign: 'center', background: 'rgba(112, 0, 255, 0.08)' }}>
                    <h4 style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Total Registrations</h4>
                    <h1 style={{ fontSize: '2.5rem', color: 'var(--accent-glow)', margin: '0.4rem 0' }}>{registrations.length}</h1>
                  </div>
                  <div className="glass-card" style={{ padding: '1.25rem', textAlign: 'center', background: 'rgba(255, 187, 0, 0.06)' }}>
                    <h4 style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Pending Approvals</h4>
                    <h1 style={{ fontSize: '2.5rem', color: '#ffbb00', margin: '0.4rem 0' }}>{pendingCount}</h1>
                  </div>
                  <div className="glass-card" style={{ padding: '1.25rem', textAlign: 'center', background: 'rgba(0, 255, 170, 0.06)' }}>
                    <h4 style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Approved Participants</h4>
                    <h1 style={{ fontSize: '2.5rem', color: '#00ffaa', margin: '0.4rem 0' }}>{approvedCount}</h1>
                  </div>
                </div>

                <div className="glass-card" style={{ padding: '1.5rem' }}>
                  <h3 style={{ marginBottom: '1rem' }}>Latest Event Registrations</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    {registrations.slice(0, 5).map((r) => (
                      <p key={r.registrationId} style={{ padding: '0.9rem', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--primary-glow)' }}>
                        <strong>{r.studentName}</strong> ({r.rollNumber}) registered for <strong>{r.eventName}</strong> — ID: <strong style={{ color: 'var(--primary-glow)' }}>{r.registrationId}</strong> ({r.status})
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'events' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                  <h2 style={{ color: 'var(--primary-glow)' }}>Manage Events (Edit / Delete)</h2>
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={() => {
                      setEditingEventId(null);
                      setEventForm(EMPTY_EVENT_FORM);
                      setActiveTab('add-event');
                    }}
                  >
                    + Add New Event
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {events.map((ev) => (
                    <div key={ev.id} className="glass-card" style={{ padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                      <div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--primary-glow)', fontWeight: 600 }}>
                          {ev.category} • {ev.status}
                        </div>
                        <h3 style={{ fontSize: '1.2rem' }}>{ev.name}</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                          {ev.date} | {ev.time} | {ev.venue}
                        </p>
                      </div>
                      <div style={{ display: 'flex', gap: '0.6rem' }}>
                        <button
                          type="button"
                          className="btn-secondary"
                          style={{ padding: '0.45rem 0.9rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                          onClick={() => handleStartEditEvent(ev)}
                        >
                          <Pencil size={15} /> Edit
                        </button>
                        <button
                          type="button"
                          className="btn-secondary"
                          style={{ padding: '0.45rem 0.9rem', borderColor: '#ff003c', color: '#ff003c', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                          onClick={() => handleDeleteEvent(ev.id)}
                        >
                          <Trash2 size={15} /> Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'add-event' && (
              <div>
                <h2 style={{ marginBottom: '1.5rem', color: 'var(--primary-glow)' }}>
                  {editingEventId ? 'Edit College Event' : 'Add New College Event'}
                </h2>
                <form onSubmit={handleSaveEvent}>
                  <div className="grid-2" style={{ gap: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label">Event Name *</label>
                      <input
                        type="text"
                        className="input-field"
                        placeholder="e.g. Annual Function 2026"
                        value={eventForm.name}
                        onChange={(e) => setEventForm({ ...eventForm, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Category *</label>
                      <select
                        className="input-field"
                        value={eventForm.category}
                        onChange={(e) => setEventForm({ ...eventForm, category: e.target.value })}
                      >
                        {EVENT_CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Date *</label>
                      <input
                        type="date"
                        className="input-field"
                        value={eventForm.date}
                        onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Time *</label>
                      <input
                        type="text"
                        className="input-field"
                        placeholder="e.g. 04:00 PM - 09:00 PM"
                        value={eventForm.time}
                        onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Venue *</label>
                      <input
                        type="text"
                        className="input-field"
                        placeholder="e.g. College Auditorium"
                        value={eventForm.venue}
                        onChange={(e) => setEventForm({ ...eventForm, venue: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Status *</label>
                      <select
                        className="input-field"
                        value={eventForm.status}
                        onChange={(e) => setEventForm({ ...eventForm, status: e.target.value })}
                      >
                        <option value="Upcoming">Upcoming</option>
                        <option value="Ongoing">Ongoing</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Event Banner Image URL (Optional — auto-generates Ignitron neon poster if blank)</label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="Leave blank for auto-generated event poster"
                      value={eventForm.image}
                      onChange={(e) => setEventForm({ ...eventForm, image: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Description *</label>
                    <textarea
                      className="input-field"
                      rows="4"
                      placeholder="Describe the event details..."
                      value={eventForm.description}
                      onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                      required
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <button type="submit" className="btn-primary">
                      {editingEventId ? 'Update Event' : 'Create Event'}
                    </button>
                    <button type="button" className="btn-secondary" onClick={() => setActiveTab('events')}>
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'registrations' && (
              <div>
                <h2 style={{ marginBottom: '1.5rem', color: 'var(--primary-glow)' }}>Registrations &amp; Approvals</h2>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Search by Student Name, Roll No, Registration ID, or Event..."
                  style={{ marginBottom: '1.5rem' }}
                  value={regSearch}
                  onChange={(e) => setRegSearch(e.target.value)}
                />

                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                        <th style={{ padding: '0.9rem 0.5rem' }}>Reg ID</th>
                        <th>Student</th>
                        <th>Event</th>
                        <th>Type</th>
                        <th>Status</th>
                        <th>Approval</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRegistrations.map((r) => (
                        <tr key={r.registrationId} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                          <td style={{ padding: '0.9rem 0.5rem', color: 'var(--primary-glow)', fontWeight: 600 }}>{r.registrationId}</td>
                          <td>
                            <div>{r.studentName}</div>
                            <small style={{ color: 'var(--text-muted)' }}>{r.rollNumber} • {r.mobileNumber}</small>
                          </td>
                          <td>{r.eventName}</td>
                          <td>{r.participationType}</td>
                          <td style={{ color: r.status === 'Approved' ? '#00ffaa' : r.status === 'Rejected' ? '#ff003c' : '#ffbb00', fontWeight: 600 }}>
                            {r.status}
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                              <button
                                type="button"
                                style={{ color: '#00ffaa', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}
                                onClick={() => handleRegStatusChange(r.registrationId, 'Approved')}
                              >
                                <CheckCircle size={14} /> Approve
                              </button>
                              <button
                                type="button"
                                style={{ color: '#ff003c', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}
                                onClick={() => handleRegStatusChange(r.registrationId, 'Rejected')}
                              >
                                <XCircle size={14} /> Reject
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'participants' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                  <h2 style={{ color: 'var(--primary-glow)' }}>Manage Participant Lists</h2>
                  <select
                    className="input-field"
                    style={{ width: 'auto', minWidth: '240px' }}
                    value={participantEventFilter}
                    onChange={(e) => setParticipantEventFilter(e.target.value)}
                  >
                    <option value="All">All Events</option>
                    {events.map((ev) => (
                      <option key={ev.id} value={ev.id}>{ev.name}</option>
                    ))}
                  </select>
                </div>

                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                        <th style={{ padding: '0.85rem 0.5rem' }}>Student</th>
                        <th>Reg No / Roll No</th>
                        <th>Dept &amp; Sem</th>
                        <th>Event</th>
                        <th>Team / Members</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredParticipants.map((p) => (
                        <tr key={p.registrationId} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                          <td style={{ padding: '0.85rem 0.5rem' }}>
                            <div>{p.studentName}</div>
                            <small style={{ color: 'var(--text-muted)' }}>{p.collegeEmail}</small>
                          </td>
                          <td>
                            <div>{p.registrationNumber}</div>
                            <small style={{ color: 'var(--text-muted)' }}>{p.rollNumber}</small>
                          </td>
                          <td>{p.department} • {p.semester}</td>
                          <td>{p.eventName}</td>
                          <td style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                            {p.teamName ? `${p.teamName} (${p.teamMembers || 'N/A'})` : p.participationType}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'reports' && (
              <div>
                <h2 style={{ marginBottom: '1rem', color: 'var(--primary-glow)' }}>Export Reports (Excel &amp; PDF)</h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
                  Download complete participant and registration reports in Excel-compatible CSV format or formatted PDF report.
                </p>

                <div className="grid-2" style={{ gap: '1.5rem' }}>
                  <div className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
                    <FileSpreadsheet size={44} color="#00ffaa" style={{ margin: '0 auto 1rem' }} />
                    <h3>Export Excel Sheet (.csv)</h3>
                    <p style={{ color: 'var(--text-muted)', margin: '0.75rem 0 1.5rem', fontSize: '0.92rem' }}>
                      Exports all {registrations.length} student registrations, team info, contact details, and statuses.
                    </p>
                    <button type="button" className="btn-primary" onClick={() => exportRegistrationsExcelCsv(registrations)}>
                      Download Excel (.csv)
                    </button>
                  </div>

                  <div className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
                    <FileText size={44} color="var(--primary-glow)" style={{ margin: '0 auto 1rem' }} />
                    <h3>Export PDF Report (.pdf)</h3>
                    <p style={{ color: 'var(--text-muted)', margin: '0.75rem 0 1.5rem', fontSize: '0.92rem' }}>
                      Generates a printable multi-page Ignitron 2K26 PDF summary of events and registered students.
                    </p>
                    <button type="button" className="btn-primary" onClick={() => downloadAdminReportPdf(events, registrations)}>
                      Download PDF Report
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div>
                <h2 style={{ marginBottom: '1.5rem', color: 'var(--primary-glow)' }}>Send Event Announcements</h2>
                <form onSubmit={handleSendNotification} className="glass-card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
                  <div className="grid-2" style={{ gap: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label">Announcement Title *</label>
                      <input
                        type="text"
                        className="input-field"
                        placeholder="e.g. Annual Function Gate Timing Update"
                        value={notifTitle}
                        onChange={(e) => setNotifTitle(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Priority Type</label>
                      <select className="input-field" value={notifType} onChange={(e) => setNotifType(e.target.value)}>
                        <option value="announcement">General Announcement</option>
                        <option value="urgent">Urgent Notice</option>
                        <option value="success">Schedule Update</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Message *</label>
                    <textarea
                      className="input-field"
                      rows="3"
                      placeholder="Broadcast message to Student Dashboard..."
                      value={notifMessage}
                      onChange={(e) => setNotifMessage(e.target.value)}
                      required
                    />
                  </div>
                  <button type="submit" className="btn-primary">Broadcast Announcement</button>
                </form>

                <h3 style={{ marginBottom: '1rem' }}>Recent Announcements ({notifications.length})</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {notifications.map((n) => (
                    <div key={n.id} style={{ padding: '1rem', borderRadius: 'var(--radius-sm)', background: 'rgba(255,255,255,0.03)', borderLeft: '3px solid var(--primary-glow)' }}>
                      <strong>{n.title}</strong>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>{n.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'tickets' && (
              <div>
                <h2 style={{ marginBottom: '1.5rem', color: 'var(--primary-glow)' }}>Function Ticket Receipts</h2>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                        <th style={{ padding: '0.9rem 0.5rem' }}>Ticket No</th>
                        <th>Receipt No</th>
                        <th>Candidate</th>
                        <th>Paid</th>
                        <th>Physical Receipt</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map((b) => (
                        <tr key={b.ticketNumber} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                          <td style={{ padding: '0.9rem 0.5rem', color: 'var(--primary-glow)', fontWeight: 600 }}>{b.ticketNumber}</td>
                          <td>{b.receiptNumber}</td>
                          <td>{b.candidateName}</td>
                          <td style={{ color: '#00ffaa', fontWeight: 600 }}>₹{b.totalPaid}</td>
                          <td>
                            <button
                              type="button"
                              onClick={() => handleToggleTicketCollected(b.ticketNumber)}
                              style={{ color: b.receiptCollected ? '#00ffaa' : '#ffbb00', textDecoration: 'underline' }}
                            >
                              {b.receiptCollected ? 'Collected' : 'Mark Collected'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
