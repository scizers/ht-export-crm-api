const express = require('express');
const {
  createLead,
  getLeads,
  getLeadById,
  updateLead,
  deleteLead,
  getCalendar,
} = require('../controllers/leadController');
const { authGuard } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(authGuard);

router.post('/', createLead);
router.get('/', getLeads);
router.get('/calendar', getCalendar);
router.get('/:id', getLeadById);
router.put('/:id', updateLead);
router.delete('/:id', deleteLead);

module.exports = router;
