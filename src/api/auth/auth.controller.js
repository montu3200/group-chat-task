const httpStatus = require('http-status');
//const { isUndefined } = require('lodash');
const catchAsync = require('../../utils/catchAsync');
const createResponse = require('../../utils/response');
const auth = require('../../middlewares/auth');
const Messages = require('../../utils/messages');
const emailService = require('../common/email.service')
//const cloudinaryService = require('../common/cloudinary.service')
//const mangopayService = require('../common/mangopay.service')
const authService = require("./auth.service");



const login = catchAsync(async (req, res) => {
    let { sEmail, sPassword} = req.body;
    const user = await authService.login(sEmail, sPassword);
     const tokens = await authService.generateAuthTokens(user);
     const response = { user:user.transform(), tokens };
     createResponse(res, httpStatus.OK, Messages.LOGIN, response)
});
const refreshTokens = catchAsync(async (req, res) => {
    console.log("tokens",req.body.refreshToken);
    const tokens = await authService.refreshAuthTokens(req.body.refreshToken);
    console.log("tokens",tokens);
    const response = { ...tokens };
    createResponse(res, httpStatus.OK, Messages.REFRESH_TOKEN, {
      tokens: response,
    });
  });
const register = catchAsync(async (req, res) => {
    const user = await authService.CreateRegister(req.body);
    createResponse(res, httpStatus.OK, Messages.EMAIL_NOT_VERIFY, user)
});
const GetUserdetails = catchAsync(async (req, res) => {
    const user = await authService.GetAllUser();
    createResponse(res, httpStatus.OK, Messages.DATA_FETCH, user)
});
const forgotPassword = catchAsync(async (req, res) => {
  const user = await authService.getUserByEmail(req.body.email);
  if(user){
    const resetPasswordToken = await authService.generateResetPasswordToken(
      req.body.email
    );
    await emailService.sendForgotPasswordEmail(req.body.email, {
      ...user._doc,
      token: resetPasswordToken,
    });
    createResponse(res, httpStatus.OK, Messages.FORGOT_PASSWORD, {});
  }else{
    createResponse(res, httpStatus.NOT_FOUND, Messages.EMAIL_NOT_FOUND, {});
  }
});
// const checkResetLink = catchAsync(async (req, res) => {
//     let value = await authService.checkResetLink(req.query.token);
//     createResponse(res, httpStatus.OK, value, {});
// });

// const resetPassword = catchAsync(async (req, res) => {
//     let user = await authService.resetPassword(req.query.token, req.body.password);
//     await emailService.sendResetedPassword(user.email, {
//         ...user.toJSON(),
//     });
//     createResponse(res, httpStatus.OK, Messages.RESET_PASSWORD, {});
// })
// const forgotPassword = catchAsync(async (req, res) => {

//     let user;
//     switch (req.body.role) {
//         case ROLES.ADMIN: case ROLES.STAFF_MEMBERS:
//             user = await adminService.getAdminByEmail(req.body.email);
//     0 0       break;
//         case ROLES.CLIENT:
//             user = await customerService.getCustomerByEmail(req.body.email);
//             break;
//         default:
//             break;
//     }

//     const resetPasswordToken = await authService.generateResetPasswordToken(user);
//     // const user = await userService.getUserByEmail(req.body.email);
//     await emailService.sendForgotPasswordEmail(req.body.email, {
//         ...user.toJSON(),
//         token: resetPasswordToken,
//     });
//     createResponse(res, httpStatus.OK, Messages.FORGOT_PASSWORD, {});
// });

// const register = catchAsync(async (req, res) => {
//     console.log(req.body)
// });

module.exports = {
    login,
    refreshTokens,
    register,
    GetUserdetails,
    forgotPassword
    // checkResetLink,
    // resetPassword,
    // forgotPassword,
    // register
};
