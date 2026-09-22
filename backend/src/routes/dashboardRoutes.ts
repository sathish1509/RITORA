import { Router, Request, Response, NextFunction } from 'express';
import { getDashboard } from '../controllers/insightController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

router.use(authenticateToken);

router.get('/', asyncHandler(getDashboard));

export default router;
