import { Router } from 'express';
import {
  createFollowUp,
  getFollowUpsByLead,
  markDone,
  updateFollowUp,
} from '../controllers/followupController.js';
import { authGuard } from '../middlewares/authMiddleware.js';

const router = Router();

router.use(authGuard);

router.post('/', async (req, res, next) => {
  try {
    const body = req.body;
    const user = req.user;
    const response = await createFollowUp({ body, user });
    return res.json(response);
  } catch (err) {
    return next(err);
  }
});

router.get('/lead/:leadId', async (req, res, next) => {
  try {
    const params = req.params;
    const response = await getFollowUpsByLead({ params });
    return res.json(response);
  } catch (err) {
    return next(err);
  }
});

router.patch('/:id/done', async (req, res, next) => {
  try {
    const params = req.params;
    const response = await markDone({ params });
    return res.json(response);
  } catch (err) {
    return next(err);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const params = req.params;
    const body = req.body;
    const response = await updateFollowUp({ params, body });
    return res.json(response);
  } catch (err) {
    return next(err);
  }
});

export default router;
