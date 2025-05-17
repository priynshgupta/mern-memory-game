const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const scoreRoutes = require('./routes/scores');

// Load environment variables
dotenv.config();

// Validate environment variables
if (process.env.NODE_ENV === 'production') {
  const validateEnv = require('./utils/validateEnv');
  validateEnv();
}

// Create Express app
const app = express();

// Security middleware
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  next();
});

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? ['https://dhyaan-chakra.vercel.app', 'http://localhost:3000']
    : 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));

// Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://e1062240047:LEllVqPxtOqhbwir@cluster0.l3s3iav.mongodb.net/';

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/scores', scoreRoutes);

// Basic route
app.get('/', (req, res) => {
  res.send('Memory Game API is running');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
