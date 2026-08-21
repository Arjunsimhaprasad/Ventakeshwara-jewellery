import { Router, Request, Response } from 'express';
import {
  generateAIChatResponse,
  generateProductRecommendations,
  generateProductComparison,
  generateBusinessInsights,
  generateSupportAssistantReply
} from '../services/gemini';
import {
  AIChatSchema,
  AIRecommendSchema,
  AICompareSchema,
  AIBusinessInsightsSchema,
  AISupportAssistantSchema
} from '../schemas';
import { authenticate, requireRole } from '../middleware/auth';
import { aiRateLimiter } from '../middleware/rateLimit';
import { db } from '../services/db';

const router = Router();

// Apply AI rate limiter to all AI endpoints
router.use(aiRateLimiter);

// POST /api/ai/chat
router.post('/chat', async (req: Request, res: Response, next) => {
  try {
    const data = AIChatSchema.parse(req.body);
    const response = await generateAIChatResponse(data.messages);
    return res.json(response);
  } catch (err) {
    next(err);
  }
});

// POST /api/ai/recommend
router.post('/recommend', async (req: Request, res: Response, next) => {
  try {
    const data = AIRecommendSchema.parse(req.body);
    const response = await generateProductRecommendations(data.userPreferences);
    return res.json(response);
  } catch (err) {
    next(err);
  }
});

// POST /api/ai/compare
router.post('/compare', async (req: Request, res: Response, next) => {
  try {
    const data = AICompareSchema.parse(req.body);
    const response = await generateProductComparison(data.productIds);
    return res.json(response);
  } catch (err) {
    next(err);
  }
});

// POST /api/ai/business-insights [admin|owner]
router.post('/business-insights', authenticate, requireRole('admin', 'owner'), async (req: Request, res: Response, next) => {
  try {
    const response = await generateBusinessInsights();
    return res.json(response);
  } catch (err) {
    next(err);
  }
});

// POST /api/ai/support-assistant [staff|admin|owner]
router.post('/support-assistant', authenticate, requireRole('staff', 'admin', 'owner'), async (req: Request, res: Response, next) => {
  try {
    const data = AISupportAssistantSchema.parse(req.body);
    const ticket = db.supportTickets.find(t => t.id === data.ticketId);

    if (!ticket) {
      return res.status(404).json({ error: 'Not Found', message: 'Ticket not found' });
    }

    const response = await generateSupportAssistantReply(ticket);
    return res.json(response);
  } catch (err) {
    next(err);
  }
});

export default router;
