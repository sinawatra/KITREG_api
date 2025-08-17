const { Event, Booking, User } = require('../models');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const { Op } = require('sequelize');

// @desc    Get all events
// @route   GET /api/v1/events
// @access  Public
exports.getEvents = asyncHandler(async (req, res, next) => {
  const events = await Event.findAll({
    order: [['date', 'ASC'], ['time', 'ASC']]
  });

  res.status(200).json({
    success: true,
    count: events.length,
    data: events
  });
});

// @desc    Get single event
// @route   GET /api/v1/events/:id
// @access  Public
exports.getEvent = asyncHandler(async (req, res, next) => {
  const event = await Event.findByPk(req.params.id);

  if (!event) {
    return next(
      new ErrorResponse(`Event not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: event
  });
});

// @desc    Create new event
// @route   POST /api/v1/events
// @access  Private/Admin
exports.createEvent = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  req.body.userId = req.user.id;

  const event = await Event.create(req.body);

  res.status(201).json({
    success: true,
    data: event
  });
});

// @desc    Update event
// @route   PUT /api/v1/events/:id
// @access  Private/Admin
exports.updateEvent = asyncHandler(async (req, res, next) => {
  let event = await Event.findByPk(req.params.id);

  if (!event) {
    return next(
      new ErrorResponse(`Event not found with id of ${req.params.id}`, 404)
    );
  }

  event = await event.update(req.body);

  res.status(200).json({
    success: true,
    data: event
  });
});

// @desc    Delete event
// @route   DELETE /api/v1/events/:id
// @access  Private/Admin
exports.deleteEvent = asyncHandler(async (req, res, next) => {
  const event = await Event.findByPk(req.params.id);

  if (!event) {
    return next(
      new ErrorResponse(`Event not found with id of ${req.params.id}`, 404)
    );
  }

  await event.destroy();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Book an event
// @route   POST /api/v1/events/:id/book
// @access  Private
exports.bookEvent = asyncHandler(async (req, res, next) => {
  const event = await Event.findByPk(req.params.id);

  if (!event) {
    return next(
      new ErrorResponse(`Event not found with id of ${req.params.id}`, 404)
    );
  }

  if (event.status === 'closed') {
    return next(new ErrorResponse(`Event bookings are closed`, 400));
  }

  // Check if user already booked this event
  const existingBooking = await Booking.findOne({
    where: {
      eventId: req.params.id,
      userId: req.user.id
    }
  });

  if (existingBooking) {
    return next(new ErrorResponse(`You have already booked this event`, 400));
  }

  const booking = await Booking.create({
    eventId: req.params.id,
    userId: req.user.id,
    fullName: req.body.fullName,
    studentId: req.body.studentId,
    email: req.body.email,
    phoneNumber: req.body.phoneNumber,
    comment: req.body.comment
  });

  res.status(201).json({
    success: true,
    data: booking
  });
});

// @desc    Get attendees for an event
// @route   GET /api/v1/events/:id/attendees
// @access  Private/Admin
exports.getEventAttendees = asyncHandler(async (req, res, next) => {
  const bookings = await Booking.findAll({
    where: { eventId: req.params.id },
    include: [
      {
        model: User,
        attributes: ['id', 'fullName', 'studentId', 'email']
      }
    ]
  });

  res.status(200).json({
    success: true,
    count: bookings.length,
    data: bookings
  });
});