import { Router, Request, Response, NextFunction } from 'express';
import { getSymptoms, getSymptomsByDate, createSymptom, deleteSymptom } from '../controllers/symptomController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

router.use(authenticateToken);

router.get('/', asyncHandler(getSymptoms));
router.get('/by-date/:date', asyncHandler(getSymptomsByDate));
router.post('/', asyncHandler(createSymptom));
router.delete('/:id', asyncHandler(deleteSymptom));

export default router;
