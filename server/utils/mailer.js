import nodemailer from 'nodemailer';

export async function sendRegistrationConfirmationEmail(registration, event) {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    return { sent: false, reason: 'SMTP not configured' };
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'ABIT FEST 2026 <noreply@abitfest.edu>',
      to: registration.email,
      subject: `ABIT FEST 2026 Registration Confirmed — ${registration.registrationId}`,
      html: `
        <div style="font-family: Arial, sans-serif; background: #070913; color: #ffffff; padding: 24px; border-radius: 12px;">
          <h2 style="color: #60a5fa;">ABIT FEST 2026 — Registration Confirmed</h2>
          <p>Dear <strong>${registration.studentName}</strong>,</p>
          <p>Your registration for <strong>${registration.eventTitle}</strong> has been recorded.</p>
          <ul>
            <li><strong>Registration ID:</strong> ${registration.registrationId}</li>
            <li><strong>Roll Number:</strong> ${registration.rollNumber}</li>
            <li><strong>Participation:</strong> ${registration.participationType}</li>
            <li><strong>Date &amp; Venue:</strong> ${event?.date || ''} | ${event?.venue || 'ABIT Campus, Cuttack'}</li>
            <li><strong>Status:</strong> ${registration.status}</li>
          </ul>
          <p>Please bring your QR code pass or PDF receipt to the campus verification desk.</p>
          <p style="color: #9ca3af; font-size: 12px;">Ajay Binay Institute of Technology, Cuttack, Odisha</p>
        </div>
      `
    });
    return { sent: true };
  } catch (err) {
    return { sent: false, reason: err.message };
  }
}
