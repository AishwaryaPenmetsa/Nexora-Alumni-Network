import express from 'express';
import User from '../models/User.js';
import Job from '../models/Job.js';
import MentorshipSession from '../models/MentorshipSession.js';
import Event from '../models/Event.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// @desc    Get system-wide analytics stats
// @route   GET /api/admin/stats
// @access  Private/Admin
router.get('/stats', protect, adminOnly, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const studentsCount = await User.countDocuments({ role: 'student' });
    const alumniCount = await User.countDocuments({ role: 'alumni' });
    const approvedAlumniCount = await User.countDocuments({ role: 'alumni', isApproved: true });
    const mentorsCount = await User.countDocuments({ isMentor: true });
    const jobsCount = await Job.countDocuments();
    const sessionsCount = await MentorshipSession.countDocuments();
    const eventsCount = await Event.countDocuments();

    // Grouping by department (simulated by querying profiles if wanted, but simpler to return key analytics)
    const analytics = {
      totalUsers,
      roleDistribution: {
        students: studentsCount,
        alumni: alumniCount,
        mentors: mentorsCount,
      },
      approvedAlumniCount,
      jobsCount,
      sessionsCount,
      eventsCount
    };

    res.json(analytics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get list of all users
// @route   GET /api/admin/users
// @access  Private/Admin
router.get('/users', protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Approve an alumni profile / verify registration
// @route   PUT /api/admin/approve/:id
// @access  Private/Admin
router.put('/approve/:id', protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isApproved = true;
    await user.save();

    res.json({ message: `User ${user.name} approved successfully`, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Ban / Toggle status of a user
// @route   PUT /api/admin/ban/:id
// @access  Private/Admin
router.put('/ban/:id', protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Toggle user status: we can simulate a ban by setting isApproved to false or keeping a block flag
    user.isApproved = !user.isApproved;
    await user.save();

    res.json({ message: `User status toggled. Approved is now: ${user.isApproved}`, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
