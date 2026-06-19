import express from 'express';
import Event from '../models/Event.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @desc    Get all events
// @route   GET /api/events
// @access  Public
router.get('/', async (req, res) => {
  try {
    const events = await Event.find()
      .populate('organizer', 'name email profilePicture')
      .sort({ date: 1 });

    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create a new event
// @route   POST /api/events/create
// @access  Private
router.post('/create', protect, async (req, res) => {
  const { title, description, date, location, category } = req.body;

  if (!title || !description || !date || !location || !category) {
    return res.status(400).json({ message: 'All event fields are required' });
  }

  try {
    const event = await Event.create({
      title,
      description,
      date,
      location,
      category,
      organizer: req.user._id
    });

    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    RSVP to an event
// @route   POST /api/events/rsvp/:id
// @access  Private
router.post('/rsvp/:id', protect, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const hasRSVPed = event.rsvps.includes(req.user._id);

    if (hasRSVPed) {
      event.rsvps = event.rsvps.filter(id => id.toString() !== req.user._id.toString());
    } else {
      event.rsvps.push(req.user._id);
    }

    await event.save();

    res.json({ rsvped: !hasRSVPed, rsvpsCount: event.rsvps.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
