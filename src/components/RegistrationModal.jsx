import { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, CheckCircle, Download, QrCode, AlertCircle, LayoutDashboard } from 'lucide-react';
import { apiRequest, downloadAuthorizedFile } from '../services/api';
import { useAuth } from '../context/authContextBase';
import MagneticButton from './MagneticButton';

const DEPARTMENTS = [
  'Computer Science (CSE)',
  'Electrical & Computer Engineering (ECE)',
  'Electrical Engineering (EE)',
  'Mechanical Engineering',
  'Civil Engineering',
  'MCA',
  'MBA'
];

const SEMESTERS = [
  '1st Semester',
  '2nd Semester',
  '3rd Semester',
  '4th Semester',
  '5th Semester',
  '6th Semester',
  '7th Semester',
  '8th Semester'
];

const RegistrationModal = ({ isOpen, onClose, events = [], initialEvent, onSuccess }) => {
  const { user } = useAuth();
  const availableEvents = events.filter((e) => e.status !== 'Completed');
  const defaultEventId = initialEvent?._id || availableEvents[0]?._id || '';

  const [form, setForm] = useState({
    studentName: user?.name || '',
    rollNumber: user?.rollNumber || '',
    registrationNumber: user?.registrationNumber || '',
    department: user?.department || DEPARTMENTS[0],
    semester: user?.semester || SEMESTERS[4],
    email: user?.email || '',
    phone: user?.phone || '',
    eventId: defaultEventId,
    participationType: 'Individual',
    teamName: '',
    teamMembers: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  if (!isOpen) return null;

  const selectedEvent = events.find((e) => e._id === form.eventId) || initialEvent;

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!/^[0-9+\-\s]{10,15}$/.test(form.phone.trim())) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (form.participationType === 'Team' && !form.teamMembers.trim()) {
      setError('Please enter team members for team participation.');
      return;
    }

    setSubmitting(true);
    try {
      const data = await apiRequest('/registrations', {
        method: 'POST',
        body: JSON.stringify(form)
      });
      setResult(data.registration);
      if (onSuccess) onSuccess(data.registration);
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDownloadPdf = async () => {
    if (!result) return;
    try {
      await downloadAuthorizedFile(`/registrations/${result._id}/receipt`, `${result.registrationId}-receipt.pdf`);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[2500] flex items-center justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-label="Event Registration"
    >
      <div className="glass-panel relative my-8 max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-blue-500/30 p-6 sm:p-8">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close registration modal"
          className="absolute top-5 right-5 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
        >
          <X size={18} />
        </button>

        {!result ? (
          <>
            <div className="pr-10">
              <span className="text-xs font-semibold tracking-widest text-blue-400 uppercase">
                ABIT FEST 2026 • Registration Portal
              </span>
              <h2 className="mt-1 text-2xl font-bold text-white sm:text-3xl">
                Register for <span className="text-gradient-fest">{selectedEvent?.title || 'Event'}</span>
              </h2>
              <p className="mt-1 text-xs text-slate-400 sm:text-sm">
                Duplicate registrations for the same event are automatically prevented.
              </p>
            </div>

            {error && (
              <div className="mt-4 flex items-center gap-2 rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                <AlertCircle size={18} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-300">Student Name *</label>
                  <input
                    type="text"
                    required
                    value={form.studentName}
                    onChange={(e) => handleChange('studentName', e.target.value)}
                    placeholder="Full Name"
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm text-white focus:border-blue-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-300">College Roll Number *</label>
                  <input
                    type="text"
                    required
                    value={form.rollNumber}
                    onChange={(e) => handleChange('rollNumber', e.target.value)}
                    placeholder="e.g. ABIT23CSE042"
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm text-white focus:border-blue-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-300">Registration Number *</label>
                  <input
                    type="text"
                    required
                    value={form.registrationNumber}
                    onChange={(e) => handleChange('registrationNumber', e.target.value)}
                    placeholder="e.g. 2301294108"
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm text-white focus:border-blue-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-300">Department *</label>
                  <select
                    value={form.department}
                    onChange={(e) => handleChange('department', e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#0b1022] px-4 py-2.5 text-sm text-white focus:border-blue-400 focus:outline-none"
                  >
                    {DEPARTMENTS.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-300">Semester *</label>
                  <select
                    value={form.semester}
                    onChange={(e) => handleChange('semester', e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#0b1022] px-4 py-2.5 text-sm text-white focus:border-blue-400 focus:outline-none"
                  >
                    {SEMESTERS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-300">Email *</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="student@abit.edu"
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm text-white focus:border-blue-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-300">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    placeholder="10-digit mobile number"
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm text-white focus:border-blue-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-300">Event Selection *</label>
                  <select
                    value={form.eventId}
                    onChange={(e) => handleChange('eventId', e.target.value)}
                    required
                    className="w-full rounded-xl border border-white/10 bg-[#0b1022] px-4 py-2.5 text-sm text-white focus:border-blue-400 focus:outline-none"
                  >
                    {availableEvents.map((ev) => (
                      <option key={ev._id} value={ev._id}>{ev.title} ({ev.category})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-300">Participation Type *</label>
                  <select
                    value={form.participationType}
                    onChange={(e) => handleChange('participationType', e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#0b1022] px-4 py-2.5 text-sm text-white focus:border-blue-400 focus:outline-none"
                  >
                    <option value="Individual">Individual</option>
                    <option value="Team">Team</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-300">Team Name (if Team)</label>
                  <input
                    type="text"
                    value={form.teamName}
                    onChange={(e) => handleChange('teamName', e.target.value)}
                    placeholder="Optional team name"
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm text-white focus:border-blue-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-300">
                  Team Members {form.participationType === 'Team' ? '*' : '(Optional)'}
                </label>
                <textarea
                  rows={2}
                  value={form.teamMembers}
                  onChange={(e) => handleChange('teamMembers', e.target.value)}
                  placeholder="Enter member names and roll numbers separated by commas"
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm text-white focus:border-blue-400 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-full border border-white/15 px-5 py-2.5 text-sm font-medium text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <MagneticButton
                  type="submit"
                  disabled={submitting}
                  className="btn-gradient px-6 py-2.5 text-sm"
                >
                  {submitting ? 'Submitting...' : 'Confirm Registration'}
                </MagneticButton>
              </div>
            </form>
          </>
        ) : (
          <div className="text-center">
            <CheckCircle size={52} className="mx-auto text-emerald-400" />
            <div className="mt-2 inline-block rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
              REGISTRATION SAVED IN DATABASE
            </div>
            <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
              Confirmed for <span className="text-gradient-fest">{result.eventTitle}</span>
            </h2>

            <div className="mt-6 grid items-center gap-6 rounded-2xl border border-white/10 bg-black/40 p-5 text-left sm:grid-cols-2">
              <div className="space-y-2 text-sm text-slate-300">
                <div>
                  <span className="text-xs text-slate-400">Registration ID</span>
                  <div className="font-['Space_Grotesk'] text-xl font-bold text-blue-400">{result.registrationId}</div>
                </div>
                <div><strong className="text-white">Student:</strong> {result.studentName}</div>
                <div><strong className="text-white">Roll No:</strong> {result.rollNumber}</div>
                <div><strong className="text-white">Department:</strong> {result.department} ({result.semester})</div>
                <div><strong className="text-white">Participation:</strong> {result.participationType}</div>
                <div><strong className="text-white">Status:</strong> <span className="text-amber-300">{result.status}</span></div>
              </div>

              <div className="text-center">
                <div className="inline-block rounded-xl border-2 border-blue-400 bg-white p-2">
                  <img src={result.qrDataUrl} alt="Registration QR Code" className="h-36 w-36" />
                </div>
                <div className="mt-2 flex items-center justify-center gap-1 text-xs text-slate-400">
                  <QrCode size={14} className="text-blue-400" /> Scan at Event Desk
                </div>
              </div>
            </div>

            <div className="mt-5 rounded-xl border border-blue-500/30 bg-blue-500/10 p-4 text-left text-xs text-slate-200 sm:text-sm">
              Dear Candidate, get your physical receipt from Host Suryakanta Senapati, Manas Das, Dibya Ranjan Sethy, Debendra Pradhan, Pratik Khandai, Subhashree Prusti and Other Hosts Member.
              <div className="mt-1 font-semibold text-pink-300">
                Urgent Ticket Contact: 7848817688 (Host Suryakanta) • 824 970 9981 (Host Manas)
              </div>
            </div>

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={handleDownloadPdf}
                className="btn-gradient inline-flex items-center gap-2 px-6 py-3 text-sm"
              >
                <Download size={16} /> Download PDF Receipt
              </button>
              <Link
                to="/student-dashboard"
                onClick={onClose}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
              >
                <LayoutDashboard size={16} /> Student Dashboard
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegistrationModal;
