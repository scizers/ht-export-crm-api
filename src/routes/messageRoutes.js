import { Router } from 'express';
import multer from 'multer';
import { addMessage, getMessagesByLead } from '../controllers/messageController.js';
import { authGuard } from '../middlewares/authMiddleware.js';

const upload = multer({ dest: 'public/uploads/' });

const router = Router();

router.use(authGuard);

router.post('/', upload.array('attachments'), async (req, res, next) => {
  try {
    const body = req.body;
    const files = req.files;
    const user = req.user;
    const response = await addMessage({ body, files, user });
    return res.json(response);
  } catch (err) {
    return next(err);
  }
});

router.get('/lead/:leadId', async (req, res, next) => {
  try {
    const params = req.params;
    const response = await getMessagesByLead({ params });
    return res.json(response);
  } catch (err) {
    return next(err);
  }
});

export default router;
