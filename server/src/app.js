import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import { env } from './config/env.js';
import prisma from './config/prisma.js';
import { errorHandler, notFound } from './middlewares/errorHandler.js';
import authRoutes from './modules/auth/auth.routes.js';

const app = express();

// Allow our frontend to call the API and send cookies
app.use(cors({ origin: env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Health check: is the server running, and can it reach the database?
app.get('/api/health', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok', database: 'connected' });
  } catch (error) {
    console.error('Database check failed:', error.message);
    res.status(503).json({ status: 'error', database: 'disconnected' });
  }
});

app.use('/api/v1/auth', authRoutes);

// These two must stay last: unknown URLs, then errors
app.use(notFound);
app.use(errorHandler);

export default app;
