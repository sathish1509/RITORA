import { Router, Request, Response, NextFunction } from 'express';
import { getMessages, chat } from '../controllers/assistantController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

router.use(authenticateToken);

router.get('/messages', asyncHandler(getMessages));
router.post('/chat', asyncHandler(chat));

export default router;
