export const EVENT_CATEGORIES = [
  'Upcoming College Functions',
  'Technical Festivals',
  'Annual Functions',
  'Cultural Programs',
  'Sports Events',
  'Workshops and Seminars',
  'Hackathons',
  'Freshers and Farewell Parties'
];

export const CATEGORY_ACCENTS = {
  'Upcoming College Functions': '#00f0ff',
  'Technical Festivals': '#00ffaa',
  'Annual Functions': '#ffd700',
  'Cultural Programs': '#ff003c',
  'Sports Events': '#ff7b00',
  'Workshops and Seminars': '#7000ff',
  Hackathons: '#00f0ff',
  'Freshers and Farewell Parties': '#ff3cac'
};

export function buildEventPosterUrl(title, category, accentOverride) {
  const accent = accentOverride || CATEGORY_ACCENTS[category] || '#00f0ff';
  const safeTitle = String(title || 'Ignitron 2K26 Event')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .slice(0, 34);
  const safeCategory = String(category || 'College Function')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .toUpperCase();

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="420" viewBox="0 0 800 420">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#080812"/>
        <stop offset="55%" stop-color="#111124"/>
        <stop offset="100%" stop-color="#050508"/>
      </linearGradient>
      <radialGradient id="glow1" cx="20%" cy="20%" r="60%">
        <stop offset="0%" stop-color="${accent}" stop-opacity="0.35"/>
        <stop offset="100%" stop-color="${accent}" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="glow2" cx="85%" cy="80%" r="55%">
        <stop offset="0%" stop-color="#7000ff" stop-opacity="0.35"/>
        <stop offset="100%" stop-color="#7000ff" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="800" height="420" fill="url(#bg)"/>
    <rect width="800" height="420" fill="url(#glow1)"/>
    <rect width="800" height="420" fill="url(#glow2)"/>
    <g stroke="rgba(255,255,255,0.06)" stroke-width="1">
      <line x1="0" y1="70" x2="800" y2="70"/>
      <line x1="0" y1="140" x2="800" y2="140"/>
      <line x1="0" y1="210" x2="800" y2="210"/>
      <line x1="0" y1="280" x2="800" y2="280"/>
      <line x1="0" y1="350" x2="800" y2="350"/>
      <line x1="160" y1="0" x2="160" y2="420"/>
      <line x1="320" y1="0" x2="320" y2="420"/>
      <line x1="480" y1="0" x2="480" y2="420"/>
      <line x1="640" y1="0" x2="640" y2="420"/>
    </g>
    <circle cx="670" cy="110" r="85" fill="none" stroke="${accent}" stroke-opacity="0.35" stroke-width="2"/>
    <circle cx="670" cy="110" r="55" fill="none" stroke="#ffffff" stroke-opacity="0.15" stroke-width="1.5"/>
    <rect x="44" y="42" rx="18" ry="18" width="290" height="34" fill="rgba(0,0,0,0.55)" stroke="${accent}" stroke-opacity="0.8"/>
    <text x="62" y="64" fill="${accent}" font-family="Arial, sans-serif" font-size="13" font-weight="700" letter-spacing="1.5">${safeCategory}</text>
    <text x="44" y="195" fill="#ffffff" font-family="Arial, sans-serif" font-size="38" font-weight="800">${safeTitle}</text>
    <text x="44" y="242" fill="#a0a0ab" font-family="Arial, sans-serif" font-size="18" font-weight="500">IGNITRON 2K26 • ABIT COLLEGE FUNCTION</text>
    <rect x="44" y="290" width="140" height="4" rx="2" fill="${accent}"/>
    <text x="44" y="346" fill="#ffffff" font-family="Arial, sans-serif" font-size="15" opacity="0.85">Welcome to all Abitans • Official Event Pass &amp; QR Entry</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

const EVENTS_KEY = 'ignitron_2k26_events_v2';
const REGISTRATIONS_KEY = 'ignitron_2k26_registrations_v2';
const NOTIFICATIONS_KEY = 'ignitron_2k26_notifications_v2';
const ACTIVE_STUDENT_KEY = 'ignitron_2k26_active_student_v2';

export const DEFAULT_EVENTS = [
  {
    id: 'evt-annual-2026',
    name: 'Annual Function 2026',
    category: 'Annual Functions',
    image: buildEventPosterUrl('Annual Function 2026', 'Annual Functions'),
    date: '2026-11-28',
    time: '04:00 PM - 10:00 PM',
    venue: 'ABIT Main College Auditorium',
    description:
      'Grand annual celebration of ABIT featuring welcome ceremony for all Abitans, felicitation of toppers, cultural gala, and live star & DJ night.',
    status: 'Upcoming',
    fee: 299
  },
  {
    id: 'evt-techfest-2026',
    name: 'Ignitron TechFest & Robotics Expo',
    category: 'Technical Festivals',
    image: buildEventPosterUrl('Ignitron TechFest 2026', 'Technical Festivals'),
    date: '2026-11-26',
    time: '09:30 AM - 05:30 PM',
    venue: 'Central Innovation Block & Lawn',
    description:
      'Inter-department technical festival showcasing robotics wars, drone races, project expos, coding duels, and circuit debugging arenas.',
    status: 'Upcoming',
    fee: 199
  },
  {
    id: 'evt-cultural-2026',
    name: 'Rhythms Cultural & Fashion Gala',
    category: 'Cultural Programs',
    image: buildEventPosterUrl('Rhythms Cultural Gala', 'Cultural Programs'),
    date: '2026-11-12',
    time: '05:00 PM - 09:30 PM',
    venue: 'Open Air Amphitheatre, ABIT',
    description:
      'Solo and group dance battles, classical & rock vocal face-offs, fashion walk 2K26, and theatre skits.',
    status: 'Ongoing',
    fee: 249
  },
  {
    id: 'evt-hackathon-2026',
    name: 'ABIR 36-Hour Mega Hackathon',
    category: 'Hackathons',
    image: buildEventPosterUrl('ABIR Mega Hackathon', 'Hackathons'),
    date: '2026-11-29',
    time: '09:00 AM - 09:00 PM (Next Day)',
    venue: 'CSE Smart Lab & Incubation Hub',
    description:
      'Build real-world AI, Web3, and IoT prototypes with 24/7 mentoring, tinkering lab access, and cash prizes.',
    status: 'Upcoming',
    fee: 299
  },
  {
    id: 'evt-sports-2026',
    name: 'ABIT Premier Sports Meet 2K26',
    category: 'Sports Events',
    image: buildEventPosterUrl('ABIT Premier Sports Meet', 'Sports Events'),
    date: '2026-11-25',
    time: '07:30 AM - 04:30 PM',
    venue: 'ABIT Sports Complex & Cricket Ground',
    description:
      'Inter-branch cricket, football, badminton, volleyball, athletics, and esports championships.',
    status: 'Upcoming',
    fee: 149
  },
  {
    id: 'evt-workshop-2026',
    name: 'GenAI & Cloud Architecture Workshop',
    category: 'Workshops and Seminars',
    image: buildEventPosterUrl('GenAI & Cloud Workshop', 'Workshops and Seminars'),
    date: '2026-11-24',
    time: '10:30 AM - 03:30 PM',
    venue: 'Seminar Hall 1, Academic Block',
    description:
      'Hands-on seminar and workshop on Generative AI, Edge IoT, and modern cloud deployment with participation certificates.',
    status: 'Upcoming',
    fee: 99
  },
  {
    id: 'evt-freshers-2026',
    name: 'Aarambh Freshers & Farewell Night',
    category: 'Freshers and Farewell Parties',
    image: buildEventPosterUrl('Freshers & Farewell Bash', 'Freshers and Farewell Parties'),
    date: '2026-12-02',
    time: '06:00 PM - 10:30 PM',
    venue: 'ABIT Convention Auditorium',
    description:
      'A memorable evening welcoming 1st-year Abitans and celebrating graduating seniors with Mr. & Ms. Ignitron titles and dinner.',
    status: 'Upcoming',
    fee: 349
  },
  {
    id: 'evt-inaugural-2026',
    name: 'Ignitron Curtain Raiser & Orientation',
    category: 'Upcoming College Functions',
    image: buildEventPosterUrl('Ignitron Curtain Raiser', 'Upcoming College Functions'),
    date: '2026-11-05',
    time: '10:00 AM - 01:00 PM',
    venue: 'College Auditorium',
    description:
      'Official launch of Ignitron 2K26 banners, host desk inauguration, and schedule unveiling for all departments.',
    status: 'Completed',
    fee: 0
  }
];

export const DEFAULT_REGISTRATIONS = [
  {
    registrationId: 'IGN-REG-2026-4108',
    ticketNumber: 'IGN26-4108-19',
    receiptNumber: 'RCPT-2026-904108',
    studentName: 'Aarav Mohanty',
    registrationNumber: '2301294108',
    rollNumber: 'ABIT23CSE014',
    department: 'Computer Science (CSE)',
    semester: '5th Semester',
    collegeEmail: 'aarav.m@abit.edu',
    mobileNumber: '9861122334',
    eventId: 'evt-annual-2026',
    eventName: 'Annual Function 2026',
    participationType: 'Solo',
    teamName: '',
    teamMembers: '',
    status: 'Approved',
    emailConfirmed: true,
    createdAt: '2026-11-11T11:20:00.000Z'
  },
  {
    registrationId: 'IGN-REG-2026-4295',
    ticketNumber: 'IGN26-4295-72',
    receiptNumber: 'RCPT-2026-904295',
    studentName: 'Sneha Nayak',
    registrationNumber: '2401294295',
    rollNumber: 'ABIT24ECE027',
    department: 'Electrical & Computer Engineering (ECE)',
    semester: '3rd Semester',
    collegeEmail: 'sneha.n@abit.edu',
    mobileNumber: '9437889900',
    eventId: 'evt-hackathon-2026',
    eventName: 'ABIR 36-Hour Mega Hackathon',
    participationType: 'Team',
    teamName: 'VoltCrafters',
    teamMembers: 'Sneha Nayak, Ritesh Panda, Ankita Das',
    status: 'Pending Approval',
    emailConfirmed: true,
    createdAt: '2026-11-12T09:10:00.000Z'
  }
];

export const DEFAULT_NOTIFICATIONS = [
  {
    id: 'notif-1',
    title: 'Welcome to all Abitans — Ignitron 2K26 Registrations Live!',
    message:
      'Registrations are open across Annual Function 2026, TechFest, Cultural Gala, Sports Meet, Workshops, Hackathons, and Freshers/Farewell.',
    createdAt: '2026-11-12T08:00:00.000Z',
    type: 'announcement'
  },
  {
    id: 'notif-2',
    title: 'Physical Receipt Collection Desk Open',
    message:
      'Dear Candidate, get your receipt from Host Suryakanta Senapati, Manas Das, Dibya Ranjan Sethy, Debendra Pradhan, Pratik Khandai, Subhashree Prusti and Other Hosts Member.',
    createdAt: '2026-11-12T09:30:00.000Z',
    type: 'receipt'
  },
  {
    id: 'notif-3',
    title: 'Urgent Ticket Helpline',
    message:
      'For urgent tickets or pass verification contact 7848817688 (Host Suryakanta) or 824 970 9981 (Host Manas).',
    createdAt: '2026-11-12T10:15:00.000Z',
    type: 'urgent'
  }
];

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    const parsed = JSON.parse(raw);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage errors
  }
}

