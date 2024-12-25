import mongoose, { Schema } from "mongoose";
import Categories from "./Category.js";
import User from "./User.js";

const ChallengeSchema = new Schema({
    ChallengeName: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    contentImg:
        [String]
    ,
    isPublic: {
        type: Boolean,
        required: true,
        default: false,
    },
    isVerified: {
        type: Boolean,
        required: true,
        default: false,
    },
    ExpiresAt: {
        type: Date,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    categoryID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Categories,
        required: true,
    },
    OwnerID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
        required: true,
    },
    status: {
        type: Boolean,
        default: true,      
    },
}, {
    timestamps: true,
});

const Challenge = mongoose.model("challenges", ChallengeSchema);

export default Challenge;
