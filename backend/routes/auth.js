const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { username, password, role, phone } = req.body;
    if (role === 'admin') return res.status(400).json({ msg: 'Admin manual' });

    const user = await User.create({ username, password, role, phone });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
    res.json({ token, user: { id: user._id, username, role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server Error: ' + err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    
    if (!user) {
      return res.status(401).json({ msg: 'Debug: User not found' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ msg: 'Debug: Password incorrect' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
    res.json({ token, user: { id: user._id, username, role: user.role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server Error: ' + err.message });
  }
});

module.exports = router;
