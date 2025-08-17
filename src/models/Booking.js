const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.ObjectId,
    ref: 'Event',
    required: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  fullName: {
    type: String,
    required: [true, 'Please add a full name'],
  },
  studentId: {
    type: String,
    required: [true, 'Please add a student ID'],
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
  },
  phoneNumber: {
    type: String,
    required: [true, 'Please add a phone number'],
  },
  comment: {
    type: String,
    maxlength: [500, 'Comment cannot be more than 500 characters'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Booking', BookingSchema);