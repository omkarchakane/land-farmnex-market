const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  city: { type: String, required: true },           // ✅ Direct city field
  price: { type: Number, required: true },
  contact: { type: String, required: true },
  info: String,
  googleMapUrl: String,                              // ✅ NEW Google Maps URL
  images: [String],
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['pending', 'approved', 'booked', 'sold'], default: 'pending' },
  soldAt: Date,
  bookedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  buyerName: String,
  buyerPhone: String,
  bookedAt: Date
}, { timestamps: true });


module.exports = mongoose.model('Listing', listingSchema);
