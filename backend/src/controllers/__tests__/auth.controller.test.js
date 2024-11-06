const { StatusCodes } = require('http-status-codes');
const { login, validateLoggedInUser, logout } = require('../auth.controller');
const authService = require('../../services/auth.service');
const ApiError = require('../../utils/ApiError');

jest.mock('../../services/auth.service');
jest.mock('../../utils/ApiError');

describe('Auth Controller', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {
      body: {
        email: 'test@example.com',
        password: 'password',
      },
    };
    res = {
      cookie: jest.fn(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should login the user and set the cookie when login is successful', async () => {
      const result = { error: false, data: 'es_tkn' };
      authService.loginUserWithEmailAndPassword.mockResolvedValue(result);

      await login(req, res, next);

      expect(authService.loginUserWithEmailAndPassword).toHaveBeenCalledWith(req.body);
      expect(res.cookie).toHaveBeenCalledWith('es_tkn', 'es_tkn', {
        httpOnly: true,
        secure: false,
        maxAge: 604800000,
      });
      expect(res.json).toHaveBeenCalledWith({ success: true, data: 'es_tkn' });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return an error if login fails', async () => {
      const result = {
        error: true,
        status: StatusCodes.BAD_REQUEST,
        message: 'Invalid credentials',
      };
      authService.loginUserWithEmailAndPassword.mockResolvedValue(result);

      await login(req, res, next);
      expect(ApiError).toHaveBeenCalled();
    });

    it('should handle unexpected errors gracefully', async () => {
      const error = new Error('Unexpected error');
      authService.loginUserWithEmailAndPassword.mockRejectedValue(error);

      await login(req, res, next);
      expect(ApiError).toHaveBeenCalled();
    });
  });

  describe('validateLoggedInUser', () => {
    it('should return the user data if validation is successful', async () => {
      const result = { error: false, data: { userId: '12345', email: 'test@example.com' } };
      authService.validateLoggedInUser.mockResolvedValue(result);

      await validateLoggedInUser(req, res, next);

      expect(authService.validateLoggedInUser).toHaveBeenCalledWith(req);
      expect(res.json).toHaveBeenCalledWith({ success: true, data: result.data });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return an error if the user is not logged in', async () => {
      const result = { error: true, status: StatusCodes.UNAUTHORIZED, message: 'Not logged in' };
      authService.validateLoggedInUser.mockResolvedValue(result);

      await validateLoggedInUser(req, res, next);
      expect(ApiError).toHaveBeenCalled();
    });

    it('should handle unexpected errors gracefully', async () => {
      const error = new Error('Unexpected error');
      authService.validateLoggedInUser.mockRejectedValue(error);

      await validateLoggedInUser(req, res, next);
      expect(ApiError).toHaveBeenCalled();
    });
  });

  describe('logout', () => {
    it('should clear the cookie and return a success response', async () => {
      await logout(req, res, next);

      expect(res.cookie).toHaveBeenCalledWith('es_tkn', '', {
        httpOnly: true,
        secure: false,
        maxAge: 0,
      });
      expect(res.json).toHaveBeenCalledWith({ success: true });
      expect(next).not.toHaveBeenCalled();
    });

    it('should handle unexpected errors gracefully', async () => {
      const error = new Error('Unexpected error');
      jest.spyOn(res, 'cookie').mockImplementation(() => {
        throw error;
      });

      await logout(req, res, next);
      expect(ApiError).toHaveBeenCalled();
    });
  });
});
