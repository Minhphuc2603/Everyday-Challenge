import mongoose, { Schema } from 'mongoose';
import Challenge from './Challenge.js';
import User from './User.js';

const ChallengeUserSchema = new Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
      required: true,
    },
    challengeID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Challenge,
      required: true,
    },
    joinDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['joined', 'completed', 'dropped'],
      default: 'joined',
    },
    content: {
      type: String,
    },
    contentImg: [String],
  },
  { timestamps: true },
);

const ChallengeUser = mongoose.model('challengeusers', ChallengeUserSchema);

export default ChallengeUser;
