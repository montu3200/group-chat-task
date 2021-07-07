const Joi = require('@hapi/joi');
const { password } = require('../common/custom.validation');
const { ROLES, GENDER, USER_TYPE, SOCIALMEDIA_TYPE } = require('../../config/constant')
const register = {
  body: Joi.object().keys({
    sFirstName: Joi.string().required(),
    sLastName: Joi.string().required(),
    sEmail: Joi.string()
      .required()
      .email(),
    sPassword: Joi.string()
      .custom(password),
    sSignupStep: Joi.string(),
  }),
};
const login = {
  body: Joi.object().keys({
    sEmail: Joi.string().email().required().messages({
      'string.email': "Are you sure you entered the valid email address?",
      'string.empty': "Email address cannot be empty."
    }),
    sPassword: Joi.string().required().messages({
      'string.empty': "Password cannot be empty."
    })
  }),
};
const checkResetLink = {
  query: Joi.object().keys({
    token: Joi.string().required()
  })
}
const resetPassword = {
  query: Joi.object().keys({
    token: Joi.string().required()
  }),
  body: Joi.object().keys({
    password: Joi.string()
      .required()
      .custom(password)
      .messages({
        'string.empty': "New password cannot be empty."
      }),
  })
}

const forgotPassword = {
  body: Joi.object().keys({
    email: Joi.string()
      .email()
      .required().messages({
        'string.email': "Are you sure you entered the valid email address?",
        'string.empty': "Email address cannot be empty."
      }),

  })
};
const refreshTokens = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

module.exports = {
  login,
  checkResetLink,
  resetPassword,
  forgotPassword,
  register,
  refreshTokens
};
