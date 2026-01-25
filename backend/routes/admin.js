const express = require('express');
const User = require('../models/User');
const Listing = require('../models/Listing');
const { protect, authorize } = require('../middleware/auth');
const router = express.Router();

router.get('/sellers', protect, authorize('admin'), async (req, res) => {
  const sellers = await User.find({ role: 'seller' }).populate('listings', 'title price');
  res.json(sellers);
});

router.delete('/seller/:id', protect, authorize('admin'), async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ msg: 'Seller deleted' });
});

module.exports = router;
