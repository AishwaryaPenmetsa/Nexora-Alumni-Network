import express from 'express';
import Message from '../models/Message.js';
import Notification from '../models/Notification.js';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @desc    Get active conversations list
// @route   GET /api/messages/conversations
// @access  Private
router.get('/conversations', protect, async (req, res) => {
  try {
    const currentUserId = req.user._id;

    // Retrieve all messages involving user
    const messages = await Message.find({
      $or: [{ sender: currentUserId }, { recipient: currentUserId }]
    })
      .sort({ createdAt: -1 })
      .populate('sender', 'name email profilePicture role')
      .populate('recipient', 'name email profilePicture role');

    // Group by conversation partner
    const conversations = {};

    messages.forEach(msg => {
      const partner = msg.sender._id.toString() === currentUserId.toString() ? msg.recipient : msg.sender;
      const partnerId = partner._id.toString();

      if (!conversations[partnerId]) {
        conversations[partnerId] = {
          user: partner,
          lastMessage: msg.text,
          unread: !msg.isRead && msg.recipient._id.toString() === currentUserId.toString(),
          updatedAt: msg.createdAt
        };
      } else {
        // If unread exists in history, count it
        if (!msg.isRead && msg.recipient._id.toString() === currentUserId.toString()) {
          conversations[partnerId].unread = true;
        }
      }
    });

    res.json(Object.values(conversations).sort((a, b) => b.updatedAt - a.updatedAt));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get message history between current user and partner
// @route   GET /api/messages/history/:userId
// @access  Private
router.get('/history/:userId', protect, async (req, res) => {
  try {
    const partnerId = req.params.userId;
    const currentUserId = req.user._id;

    // Mark messages as read
    await Message.updateMany(
      { sender: partnerId, recipient: currentUserId, isRead: false },
      { $set: { isRead: true } }
    );

    const messages = await Message.find({
      $or: [
        { sender: currentUserId, recipient: partnerId },
        { sender: partnerId, recipient: currentUserId }
      ]
    })
      .sort({ createdAt: 1 })
      .populate('sender', 'name profilePicture')
      .populate('recipient', 'name profilePicture');

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Send a message
// @route   POST /api/messages/send
// @access  Private
router.post('/send', protect, async (req, res) => {
  const { recipientId, text, attachments } = req.body;

  if (!recipientId || !text) {
    return res.status(400).json({ message: 'Recipient and text are required' });
  }

  try {
    const recipientExists = await User.findById(recipientId);
    if (!recipientExists) {
      return res.status(404).json({ message: 'Recipient not found' });
    }

    const message = await Message.create({
      sender: req.user._id,
      recipient: recipientId,
      text,
      attachments: attachments || []
    });

    const populatedMsg = await Message.findById(message._id)
      .populate('sender', 'name profilePicture role')
      .populate('recipient', 'name profilePicture role');

    // Create a message notification
    await Notification.create({
      recipient: recipientId,
      sender: req.user._id,
      type: 'message',
      text: `New message from ${req.user.name}: "${text.substring(0, 30)}${text.length > 30 ? '...' : ''}"`,
      link: '/messages'
    });

    res.status(201).json(populatedMsg);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
