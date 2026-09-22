import { Router, Request, Response, NextFunction } from 'express';
import { getInsights, getRisks, getPredictions } from '../controllers/insightController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

router.use(authenticateToken);

router.get('/', asyncHandler(getInsights));
router.get('/risks', asyncHandler(getRisks));
router.get('/predictions', asyncHandler(getPredictions));

export default router;
