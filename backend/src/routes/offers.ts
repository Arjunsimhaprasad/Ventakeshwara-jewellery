import { Router, Request, Response } from 'express';
import { db, OfferRecord } from '../services/db';
import { CreateOfferSchema, UpdateOfferSchema } from '../schemas';
import { authenticate, requireRole } from '../middleware/auth';

const router = Router();

// GET /api/offers (Public read for active offers)
router.get('/', (req: Request, res: Response) => {
  return res.json(db.offers.filter(o => o.isActive));
});

// POST /api/offers [admin|owner]
router.post('/', authenticate, requireRole('admin', 'owner'), (req: Request, res: Response, next) => {
  try {
    const data = CreateOfferSchema.parse(req.body);

    const existing = db.offers.find(o => o.code === data.code);
    if (existing) {
      return res.status(400).json({ error: 'Conflict', message: 'Offer code already exists' });
    }

    const newOffer: OfferRecord = {
      id: `off-${Date.now()}`,
      title: data.title,
      description: data.description || '',
      code: data.code,
      discountPercentage: data.discountPercentage,
      startAt: data.startAt,
      endAt: data.endAt,
      isActive: data.isActive,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    db.offers.push(newOffer);
    return res.status(201).json(newOffer);
  } catch (err) {
    next(err);
  }
});

// PATCH /api/offers/:id [admin|owner]
router.patch('/:id', authenticate, requireRole('admin', 'owner'), (req: Request, res: Response, next) => {
  try {
    const data = UpdateOfferSchema.parse(req.body);
    const index = db.offers.findIndex(o => o.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Not Found', message: 'Offer not found' });
    }

    const current = db.offers[index];
    const updated = {
      ...current,
      ...data,
      updatedAt: new Date().toISOString()
    };

    db.offers[index] = updated;
    return res.json(updated);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/offers/:id [admin|owner]
router.delete('/:id', authenticate, requireRole('admin', 'owner'), (req: Request, res: Response) => {
  const index = db.offers.findIndex(o => o.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Not Found', message: 'Offer not found' });
  }

  const [deleted] = db.offers.splice(index, 1);
  return res.json({ message: 'Offer deleted', id: deleted.id });
});

export default router;
