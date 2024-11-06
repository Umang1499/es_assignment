const express = require('express');
const authController = require('../controllers/auth.controller');
const validate = require('../middlewares/validator.middleware');
const AuthValidation = require('../validations/auth.validation');

const router = express.Router();

router.post('/login', validate(AuthValidation.login), authController.login);
router.get('/validate-user', authController.validateLoggedInUser);
router.get('/logout', authController.logout);

module.exports = router;
