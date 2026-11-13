import mongoose from 'mongoose';

const speakerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    designation: { type: String, required: true, trim: true },
    organization: { type: String, trim: true, default: '' },
    topic: { type: String, trim: true, default: '' },
    bio: { type: String, required: true, trim: true },
    imageUrl: { type: String, default: '' }
  },
  { timestamps: true }
);

export default mongoose.model('Speaker', speakerSchema);
