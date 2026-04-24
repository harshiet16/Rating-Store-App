import { Router } from 'express';
import { submitRating, updateRating } from '../controllers/rating.controller';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { RatingSchema } from '../utils/validators';

const router = Router();

// Only NORMAL USER can submit or update ratings
router.use(authenticate, authorize(['USER']));

router.post('/', validate(RatingSchema), submitRating);
router.put('/:storeId', validate(RatingSchema), updateRating);

export default router;
