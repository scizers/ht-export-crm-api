import {Router} from 'express';
import multer from 'multer';
import {addComment, getCommentsByLead} from '../controllers/commentController.js';
import {authGuard} from '../middlewares/authMiddleware.js';
import {handleMediaUpload} from "../utils/response.js";

const upload = multer({dest: 'public/uploads/screenshots/'});

const router = Router();

router.use(authGuard);

router.post('/', upload.single('screenshot'), async (req, res, next) => {
    try {
        let body = req.body;
        const file = req.file;
        const user = req.user;
        body = await handleMediaUpload({...body, folderName: "uploads/screenshots"})

        const response = await addComment({body, file, user});
        return res.json(response);
    } catch (err) {
        return next(err);
    }
});

router.get('/lead/:leadId', async (req, res, next) => {
    try {
        const params = req.params;
        const response = await getCommentsByLead({params});
        return res.json(response);
    } catch (err) {
        return next(err);
    }
});

export default router;
