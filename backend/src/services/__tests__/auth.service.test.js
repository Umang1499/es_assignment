const bcrypt = require('bcryptjs');
const decode = require('jsonwebtoken/decode');
const { StatusCodes } = require('http-status-codes');
const { formatErrorMsg } = require('../../utils/CommonFuncs');
const { getToken } = require('../../utils/Token');
const { AUTH_COOKIE } = require('../../configs/constants');
const userModel = require('../../models/user.model');
const { loginUserWithEmailAndPassword, validateLoggedInUser } = require('../auth.service');

jest.mock('bcryptjs');
jest.mock('jsonwebtoken/decode');
jest.mock('../../utils/CommonFuncs');
jest.mock('../../utils/Token');
jest.mock('../../models/user.model');

describe('Auth Service Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('loginUserWithEmailAndPassword', () => {
    it('should return token for valid credentials', async () => {
      const data = { email: 'test@example.com', password: 'password123' };
      const mockUser = {
        id: '123',
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashedPassword',
      };
      const mockToken = 'mockToken';

      userModel.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);
      getToken.mockReturnValue(mockToken);

      const result = await loginUserWithEmailAndPassword(data);

      expect(result.error).toBe(false);
      expect(result.data).toBe(mockToken);
    });

    it('should return error for invalid password', async () => {
      const data = { email: 'test@example.com', password: 'wrongPassword' };
      const mockUser = {
        id: '123',
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashedPassword',
      };

      userModel.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(false);

      const result = await loginUserWithEmailAndPassword(data);

      expect(result.error).toBe(true);
      expect(result.status).toBe(StatusCodes.UNAUTHORIZED);
      expect(result.message).toBe('The provided value for the password is invalid');
    });

    it('should return error for non-existent email', async () => {
      const data = { email: 'nonexistent@example.com', password: 'password123' };

      userModel.findOne.mockResolvedValue(null);

      const result = await loginUserWithEmailAndPassword(data);

      expect(result.error).toBe(true);
      expect(result.status).toBe(StatusCodes.UNAUTHORIZED);
      expect(result.message).toBe('The provided value for the password or email is invalid.');
    });

    it('should handle internal server error', async () => {
      const data = { email: 'test@example.com', password: 'password123' };
      const error = new Error('Database error');
      userModel.findOne.mockRejectedValue(error);
      formatErrorMsg.mockReturnValue('Database error');

      const result = await loginUserWithEmailAndPassword(data);

      expect(result.error).toBe(true);
      expect(result.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(result.message).toBe('Database error');
    });
  });

  describe('validateLoggedInUser', () => {
    it('should return user details for valid token', async () => {
      const req = { cookies: { [AUTH_COOKIE]: 'validToken' } };
      const decodedValues = { id: '123' };
      const mockUser = { id: '123', name: 'Test User', email: 'test@example.com' };

      decode.mockReturnValue(decodedValues);
      userModel.findById.mockResolvedValue(mockUser);

      const result = await validateLoggedInUser(req);

      expect(result.error).toBe(false);
      expect(result.data).toEqual(mockUser);
    });

    it('should return error for invalid token', async () => {
      const req = { cookies: { [AUTH_COOKIE]: 'invalidToken' } };
      decode.mockReturnValue(null);

      const result = await validateLoggedInUser(req);

      expect(result.error).toBe(true);
      expect(result.status).toBe(StatusCodes.BAD_REQUEST);
      expect(result.message).toBe('User unauthorized.');
    });

    it('should return error for non-existent user', async () => {
      const req = { cookies: { [AUTH_COOKIE]: 'validToken' } };
      const decodedValues = { id: 'nonExistentId' };

      decode.mockReturnValue(decodedValues);
      userModel.findById.mockResolvedValue(null);

      const result = await validateLoggedInUser(req);

      expect(result.error).toBe(true);
      expect(result.status).toBe(StatusCodes.BAD_REQUEST);
      expect(result.message).toBe('User unauthorized.');
    });

    it('should handle internal server error', async () => {
      const req = { cookies: { [AUTH_COOKIE]: 'validToken' } };
      const decodedValues = { id: '123' };
      const error = new Error('Database error');

      decode.mockReturnValue(decodedValues);
      userModel.findById.mockRejectedValue(error);
      formatErrorMsg.mockReturnValue('Database error');

      const result = await validateLoggedInUser(req);

      expect(result.error).toBe(true);
      expect(result.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(result.message).toBe('Database error');
    });
  });
});
