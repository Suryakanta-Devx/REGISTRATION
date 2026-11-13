import express from 'express';
import QRCode from 'qrcode';
import PDFDocument from 'pdfkit';
import Event from '../models/Event.js';
import Registration from '../models/Registration.js';
import Notification from '../models/Notification.js';
import { authenticate, authorize, optionalAuthenticate } from '../middleware/auth.js';
import { sendRegistrationConfirmationEmail } from '../utils/mailer.js';

const router = express.Router();

function generateRegistrationId() {
  const rand = Math.floor(1000 + Math.random() * 9000);
  const tail = Date.now().toString().slice(-3);
  return `ABIT26-${rand}${tail}`;
}

function validateRegistrationInput(body) {
  const errors = [];
  if (!body.studentName?.trim()) errors.push('Student name is required.');
  if (!body.rollNumber?.trim()) errors.push('College roll number is required.');
  if (!body.registrationNumber?.trim()) errors.push('Registration number is required.');
  if (!body.department?.trim()) errors.push('Department is required.');
  if (!body.semester?.trim()) errors.push('Semester is required.');
  if (!body.email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email.trim())) {
    errors.push('A valid email address is required.');
  }
  if (!body.phone?.trim() || !/^[0-9+\-\s]{10,15}$/.test(body.phone.trim())) {
    errors.push('A valid 10+ digit phone number is required.');
  }
  if (!body.eventId) errors.push('Event selection is required.');
  if (!['Individual', 'Team'].includes(body.participationType)) {
    errors.push('Participation type must be Individual or Team.');
  }
  if (body.participationType === 'Team' && !body.teamMembers?.trim()) {
    errors.push('Please list team members for team participation.');
  }
  return errors;
}

// Create registration (authenticated or guest student, validated & persisted in MongoDB)
router.post('/', optionalAuthenticate, async (req, res) => {
  try {
    const errors = validateRegistrationInput(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ message: errors[0], errors });
    }

    const event = await Event.findById(req.body.eventId);
    if (!event) {
      return res.status(404).json({ message: 'Selected event does not exist.' });
    }
    if (event.status === 'Completed') {
      return res.status(400).json({ message: 'Registrations are closed for completed events.' });
    }

    const normalizedRoll = req.body.rollNumber.trim().toUpperCase();
    const normalizedEmail = req.body.email.trim().toLowerCase();

    // Prevent duplicate registration
    const duplicate = await Registration.findOne({
      eventId: event._id,
      status: { $ne: 'Cancelled' },
      $or: [{ rollNumber: normalizedRoll }, { email: normalizedEmail }]
    });

    if (duplicate) {
      return res.status(409).json({
        message: `Duplicate registration prevented: ${normalizedRoll} or ${normalizedEmail} is already registered for ${event.title} (ID: ${duplicate.registrationId}).`
      });
    }

    const registrationId = generateRegistrationId();
    const qrPayload = JSON.stringify({
      registrationId,
      studentName: req.body.studentName.trim(),
      rollNumber: normalizedRoll,
      event: event.title,
      college: 'ABIT Cuttack'
    });
    const qrDataUrl = await QRCode.toDataURL(qrPayload, { width: 260, margin: 1 });

    const created = await Registration.create({
      registrationId,
      userId: req.user ? req.user._id : null,
      studentName: req.body.studentName.trim(),
      rollNumber: normalizedRoll,
      registrationNumber: req.body.registrationNumber.trim().toUpperCase(),
      department: req.body.department.trim(),
      semester: req.body.semester.trim(),
      email: normalizedEmail,
      phone: req.body.phone.trim(),
      eventId: event._id,
      eventTitle: event.title,
      participationType: req.body.participationType,
      teamName: (req.body.teamName || '').trim(),
      teamMembers: (req.body.teamMembers || '').trim(),
      qrDataUrl,
      status: 'Pending',
      emailSent: false
    });

    const mailResult = await sendRegistrationConfirmationEmail(created, event);
    if (mailResult.sent) {
      created.emailSent = true;
      await created.save();
    }

    await Notification.create({
      title: `New Registration: ${event.title}`,
      message: `${created.studentName} (${created.rollNumber}) registered with ID ${created.registrationId}.`,
      type: 'registration'
    });

    res.status(201).json({ registration: created, emailResult: mailResult });
  } catch (err) {
    if (err?.code === 11000) {
      return res.status(409).json({ message: 'Duplicate registration detected for this event.' });
    }
    res.status(500).json({ message: err.message || 'Registration failed.' });
  }
});

