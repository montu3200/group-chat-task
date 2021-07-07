const moment = require('moment');
 const bcrypt = require('bcryptjs');
const {Userdata} = require("../../models");
const httpStatus = require('http-status');
const config = require('../../config/config');

// const customerService = require('../customer/customer.service');
// const adminService = require('../admin/admin.service');
const commonService = require('../common/common.service');

const tokenService = require('../common/token.service');

const AppError = require('../../utils/AppError');
const { TOKEN_TYPE, ROLES,STATUS } = require('../../config/constant');
const Messages = require('../../utils/messages');

const generateAuthTokens = async (data) => {
  console.log(data);
  let dataobj={_id:data._id,sUserRole:data.sUserRole,sEmail:data.sEmail}
  console.log("dataobj",dataobj);
  const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes').unix();
  const accessToken = tokenService.generateToken(dataobj, accessTokenExpires);

  const refreshTokenExpires = moment().add(config.jwt.refreshExpirationDays, 'days').unix();
  const string = moment().add(config.jwt.refreshExpirationDays, 'days');
  const refreshToken = tokenService.generateToken(dataobj, refreshTokenExpires);
  await tokenService.saveToken(refreshToken, dataobj._id, string, TOKEN_TYPE.REFRESH_TOKEN,dataobj.sUserRole);

  return {
    access: {
      token: accessToken,
      expires: accessTokenExpires,
    },
    refresh: {
      token: refreshToken,
      expires: refreshTokenExpires,
    },
  };
};
const checkUser = async(email)=>{
  let check=await Userdata.find({sEmail:email})
  if(check.length != 0){
    throw new AppError(httpStatus.FORBIDDEN, Messages.ALREADY_EXITS);
  }
}
const checkStatus = async (status) => {
  if (status === "Inactive") {
    throw new AppError(httpStatus.UNPROCESSABLE_ENTITY, Messages.EMAIL_NOT_VERIFY);
  } else if (status === "Delete") {
    throw new AppError(httpStatus.UNPROCESSABLE_ENTITY, Messages.ACCOUNT_DELETED);
  }
};
const CreateRegister =async(data)=>{
  await checkUser(data.sEmail)
  let otp=await commonService.generateOtp();
  data={
    ...data,
    nOtp:parseInt(otp)
  }
  data.isVerify=true;
  data.status="Active"
  console.log(data);
  let user=await Userdata(data).save()
  return user
};

const checkPassword = async (password, correctPassword) => {
  const isPasswordMatch = await bcrypt.compare(password, correctPassword);
  if (!isPasswordMatch) {
    throw new AppError(httpStatus.UNPROCESSABLE_ENTITY, Messages.PASSWORD_INCORRECT);
  }
};
const getUserByEmail = async (email) => {
  let user= await Userdata.findOne({sEmail:email});
  return user;
  console.log(user);
};


const login = async (email, password) => {
  let user=await Userdata.findOne({sEmail:email})
  if(user){
      await checkStatus(user.status);
      await checkPassword(password,user.sPassword);
      return user
  }else{
    throw new AppError(httpStatus.UNPROCESSABLE_ENTITY, Messages.EMAIL_NOT_FOUND);
  }
};
const refreshAuthTokens = async refreshToken => {
 // try {
    const refreshTokenDoc = await tokenService.verifyToken(refreshToken, TOKEN_TYPE.REFRESH_TOKEN);
    const userId = refreshTokenDoc.oUserId;
    let user = await Userdata.findOne(userId)
    await refreshTokenDoc.remove();
    return await generateAuthTokens(user);
  // } catch (error) {
  //   throw new AppError(httpStatus.UNAUTHORIZED, Messages.INVALID_TOKEN);
  // }
};

const checkResetLink = async (resetPasswordToken) => {
  try {
    const resetPasswordTokenDoc = await tokenService.verifyToken(
      resetPasswordToken,
      TOKEN_TYPE.RESET_PASSWORD
    );
    userId = resetPasswordTokenDoc.user;
    // let user = await userService.getUserById(userId);
    return { 'message': Messages.VALID_LINK, status: true };
  } catch (error) {
    return { 'message': Messages.INVALID_LINK, status: false };
  }
};
const resetPassword = async (resetPasswordToken, newPassword) => {
  let userId;
  var user;
  try {
    const resetPasswordTokenDoc = await tokenService.verifyToken(
      resetPasswordToken,
      TOKEN_TYPE.RESET_PASSWORD
    );
    userId = resetPasswordTokenDoc.sub.user;
    switch (resetPasswordTokenDoc.sub.role) {
      case ROLES.ADMIN: case ROLES.STAFF_MEMBERS:
        user = await adminService.updateUser(userId, { password: newPassword });
        break;
      case ROLES.CLIENT:
        user = await customerService.updateUser(userId, { password: newPassword });
        break;
      default:
        break;
    }
    return user
    // await userService.updateUser(userId, { password: newPassword });
  } catch (error) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Password reset failed");
  }
  await Token.deleteMany({ user: userId, type: TOKEN_TYPE.RESET_PASSWORD });
}
const generateResetPasswordToken = async (email) => {
  const user = await Userdata.findOne({sEmail:email,status:STATUS.ACTIVE});
  const expires = moment().add(
    config.jwt.resetPasswordExpirationMinutes,
    "minutes"
  );
  console.log(user._id);
  const resetPasswordToken = tokenService.generateToken(
    user._id,
    expires
  );
  await tokenService.saveToken(
    resetPasswordToken,
    user._id,
    expires,
    TOKEN_TYPE.RESET_PASSWORD,
    user.sUserRole
  );
  return resetPasswordToken;
};

const generateUserVerifyToken = async (userId, token) => {
  const expires = moment().add(
    config.jwt.verifyPasswordExpirationMinutes,
    "minutes"
  );
  const verifyUserToken = tokenService.generateToken(userId, token, expires);
  await tokenService.saveToken(
    verifyUserToken,
    userId,
    expires,
    TOKEN_TYPE.VERIFICATION_TOKEN
  );
  return verifyUserToken;
};

module.exports = {
  generateAuthTokens,
  refreshAuthTokens,
  login,
  // checkPassword,
  checkResetLink,
  resetPassword,
  generateResetPasswordToken,
  generateUserVerifyToken,
  CreateRegister,
  getUserByEmail
};
