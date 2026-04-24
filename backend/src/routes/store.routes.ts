import { Router } from 'express';
import { createStore, getStores, getOwnerDashboard } from '../controllers/store.controller';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { CreateStoreSchema } from '../utils/validators';

const router = Router();

// Used by multiple roles but needs authentication to fetch specific user's ratings
router.get('/', authenticate, getStores);

// Only ADMIN can add new stores
router.post('/', authenticate, authorize(['ADMIN']), validate(CreateStoreSchema), createStore);

// Only OWNER can view their dashboard
router.get('/owner-dashboard', authenticate, authorize(['STORE_OWNER']), getOwnerDashboard);

export default router;
