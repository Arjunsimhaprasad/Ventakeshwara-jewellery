import { Router, Request, Response } from 'express';
import { db, CatalogueRecord } from '../services/db';
import { CreateCatalogueSchema, UpdateCatalogueSchema } from '../schemas';
import { authenticate, requireRole } from '../middleware/auth';

const router = Router();

// GET /api/catalogues (Public - Browse Digital Catalogues)
router.get('/', (req: Request, res: Response) => {
  const { category, search, featured } = req.query;

  let items = [...db.catalogues];

  if (category) {
    items = items.filter(c => c.category.toLowerCase() === (category as string).toLowerCase());
  }

  if (featured === 'true') {
    items = items.filter(c => c.isFeatured);
  }

  if (search) {
    const q = (search as string).toLowerCase();
    items = items.filter(c =>
      c.title.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q)
    );
  }

  // Sort featured first, then newest
  items.sort((a, b) => {
    if (a.isFeatured && !b.isFeatured) return -1;
    if (!a.isFeatured && b.isFeatured) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return res.json(items);
});

// GET /api/catalogues/:id (Public - View single catalogue details & pages)
router.get('/:id', (req: Request, res: Response) => {
  const catalogue = db.catalogues.find(c => c.id === req.params.id || c.slug === req.params.id);
  if (!catalogue) {
    return res.status(404).json({ error: 'Not Found', message: 'Digital catalogue not found' });
  }
  return res.json(catalogue);
});

// POST /api/catalogues/:id/download (Public - Increment download count)
router.post('/:id/download', (req: Request, res: Response) => {
  const catalogue = db.catalogues.find(c => c.id === req.params.id || c.slug === req.params.id);
  if (catalogue) {
    catalogue.downloadCount = (catalogue.downloadCount || 0) + 1;
    return res.json({ success: true, downloadCount: catalogue.downloadCount });
  }
  return res.status(404).json({ error: 'Not Found' });
});

// POST /api/catalogues [admin|owner]
router.post('/', authenticate, requireRole('admin', 'owner'), (req: Request, res: Response, next) => {
  try {
    const data = CreateCatalogueSchema.parse(req.body);

    const existingSlug = db.catalogues.find(c => c.slug === data.slug);
    if (existingSlug) {
      return res.status(400).json({ error: 'Conflict', message: 'Catalogue slug already exists' });
    }

    const newCatalogue: CatalogueRecord = {
      id: `cat-lookbook-${Date.now()}`,
      title: data.title,
      slug: data.slug,
      description: data.description || '',
      category: data.category,
      coverImage: data.coverImage,
      pdfUrl: data.pdfUrl,
      pageCount: data.pageCount,
      itemCount: data.itemCount,
      isFeatured: data.isFeatured,
      downloadCount: 0,
      previewImages: data.previewImages || [data.coverImage],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    db.catalogues.push(newCatalogue);
    return res.status(201).json(newCatalogue);
  } catch (err) {
    next(err);
  }
});

// PATCH /api/catalogues/:id [admin|owner]
router.patch('/:id', authenticate, requireRole('admin', 'owner'), (req: Request, res: Response, next) => {
  try {
    const data = UpdateCatalogueSchema.parse(req.body);
    const index = db.catalogues.findIndex(c => c.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ error: 'Not Found', message: 'Digital catalogue not found' });
    }

    const current = db.catalogues[index];
    const updated: CatalogueRecord = {
      ...current,
      ...data,
      updatedAt: new Date().toISOString()
    };

    db.catalogues[index] = updated;
    return res.json(updated);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/catalogues/:id [admin|owner]
router.delete('/:id', authenticate, requireRole('admin', 'owner'), (req: Request, res: Response) => {
  const index = db.catalogues.findIndex(c => c.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Not Found', message: 'Digital catalogue not found' });
  }

  const [deleted] = db.catalogues.splice(index, 1);
  return res.json({ message: 'Catalogue deleted', id: deleted.id });
});

export default router;
