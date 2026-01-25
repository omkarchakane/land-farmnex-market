const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  location: {
    city: String,
    state: String,
    address: String,
    lat: Number,
    lng: Number
  },
  price: { type: Number, required: true },
  contact: String,
  info: String,
  images: [String],
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'booked', 'sold', 'rejected'],
    default: 'pending'
  },
  bookedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  buyerName: String,
  buyerPhone: String,
  bookedAt: Date,
  soldAt: Date
}, { 
  timestamps: true 
});

module.exports = mongoose.model('Listing', listingSchema);
