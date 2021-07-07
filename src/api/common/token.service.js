const CryptoJS = require("crypto-js");
const moment = require("moment");
const {Token}=require('./../../models');
const config = require('../../config/config');
const AppError = require('../../utils/AppError');
const httpStatus = require('http-status');
const generateToken = (data, expires, secret = config.jwt.secret) => {
  console.log(data);
    let payload = {
        ...data,
        iat: moment().unix(),
        exp:expires,
      };
      console.log(payload);
      var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(payload), secret).toString();
      return ciphertext
  };
  const saveToken = async (token, userId, expires, type,sUserRole, blacklisted = false) => {
    var d = new Date(expires);
    const tokenDoc = await Token.create({
      token,
      oUserId: userId,
      expiresAt: d,
      type,
      blacklisted,
      sUserRole:sUserRole
    });
    return tokenDoc;
  };
  const verifyToken = async (token, type) => {
    var bytes  = CryptoJS.AES.decrypt(token, config.jwt.secret);
    var originalText = bytes.toString(CryptoJS.enc.Utf8);
    
    if (/^[\],:{}\s]*$/.test(originalText.replace(/\\["\\\/bfnrtu]/g, '@').
          replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
          replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
            let data=JSON.parse(originalText)
            
            let timestamp=moment().unix()
            var difference = data.exp - timestamp
            if(difference > 0){
              
              const tokenDoc = await Token.findOne({ token,oUserId:data._id});
              if (!tokenDoc) {
                throw new AppError(httpStatus.NOT_FOUND, 'Token not found');
              }else{
                return tokenDoc
              }
            }else{
              throw new AppError(httpStatus.UNAUTHORIZED, 'Token is Expire');
            }
          }else{
            throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid Token');
          }  
    
    return tokenDoc;
  };
module.exports = {
    generateToken,saveToken,verifyToken
  };