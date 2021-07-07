const { number } = require('@hapi/joi');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const { omit, pick } = require('lodash');
const userSchema = mongoose.Schema(
    {
        sFirstName :{
            type : String,
            require: true
        },
        sLastName :{
            type :String,
            require : true
        },
        sEmail:{
            type:String
        },
        sPassword:{
            type:String
        },
        sPhoneCode:String,
        nPhone:Number,
        sDateOfBirth:String,
        sIdProof:String,
        sGender:String,
        language:{
            type:Array,
            default:[]
        },
        sProfileImage:String,
        nYearOfBirth:Number,
        status:{
            type:String,
            enum:["Active","Inactive","Delete"],
            default:"Inactive"
        },
        nOtp:Number,
        isVerify:{
            type:Boolean,
            default:false
        },
        sUserRole:{
            type:String,
            enum:["Mover","Shaker","Admin"],
            default:"Shaker"
        },
        sSignupStep:String,
    },
    {
        timestamps: true,
        toObject: { getters: true },
        toJSON: { getters: true },
        
    }
);
userSchema.methods.transform = function () {
    const user = this;
    return pick(user.toJSON(), ['id', 'sFirstName', 'sLastName', 'createdAt', 'sEmail', 'nPhone','sDateOfBirth','language','sProfileImage','status','sUserRole','sSignupStep']);
  };
  userSchema.pre('save', async function (next) {
    const user = this;
    user.sPassword = await bcrypt.hash(user.sPassword, 8);
    next();
  });
  userSchema.index({location: '2dsphere'});
const UserData = mongoose.model('users', userSchema);

module.exports = UserData;