import Post from "../models/Post.js";


// Tạo bài đăng mới
 const createPost = async (req, res) => {
  try {
    const { userId, description, picturePath } = req.body;
    const newPost = new Post({
      userId,
      description,
      picturePath,
      likes: new Map(),
      comments: [],
    });

    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getAllPosts = async (req, res) => {
  try {
    const userId = req.params.userId;
    const posts = await Post.find({ userId }).populate('userId', 'fullName profilePictureUrl');
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export { createPost , getAllPosts };
