import express from 'express';
import {userController} from '../controllers/index.js';
import {checkAuthorization} from '../middleware/Auth.js';
import User from '../models/User.js';


const userRouter = express.Router();
// Todo: Add checkAuthorization in production
userRouter.route('/').get(userController.getAllUser);
userRouter.route('/:id').get(userController.getUser);
userRouter.patch('/:id', userController.getUpdateUser);
userRouter.patch('/password/:id', userController.updatePassword);
userRouter.put('/updateAccountType/:id/', async (req, res) => {
    const userId = req.params.id;
    const { accountType } = req.body;
  
    try {
      const user = await User.findByIdAndUpdate(
        userId,
        { $set: { accountType } },
        { new: true }
      );
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).json(user);
    } catch (error) {
      console.error('Error updating accountType:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });


export default userRouter;
