import express from 'express';
import Forum from '../models/Forum.js';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Helper to award XP
const awardXp = async (userId, amount) => {
  try {
    const user = await User.findById(userId);
    if (!user) return;
    user.xp += amount;
    const nextLevel = Math.floor(user.xp / 100) + 1;
    if (nextLevel > user.level) {
      user.level = nextLevel;
    }
    await user.save();
  } catch (err) {
    console.error(err);
  }
};

// @desc    Get all forum questions
// @route   GET /api/forum
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const questions = await Forum.find()
      .populate('author', 'name role profilePicture xp level')
      .populate('answers.author', 'name profilePicture role xp level')
      .sort({ createdAt: -1 });

    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create a forum discussion question
// @route   POST /api/forum/create
// @access  Private
router.post('/create', protect, async (req, res) => {
  const { title, body, tags } = req.body;

  if (!title || !body) {
    return res.status(400).json({ message: 'Title and body are required' });
  }

  try {
    const question = await Forum.create({
      title,
      body,
      author: req.user._id,
      tags: tags || []
    });

    const populatedQ = await Forum.findById(question._id)
      .populate('author', 'name role profilePicture xp level');

    // Award +20 XP for posting a detailed query
    await awardXp(req.user._id, 20);

    res.status(201).json(populatedQ);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Upvote / Like a question
// @route   POST /api/forum/like/:id
// @access  Private
router.post('/like/:id', protect, async (req, res) => {
  try {
    const question = await Forum.findById(req.params.id);

    if (!question) {
      return res.status(404).json({ message: 'Discussion thread not found' });
    }

    const hasLiked = question.likes.includes(req.user._id);

    if (hasLiked) {
      question.likes = question.likes.filter(id => id.toString() !== req.user._id.toString());
    } else {
      question.likes.push(req.user._id);
      // Award +5 XP to thread author
      await awardXp(question.author, 5);
    }

    await question.save();

    res.json({ liked: !hasLiked, likesCount: question.likes.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Answer a discussion question
// @route   POST /api/forum/answer/:id
// @access  Private
router.post('/answer/:id', protect, async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ message: 'Answer content is required' });
  }

  try {
    const question = await Forum.findById(req.params.id);

    if (!question) {
      return res.status(404).json({ message: 'Discussion thread not found' });
    }

    question.answers.push({
      author: req.user._id,
      text
    });

    await question.save();

    // Award +15 XP to helper
    await awardXp(req.user._id, 15);

    const updatedQ = await Forum.findById(question._id)
      .populate('author', 'name role profilePicture xp level')
      .populate('answers.author', 'name profilePicture role xp level');

    res.status(201).json(updatedQ);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Pin / Unpin best answer
// @route   PUT /api/forum/pin/:questionId/:answerId
// @access  Private
router.put('/pin/:questionId/:answerId', protect, async (req, res) => {
  try {
    const question = await Forum.findById(req.params.questionId);

    if (!question) {
      return res.status(404).json({ message: 'Discussion thread not found' });
    }

    // Only the question author can pin the best answer
    if (question.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only the thread author can pin best answers' });
    }

    const answer = question.answers.id(req.params.answerId);
    if (!answer) {
      return res.status(404).json({ message: 'Answer not found' });
    }

    // Toggle Pin state
    answer.isPinned = !answer.isPinned;
    await question.save();

    if (answer.isPinned) {
      // Award +25 XP to the helper for pinning!
      await awardXp(answer.author, 25);
    }

    const updatedQ = await Forum.findById(question._id)
      .populate('author', 'name role profilePicture xp level')
      .populate('answers.author', 'name profilePicture role xp level');

    res.json(updatedQ);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
