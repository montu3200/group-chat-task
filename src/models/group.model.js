const { number } = require('@hapi/joi');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const groupSchema = mongoose.Schema(
    {
        userId :{
            type : mongoose.Schema.Types.ObjectId,
            ref: 'users',
            require: true
        },
        members :{
            type :Array,
            default:[],
            require : true
        },
        status:{
            type:String,
            enum:["Active","Disable"],
            default:'Active'
        }
    },
    {
        timestamps: true,
        toObject: { getters: true },
        toJSON: { getters: true },
        
    }
);
const GroupData = mongoose.model('group', groupSchema);

module.exports = GroupData;