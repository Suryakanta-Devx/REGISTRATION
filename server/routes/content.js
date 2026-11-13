import express from 'express';
import ScheduleItem from '../models/ScheduleItem.js';
import Speaker from '../models/Speaker.js';
import Sponsor from '../models/Sponsor.js';
import GalleryItem from '../models/GalleryItem.js';
import Notification from '../models/Notification.js';
import Settings from '../models/Settings.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { uploadPoster } from '../utils/upload.js';

export const scheduleRouter = express.Router();
scheduleRouter.get('/', async (_req, res) => {
  res.json(await ScheduleItem.find().sort({ order: 1, createdAt: 1 }));
});
scheduleRouter.post('/', authenticate, authorize('admin'), async (req, res) => {
  try {
    const item = await ScheduleItem.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
scheduleRouter.put('/:id', authenticate, authorize('admin'), async (req, res) => {
  const item = await ScheduleItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!item) return res.status(404).json({ message: 'Schedule item not found.' });
  res.json(item);
});
scheduleRouter.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
  await ScheduleItem.findByIdAndDelete(req.params.id);
  res.json({ message: 'Schedule item deleted.' });
});

export const speakersRouter = express.Router();
speakersRouter.get('/', async (_req, res) => {
  res.json(await Speaker.find().sort({ createdAt: 1 }));
});
speakersRouter.post('/', authenticate, authorize('admin'), uploadPoster.single('image'), async (req, res) => {
  try {
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : (req.body.imageUrl || '');
    const created = await Speaker.create({ ...req.body, imageUrl });
    res.status(201).json(created);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
speakersRouter.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
  await Speaker.findByIdAndDelete(req.params.id);
  res.json({ message: 'Speaker removed.' });
});

export const sponsorsRouter = express.Router();
sponsorsRouter.get('/', async (_req, res) => {
  res.json(await Sponsor.find().sort({ createdAt: 1 }));
});
sponsorsRouter.post('/', authenticate, authorize('admin'), uploadPoster.single('logo'), async (req, res) => {
  try {
    const logoUrl = req.file ? `/uploads/${req.file.filename}` : (req.body.logoUrl || '');
    const created = await Sponsor.create({ ...req.body, logoUrl });
    res.status(201).json(created);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
sponsorsRouter.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
  await Sponsor.findByIdAndDelete(req.params.id);
  res.json({ message: 'Sponsor removed.' });
});

export const galleryRouter = express.Router();
galleryRouter.get('/', async (_req, res) => {
  res.json(await GalleryItem.find().sort({ createdAt: -1 }));
});
galleryRouter.post('/', authenticate, authorize('admin'), uploadPoster.single('media'), async (req, res) => {
  try {
    const url = req.file ? `/uploads/${req.file.filename}` : req.body.url;
    const created = await GalleryItem.create({ ...req.body, url });
    res.status(201).json(created);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
galleryRouter.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
  await GalleryItem.findByIdAndDelete(req.params.id);
  res.json({ message: 'Gallery item removed.' });
});

export const notificationsRouter = express.Router();
notificationsRouter.get('/', async (_req, res) => {
  res.json(await Notification.find().sort({ createdAt: -1 }).limit(30));
});
notificationsRouter.post('/', authenticate, authorize('admin'), async (req, res) => {
  try {
    const created = await Notification.create(req.body);
    res.status(201).json(created);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export const settingsRouter = express.Router();
settingsRouter.get('/', async (_req, res) => {
  let settings = await Settings.findOne({ key: 'global' });
  if (!settings) {
    settings = await Settings.create({ key: 'global' });
  }
  res.json(settings);
});
settingsRouter.put('/', authenticate, authorize('admin'), async (req, res) => {
  const updated = await Settings.findOneAndUpdate(
    { key: 'global' },
    { $set: req.body },
    { new: true, upsert: true }
  );
  res.json(updated);
});
