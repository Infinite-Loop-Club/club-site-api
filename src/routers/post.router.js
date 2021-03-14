import { Router } from 'express';
import { newPost } from '../controllers/post.controller';

const router = Router();

router.post('/new', newPost);

export default router;
