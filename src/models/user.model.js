const { number } = require('@hapi/joi');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const { omit, pick } = require('lodash');
const userSchema = mongoose.Schema(
    {
        firstName :{
            type : String,
            require: true
        },
        lastName :{
            type :String,
            require : true
        },
        email:{
            type:String
        }
    },
    {
        timestamps: true,
        toObject: { getters: true },
        toJSON: { getters: true },
        
    }
);
userSchema.methods.transform = function () {
    const user = this;
    return pick(user.toJSON(), ['id', 'firstName', 'lastName', 'createdAt', 'email']);
  };
const UserData = mongoose.model('users', userSchema);

module.exports = UserData;