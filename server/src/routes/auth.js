import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Profile from '../models/Profile.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Generate Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'super_secret_alumni_token_key_1337', {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Admins are pre-approved, students are pre-approved, alumni need admin approval
    const isApproved = role === 'admin' || role === 'student';

    const user = await User.create({
      name,
      email,
      password,
      role: role || 'student',
      isApproved,
    });

    // Create associated profile document
    await Profile.create({
      user: user._id,
      bio: `Hello! I am a ${user.role} on NEXORA.`,
      skills: [],
      experience: [],
      education: [],
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isApproved: user.isApproved,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isApproved: user.isApproved,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get current user details & profile
// @route   GET /api/auth/me
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    const profile = await Profile.findOne({ user: req.user._id })
      .populate('connections', 'name email role profilePicture')
      .populate('recommendations.author', 'name role profilePicture');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user, profile });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update user profile details
// @route   PUT /api/auth/profile
// @access  Private
router.put('/profile', protect, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id });

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    const {
      bio,
      graduationYear,
      department,
      company,
      industry,
      skills,
      location,
      experience,
      education,
      achievements,
      projects,
      socialLinks,
      resumeUrl,
    } = req.body;

    profile.bio = bio !== undefined ? bio : profile.bio;
    profile.graduationYear = graduationYear !== undefined ? graduationYear : profile.graduationYear;
    profile.department = department !== undefined ? department : profile.department;
    profile.company = company !== undefined ? company : profile.company;
    profile.industry = industry !== undefined ? industry : profile.industry;
    profile.skills = skills !== undefined ? skills : profile.skills;
    profile.location = location !== undefined ? location : profile.location;
    profile.experience = experience !== undefined ? experience : profile.experience;
    profile.education = education !== undefined ? education : profile.education;
    profile.achievements = achievements !== undefined ? achievements : profile.achievements;
    profile.projects = projects !== undefined ? projects : profile.projects;
    profile.socialLinks = socialLinks !== undefined ? socialLinks : profile.socialLinks;
    profile.resumeUrl = resumeUrl !== undefined ? resumeUrl : profile.resumeUrl;

    const updatedProfile = await profile.save();

    // If company is updated, reflect in user model or search criteria
    if (company && req.user.role === 'alumni') {
      await User.findByIdAndUpdate(req.user._id, { isApproved: true }); // make sure alumni stays active
    }

    res.json(updatedProfile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Become a Mentor request toggler
// @route   PUT /api/auth/mentor-toggle
// @access  Private
router.put('/mentor-toggle', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isMentor = !user.isMentor;
    await user.save();

    res.json({ message: `Mentor status updated successfully`, isMentor: user.isMentor });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
