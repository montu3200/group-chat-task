const httpStatus = require('http-status');
const AppError = require('../utils/AppError');
const CryptoJS = require("crypto-js");
const moment = require("moment");
const config=require('../config/config');
const auth = () => async (req, res, next) => {
  if(!req.headers.authorization){
    next(new AppError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
  }else{
    var bytes  = CryptoJS.AES.decrypt(req.headers.authorization, config.jwt.secret);
    var originalText = bytes.toString(CryptoJS.enc.Utf8);
    
    if(originalText){
      if (/^[\],:{}\s]*$/.test(originalText.replace(/\\["\\\/bfnrtu]/g, '@').
          replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
          replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
            let data=JSON.parse(originalText)
            let timestamp=moment().unix()
            var difference = data.exp - timestamp
            console.log(difference);
            if(difference > 0){
              req.user = data;
              next();
            }else{
              next(new AppError(httpStatus.UNAUTHORIZED, 'Token is Expire'));
            }
          }else{
            next(new AppError(httpStatus.UNAUTHORIZED, 'Invalid Token'));
          }      
      }else{
        next(new AppError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
      }
  }
  
}; 
module.exports = auth