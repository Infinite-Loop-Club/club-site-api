import { Router } from 'express';
import { newUser } from '../controllers/user.controller';

const router = Router();

router.post('/new', newUser);

export default router;
