var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//stadium schema
module.exports = stadeSchema = new Schema({
  uID:{ type: String,index: { unique: true }},
  Capacity:{ type: Number},
  Name:{ type: String}
  },
  {
    timestamps: true
  });