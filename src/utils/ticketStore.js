export const PASS_OPTIONS = [
  {
    id: 'standard',
    name: 'Standard ABITian Pass',
    price: 299,
    badge: 'Single Entry',
    description: 'Entry to all daytime cultural shows, talent showcases, and campus carnival zones.'
  },
  {
    id: 'vip',
    name: 'VIP All-Access Pass',
    price: 499,
    badge: 'Best Value',
    description: 'Priority front-row access, Star & DJ Night entry, food court voucher, and official wristband.'
  },
  {
    id: 'duo',
    name: 'Duo / Friends Pass',
    price: 549,
    badge: '2 Entries',
    description: 'Discounted combo pass for 2 ABITians covering cultural evening, DJ Night, and carnival access.'
  },
  {
    id: 'guest',
    name: 'Alumni / Guest Pass',
    price: 399,
    badge: 'Guest Access',
    description: 'Dedicated guest pass for ABIT alumni, faculty guests, and special invitees.'
  }
];

export const HOSTS_LIST = [
  'Suryakanta Senapati',
  'Manas Das',
  'Dibya Ranjan Sethy',
  'Debendra Pradhan',
  'Pratik Khandai',
  'Subhashree Prusti'
];

export const RECEIPT_COLLECTION_MESSAGE =
  'Dear Candidate, get your receipt from Host Suryakanta Senapati, Manas Das, Dibya Ranjan Sethy, Debendra Pradhan, Pratik Khandai, Subhashree Prusti and Other Hosts Member.';

export const URGENT_CONTACTS = [
  { name: 'Host Suryakanta', fullName: 'Suryakanta Senapati', phone: '7848817688', tel: '7848817688' },
  { name: 'Host Manas', fullName: 'Manas Das', phone: '824 970 9981', tel: '8249709981' }
];

const STORAGE_KEY = 'ignitron_2k26_tickets';

export const DEFAULT_SAMPLE_BOOKINGS = [
  {
    ticketNumber: 'IGN26-1042-88',
    receiptNumber: 'RCPT-2026-841201',
    paymentRef: 'UPI-6309182745',
    candidateName: 'Rahul Sharma',
    studentId: 'ABIT23CSE042',
    department: 'Computer Science (CSE)',
    year: '3rd Year',
    phone: '9861001122',
    email: 'rahul.s@abit.edu',
    passId: 'vip',
    passName: 'VIP All-Access Pass',
    unitPrice: 499,
    quantity: 1,
    totalPaid: 499,
    paymentMethod: 'UPI (GPay / PhonePe / Paytm)',
    paymentStatus: 'PAID',
    receiptCollected: true,
    bookedAt: '2026-11-12T10:30:00.000Z'
  },
  {
    ticketNumber: 'IGN26-1089-34',
    receiptNumber: 'RCPT-2026-841390',
    paymentRef: 'CASH-HOST-202',
    candidateName: 'Priya Patel',
    studentId: 'ABIT24ECE019',
    department: 'Electrical & Computer Engineering (ECE)',
    year: '2nd Year',
    phone: '9437002233',
    email: 'priya.p@abit.edu',
    passId: 'standard',
    passName: 'Standard ABITian Pass',
    unitPrice: 299,
    quantity: 2,
    totalPaid: 598,
    paymentMethod: 'Cash / Direct to Host',
    paymentStatus: 'PAID',
    receiptCollected: false,
    bookedAt: '2026-11-12T14:15:00.000Z'
  }
];

export function getStoredBookings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SAMPLE_BOOKINGS));
      return DEFAULT_SAMPLE_BOOKINGS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : DEFAULT_SAMPLE_BOOKINGS;
  } catch {
    return DEFAULT_SAMPLE_BOOKINGS;
  }
}

export function saveBooking(booking) {
  const existing = getStoredBookings();
  const updated = [booking, ...existing];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // Ignore storage quota errors in restricted environments
  }
  return updated;
}

export function toggleReceiptCollected(ticketNumber) {
  const existing = getStoredBookings();
  const updated = existing.map((item) =>
    item.ticketNumber === ticketNumber
      ? { ...item, receiptCollected: !item.receiptCollected }
      : item
  );
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // Ignore storage quota errors
  }
  return updated;
}

export function generateTicketIdentifiers() {
  const partA = Math.floor(1000 + Math.random() * 9000);
  const partB = Math.floor(10 + Math.random() * 90);
  const rcptSuffix = Math.floor(100000 + Math.random() * 900000);
  const txnSuffix = Math.floor(10000000 + Math.random() * 90000000);
  return {
    ticketNumber: `IGN26-${partA}-${partB}`,
    receiptNumber: `RCPT-2026-${rcptSuffix}`,
    autoPaymentRef: `PAY26-${txnSuffix}`
  };
}
