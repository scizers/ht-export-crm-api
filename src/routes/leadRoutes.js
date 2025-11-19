import { Router } from 'express';
import {
  createLead,
  getLeads,
  getLeadById,
  updateLead,
  deleteLead,
  getCalendar,
} from '../controllers/leadController.js';
import { authGuard } from '../middlewares/authMiddleware.js';

const router = Router();

router.use(authGuard);

router.post('/', async (req, res, next) => {
  try {
    const body = req.body;
    const user = req.user;
    const response = await createLead({ body, user });
    return res.json(response);
  } catch (err) {
    return next(err);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const response = await getLeads({});
    return res.json(response);
  } catch (err) {
    return next(err);
  }
});

router.get('/calendar', async (req, res, next) => {
  try {
    const query = req.query;
    const response = await getCalendar({ query });
    return res.json(response);
  } catch (err) {
    return next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const params = req.params;
    const response = await getLeadById({ params });
    return res.json(response);
  } catch (err) {
    return next(err);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const params = req.params;
    const body = req.body;
    const response = await updateLead({ params, body });
    return res.json(response);
  } catch (err) {
    return next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const params = req.params;
    const response = await deleteLead({ params });
    return res.json(response);
  } catch (err) {
    return next(err);
  }
});

export default router;
