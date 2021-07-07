
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var tokensSchema = new Schema({
  token: { type: String, required: true, index: true, },
  expiresAt: { type: String, required: true },
  oUserId: { type: Schema.Types.ObjectId, required: true },
  sUserRole:{
    type:String,
    enum:["Mover","Shaker","Admin"],
    default:"Shaker"
  },
}, {
  timestamps: true,
  toObject: { getters: true },
  toJSON: { getters: true },
});

const Tokens = mongoose.model('tokens', tokensSchema);

module.exports = Tokens;