// Student: get own registrations (matches userId, email, or rollNumber)
router.get('/my', authenticate, async (req, res) => {
  try {
    const clauses = [{ userId: req.user._id }, { email: req.user.email.toLowerCase() }];
    if (req.user.rollNumber) {
      clauses.push({ rollNumber: req.user.rollNumber.toUpperCase() });
    }
    const list = await Registration.find({ $or: clauses })
      .populate('eventId')
      .sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Lookup single registration by registrationId (for quick receipt / QR verification)
router.get('/lookup/:regId', async (req, res) => {
  try {
    const reg = await Registration.findOne({ registrationId: req.params.regId.trim().toUpperCase() }).populate('eventId');
    if (!reg) return res.status(404).json({ message: 'Registration not found.' });
    res.json(reg);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: view all registrations
router.get('/', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { eventId, status } = req.query;
    const filter = {};
    if (eventId && eventId !== 'All') filter.eventId = eventId;
    if (status && status !== 'All') filter.status = status;
    const list = await Registration.find(filter).populate('eventId').sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: approve or reject registration
router.patch('/:id/status', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { status } = req.body;
    if (!['Pending', 'Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value.' });
    }
    const updated = await Registration.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!updated) return res.status(404).json({ message: 'Registration not found.' });

    await Notification.create({
      title: `Registration ${status}: ${updated.registrationId}`,
      message: `${updated.studentName}'s registration for ${updated.eventTitle} has been marked as ${status}.`,
      type: status === 'Approved' ? 'registration' : 'urgent'
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Student: cancel own upcoming registration
router.patch('/:id/cancel', authenticate, async (req, res) => {
  try {
    const reg = await Registration.findById(req.params.id).populate('eventId');
    if (!reg) return res.status(404).json({ message: 'Registration not found.' });

    const isOwner =
      (reg.userId && reg.userId.toString() === req.user._id.toString()) ||
      reg.email.toLowerCase() === req.user.email.toLowerCase();

    if (!isOwner && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden: cannot cancel another student registration.' });
    }
    if (reg.eventId && reg.eventId.status !== 'Upcoming') {
      return res.status(400).json({ message: 'Cancellation is only permitted for Upcoming events.' });
    }

    reg.status = 'Cancelled';
    await reg.save();
    res.json(reg);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Download official PDF Receipt (authenticated owner/admin or valid registrationId match)
router.get('/:id/receipt', optionalAuthenticate, async (req, res) => {
  try {
    const reg = await Registration.findById(req.params.id).populate('eventId');
    if (!reg) return res.status(404).json({ message: 'Registration not found.' });

    const doc = new PDFDocument({ size: 'A4', margin: 48 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${reg.registrationId}-receipt.pdf"`);
    doc.pipe(res);

    doc.rect(0, 0, 595, 110).fill('#070b1a');
    doc.fillColor('#ffffff').fontSize(22).font('Helvetica-Bold').text('ABIT FEST 2026', 48, 32);
    doc.fillColor('#93c5fd').fontSize(11).font('Helvetica').text('Beyond Technology. Beyond Imagination. | Ajay Binay Institute of Technology, Cuttack', 48, 62);
    doc.fillColor('#f97316').fontSize(10).font('Helvetica-Bold').text('OFFICIAL EVENT REGISTRATION RECEIPT', 48, 82);

    doc.fillColor('#111827').fontSize(13).font('Helvetica-Bold').text(`Registration ID: ${reg.registrationId}`, 48, 134);
    doc.fontSize(11).font('Helvetica').text(`Status: ${reg.status}   |   Registered On: ${new Date(reg.createdAt).toLocaleString()}`, 48, 154);

    doc.moveTo(48, 178).lineTo(547, 178).strokeColor('#cbd5e1').stroke();

    const rows = [
      ['Student Name', reg.studentName],
      ['College Roll Number', reg.rollNumber],
      ['Registration Number', reg.registrationNumber],
      ['Department & Semester', `${reg.department} (${reg.semester})`],
      ['Email & Phone', `${reg.email}  |  ${reg.phone}`],
      ['Event Name', reg.eventTitle],
      ['Date & Venue', reg.eventId ? `${reg.eventId.date} (${reg.eventId.time}) — ${reg.eventId.venue}` : 'ABIT Campus, Cuttack'],
      ['Participation Type', reg.participationType],
      ['Team Name', reg.teamName || 'Individual'],
      ['Team Members', reg.teamMembers || 'N/A']
    ];

    let y = 196;
    for (const [label, value] of rows) {
      doc.font('Helvetica-Bold').fontSize(10).fillColor('#334155').text(label, 48, y, { width: 165 });
      doc.font('Helvetica').fontSize(10).fillColor('#0f172a').text(String(value), 220, y, { width: 220 });
      y += 24;
    }

    // Embed QR Code image from data URL
    if (reg.qrDataUrl && reg.qrDataUrl.startsWith('data:image/png;base64,')) {
      const base64Data = reg.qrDataUrl.split(',')[1];
      const imgBuf = Buffer.from(base64Data, 'base64');
      doc.image(imgBuf, 445, 196, { width: 100 });
      doc.fontSize(8).fillColor('#64748b').text('Scan at Venue Desk', 452, 300);
    }

    y += 20;
    doc.rect(48, y, 499, 66).fill('#f1f5f9');
    doc.fillColor('#0f172a').font('Helvetica-Bold').fontSize(10).text('Host Receipt & Urgent Contact Notice:', 60, y + 12);
    doc.font('Helvetica').fontSize(9).fillColor('#334155').text(
      'Dear Candidate, get your physical receipt from Host Suryakanta Senapati, Manas Das, Dibya Ranjan Sethy, Debendra Pradhan, Pratik Khandai, Subhashree Prusti and Other Hosts Member.',
      60,
      y + 27,
      { width: 475 }
    );
    doc.font('Helvetica-Bold').fontSize(9).fillColor('#be123c').text(
      'Urgent Ticket Contact: 7848817688 (Host Suryakanta)  |  824 970 9981 (Host Manas)',
      60,
      y + 52
    );

    doc.end();
  } catch (err) {
    res.status(500).json({ message: err.message || 'Could not generate PDF receipt.' });
  }
});

export default router;
