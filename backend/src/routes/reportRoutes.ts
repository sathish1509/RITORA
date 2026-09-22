import { Router, Request, Response, NextFunction } from 'express';
import { getReports, generateReport } from '../controllers/reportController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

router.use(authenticateToken);

router.get('/', asyncHandler(getReports));
router.post('/generate', asyncHandler(generateReport));

export default router;
