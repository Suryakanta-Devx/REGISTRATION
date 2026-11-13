import { useState } from 'react';
import { Search, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';

const stageEvents = [
  { id: 1, title: 'Grand DJ & EDM Laser Night', desc: 'High-voltage live DJ performance with neon laser sync and crowd anthems to light up Ignitron 2K26.', category: 'Main Stage', tags: ['DJ Night', 'VIP & Duo Pass', 'Music'] },
  { id: 2, title: 'ABIT Fashion Walk 2K26', desc: 'Runway showcase featuring themed designer outfits, choreography, and star-studded judging.', category: 'Main Stage', tags: ['Fashion', 'Spotlight', 'Ramp'] },
  { id: 3, title: 'Group & Solo Dance Battle', desc: 'Electrifying street, classical, and hip-hop dance face-offs between ABITians.', category: 'Cultural', tags: ['Dance', 'Choreography', 'Battle'] },
  { id: 4, title: 'Live Campus Rock & Fusion Band', desc: 'Acoustic unplugged sets and electric band performances by ABIT music clubs and guest artists.', category: 'Main Stage', tags: ['Live Band', 'Vocals', 'Concert'] },
  { id: 5, title: 'Voice of ABIT Singing Finale', desc: 'Solo and duet vocalists competing under the main spotlight for the Ignitron 2K26 title.', category: 'Cultural', tags: ['Singing', 'Melody', 'Acoustic'] },
  { id: 6, title: 'Stand-Up Comedy & Open Mic', desc: 'Laugh-out-loud campus stories, mimicry, poetry, and spontaneous crowd work.', category: 'Auditorium', tags: ['Comedy', 'Open Mic', 'Entertainment'] },
  { id: 7, title: 'Nukkad Natak & Stage Drama', desc: 'Impactful theatrical skits blending humor, emotion, and campus life stories.', category: 'Auditorium', tags: ['Drama', 'Theatre', 'Storytelling'] },
  { id: 8, title: 'Beatboxing & Rap Cypher', desc: 'Rhythm, freestyle bars, and vocal percussion battles right on the Ignitron stage.', category: 'Cultural', tags: ['Hip-Hop', 'Rap', 'Beatbox'] },
  { id: 9, title: 'Traditional Welcome & Classical Fusion', desc: 'Opening ceremony celebrating Odissi and classical heritage with a modern twist for all Abitans.', category: 'Main Stage', tags: ['Inauguration', 'Classical', 'Heritage'] }
];

const carnivalEvents = [
  { id: 10, title: 'Campus-Wide Treasure Hunt', desc: 'Solve cryptic clues across ABIT departments with your squad to unlock the Ignitron mystery chest.', category: 'Carnival', tags: ['Adventure', 'Team Game', 'Clues'] },
  { id: 11, title: 'BGMI & Valorant Gaming Arena', desc: 'Competitive LAN & mobile gaming brackets with live shoutcasting on big screens.', category: 'Gaming', tags: ['Esports', 'BGMI', 'Valorant'] },
  { id: 12, title: 'Neon Glow Photo Booth', desc: 'UV-lit neon backdrops and instant polaroid memories with your friends at Ignitron 2K26.', category: 'Fun Zone', tags: ['Photography', 'Neon', 'Memories'] },
  { id: 13, title: 'ABIT Food Fest & Street Stalls', desc: '20+ food & beverage stalls featuring momos, mocktails, biriyani, waffles, and campus favorites.', category: 'Food Court', tags: ['Food', 'Snacks', 'Mocktails'] },
  { id: 14, title: 'Mr. & Ms. Ignitron 2K26', desc: 'Personality, talent, and rapid-fire Q&A rounds crowning the icons of Ignitron 2K26.', category: 'Spotlight', tags: ['Title', 'Talent', 'Q&A'] },
  { id: 15, title: 'Reel & Photography Contest', desc: 'Capture the best moments of Ignitron 2K26 and win exciting goodies and spotlight features.', category: 'Creative', tags: ['Reels', 'Camera', 'Editing'] },
  { id: 16, title: 'Tug of War & Carnival Games', desc: 'High-energy outdoor fun games, ring toss, dart challenges, and inter-branch tug of war.', category: 'Outdoor', tags: ['Sports', 'Fun', 'Branch Pride'] },
  { id: 17, title: 'Host Receipt & Wristband Counter', desc: 'Collect your official stamped receipt and neon entry band from Suryakanta, Manas, Dibya, Debendra, Pratik & Subhashree.', category: 'Entry Desk', tags: ['Receipt', 'Tickets', 'Hosts'] }
];

const Projects = () => {
  const [activeTab, setActiveTab] = useState('stage');
  const [searchQuery, setSearchQuery] = useState('');
  const [savedEvents, setSavedEvents] = useState({});

  const handleToggleEvent = (id) => {
    setSavedEvents((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const activeEvents = activeTab === 'stage' ? stageEvents : carnivalEvents;

  const filteredEvents = activeEvents.filter((evt) =>
    evt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    evt.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="page-enter-active">
      <div className="container" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>Ignitron 2K26 <span className="text-gradient">Events &amp; Shows</span></h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '800px', margin: '0 auto 1.5rem' }}>
            Explore the full lineup of concerts, cultural performances, gaming arenas, and carnival zones included with your Ignitron 2K26 pass.
          </p>
          <Link to="/tickets" className="btn-primary">Book Your Pass Now</Link>
        </div>

        {/* Search */}
        <div style={{ maxWidth: '600px', margin: '0 auto 3rem', position: 'relative' }}>
          <Search style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={20} />
          <input
            type="text"
            className="input-field"
            placeholder="Search events by name or vibe (e.g. DJ, Dance, Food, Gaming)..."
            style={{ paddingLeft: '3rem', borderRadius: '50px' }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '3rem', flexWrap: 'wrap' }}>
          <button
            className={`btn-primary ${activeTab === 'stage' ? '' : 'btn-secondary'}`}
            style={activeTab === 'stage' ? {} : { border: 'var(--glass-border)', background: 'rgba(255,255,255,0.05)' }}
            onClick={() => setActiveTab('stage')}
          >
            Stage &amp; Cultural Shows
          </button>
          <button
            className={`btn-primary ${activeTab === 'carnival' ? '' : 'btn-secondary'}`}
            style={activeTab === 'carnival' ? {} : { border: 'var(--glass-border)', background: 'rgba(255,255,255,0.05)' }}
            onClick={() => setActiveTab('carnival')}
          >
            Carnival, Gaming &amp; Fun Zones
          </button>
        </div>

        <div className="grid-3">
          {filteredEvents.length > 0 ? filteredEvents.map((evt) => (
            <div key={evt.id} className="glass-card project-card" style={{ position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span className="project-tag" style={{ color: activeTab === 'stage' ? 'var(--primary-glow)' : '#00ffaa', margin: 0 }}>
                  {activeTab === 'stage' ? 'Stage / Cultural' : 'Carnival / Zone'}
                </span>
                <span style={{ fontSize: '0.8rem', padding: '0.2rem 0.6rem', borderRadius: '4px', background: 'rgba(255,255,255,0.1)', color: '#ffbb00' }}>
                  {evt.category}
                </span>
              </div>

              <h3 className="project-title">{evt.title}</h3>
              <p className="project-desc">{evt.desc}</p>

              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', margin: '1rem 0' }}>
                {evt.tags.map((tag, idx) => (
                  <span key={idx} style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.2rem', color: 'var(--text-muted)' }}>
                    <Tag size={12} /> {tag}
                  </span>
                ))}
              </div>

              <button
                onClick={() => handleToggleEvent(evt.id)}
                style={{
                  marginTop: 'auto',
                  alignSelf: 'flex-start',
                  padding: '0.5rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  fontWeight: 600,
                  transition: 'all 0.3s',
                  background: savedEvents[evt.id] ? 'rgba(0, 255, 170, 0.1)' : 'rgba(255,255,255,0.05)',
                  border: savedEvents[evt.id] ? '1px solid #00ffaa' : 'var(--glass-border)',
                  color: savedEvents[evt.id] ? '#00ffaa' : '#fff'
                }}
              >
                {savedEvents[evt.id] ? '✓ Added to My Schedule' : 'Mark Interested'}
              </button>
            </div>
          )) : (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
              <h3>No events found matching &quot;{searchQuery}&quot;</h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Projects;
