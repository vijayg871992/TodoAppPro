import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import cron from 'node-cron';
import taskRoutes from './routes/taskRoutes';
import authRoutes from './routes/authRoutes';
import passport from './config/passport';
import { TaskService } from './services/TaskService';
import { createDemoUser } from './utils/createDemoUser';
import { promises as fs } from 'fs';
import path from 'path';

dotenv.config();

const app = express();
const taskService = new TaskService();

// MongoDB Connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/todoapppro');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    await updateLogs('SYSTEM', 'Database connected successfully');
    
    // Create demo user
    await createDemoUser();
  } catch (error) {
    console.error(`Database Error: ${(error as Error).message}`);
    await updateLogs('ERROR', `Database connection failed: ${(error as Error).message}`);
    process.exit(1);
  }
};

connectDB();

// Middleware
app.use(express.json());
app.use(cors());
app.use(passport.initialize());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// OAuth routes also available at /auth for easier nginx configuration
app.use('/auth', authRoutes);

// Serve documentation/guides static files
app.use('/guides', express.static(path.join(__dirname, '../../docs')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Cron job for task notifications and cleanup
cron.schedule('*/15 * * * *', async () => {
  try {
    console.log('Running scheduled task maintenance...');
    
    // Find overdue tasks
    const overdueTasks = await mongoose.model('Task').find({
      dueDate: { $lt: new Date() },
      status: { $ne: 'Completed' }
    });

    // Find upcoming tasks (due in next 24 hours)
    const upcomingTasks = await mongoose.model('Task').find({
      dueDate: { 
        $gte: new Date(),
        $lte: new Date(Date.now() + 24 * 60 * 60 * 1000)
      },
      status: { $ne: 'Completed' }
    });

    if (overdueTasks.length > 0) {
      console.log(`Found ${overdueTasks.length} overdue tasks`);
      await updateLogs('CRON', `${overdueTasks.length} overdue tasks detected`);
    }

    if (upcomingTasks.length > 0) {
      console.log(`Found ${upcomingTasks.length} upcoming tasks`);
      await updateLogs('CRON', `${upcomingTasks.length} tasks due within 24 hours`);
    }

  } catch (error) {
    console.error('Cron job error:', error);
    await updateLogs('ERROR', `Cron job failed: ${(error as Error).message}`);
  }
});

// Real-time log updates function
async function updateLogs(action: string, message: string): Promise<void> {
  try {
    const logPath = path.join(__dirname, '../../logs.md');
    const timestamp = new Date().toISOString();
    const logEntry = `\n**[${timestamp}]** ${action}: ${message}`;
    
    // Append to logs file
    await fs.appendFile(logPath, logEntry);
    
    console.log(`[${timestamp}] ${action}: ${message}`);
  } catch (error) {
    console.error('Failed to update logs:', error);
  }
}

// Error handling middleware
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Server error:', error);
  updateLogs('ERROR', `Server error: ${error.message}`);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 8003;

app.listen(PORT, async () => {
  const startMessage = `TodoAppPro Server running on http://localhost:${PORT}`;
  console.log(startMessage);
  await updateLogs('SYSTEM', startMessage);
});

export default app;