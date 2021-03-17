import { Router } from 'express';
import { adminOnly } from '../middlewares';
import { newUser, getUsers } from '../controllers/user.controller';

const router = Router();

router.post('/new', newUser);
router.get('/all', adminOnly, getUsers);

export default router;
