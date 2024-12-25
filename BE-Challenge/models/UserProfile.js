import mongoose, { Schema } from "mongoose";
import User from "./User.js";
const addressSchema = new Schema(
  {
    city: {
      type: String
    }
  },
  {
    timestamps: true,
  }
);
const userProfileSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
      validate(value) {
        if (value.length < 6)
          throw new Error(
            'Full name must be greater than or equal six characters!',
          );
      },
    },
    profilePictureUrl: {
      type: String,
    },
    backgroundPictureUrl: {
      type: String,
    },
    bio: {
      type: String,
    },
    address: addressSchema
  },
  {
    timestamps: true,
  },
);

const UserProfile = mongoose.model("UserProfile", userProfileSchema);
export default UserProfile;
