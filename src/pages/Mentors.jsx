import { useState } from 'react';
import { Mail, AlertTriangle, User, Users, CheckCircle, Phone } from 'lucide-react';
import { RECEIPT_COLLECTION_MESSAGE, URGENT_CONTACTS } from '../utils/ticketStore';
import './Mentors.css';

const Mentors = () => {
  const [selectedHost, setSelectedHost] = useState('suryakanta');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const hosts = {
    suryakanta: {
      head: {
        name: 'Suryakanta Senapati',
        role: 'Lead Host & Receipt Desk',
        phone: '7848817688',
        email: 'senapatisuryakant4@gmail.com',
        img: 'Surya.png'
      },
      subs: [
        { name: 'Dibya Ranjan Sethy', role: 'Host & Ticket Coordinator', email: '', img: '' },
        { name: 'Subhashree Prusti', role: 'Host & Hospitality', email: '', img: '' }
      ]
    },
    manas: {
      head: {
        name: 'Manas Das',
        role: 'Lead Host & Ticket Management',
        phone: '824 970 9981',
        email: 'dasmanasranjan2005@gmail.com',
        img: 'manas.png'
      },
      subs: [
        { name: 'Debendra Pradhan', role: 'Host & Stage Coordinator', email: '', img: '' },
        { name: 'Pratik Khandai', role: 'Host & Pass Verification', email: '', img: '' }
      ]
    }
  };

  const handleContact = (e) => {
    e.preventDefault();
    setIsSubmitted(true);

    const team = hosts[selectedHost];
    const emails = [team.head.email];
    team.subs.forEach((sub) => {
      if (sub.email) emails.push(sub.email);
    });

    const mailtoLink = `mailto:${emails.join(',')}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;

    setTimeout(() => {
      window.location.href = mailtoLink;
    }, 2000);
  };

  const renderProfilePic = (imgName) => {
    if (imgName) {
      return <img src={`/${imgName}`} alt="Host Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />;
    }
    return <User size={48} color="var(--text-muted)" />;
  };

  return (
    <div className="page-enter-active">
      <section className="section-padding">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>Ignitron 2K26 <span className="text-gradient">Hosts</span></h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '850px', margin: '0 auto' }}>
              {RECEIPT_COLLECTION_MESSAGE}
            </p>

            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', marginTop: '1.5rem', padding: '1rem 1.5rem', background: 'rgba(255, 187, 0, 0.1)', border: '1px solid rgba(255, 187, 0, 0.3)', borderRadius: 'var(--radius-md)', color: '#ffbb00' }}>
              <AlertTriangle size={24} />
              <div style={{ textAlign: 'left' }}>
                <strong style={{ display: 'block' }}>Urgent Ticket Contact</strong>
                <span style={{ fontSize: '0.95rem' }}>
                  Need an urgent ticket? Call{' '}
                  {URGENT_CONTACTS.map((c, idx) => (
                    <span key={c.tel}>
                      <a href={`tel:${c.tel}`} style={{ color: '#fff', fontWeight: 700, textDecoration: 'underline' }}>
                        {c.phone} ({c.name})
                      </a>
                      {idx === 0 ? '  •  ' : ''}
                    </span>
                  ))}
                </span>
              </div>
            </div>
          </div>

          <div className="grid-2">
            {/* Host Suryakanta Team */}
            <div className="glass-card" style={{ padding: '2rem' }}>
              <div style={{ textAlign: 'center', marginBottom: '2rem', paddingBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ width: '150px', height: '150px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', overflow: 'hidden', border: '2px solid var(--primary-glow)' }}>
                  {renderProfilePic(hosts.suryakanta.head.img)}
                </div>
                <h2 style={{ color: 'var(--primary-glow)' }}>{hosts.suryakanta.head.name}</h2>
                <p style={{ color: 'var(--text-muted)' }}>{hosts.suryakanta.head.role}</p>
                <a href={`tel:${hosts.suryakanta.head.phone}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.75rem', color: '#00ffaa', fontWeight: 600 }}>
                  <Phone size={16} /> Urgent Ticket: {hosts.suryakanta.head.phone}
                </a>
              </div>

              <h4 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Users size={18} /> Co-Hosts &amp; Members</h4>
              <div className="grid-2" style={{ gap: '1rem' }}>
                {hosts.suryakanta.subs.map((sub, idx) => (
                  <div key={idx} style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
                    <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.5rem', overflow: 'hidden' }}>
                      {renderProfilePic(sub.img)}
                    </div>
                    <h5 style={{ fontSize: '1rem' }}>{sub.name}</h5>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{sub.role}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Host Manas Team */}
            <div className="glass-card" style={{ padding: '2rem' }}>
              <div style={{ textAlign: 'center', marginBottom: '2rem', paddingBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ width: '150px', height: '150px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', overflow: 'hidden', border: '2px solid var(--accent-glow)' }}>
                  {renderProfilePic(hosts.manas.head.img)}
                </div>
                <h2 style={{ color: 'var(--accent-glow)' }}>{hosts.manas.head.name}</h2>
                <p style={{ color: 'var(--text-muted)' }}>{hosts.manas.head.role}</p>
                <a href="tel:8249709981" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.75rem', color: '#00ffaa', fontWeight: 600 }}>
                  <Phone size={16} /> Urgent Ticket: {hosts.manas.head.phone}
                </a>
              </div>

              <h4 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Users size={18} /> Co-Hosts &amp; Members</h4>
              <div className="grid-2" style={{ gap: '1rem' }}>
                {hosts.manas.subs.map((sub, idx) => (
                  <div key={idx} style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
                    <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.5rem', overflow: 'hidden' }}>
                      {renderProfilePic(sub.img)}
                    </div>
                    <h5 style={{ fontSize: '1rem' }}>{sub.name}</h5>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{sub.role}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="glass-card" style={{ marginTop: '2rem', padding: '1.5rem', textAlign: 'center', border: '1px solid rgba(0, 240, 255, 0.25)' }}>
            <p style={{ color: 'var(--text-muted)' }}>
              Plus <strong style={{ color: '#fff' }}>Other Hosts Members</strong> across ABIT campus counters ready to issue your physical Ignitron 2K26 receipt and wristband.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="section-padding" style={{ background: 'rgba(5, 5, 5, 0.5)' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <div className="glass-card" style={{ padding: '3rem' }}>
            {!isSubmitted ? (
              <>
                <h2 style={{ textAlign: 'center', marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  <Mail /> Ticket &amp; Receipt Query
                </h2>
                <form onSubmit={handleContact}>
                  <div className="form-group">
                    <label className="form-label">Select Host Team</label>
                    <select
                      className="input-field"
                      value={selectedHost}
                      onChange={(e) => setSelectedHost(e.target.value)}
                    >
                      <option value="suryakanta">Host Suryakanta Senapati &amp; Team (7848817688)</option>
                      <option value="manas">Host Manas Das &amp; Team (824 970 9981)</option>
                    </select>
                    <small style={{ color: 'var(--text-muted)', display: 'block', marginTop: '0.5rem' }}>
                      This message will be addressed to the selected Ignitron 2K26 Host Team.
                    </small>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Subject / Ticket Number</label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="e.g. Receipt collection for Ticket IGN26-XXXX-XX"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Message</label>
                    <textarea
                      className="input-field"
                      rows="5"
                      placeholder="Write your ticket or urgent pass query..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                    ></textarea>
                  </div>

                  <button type="submit" className="btn-primary" style={{ width: '100%' }}>
                    Send to Host {selectedHost === 'suryakanta' ? 'Suryakanta' : 'Manas'}
                  </button>
                </form>
              </>
            ) : (
              <div className="success-message-container">
                <div className="sprinkle-container">
                  {[...Array(10)].map((_, i) => (
                    <div key={i} className="sprinkle"></div>
                  ))}
                </div>
                <div className="success-icon">
                  <CheckCircle size={40} />
                </div>
                <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#00ffaa' }}>Message Sent!</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
                  {RECEIPT_COLLECTION_MESSAGE}
                </p>
                <p style={{ marginTop: '2rem', fontSize: '0.9rem', color: 'var(--text-muted)', opacity: 0.7 }}>
                  Opening your email client...
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Mentors;
