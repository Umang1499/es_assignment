const bcrypt = require('bcryptjs');
const decode = require('jsonwebtoken/decode');
const { StatusCodes } = require('http-status-codes');
const { formatErrorMsg } = require('../utils/CommonFuncs');
const { getToken } = require('../utils/Token');
const { AUTH_COOKIE } = require('../configs/constants');
const userModel = require('../models/user.model');

const loginUserWithEmailAndPassword = async (data) => {
  const result = {
    error: false,
    data: {},
  };
  try {
    const user = await userModel.findOne({ email: data.email });

    if (user) {
      const isPasswordMatch = await bcrypt.compare(data.password, user.password);
      if (isPasswordMatch) {
        const userDetails = {
          id: user.id,
          name: user.name,
          email: user.email,
        };

        // Sign user detail and store in cookie
        result.data = getToken(userDetails);
      } else {
        result.error = true;
        result.status = StatusCodes.UNAUTHORIZED;
        result.message = 'The provided value for the password is invalid';
      }
    } else {
      result.error = true;
      result.status = StatusCodes.UNAUTHORIZED;
      result.message = 'The provided value for the password or email is invalid.';
    }
  } catch (error) {
    result.error = true;
    result.status = StatusCodes.INTERNAL_SERVER_ERROR;
    result.message = formatErrorMsg(error);
  }
  return result;
};

const validateLoggedInUser = async (req) => {
  const result = {
    error: false,
    data: {},
  };
  try {
    if (req.cookies[AUTH_COOKIE]) {
      const decodedValues = decode(req.cookies[AUTH_COOKIE]);

      if (!decodedValues) {
        result.error = true;
        result.status = StatusCodes.BAD_REQUEST;
        result.message = 'User unauthorized.';
      } else {
        const userDetails = await userModel.findById(decodedValues.id);
        if (userDetails) {
          result.data = userDetails;
        } else {
          result.error = true;
          result.status = StatusCodes.BAD_REQUEST;
          result.message = 'User unauthorized.';
        }
      }
    } else {
      result.error = true;
      result.status = StatusCodes.BAD_REQUEST;
      result.message = 'User unauthorized.';
    }
  } catch (error) {
    result.error = true;
    result.status = StatusCodes.INTERNAL_SERVER_ERROR;
    result.message = formatErrorMsg(error);
  }
  return result;
};

module.exports = {
  loginUserWithEmailAndPassword,
  validateLoggedInUser,
};
