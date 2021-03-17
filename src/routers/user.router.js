import { Router } from 'express';
import {
  getUserByEmail,
  getUserById,
  getUserByRegisterNumber,
  getUsers,
  newUser
} from '../controllers/user.controller';
import { adminOnly } from '../middlewares';

const router = Router();

router.post('/new', newUser);
router.get('/all', adminOnly, getUsers);
router.get('/id=:id', adminOnly, getUserById);
router.get('/reg=:registerNumber', adminOnly, getUserByRegisterNumber);
router.get('/email=:email', adminOnly, getUserByEmail);

export default router;
