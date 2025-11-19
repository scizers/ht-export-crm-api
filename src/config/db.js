import mongoose from 'mongoose';
import logger from './logger.js';

const DEFAULT_RETRY_DELAY_MS = 5000;
const MAX_RETRIES = 5;

export const connectDB = async (retries = 0) => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    logger.error('MONGO_URI is not defined in environment variables');
    throw new Error('Missing MONGO_URI');
  }

  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    logger.info('MongoDB connected');
    return mongoose.connection;
  } catch (err) {
    logger.error('MongoDB connection error: %s', err.message);

    if (retries >= MAX_RETRIES) {
      logger.error('Max MongoDB connection retries exceeded');
      throw err;
    }

    const delay = DEFAULT_RETRY_DELAY_MS * (retries + 1);
    logger.info('Retrying MongoDB connection in %dms (attempt %d/%d)', delay, retries + 1, MAX_RETRIES);

    await new Promise((resolve) => setTimeout(resolve, delay));
    return connectDB(retries + 1);
  }
};

export default connectDB;
