const mongoose = require('mongoose');
const messageSchema = mongoose.Schema(
    {
        userId :{
            type :mongoose.Schema.Types.ObjectId,
            ref:'users',
            require : true
        },
        groupId :{
            type :mongoose.Schema.Types.ObjectId,
            ref:'groups',
            require : true
        },
        message:String
    },
    {
        timestamps: true,
        toObject: { getters: true },
        toJSON: { getters: true },
        
    }
);
const MessageData = mongoose.model('message', messageSchema);

module.exports = MessageData;