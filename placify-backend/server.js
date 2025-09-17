const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');

// Load environment variables
dotenv.config();

// Import database connection
const connectDB = require('./config/database');

// Import existing routes
const authRoutes = require('./routes/auth');
const jobRoutes = require('./routes/jobs');
const aptitudeRoutes = require('./routes/aptitude');
const studentRoutes = require('./routes/students');
const aiRoutes = require('./routes/ai');

// Import NEW routes we built today
const applicationRoutes = require('./routes/applications'); // Enhanced applications
const tpoAnalyticsRoutes = require('./routes/tpoAnalytics'); // TPO Analytics
const resumeAnalysisRoutes = require('./routes/resumeAnalysis'); // Resume Analysis  
const interviewRoutes = require('./routes/interviews'); // Interview Management
const companyRoutes = require('./routes/companies'); // Company Management
const campusDriveRoutes = require('./routes/campusDrives'); // Campus Drives
const userManagementRoutes = require('./routes/userManagement'); // User Management

// Create Express app
const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(helmet());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '10mb' })); // Increased limit for file uploads
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Main route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Placify Backend API is running!',
    version: '2.1', // Updated version
    timestamp: new Date().toISOString(),
    endpoints: {
      // Existing endpoints
      auth: '/auth/*',
      jobs: '/api/jobs/*',
      aptitude: '/api/aptitude/*',
      students: '/api/tpo/students',
      ai: '/api/ai/*',
      // NEW endpoints we added today
      applications: '/api/applications/*',
      tpoAnalytics: '/api/tpo/*',
      resumeAnalysis: '/api/resume/*',
      interviews: '/api/interviews/*',
      companies: '/api/companies/*',
      campusDrives: '/api/drives/*',
      userManagement: '/api/users/*'
    },
    featuresAdded: [
      '✅ Enhanced Applications Management',
      '✅ TPO Analytics & Reports',  
      '✅ AI Resume Analysis',
      '✅ Interview Scheduling',
      '✅ Company Relations Management',
      '✅ Campus Drives Coordination',
      '✅ User Management System'
    ]
  });
});

// EXISTING API Routes (keeping your current structure)
app.use('/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/aptitude', aptitudeRoutes);
app.use('/api/tpo/students', studentRoutes);
app.use('/api/ai', aiRoutes);

// NEW API Routes we built today
app.use('/api/applications', applicationRoutes); // Enhanced applications with cross-role access
app.use('/api/tpo', tpoAnalyticsRoutes); // TPO analytics and reports
app.use('/api/resume', resumeAnalysisRoutes); // AI-powered resume analysis
app.use('/api/interviews', interviewRoutes); // Interview scheduling and management
app.use('/api/companies', companyRoutes); // Company profile management
app.use('/api/drives', campusDriveRoutes); // Campus recruitment drives
app.use('/api/users', userManagementRoutes); // User management for TPO admin

// Debug route (keeping your existing one)
app.get('/users', async (req, res) => {
  try {
    const User = require('./models/User');
    const users = await User.find().select('-password');
    res.json({ users, count: users.length });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// Health check endpoint for new features
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'All Placify features are operational',
    timestamp: new Date().toISOString(),
    services: {
      database: 'connected',
      applications: 'active',
      analytics: 'active',
      resumeAnalysis: 'active',
      interviews: 'active',
      companies: 'active',
      drives: 'active',
      userManagement: 'active'
    }
  });
});

// Error handling middleware (keeping your existing one)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start server (keeping your existing structure)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🧠 Smart Resume Analyzer Ready!`);
  console.log(`📚 Modular structure loaded successfully!`);
  console.log(`✨ NEW FEATURES ADDED:`);
  console.log(`   📊 Enhanced Applications Management`);
  console.log(`   📈 TPO Analytics & Reports`);
  console.log(`   🤖 AI Resume Analysis with File Upload`);
  console.log(`   📅 Interview Scheduling System`);
  console.log(`   🏢 Company Relations Management`);
  console.log(`   🎓 Campus Drives Coordination`);
  console.log(`   👥 User Management for TPO Admin`);
  console.log(`🔗 API Endpoints: http://localhost:${PORT}/api/health`);
});
