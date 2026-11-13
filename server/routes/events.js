import express from 'express';
import Event, { EVENT_CATEGORIES } from '../models/Event.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { uploadPoster } from '../utils/upload.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { category, status } = req.query;
    const filter = {};
    if (category && category !== 'All') filter.category = category;
    if (status && status !== 'All') filter.status = status;
    const events = await Event.find(filter).sort({ date: 1, createdAt: -1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', authenticate, authorize('admin'), uploadPoster.single('poster'), async (req, res) => {
  try {
    const { title, category, description, posterUrl, date, time, venue, participationMode, maxTeamSize, fee, status } = req.body;
    if (!title?.trim() || !EVENT_CATEGORIES.includes(category) || !description?.trim() || !date || !time || !venue?.trim()) {
      return res.status(400).json({ message: 'Title, valid category, description, date, time, and venue are required.' });
    }
    const resolvedPoster = req.file ? `/uploads/${req.file.filename}` : (posterUrl || '');
    const created = await Event.create({
      title: title.trim(),
      category,
      description: description.trim(),
      posterUrl: resolvedPoster,
      date,
      time,
      venue: venue.trim(),
      participationMode: participationMode || 'Both',
      maxTeamSize: Number(maxTeamSize || 4),
      fee: Number(fee || 0),
      status: status || 'Upcoming'
    });
    res.status(201).json(created);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id', authenticate, authorize('admin'), uploadPoster.single('poster'), async (req, res) => {
  try {
    const updates = { ...req.body };
    if (req.file) {
      updates.posterUrl = `/uploads/${req.file.filename}`;
    }
    if (updates.maxTeamSize !== undefined) updates.maxTeamSize = Number(updates.maxTeamSize);
    if (updates.fee !== undefined) updates.fee = Number(updates.fee);

    const updated = await Event.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ message: 'Event not found.' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const deleted = await Event.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Event not found.' });
    res.json({ message: 'Event deleted successfully.', id: req.params.id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
