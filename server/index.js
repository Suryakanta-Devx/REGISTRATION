import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './config/db.js';
import { seedDatabase } from './utils/seed.js';
import { uploadsDir } from './utils/upload.js';
import authRoutes from './routes/auth.js';
import eventRoutes from './routes/events.js';
import registrationRoutes from './routes/registrations.js';
import reportRoutes from './routes/reports.js';
import {
  scheduleRouter,
  speakersRouter,
  sponsorsRouter,
  galleryRouter,
  notificationsRouter,
  settingsRouter
} from './routes/content.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.CLIENT_URL ? process.env.CLIENT_URL.split(',') : true,
    credentials: true
  })
);
app.use(express.json({ limit: '5mb' }));
app.use('/uploads', express.static(uploadsDir));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'ABIT FEST 2026 API' });
});

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/schedule', scheduleRouter);
app.use('/api/speakers', speakersRouter);
app.use('/api/sponsors', sponsorsRouter);
app.use('/api/gallery', galleryRouter);
app.use('/api/notifications', notificationsRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/reports', reportRoutes);

// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

connectDB()
  .then(async () => {
    await seedDatabase();
    app.listen(PORT, () => {
      console.log(`ABIT FEST 2026 backend running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to start backend:', err);
    process.exit(1);
  });
