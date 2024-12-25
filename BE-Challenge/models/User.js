import mongoose, { Schema } from 'mongoose';

import isEmail from 'validator/lib/isEmail.js';
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      validate(value) {
        if (value.length < 6 || value.length > 30)
          throw new Error('Username must be form 6 to 30 charaters!');
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (value) => isEmail,
        message: 'Email is incorrect format!',
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (value.length < 6)
          throw new Error('Password must be greater than or equal six!');
      },
    },
    fullName: {
      type: String,
      required: true,
      validate(value) {
        if (value.length < 6)
          throw new Error('Full name must be greater than or equal six characters!');
      },
    },
    role: {
      type: Number,
      default: 1,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    token: {
      type: String,
      default: undefined,
    },
    verificationCode: {
      type: String,
      default: undefined,
    },
    active: {
      type: Boolean,
      default: true,
    },
    joinDate: {
      type: Date,
      default: Date.now,
    },
    accountType: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);
const User = mongoose.model('User', userSchema);

export default User;
