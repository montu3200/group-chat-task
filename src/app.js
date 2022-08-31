const express = require('express');
const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');
const cors = require('cors');
const httpStatus = require('http-status');
const config = require('./config/config');
const morgan = require('./config/morgan');
const routes = require('./routes/v1');
const { errorConverter, errorHandler } = require('./middlewares/error');
const AppError = require('./utils/AppError');
const {Groupdata,Messagedata} = require('./models')
var cron = require('node-cron');
const app = express();


if (config.env !== 'test') {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data
app.use(xss());
app.use(mongoSanitize());
cron.schedule('* * * * *',async () => {
  const grouplist=await Groupdata.find();
  for (let index = 0; index < grouplist.length; index++) {
    const element = grouplist[index];
    const firstMessage= await Messagedata.findOne({groupId:element._id}).limit(1);
    const checkMessage= await Messagedata.find({userId:{$in:element.members},groupId:element._id},{userId:1})
    if(checkMessage.length === 0){
      const data={
        "userId":"630f959051d6ef2c2cd6b435",
        "groupId":element._id,
        "message":firstMessage.message
    }
      await Messagedata(data).save()
    }else{
      let array=[]
      for (let index = 0; index < checkMessage.length; index++) {
        const element = checkMessage[index];
        array.push(element.userId.toString())
      }
      const output = element.members.filter(function (obj) {
        return array.indexOf(obj.toString()) === -1;
      });
      for (let index = 0; index < output.length; index++) {
        const element = output[index];
        const data={
          "userId":"630f959051d6ef2c2cd6b435",
          "groupId":element,
          "message":firstMessage.message
      }
        await Messagedata(data).save()
    }
    }
    
    
  }
  console.log('running a task every minute');
});
// gzip compression
app.use(compression());

// enable cors
app.use(cors());
app.options('*', cors());

// jwt authentication
// app.use(passport.initialize());
// passport.use('jwt', jwtStrategy);

// limit repeated failed requests to auth endpoints

// v1 api routes
app.use('/v1', routes);


app.get('/',(req, res, next) => {
  res.send("Welcome to group-chat")
});
// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new AppError(httpStatus.NOT_FOUND, 'Not found'));
});

// convert error to AppError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

module.exports = app;
