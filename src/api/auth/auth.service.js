const { Userdata, Groupdata,Messagedata } = require("../../models");
const httpStatus = require('http-status');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const AppError = require('../../utils/AppError');
const Messages = require('../../utils/messages');

const checkUser = async (email) => {
  let check = await Userdata.find({ email: email })
  if (check.length != 0) {
    throw new AppError(httpStatus.FORBIDDEN, Messages.ALREADY_EXITS);
  }
}
const CreateRegister = async (data) => {
  await checkUser(data.email)
  let user = await Userdata(data).save()
  return user
};
const CreateGroup = async (body) => {
  const userList = await Userdata.aggregate([
    {
      '$sample': {
        'size': 3
      }
    }, {
      '$group': {
        '_id': null, 
        'userId': {
          '$push': '$_id'
        }
      }
    }
  ])
  if(userList.length === 0){
    throw new AppError(httpStatus.UNPROCESSABLE_ENTITY, "User not found");
  }
  const obj={
    members : userList[0].userId
  }
  
  const group=await Groupdata(obj).save()
  for (let i = 0; i < obj.members.length; i++) {
    const element = obj.members[i];
    const data={
      "userId":"630f959051d6ef2c2cd6b435",
      "groupId":group._id,
      "message":body.message
  }
    await Messagedata(data).save()
  }
  return group
};
const sendMessage = async (data) => {
  console.log(data.userId)
  const checkGroup=await Groupdata.findOne({_id:data.groupId,members:{$in:[ObjectId(data.userId)]},status:"Active"})
  if(!checkGroup){
    throw new AppError(httpStatus.UNPROCESSABLE_ENTITY, "group and user are invalid");
  }
  return await Messagedata(data).save()

};
const GroupList = async (data) => {
  const GroupList=await Groupdata.aggregate([
    {
      '$match': {
        'members': {
          '$in': [
            ObjectId(userId)
          ]
        }, 
        'status': 'Active'
      }
    }, {
      '$unwind': {
        'path': '$members'
      }
    }, {
      '$lookup': {
        'from': 'users', 
        'localField': 'members', 
        'foreignField': '_id', 
        'as': 'user'
      }
    }, {
      '$unwind': {
        'path': '$user'
      }
    }, {
      '$group': {
        '_id': '$_id', 
        'members': {
          '$push': '$user'
        }, 
        'status': {
          '$first': '$status'
        }, 
        'createdAt': {
          '$first': '$createdAt'
        }, 
        'updatedAt': {
          '$first': '$updatedAt'
        }
      }
    }
  ])
  
  return GroupList

};
module.exports = {
  CreateRegister,
  CreateGroup,
  sendMessage,
  GroupList
};
