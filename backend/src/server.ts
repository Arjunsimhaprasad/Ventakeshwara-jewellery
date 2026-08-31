import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from './routes/auth';
import productRoutes from './routes/products';
import categoryRoutes from './routes/categories';
import cartRoutes from './routes/cart';
import wishlistRoutes from './routes/wishlist';
import orderRoutes from './routes/orders';
import customerRoutes from './routes/customers';
import supportRoutes from './routes/support';
import offerRoutes from './routes/offers';
import analyticsRoutes from './routes/analytics';
import aiRoutes from './routes/ai';
import ratesRoutes from './routes/rates';
import { errorHandler } from './middleware/error';

import { connectMongoDB } from './services/mongodb';

export const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB if MONGODB_URI is specified
if (process.env.MONGODB_URI) {
  connectMongoDB().catch(err => console.error('MongoDB async connection error:', err));
}

// Security & Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Root & Health check routes for Render health probes
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Venkateshwara Jewellery Backend API Server Running', timestamp: new Date().toISOString() });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', store: 'Venkateshwara Jewellery API', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/support/tickets', supportRoutes);
app.use('/api/offers', offerRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/rates', ratesRoutes);

// Structured Error Handler
app.use(errorHandler);

if (process.env.NODE_ENV !== 'test') {
  const portNum = Number(PORT) || 5000;
  app.listen(portNum, '0.0.0.0', () => {
    console.log(`✨ Venkateshwara Jewellery Backend listening on 0.0.0.0:${portNum}`);
  });
}
