import express from 'express';
import { authController } from '../controllers/index.js';

const authRouter = express.Router();

authRouter.post('/register', authController.registerUser);
authRouter.post('/refresh', authController.verifyRefreshToken);
authRouter.post('/login', authController.loginUser);
authRouter.post('/logout', authController.logout);
authRouter.post('/verify', authController.verifyUser);
authRouter.post('/forgot', authController.forgotPassword);
// async function list(req, res, next){
//     try{
//         const project = await Project.find({}).populate("department");
//         const formattedProject = project.map(p => {
//             const formattedDate = new Date(p.startDate).toLocaleDateString('en-GB');
//             return {
//                 _id: p.id,
//                 name: p.name,
//                 description: p.description,
//                 startDate: formattedDate,
//                 type: p.type,
//                 departmentId: p.department._id,
//                 departmentName: p.department.name,
//             }
            
//         })
//         res.status(200).json(formattedProject);
//     } catch (error){
//         next(error);
//     }
// }


export default  authRouter ;
