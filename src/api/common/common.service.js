const { User } = require("../../models");
const AppError = require('../../utils/AppError');
const Messages = require('../../utils/messages');
const httpStatus = require('http-status');

const generateOtp = () => {
    var digits = "1234567890";
    var otp = "";
    var nMaxOtpLength = 6;

    for (let i = 1; i <= nMaxOtpLength; i++) {
        var index = Math.floor(Math.random() * digits.length);
        otp = otp + digits[index];
    }
    return otp
}
const getUniqueOTP = async (otp = '') => {
    var otp;
    if (otp === '') {
        otp = generateOtp(); 
    }
    var otps = await User.find({ otp: otp });
    var isOTPExists = false;
    if (otps.length > 0) {
        isOTPExists = true;
    }
    if (isOTPExists) {
        otp = generateOtp();
        await getUniqueOTP(otp);
    } else {
        return otp;
    }
};
const checkDeleted = async (user) => {
    console.log(user)
    if (user.isDeleted === false) {
        return true
    } else {
        throw new AppError(
            httpStatus.UNAUTHORIZED,
            Messages.ACCOUNT_DELETED
        );
    }
}
const checkDisable = async (user) => {

    if (user.isEnable === false) {
        return true
    } else {
        throw new AppError(
            httpStatus.UNAUTHORIZED,
            Messages.ACCOUNT_DISABLED
        );
    }
}
const checkVerify = async (user) => {
    // console.log(checkVerify)
    if (user.isVerified === true) {
        return true
    } else {
        throw new AppError(
            httpStatus.UNAUTHORIZED,
            Messages.EMAIL_NOT_VERIFY
        );
    }
}
module.exports = {
    generateOtp,
    getUniqueOTP,
    checkDeleted,
    checkDisable,
    checkVerify
}