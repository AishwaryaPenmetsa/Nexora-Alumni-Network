import express from 'express';
import User from '../models/User.js';
import Profile from '../models/Profile.js';
import Notification from '../models/Notification.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @desc    Get all active alumni with search filters
// @route   GET /api/directory/alumni
// @access  Public
router.get('/alumni', async (req, res) => {
  try {
    const { name, graduationYear, department, institution, company, industry, location, skills } = req.query;

    let query = { role: 'alumni', isApproved: true };

    if (name) {
      query.name = { $regex: name, $options: 'i' };
    }

    const users = await User.find(query).select('-password');
    const userIds = users.map(u => u._id);

    // Build profile search query
    let profileQuery = { user: { $in: userIds } };

    if (graduationYear) {
      profileQuery.graduationYear = Number(graduationYear);
    }
    if (department) {
      profileQuery.department = { $regex: department, $options: 'i' };
    }
    if (institution) {
      profileQuery.institution = { $regex: institution, $options: 'i' };
    }
    if (company) {
      profileQuery.company = { $regex: company, $options: 'i' };
    }
    if (industry) {
      profileQuery.industry = { $regex: industry, $options: 'i' };
    }
    if (location) {
      profileQuery.location = { $regex: location, $options: 'i' };
    }
    if (skills) {
      const skillsArray = skills.split(',').map(s => s.trim());
      profileQuery.skills = { $all: skillsArray.map(skill => new RegExp(skill, 'i')) };
    }

    const profiles = await Profile.find(profileQuery)
      .populate('user', 'name email role profilePicture isApproved isMentor');

    res.json(profiles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// @desc    Get leaderboard rankings (all users sorted by XP)
// @route   GET /api/directory/leaderboard
// @access  Private
router.get('/leaderboard', protect, async (req, res) => {
  try {
    const users = await User.find({ isApproved: true })
      .select('name role profilePicture xp level')
      .sort({ xp: -1 })
      .limit(50);
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get profile details of a specific user
// @route   GET /api/directory/profile/:id
// @access  Public
router.get('/profile/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const profile = await Profile.findOne({ user: req.params.id })
      .populate('user', 'name email role profilePicture isApproved isMentor')
      .populate('connections', 'name email role profilePicture')
      .populate('recommendations.author', 'name role profilePicture');

    res.json({ user, profile });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Send connection request / connect directly
// @route   POST /api/directory/connect/:id
// @access  Private
router.post('/connect/:id', protect, async (req, res) => {
  try {
    const targetUserId = req.params.id;
    const currentUserId = req.user._id;

    if (targetUserId === currentUserId.toString()) {
      return res.status(400).json({ message: 'You cannot connect with yourself' });
    }

    const targetProfile = await Profile.findOne({ user: targetUserId });
    const myProfile = await Profile.findOne({ user: currentUserId });

    if (!targetProfile || !myProfile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    // Toggle connection for this mockup platform
    const isConnected = targetProfile.connections.includes(currentUserId);

    if (isConnected) {
      // Disconnect
      targetProfile.connections = targetProfile.connections.filter(id => id.toString() !== currentUserId.toString());
      myProfile.connections = myProfile.connections.filter(id => id.toString() !== targetUserId.toString());
    } else {
      // Connect
      targetProfile.connections.push(currentUserId);
      myProfile.connections.push(targetUserId);

      // Create connection notification
      await Notification.create({
        recipient: targetUserId,
        sender: currentUserId,
        type: 'connection_accept',
        text: `${req.user.name} established a connection with you.`,
        link: `/profile/${currentUserId}`
      });
    }

    await targetProfile.save();
    await myProfile.save();

    res.json({
      connected: !isConnected,
      connectionsCount: targetProfile.connections.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Follow / Unfollow alumni
// @route   POST /api/directory/follow/:id
// @access  Private
router.post('/follow/:id', protect, async (req, res) => {
  try {
    const targetUserId = req.params.id;
    const currentUserId = req.user._id;

    const targetProfile = await Profile.findOne({ user: targetUserId });

    if (!targetProfile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    const isFollowing = targetProfile.followers.includes(currentUserId);

    if (isFollowing) {
      targetProfile.followers = targetProfile.followers.filter(id => id.toString() !== currentUserId.toString());
    } else {
      targetProfile.followers.push(currentUserId);
    }

    await targetProfile.save();

    res.json({
      following: !isFollowing,
      followersCount: targetProfile.followers.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Recommend an Alumni
// @route   POST /api/directory/recommend/:id
// @access  Private
router.post('/recommend/:id', protect, async (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ message: 'Recommendation text is required' });
  }

  try {
    const profile = await Profile.findOne({ user: req.params.id });
    if (!profile) {
      return res.status(404).json({ message: 'Alumni profile not found' });
    }

    profile.recommendations.push({
      author: req.user._id,
      text
    });

    await profile.save();

    // Notify recipient
    await Notification.create({
      recipient: req.params.id,
      sender: req.user._id,
      type: 'connection_request',
      text: `${req.user.name} recommended you on your profile.`,
      link: `/profile/${req.params.id}`
    });

    res.status(201).json({ message: 'Recommendation submitted successfully', recommendations: profile.recommendations });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
