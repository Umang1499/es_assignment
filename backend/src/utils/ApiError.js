const ApiError = (statusCode, e) => {
  let error = null;

  if (typeof e === 'string') {
    error = new Error(e);
  } else if (e.message) {
    error = new Error(e.message);
  } else {
    error = new Error(e.toString());
  }
  error.status = statusCode || null;

  return error;
};

module.exports = ApiError;
