import express from 'express';
import { ChallengeUserController } from '../controllers/index.js';
import { checkAuthorization } from '../middleware/Auth.js';

import ChallengeUser from '../models/ChallengeUsers.js';

const challengeUserRouter = express.Router();

// Todo: Add checkAuthorization in production
challengeUserRouter.route('/user/:id').get(ChallengeUserController.getAllChallengeUsers);
challengeUserRouter.route('/')
  // .get(ChallengeUserController.getAllChallengeUsers)
  .post(ChallengeUserController.createChallengeUser);

// challengeUserRouter.route('/:id')
//   .get(ChallengeUserController.getChallengeUserById)
//   .put(ChallengeUserController.updateChallengeUser)
//   .delete(ChallengeUserController.deleteChallengeUser);


challengeUserRouter.get('/:userID/:challengeID', async (req, res) => {
  const { userID, challengeID } = req.params;
  

  try {
    const result = await ChallengeUser.find({ userID, challengeID }).populate('challengeID');
    res.json(result);
  } catch (error) {
    console.error('Error fetching challenge user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
challengeUserRouter.put('/:userID/:challengeID', async (req, res) => {
  const { userID, challengeID } = req.params;
  const { content, contentImg } = req.body;

  console.log('userId: ', userID, 'id: ', challengeID);
  try {   
    const updatedChallengeUser = await ChallengeUser.findOneAndUpdate(
      { userID, challengeID },
      { $set: { content, contentImg, status: 'completed' } },
      { new: true }
    );

    if (!updatedChallengeUser) {
      return res.status(404).json({ message: 'Challenge user not found' });
    }

    res.status(200).json(updatedChallengeUser);
  } catch (error) {
    console.error('Error updating challenge user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
challengeUserRouter.get('/:userID', async (req, res) => {
  const { userID } = req.params;
  console.log('userIdhihi: ', userID);
  
  try {
    const userChallenges = await ChallengeUser.find({ userID }).populate('challengeID').populate('userID');
    
    res.status(200).json(userChallenges);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user challenges', error });
  }
});
// challengeUserRouter.route('/user/:userID').get(ChallengeUserController.getAllChallengeOfUser);

export default challengeUserRouter;
