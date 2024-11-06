const Joi = require('joi');

const addList = {
  body: Joi.object({
    name: Joi.string().trim().required(),
  }),
};

const updateList = {
  params: Joi.object({
    id: Joi.string().hex().length(24).required(),
  }),
  body: Joi.object({
    name: Joi.string().trim().required(),
  }),
};

const deleteList = {
  params: Joi.object({
    id: Joi.string().hex().length(24).required(),
  }),
};

const getListItems = {
  params: Joi.object({
    id: Joi.string().hex().length(24).required(),
  }),
};

const addListItem = {
  params: Joi.object({
    id: Joi.string().hex().length(24).required(),
  }),
  body: Joi.object({
    title: Joi.string().trim().required(),
    detail: Joi.string().allow('').optional(),
  }),
};

const updateListItem = {
  params: Joi.object({
    id: Joi.string().hex().length(24).required(),
    itemId: Joi.string().hex().length(24).required(),
  }),
  body: Joi.object({
    title: Joi.string().trim().optional(),
    detail: Joi.string().allow('').optional(),
    completed: Joi.boolean().optional(),
  }),
};

const deleteListItem = {
  params: Joi.object({
    id: Joi.string().hex().length(24).required(),
    itemId: Joi.string().hex().length(24).required(),
  }),
};

module.exports = {
  addList,
  updateList,
  deleteList,
  getListItems,
  addListItem,
  updateListItem,
  deleteListItem,
};
