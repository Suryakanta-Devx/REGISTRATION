import mongoose from 'mongoose';

const sponsorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    tier: { type: String, enum: ['Title', 'Platinum', 'Gold', 'Community'], default: 'Gold' },
    logoUrl: { type: String, default: '' },
    website: { type: String, trim: true, default: '' }
  },
  { timestamps: true }
);

export default mongoose.model('Sponsor', sponsorSchema);
