import { useState } from 'react';
import { Calendar, Clock, MapPin, Search, Sparkles } from 'lucide-react';
import { EVENT_CATEGORIES, getEvents } from '../utils/eventStore';
import EventRegistrationModal from '../components/EventRegistrationModal';

const STATUS_BADGE_STYLES = {
  Upcoming: { background: 'rgba(0, 240, 255, 0.14)', color: '#00f0ff', border: '1px solid rgba(0, 240, 255, 0.35)' },
  Ongoing: { background: 'rgba(0, 255, 170, 0.14)', color: '#00ffaa', border: '1px solid rgba(0, 255, 170, 0.35)' },
  Completed: { background: 'rgba(255, 255, 255, 0.08)', color: '#a0a0ab', border: '1px solid rgba(255, 255, 255, 0.15)' }
};

const Events = () => {
  const [events] = useState(() => getEvents());
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [activeEvent, setActiveEvent] = useState(null);

  const filteredEvents = events.filter((ev) => {
    const matchesCategory = selectedCategory === 'All' || ev.category === selectedCategory;
    const matchesStatus = selectedStatus === 'All' || ev.status === selectedStatus;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      ev.name.toLowerCase().includes(q) ||
      ev.category.toLowerCase().includes(q) ||
      ev.venue.toLowerCase().includes(q) ||
      ev.description.toLowerCase().includes(q);
    return matchesCategory && matchesStatus && matchesSearch;
  });

  const handleOpenRegister = (ev) => {
    setActiveEvent(ev);
    setModalOpen(true);
  };

  return (
    <div className="page-enter-active">
      <div className="container" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.75rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', padding: '0.4rem 1.1rem', borderRadius: '50px', background: 'rgba(0, 240, 255, 0.1)', border: '1px solid var(--primary-glow)', color: 'var(--primary-glow)', fontWeight: 600, fontSize: '0.9rem', marginBottom: '1rem' }}>
            <Sparkles size={16} /> Ignitron 2K26 • ABIT College Functions
          </div>
          <h1 style={{ fontSize: '3.4rem', marginBottom: '0.8rem' }}>
            College Events &amp; <span className="text-gradient">Functions</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.15rem', maxWidth: '820px', margin: '0 auto' }}>
            Explore Upcoming College Functions, Technical Festivals, Annual Functions, Cultural Programs, Sports Events, Workshops, Hackathons, and Freshers &amp; Farewell Parties.
          </p>
        </div>

        {/* Search & Status Filter */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', marginBottom: '2rem' }}>
          <div style={{ position: 'relative', flex: '1 1 340px', maxWidth: '520px' }}>
            <Search style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
            <input
              type="text"
              className="input-field"
              placeholder="Search events by name, venue, or category..."
              style={{ paddingLeft: '2.8rem', borderRadius: '50px' }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <select
            className="input-field"
            style={{ width: 'auto', minWidth: '170px', borderRadius: '50px' }}
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Upcoming">Upcoming</option>
            <option value="Ongoing">Ongoing</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        {/* Category Filter Pills */}
        <div style={{ display: 'flex', gap: '0.65rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '3rem' }}>
          {['All', ...EVENT_CATEGORIES].map((cat) => {
            const active = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '50px',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  transition: 'all 0.25s ease',
                  background: active ? 'linear-gradient(90deg, var(--primary-glow), var(--accent-glow))' : 'rgba(255, 255, 255, 0.05)',
                  color: '#fff',
                  border: active ? '1px solid transparent' : 'var(--glass-border)'
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Events Grid */}
        <div className="grid-3">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((ev) => {
              const badgeStyle = STATUS_BADGE_STYLES[ev.status] || STATUS_BADGE_STYLES.Upcoming;
              const isCompleted = ev.status === 'Completed';

              return (
                <div key={ev.id} className="glass-card project-card" style={{ padding: '0', overflow: 'hidden' }}>
                  {/* Event Banner Poster */}
                  <div style={{ position: 'relative', height: '190px', overflow: 'hidden', borderBottom: 'var(--glass-border)' }}>
                    <img
                      src={ev.image}
                      alt={ev.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                    <span
                      style={{
                        position: 'absolute',
                        top: '0.85rem',
                        right: '0.85rem',
                        padding: '0.28rem 0.75rem',
                        borderRadius: '50px',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        backdropFilter: 'blur(8px)',
                        ...badgeStyle
                      }}
                    >
                      {ev.status}
                    </span>
                  </div>

                  {/* Card Body */}
                  <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                    <span className="project-tag" style={{ color: 'var(--primary-glow)', marginBottom: '0.65rem' }}>
                      {ev.category}
                    </span>

                    <h3 className="project-title" style={{ marginBottom: '0.65rem' }}>{ev.name}</h3>
                    <p className="project-desc" style={{ marginBottom: '1.1rem' }}>{ev.description}</p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Calendar size={15} color="var(--primary-glow)" />
                        <span><strong style={{ color: '#fff' }}>Date:</strong> {ev.date}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Clock size={15} color="var(--primary-glow)" />
                        <span><strong style={{ color: '#fff' }}>Time:</strong> {ev.time}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <MapPin size={15} color="#00ffaa" />
                        <span><strong style={{ color: '#fff' }}>Venue:</strong> {ev.venue}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={isCompleted}
                      onClick={() => handleOpenRegister(ev)}
                      className={isCompleted ? 'btn-secondary' : 'btn-primary'}
                      style={{
                        marginTop: 'auto',
                        width: '100%',
                        opacity: isCompleted ? 0.55 : 1,
                        cursor: isCompleted ? 'not-allowed' : 'pointer'
                      }}
                    >
                      {isCompleted ? 'Event Completed' : 'Register Now'}
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
              <h3>No college events found matching your filters.</h3>
            </div>
          )}
        </div>
      </div>

      <EventRegistrationModal
        key={activeEvent?.id || 'default-modal'}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        initialEvent={activeEvent}
      />
    </div>
  );
};

export default Events;
