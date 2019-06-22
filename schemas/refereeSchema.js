var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//referee schema
module.exports = refereeSchema = new Schema({
    uID:{ type: String,index: { unique: true }},
    FirstName:{ type: String},
    LastName:{ type: String},
    Type:{ type: String},
},
{
  timestamps: true
});
