import mongoose from 'mongoose';

const galleryItemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    mediaType: { type: String, enum: ['image', 'video'], default: 'image' },
    url: { type: String, required: true, trim: true },
    category: { type: String, trim: true, default: 'Highlights' }
  },
  { timestamps: true }
);

export default mongoose.model('GalleryItem', galleryItemSchema);
