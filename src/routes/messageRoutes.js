const express = require('express');
const multer = require('multer');
const { addMessage, getMessagesByLead } = require('../controllers/messageController');
const { authGuard } = require('../middlewares/authMiddleware');

const upload = multer({ dest: 'public/uploads/' });

const router = express.Router();

router.use(authGuard);

router.post('/', upload.array('attachments'), addMessage);
router.get('/lead/:leadId', getMessagesByLead);

module.exports = router;
