
import mongoose from 'mongoose';
import UserProfile from '../models/UserProfile.js';

const getUserProfileById = async (req, res) => {
    try {
      const userId = req.params.userId;
      console.log(`Received userId: ${userId}`); 
  
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).send({ error: 'Invalid userId' });
      }
  
      const userProfile = await UserProfile.findOne({ userId: userId }).populate('userId');
      if (!userProfile) {
        return res.status(404).send({ error: 'UserProfile not found' });
      }
      res.status(200).send(userProfile);
    } catch (error) {
      console.error(error); 
      res.status(500).send({ error: 'Server error' });
    }
  };
  const updateBackgroundPicture = async (req, res) => {
    try {
      const userId = req.params.id;
      const { backgroundPictureUrl } = req.body;
  
      const userProfile = await UserProfile.findOne({ userId });
  
      if (!userProfile) {
        return res.status(404).json({ message: 'UserProfile not found' });
      }
  
      if (backgroundPictureUrl) {
        userProfile.backgroundPictureUrl = backgroundPictureUrl;
      }
  
      await userProfile.save();
      res.json(userProfile);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  const updateUserProfile = async (req, res) => {
    try {
      const userId = req.params.id;
      const { fullName, bio, address } = req.body;
      const userProfile = await UserProfile.findOne({ userId });
      if (!userProfile) {
        return res.status(404).json({ message: 'UserProfile not found' });
      }
      if (fullName) {
        userProfile.fullName = fullName;
      }
      if (bio) {
        userProfile.bio = bio;
      }
      if (address) {
        if (!userProfile.address) {
          userProfile.address = {};
        }
        if (address.city) {
          userProfile.address.city = address.city;
        }
      }
      await userProfile.save();
      res.json(userProfile);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  const updateImgPicture = async (req, res) => {
    try {
      const userId = req.params.id;
      const { profilePictureUrl } = req.body;
  
      const userProfile = await UserProfile.findOne({ userId });
  
      if (!userProfile) {
        return res.status(404).json({ message: 'UserProfile not found' });
      }
  
      if (profilePictureUrl) {
        userProfile.profilePictureUrl = profilePictureUrl;
      }
  
      await userProfile.save();
      res.json(userProfile);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  



 const updateUserProfileById = async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['fullName', 'profilePictureUrl', 'backgroundPictureUrl', 'bio', 'address'];
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }

  try {
    const userProfile = await UserProfile.findById(req.params.id);
    if (!userProfile) {
      return res.status(404).send();
    }

    updates.forEach(update => userProfile[update] = req.body[update]);
    await userProfile.save();

    res.status(200).send(userProfile);
  } catch (error) {
    res.status(400).send(error);
  }
};

export default {getUserProfileById,updateUserProfileById,updateBackgroundPicture,updateImgPicture ,updateUserProfile};

