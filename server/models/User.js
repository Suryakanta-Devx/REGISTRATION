import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['student', 'admin'], default: 'student' },
    rollNumber: { type: String, trim: true, uppercase: true, default: '' },
    registrationNumber: { type: String, trim: true, uppercase: true, default: '' },
    department: { type: String, trim: true, default: 'Computer Science (CSE)' },
    semester: { type: String, trim: true, default: '5th Semester' },
    phone: { type: String, trim: true, default: '' }
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);
