import express from 'express';
import { createPost, getAllPosts } from '../controllers/Post.controller.js';


const postRouter = express.Router();

// Route để tạo bài đăng mới
postRouter.post('/', createPost);
postRouter.get('/:userId', getAllPosts);

export default postRouter;
