import { Router, Request, Response } from 'express';
import { db } from '../services/db';
import { authenticate, requireRole } from '../middleware/auth';

const router = Router();

// GET /api/analytics/dashboard [admin|owner]
router.get('/dashboard', authenticate, requireRole('admin', 'owner'), (req: Request, res: Response) => {
  const totalOrders = db.orders.length;
  const totalRevenue = db.orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalCustomers = db.profiles.filter(p => p.role === 'customer').length;
  const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;
  const pendingOrders = db.orders.filter(o => o.status === 'pending').length;

  const salesTrend = [
    { month: 'Jan', revenue: 1450000, orders: 12 },
    { month: 'Feb', revenue: 1820000, orders: 15 },
    { month: 'Mar', revenue: 2100000, orders: 18 },
    { month: 'Apr', revenue: 1950000, orders: 16 },
    { month: 'May', revenue: 2600000, orders: 22 },
    { month: 'Jun', revenue: 3100000, orders: 25 },
    { month: 'Current', revenue: totalRevenue, orders: totalOrders }
  ];

  const categoryBreakdown = db.categories.map(c => {
    const categoryProducts = db.products.filter(p => p.categoryId === c.id);
    const count = categoryProducts.length;
    return { name: c.name, productCount: count };
  });

  return res.json({
    kpis: {
      totalRevenue,
      totalOrders,
      totalCustomers,
      avgOrderValue,
      pendingOrders
    },
    salesTrend,
    categoryBreakdown,
    topProducts: db.products.slice(0, 4)
  });
});

// GET /api/analytics/orders [admin|owner]
router.get('/orders', authenticate, requireRole('admin', 'owner'), (req: Request, res: Response) => {
  const statusCounts = {
    pending: db.orders.filter(o => o.status === 'pending').length,
    processing: db.orders.filter(o => o.status === 'processing').length,
    shipped: db.orders.filter(o => o.status === 'shipped').length,
    delivered: db.orders.filter(o => o.status === 'delivered').length,
    cancelled: db.orders.filter(o => o.status === 'cancelled').length
  };
  return res.json({ statusCounts, total: db.orders.length });
});

export default router;
