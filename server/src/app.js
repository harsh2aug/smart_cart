import cors from 'cors';
import express from 'express';
import prisma from './config/prisma.js';

const app = express();

app.use(cors());
app.use(express.json());

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

export default app;
