import express from 'express';
import Job from '../models/Job.js';
import Referral from '../models/Referral.js';
import Notification from '../models/Notification.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @desc    Post a new job
// @route   POST /api/jobs/post
// @access  Private
router.post('/post', protect, async (req, res) => {
  const { title, company, description, salary, location, experienceRequired, isRemote, skillsRequired } = req.body;

  if (!title || !company || !description || !location) {
    return res.status(400).json({ message: 'Title, company, description, and location are required' });
  }

  try {
    const job = await Job.create({
      postedBy: req.user._id,
      title,
      company,
      description,
      salary,
      location,
      experienceRequired,
      isRemote: !!isRemote,
      skillsRequired: skillsRequired || []
    });

    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { search, location, isRemote } = req.query;

    let query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    if (isRemote === 'true') {
      query.isRemote = true;
    }

    const jobs = await Job.find(query)
      .populate('postedBy', 'name email profilePicture')
      .sort({ createdAt: -1 });

    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Bookmark / Unbookmark a job
// @route   POST /api/jobs/bookmark/:id
// @access  Private
router.post('/bookmark/:id', protect, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    const isBookmarked = job.bookmarks.includes(req.user._id);

    if (isBookmarked) {
      job.bookmarks = job.bookmarks.filter(id => id.toString() !== req.user._id.toString());
    } else {
      job.bookmarks.push(req.user._id);
    }

    await job.save();

    res.json({ bookmarked: !isBookmarked, bookmarksCount: job.bookmarks.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Request a job referral from alumni
// @route   POST /api/jobs/referral/:id
// @access  Private
router.post('/referral/:id', protect, async (req, res) => {
  const { notes, resumeUrl } = req.body;

  if (!resumeUrl) {
    return res.status(400).json({ message: 'Resume URL is required' });
  }

  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Verify alumni poster exists
    const alumniPoster = job.postedBy;

    const referral = await Referral.create({
      job: req.params.id,
      candidate: req.user._id,
      alumni: alumniPoster,
      resumeUrl,
      notes
    });

    // Notify alumni poster
    await Notification.create({
      recipient: alumniPoster,
      sender: req.user._id,
      type: 'referral_request',
      text: `${req.user.name} requested a referral for the "${job.title}" position at ${job.company}.`,
      link: '/dashboard'
    });

    res.status(201).json(referral);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update referral status (accept/reject)
// @route   PUT /api/jobs/referral/:id
// @access  Private
router.put('/referral/:id', protect, async (req, res) => {
  const { status } = req.body;

  try {
    const referral = await Referral.findById(req.params.id).populate('job');

    if (!referral) {
      return res.status(404).json({ message: 'Referral request not found' });
    }

    // Only the assigned alumni can update status
    if (referral.alumni.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized status modification' });
    }

    referral.status = status;
    await referral.save();

    // Notify student applicant
    await Notification.create({
      recipient: referral.candidate,
      sender: req.user._id,
      type: 'referral_status',
      text: `Your referral request for "${referral.job.title}" at ${referral.job.company} has been ${status}.`,
      link: '/dashboard'
    });

    res.json(referral);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get all referrals (by candidate or alumni)
// @route   GET /api/jobs/referrals
// @access  Private
router.get('/referrals', protect, async (req, res) => {
  try {
    const referrals = await Referral.find({
      $or: [{ candidate: req.user._id }, { alumni: req.user._id }]
    })
      .populate('job')
      .populate('candidate', 'name email profilePicture')
      .populate('alumni', 'name email profilePicture')
      .sort({ createdAt: -1 });

    res.json(referrals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
