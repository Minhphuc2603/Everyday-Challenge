import mongoose, { Schema } from 'mongoose';
import Challenge from './Challenge.js';
import User from './User.js';

const ReportSchema = new Schema(
  {
    challengeID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Challenge,
      required: true,
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    comment: {
      type: String,
    },
  },
  { timestamps: true }
);

const Report = mongoose.model('reports', ReportSchema);

export default Report;