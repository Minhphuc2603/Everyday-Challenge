import express from 'express';
import { ChallengeController } from '../controllers/index.js';
import { checkAuthorization } from '../middleware/Auth.js';

const challengeRouter = express.Router();

// Todo: Add checkAuthorization in production
challengeRouter.route('/').get(ChallengeController.getAllChallenges);
challengeRouter.post('/share' , ChallengeController.shareChallenge)
challengeRouter.route('/').post(ChallengeController.createChallenge);
challengeRouter.route('/:id')
  .get(ChallengeController.getChallengeById)
  .put(ChallengeController.updateChallenge)
  .delete(ChallengeController.deleteChallenge);
challengeRouter.route('/:id/verify')
  .put(checkAuthorization, ChallengeController.verifyChallenge);

  challengeRouter.route('/ban/:id')
  .put(ChallengeController.banChallenge);


export default challengeRouter;
