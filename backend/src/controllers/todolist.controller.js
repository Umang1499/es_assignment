const { StatusCodes } = require('http-status-codes');
const todoService = require('../services/todolist.service');
const ApiError = require('../utils/ApiError');

const getUserList = async (req, res, next) => {
  try {
    const result = await todoService.getListByUserId(req.user);

    if (result.error) {
      next(ApiError(result.status, result.message));
    } else {
      res.json({ success: true, data: result.data });
    }
  } catch (e) {
    next(ApiError(StatusCodes.INTERNAL_SERVER_ERROR, e.message));
  }
};

const addList = async (req, res, next) => {
  try {
    const result = await todoService.addList({ ...req.body, user: req.user });

    if (result.error) {
      next(ApiError(result.status, result.message));
    } else {
      res.json({ success: true, data: result.data });
    }
  } catch (e) {
    next(ApiError(StatusCodes.INTERNAL_SERVER_ERROR, e.message));
  }
};

const updateList = async (req, res, next) => {
  try {
    const result = await todoService.updateList({ ...req.body, ...req.params, user: req.user });

    if (result.error) {
      next(ApiError(result.status, result.message));
    } else {
      res.json({ success: true, data: result.data });
    }
  } catch (e) {
    next(ApiError(StatusCodes.INTERNAL_SERVER_ERROR, e.message));
  }
};

const deleteList = async (req, res, next) => {
  try {
    const result = await todoService.deleteList({ ...req.params, user: req.user });

    if (result.error) {
      next(ApiError(result.status, result.message));
    } else {
      res.json({ success: true, data: result.data });
    }
  } catch (e) {
    next(ApiError(StatusCodes.INTERNAL_SERVER_ERROR, e.message));
  }
};

const getListItems = async (req, res, next) => {
  try {
    const result = await todoService.getListItems(req.params);

    if (result.error) {
      next(ApiError(result.status, result.message));
    } else {
      res.json({ success: true, data: result.data });
    }
  } catch (e) {
    next(ApiError(StatusCodes.INTERNAL_SERVER_ERROR, e.message));
  }
};

const addListItem = async (req, res, next) => {
  try {
    const result = await todoService.addListItem({ ...req.params, ...req.body, user: req.user });

    if (result.error) {
      next(ApiError(result.status, result.message));
    } else {
      res.json({ success: true, data: result.data });
    }
  } catch (e) {
    next(ApiError(StatusCodes.INTERNAL_SERVER_ERROR, e.message));
  }
};

const updateListItem = async (req, res, next) => {
  try {
    const result = await todoService.updateListItem({ ...req.params, ...req.body, user: req.user });

    if (result.error) {
      next(ApiError(result.status, result.message));
    } else {
      res.json({ success: true, data: result.data });
    }
  } catch (e) {
    next(ApiError(StatusCodes.INTERNAL_SERVER_ERROR, e.message));
  }
};

const deleteListItem = async (req, res, next) => {
  try {
    const result = await todoService.deleteListItem({ ...req.params, user: req.user });

    if (result.error) {
      next(ApiError(result.status, result.message));
    } else {
      res.json({ success: true, data: result.data });
    }
  } catch (e) {
    next(ApiError(StatusCodes.INTERNAL_SERVER_ERROR, e.message));
  }
};

module.exports = {
  getUserList,
  addList,
  updateList,
  deleteList,
  getListItems,
  addListItem,
  updateListItem,
  deleteListItem,
};
