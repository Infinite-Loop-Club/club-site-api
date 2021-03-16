import { Router } from 'express';
import { deletePost, getPostById, getPosts, newPost } from '../controllers/post.controller';

const router = Router();

router.post('/new', newPost);
router.get('/all', getPosts);
router.get('/:id', getPostById);
router.delete('/delete', deletePost);

export default router;
