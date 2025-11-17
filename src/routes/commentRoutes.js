const express = require('express');
const multer = require('multer');
const { addComment, getCommentsByLead } = require('../controllers/commentController');
const { authGuard } = require('../middlewares/authMiddleware');

const upload = multer({ dest: 'public/uploads/screenshots/' });

const router = express.Router();

router.use(authGuard);

router.post('/', upload.single('screenshot'), addComment);
router.get('/lead/:leadId', getCommentsByLead);

module.exports = router;
