import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { authenticate, getJwtSecret } from '../middleware/auth.js';

const router = express.Router();

function issueToken(user) {
  return jwt.sign({ sub: user._id.toString(), role: user.role }, getJwtSecret(), {
    expiresIn: '7d'
  });
}

function sanitizeUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    rollNumber: user.rollNumber,
    registrationNumber: user.registrationNumber,
    department: user.department,
    semester: user.semester,
    phone: user.phone
  };
}

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, rollNumber, registrationNumber, department, semester, phone } = req.body;
    if (!name?.trim() || !email?.trim() || !password || password.length < 6) {
      return res.status(400).json({ message: 'Name, valid email, and password (min 6 chars) are required.' });
    }
    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(409).json({ message: 'An account with this email already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      passwordHash,
      role: 'student',
      rollNumber: (rollNumber || '').trim().toUpperCase(),
      registrationNumber: (registrationNumber || '').trim().toUpperCase(),
      department: department || 'Computer Science (CSE)',
      semester: semester || '5th Semester',
      phone: (phone || '').trim()
    });

    const token = issueToken(user);
    res.status(201).json({ token, user: sanitizeUser(user) });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Registration failed.' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email?.trim() || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }
    const token = issueToken(user);
    res.json({ token, user: sanitizeUser(user) });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Login failed.' });
  }
});

router.get('/me', authenticate, (req, res) => {
  res.json({ user: sanitizeUser(req.user) });
});

router.put('/profile', authenticate, async (req, res) => {
  try {
    const { name, rollNumber, registrationNumber, department, semester, phone } = req.body;
    const updated = await User.findByIdAndUpdate(
      req.user._id,
      {
        ...(name ? { name: name.trim() } : {}),
        ...(rollNumber !== undefined ? { rollNumber: rollNumber.trim().toUpperCase() } : {}),
        ...(registrationNumber !== undefined ? { registrationNumber: registrationNumber.trim().toUpperCase() } : {}),
        ...(department ? { department } : {}),
        ...(semester ? { semester } : {}),
        ...(phone !== undefined ? { phone: phone.trim() } : {})
      },
      { new: true }
    );
    res.json({ user: sanitizeUser(updated) });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to update profile.' });
  }
});

export default router;
