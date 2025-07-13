import express from 'express';
import {SignUp, LogIn, Logout} from '../controllers/authController';

const router = express.Router();

router.post('/signup', SignUp);
router.post('/login', LogIn);
router.post('/logout', Logout);

export default router;