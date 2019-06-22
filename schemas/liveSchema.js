var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//ligue schema
module.exports = liveSchema = new Schema({
  AwayTeam: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
  HomeTeam: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
  Player: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Player' }],
  Date : {type:String},
  scorehome: {type:Number},
  scoreaway: {type:Number},
  match_time:{type:Number},
},
  {
    timestamps: true
  });