import { Schema } from "mongoose";
import mongoose from "mongoose";

const postSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        description: String,
        picturePath: [String],
        likes: {
            type: Map,
            of: Boolean,
        },
        comments: {
            type: Array,
            default: [],
        },
    },
    { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

export default Post;