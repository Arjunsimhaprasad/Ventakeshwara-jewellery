import { Router, Request, Response } from 'express';
import { db, ProductRecord } from '../services/db';
import { CreateProductSchema, UpdateProductSchema } from '../schemas';
import { authenticate, requireRole } from '../middleware/auth';

const router = Router();

// GET /api/products
router.get('/', (req: Request, res: Response) => {
  const { category, material, purity, minPrice, maxPrice, search, featured, sort, status } = req.query;

  let items = [...db.products];

  // Unless staff/admin asks for inactive, filter for active products
  if (status !== 'all') {
    items = items.filter(p => p.status === 'active');
  }

  if (category) {
    items = items.filter(p => p.categoryId === category || p.jewelleryType?.toLowerCase() === (category as string).toLowerCase());
  }

  if (material) {
    items = items.filter(p => p.material.toLowerCase().includes((material as string).toLowerCase()));
  }

  if (purity) {
    items = items.filter(p => p.purity.toLowerCase().includes((purity as string).toLowerCase()));
  }

  if (minPrice) {
    items = items.filter(p => p.price >= parseFloat(minPrice as string));
  }

  if (maxPrice) {
    items = items.filter(p => p.price <= parseFloat(maxPrice as string));
  }

  if (featured === 'true') {
    items = items.filter(p => p.isFeatured);
  }

  if (search) {
    const q = (search as string).toLowerCase();
    items = items.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q) ||
      p.material.toLowerCase().includes(q)
    );
  }

  if (sort === 'price_asc') {
    items.sort((a, b) => a.price - b.price);
  } else if (sort === 'price_desc') {
    items.sort((a, b) => b.price - a.price);
  } else {
    // default newest
    items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  return res.json(items);
});

// GET /api/products/:id
router.get('/:id', (req: Request, res: Response) => {
  const product = db.products.find(p => p.id === req.params.id || p.slug === req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Not Found', message: 'Product not found' });
  }
  return res.json(product);
});

// POST /api/products [staff|admin|owner]
router.post('/', authenticate, requireRole('staff', 'admin', 'owner'), (req: Request, res: Response, next) => {
  try {
    const data = CreateProductSchema.parse(req.body);

    const existingSku = db.products.find(p => p.sku === data.sku);
    if (existingSku) {
      return res.status(400).json({ error: 'Conflict', message: 'Product SKU already exists' });
    }

    const newProduct: ProductRecord = {
      id: `p-${Date.now()}`,
      categoryId: data.categoryId || null,
      name: data.name,
      slug: data.slug,
      sku: data.sku,
      description: data.description || '',
      material: data.material || 'Gold',
      jewelleryType: data.jewelleryType || 'Jewellery',
      weightGrams: data.weightGrams || 10,
      purity: data.purity || '22K (916)',
      makingCharges: data.makingCharges,
      stoneInformation: data.stoneInformation || '',
      price: data.price,
      discountPercentage: data.discountPercentage,
      stockQuantity: data.stockQuantity,
      status: data.status,
      isFeatured: data.isFeatured,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      images: (data.images || []).map((img, idx) => ({ id: `img-${Date.now()}-${idx}`, imageUrl: img.imageUrl, altText: img.altText, sortOrder: img.sortOrder }))
    };

    db.products.push(newProduct);

    // Audit log
    db.auditLogs.push({
      id: `log-${Date.now()}`,
      actorId: req.user!.id,
      action: 'CREATE_PRODUCT',
      entityType: 'product',
      entityId: newProduct.id,
      metadata: { name: newProduct.name, price: newProduct.price },
      createdAt: new Date().toISOString()
    });

    return res.status(201).json(newProduct);
  } catch (err) {
    next(err);
  }
});

// PATCH /api/products/:id [staff|admin|owner]
router.patch('/:id', authenticate, requireRole('staff', 'admin', 'owner'), (req: Request, res: Response, next) => {
  try {
    const data = UpdateProductSchema.parse(req.body);
    const index = db.products.findIndex(p => p.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Not Found', message: 'Product not found' });
    }

    const current = db.products[index];
    const updatedImages = data.images
      ? data.images.map((img, idx) => ({ id: `img-${Date.now()}-${idx}`, imageUrl: img.imageUrl, altText: img.altText, sortOrder: img.sortOrder }))
      : current.images;

    const updated: ProductRecord = {
      ...current,
      ...data,
      categoryId: data.categoryId !== undefined ? data.categoryId : current.categoryId,
      images: updatedImages,
      updatedAt: new Date().toISOString()
    };

    db.products[index] = updated;

    db.auditLogs.push({
      id: `log-${Date.now()}`,
      actorId: req.user!.id,
      action: 'UPDATE_PRODUCT',
      entityType: 'product',
      entityId: updated.id,
      metadata: data,
      createdAt: new Date().toISOString()
    });

    return res.json(updated);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/products/:id [admin|owner]
router.delete('/:id', authenticate, requireRole('admin', 'owner'), (req: Request, res: Response) => {
  const index = db.products.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Not Found', message: 'Product not found' });
  }

  const [deleted] = db.products.splice(index, 1);

  db.auditLogs.push({
    id: `log-${Date.now()}`,
    actorId: req.user!.id,
    action: 'DELETE_PRODUCT',
    entityType: 'product',
    entityId: deleted.id,
    metadata: { name: deleted.name },
    createdAt: new Date().toISOString()
  });

  return res.json({ message: 'Product deleted successfully', id: deleted.id });
});

export default router;
