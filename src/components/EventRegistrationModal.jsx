import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  X,
  CheckCircle,
  Download,
  Mail,
  QrCode,
  Phone,
  LayoutDashboard,
  Sparkles
} from 'lucide-react';
import { createRegistration, getEvents } from '../utils/eventStore';
import { generateQrSvgDataUrl } from '../utils/qrCode';
import { downloadRegistrationReceiptPdf } from '../utils/pdfGenerator';
import { RECEIPT_COLLECTION_MESSAGE, URGENT_CONTACTS } from '../utils/ticketStore';

const DEPARTMENTS = [
  'Computer Science (CSE)',
  'Electrical & Computer Engineering (ECE)',
  'Electrical Engineering (EE)',
  'Mechanical Engineering',
  'Civil Engineering',
  'MCA',
  'MBA',
  'Other'
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

const PARTICIPATION_TYPES = ['Solo', 'Duo', 'Team', 'Audience / General Entry'];

const EventRegistrationModal = ({ isOpen, onClose, initialEvent, onRegistered }) => {
  const events = getEvents();
  const registerableEvents = events.filter((e) => e.status !== 'Completed');
  const fallbackEventId = initialEvent?.id || registerableEvents[0]?.id || events[0]?.id || '';

  const [eventId, setEventId] = useState(fallbackEventId);
  const [studentName, setStudentName] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [department, setDepartment] = useState(DEPARTMENTS[0]);
  const [semester, setSemester] = useState(SEMESTERS[4]);
  const [collegeEmail, setCollegeEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [participationType, setParticipationType] = useState('Solo');
  const [teamName, setTeamName] = useState('');
  const [teamMembers, setTeamMembers] = useState('');
  const [confirmedReg, setConfirmedReg] = useState(null);

  if (!isOpen) return null;

  const activeEventId =
    initialEvent && !confirmedReg && eventId === '' ? initialEvent.id : eventId || fallbackEventId;
  const selectedEvent = events.find((e) => e.id === activeEventId) || initialEvent || events[0];

  const handleSubmit = (e) => {
    e.preventDefault();
    const record = createRegistration(
      {
        studentName,
        registrationNumber,
        rollNumber,
        department,
        semester,
        collegeEmail,
        mobileNumber,
        eventId: selectedEvent?.id || activeEventId,
        eventName: selectedEvent?.name || 'Ignitron 2K26 Event',
        participationType,
        teamName,
        teamMembers
      },
      selectedEvent
    );
    setConfirmedReg(record);
    if (onRegistered) onRegistered(record);
  };

  const handleClose = () => {
    setConfirmedReg(null);
    onClose();
  };

  const qrPayload = confirmedReg
    ? `${confirmedReg.registrationId}|${confirmedReg.rollNumber}|${confirmedReg.eventName}|${confirmedReg.status}`
    : '';
  const qrSrc = confirmedReg ? generateQrSvgDataUrl(qrPayload) : '';

  const sendEmailCopy = () => {
    if (!confirmedReg) return;
    const subject = encodeURIComponent(
      `Ignitron 2K26 Registration Confirmation - ${confirmedReg.registrationId}`
    );
    const body = encodeURIComponent(
      `Dear ${confirmedReg.studentName},\n\nYour registration for ${confirmedReg.eventName} is confirmed!\nRegistration ID: ${confirmedReg.registrationId}\nTicket Number: ${confirmedReg.ticketNumber}\nStatus: ${confirmedReg.status}\n\n${RECEIPT_COLLECTION_MESSAGE}`
    );
    window.location.href = `mailto:${confirmedReg.collegeEmail}?subject=${subject}&body=${body}`;
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2000,
        background: 'rgba(0, 0, 0, 0.82)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.25rem',
        overflowY: 'auto'
      }}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="glass-card"
        style={{
          width: '100%',
          maxWidth: '820px',
          maxHeight: '92vh',
          overflowY: 'auto',
          padding: '2rem',
          position: 'relative',
          border: '1px solid rgba(0, 240, 255, 0.35)'
        }}
      >
        <button
          type="button"
          onClick={handleClose}
          aria-label="Close registration modal"
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.08)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <X size={20} />
        </button>

        {!confirmedReg ? (
          <>
            <div style={{ marginBottom: '1.75rem', paddingRight: '2.5rem' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary-glow)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                <Sparkles size={15} /> IGNITRON 2K26 • EVENT REGISTRATION
              </div>
              <h2 style={{ fontSize: '2rem' }}>
                Register for <span className="text-gradient">{selectedEvent?.name || 'College Event'}</span>
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.35rem' }}>
                Fill in all student details to generate your automatic Registration ID, QR Pass, and PDF Receipt.
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid-2" style={{ gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">1. Student Full Name *</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Enter full name"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">2. Registration Number *</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="e.g. 2301294108"
                    value={registrationNumber}
                    onChange={(e) => setRegistrationNumber(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">3. Roll Number *</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="e.g. ABIT23CSE042"
                    value={rollNumber}
                    onChange={(e) => setRollNumber(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">4. Department *</label>
                  <select className="input-field" value={department} onChange={(e) => setDepartment(e.target.value)}>
                    {DEPARTMENTS.map((dept) => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">5. Semester *</label>
                  <select className="input-field" value={semester} onChange={(e) => setSemester(e.target.value)}>
                    {SEMESTERS.map((sem) => (
                      <option key={sem} value={sem}>{sem}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">6. College Email *</label>
                  <input
                    type="email"
                    className="input-field"
                    placeholder="student@abit.edu"
                    value={collegeEmail}
                    onChange={(e) => setCollegeEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">7. Mobile Number *</label>
                  <input
                    type="tel"
                    className="input-field"
                    placeholder="10-digit mobile number"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">8. Event Selection *</label>
                  <select
                    className="input-field"
                    value={activeEventId}
                    onChange={(e) => setEventId(e.target.value)}
                    required
                  >
                    {(registerableEvents.length > 0 ? registerableEvents : events).map((ev) => (
                      <option key={ev.id} value={ev.id}>
                        {ev.name} ({ev.status})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">9. Participation Type *</label>
                  <select
                    className="input-field"
                    value={participationType}
                    onChange={(e) => setParticipationType(e.target.value)}
                  >
                    {PARTICIPATION_TYPES.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">10. Team Name (Optional)</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="e.g. CyberTitans (if Duo/Team)"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">11. Team Members (Optional)</label>
                <textarea
                  className="input-field"
                  rows="2"
                  placeholder="Enter teammate names & roll numbers separated by commas"
                  value={teamMembers}
                  onChange={(e) => setTeamMembers(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', flexWrap: 'wrap', marginTop: '1rem' }}>
                <button type="button" className="btn-secondary" onClick={handleClose}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Confirm Registration &amp; Generate QR
                </button>
              </div>
            </form>
          </>
        ) : (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <CheckCircle size={52} color="#00ffaa" style={{ margin: '0 auto 0.75rem' }} />
              <div style={{ display: 'inline-block', padding: '0.3rem 0.9rem', borderRadius: '50px', background: 'rgba(0, 255, 170, 0.12)', color: '#00ffaa', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                REGISTRATION CONFIRMED • EMAIL DISPATCHED
              </div>
              <h2 style={{ fontSize: '2rem' }}>
                You&apos;re Registered for <span className="text-gradient">{confirmedReg.eventName}</span>
              </h2>
              <p style={{ color: 'var(--text-muted)', marginTop: '0.35rem', fontSize: '0.95rem' }}>
                Confirmation sent to <strong>{confirmedReg.collegeEmail}</strong> • Status:{' '}
                <strong style={{ color: '#ffbb00' }}>{confirmedReg.status}</strong>
              </p>
            </div>

            <div
              className="grid-2"
              style={{
                gap: '1.5rem',
                padding: '1.5rem',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(0, 0, 0, 0.35)',
                border: 'var(--glass-border)',
                marginBottom: '1.25rem',
                alignItems: 'center'
              }}
            >
              <div>
                <div style={{ marginBottom: '0.75rem' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Automatic Registration ID</span>
                  <div style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--primary-glow)', fontFamily: 'Space Grotesk, sans-serif' }}>
                    {confirmedReg.registrationId}
                  </div>
                </div>
                <div style={{ marginBottom: '0.6rem', fontSize: '0.95rem' }}>
                  <strong>Ticket No:</strong> {confirmedReg.ticketNumber}
                </div>
                <div style={{ marginBottom: '0.6rem', fontSize: '0.95rem' }}>
                  <strong>Student:</strong> {confirmedReg.studentName} ({confirmedReg.rollNumber})
                </div>
                <div style={{ marginBottom: '0.6rem', fontSize: '0.95rem' }}>
                  <strong>Reg No:</strong> {confirmedReg.registrationNumber} • {confirmedReg.department}
                </div>
                <div style={{ fontSize: '0.95rem' }}>
                  <strong>Participation:</strong> {confirmedReg.participationType}
                  {confirmedReg.teamName ? ` • Team: ${confirmedReg.teamName}` : ''}
                </div>
              </div>

              <div style={{ textAlign: 'center' }}>
                <div
                  style={{
                    display: 'inline-block',
                    padding: '0.6rem',
                    background: '#fff',
                    borderRadius: 'var(--radius-sm)',
                    border: '2px solid var(--primary-glow)'
                  }}
                >
                  <img src={qrSrc} alt="Registration QR Code" style={{ width: '132px', height: '132px', display: 'block' }} />
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.45rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem' }}>
                  <QrCode size={14} color="var(--primary-glow)" /> Scan at Ignitron Entry Desk
                </div>
              </div>
            </div>

            {/* Host Collection & Urgent Notice */}
            <div style={{ padding: '1rem 1.25rem', borderRadius: 'var(--radius-sm)', background: 'rgba(0, 240, 255, 0.08)', border: '1px solid rgba(0, 240, 255, 0.35)', marginBottom: '1rem', fontSize: '0.95rem' }}>
              {RECEIPT_COLLECTION_MESSAGE}
            </div>
            <div style={{ padding: '0.85rem 1.25rem', borderRadius: 'var(--radius-sm)', background: 'rgba(255, 0, 60, 0.08)', border: '1px solid rgba(255, 0, 60, 0.3)', marginBottom: '1.5rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <Phone size={16} color="#ff003c" />
              <strong>Urgent Ticket Contact:</strong>
              {URGENT_CONTACTS.map((c, idx) => (
                <span key={c.tel}>
                  {c.phone} ({c.name}){idx === 0 ? '  |  ' : ''}
                </span>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '0.85rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="btn-primary"
                onClick={() => downloadRegistrationReceiptPdf(confirmedReg, selectedEvent)}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}
              >
                <Download size={18} /> Download Receipt (PDF)
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={sendEmailCopy}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}
              >
                <Mail size={18} /> Email Receipt Copy
              </button>
              <Link
                to="/dashboard"
                onClick={handleClose}
                className="btn-secondary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', borderColor: '#00ffaa', color: '#00ffaa' }}
              >
                <LayoutDashboard size={18} /> Open Student Dashboard
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventRegistrationModal;
