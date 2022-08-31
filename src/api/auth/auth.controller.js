const httpStatus = require('http-status');
const catchAsync = require('../../utils/catchAsync');
const createResponse = require('../../utils/response');
const Messages = require('../../utils/messages');
const authService = require("./auth.service");



const register = catchAsync(async (req, res) => {
  const user = await authService.CreateRegister(req.body);
  createResponse(res, httpStatus.OK, Messages.EMAIL_NOT_VERIFY, user)
});
const createGroup = catchAsync(async (req, res) => {
  const user = await authService.CreateGroup(req.body);
  createResponse(res, httpStatus.OK, Messages.EMAIL_NOT_VERIFY, user)
});
const sendMessage = catchAsync(async (req, res) => {
  const user = await authService.sendMessage(req.body);
  createResponse(res, httpStatus.OK, Messages.EMAIL_NOT_VERIFY, user)
});
const groupList = catchAsync(async (req, res) => {
  const user = await authService.GroupList(req.params.userId);
  createResponse(res, httpStatus.OK, Messages.EMAIL_NOT_VERIFY, user)
});
module.exports = {
  register,
  createGroup,
  sendMessage,
  groupList
};
