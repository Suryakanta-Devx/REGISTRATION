import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Ticket,
  Receipt,
  CheckCircle,
  Phone,
  Search,
  Printer,
  Download,
  CreditCard,
  AlertTriangle
} from 'lucide-react';
import {
  PASS_OPTIONS,
  RECEIPT_COLLECTION_MESSAGE,
  URGENT_CONTACTS,
  generateTicketIdentifiers,
  getStoredBookings,
  saveBooking
} from '../utils/ticketStore';
import './Mentors.css';

const TicketReceiptCard = ({ booking, onBookAnother, showSprinkles }) => {
  const handleDownloadReceipt = () => {
    const content = [
      '====================================================',
      '        IGNITRON 2K26 - ABIT COLLEGE FUNCTION       ',
      '              OFFICIAL PAYMENT RECEIPT              ',
      '====================================================',
      `Ticket Number   : ${booking.ticketNumber}`,
      `Receipt Number  : ${booking.receiptNumber}`,
      `Payment Status  : ${booking.paymentStatus} (₹${booking.totalPaid})`,
      `Payment Method  : ${booking.paymentMethod}`,
      `Payment Ref ID  : ${booking.paymentRef}`,
      `Booked On       : ${new Date(booking.bookedAt).toLocaleString()}`,
      '----------------------------------------------------',
      `Candidate Name  : ${booking.candidateName}`,
      `Student ID/Roll : ${booking.studentId}`,
      `Department/Year : ${booking.department} (${booking.year})`,
      `Phone           : ${booking.phone}`,
      `Email           : ${booking.email}`,
      `Pass Category   : ${booking.passName}`,
      `Quantity        : ${booking.quantity} x ₹${booking.unitPrice}`,
      `Total Paid      : ₹${booking.totalPaid}`,
      '----------------------------------------------------',
      RECEIPT_COLLECTION_MESSAGE,
      '',
      'Urgent Ticket Contact:',
      '7848817688 - Host Suryakanta Senapati',
      '824 970 9981 - Host Manas Das',
      '===================================================='
    ].join('\n');

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${booking.ticketNumber}-receipt.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="glass-card" style={{ padding: '2.5rem', position: 'relative', overflow: 'hidden', border: '1px solid rgba(0, 255, 170, 0.4)' }}>
      {showSprinkles && (
        <div className="sprinkle-container">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="sprinkle"></div>
          ))}
        </div>
      )}

      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div className="success-icon">
          <CheckCircle size={40} />
        </div>
        <div style={{ display: 'inline-block', padding: '0.35rem 1rem', borderRadius: '50px', background: 'rgba(0, 255, 170, 0.12)', color: '#00ffaa', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.75rem' }}>
          PAYMENT CONFIRMED • {booking.paymentStatus}
        </div>
        <h2 style={{ fontSize: '2.2rem', color: '#fff' }}>
          Ignitron 2K26 <span className="text-gradient">Ticket &amp; Receipt</span>
        </h2>
        <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
          Welcome to all Abitans! Your college function ticket has been booked successfully.
        </p>
      </div>

      {/* Key Identifiers */}
      <div className="grid-3" style={{ gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ padding: '1.25rem', borderRadius: 'var(--radius-sm)', background: 'rgba(0, 240, 255, 0.08)', border: '1px solid rgba(0, 240, 255, 0.3)', textAlign: 'center' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Ticket Number</div>
          <div style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--primary-glow)', marginTop: '0.35rem', fontFamily: 'Space Grotesk, sans-serif' }}>
            {booking.ticketNumber}
          </div>
        </div>
        <div style={{ padding: '1.25rem', borderRadius: 'var(--radius-sm)', background: 'rgba(112, 0, 255, 0.1)', border: '1px solid rgba(112, 0, 255, 0.35)', textAlign: 'center' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Receipt Number</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', marginTop: '0.35rem', fontFamily: 'Space Grotesk, sans-serif' }}>
            {booking.receiptNumber}
          </div>
        </div>
        <div style={{ padding: '1.25rem', borderRadius: 'var(--radius-sm)', background: 'rgba(0, 255, 170, 0.08)', border: '1px solid rgba(0, 255, 170, 0.3)', textAlign: 'center' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Amount Paid</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#00ffaa', marginTop: '0.25rem', fontFamily: 'Space Grotesk, sans-serif' }}>
            ₹{booking.totalPaid}
          </div>
        </div>
      </div>

      {/* Candidate & Payment Details */}
      <div style={{ padding: '1.5rem', borderRadius: 'var(--radius-sm)', background: 'rgba(0, 0, 0, 0.35)', border: 'var(--glass-border)', marginBottom: '1.75rem' }}>
        <h3 style={{ color: 'var(--primary-glow)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem' }}>
          <Receipt size={18} /> Payment &amp; Candidate Details
        </h3>
        <div className="grid-2" style={{ gap: '0.85rem' }}>
          <div>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Candidate Name</span>
            <div style={{ fontWeight: 600 }}>{booking.candidateName}</div>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>ABIT Roll No / Student ID</span>
            <div style={{ fontWeight: 600 }}>{booking.studentId}</div>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Department &amp; Year</span>
            <div style={{ fontWeight: 600 }}>{booking.department} • {booking.year}</div>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Phone &amp; Email</span>
            <div style={{ fontWeight: 600 }}>{booking.phone} | {booking.email}</div>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Pass Category &amp; Qty</span>
            <div style={{ fontWeight: 600 }}>{booking.passName} ({booking.quantity} × ₹{booking.unitPrice})</div>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Payment Method &amp; Ref ID</span>
            <div style={{ fontWeight: 600 }}>{booking.paymentMethod} ({booking.paymentRef})</div>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Payment Date &amp; Time</span>
            <div style={{ fontWeight: 600 }}>{new Date(booking.bookedAt).toLocaleString()}</div>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Physical Receipt Status</span>
            <div style={{ fontWeight: 600, color: booking.receiptCollected ? '#00ffaa' : '#ffbb00' }}>
              {booking.receiptCollected ? 'Collected from Host' : 'Ready to Collect from Host'}
            </div>
          </div>
        </div>
      </div>

      {/* Required Host Collection Message */}
      <div style={{ padding: '1.5rem', borderRadius: 'var(--radius-sm)', background: 'rgba(0, 240, 255, 0.08)', border: '1px solid var(--primary-glow)', marginBottom: '1.25rem' }}>
        <h4 style={{ color: 'var(--primary-glow)', marginBottom: '0.5rem' }}>Host Receipt Collection Message</h4>
        <p style={{ color: '#fff', fontSize: '1.05rem', fontWeight: 500, lineHeight: 1.7 }}>
          {RECEIPT_COLLECTION_MESSAGE}
        </p>
      </div>

      {/* Urgent Ticket Contact Box */}
      <div style={{ padding: '1.25rem', borderRadius: 'var(--radius-sm)', background: 'rgba(255, 0, 60, 0.08)', border: '1px solid rgba(255, 0, 60, 0.35)', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#ffbb00', fontWeight: 600, marginBottom: '0.4rem' }}>
          <AlertTriangle size={18} /> Urgent Ticket Contact
        </div>
        <p style={{ color: '#fff', fontSize: '0.98rem' }}>
          If you need an urgent ticket or receipt assistance, contact:{' '}
          {URGENT_CONTACTS.map((c, idx) => (
            <span key={c.tel}>
              <a href={`tel:${c.tel}`} style={{ color: 'var(--primary-glow)', fontWeight: 700 }}>
                {c.phone} ({c.name})
              </a>
              {idx === 0 ? '  |  ' : ''}
            </span>
          ))}
        </p>
      </div>

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button type="button" className="btn-primary" onClick={() => window.print()} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
          <Printer size={18} /> Print Receipt
        </button>
        <button type="button" className="btn-secondary" onClick={handleDownloadReceipt} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
          <Download size={18} /> Download Receipt
        </button>
        {onBookAnother && (
          <button type="button" className="btn-secondary" onClick={onBookAnother}>
            Book Another Ticket
          </button>
        )}
      </div>
    </div>
  );
};

const Management = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') === 'lookup' ? 'lookup' : 'book';
  const urlPass = searchParams.get('pass');
  const [passOverride, setPassOverride] = useState(null);
  const selectedPassId =
    passOverride || (PASS_OPTIONS.some((p) => p.id === urlPass) ? urlPass : 'vip');
  const [quantity, setQuantity] = useState(1);
  const [candidateName, setCandidateName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [department, setDepartment] = useState('Computer Science (CSE)');
  const [year, setYear] = useState('3rd Year');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('UPI (GPay / PhonePe / Paytm)');
  const [paymentRef, setPaymentRef] = useState('');
  const [latestBooking, setLatestBooking] = useState(null);

  // Lookup state
  const [lookupQuery, setLookupQuery] = useState('');
  const [lookupResult, setLookupResult] = useState(null);
  const [lookupSearched, setLookupSearched] = useState(false);

  const setActiveTab = (tab) => {
    const next = new URLSearchParams(searchParams);
    if (tab === 'lookup') {
      next.set('tab', 'lookup');
    } else {
      next.delete('tab');
    }
    setSearchParams(next);
  };

  const setSelectedPassId = (passId) => {
    setPassOverride(passId);
  };

  const currentPass = PASS_OPTIONS.find((p) => p.id === selectedPassId) || PASS_OPTIONS[0];
  const totalAmount = currentPass.price * quantity;

  const handleBookTicket = (e) => {
    e.preventDefault();
    const { ticketNumber, receiptNumber, autoPaymentRef } = generateTicketIdentifiers();
    const newBooking = {
      ticketNumber,
      receiptNumber,
      paymentRef: paymentRef.trim() || autoPaymentRef,
      candidateName: candidateName.trim(),
      studentId: studentId.trim().toUpperCase(),
      department,
      year,
      phone: phone.trim(),
      email: email.trim(),
      passId: currentPass.id,
      passName: currentPass.name,
      unitPrice: currentPass.price,
      quantity,
      totalPaid: totalAmount,
      paymentMethod,
      paymentStatus: 'PAID',
      receiptCollected: false,
      bookedAt: new Date().toISOString()
    };
    saveBooking(newBooking);
    setLatestBooking(newBooking);
  };

  const handleResetBooking = () => {
    setLatestBooking(null);
    setCandidateName('');
    setStudentId('');
    setPhone('');
    setEmail('');
    setPaymentRef('');
    setQuantity(1);
  };

  const handleLookup = (e) => {
    e.preventDefault();
    const query = lookupQuery.trim().toLowerCase();
    const allBookings = getStoredBookings();
    const found = allBookings.find(
      (b) =>
        b.ticketNumber.toLowerCase() === query ||
        b.receiptNumber.toLowerCase() === query ||
        b.phone.replace(/\s+/g, '') === query.replace(/\s+/g, '') ||
        b.studentId.toLowerCase() === query
    );
    setLookupResult(found || null);
    setLookupSearched(true);
  };

  return (
    <div className="page-enter-active container section-padding">
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div style={{ display: 'inline-block', padding: '0.4rem 1rem', background: 'rgba(0, 240, 255, 0.1)', border: '1px solid var(--primary-glow)', borderRadius: '50px', marginBottom: '1rem', color: 'var(--primary-glow)', fontWeight: 600, fontSize: '0.9rem' }}>
          Welcome to all Abitans • Ignitron 2K26
        </div>
        <h1 style={{ fontSize: '3.2rem', marginBottom: '0.75rem' }}>
          College Function <span className="text-gradient">Ticket Booking</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '750px', margin: '0 auto' }}>
          Pay for your pass, get your instant Ticket Number &amp; Payment Receipt, and collect your official stamped receipt from the Ignitron 2K26 Hosts.
        </p>
      </div>

      {/* Urgent Ticket Strip */}
      <div className="glass-card" style={{ maxWidth: '900px', margin: '0 auto 2.5rem', padding: '1rem 1.5rem', border: '1px solid rgba(255, 0, 60, 0.35)', background: 'rgba(255, 0, 60, 0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Phone size={18} color="#ff003c" />
          <strong>Urgent Ticket Contact:</strong>
          {URGENT_CONTACTS.map((c, idx) => (
            <a key={c.tel} href={`tel:${c.tel}`} style={{ color: 'var(--primary-glow)', fontWeight: 600 }}>
              {c.phone} ({c.name}){idx === 0 ? '  |  ' : ''}
            </a>
          ))}
        </div>
      </div>

      {/* Mode Toggle */}
      <div className="form-toggle" style={{ maxWidth: '500px', margin: '0 auto 2.5rem' }}>
        <button
          type="button"
          className={activeTab === 'book' ? 'active' : ''}
          onClick={() => setActiveTab('book')}
        >
          Book Ticket &amp; Pay
        </button>
        <button
          type="button"
          className={activeTab === 'lookup' ? 'active' : ''}
          onClick={() => setActiveTab('lookup')}
        >
          Find My Receipt
        </button>
      </div>

      {activeTab === 'book' && (
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          {latestBooking ? (
            <TicketReceiptCard
              booking={latestBooking}
              onBookAnother={handleResetBooking}
              showSprinkles={true}
            />
          ) : (
            <div className="glass-card" style={{ padding: '2.5rem' }}>
              <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Ticket className="text-gradient" /> Book Ignitron 2K26 Pass
              </h2>

              <form onSubmit={handleBookTicket}>
                {/* Pass Selection Cards */}
                <div className="form-group">
                  <label className="form-label">Select Function Pass Category</label>
                  <div className="grid-2" style={{ gap: '1rem' }}>
                    {PASS_OPTIONS.map((pass) => {
                      const isSelected = selectedPassId === pass.id;
                      return (
                        <button
                          key={pass.id}
                          type="button"
                          onClick={() => setSelectedPassId(pass.id)}
                          style={{
                            textAlign: 'left',
                            padding: '1.25rem',
                            borderRadius: 'var(--radius-sm)',
                            background: isSelected ? 'rgba(0, 240, 255, 0.1)' : 'rgba(0, 0, 0, 0.3)',
                            border: isSelected ? '1px solid var(--primary-glow)' : 'var(--glass-border)',
                            color: '#fff',
                            transition: 'all 0.25s ease'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                            <strong>{pass.name}</strong>
                            <span style={{ color: 'var(--primary-glow)', fontWeight: 700, fontSize: '1.1rem' }}>₹{pass.price}</span>
                          </div>
                          <div style={{ fontSize: '0.8rem', color: '#00ffaa', marginBottom: '0.35rem' }}>{pass.badge}</div>
                          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{pass.description}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid-2" style={{ gap: '1.25rem' }}>
                  <div className="form-group">
                    <label className="form-label">Candidate Full Name</label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="Enter your full name"
                      value={candidateName}
                      onChange={(e) => setCandidateName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">ABIT Roll No / Student ID</label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="e.g. ABIT23CSE042"
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Department</label>
                    <select className="input-field" value={department} onChange={(e) => setDepartment(e.target.value)}>
                      <option>Computer Science (CSE)</option>
                      <option>Electrical &amp; Computer Engineering (ECE)</option>
                      <option>Mechanical Engineering</option>
                      <option>Civil Engineering</option>
                      <option>MCA / MBA</option>
                      <option>Other / Guest</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Year / Semester</label>
                    <select className="input-field" value={year} onChange={(e) => setYear(e.target.value)}>
                      <option>1st Year</option>
                      <option>2nd Year</option>
                      <option>3rd Year</option>
                      <option>4th Year</option>
                      <option>Faculty / Alumni</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input
                      type="tel"
                      className="input-field"
                      placeholder="10-digit mobile number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input
                      type="email"
                      className="input-field"
                      placeholder="you@abit.edu"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Number of Tickets</label>
                    <select
                      className="input-field"
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                    >
                      {[1, 2, 3, 4, 5].map((num) => (
                        <option key={num} value={num}>
                          {num} {num === 1 ? 'Ticket' : 'Tickets'} (₹{currentPass.price * num})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Payment Method</label>
                    <select className="input-field" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                      <option>UPI (GPay / PhonePe / Paytm)</option>
                      <option>Debit / Credit Card</option>
                      <option>Cash / Direct to Host</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">UPI Transaction ID / Payment Reference (Optional — auto-generated if paying now)</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="e.g. UPI-4321987654 (leave blank to auto-generate receipt ref)"
                    value={paymentRef}
                    onChange={(e) => setPaymentRef(e.target.value)}
                  />
                </div>

                {/* Payment Summary Box */}
                <div style={{ padding: '1.25rem 1.5rem', borderRadius: 'var(--radius-sm)', background: 'rgba(0, 240, 255, 0.06)', border: '1px solid rgba(0, 240, 255, 0.25)', marginBottom: '1.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Selected Pass</div>
                    <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>
                      {currentPass.name} × {quantity}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Total Payment</div>
                    <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#00ffaa', fontFamily: 'Space Grotesk, sans-serif' }}>
                      ₹{totalAmount}
                    </div>
                  </div>
                </div>

                <button type="submit" className="btn-primary" style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', fontSize: '1.05rem' }}>
                  <CreditCard size={20} /> Pay ₹{totalAmount} &amp; Generate Ticket Receipt
                </button>
              </form>
            </div>
          )}
        </div>
      )}

      {activeTab === 'lookup' && (
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div className="glass-card" style={{ padding: '2.5rem', marginBottom: '2rem' }}>
            <h2 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Search className="text-gradient" /> Find Your Ticket &amp; Payment Receipt
            </h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              Enter your Ticket Number (e.g. <code>IGN26-1042-88</code>), Receipt Number, Student ID, or Phone Number.
            </p>
            <form onSubmit={handleLookup} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <input
                type="text"
                className="input-field"
                style={{ flex: 1, minWidth: '240px' }}
                placeholder="Ticket Number, Receipt No, Roll No, or Phone..."
                value={lookupQuery}
                onChange={(e) => setLookupQuery(e.target.value)}
                required
              />
              <button type="submit" className="btn-primary">
                Get Receipt
              </button>
            </form>
          </div>

          {lookupSearched && lookupResult && (
            <TicketReceiptCard booking={lookupResult} showSprinkles={false} />
          )}

          {lookupSearched && !lookupResult && (
            <div className="glass-card" style={{ padding: '2rem', textAlign: 'center', border: '1px solid rgba(255, 0, 60, 0.3)' }}>
              <h3 style={{ color: '#ff003c', marginBottom: '0.5rem' }}>No Ticket Found</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
                We could not find a ticket matching &quot;{lookupQuery}&quot;. Please check your Ticket Number or contact our urgent helpline.
              </p>
              <p style={{ color: 'var(--primary-glow)', fontWeight: 600 }}>
                Urgent Ticket Contact: 7848817688 (Host Suryakanta) | 824 970 9981 (Host Manas)
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Management;
