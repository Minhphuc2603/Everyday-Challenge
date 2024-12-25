import express from 'express';
import { getAllCategories } from '../controllers/Category.controller.js';


const routerCategory = express.Router();

routerCategory.get('/', getAllCategories);

export default routerCategory;
