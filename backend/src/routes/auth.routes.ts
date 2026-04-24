import { Router } from 'express';
import { register, login } from '../controllers/auth.controller';
import { validate } from '../middleware/validate';
import { RegisterUserSchema, LoginSchema } from '../utils/validators';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/register', validate(RegisterUserSchema), register);
router.post('/login', validate(LoginSchema), login);

export default router;
