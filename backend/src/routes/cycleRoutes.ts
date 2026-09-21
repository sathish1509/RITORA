import { Router, Request, Response, NextFunction } from 'express';
import { getCycles, getCurrentCycle, createCycle, endCycle } from '../controllers/cycleController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

router.use(authenticateToken);

router.get('/', asyncHandler(getCycles));
router.get('/current', asyncHandler(getCurrentCycle));
router.post('/', asyncHandler(createCycle));
router.put('/:id/end', asyncHandler(endCycle));

export default router;
