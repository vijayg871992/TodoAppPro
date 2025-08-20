"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const node_cron_1 = __importDefault(require("node-cron"));
const taskRoutes_1 = __importDefault(require("./routes/taskRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const TaskService_1 = require("./services/TaskService");
const createDemoUser_1 = require("./utils/createDemoUser");
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const taskService = new TaskService_1.TaskService();
// MongoDB Connection
const connectDB = async () => {
    try {
        const conn = await mongoose_1.default.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/todoapppro');
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        await updateLogs('SYSTEM', 'Database connected successfully');
        // Create demo user
        await (0, createDemoUser_1.createDemoUser)();
    }
    catch (error) {
        console.error(`Database Error: ${error.message}`);
        await updateLogs('ERROR', `Database connection failed: ${error.message}`);
        process.exit(1);
    }
};
connectDB();
// Middleware
app.use(express_1.default.json());
app.use((0, cors_1.default)());
// Routes
app.use('/api/auth', authRoutes_1.default);
app.use('/api/tasks', taskRoutes_1.default);
// Serve documentation/guides static files
app.use('/guides', express_1.default.static(path_1.default.join(__dirname, '../../docs')));
// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});
// Cron job for task notifications and cleanup
node_cron_1.default.schedule('*/15 * * * *', async () => {
    try {
        console.log('Running scheduled task maintenance...');
        // Find overdue tasks
        const overdueTasks = await mongoose_1.default.model('Task').find({
            dueDate: { $lt: new Date() },
            status: { $ne: 'Completed' }
        });
        // Find upcoming tasks (due in next 24 hours)
        const upcomingTasks = await mongoose_1.default.model('Task').find({
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
    }
    catch (error) {
        console.error('Cron job error:', error);
        await updateLogs('ERROR', `Cron job failed: ${error.message}`);
    }
});
// Real-time log updates function
async function updateLogs(action, message) {
    try {
        const logPath = path_1.default.join(__dirname, '../../logs.md');
        const timestamp = new Date().toISOString();
        const logEntry = `\n**[${timestamp}]** ${action}: ${message}`;
        // Append to logs file
        await fs_1.promises.appendFile(logPath, logEntry);
        console.log(`[${timestamp}] ${action}: ${message}`);
    }
    catch (error) {
        console.error('Failed to update logs:', error);
    }
}
// Error handling middleware
app.use((error, req, res, next) => {
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
exports.default = app;
//# sourceMappingURL=server.js.map