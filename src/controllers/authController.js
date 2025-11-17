const User = require('../models/User');
const logger = require('../config/logger');
const { signToken } = require('../utils/jwt');

function buildSafeUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

exports.registerUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const user = await User.create({ name, email, password, role });

    const token = signToken(user);

    return res.status(201).json({
      token,
      user: buildSafeUser(user),
    });
  } catch (err) {
    logger.error('registerUser error: %s', err.message);
    return next(err);
  }
};

exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = signToken(user);

    return res.json({
      token,
      user: buildSafeUser(user),
    });
  } catch (err) {
    logger.error('loginUser error: %s', err.message);
    return next(err);
  }
};

exports.getProfile = async (req, res) => {
  return res.json({
    user: buildSafeUser(req.user),
  });
};
