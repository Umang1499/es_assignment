/* eslint-disable comma-dangle */
/* eslint-disable arrow-body-style */
/* eslint-disable implicit-arrow-linebreak */
const passport = require('passport');
const { StatusCodes, getReasonPhrase } = require('http-status-codes');
const ApiError = require('../utils/ApiError');

const verifyCallback = (req, resolve, reject) => async (err, user, info) => {
  if (err || info || !user) {
    return reject(ApiError(StatusCodes.UNAUTHORIZED, getReasonPhrase(StatusCodes.UNAUTHORIZED)));
  }
  req.user = user;
  return resolve();
};

const auth = () => {
  return async (req, res, next) =>
    new Promise((resolve, reject) => {
      passport.authenticate('jwt', { session: false }, verifyCallback(req, resolve, reject))(
        req,
        res,
        next
      );
    })
      .then(() => next())
      .catch((err) => next(err));
};

module.exports = auth;
