import { Router, Request, Response } from 'express';
import { db, WishlistItemRecord } from '../services/db';
import { AddToWishlistSchema } from '../schemas';
import { authenticate } from '../middleware/auth';

const router = Router();

function getOrCreateUserWishlist(userId: string) {
  let wishlist = db.wishlists.find(w => w.userId === userId);
  if (!wishlist) {
    wishlist = { id: `wl-${Date.now()}`, userId };
    db.wishlists.push(wishlist);
  }
  return wishlist;
}

// GET /api/wishlist
router.get('/', authenticate, (req: Request, res: Response) => {
  const wishlist = getOrCreateUserWishlist(req.user!.id);
  const items = db.wishlistItems
    .filter(wi => wi.wishlistId === wishlist.id)
    .map(wi => ({
      ...wi,
      product: db.products.find(p => p.id === wi.productId)
    }));

  return res.json({
    id: wishlist.id,
    items
  });
});

// POST /api/wishlist/items
router.post('/items', authenticate, (req: Request, res: Response, next) => {
  try {
    const data = AddToWishlistSchema.parse(req.body);
    const wishlist = getOrCreateUserWishlist(req.user!.id);

    const existing = db.wishlistItems.find(wi => wi.wishlistId === wishlist.id && wi.productId === data.productId);
    if (existing) {
      return res.json(existing);
    }

    const newItem: WishlistItemRecord = {
      id: `wi-${Date.now()}`,
      wishlistId: wishlist.id,
      productId: data.productId,
      createdAt: new Date().toISOString()
    };

    db.wishlistItems.push(newItem);
    return res.status(201).json(newItem);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/wishlist/items/:productId
router.delete('/items/:productId', authenticate, (req: Request, res: Response) => {
  const wishlist = getOrCreateUserWishlist(req.user!.id);
  const index = db.wishlistItems.findIndex(wi => wi.wishlistId === wishlist.id && wi.productId === req.params.productId);

  if (index === -1) {
    return res.status(404).json({ error: 'Not Found', message: 'Item not found in wishlist' });
  }

  const [removed] = db.wishlistItems.splice(index, 1);
  return res.json({ message: 'Removed from wishlist', id: removed.id });
});

export default router;
