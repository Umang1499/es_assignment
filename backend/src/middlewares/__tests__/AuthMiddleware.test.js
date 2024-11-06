const passport = require('passport');
const ApiError = require('../../utils/ApiError');
const auth = require('../auth.middleware');

jest.mock('passport', () => ({
  authenticate: jest.fn(),
}));

jest.mock('../../utils/ApiError');

describe('auth middleware', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {};
    res = {};
    next = jest.fn();
    ApiError.mockClear();
  });

  test('should call next if user is authenticated and has required rights', async () => {
    passport.authenticate.mockImplementation((strategy, options, callback) => () => {
      callback(null, { id: 'user123' });
    });

    const middleware = auth('admin');
    await middleware(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.user).toEqual({ id: 'user123' });
  });

  test('should return unauthorized error if no user is found', async () => {
    passport.authenticate.mockImplementation((strategy, options, callback) => () => {
      callback(null, false, { message: 'Unauthorized' });
    });

    const middleware = auth('admin');
    await middleware(req, res, next);
    expect(ApiError).toHaveBeenCalled();
  });
});
