const express = require('express');
const todoController = require('../controllers/todolist.controller');
const auth = require('../middlewares/auth.middleware');
const todolistValidation = require('../validations/todolist.validation');

const validate = require('../middlewares/validator.middleware');

const router = express.Router();

router.get('/', auth(), todoController.getUserList);
router.post('/', auth(), validate(todolistValidation.addList), todoController.addList);
router.post('/:id', auth(), validate(todolistValidation.updateList), todoController.updateList);
router.delete('/:id', auth(), validate(todolistValidation.deleteList), todoController.deleteList);
router.get(
  '/:id/items',
  auth(),
  validate(todolistValidation.getListItems),
  todoController.getListItems
);
router.post(
  '/:id/items',
  auth(),
  validate(todolistValidation.addListItem),
  todoController.addListItem
);
router.post(
  '/:id/items/:itemId',
  auth(),
  validate(todolistValidation.updateListItem),
  todoController.updateListItem
);
router.delete(
  '/:id/items/:itemId',
  auth(),
  validate(todolistValidation.deleteListItem),
  todoController.deleteListItem
);

module.exports = router;
