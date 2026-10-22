import { Router, Request, Response } from 'express';
import { db, EnquiryRecord } from '../services/db';
import { CreateEnquirySchema, UpdateEnquirySchema } from '../schemas';
import { authenticate, requireRole } from '../middleware/auth';

const router = Router();

// POST /api/enquiries (Public - Any visitor can enquire about a design or custom consultation)
router.post('/', (req: Request, res: Response, next) => {
  try {
    const data = CreateEnquirySchema.parse(req.body);

    const newEnquiry: EnquiryRecord = {
      id: `enq-${Date.now()}`,
      customerName: data.customerName,
      email: data.email,
      phone: data.phone,
      preferredContact: data.preferredContact,
      productId: data.productId || null,
      productName: data.productName || null,
      designId: data.designId || null,
      category: data.category || 'General',
      message: data.message,
      status: 'new',
      adminNotes: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    db.enquiries.unshift(newEnquiry);
    return res.status(201).json({
      success: true,
      message: 'Your enquiry has been received. Our jewellery concierge will connect with you shortly.',
      enquiry: newEnquiry
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/enquiries [staff|admin|owner]
router.get('/', authenticate, requireRole('staff', 'admin', 'owner'), (req: Request, res: Response) => {
  const { status, search } = req.query;

  let items = [...db.enquiries];

  if (status && status !== 'all') {
    items = items.filter(e => e.status === status);
  }

  if (search) {
    const q = (search as string).toLowerCase();
    items = items.filter(e =>
      e.customerName.toLowerCase().includes(q) ||
      e.email.toLowerCase().includes(q) ||
      e.phone.includes(q) ||
      (e.designId && e.designId.toLowerCase().includes(q)) ||
      (e.productName && e.productName.toLowerCase().includes(q))
    );
  }

  items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return res.json(items);
});

// GET /api/enquiries/:id [staff|admin|owner]
router.get('/:id', authenticate, requireRole('staff', 'admin', 'owner'), (req: Request, res: Response) => {
  const enquiry = db.enquiries.find(e => e.id === req.params.id);
  if (!enquiry) {
    return res.status(404).json({ error: 'Not Found', message: 'Enquiry not found' });
  }
  return res.json(enquiry);
});

// PATCH /api/enquiries/:id [staff|admin|owner]
router.patch('/:id', authenticate, requireRole('staff', 'admin', 'owner'), (req: Request, res: Response, next) => {
  try {
    const data = UpdateEnquirySchema.parse(req.body);
    const index = db.enquiries.findIndex(e => e.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ error: 'Not Found', message: 'Enquiry not found' });
    }

    const current = db.enquiries[index];
    const updated: EnquiryRecord = {
      ...current,
      ...data,
      updatedAt: new Date().toISOString()
    };

    db.enquiries[index] = updated;
    return res.json(updated);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/enquiries/:id [admin|owner]
router.delete('/:id', authenticate, requireRole('admin', 'owner'), (req: Request, res: Response) => {
  const index = db.enquiries.findIndex(e => e.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Not Found', message: 'Enquiry not found' });
  }

  const [deleted] = db.enquiries.splice(index, 1);
  return res.json({ message: 'Enquiry deleted', id: deleted.id });
});

export default router;
