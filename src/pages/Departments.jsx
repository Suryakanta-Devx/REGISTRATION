import { Music, Ticket, Utensils, ShieldCheck } from 'lucide-react';
import { RECEIPT_COLLECTION_MESSAGE } from '../utils/ticketStore';

const Departments = () => {
  return (
    <div className="page-enter-active">
      {/* Header */}
      <section className="section-padding">
        <div className="container" style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>ABIT Venue &amp; <span className="text-gradient">Ticket Counters</span></h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '800px', margin: '0 auto' }}>
            Explore the Ignitron 2K26 celebration zones, stage venues, and official Host Receipt Counters across the ABIT Campus, Cuttack.
          </p>
        </div>
      </section>

      {/* Venue & Facilities Grid */}
      <section className="section-padding" style={{ paddingTop: '0' }}>
        <div className="container">
          <div className="grid-2">
            {/* Main Stage */}
            <div className="glass-card" style={{ padding: '2.5rem', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: '-20px', right: '-20px', opacity: 0.1, color: 'var(--primary-glow)' }}>
                <Music size={150} />
              </div>
              <div className="track-icon">
                <Music />
              </div>
              <h2 style={{ marginBottom: '1rem' }}>Main Concert Ground &amp; Auditorium</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
                The heart of Ignitron 2K26 featuring concert-grade sound, neon stage lighting, and dedicated VIP front zones.
              </p>
              <ul style={{ color: 'var(--text-muted)', paddingLeft: '1.5rem', lineHeight: '1.8' }}>
                <li>Star Night &amp; DJ EDM Arena</li>
                <li>Cultural Dance, Band &amp; Fashion Show Stage</li>
                <li>Dedicated VIP &amp; Student Seating Zones</li>
              </ul>
            </div>

            {/* Receipt Counter */}
            <div className="glass-card" style={{ padding: '2.5rem', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: '-20px', right: '-20px', opacity: 0.1, color: 'var(--accent-glow)' }}>
                <Ticket size={150} />
              </div>
              <div className="track-icon" style={{ color: 'var(--accent-glow)', background: 'rgba(112, 0, 255, 0.1)' }}>
                <Ticket />
              </div>
              <h2 style={{ marginBottom: '1rem' }}>Official Receipt &amp; Pass Desk</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
                {RECEIPT_COLLECTION_MESSAGE}
              </p>
              <ul style={{ color: 'var(--text-muted)', paddingLeft: '1.5rem', lineHeight: '1.8' }}>
                <li>Show your Ticket Number (<code>IGN26-...</code>) after payment</li>
                <li>Collect stamped physical receipt &amp; entry wristband</li>
                <li>Instant on-spot support from Host Members</li>
              </ul>
            </div>

            {/* Food Court & Carnival */}
            <div className="glass-card" style={{ padding: '2.5rem', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: '-20px', right: '-20px', opacity: 0.1, color: '#ff003c' }}>
                <Utensils size={150} />
              </div>
              <div className="track-icon" style={{ color: '#ff003c', background: 'rgba(255, 0, 60, 0.1)' }}>
                <Utensils />
              </div>
              <h2 style={{ marginBottom: '1rem' }}>Food Court &amp; Carnival Zone</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
                A vibrant campus carnival courtyard filled with food stalls, gaming booths, and neon photo corners.
              </p>
              <ul style={{ color: 'var(--text-muted)', paddingLeft: '1.5rem', lineHeight: '1.8' }}>
                <li>20+ Multi-Cuisine Stalls &amp; Refreshments</li>
                <li>BGMI / Valorant Esports Arena</li>
                <li>Neon UV Photo Booth &amp; Fun Challenges</li>
              </ul>
            </div>

            {/* Urgent Helpdesk */}
            <div className="glass-card" style={{ padding: '2.5rem', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: '-20px', right: '-20px', opacity: 0.1, color: '#00ffaa' }}>
                <ShieldCheck size={150} />
              </div>
              <div className="track-icon" style={{ color: '#00ffaa', background: 'rgba(0, 255, 170, 0.1)' }}>
                <ShieldCheck />
              </div>
              <h2 style={{ marginBottom: '1rem' }}>Entry Gate &amp; Urgent Ticket Desk</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
                Smooth gate check-in for all Abitans with fast-track urgent ticket support directly from our lead hosts.
              </p>
              <ul style={{ color: 'var(--text-muted)', paddingLeft: '1.5rem', lineHeight: '1.8' }}>
                <li><strong>Urgent Contact (Host Suryakanta):</strong> 7848817688</li>
                <li><strong>Urgent Contact (Host Manas):</strong> 824 970 9981</li>
                <li><strong>Campus Location:</strong> ABIT Main Gate &amp; Central Block</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Departments;
