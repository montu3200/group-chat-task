const Joi = require('@hapi/joi');

const register = {
  body: Joi.object().keys({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string()
      .required()
      .email()
  }),
};
const sendMessage = {
  body: Joi.object().keys({
    userId: Joi.string().required(),
    groupId: Joi.string().required(),
    message: Joi.string()
      .required()
  })
};
module.exports = {
  register,
  sendMessage
};
