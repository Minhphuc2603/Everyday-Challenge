import express from 'express';
import {UserProfileController} from '../controllers/index.js';


const userProfileRouter = express.Router();

userProfileRouter.route('/:userId').get(UserProfileController.getUserProfileById);
userProfileRouter.patch('/background/:id', UserProfileController.updateBackgroundPicture);
userProfileRouter.patch('/img/:id', UserProfileController.updateImgPicture);
userProfileRouter.put('/:id', UserProfileController.updateUserProfile);

export default userProfileRouter;
