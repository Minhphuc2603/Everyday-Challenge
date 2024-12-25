import express from 'express';

import { checkAuthorization } from '../middleware/Auth.js';
import ReportController from '../controllers/Report.controller.js';

const reportRouter = express.Router();

// Todo: Add checkAuthorization in production
reportRouter.route('/')
  .get(ReportController.getAllReports);

reportRouter.route('/:challengeID')
  .post(ReportController.createReport);

reportRouter.route('/:id')
  .get(ReportController.getReportById)
  .delete(ReportController.deleteReport);

export default reportRouter;