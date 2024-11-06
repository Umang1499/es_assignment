const { StatusCodes, getReasonPhrase } = require('http-status-codes');

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, _) => {
  const output = {
    error: true,
    message: err.message || getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
  };
  const httpStatusCode = err.status || StatusCodes.INTERNAL_SERVER_ERROR;

  return res.status(httpStatusCode).json(output);
};

module.exports = errorHandler;
