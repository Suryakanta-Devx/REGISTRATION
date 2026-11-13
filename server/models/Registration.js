import mongoose from 'mongoose';

const registrationSchema = new mongoose.Schema(
  {
    registrationId: { type: String, required: true, unique: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    studentName: { type: String, required: true, trim: true },
    rollNumber: { type: String, required: true, trim: true, uppercase: true },
    registrationNumber: { type: String, required: true, trim: true, uppercase: true },
    department: { type: String, required: true, trim: true },
    semester: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    eventTitle: { type: String, required: true },
    participationType: { type: String, enum: ['Individual', 'Team'], required: true },
    teamName: { type: String, trim: true, default: '' },
    teamMembers: { type: String, trim: true, default: '' },
    qrDataUrl: { type: String, required: true },
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected', 'Cancelled'], default: 'Pending' },
    emailSent: { type: Boolean, default: false }
  },
  { timestamps: true }
);

// Prevent duplicate registrations for the same event by roll number or email (unless cancelled)
registrationSchema.index(
  { eventId: 1, rollNumber: 1 },
  { unique: true, partialFilterExpression: { status: { $ne: 'Cancelled' } } }
);
registrationSchema.index(
  { eventId: 1, email: 1 },
  { unique: true, partialFilterExpression: { status: { $ne: 'Cancelled' } } }
);

export default mongoose.model('Registration', registrationSchema);
