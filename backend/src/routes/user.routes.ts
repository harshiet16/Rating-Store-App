import { Router } from 'express';
import { getUsers, createUser, getUserDetails } from '../controllers/user.controller';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { CreateUserSchema } from '../utils/validators';

const router = Router();

// Only ADMIN can manage users
router.use(authenticate, authorize(['ADMIN']));

router.get('/', getUsers);
router.post('/', validate(CreateUserSchema), createUser);
router.get('/:id', getUserDetails);

export default router;
