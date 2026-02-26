import express from 'express';
import { createTagController, getAllTagsController, deleteTagController } from '../controller/tag.controller.js';

const tagRouter = express.Router();

tagRouter.route('/create').post(createTagController);
tagRouter.route('/all').get(getAllTagsController);
tagRouter.route('/delete/:id').delete(deleteTagController);

export default tagRouter;
