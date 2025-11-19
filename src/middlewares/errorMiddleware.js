import logger from '../config/logger.js';
import { error } from '../utils/response.js';

const errorMiddleware = (err, req, res, next) => {
  logger.error(err);

  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  return error(res, message, status);
};

export default errorMiddleware;
