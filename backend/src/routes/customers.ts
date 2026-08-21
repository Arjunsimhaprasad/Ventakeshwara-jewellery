import { Router, Request, Response } from 'express';
import { db } from '../services/db';
import { authenticate, requireRole } from '../middleware/auth';

const router = Router();

// GET /api/customers [staff|admin|owner]
router.get('/', authenticate, requireRole('staff', 'admin', 'owner'), (req: Request, res: Response) => {
  const customers = db.profiles.map(p => ({
    id: p.id,
    fullName: p.fullName,
    email: p.email,
    phone: p.phone,
    role: p.role,
    createdAt: p.createdAt,
    orderCount: db.orders.filter(o => o.userId === p.id).length,
    totalSpent: db.orders.filter(o => o.userId === p.id).reduce((sum, o) => sum + o.totalAmount, 0)
  }));

  return res.json(customers);
});

// GET /api/customers/:id [staff|admin|owner]
router.get('/:id', authenticate, requireRole('staff', 'admin', 'owner'), (req: Request, res: Response) => {
  const profile = db.profiles.find(p => p.id === req.params.id);
  if (!profile) {
    return res.status(404).json({ error: 'Not Found', message: 'Customer not found' });
  }

  const userOrders = db.orders.filter(o => o.userId === profile.id);

  return res.json({
    id: profile.id,
    fullName: profile.fullName,
    email: profile.email,
    phone: profile.phone,
    role: profile.role,
    createdAt: profile.createdAt,
    orders: userOrders
  });
});

// PATCH /api/customers/:id [admin|owner]
router.patch('/:id', authenticate, requireRole('admin', 'owner'), (req: Request, res: Response) => {
  const profile = db.profiles.find(p => p.id === req.params.id);
  if (!profile) {
    return res.status(404).json({ error: 'Not Found', message: 'Customer not found' });
  }

  const { fullName, phone, role } = req.body;

  if (fullName) profile.fullName = fullName;
  if (phone) profile.phone = phone;
  if (role && ['customer', 'staff', 'admin', 'owner'].includes(role)) {
    // Only owner can assign owner role
    if (role === 'owner' && req.user!.role !== 'owner') {
      return res.status(403).json({ error: 'Forbidden', message: 'Only the store owner can assign the owner role' });
    }
    profile.role = role;
  }

  profile.updatedAt = new Date().toISOString();

  db.auditLogs.push({
    id: `log-${Date.now()}`,
    actorId: req.user!.id,
    action: 'UPDATE_CUSTOMER_PROFILE',
    entityType: 'profile',
    entityId: profile.id,
    metadata: { updatedRole: profile.role },
    createdAt: new Date().toISOString()
  });

  return res.json({
    id: profile.id,
    fullName: profile.fullName,
    email: profile.email,
    phone: profile.phone,
    role: profile.role,
    updatedAt: profile.updatedAt
  });
});

export default router;
