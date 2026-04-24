import { Router } from 'express';
import { createStore, getStores, getOwnerDashboard } from '../controllers/store.controller';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { CreateStoreSchema } from '../utils/validators';

const router = Router();

router.get('/', authenticate, getStores);

router.post('/', authenticate, authorize(['ADMIN']), validate(CreateStoreSchema), createStore);

router.get('/owner-dashboard', authenticate, authorize(['STORE_OWNER']), getOwnerDashboard);

export default router;
