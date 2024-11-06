const { StatusCodes } = require('http-status-codes');
const errorHandler = require('../error.middleware');

describe('Error Handler Middleware', () => {
  let req;
  let res;
  let next;
  let err;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
  });

  test('should return correct status and message when error has a message and status', () => {
    err = new Error('Custom error message');
    err.status = StatusCodes.BAD_REQUEST;

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
    expect(res.json).toHaveBeenCalledWith({
      error: true,
      message: 'Custom error message',
    });
  });

  test('should return default message when error has no custom message', () => {
    err = new Error();
    err.status = StatusCodes.NOT_FOUND;

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
    expect(res.json).toHaveBeenCalledWith({
      error: true,
      message: 'Internal Server Error',
    });
  });

  test('should return internal server error when error has no status', () => {
    err = new Error('Internal Server Error');

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(res.json).toHaveBeenCalledWith({
      error: true,
      message: 'Internal Server Error',
    });
  });

  test('should return internal server error when error has no status or message', () => {
    err = new Error();

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(res.json).toHaveBeenCalledWith({
      error: true,
      message: 'Internal Server Error',
    });
  });
});
