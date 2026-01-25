const express = require('express');
const multer = require('multer');
const Listing = require('../models/Listing');
const { protect, authorize } = require('../middleware/auth'); 
const router = express.Router();

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});

const upload = multer({ 
  storage, 
  limits: { files: 3, fileSize: 5 * 1024 * 1024 }
});


router.post('/', protect, upload.array('images', 3), async (req, res) => {
  try {
    const listingData = {
      sellerId: req.user._id,
      title: req.body.title,
      price: Number(req.body.price),
      contact: req.body.contact,
      info: req.body.info,
      status: 'pending'
    };

    
    if (req.body.city) {
      listingData.location = {
        city: req.body.city,
        lat: req.body.lat ? Number(req.body.lat) : null,
        lng: req.body.lng ? Number(req.body.lng) : null
      };
    }

   
    if (req.files) {
      listingData.images = req.files.map(f => `/uploads/${f.filename}`);
    }

    const listing = await Listing.create(listingData);
    res.status(201).json(listing);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: err.message });
  }
});


router.get('/', async (req, res) => {
  try {
    const { city } = req.query;
    const query = city ? { 'location.city': new RegExp(city, 'i') } : {};
    
    const listings = await Listing.find(query)
      .populate('sellerId', 'name username')
      .sort({ createdAt: -1 });
    
    res.json(listings);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});


router.get('/seller/me', protect, async (req, res) => {
  try {
    const listings = await Listing.find({ 
      sellerId: req.user._id,
      $or: [
        { status: 'pending' },
        { status: 'approved' },
        { status: 'booked' }
      ]
    })
    .populate('sellerId', 'name username')
    .sort({ createdAt: -1 });
    
    res.json(listings);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});


router.get('/seller/me/sold', protect, async (req, res) => {
  try {
    const listings = await Listing.find({ 
      sellerId: req.user._id,
      status: 'sold'
    })
    .populate('sellerId', 'name username')
    .sort({ soldAt: -1 });
    
    res.json(listings);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});


router.post('/book/:id', protect, async (req, res) => {
  try {
    const { buyerName, buyerPhone } = req.body;
    const listing = await Listing.findById(req.params.id);
    
    if (!listing) {
      return res.status(404).json({ msg: 'Listing not found' });
    }

    if (listing.status === 'sold' || listing.status === 'booked') {
      return res.status(400).json({ msg: 'Already booked/sold' });
    }

    listing.status = 'booked';
    listing.bookedBy = req.user._id;
    listing.buyerName = buyerName;
    listing.buyerPhone = buyerPhone;
    listing.bookedAt = new Date();
    
    await listing.save();
    res.json({ msg: '✅ Farm booked successfully!', listing });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});
router.put('/:id/sold', protect, async (req, res) => {
  try {
    const listing = await Listing.findOne({ 
      _id: req.params.id, 
      sellerId: req.user._id 
    });

    if (!listing) {
      return res.status(404).json({ msg: 'Farm not found' });
    }

    if (listing.status === 'sold') {
      return res.status(400).json({ msg: 'Already sold' });
    }

    
    listing.status = 'sold';
    listing.soldAt = new Date();
    
    await listing.save();
    
    res.json({ 
      msg: 'Farm marked as SOLD successfully!',
      listing 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
