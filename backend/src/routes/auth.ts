import express from 'express';
import { register, login, googleAuth, googleCallback } from '../controllers/authController';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/google', googleAuth);
router.get('/google/callback', googleCallback);

export default router;