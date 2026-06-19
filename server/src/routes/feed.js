import express from 'express';
import Post from '../models/Post.js';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Helper to award XP and level up
const awardXp = async (userId, amount) => {
  try {
    const user = await User.findById(userId);
    if (!user) return;

    user.xp += amount;
    // Simple level up algorithm: every 100 XP is a level
    const nextLevel = Math.floor(user.xp / 100) + 1;
    if (nextLevel > user.level) {
      user.level = nextLevel;
    }
    await user.save();
  } catch (err) {
    console.error('Failed to award XP:', err);
  }
};

// @desc    Get all feed posts
// @route   GET /api/feed
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', 'name role profilePicture xp level')
      .populate('comments.author', 'name profilePicture role')
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create a post
// @route   POST /api/feed/create
// @access  Private
router.post('/create', protect, async (req, res) => {
  const { text, media, pollQuestion, pollOptions, tags } = req.body;

  if (!text) {
    return res.status(400).json({ message: 'Post content is required' });
  }

  try {
    let poll = null;
    if (pollQuestion && pollOptions && pollOptions.length > 0) {
      poll = {
        question: pollQuestion,
        options: pollOptions.map(opt => ({ text: opt, votes: [] }))
      };
    }

    const post = await Post.create({
      author: req.user._id,
      text,
      media: media || [],
      poll,
      tags: tags || []
    });

    const populatedPost = await Post.findById(post._id)
      .populate('author', 'name role profilePicture xp level');

    // Award +15 XP for posting
    await awardXp(req.user._id, 15);

    res.status(201).json(populatedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Like / Unlike a post
// @route   POST /api/feed/like/:id
// @access  Private
router.post('/like/:id', protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const hasLiked = post.likes.includes(req.user._id);

    if (hasLiked) {
      post.likes = post.likes.filter(id => id.toString() !== req.user._id.toString());
    } else {
      post.likes.push(req.user._id);
      // Award +5 XP to post author
      await awardXp(post.author, 5);
    }

    await post.save();

    res.json({ liked: !hasLiked, likesCount: post.likes.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Comment on a post
// @route   POST /api/feed/comment/:id
// @access  Private
router.post('/comment/:id', protect, async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ message: 'Comment content is required' });
  }

  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    post.comments.push({
      author: req.user._id,
      text
    });

    await post.save();

    // Award +5 XP to commenter
    await awardXp(req.user._id, 5);
    // Award +5 XP to post author
    await awardXp(post.author, 5);

    const updatedPost = await Post.findById(post._id)
      .populate('author', 'name role profilePicture xp level')
      .populate('comments.author', 'name profilePicture role');

    res.status(201).json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Vote in a post poll
// @route   POST /api/feed/vote/:id
// @access  Private
router.post('/vote/:id', protect, async (req, res) => {
  const { optionId } = req.body;

  if (!optionId) {
    return res.status(400).json({ message: 'Option ID is required to register vote' });
  }

  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if user already voted in this poll, remove their vote if they did, then add to new option
    post.poll.options.forEach(opt => {
      opt.votes = opt.votes.filter(id => id.toString() !== req.user._id.toString());
    });

    const targetOpt = post.poll.options.id(optionId);
    if (targetOpt) {
      targetOpt.votes.push(req.user._id);
      // Award +5 XP for participating
      await awardXp(req.user._id, 5);
    }

    await post.save();

    const updatedPost = await Post.findById(post._id)
      .populate('author', 'name role profilePicture xp level')
      .populate('comments.author', 'name profilePicture role');

    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
