import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { loginSchema, registerSchema, changePasswordSchema } from '../schemas/auth';
import {
  login,
  register,
  getProfile,
  changePassword,
} from '../controllers/authController';

const router = Router();

router.post('/login', validateRequest({ body: loginSchema }), login);
router.post('/register', validateRequest({ body: registerSchema }), register);
router.get('/me', authenticate, getProfile);
router.post('/change-password', authenticate, validateRequest({ body: changePasswordSchema }), changePassword);

export default router;