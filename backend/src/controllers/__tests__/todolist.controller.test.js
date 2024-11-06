/* eslint-disable one-var */
const { StatusCodes } = require('http-status-codes');
const todoController = require('../todolist.controller');
const todoService = require('../../services/todolist.service');
const ApiError = require('../../utils/ApiError');

jest.mock('../../services/todolist.service');
jest.mock('../../utils/ApiError');

describe('Todo List Controller', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {
      user: { id: 'userId' },
      body: {},
      params: {},
    };
    res = {
      json: jest.fn(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe('getUserList', () => {
    it('should return user lists on success', async () => {
      const mockResult = { error: false, data: ['list1', 'list2'] };
      todoService.getListByUserId.mockResolvedValue(mockResult);

      await todoController.getUserList(req, res, next);

      expect(res.json).toHaveBeenCalledWith({ success: true, data: mockResult.data });
    });

    it('should call next with ApiError on service error', async () => {
      const mockResult = { error: true, status: StatusCodes.BAD_REQUEST, message: 'Error message' };
      todoService.getListByUserId.mockResolvedValue(mockResult);

      await todoController.getUserList(req, res, next);
      expect(ApiError).toHaveBeenCalled();
    });

    it('should call next with ApiError on exception', async () => {
      const error = new Error('Test error');
      todoService.getListByUserId.mockRejectedValue(error);

      await todoController.getUserList(req, res, next);
      expect(ApiError).toHaveBeenCalled();
    });
  });

  describe('addList', () => {
    it('should add a new list on success', async () => {
      const mockResult = { error: false, data: { name: 'New List' } };
      todoService.addList.mockResolvedValue(mockResult);

      await todoController.addList(req, res, next);

      expect(res.json).toHaveBeenCalledWith({ success: true, data: mockResult.data });
    });

    it('should call next with ApiError on service error', async () => {
      const mockResult = { error: true, status: StatusCodes.BAD_REQUEST, message: 'Error message' };
      todoService.addList.mockResolvedValue(mockResult);

      await todoController.addList(req, res, next);
      expect(ApiError).toHaveBeenCalled();
    });

    it('should call next with ApiError on exception', async () => {
      const error = new Error('Test error');
      todoService.addList.mockRejectedValue(error);

      await todoController.addList(req, res, next);
      expect(ApiError).toHaveBeenCalled();
    });
  });

  describe('updateList', () => {
    it('should update a list on success', async () => {
      const mockResult = { error: false, data: { name: 'Updated List' } };
      todoService.updateList.mockResolvedValue(mockResult);

      await todoController.updateList(req, res, next);

      expect(res.json).toHaveBeenCalledWith({ success: true, data: mockResult.data });
    });

    it('should call next with ApiError on service error', async () => {
      const mockResult = { error: true, status: StatusCodes.BAD_REQUEST, message: 'Error message' };
      todoService.updateList.mockResolvedValue(mockResult);

      await todoController.updateList(req, res, next);
      expect(ApiError).toHaveBeenCalled();
    });

    it('should call next with ApiError on exception', async () => {
      const error = new Error('Test error');
      todoService.updateList.mockRejectedValue(error);

      await todoController.updateList(req, res, next);
      expect(ApiError).toHaveBeenCalled();
    });
  });

  describe('deleteList', () => {
    it('should delete a list on success', async () => {
      const mockResult = { error: false, data: { deleted: true } };
      todoService.deleteList.mockResolvedValue(mockResult);

      await todoController.deleteList(req, res, next);

      expect(res.json).toHaveBeenCalledWith({ success: true, data: mockResult.data });
    });

    it('should call next with ApiError on service error', async () => {
      const mockResult = { error: true, status: StatusCodes.BAD_REQUEST, message: 'Error message' };
      todoService.deleteList.mockResolvedValue(mockResult);

      await todoController.deleteList(req, res, next);
      expect(ApiError).toHaveBeenCalled();
    });

    it('should call next with ApiError on exception', async () => {
      const error = new Error('Test error');
      todoService.deleteList.mockRejectedValue(error);

      await todoController.deleteList(req, res, next);
      expect(ApiError).toHaveBeenCalled();
    });
  });

  describe('getListItems', () => {
    it('should return list items on success', async () => {
      const mockResult = { error: false, data: ['item1', 'item2'] };
      todoService.getListItems.mockResolvedValue(mockResult);

      await todoController.getListItems(req, res, next);

      expect(res.json).toHaveBeenCalledWith({ success: true, data: mockResult.data });
    });

    it('should call next with ApiError on service error', async () => {
      const mockResult = { error: true, status: StatusCodes.BAD_REQUEST, message: 'Error message' };
      todoService.getListItems.mockResolvedValue(mockResult);

      await todoController.getListItems(req, res, next);
      expect(ApiError).toHaveBeenCalled();
    });

    it('should call next with ApiError on exception', async () => {
      const error = new Error('Test error');
      todoService.getListItems.mockRejectedValue(error);

      await todoController.getListItems(req, res, next);
      expect(ApiError).toHaveBeenCalled();
    });
  });

  describe('addListItem', () => {
    it('should add a new list item on success', async () => {
      const mockResult = { error: false, data: { title: 'New Item' } };
      todoService.addListItem.mockResolvedValue(mockResult);

      await todoController.addListItem(req, res, next);

      expect(res.json).toHaveBeenCalledWith({ success: true, data: mockResult.data });
    });

    it('should call next with ApiError on service error', async () => {
      const mockResult = { error: true, status: StatusCodes.BAD_REQUEST, message: 'Error message' };
      todoService.addListItem.mockResolvedValue(mockResult);

      await todoController.addListItem(req, res, next);
      expect(ApiError).toHaveBeenCalled();
    });

    it('should call next with ApiError on exception', async () => {
      const error = new Error('Test error');
      todoService.addListItem.mockRejectedValue(error);

      await todoController.addListItem(req, res, next);
      expect(ApiError).toHaveBeenCalled();
    });
  });

  describe('updateListItem', () => {
    it('should update a list item on success', async () => {
      const mockResult = { error: false, data: { title: 'Updated Item' } };
      todoService.updateListItem.mockResolvedValue(mockResult);

      await todoController.updateListItem(req, res, next);

      expect(res.json).toHaveBeenCalledWith({ success: true, data: mockResult.data });
    });

    it('should call next with ApiError on service error', async () => {
      const mockResult = { error: true, status: StatusCodes.BAD_REQUEST, message: 'Error message' };
      todoService.updateListItem.mockResolvedValue(mockResult);

      await todoController.updateListItem(req, res, next);
      expect(ApiError).toHaveBeenCalled();
    });

    it('should call next with ApiError on exception', async () => {
      const error = new Error('Test error');
      todoService.updateListItem.mockRejectedValue(error);

      await todoController.updateListItem(req, res, next);
      expect(ApiError).toHaveBeenCalled();
    });
  });

  describe('deleteListItem', () => {
    it('should delete a list item on success', async () => {
      const mockResult = { error: false, data: { deleted: true } };
      todoService.deleteListItem.mockResolvedValue(mockResult);

      await todoController.deleteListItem(req, res, next);

      expect(res.json).toHaveBeenCalledWith({ success: true, data: mockResult.data });
    });

    it('should call next with ApiError on service error', async () => {
      const mockResult = { error: true, status: StatusCodes.BAD_REQUEST, message: 'Error message' };
      todoService.deleteListItem.mockResolvedValue(mockResult);

      await todoController.deleteListItem(req, res, next);
      expect(ApiError).toHaveBeenCalled();
    });

    it('should call next with ApiError on exception', async () => {
      const error = new Error('Test error');
      todoService.deleteListItem.mockRejectedValue(error);

      await todoController.deleteListItem(req, res, next);
      expect(ApiError).toHaveBeenCalled();
    });
  });
});
