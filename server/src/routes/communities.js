import express from 'express';
import Community from '../models/Community.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @desc    Get all communities
// @route   GET /api/communities
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const groups = await Community.find()
      .populate('creator', 'name profilePicture')
      .sort({ createdAt: -1 });

    res.json(groups);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create a community group
// @route   POST /api/communities/create
// @access  Private
router.post('/create', protect, async (req, res) => {
  const { name, description, category, avatar } = req.body;

  if (!name || !description) {
    return res.status(400).json({ message: 'Name and description are required' });
  }

  try {
    const exists = await Community.findOne({ name });
    if (exists) {
      return res.status(400).json({ message: 'Community already exists with this name' });
    }

    const group = await Community.create({
      name,
      description,
      category: category || 'Interest',
      avatar: avatar || '',
      creator: req.user._id,
      members: [req.user._id] // creator joins automatically
    });

    res.status(201).json(group);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Join / Leave a community
// @route   POST /api/communities/join/:id
// @access  Private
router.post('/join/:id', protect, async (req, res) => {
  try {
    const group = await Community.findById(req.params.id);

    if (!group) {
      return res.status(404).json({ message: 'Community group not found' });
    }

    const isMember = group.members.includes(req.user._id);

    if (isMember) {
      group.members = group.members.filter(id => id.toString() !== req.user._id.toString());
    } else {
      group.members.push(req.user._id);
    }

    await group.save();

    res.json({ joined: !isMember, membersCount: group.members.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
