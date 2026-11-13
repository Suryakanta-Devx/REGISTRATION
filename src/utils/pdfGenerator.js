// Dependency-free PDF 1.4 generator for Registration Receipts and Admin Reports

function escapePdfText(str) {
  return String(str ?? '')
    .replace(/[^\x20-\x7E]/g, ' ')
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)');
}

function buildPdfBlob(pagesLines) {
  const objects = [];
  const addObject = (body) => {
    objects.push(body);
    return objects.length;
  };

  const fontRegularId = addObject('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>');
  const fontBoldId = addObject('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>');

  const pageIds = [];
  const pagesPlaceholderId = addObject('');

  for (const lines of pagesLines) {
    const streamParts = ['BT'];
    let y = 760;
    for (const item of lines) {
      const font = item.bold ? '/F2' : '/F1';
      const size = item.size || 11;
      const x = item.x || 48;
      streamParts.push(`${font} ${size} Tf`);
      streamParts.push(`1 0 0 1 ${x} ${y} Tm`);
      streamParts.push(`(${escapePdfText(item.text)}) Tj`);
      y -= item.gap || size + 7;
    }
    streamParts.push('ET');
    const streamContent = streamParts.join('\n');
    const contentId = addObject(
      `<< /Length ${streamContent.length} >>\nstream\n${streamContent}\nendstream`
    );
    const pageId = addObject(
      `<< /Type /Page /Parent ${pagesPlaceholderId} 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 ${fontRegularId} 0 R /F2 ${fontBoldId} 0 R >> >> /Contents ${contentId} 0 R >>`
    );
    pageIds.push(pageId);
  }

  objects[pagesPlaceholderId - 1] = `<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(' ')}] /Count ${pageIds.length} >>`;
  const catalogId = addObject(`<< /Type /Catalog /Pages ${pagesPlaceholderId} 0 R >>`);

  let pdf = '%PDF-1.4\n';
  const offsets = [0];
  for (let i = 0; i < objects.length; i++) {
    offsets.push(pdf.length);
    pdf += `${i + 1} 0 obj\n${objects[i]}\nendobj\n`;
  }
  const xrefStart = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += '0000000000 65535 f \n';
  for (let i = 1; i <= objects.length; i++) {
    pdf += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root ${catalogId} 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;

  return new Blob([pdf], { type: 'application/pdf' });
}

function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function downloadRegistrationReceiptPdf(registration, eventDetails) {
  const lines = [
    { text: 'IGNITRON 2K26 - ABIT COLLEGE FUNCTIONS & EVENTS', bold: true, size: 16, gap: 22 },
    { text: 'OFFICIAL EVENT REGISTRATION RECEIPT', bold: true, size: 12, gap: 24 },
    { text: '--------------------------------------------------------------------------', size: 10, gap: 16 },
    { text: `Registration ID     : ${registration.registrationId}`, bold: true, size: 12, gap: 18 },
    { text: `Ticket / Pass No.   : ${registration.ticketNumber || registration.registrationId}`, bold: true, size: 11, gap: 16 },
    { text: `Receipt Number      : ${registration.receiptNumber || 'RCPT-2026-EVENT'}`, size: 11, gap: 16 },
    { text: `Registration Status : ${registration.status}`, bold: true, size: 11, gap: 16 },
    { text: `Registered On       : ${new Date(registration.createdAt).toLocaleString()}`, size: 10, gap: 20 },
    { text: 'STUDENT DETAILS', bold: true, size: 12, gap: 18 },
    { text: `Full Name           : ${registration.studentName}`, size: 11, gap: 16 },
    { text: `Registration Number : ${registration.registrationNumber}`, size: 11, gap: 16 },
    { text: `Roll Number         : ${registration.rollNumber}`, size: 11, gap: 16 },
    { text: `Department & Sem    : ${registration.department} | Semester ${registration.semester}`, size: 11, gap: 16 },
    { text: `College Email       : ${registration.collegeEmail}`, size: 11, gap: 16 },
    { text: `Mobile Number       : ${registration.mobileNumber}`, size: 11, gap: 20 },
    { text: 'EVENT DETAILS', bold: true, size: 12, gap: 18 },
    { text: `Event Name          : ${registration.eventName}`, bold: true, size: 11, gap: 16 },
    { text: `Participation Type  : ${registration.participationType}`, size: 11, gap: 16 },
    { text: `Team Name           : ${registration.teamName || 'N/A (Individual)'}`, size: 11, gap: 16 },
    { text: `Team Members        : ${registration.teamMembers || 'N/A'}`, size: 11, gap: 16 },
    { text: `Date & Time         : ${eventDetails ? `${eventDetails.date} | ${eventDetails.time}` : 'As per schedule'}`, size: 11, gap: 16 },
    { text: `Venue               : ${eventDetails ? eventDetails.venue : 'ABIT Campus'}`, size: 11, gap: 22 },
    { text: '--------------------------------------------------------------------------', size: 10, gap: 16 },
    { text: 'HOST RECEIPT COLLECTION NOTICE:', bold: true, size: 11, gap: 16 },
    { text: 'Dear Candidate, get your receipt from Host Suryakanta Senapati,', size: 10, gap: 14 },
    { text: 'Manas Das, Dibya Ranjan Sethy, Debendra Pradhan, Pratik Khandai,', size: 10, gap: 14 },
    { text: 'Subhashree Prusti and Other Hosts Member.', size: 10, gap: 20 },
    { text: 'URGENT TICKET CONTACT:', bold: true, size: 11, gap: 15 },
    { text: '7848817688 (Host Suryakanta)  |  824 970 9981 (Host Manas)', bold: true, size: 10, gap: 16 }
  ];

  const blob = buildPdfBlob([lines]);
  triggerDownload(blob, `${registration.registrationId}-receipt.pdf`);
}

export function downloadAdminReportPdf(events, registrations) {
  const pages = [];
  let currentLines = [
    { text: 'IGNITRON 2K26 - ADMIN EVENTS & REGISTRATIONS REPORT', bold: true, size: 15, gap: 20 },
    { text: `Generated: ${new Date().toLocaleString()} | Events: ${events.length} | Registrations: ${registrations.length}`, size: 10, gap: 20 },
    { text: '--------------------------------------------------------------------------', size: 10, gap: 16 }
  ];

  registrations.forEach((reg, idx) => {
    if (currentLines.length > 34) {
      pages.push(currentLines);
      currentLines = [
        { text: 'IGNITRON 2K26 - REGISTRATIONS REPORT (CONT.)', bold: true, size: 13, gap: 20 }
      ];
    }
    currentLines.push({
      text: `${idx + 1}. ${reg.registrationId} | ${reg.studentName} (${reg.rollNumber})`,
      bold: true,
      size: 10,
      gap: 14
    });
    currentLines.push({
      text: `   Event: ${reg.eventName} | Type: ${reg.participationType} | Status: ${reg.status}`,
      size: 9,
      gap: 13
    });
    currentLines.push({
      text: `   Dept: ${reg.department} (Sem ${reg.semester}) | Phone: ${reg.mobileNumber} | Email: ${reg.collegeEmail}`,
      size: 9,
      gap: 16
    });
  });

  pages.push(currentLines);
  const blob = buildPdfBlob(pages);
  triggerDownload(blob, `Ignitron-2K26-Admin-Report.pdf`);
}

export function exportRegistrationsExcelCsv(registrations) {
  const headers = [
    'Registration ID',
    'Student Full Name',
    'Registration Number',
    'Roll Number',
    'Department',
    'Semester',
    'College Email',
    'Mobile Number',
    'Event Name',
    'Participation Type',
    'Team Name',
    'Team Members',
    'Status',
    'Registered At'
  ];

  const escapeCsv = (val) => `"${String(val ?? '').replace(/"/g, '""')}"`;
  const rows = registrations.map((r) =>
    [
      r.registrationId,
      r.studentName,
      r.registrationNumber,
      r.rollNumber,
      r.department,
      r.semester,
      r.collegeEmail,
      r.mobileNumber,
      r.eventName,
      r.participationType,
      r.teamName || '',
      r.teamMembers || '',
      r.status,
      new Date(r.createdAt).toLocaleString()
    ]
      .map(escapeCsv)
      .join(',')
  );

  const csvContent = [headers.map(escapeCsv).join(','), ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  triggerDownload(blob, 'Ignitron-2K26-Participants.csv');
}
