import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Event from '../models/Event.js';
import ScheduleItem from '../models/ScheduleItem.js';
import Speaker from '../models/Speaker.js';
import Sponsor from '../models/Sponsor.js';
import GalleryItem from '../models/GalleryItem.js';
import Notification from '../models/Notification.js';
import Settings from '../models/Settings.js';

function svgPoster(title, category, c1 = '#7c3aed', c2 = '#3b82f6') {
  const safeTitle = title.replace(/&/g, '&amp;').replace(/</g, '&lt;').slice(0, 32);
  const safeCat = category.toUpperCase();
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450" viewBox="0 0 800 450">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#050816"/>
        <stop offset="55%" stop-color="#0d132b"/>
        <stop offset="100%" stop-color="#04050c"/>
      </linearGradient>
      <linearGradient id="accent" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="${c1}"/>
        <stop offset="100%" stop-color="${c2}"/>
      </linearGradient>
    </defs>
    <rect width="800" height="450" fill="url(#g)"/>
    <circle cx="650" cy="120" r="140" fill="${c1}" fill-opacity="0.18"/>
    <circle cx="160" cy="360" r="130" fill="${c2}" fill-opacity="0.16"/>
    <g stroke="rgba(255,255,255,0.06)">
      <line x1="0" y1="90" x2="800" y2="90"/><line x1="0" y1="180" x2="800" y2="180"/>
      <line x1="0" y1="270" x2="800" y2="270"/><line x1="0" y1="360" x2="800" y2="360"/>
      <line x1="160" y1="0" x2="160" y2="450"/><line x1="320" y1="0" x2="320" y2="450"/>
      <line x1="480" y1="0" x2="480" y2="450"/><line x1="640" y1="0" x2="640" y2="450"/>
    </g>
    <rect x="48" y="48" rx="18" ry="18" width="210" height="36" fill="rgba(255,255,255,0.06)" stroke="${c1}" stroke-width="1.5"/>
    <text x="68" y="71" fill="#ffffff" font-family="Arial, sans-serif" font-size="14" font-weight="700" letter-spacing="1.5">${safeCat}</text>
    <text x="48" y="210" fill="#ffffff" font-family="Arial, sans-serif" font-size="40" font-weight="800">${safeTitle}</text>
    <text x="48" y="254" fill="#94a3b8" font-family="Arial, sans-serif" font-size="18">ABIT FEST 2026 • CUTTACK, ODISHA</text>
    <rect x="48" y="295" width="160" height="5" rx="2.5" fill="url(#accent)"/>
    <text x="48" y="365" fill="#e2e8f0" font-family="Arial, sans-serif" font-size="15">Beyond Technology. Beyond Imagination.</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export async function seedDatabase() {
  const existingSettings = await Settings.findOne({ key: 'global' });
  if (!existingSettings) {
    await Settings.create({
      key: 'global',
      festivalName: 'ABIT FEST 2026',
      tagline: 'Beyond Technology. Beyond Imagination.',
      festivalDate: '2026-12-18T09:00:00+05:30',
      venue: 'Ajay Binay Institute of Technology, Cuttack, Odisha'
    });
  }

  const adminEmail = (process.env.ADMIN_EMAIL || 'admin@abitfest.edu').toLowerCase();
  const existingAdmin = await User.findOne({ email: adminEmail });
  if (!existingAdmin) {
    const adminPass = process.env.ADMIN_PASSWORD || 'ABIT_ADMIN@2026';
    const passwordHash = await bcrypt.hash(adminPass, 10);
    await User.create({
      name: 'ABIT Fest Administrator',
      email: adminEmail,
      passwordHash,
      role: 'admin',
      rollNumber: 'ADMIN-001',
      registrationNumber: 'ABIT-ADMIN-2026',
      department: 'Administration',
      semester: 'Staff',
      phone: '7848817688'
    });
  }

  const eventCount = await Event.countDocuments();
  if (eventCount === 0) {
    await Event.insertMany([
      {
        title: 'DevSprint 36H National Hackathon',
        category: 'Technical',
        description: 'Flagship 36-hour software & AI innovation sprint inspired by DevFest engineering tracks with live mentor reviews.',
        posterUrl: svgPoster('DevSprint 36H Hackathon', 'Technical', '#3b82f6', '#7c3aed'),
        date: '2026-12-18',
        time: '09:00 AM - 09:00 PM',
        venue: 'ABIT Innovation & CSE Smart Lab',
        participationMode: 'Team',
        maxTeamSize: 4,
        fee: 299,
        status: 'Upcoming'
      },
      {
        title: 'RoboWars & Autonomous Maze Arena',
        category: 'Robotics',
        description: 'High-impact combat bots, line followers, and autonomous microcontroller navigation challenges.',
        posterUrl: svgPoster('RoboWars & Maze Arena', 'Robotics', '#f97316', '#ec4899'),
        date: '2026-12-18',
        time: '11:00 AM - 05:00 PM',
        venue: 'Central Quadrangle Arena',
        participationMode: 'Team',
        maxTeamSize: 4,
        fee: 249,
        status: 'Upcoming'
      },
      {
        title: 'Annual Cultural & Star DJ Night',
        category: 'Cultural',
        description: 'Grand cultural gala featuring classical fusion, dance face-offs, campus rock bands, and neon DJ night.',
        posterUrl: svgPoster('Cultural & Star DJ Night', 'Cultural', '#ec4899', '#7c3aed'),
        date: '2026-12-19',
        time: '05:30 PM - 10:30 PM',
        venue: 'ABIT Main Auditorium & Ground',
        participationMode: 'Both',
        maxTeamSize: 6,
        fee: 299,
        status: 'Upcoming'
      },
      {
        title: 'ABIT Premier Cricket & Futsal Cup',
        category: 'Sports',
        description: 'Inter-college floodlight cricket, futsal, badminton, and athletics showdown.',
        posterUrl: svgPoster('ABIT Premier Sports Cup', 'Sports', '#f97316', '#3b82f6'),
        date: '2026-12-18',
        time: '07:00 AM - 04:00 PM',
        venue: 'ABIT Sports Complex',
        participationMode: 'Team',
        maxTeamSize: 11,
        fee: 199,
        status: 'Upcoming'
      },
      {
        title: 'UI/UX Designathon & Digital Art Jam',
        category: 'Creative',
        description: 'Rapid product design sprint, motion graphics challenge, and campus photography reel contest.',
        posterUrl: svgPoster('UI/UX Designathon 2026', 'Creative', '#ec4899', '#f97316'),
        date: '2026-12-19',
        time: '10:00 AM - 03:00 PM',
        venue: 'Design Studio & Seminar Hall 2',
        participationMode: 'Both',
        maxTeamSize: 2,
        fee: 149,
        status: 'Upcoming'
      },
      {
        title: 'Valorant & BGMI Esports Showdown',
        category: 'Gaming',
        description: 'Competitive LAN & mobile esports tournament with live stage casting and LED leaderboard.',
        posterUrl: svgPoster('Esports LAN Showdown', 'Gaming', '#7c3aed', '#00f0ff'),
        date: '2026-12-19',
        time: '10:30 AM - 06:00 PM',
        venue: 'E-Sports Lab, Academic Block',
        participationMode: 'Team',
        maxTeamSize: 5,
        fee: 199,
        status: 'Upcoming'
      },
      {
        title: 'AI & Cloud Architecture Symposium',
        category: 'Academic',
        description: 'Paper presentations, GenAI research colloquium, and cloud engineering keynote sessions.',
        posterUrl: svgPoster('AI & Cloud Symposium', 'Academic', '#3b82f6', '#00f0ff'),
        date: '2026-12-18',
        time: '10:00 AM - 02:00 PM',
        venue: 'Main Seminar Auditorium',
        participationMode: 'Individual',
        maxTeamSize: 1,
        fee: 99,
        status: 'Upcoming'
      }
    ]);
  }

  if ((await ScheduleItem.countDocuments()) === 0) {
    await ScheduleItem.insertMany([
      {
        day: 'Day 1 • Dec 18',
        time: '09:00 AM',
        title: 'Inauguration & Keynote: Beyond Technology',
        venue: 'ABIT Main Auditorium',
        category: 'Keynote',
        speakerOrLead: 'Principal & Guest Speakers',
        description: 'Opening ceremony, lamp lighting, and GDG-inspired tech keynote for all Abitans.',
        order: 1
      },
      {
        day: 'Day 1 • Dec 18',
        time: '10:30 AM',
        title: 'DevSprint Hackathon & RoboWars Kickoff',
        venue: 'Innovation Block & Quadrangle',
        category: 'Technical',
        speakerOrLead: 'Tech Leads & Mentors',
        description: 'Problem statement reveal, hardware inspection, and round-1 heats.',
        order: 2
      },
      {
        day: 'Day 1 • Dec 18',
        time: '04:30 PM',
        title: 'Floodlight Sports Finals & Esports Qualifiers',
        venue: 'Sports Complex & Esports Lab',
        category: 'Sports',
        speakerOrLead: 'Sports Committee',
        description: 'Quarterfinals and high-energy LAN bracket matches.',
        order: 3
      },
      {
        day: 'Day 2 • Dec 19',
        time: '10:00 AM',
        title: 'UI/UX Designathon & AI Research Colloquium',
        venue: 'Seminar Hall 1 & 2',
        category: 'Academic',
        speakerOrLead: 'Industry Mentors',
        description: 'Live UI prototyping critiques and paper presentations.',
        order: 4
      },
      {
        day: 'Day 2 • Dec 19',
        time: '06:00 PM',
        title: 'Annual Cultural Gala, Awards & Star DJ Night',
        venue: 'Main Stage Ground',
        category: 'Cultural',
        speakerOrLead: 'Host Team & Performing Artists',
        description: 'Fashion walk, prize distribution, live concert, and grand neon finale.',
        order: 5
      }
    ]);
  }

  if ((await Speaker.countDocuments()) === 0) {
    await Speaker.insertMany([
      {
        name: 'Er. Shakti Prashad Mohanty',
        designation: 'Principal Systems Architect & IoT Mentor',
        organization: 'ABIT Innovation Council',
        topic: 'Edge AI & Smart Campus Architectures',
        bio: 'Guides full-stack and embedded systems teams across national hackathons and industrial IoT deployments.',
        imageUrl: ''
      },
      {
        name: 'Ananya Mohapatra',
        designation: 'Google Developer Expert (Cloud & AI)',
        organization: 'GDG Bhubaneswar Community',
        topic: 'Scaling GenAI Apps for Real Users',
        bio: 'Cloud native architect and frequent DevFest keynote speaker passionate about student developer ecosystems.',
        imageUrl: ''
      },
      {
        name: 'Rohan Tripathy',
        designation: 'Senior Product Designer',
        organization: 'Studio Nova India',
        topic: 'Motion-Driven Interfaces & Design Systems',
        bio: 'Specializes in interactive web experiences, micro-animations, and accessible dark-mode UI systems.',
        imageUrl: ''
      },
      {
        name: 'Dr. Subhamita Panda',
        designation: 'Lead Robotics Researcher',
        organization: 'Eastern Robotics Lab',
        topic: 'Autonomous Swarm Navigation',
        bio: 'Leads applied robotics and computer vision research bridging academic prototypes to industry.',
        imageUrl: ''
      }
    ]);
  }

  if ((await Sponsor.countDocuments()) === 0) {
    await Sponsor.insertMany([
      { name: 'Odisha TechCloud', tier: 'Title', website: 'https://example.com' },
      { name: 'Kalinga Robotics', tier: 'Platinum', website: 'https://example.com' },
      { name: 'Cuttack DevGuild', tier: 'Gold', website: 'https://example.com' },
      { name: 'NeonPulse Audio', tier: 'Gold', website: 'https://example.com' },
      { name: 'Eastern Cloud Labs', tier: 'Platinum', website: 'https://example.com' },
      { name: 'CampusSpark Media', tier: 'Community', website: 'https://example.com' }
    ]);
  }

  if ((await GalleryItem.countDocuments()) === 0) {
    await GalleryItem.insertMany([
      { title: 'ABIT Main Stage Neon Finale', mediaType: 'image', url: '/hero-fest.jpg', category: 'Cultural' },
      { title: 'DevSprint Hackathon Coding Arena', mediaType: 'image', url: svgPoster('Hackathon Coding Arena', 'Technical', '#3b82f6', '#7c3aed'), category: 'Technical' },
      { title: 'RoboWars Championship Sparks', mediaType: 'image', url: svgPoster('RoboWars Highlights', 'Robotics', '#f97316', '#ec4899'), category: 'Robotics' },
      { title: 'Cultural Dance & Fashion Walk', mediaType: 'image', url: svgPoster('Fashion & Cultural Walk', 'Cultural', '#ec4899', '#7c3aed'), category: 'Cultural' },
      { title: 'Campus Esports Finals', mediaType: 'image', url: svgPoster('Esports Grand Finals', 'Gaming', '#7c3aed', '#00f0ff'), category: 'Gaming' },
      { title: 'Keynote & Award Ceremony', mediaType: 'image', url: svgPoster('Keynote & Awards', 'Academic', '#3b82f6', '#f97316'), category: 'Academic' }
    ]);
  }

  if ((await Notification.countDocuments()) === 0) {
    await Notification.insertMany([
      {
        title: 'ABIT FEST 2026 Registrations Open',
        message: 'Welcome to all Abitans! Register for Technical, Robotics, Cultural, Sports, Creative, Gaming & Academic events.',
        type: 'announcement'
      },
      {
        title: 'Host Receipt Collection Desk',
        message: 'Dear Candidate, get your receipt from Host Suryakanta Senapati, Manas Das, Dibya Ranjan Sethy, Debendra Pradhan, Pratik Khandai, Subhashree Prusti and Other Hosts Member.',
        type: 'schedule'
      },
      {
        title: 'Urgent Ticket Helpline',
        message: 'Urgent ticket contact: 7848817688 (Host Suryakanta) or 824 970 9981 (Host Manas).',
        type: 'urgent'
      }
    ]);
  }
}
