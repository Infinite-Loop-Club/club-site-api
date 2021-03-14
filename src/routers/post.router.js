import { Router } from 'express';
import { getPostById, getPosts, newPost } from '../controllers/post.controller';

const router = Router();

router.post('/new', newPost);
router.get('/all', getPosts);
router.get('/:id', getPostById);

export default router;
