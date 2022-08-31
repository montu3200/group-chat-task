const express = require('express');
const validate = require('../../middlewares/validate');
const authValidation = require('./auth.validation');
const authController = require('./auth.controller');
const router = express.Router();

router.post('/register', validate(authValidation.register), authController.register);
router.post('/createGroup', authController.createGroup);
router.post('/sendMessage',validate(authValidation.sendMessage), authController.sendMessage);
router.get('/groupList/:userId', authController.groupList);
module.exports = router;
