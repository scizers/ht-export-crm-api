import User from '../models/User.js';
import logger from '../config/logger.js';
import { signToken } from '../utils/jwt.js';
import { successObj, errorObj } from '../utils/response.js';

function buildSafeUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

export const registerUser = async ({ body }) => {
  try {
    const { name, email, password, role } = body;

    if (!name || !email || !password) {
      return {
        ...errorObj,
        status: 400,
        message: 'Name, email and password are required',
      };
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return {
        ...errorObj,
        status: 409,
        message: 'User already exists',
      };
    }

    const user = await User.create({ name, email, password, role });

    const token = signToken(user);

    return {
      ...successObj,
      status: 201,
      token,
      user: buildSafeUser(user),
    };
  } catch (err) {
    logger.error('registerUser error: %s', err.message);
    return {
      ...errorObj,
      status: 500,
      message: 'Unable to register user',
    };
  }
};

export const loginUser = async ({ body }) => {
  try {
    const { email, password } = body;

    if (!email || !password) {
      return {
        ...errorObj,
        status: 400,
        message: 'Email and password are required',
      };
    }

    const user = await User.findOne({ email });
    if (!user) {
      return {
        ...errorObj,
        status: 401,
        message: 'Invalid credentials',
      };
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return {
        ...errorObj,
        status: 401,
        message: 'Invalid credentials',
      };
    }

    const token = signToken(user);

    return {
      ...successObj,
      token,
      user: buildSafeUser(user),
    };
  } catch (err) {
    logger.error('loginUser error: %s', err.message);
    return {
      ...errorObj,
      status: 500,
      message: 'Unable to login',
    };
  }
};

export const getProfile = async ({ user }) => ({
  ...successObj,
  user: buildSafeUser(user),
});
