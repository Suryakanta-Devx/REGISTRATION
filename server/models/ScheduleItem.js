import mongoose from 'mongoose';

const scheduleItemSchema = new mongoose.Schema(
  {
    day: { type: String, required: true, trim: true },
    time: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    venue: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    speakerOrLead: { type: String, trim: true, default: '' },
    description: { type: String, trim: true, default: '' },
    order: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export default mongoose.model('ScheduleItem', scheduleItemSchema);
