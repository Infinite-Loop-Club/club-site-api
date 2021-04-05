import { Router } from 'express';

import { sendVoteOTP, verifyOTP, makeVote } from 'controllers/vote.controller';

const router = Router();

router.post('/sendOtp', sendVoteOTP);
router.post('/verifyOtp', verifyOTP);
router.post('/make', makeVote);

export default router;
