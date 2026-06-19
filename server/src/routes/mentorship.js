import express from 'express';
import User from '../models/User.js';
import Profile from '../models/Profile.js';
import MentorshipSession from '../models/MentorshipSession.js';
import Notification from '../models/Notification.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @desc    Get all available mentors
// @route   GET /api/mentorship/mentors
// @access  Public
router.get('/mentors', async (req, res) => {
  try {
    const mentors = await User.find({ isMentor: true, isApproved: true }).select('-password');
    const mentorIds = mentors.map(m => m._id);

    const profiles = await Profile.find({ user: { $in: mentorIds } })
      .populate('user', 'name email role profilePicture isMentor isApproved');

    res.json(profiles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Book a new mentorship session
// @route   POST /api/mentorship/book
// @access  Private
router.post('/book', protect, async (req, res) => {
  const { mentorId, topic, date, time, notes } = req.body;

  if (!mentorId || !topic || !date || !time) {
    return res.status(400).json({ message: 'All booking fields are required' });
  }

  try {
    const mentor = await User.findById(mentorId);
    if (!mentor || !mentor.isMentor) {
      return res.status(404).json({ message: 'Mentor not found or user is not a mentor' });
    }

    const session = await MentorshipSession.create({
      mentor: mentorId,
      student: req.user._id,
      topic,
      date,
      time,
      notes
    });

    // Notify the mentor
    await Notification.create({
      recipient: mentorId,
      sender: req.user._id,
      type: 'mentorship_request',
      text: `${req.user.name} booked a mentorship session with you regarding "${topic}".`,
      link: '/dashboard'
    });

    res.status(201).json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update session status (approve, reject, complete)
// @route   PUT /api/mentorship/session/:id
// @access  Private
router.put('/session/:id', protect, async (req, res) => {
  const { status } = req.body;

  try {
    const session = await MentorshipSession.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    // Only the mentor can approve/reject, student or mentor can update complete
    const isMentor = session.mentor.toString() === req.user._id.toString();
    const isStudent = session.student.toString() === req.user._id.toString();

    if (!isMentor && !isStudent) {
      return res.status(403).json({ message: 'Unauthorized session modification' });
    }

    if (status === 'approved' && isMentor) {
      session.status = 'approved';
      session.meetingLink = `https://meet.google.com/mock-${Math.random().toString(36).substring(2, 6)}-${Math.random().toString(36).substring(2, 6)}`;
    } else if (status === 'rejected' && isMentor) {
      session.status = 'rejected';
    } else if (status === 'completed') {
      session.status = 'completed';
      session.certificateUrl = `/certificates/cert-${session._id}.pdf`; // Mock Certificate PDF Link
    }

    await session.save();

    // Notify student/mentor about update
    const notifyTarget = isMentor ? session.student : session.mentor;
    await Notification.create({
      recipient: notifyTarget,
      sender: req.user._id,
      type: 'mentorship_status',
      text: `Mentorship session on "${session.topic}" has been updated to "${session.status}".`,
      link: '/dashboard'
    });

    res.json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Submit review for a completed session
// @route   POST /api/mentorship/session/:id/review
// @access  Private
router.post('/session/:id/review', protect, async (req, res) => {
  const { rating, text } = req.body;

  if (!rating) {
    return res.status(400).json({ message: 'Rating is required' });
  }

  try {
    const session = await MentorshipSession.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    if (session.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only students can review sessions' });
    }

    session.review = { rating, text };
    await session.save();

    // Recalculate mentor average rating
    const mentorSessions = await MentorshipSession.find({ mentor: session.mentor, 'review.rating': { $exists: true } });
    const totalRating = mentorSessions.reduce((acc, curr) => acc + curr.review.rating, 0);
    const avgRating = totalRating / mentorSessions.length;

    await Profile.findOneAndUpdate({ user: session.mentor }, { rating: avgRating });

    res.json({ message: 'Review submitted successfully', session });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get session history
// @route   GET /api/mentorship/history
// @access  Private
router.get('/history', protect, async (req, res) => {
  try {
    const sessions = await MentorshipSession.find({
      $or: [{ mentor: req.user._id }, { student: req.user._id }]
    })
      .populate('mentor', 'name email profilePicture')
      .populate('student', 'name email profilePicture')
      .sort({ createdAt: -1 });

    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
