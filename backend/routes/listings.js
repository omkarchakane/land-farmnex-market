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

// ✅ UPDATED POST - Save Google Maps URL
router.post('/', protect, upload.array('images', 3), async (req, res) => {
  try {
    const listingData = {
      sellerId: req.user._id,
      title: req.body.title,
      city: req.body.city,        // ✅ Direct city field
      price: Number(req.body.price),
      contact: req.body.contact,
      info: req.body.info,
      googleMapUrl: req.body.googleMapUrl,  // ✅ NEW Google Maps URL
      status: 'pending'
    };

    // ✅ Save images
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

// ✅ GET all listings (unchanged)
router.get('/', async (req, res) => {
  try {
    const { city } = req.query;
    const query = city ? { city: new RegExp(city, 'i') } : {};
    
    const listings = await Listing.find(query)
      .populate('sellerId', 'name username')
      .sort({ createdAt: -1 });
    
    res.json(listings);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// ✅ Seller active listings
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

// ✅ Seller sold listings
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

// ✅ Mark as SOLD (unchanged)
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
