const express = require('express');
const { authGuard } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(authGuard);

// Placeholder routes; to be implemented with controller logic
router.get('/', (req, res) => res.status(501).json({ message: 'Not implemented' }));

module.exports = router;
