const { StatusCodes } = require('http-status-codes');
const { ObjectId } = require('mongoose').Types;
const { formatErrorMsg } = require('../utils/CommonFuncs');
const todolistModel = require('../models/todolist.model');
const todolistItemModel = require('../models/todolistItem.model');

const getListByUserId = async (user) => {
  const result = {
    error: false,
    data: {},
  };
  try {
    if (user) {
      const lists = await todolistModel.find({ userId: ObjectId.createFromHexString(user.id) });

      result.data = lists;
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

const addList = async (data) => {
  const result = {
    error: false,
    data: {},
  };
  try {
    const response = await todolistModel.create({
      userId: ObjectId.createFromHexString(data.user.id),
      name: data.name,
    });
    const dt = await response.save();
    result.data = dt;
  } catch (error) {
    result.error = true;
    result.status = StatusCodes.INTERNAL_SERVER_ERROR;
    result.message = formatErrorMsg(error);
  }
  return result;
};

const updateList = async (data) => {
  const result = {
    error: false,
    data: {},
  };
  try {
    const list = await todolistModel.findById(data.id);
    // check if the list exists and belongs to user
    if (list && list.userId.toString() === data.user.id) {
      const response = await todolistModel.updateOne(
        { _id: ObjectId.createFromHexString(data.id) },
        { name: data.name }
      );
      result.data = response;
    } else {
      result.error = true;
      result.status = StatusCodes.BAD_REQUEST;
      result.message = 'Something went wrong while updating the list.';
    }
  } catch (error) {
    result.error = true;
    result.status = StatusCodes.INTERNAL_SERVER_ERROR;
    result.message = formatErrorMsg(error);
  }
  return result;
};

const deleteList = async (data) => {
  const result = {
    error: false,
    data: {},
  };
  try {
    const list = await todolistModel.findById(data.id);
    // check if the list exists and belongs to user
    if (list && list.userId.toString() === data.user.id) {
      const response = await todolistModel.deleteOne({
        _id: ObjectId.createFromHexString(data.id),
      });
      await todolistItemModel.deleteMany({
        listId: ObjectId.createFromHexString(data.id),
      });
      result.data = response.deletedCount;
    } else {
      result.error = true;
      result.status = StatusCodes.BAD_REQUEST;
      result.message = 'Something went wrong while deleting the list and its items.';
    }
  } catch (error) {
    result.error = true;
    result.status = StatusCodes.INTERNAL_SERVER_ERROR;
    result.message = formatErrorMsg(error);
  }
  return result;
};

const getListItems = async (data) => {
  const result = {
    error: false,
    data: {},
  };
  try {
    // todo
    if (data.id) {
      const listItems = await todolistItemModel.find({
        listId: ObjectId.createFromHexString(data.id),
      });

      result.data = listItems;
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

const addListItem = async (data) => {
  const result = {
    error: false,
    data: {},
  };
  try {
    const response = await todolistItemModel.create({
      listId: ObjectId.createFromHexString(data.id),
      userId: ObjectId.createFromHexString(data.user.id),
      title: data.title,
      detail: data.detail,
    });
    const dt = await response.save();
    result.data = dt;
  } catch (error) {
    result.error = true;
    result.status = StatusCodes.INTERNAL_SERVER_ERROR;
    result.message = formatErrorMsg(error);
  }
  return result;
};

const updateListItem = async (data) => {
  const result = {
    error: false,
    data: {},
  };
  try {
    // check if the listitem exists and belongs to user
    const listItem = await todolistItemModel.findById(data.itemId);

    if (listItem && listItem.userId.toString() === data.user.id) {
      const updateFields = {};

      if (data.title) updateFields.title = data.title;
      if (data.detail) updateFields.detail = data.detail;
      if (typeof data.completed === 'boolean') updateFields.completed = data.completed;

      const fq = await todolistItemModel.updateOne(
        {
          _id: ObjectId.createFromHexString(data.itemId),
        },
        { $set: updateFields }
      );

      result.data = fq.modifiedCount;
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

const deleteListItem = async (data) => {
  const result = {
    error: false,
    data: {},
  };
  try {
    // check if the list belongs to user
    const listItem = await todolistItemModel.findById(data.itemId);

    if (listItem && listItem.userId.toString() === data.user.id) {
      const response = await todolistItemModel.deleteOne({
        _id: ObjectId.createFromHexString(data.itemId),
      });
      result.data = response.deletedCount;
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
  getListByUserId,
  addList,
  updateList,
  deleteList,
  getListItems,
  addListItem,
  updateListItem,
  deleteListItem,
};
