import { Router, Request, Response } from 'express';
import { db, SupportTicketRecord } from '../services/db';
import { CreateTicketSchema, UpdateTicketSchema } from '../schemas';
import { authenticate, requireRole } from '../middleware/auth';

const router = Router();

// POST /api/support/tickets (Customer create ticket)
router.post('/', authenticate, (req: Request, res: Response, next) => {
  try {
    const data = CreateTicketSchema.parse(req.body);
    const userId = req.user!.id;

    const newTicket: SupportTicketRecord = {
      id: `st-${Date.now()}`,
      userId,
      orderId: data.orderId || null,
      subject: data.subject,
      category: data.category,
      message: data.message,
      status: 'open',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userFullName: req.user!.fullName
    };

    db.supportTickets.push(newTicket);
    return res.status(201).json(newTicket);
  } catch (err) {
    next(err);
  }
});

// GET /api/support/tickets (Customer sees own; Staff/Admin/Owner sees all)
router.get('/', authenticate, (req: Request, res: Response) => {
  const user = req.user!;
  let tickets: SupportTicketRecord[] = [];

  if (['staff', 'admin', 'owner'].includes(user.role)) {
    tickets = [...db.supportTickets];
  } else {
    tickets = db.supportTickets.filter(t => t.userId === user.id);
  }

  tickets.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return res.json(tickets);
});

// GET /api/support/tickets/:id
router.get('/:id', authenticate, (req: Request, res: Response) => {
  const ticket = db.supportTickets.find(t => t.id === req.params.id);
  if (!ticket) {
    return res.status(404).json({ error: 'Not Found', message: 'Support ticket not found' });
  }

  if (!['staff', 'admin', 'owner'].includes(req.user!.role) && ticket.userId !== req.user!.id) {
    return res.status(403).json({ error: 'Forbidden', message: 'Access denied' });
  }

  return res.json(ticket);
});

// PATCH /api/support/tickets/:id [staff|admin|owner]
router.patch('/:id', authenticate, requireRole('staff', 'admin', 'owner'), (req: Request, res: Response, next) => {
  try {
    const data = UpdateTicketSchema.parse(req.body);
    const ticket = db.supportTickets.find(t => t.id === req.params.id);

    if (!ticket) {
      return res.status(404).json({ error: 'Not Found', message: 'Support ticket not found' });
    }

    if (data.status) ticket.status = data.status;
    if (data.assignedTo !== undefined) ticket.assignedTo = data.assignedTo;
    ticket.updatedAt = new Date().toISOString();

    return res.json(ticket);
  } catch (err) {
    next(err);
  }
});

export default router;
