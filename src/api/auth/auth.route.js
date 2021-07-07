const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const authValidation = require('./auth.validation');
const authController = require('./auth.controller');

//const upload = require('../../config/multer');
const router = express.Router();

/**
 * @swagger
 * definitions:
 *   login:
 *     required:
 *       - sEmail
 *       - sPassword
 *     properties:
 *       sEmail:
 *         type: string
 *         example: xyz@domain.com
 *       sPassword:
 *         type: string
 *         example: Test@123
 */

/**
 * @swagger
 *
 * /auth/login:
 *   post:
 *     tags:
 *       - "Auth"
 *     description: Login to the application
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: body
 *         description: Email and password for login.
 *         in: body
 *         required: true
 *         schema:
 *           $ref: "#/definitions/login"
 *     responses:
 *       200:
 *         description: You have successfully logged in!!
 */

router.post('/login', validate(authValidation.login),authController.login);
/**
 * @swagger
 * definitions:
 *   refresh-tokens:
 *     required:
 *       - refreshToken
 *     properties:
 *       refreshToken:
 *         type: string
 *         example: asdasdasd
 */

/**
 * @swagger
 *
 * /auth/refresh-tokens:
 *   post:
 *     tags:
 *       - "Auth"
 *     description: Token Refresh to the application
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: body
 *         description: Enter valid token.
 *         in: body
 *         required: true
 *         schema:
 *           $ref: "#/definitions/refresh-tokens"
 *     responses:
 *       200:
 *         description: Tokens are refreshed
 */
router.post('/refresh-tokens', validate(authValidation.refreshTokens), authController.refreshTokens);
/**
 * @swagger
 * definitions:
 *   register:
 *     required:
 *       - sFirstName
 *       - sLastName
 *       - sEmail
 *       - sPassword
 *       - sSignupStep
 *     properties:
 *       sFirstName:
 *         type: string
 *         example: John
 *       sLastName:
 *         type: string
 *         example: Well
 *       sEmail:
 *         type: string
 *         example: john@mailinator.com
 *       sPassword:
 *         type: string
 *         example: Test@123
 *       sSignupStep:
 *         type: string
 *         example: register
 */

/**
 * @swagger
 *
 * /auth/register:
 *   post:
 *     tags:
 *       - "Auth"
 *     description: Register to the application
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: body
 *         description: Register Form.
 *         in: body
 *         required: true
 *         schema:
 *           $ref: "#/definitions/register"
 *     responses:
 *       200:
 *         description: You have successfully create account!!
 */
router.post('/register',validate(authValidation.register), authController.register);
router.get('/GetUserdetails',auth(), authController.GetUserdetails);
/**
 * @swagger
 * definitions:
 *   forgot-password:
 *     required:
 *       - sEmail
 *     properties:
 *       sEmail:
 *         type: string
 *         example: xyz@domain.com
 */

/**
 * @swagger
 *
 * /auth/forgot-password:
 *   post:
 *     tags:
 *       - "Auth"
 *     description: forgot password to the application
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: body
 *         description: Email for forgot password.
 *         in: body
 *         required: true
 *         schema:
 *           $ref: "#/definitions/forgot-password"
 *     responses:
 *       200:
 *         description: You have successfully logged in!!
 */
router.post('/forgot-password',validate(authValidation.forgotPassword),authController.forgotPassword);

module.exports = router;
