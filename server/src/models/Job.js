import mongoose from 'mongoose';

const JobSchema = new mongoose.Schema({
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true
  },
  logo: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    required: true
  },
  salary: {
    type: String,
    default: ''
  },
  location: {
    type: String,
    required: true
  },
  experienceRequired: {
    type: String,
    default: ''
  },
  isRemote: {
    type: Boolean,
    default: false
  },
  skillsRequired: {
    type: [String],
    default: []
  },
  bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Job', JobSchema);
