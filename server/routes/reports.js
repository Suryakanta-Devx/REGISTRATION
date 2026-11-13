import express from 'express';
import * as XLSX from 'xlsx';
import PDFDocument from 'pdfkit';
import Registration from '../models/Registration.js';
import Event from '../models/Event.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/excel', authenticate, authorize('admin'), async (_req, res) => {
  try {
    const registrations = await Registration.find().sort({ createdAt: -1 }).lean();
    const rows = registrations.map((r) => ({
      'Registration ID': r.registrationId,
      'Student Name': r.studentName,
      'Roll Number': r.rollNumber,
      'Registration Number': r.registrationNumber,
      Department: r.department,
      Semester: r.semester,
      Email: r.email,
      Phone: r.phone,
      Event: r.eventTitle,
      Participation: r.participationType,
      'Team Name': r.teamName || '',
      'Team Members': r.teamMembers || '',
      Status: r.status,
      'Registered At': new Date(r.createdAt).toLocaleString()
    }));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(rows);
    XLSX.utils.book_append_sheet(wb, ws, 'Registrations');
    const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="ABIT-FEST-2026-Registrations.xlsx"');
    res.send(buffer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/pdf', authenticate, authorize('admin'), async (_req, res) => {
  try {
    const [events, registrations] = await Promise.all([
      Event.find().lean(),
      Registration.find().sort({ createdAt: -1 }).lean()
    ]);

    const doc = new PDFDocument({ size: 'A4', margin: 40 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="ABIT-FEST-2026-Admin-Report.pdf"');
    doc.pipe(res);

    doc.fontSize(18).font('Helvetica-Bold').text('ABIT FEST 2026 — ADMIN SUMMARY REPORT');
    doc.fontSize(10).font('Helvetica').text(`Generated: ${new Date().toLocaleString()} | Total Events: ${events.length} | Total Registrations: ${registrations.length}`);
    doc.moveDown();

    registrations.forEach((r, idx) => {
      if (doc.y > 730) doc.addPage();
      doc.font('Helvetica-Bold').fontSize(10).text(`${idx + 1}. ${r.registrationId} — ${r.studentName} (${r.rollNumber})`);
      doc.font('Helvetica').fontSize(9).text(`   Event: ${r.eventTitle} | Type: ${r.participationType} | Status: ${r.status}`);
      doc.font('Helvetica').fontSize(9).text(`   Dept: ${r.department} (${r.semester}) | Phone: ${r.phone} | Email: ${r.email}`);
      doc.moveDown(0.5);
    });

    doc.end();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
