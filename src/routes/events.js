const express = require('express');
const {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  bookEvent,
  getEventAttendees,
} = require('../controllers/eventController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../config/multer');

const router = express.Router();

router
  .route('/')
  .get(getEvents)
  .post(protect, authorize('admin'), upload.single('image'), createEvent);

router
  .route('/:id')
  .get(getEvent)
  .put(protect, authorize('admin'), updateEvent)
  .delete(protect, authorize('admin'), deleteEvent);

router
  .route('/:id/book')
  .post(protect, bookEvent);

router
  .route('/:id/attendees')
  .get(protect, authorize('admin'), getEventAttendees);

module.exports = router;