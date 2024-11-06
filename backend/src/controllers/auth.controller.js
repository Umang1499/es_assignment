const { StatusCodes } = require('http-status-codes');
const { AUTH_COOKIE, COOKIE_OPTIONS } = require('../configs/constants');
const authService = require('../services/auth.service');
const ApiError = require('../utils/ApiError');

const login = async (req, res, next) => {
  try {
    const result = await authService.loginUserWithEmailAndPassword(req.body);

    if (result.error) {
      next(ApiError(result.status, result.message));
    } else {
      res.cookie(AUTH_COOKIE, result.data, COOKIE_OPTIONS);
      res.json({ success: true, data: result.data });
    }
  } catch (e) {
    next(ApiError(StatusCodes.INTERNAL_SERVER_ERROR, e.message));
  }
};

const validateLoggedInUser = async (req, res, next) => {
  try {
    const result = await authService.validateLoggedInUser(req);

    if (result.error) {
      next(ApiError(result.status, result.message));
    } else {
      res.json({ success: true, data: result.data });
    }
  } catch (e) {
    next(ApiError(StatusCodes.INTERNAL_SERVER_ERROR, e.message));
  }
};

const logout = async (req, res, next) => {
  try {
    res.cookie(AUTH_COOKIE, '', { ...COOKIE_OPTIONS, maxAge: 0 });
    res.json({ success: true });
  } catch (e) {
    next(ApiError(StatusCodes.INTERNAL_SERVER_ERROR, e.message));
  }
};

module.exports = {
  login,
  validateLoggedInUser,
  logout,
};
