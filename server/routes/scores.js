const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Score = require('../models/Score');
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

// Add new score
router.post('/', auth, async (req, res) => {
  try {
    const { score, level, timeTaken } = req.body;

    const newScore = new Score({
      user: req.user._id,
      score,
      level,
      timeTaken
    });

    await newScore.save();

    // Update user's high score if needed
    if (score > req.user.highScore) {
      req.user.highScore = score;
      await req.user.save();
    }

    res.status(201).json(newScore);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's scores
router.get('/user', auth, async (req, res) => {
  try {
    const scores = await Score.find({ user: req.user._id })
      .sort({ date: -1 }) // Sort by date, newest first
      .limit(10);

    res.json(scores);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get leaderboard
router.get('/leaderboard', async (req, res) => {
  try {
    const leaderboard = await User.find({})
      .sort({ highScore: -1 }) // Sort by high score, highest first
      .limit(10)
      .select('username highScore level');

    res.json(leaderboard);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
