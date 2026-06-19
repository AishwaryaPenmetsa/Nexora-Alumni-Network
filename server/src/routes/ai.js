import express from 'express';
import { protect } from '../middleware/auth.js';
import User from '../models/User.js';
import Profile from '../models/Profile.js';

const router = express.Router();

// @desc    AI Resume Review
// @route   POST /api/ai/resume-review
// @access  Private
router.post('/resume-review', protect, async (req, res) => {
  const { resumeUrl } = req.body;

  if (!resumeUrl) {
    return res.status(400).json({ message: 'Resume URL or file path is required for parsing' });
  }

  try {
    // Simulate complex NLP parsing of resume
    const score = Math.floor(Math.random() * 25) + 70; // score between 70 and 95
    const parserReviews = {
      score,
      formatting: 'Good. Ensure bullet points lead with strong action verbs (e.g., "Led", "Optimized" instead of "Worked on").',
      strengths: [
        'Strong showcase of project development frameworks.',
        'Core education sections are clearly visible and formatted.',
        'Keywords related to modern web architectures are well integrated.'
      ],
      skillsGaps: [
        'No clear cloud infrastructure credentials (AWS/GCP) indicated.',
        'Could benefit from listing API testing frameworks (e.g., Postman, Jest).',
        'System Design exposure is not highlighted in experiences summary.'
      ],
      recommendations: [
        'Add a dedicated skills summary grid at the top.',
        'Link active GitHub repositories directly in the projects layout.',
        'Shorten biography block to a maximum of 3 sentences.'
      ]
    };

    res.json(parserReviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    AI Career Recommendations
// @route   GET /api/ai/career-recommend
// @access  Private
router.get('/career-recommend', protect, async (req, res) => {
  try {
    const myProfile = await Profile.findOne({ user: req.user._id });
    const userSkills = myProfile?.skills || [];

    // Analyze skills and suggest standard career tracks
    let recommendedTrack = 'Full Stack Developer';
    let suggestionCourses = [
      { name: 'System Design Interview Fundamentals', provider: 'ByteByteGo' },
      { name: 'NodeJS Advanced Design Patterns', provider: 'Udemy' }
    ];

    if (userSkills.some(s => /design|ux|ui|figma/i.test(s))) {
      recommendedTrack = 'Creative Frontend Engineer & UX Architect';
      suggestionCourses = [
        { name: 'Three.js Journey Masterclass', provider: 'Bruno Simon' },
        { name: 'Advanced Framer Motion Animations', provider: 'Frontend Masters' }
      ];
    } else if (userSkills.some(s => /kubernetes|infra|docker|go/i.test(s))) {
      recommendedTrack = 'DevOps & Site Reliability Architect';
      suggestionCourses = [
        { name: 'Kubernetes Certified Administrator (CKA)', provider: 'Linux Foundation' },
        { name: 'AWS Cloud Solutions Architect', provider: 'A Cloud Guru' }
      ];
    }

    res.json({
      roleMatched: recommendedTrack,
      confidence: '92%',
      recommendedCourses: suggestionCourses,
      skillsGapAnalysis: [
        { skill: 'WebGL / Three.js', status: 'Required for Creative Frontend roles', priority: 'High' },
        { skill: 'Docker Containerization', status: 'Useful for deployment scaling', priority: 'Medium' }
      ]
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    AI Mentor Matching Suggestions
// @route   GET /api/ai/mentor-match
// @access  Private
router.get('/mentor-match', protect, async (req, res) => {
  try {
    const myProfile = await Profile.findOne({ user: req.user._id });
    const userSkills = myProfile?.skills || [];

    const mentors = await User.find({ isMentor: true, isApproved: true }).select('name email role profilePicture');
    const mentorIds = mentors.map(m => m._id);
    const mentorProfiles = await Profile.find({ user: { $in: mentorIds } }).populate('user', 'name profilePicture role');

    // Simple algorithm: count intersecting skills
    const matches = mentorProfiles.map(mProfile => {
      const intersect = mProfile.skills.filter(skill => 
        userSkills.some(uSkill => uSkill.toLowerCase() === skill.toLowerCase())
      );
      
      const matchScore = userSkills.length === 0 
        ? Math.floor(Math.random() * 30) + 50 
        : Math.floor((intersect.length / userSkills.length) * 100);

      return {
        mentor: mProfile.user,
        company: mProfile.company,
        skillsMatched: intersect,
        matchPercentage: Math.max(matchScore, 65) // baseline match score
      };
    });

    // Sort by match percentage
    const sortedMatches = matches.sort((a, b) => b.matchPercentage - a.matchPercentage).slice(0, 3);

    res.json(sortedMatches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
