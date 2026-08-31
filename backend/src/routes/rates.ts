import { Router, Request, Response } from 'express';
import { db, MetalRateRecord, supabase } from '../services/db';
import { UpdateMetalRatesSchema } from '../schemas';
import { authenticate, requireRole } from '../middleware/auth';

const router = Router();

// GET /api/rates/today (Public read for today's active rate)
router.get('/today', async (req: Request, res: Response, next) => {
  try {
    if (supabase) {
      const { data, error } = await supabase
        .from('daily_metal_rates')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!error && data) {
        return res.json({
          id: data.id,
          gold24kPerGram: parseFloat(data.gold_24k_per_gram),
          gold22kPerGram: parseFloat(data.gold_22k_per_gram),
          gold18kPerGram: parseFloat(data.gold_18k_per_gram),
          silverPerGram: parseFloat(data.silver_per_gram),
          notes: data.notes,
          updatedBy: data.updated_by,
          createdAt: data.created_at
        });
      }
    }

    // Fallback to in-memory db
    const latest = db.metalRates[db.metalRates.length - 1] || {
      id: 'mr000000-0000-0000-0000-000000000001',
      gold24kPerGram: 7350.00,
      gold22kPerGram: 6738.00,
      gold18kPerGram: 5512.00,
      silverPerGram: 88.00,
      notes: 'Initial market benchmark for Venkateshwara Jewellery',
      updatedBy: null,
      createdAt: new Date().toISOString()
    };

    return res.json(latest);
  } catch (err) {
    next(err);
  }
});

// GET /api/rates/history (Public read for rate revision history)
router.get('/history', async (req: Request, res: Response, next) => {
  try {
    if (supabase) {
      const { data, error } = await supabase
        .from('daily_metal_rates')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(30);

      if (!error && data) {
        const history = data.map(item => ({
          id: item.id,
          gold24kPerGram: parseFloat(item.gold_24k_per_gram),
          gold22kPerGram: parseFloat(item.gold_22k_per_gram),
          gold18kPerGram: parseFloat(item.gold_18k_per_gram),
          silverPerGram: parseFloat(item.silver_per_gram),
          notes: item.notes,
          updatedBy: item.updated_by,
          createdAt: item.created_at
        }));
        return res.json(history);
      }
    }

    // Fallback in-memory sorting desc
    const sorted = [...db.metalRates].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return res.json(sorted);
  } catch (err) {
    next(err);
  }
});

// POST /api/rates [staff|admin|owner] - Update current day's gold & silver price
router.post('/', authenticate, requireRole('staff', 'admin', 'owner'), async (req: Request, res: Response, next) => {
  try {
    const data = UpdateMetalRatesSchema.parse(req.body);
    const userId = req.user?.id || null;

    const newRateRecord: MetalRateRecord = {
      id: `mr-${Date.now()}`,
      gold24kPerGram: data.gold24kPerGram,
      gold22kPerGram: data.gold22kPerGram,
      gold18kPerGram: data.gold18kPerGram,
      silverPerGram: data.silverPerGram,
      notes: data.notes || `Daily metal rate update by ${req.user?.fullName || 'Staff'}`,
      updatedBy: userId,
      createdAt: new Date().toISOString()
    };

    // Store in-memory
    db.metalRates.push(newRateRecord);

    // Audit log entry
    db.auditLogs.push({
      id: `audit-${Date.now()}`,
      actorId: userId,
      action: 'UPDATE_METAL_RATES',
      entityType: 'daily_metal_rates',
      entityId: newRateRecord.id,
      metadata: { rates: data },
      createdAt: new Date().toISOString()
    });

    if (supabase) {
      await supabase.from('daily_metal_rates').insert({
        gold_24k_per_gram: data.gold24kPerGram,
        gold_22k_per_gram: data.gold22kPerGram,
        gold_18k_per_gram: data.gold18kPerGram,
        silver_per_gram: data.silverPerGram,
        notes: newRateRecord.notes,
        updated_by: userId
      });
    }

    return res.status(201).json({
      message: "Current day's gold & silver rates updated successfully",
      rate: newRateRecord
    });
  } catch (err) {
    next(err);
  }
});

export default router;