export function getEvents() {
  return readJson(EVENTS_KEY, DEFAULT_EVENTS);
}

export function addEvent(eventData) {
  const existing = getEvents();
  const newEvent = {
    id: `evt-${Date.now()}`,
    ...eventData,
    image: eventData.image?.trim() || buildEventPosterUrl(eventData.name, eventData.category)
  };
  const updated = [newEvent, ...existing];
  writeJson(EVENTS_KEY, updated);
  return updated;
}

export function updateEvent(eventId, updates) {
  const existing = getEvents();
  const updated = existing.map((ev) =>
    ev.id === eventId
      ? {
          ...ev,
          ...updates,
          image: updates.image?.trim() || buildEventPosterUrl(updates.name || ev.name, updates.category || ev.category)
        }
      : ev
  );
  writeJson(EVENTS_KEY, updated);
  return updated;
}

export function deleteEvent(eventId) {
  const existing = getEvents();
  const updated = existing.filter((ev) => ev.id !== eventId);
  writeJson(EVENTS_KEY, updated);
  return updated;
}

export function getRegistrations() {
  return readJson(REGISTRATIONS_KEY, DEFAULT_REGISTRATIONS);
}

export function createRegistration(formData, selectedEvent) {
  const num = Math.floor(1000 + Math.random() * 9000);
  const suffix = Math.floor(10 + Math.random() * 90);
  const rcpt = Math.floor(100000 + Math.random() * 900000);
  const registrationId = `IGN-REG-2026-${num}`;
  const ticketNumber = `IGN26-${num}-${suffix}`;
  const receiptNumber = `RCPT-2026-${rcpt}`;

  const newRecord = {
    registrationId,
    ticketNumber,
    receiptNumber,
    studentName: formData.studentName.trim(),
    registrationNumber: formData.registrationNumber.trim().toUpperCase(),
    rollNumber: formData.rollNumber.trim().toUpperCase(),
    department: formData.department,
    semester: formData.semester,
    collegeEmail: formData.collegeEmail.trim(),
    mobileNumber: formData.mobileNumber.trim(),
    eventId: selectedEvent?.id || formData.eventId,
    eventName: selectedEvent?.name || formData.eventName,
    participationType: formData.participationType,
    teamName: formData.teamName?.trim() || '',
    teamMembers: formData.teamMembers?.trim() || '',
    status: 'Pending Approval',
    emailConfirmed: true,
    createdAt: new Date().toISOString()
  };

  const existing = getRegistrations();
  const updated = [newRecord, ...existing];
  writeJson(REGISTRATIONS_KEY, updated);
  setActiveStudent({
    studentName: newRecord.studentName,
    rollNumber: newRecord.rollNumber,
    registrationNumber: newRecord.registrationNumber,
    collegeEmail: newRecord.collegeEmail
  });

  addNotification({
    title: `Registration Confirmed: ${newRecord.eventName}`,
    message: `Registration ID ${newRecord.registrationId} generated for ${newRecord.studentName} (${newRecord.rollNumber}). Status: Pending Approval.`,
    type: 'registration'
  });

  return newRecord;
}

