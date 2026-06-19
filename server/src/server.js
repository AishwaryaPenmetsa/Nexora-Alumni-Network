import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import passport from 'passport';
import connectDB from './config/db.js';
import configurePassport from './config/passport.js';

// Route imports
import authRoutes from './routes/auth.js';
import directoryRoutes from './routes/directory.js';
import mentorshipRoutes from './routes/mentorship.js';
import jobRoutes from './routes/jobs.js';
import messageRoutes from './routes/messages.js';
import notificationRoutes from './routes/notifications.js';
import eventRoutes from './routes/events.js';
import adminRoutes from './routes/admin.js';
import aiRoutes from './routes/ai.js';
import feedRoutes from './routes/feed.js';
import forumRoutes from './routes/forum.js';
import communityRoutes from './routes/communities.js';

// Load config
dotenv.config();

// Create App
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Passport middleware
app.use(passport.initialize());
configurePassport(passport);

// Connect to Database
connectDB();

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/directory', directoryRoutes);
app.use('/api/mentorship', mentorshipRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/feed', feedRoutes);
app.use('/api/forum', forumRoutes);
app.use('/api/communities', communityRoutes);

// Health Check API
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date(),
    uptime: process.uptime()
  });
});

// Root route
app.get('/', (req, res) => {
  res.send('NEXORA API running successfully.');
});

// Port configuration
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in development mode on port ${PORT}`);
});
