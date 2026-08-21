import { Router, Request, Response } from 'express';
import { db, CategoryRecord } from '../services/db';
import { CreateCategorySchema, UpdateCategorySchema } from '../schemas';
import { authenticate, requireRole } from '../middleware/auth';

const router = Router();

// GET /api/categories
router.get('/', (req: Request, res: Response) => {
  return res.json(db.categories.filter(c => c.isActive));
});

// POST /api/categories [admin|owner]
router.post('/', authenticate, requireRole('admin', 'owner'), (req: Request, res: Response, next) => {
  try {
    const data = CreateCategorySchema.parse(req.body);

    const existing = db.categories.find(c => c.slug === data.slug);
    if (existing) {
      return res.status(400).json({ error: 'Conflict', message: 'Category slug already exists' });
    }

    const newCategory: CategoryRecord = {
      id: `c-${Date.now()}`,
      name: data.name,
      slug: data.slug,
      description: data.description || '',
      imageUrl: data.imageUrl || 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80',
      isActive: data.isActive,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    db.categories.push(newCategory);
    return res.status(201).json(newCategory);
  } catch (err) {
    next(err);
  }
});

// PATCH /api/categories/:id [admin|owner]
router.patch('/:id', authenticate, requireRole('admin', 'owner'), (req: Request, res: Response, next) => {
  try {
    const data = UpdateCategorySchema.parse(req.body);
    const index = db.categories.findIndex(c => c.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Not Found', message: 'Category not found' });
    }

    const current = db.categories[index];
    const updated = {
      ...current,
      ...data,
      updatedAt: new Date().toISOString()
    };

    db.categories[index] = updated;
    return res.json(updated);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/categories/:id [admin|owner]
router.delete('/:id', authenticate, requireRole('admin', 'owner'), (req: Request, res: Response) => {
  const index = db.categories.findIndex(c => c.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Not Found', message: 'Category not found' });
  }

  const [deleted] = db.categories.splice(index, 1);
  return res.json({ message: 'Category deleted', id: deleted.id });
});

export default router;
