import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db, ProfileRecord } from '../services/db';
import { RegisterSchema, LoginSchema } from '../schemas';
import { authenticate } from '../middleware/auth';
import { authRateLimiter } from '../middleware/rateLimit';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-jwt-key-replace-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// Seed default Owner user if none exists
if (!db.profiles.some(p => p.role === 'admin' || p.role === 'owner')) {
  const adminPasswordHash = bcrypt.hashSync('akhilavirat', 10);
  db.profiles.push({
    id: 'a0000000-0000-0000-0000-000000000001',
    fullName: 'Venkateshwara Store Owner',
    email: 'anajipuramarjun8@gmail.com',
    passwordHash: adminPasswordHash,
    phone: '+91 98765 43210',
    role: 'owner',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
}

// POST /api/auth/register
router.post('/register', authRateLimiter, async (req: Request, res: Response, next) => {
  try {
    const data = RegisterSchema.parse(req.body);

    const existing = db.profiles.find(p => p.email.toLowerCase() === data.email.toLowerCase());
    if (existing) {
      return res.status(400).json({ error: 'Conflict', message: 'An account with this email already exists' });
    }

    const passwordHash = await bcrypt.hash(data.password, 10);
    const newProfile: ProfileRecord = {
      id: `u${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      fullName: data.fullName,
      email: data.email.toLowerCase(),
      passwordHash,
      phone: data.phone,
      role: 'customer', // Always default to customer for self-registration. Role claim from client strictly forbidden.
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    db.profiles.push(newProfile);

    // Initialize user cart and wishlist
    const cartId = `cart-${Date.now()}`;
    db.carts.push({ id: cartId, userId: newProfile.id });

    const wishlistId = `wl-${Date.now()}`;
    db.wishlists.push({ id: wishlistId, userId: newProfile.id });

    const token = jwt.sign(
      { id: newProfile.id, email: newProfile.email, fullName: newProfile.fullName, role: newProfile.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN as any }
    );

    return res.status(201).json({
      message: 'Registration successful',
      token,
      user: {
        id: newProfile.id,
        fullName: newProfile.fullName,
        email: newProfile.email,
        role: newProfile.role,
        phone: newProfile.phone
      }
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/login
router.post('/login', authRateLimiter, async (req: Request, res: Response, next) => {
  try {
    const data = LoginSchema.parse(req.body);

    const profile = db.profiles.find(p => p.email.toLowerCase() === data.email.toLowerCase());
    if (!profile) {
      return res.status(401).json({ error: 'Unauthorized', message: 'Invalid email or password' });
    }

    const match = await bcrypt.compare(data.password, profile.passwordHash);
    if (!match) {
      return res.status(401).json({ error: 'Unauthorized', message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: profile.id, email: profile.email, fullName: profile.fullName, role: profile.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN as any }
    );

    return res.json({
      message: 'Login successful',
      token,
      user: {
        id: profile.id,
        fullName: profile.fullName,
        email: profile.email,
        role: profile.role,
        phone: profile.phone
      }
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/logout
router.post('/logout', (req: Request, res: Response) => {
  return res.json({ message: 'Logout successful' });
});

// GET /api/auth/me
router.get('/me', authenticate, (req: Request, res: Response) => {
  const profile = db.profiles.find(p => p.id === req.user?.id);
  if (!profile) {
    return res.status(444).json({ error: 'Not Found', message: 'User profile not found' });
  }

  return res.json({
    id: profile.id,
    fullName: profile.fullName,
    email: profile.email,
    role: profile.role,
    phone: profile.phone,
    createdAt: profile.createdAt
  });
});

export default router;
