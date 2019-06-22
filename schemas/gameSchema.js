var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//team schema
module.exports = gameSchema = new Schema({
        uID:{ type: String,index: { unique: true }},
        HomeTeam:{type: mongoose.Schema.Types.ObjectId, ref: 'Team'},
        HomeTeamScore :{type:String},
        AwayTeam:{type: mongoose.Schema.Types.ObjectId, ref: 'Team'},
        AwayTeamScore :{type:String},
        DateGame :{ type: Date},
        Referees :{type: mongoose.Schema.Types.ObjectId, ref: 'Referee'},
        Venue : {type:String},
        City :{type:String},
},
{
  timestamps: true
});
