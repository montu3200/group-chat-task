const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
const handlebars = require("handlebars");
// const config = require('../../config/config')
const logger = require('../../config/logger');
const sgTransport = require("nodemailer-sendgrid-transport");
let BASE_PATH = __dirname.split('/');
BASE_PATH.splice(-1, 1);
BASE_PATH = BASE_PATH.join('/');

const emailConfig = () => {
  var options = {
    service: "SendGrid",
    auth: {
      api_key: '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'
    }
  }
  return options
}

const transporter = nodemailer.createTransport(sgTransport(emailConfig()));
const mailBody = (to, htmlToSend, subject) => {
  var mailOptions = {
    from: process.env.EMAIL_FROM,
    to: to,
    fromname: "Moovv",
    replyTo: process.env.EMAIL_FROM,
    subject: subject,
    html: htmlToSend
  };
  return mailOptions
}

const sendEmail = async (mailOptions) => {
  var info = "";
  try {
    info = await transporter.sendMail(mailOptions);
    info && console.log("send mail successfully..!!");
  } catch (error) {
    console.log({ status: false, data: {}, msg: "mail send error : " + error });
  }
  return info;
};

const sendForgotPasswordEmail = async (to, body) => {
  console.log(body);
  const subject = 'Password Reset On Moovv';
  const html = fs.readFileSync(path.join(BASE_PATH, "/public/template/ForgotPassword.html"), { encoding: "utf-8" });  // const url = `http://${process.env.HOST}/v1/reset-password?token=${body.token}`;

  var url = `${process.env.HOST}/resetpassword?token=${body.token}`;
  const template = handlebars.compile(html);
  const htmlToSend = template({
    name: body.sFirstName + ' ' + body.sLastName,
    email: body.sEmail,
    url,
  });
  const mailOptions = mailBody(to, htmlToSend, subject)
  await sendEmail(mailOptions)
};

const sendUserVerify = async (to, body) => {
  var subject = 'Welcome to YataPay';
  var html = fs.readFileSync(path.join(BASE_PATH, "/public/template/VerifiedEmail.html"), { encoding: "utf-8" });

  let url = `${process.env.HOST}/verify?token=${body.token}`;

  const template = handlebars.compile(html);
  const htmlToSend = template({
    name: body.firstName + ' ' + body.lastName,
    url
  });
  const mailOptions = mailBody(to, htmlToSend, subject)
  await sendEmail(mailOptions)
};

const sendResetedPassword = async (to, body) => {
  var subject = 'Your Password On "Yatapay" Has Changed';
  var html = fs.readFileSync(path.join(BASE_PATH, "/public/template/ResetedPassword.html"), { encoding: "utf-8" });

  // let url = `${process.env.HOST}/verify?token=${body.token}`;

  const template = handlebars.compile(html);
  const htmlToSend = template({
    name: body.firstName + ' ' + body.lastName
  });
  const mailOptions = mailBody(to, htmlToSend, subject)
  await sendEmail(mailOptions)
};

module.exports = {
  emailConfig,
  transporter,
  mailBody,
  sendEmail,
  sendForgotPasswordEmail,
  sendUserVerify,
  sendResetedPassword
};
