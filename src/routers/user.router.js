import { Router } from 'express';
import {
  getUserByEmail,
  getUserById,
  getUserByRegisterNumber,
  getUsers,
  newUser,
  getCSV,
  updateDeptIT
} from 'controllers/user.controller';
import { adminOnly } from 'middlewares';

const router = Router();

router.post('/new', newUser);
router.post('/getCSV', adminOnly, getCSV);
router.get('/all', adminOnly, getUsers);
router.get('/id=:id', adminOnly, getUserById);
router.get('/changeDept/it/id=:id', updateDeptIT);
router.get('/reg=:registerNumber', adminOnly, getUserByRegisterNumber);
router.get('/email=:email', adminOnly, getUserByEmail);

export default router;
