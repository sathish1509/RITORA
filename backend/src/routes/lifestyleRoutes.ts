import { Router, Request, Response, NextFunction } from 'express';
import { getLifestyle, getLifestyleByDate, upsertLifestyle } from '../controllers/lifestyleController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

router.use(authenticateToken);

router.get('/', asyncHandler(getLifestyle));
router.get('/by-date/:date', asyncHandler(getLifestyleByDate));
router.post('/', asyncHandler(upsertLifestyle));

export default router;
