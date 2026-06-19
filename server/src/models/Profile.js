import mongoose from 'mongoose';

const ProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bio: {
    type: String,
    default: ''
  },
  graduationYear: {
    type: Number,
    required: false
  },
  department: {
    type: String,
    default: ''
  },
  institution: {
    type: String,
    default: 'Aditya Engineering College'
  },
  company: {
    type: String,
    default: ''
  },
  industry: {
    type: String,
    default: ''
  },
  skills: {
    type: [String],
    default: []
  },
  location: {
    type: String,
    default: ''
  },
  experience: [
    {
      company: { type: String, required: true },
      role: { type: String, required: true },
      from: { type: String, required: true },
      to: { type: String, default: '' },
      current: { type: Boolean, default: false },
      description: { type: String, default: '' }
    }
  ],
  education: [
    {
      school: { type: String, required: true },
      degree: { type: String, required: true },
      fieldOfStudy: { type: String, default: '' },
      year: { type: Number, required: true }
    }
  ],
  achievements: {
    type: [String],
    default: []
  },
  projects: [
    {
      title: { type: String, required: true },
      description: { type: String, default: '' },
      link: { type: String, default: '' }
    }
  ],
  socialLinks: {
    linkedin: { type: String, default: '' },
    github: { type: String, default: '' },
    twitter: { type: String, default: '' }
  },
  resumeUrl: {
    type: String,
    default: ''
  },
  recommendations: [
    {
      author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      text: { type: String, required: true },
      createdAt: { type: Date, default: Date.now }
    }
  ],
  badges: {
    type: [String],
    default: []
  },
  connections: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  rating: {
    type: Number,
    default: 0
  }
});

export default mongoose.model('Profile', ProfileSchema);
