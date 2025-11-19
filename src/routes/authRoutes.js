import { Router } from 'express';
import { registerUser, loginUser, getProfile } from '../controllers/authController.js';
import { authGuard } from '../middlewares/authMiddleware.js';

const router = Router();

router.post('/register', async (req, res, next) => {
  try {
    const body = req.body;
    const response = await registerUser({ body });
    return res.json(response);
  } catch (err) {
    return next(err);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const body = req.body;
    const response = await loginUser({ body });
    return res.json(response);
  } catch (err) {
    return next(err);
  }
});

router.get('/me', authGuard, async (req, res, next) => {
  try {
    const user = req.user;
    const response = await getProfile({ user });
    return res.json(response);
  } catch (err) {
    return next(err);
  }
});

export default router;
