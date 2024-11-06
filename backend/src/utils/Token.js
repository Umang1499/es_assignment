const { Strategy: JwtStrategy } = require('passport-jwt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { AUTH_COOKIE } = require('../configs/constants');
const userModel = require('../models/user.model');

// Initialize environment config
dotenv.config();

const jwtOptions = {
  secretOrKey: process.env.JWT_SECRET,
  jwtFromRequest: (req) => {
    let token = '';
    if (req && req.cookies) {
      token = req.cookies[AUTH_COOKIE];
    }
    return token;
  },
};

// eslint-disable-next-line arrow-body-style
const getToken = (enCodedContent) => {
  return jwt.sign(enCodedContent, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY,
  });
};

const jwtVerify = async (payload, done) => {
  try {
    const user = await userModel.findById(payload.id);
    if (!user) {
      return done(null, false);
    }
    const userDetails = {
      id: user.id,
      name: user.name,
      email: user.email,
    };

    return done(null, userDetails);
  } catch (error) {
    return done(error, false);
  }
};

const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);

module.exports = { getToken, jwtStrategy };
