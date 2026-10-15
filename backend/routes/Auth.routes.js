import express from 'express';
import { getMe, resentOpt, signin, singUp, verfiyEmail } from '../controller/Auth.controller.js';
import { authMiddelware } from '../middelware/Auth.middelware.js';


const router=express.Router();
router.post('/signup',singUp)
router.post('/signin',signin)
router.post('/resent-otp',resentOpt)
router.post('/verify-email',verfiyEmail)
router.get('/getme',authMiddelware,getMe)
export default router;