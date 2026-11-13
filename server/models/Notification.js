import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    type: { type: String, enum: ['announcement', 'urgent', 'schedule', 'registration'], default: 'announcement' }
  },
  { timestamps: true }
);

export default mongoose.model('Notification', notificationSchema);
