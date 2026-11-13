import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema(
  {
    key: { type: String, unique: true, default: 'global' },
    festivalName: { type: String, default: 'ABIT FEST 2026' },
    tagline: { type: String, default: 'Beyond Technology. Beyond Imagination.' },
    festivalDate: { type: String, default: '2026-12-18T09:00:00+05:30' },
    venue: { type: String, default: 'Ajay Binay Institute of Technology, Cuttack, Odisha' }
  },
  { timestamps: true }
);

export default mongoose.model('Settings', settingsSchema);
