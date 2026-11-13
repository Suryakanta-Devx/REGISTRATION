import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export function getJwtSecret() {
  if (!process.env.JWT_SECRET) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('JWT_SECRET environment variable must be set in production.');
    }
    // Ephemeral per-process secret in development when .env is absent
    if (!globalThis.__DEV_JWT_SECRET) {
      globalThis.__DEV_JWT_SECRET = `dev_${Math.random().toString(36).slice(2)}_${Date.now()}`;
    }
    return globalThis.__DEV_JWT_SECRET;
  }
  return process.env.JWT_SECRET;
}

export async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization || '';
    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authentication required. Please log in.' });
    }
    const token = authHeader.slice(7);
    const payload = jwt.verify(token, getJwtSecret());
    const user = await User.findById(payload.sub).select('-passwordHash');
    if (!user) {
      return res.status(401).json({ message: 'Invalid session user.' });
    }
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired authentication token.' });
  }
}

export async function optionalAuthenticate(req, _res, next) {
  try {
    const authHeader = req.headers.authorization || '';
    if (authHeader.startsWith('Bearer ')) {
      const token = authHeader.slice(7);
      const payload = jwt.verify(token, getJwtSecret());
      const user = await User.findById(payload.sub).select('-passwordHash');
      if (user) req.user = user;
    }
  } catch {
    // Ignore optional auth failures
  }
  next();
}

export function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden: insufficient permissions.' });
    }
    next();
  };
}
