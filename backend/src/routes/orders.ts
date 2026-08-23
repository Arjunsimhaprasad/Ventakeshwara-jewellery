import { Router, Request, Response } from 'express';
import { db, OrderRecord, OrderItemRecord } from '../services/db';
import { CheckoutSchema, UpdateOrderStatusSchema } from '../schemas';
import { authenticate, requireRole } from '../middleware/auth';

const router = Router();

// POST /api/orders (Checkout Flow with Server Price Calculation)
router.post('/', authenticate, (req: Request, res: Response, next) => {
  try {
    const data = CheckoutSchema.parse(req.body);
    const userId = req.user!.id;

    const cart = db.carts.find(c => c.userId === userId);
    const cartItems = cart ? db.cartItems.filter(ci => ci.cartId === cart.id) : [];

    if (!cartItems.length) {
      return res.status(400).json({ error: 'Bad Request', message: 'Cart is empty' });
    }

    let subtotal = 0;
    const orderItemsToCreate: OrderItemRecord[] = [];

    // Verify stock and compute price strictly from DB
    for (const item of cartItems) {
      const product = db.products.find(p => p.id === item.productId && p.status === 'active');
      if (!product) {
        return res.status(400).json({ error: 'Bad Request', message: `Product ${item.productId} is no longer available` });
      }

      if (product.stockQuantity < item.quantity) {
        return res.status(400).json({ error: 'Out of Stock', message: `Insufficient stock for ${product.name}` });
      }

      const unitPrice = product.price * (1 - product.discountPercentage / 100);
      const lineSubtotal = unitPrice * item.quantity;
      subtotal += lineSubtotal;

      orderItemsToCreate.push({
        id: `oi-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        orderId: '', // Filled below
        productId: product.id,
        productName: product.name,
        sku: product.sku,
        unitPrice,
        quantity: item.quantity,
        subtotal: lineSubtotal
      });

      // Deduct stock quantity
      product.stockQuantity -= item.quantity;
    }

    // Coupon discount verification server-side
    let discountAmount = 0;
    if (data.couponCode) {
      const couponUpper = data.couponCode.toUpperCase();
      const offer = db.offers.find(o => o.code === couponUpper && o.isActive);
      if (offer) {
        discountAmount = (subtotal * offer.discountPercentage) / 100;
      }
    }

    const totalAmount = Math.max(0, subtotal - discountAmount);
    const orderId = `ord-${Date.now()}`;
    const orderNumber = `VJ-${Math.floor(100000 + Math.random() * 900000)}`;

    const newOrder: OrderRecord = {
      id: orderId,
      userId,
      orderNumber,
      status: 'pending',
      subtotal,
      discountAmount,
      totalAmount,
      shippingName: data.shippingName,
      shippingPhone: data.shippingPhone,
      shippingAddress: data.shippingAddress,
      notes: data.notes || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      items: orderItemsToCreate.map(oi => ({ ...oi, orderId }))
    };

    db.orders.push(newOrder);

    // Clear cart items after successful checkout
    db.cartItems = db.cartItems.filter(ci => ci.cartId !== cart!.id);

    // Audit log
    db.auditLogs.push({
      id: `log-${Date.now()}`,
      actorId: userId,
      action: 'CREATE_ORDER',
      entityType: 'order',
      entityId: orderId,
      metadata: { orderNumber, totalAmount },
      createdAt: new Date().toISOString()
    });

    return res.status(201).json(newOrder);
  } catch (err) {
    next(err);
  }
});

// GET /api/orders (Customers see own orders; Admin/Staff see all)
router.get('/', authenticate, (req: Request, res: Response) => {
  const user = req.user!;
  let userOrders: OrderRecord[] = [];

  if (['staff', 'admin', 'owner'].includes(user.role)) {
    userOrders = [...db.orders];
  } else {
    userOrders = db.orders.filter(o => o.userId === user.id);
  }

  userOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return res.json(userOrders);
});

// GET /api/orders/:id
router.get('/:id', authenticate, (req: Request, res: Response) => {
  const user = req.user!;
  const order = db.orders.find(o => o.id === req.params.id || o.orderNumber === req.params.id);

  if (!order) {
    return res.status(404).json({ error: 'Not Found', message: 'Order not found' });
  }

  // Authorization check: Customer can only view own order
  if (!['staff', 'admin', 'owner'].includes(user.role) && order.userId !== user.id) {
    return res.status(403).json({ error: 'Forbidden', message: 'You do not have permission to view this order' });
  }

  return res.json(order);
});

// PATCH /api/orders/:id/status [staff|admin|owner]
router.patch('/:id/status', authenticate, requireRole('staff', 'admin', 'owner'), (req: Request, res: Response, next) => {
  try {
    const data = UpdateOrderStatusSchema.parse(req.body);
    const order = db.orders.find(o => o.id === req.params.id);

    if (!order) {
      return res.status(404).json({ error: 'Not Found', message: 'Order not found' });
    }

    order.status = data.status;
    order.updatedAt = new Date().toISOString();

    db.auditLogs.push({
      id: `log-${Date.now()}`,
      actorId: req.user!.id,
      action: 'UPDATE_ORDER_STATUS',
      entityType: 'order',
      entityId: order.id,
      metadata: { newStatus: data.status },
      createdAt: new Date().toISOString()
    });

    return res.json(order);
  } catch (err) {
    next(err);
  }
});

export default router;
