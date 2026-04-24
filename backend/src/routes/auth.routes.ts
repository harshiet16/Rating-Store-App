import { Router } from 'express';
import { register, login, updatePassword } from '../controllers/auth.controller';
import { validate } from '../middleware/validate';
import { RegisterUserSchema, LoginSchema, UpdatePasswordSchema } from '../utils/validators';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/register', validate(RegisterUserSchema), register);
router.post('/login', validate(LoginSchema), login);
router.put('/password', authenticate, validate(UpdatePasswordSchema), updatePassword);

export default router;