export function updateRegistrationStatus(registrationId, newStatus) {
  const existing = getRegistrations();
  let targetReg = null;
  const updated = existing.map((reg) => {
    if (reg.registrationId === registrationId) {
      targetReg = { ...reg, status: newStatus };
      return targetReg;
    }
    return reg;
  });
  writeJson(REGISTRATIONS_KEY, updated);
  if (targetReg) {
    addNotification({
      title: `Registration ${newStatus}: ${targetReg.registrationId}`,
      message: `${targetReg.studentName}'s registration for ${targetReg.eventName} is now "${newStatus}".`,
      type: newStatus === 'Approved' ? 'success' : 'urgent'
    });
  }
  return updated;
}

export function cancelRegistration(registrationId) {
  return updateRegistrationStatus(registrationId, 'Cancelled');
}

export function getNotifications() {
  return readJson(NOTIFICATIONS_KEY, DEFAULT_NOTIFICATIONS);
}

export function addNotification({ title, message, type = 'announcement' }) {
  const existing = getNotifications();
  const newNotif = {
    id: `notif-${Date.now()}-${Math.floor(Math.random() * 100)}`,
    title,
    message,
    type,
    createdAt: new Date().toISOString()
  };
  const updated = [newNotif, ...existing];
  writeJson(NOTIFICATIONS_KEY, updated);
  return updated;
}

export function getActiveStudent() {
  try {
    const raw = localStorage.getItem(ACTIVE_STUDENT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setActiveStudent(student) {
  writeJson(ACTIVE_STUDENT_KEY, student);
}
