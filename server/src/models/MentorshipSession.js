import mongoose from 'mongoose';

const MentorshipSessionSchema = new mongoose.Schema({
  mentor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  topic: {
    type: String,
    required: true
  },
  date: {
    type: String, // format YYYY-MM-DD
    required: true
  },
  time: {
    type: String, // format HH:MM
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'completed'],
    default: 'pending'
  },
  meetingLink: {
    type: String,
    default: ''
  },
  notes: {
    type: String,
    default: ''
  },
  review: {
    rating: { type: Number, min: 1, max: 5 },
    text: { type: String, default: '' }
  },
  certificateUrl: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('MentorshipSession', MentorshipSessionSchema);
