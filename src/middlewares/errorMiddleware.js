const logger = require('../config/logger');
const { error } = require('../utils/response');

function errorMiddleware(err, req, res, next) {
  logger.error(err);

  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  return error(res, message, status);
}

module.exports = errorMiddleware;
