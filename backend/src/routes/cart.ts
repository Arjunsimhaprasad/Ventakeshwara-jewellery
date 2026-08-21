import { Router, Request, Response } from 'express';
import { db, CartItemRecord } from '../services/db';
import { AddToCartSchema, UpdateCartItemSchema } from '../schemas';
import { authenticate } from '../middleware/auth';

const router = Router();

// Get active cart for current user
function getOrCreateUserCart(userId: string) {
  let cart = db.carts.find(c => c.userId === userId);
  if (!cart) {
    cart = { id: `cart-${Date.now()}`, userId };
    db.carts.push(cart);
  }
  return cart;
}

// GET /api/cart
router.get('/', authenticate, (req: Request, res: Response) => {
  const cart = getOrCreateUserCart(req.user!.id);
  const items = db.cartItems
    .filter(ci => ci.cartId === cart.id)
    .map(ci => {
      const product = db.products.find(p => p.id === ci.productId);
      return {
        ...ci,
        product
      };
    });

  const subtotal = items.reduce((acc, item) => {
    const itemPrice = item.product ? item.product.price * (1 - item.product.discountPercentage / 100) : 0;
    return acc + (itemPrice * item.quantity);
  }, 0);

  return res.json({
    id: cart.id,
    items,
    itemCount: items.reduce((acc, i) => acc + i.quantity, 0),
    subtotal
  });
});

// POST /api/cart/items
router.post('/items', authenticate, (req: Request, res: Response, next) => {
  try {
    const data = AddToCartSchema.parse(req.body);
    const product = db.products.find(p => p.id === data.productId && p.status === 'active');

    if (!product) {
      return res.status(404).json({ error: 'Not Found', message: 'Product not found or inactive' });
    }

    if (product.stockQuantity < data.quantity) {
      return res.status(400).json({ error: 'Out of Stock', message: `Only ${product.stockQuantity} units available in stock` });
    }

    const cart = getOrCreateUserCart(req.user!.id);
    const existingIndex = db.cartItems.findIndex(ci => ci.cartId === cart.id && ci.productId === data.productId);

    if (existingIndex > -1) {
      db.cartItems[existingIndex].quantity += data.quantity;
      return res.json(db.cartItems[existingIndex]);
    } else {
      const newItem: CartItemRecord = {
        id: `ci-${Date.now()}`,
        cartId: cart.id,
        productId: data.productId,
        quantity: data.quantity,
        createdAt: new Date().toISOString()
      };
      db.cartItems.push(newItem);
      return res.status(201).json(newItem);
    }
  } catch (err) {
    next(err);
  }
});

// PATCH /api/cart/items/:id
router.patch('/items/:id', authenticate, (req: Request, res: Response, next) => {
  try {
    const data = UpdateCartItemSchema.parse(req.body);
    const cart = getOrCreateUserCart(req.user!.id);

    const index = db.cartItems.findIndex(ci => ci.id === req.params.id && ci.cartId === cart.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Not Found', message: 'Cart item not found' });
    }

    db.cartItems[index].quantity = data.quantity;
    return res.json(db.cartItems[index]);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/cart/items/:id
router.delete('/items/:id', authenticate, (req: Request, res: Response) => {
  const cart = getOrCreateUserCart(req.user!.id);
  const index = db.cartItems.findIndex(ci => ci.id === req.params.id && ci.cartId === cart.id);

  if (index === -1) {
    return res.status(404).json({ error: 'Not Found', message: 'Cart item not found' });
  }

  const [removed] = db.cartItems.splice(index, 1);
  return res.json({ message: 'Cart item removed', id: removed.id });
});

// DELETE /api/cart (clear cart)
router.delete('/', authenticate, (req: Request, res: Response) => {
  const cart = getOrCreateUserCart(req.user!.id);
  db.cartItems = db.cartItems.filter(ci => ci.cartId !== cart.id);
  return res.json({ message: 'Cart cleared successfully' });
});

export default router;
