const COOKIE_OPTIONS = {
  httpOnly: true,
  // domain: process.env.COOKIE_DOMAIN,
  // Since localhost is not having https protocol,
  secure: false,
  maxAge: 60 * 60 * 24 * 7 * 1000,
};

const AUTH_COOKIE = 'es_tkn';

module.exports = {
  COOKIE_OPTIONS,
  AUTH_COOKIE,
};
