import { Router } from 'express';
import { authGuard } from '../middlewares/authMiddleware.js';

const router = Router();

router.use(authGuard);

router.get('/', (req, res) => res.status(501).json({ message: 'Not implemented' }));

export default router;
