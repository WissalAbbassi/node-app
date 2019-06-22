var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//player schema
module.exports = playerSchema = new Schema({
  uID:{ type: String,index: { unique: true }},
  loan:{type: Number},
  Name:{ type: String},
  Position:{ type: String},
  on_loan_from:{ type: String},
  first_name:{ type: String},
  last_name:{ type: String},
  birth_date:{ type: String},
  birth_place:{ type: String},
  first_nationality:{ type: String},
  preferred_foot:{ type: String},
  weight:{ type: String},
  height:{ type: String},
  jersey_num:{ type: String},
  real_position:{ type: String},
  real_position_side:{ type: String},
  join_date:{ type: Date},
  country:{ type: String},
  Team:{type: mongoose.Schema.Types.ObjectId, ref: 'Team'},
  points:{ type: Number,default:100},
  valeur:{ type: Number,default: 100},
  },
  {
    timestamps: true
  });
  