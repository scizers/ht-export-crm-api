const express = require('express');
const { registerUser, loginUser, getProfile } = require('../controllers/authController');
const { authGuard } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', authGuard, getProfile);

module.exports = router;
