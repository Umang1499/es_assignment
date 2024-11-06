const { StatusCodes } = require('http-status-codes');
const todolistService = require('../todolist.service');
const todolistModel = require('../../models/todolist.model');
const todolistItemModel = require('../../models/todolistItem.model');

jest.mock('../../models/todolist.model');
jest.mock('../../models/todolistItem.model');
jest.mock('mongoose', () => ({
  ...jest.requireActual('mongoose'),
  Types: {
    ObjectId: {
      createFromHexString: jest.fn((id) => id),
    },
  },
}));

describe('Todo List Service', () => {
  const mockUser = { id: '123456789012345678901234' };
  const mockList = { _id: 'listId', userId: mockUser.id, name: 'Test List' };
  const mockListItem = {
    _id: 'itemId',
    listId: mockList._id,
    userId: mockUser.id,
    title: 'Test Item',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getListByUserId', () => {
    it('should return lists for a valid user', async () => {
      todolistModel.find.mockResolvedValue([mockList]);
      const result = await todolistService.getListByUserId(mockUser);
      expect(result.error).toBe(false);
      expect(result.data).toEqual([mockList]);
    });

    it('should return error for invalid user', async () => {
      const result = await todolistService.getListByUserId(null);
      expect(result.error).toBe(true);
      expect(result.status).toBe(StatusCodes.BAD_REQUEST);
    });
  });

  describe('addList', () => {
    it('should add a new list', async () => {
      const mockSave = jest.fn().mockResolvedValue(mockList);
      todolistModel.create.mockReturnValue({ save: mockSave });
      const result = await todolistService.addList({ user: mockUser, name: 'Test List' });
      expect(result.error).toBe(false);
      expect(result.data).toEqual(mockList);
    });
  });

  describe('updateList', () => {
    it('should update an existing list', async () => {
      todolistModel.findById.mockResolvedValue(mockList);
      todolistModel.updateOne.mockResolvedValue({ modifiedCount: 1 });
      const result = await todolistService.updateList({
        id: 'listId',
        user: mockUser,
        name: 'Updated List',
      });
      expect(result.error).toBe(false);
      expect(result.data).toEqual({ modifiedCount: 1 });
    });

    it('should return error for non existing list', async () => {
      todolistModel.findById.mockResolvedValue(null);
      const result = await todolistService.updateList({
        id: 'nonExistentId',
        user: mockUser,
        name: 'Updated List',
      });
      expect(result.error).toBe(true);
      expect(result.status).toBe(StatusCodes.BAD_REQUEST);
    });
  });

  describe('deleteList', () => {
    it('should delete an existing list', async () => {
      todolistModel.findById.mockResolvedValue(mockList);
      todolistModel.deleteOne.mockResolvedValue({ deletedCount: 1 });
      todolistItemModel.deleteMany.mockResolvedValue({ deletedCount: 1 });
      const result = await todolistService.deleteList({ id: 'listId', user: mockUser });
      expect(result.error).toBe(false);
      expect(result.data).toBe(1);
    });

    it('should return error for non existing list', async () => {
      todolistModel.findById.mockResolvedValue(null);
      const result = await todolistService.deleteList({ id: 'nonExistentId', user: mockUser });
      expect(result.error).toBe(true);
      expect(result.status).toBe(StatusCodes.BAD_REQUEST);
    });
  });

  describe('getListItems', () => {
    it('should return list items for a valid list', async () => {
      todolistItemModel.find.mockResolvedValue([mockListItem]);
      const result = await todolistService.getListItems({ id: 'listId' });
      expect(result.error).toBe(false);
      expect(result.data).toEqual([mockListItem]);
    });

    it('should return error for invalid list', async () => {
      const result = await todolistService.getListItems({});
      expect(result.error).toBe(true);
      expect(result.status).toBe(StatusCodes.BAD_REQUEST);
    });
  });

  describe('addListItem', () => {
    it('should add a new list item', async () => {
      const mockSave = jest.fn().mockResolvedValue(mockListItem);
      todolistItemModel.create.mockReturnValue({ save: mockSave });
      const result = await todolistService.addListItem({
        id: 'listId',
        user: mockUser,
        title: 'Test Item',
        detail: 'Test Detail',
      });
      expect(result.error).toBe(false);
      expect(result.data).toEqual(mockListItem);
    });
  });

  describe('updateListItem', () => {
    it('should update an existing list item', async () => {
      todolistItemModel.findById.mockResolvedValue(mockListItem);
      todolistItemModel.updateOne.mockResolvedValue({ modifiedCount: 1 });
      const result = await todolistService.updateListItem({
        itemId: 'itemId',
        user: mockUser,
        title: 'Updated Item',
      });
      expect(result.error).toBe(false);
      expect(result.data).toBe(1);
    });

    it('should return error for non existing list item', async () => {
      todolistItemModel.findById.mockResolvedValue(null);
      const result = await todolistService.updateListItem({
        itemId: 'nonExistentId',
        user: mockUser,
        title: 'Updated Item',
      });
      expect(result.error).toBe(true);
      expect(result.status).toBe(StatusCodes.BAD_REQUEST);
    });
  });

  describe('deleteListItem', () => {
    it('should delete an existing list item', async () => {
      todolistItemModel.findById.mockResolvedValue(mockListItem);
      todolistItemModel.deleteOne.mockResolvedValue({ deletedCount: 1 });
      const result = await todolistService.deleteListItem({ itemId: 'itemId', user: mockUser });
      expect(result.error).toBe(false);
      expect(result.data).toBe(1);
    });

    it('should return error for non existing list item', async () => {
      todolistItemModel.findById.mockResolvedValue(null);
      const result = await todolistService.deleteListItem({
        itemId: 'nonExistentId',
        user: mockUser,
      });
      expect(result.error).toBe(true);
      expect(result.status).toBe(StatusCodes.BAD_REQUEST);
    });
  });
});
