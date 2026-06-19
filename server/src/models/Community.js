import mongoose from 'mongoose';

const CommunitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['Interest', 'Department', 'Regional', 'Private'],
    default: 'Interest'
  },
  avatar: {
    type: String,
    default: ''
  },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Community', CommunitySchema);
