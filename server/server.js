import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

dotenv.config();

import { connectDB, isDbMockMode } from './config/db.js';
import { seedDatabase, getInMemoryStore } from './config/seed.js';
import { notFound, errorHandler } from './middlewares/errorMiddleware.js';

import authRoutes from './routes/authRoutes.js';
import complaintRoutes from './routes/complaintRoutes.js';
import officerRoutes from './routes/officerRoutes.js';
import incidentRoutes from './routes/incidentRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import chatbotRoutes from './routes/chatbotRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
  })
);
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

app.use('/uploads', express.static(uploadsDir));

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    platform: 'AI-Powered Citizen Grievance Intelligence & Resolution Platform',
    version: '1.0.0',
    mode: isDbMockMode() ? 'In-Memory Fallback Demo Mode' : 'Connected to MongoDB Live Database',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/complaints', complaintRoutes);
app.use('/api/v1/officer', officerRoutes);
app.use('/api/v1/incidents', incidentRoutes);
app.use('/api/v1/analytics', analyticsRoutes);
app.use('/api/v1/ai', aiRoutes);
app.use('/api/v1/chatbot', chatbotRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  getInMemoryStore();

  app.listen(PORT, '0.0.0.0', async () => {
    console.log('================================================================');
    console.log(`🚀 CIVIC GRIEVANCE PLATFORM BACKEND STARTED`);
    console.log(`📡 URL: http://127.0.0.1:${PORT}`);
    console.log(`🌐 Health: http://127.0.0.1:${PORT}/api/health`);
    console.log('================================================================');

    await connectDB();

    if (!isDbMockMode()) {
      await seedDatabase();
    }
  });
};

startServer();
