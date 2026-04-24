import { Router } from 'express';
import { getUsers, createUser, getUserDetails, updatePassword } from '../controllers/user.controller';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { CreateUserSchema, UpdatePasswordSchema } from '../utils/validators';

const router = Router();

router.use(authenticate);
router.put('/password', validate(UpdatePasswordSchema), updatePassword);

router.use(authorize(['ADMIN']));
router.get('/', getUsers);
router.post('/', validate(CreateUserSchema), createUser);
router.get('/:id', getUserDetails);

export default router;
