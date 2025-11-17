const express = require('express');
const {
  createFollowUp,
  getFollowUpsByLead,
  markDone,
  updateFollowUp,
} = require('../controllers/followupController');
const { authGuard } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(authGuard);

router.post('/', createFollowUp);
router.get('/lead/:leadId', getFollowUpsByLead);
router.patch('/:id/done', markDone);
router.put('/:id', updateFollowUp);

module.exports = router;
