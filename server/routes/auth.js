const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Middleware for auth
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      throw new Error();
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Authentication required' });
  }
};

// Register a new user
router.post('/register', async (req, res) => {
  try {
    console.log('Register request received:', req.body);
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      console.log('Missing required fields:', { username: !!username, email: !!email, password: !!password });
      return res.status(400).json({ message: 'Username, email and password are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      console.log('User already exists:', email);
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const user = new User({
      username,
      email,
      password
    });

    console.log('Saving new user:', username, email);
    await user.save();

    // Create token
    const jwtSecret = process.env.JWT_SECRET || 'fallbacksecret';
    console.log('Using JWT_SECRET:', jwtSecret ? 'Available' : 'Not available');
    const token = jwt.sign({ id: user._id }, jwtSecret, {
      expiresIn: '7d'
    });

    res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        highScore: user.highScore,
        level: user.level
      }    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: `Server error: ${error.message}` });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        highScore: user.highScore,
        level: user.level
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user data
router.get('/user', auth, async (req, res) => {
  try {
    res.json({
      id: req.user._id,
      username: req.user.username,
      email: req.user.email,
      highScore: req.user.highScore,
      level: req.user.level
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user level and high score
router.put('/update-stats', auth, async (req, res) => {
  try {
    const { highScore, level } = req.body;
    const user = req.user;

    if (highScore && highScore > user.highScore) {
      user.highScore = highScore;
    }

    if (level && level > user.level) {
      user.level = level;
    }

    await user.save();

    res.json({
      id: user._id,
      username: user.username,
      email: user.email,
      highScore: user.highScore,
      level: user.level
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
