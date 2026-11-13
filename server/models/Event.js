import mongoose from 'mongoose';

export const EVENT_CATEGORIES = [
  'Technical',
  'Robotics',
  'Cultural',
  'Sports',
  'Creative',
  'Gaming',
  'Academic'
];

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    category: { type: String, enum: EVENT_CATEGORIES, required: true },
    description: { type: String, required: true, trim: true },
    posterUrl: { type: String, default: '' },
    date: { type: String, required: true },
    time: { type: String, required: true },
    venue: { type: String, required: true, trim: true },
    participationMode: { type: String, enum: ['Individual', 'Team', 'Both'], default: 'Both' },
    maxTeamSize: { type: Number, default: 4, min: 1 },
    fee: { type: Number, default: 0, min: 0 },
    status: { type: String, enum: ['Upcoming', 'Ongoing', 'Completed'], default: 'Upcoming' }
  },
  { timestamps: true }
);

export default mongoose.model('Event', eventSchema);
