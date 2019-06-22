var mongoose = require('mongoose');
playerSchema = require('../schemas/playerSchema.js');
var Player = module.exports = mongoose.model('Player', playerSchema)

//get all players
module.exports.getPlayers = function (callback, limit) {
  Player.find(callback).populate('Team',[['short_club_name'],['logo'],['t_shirt']]).limit(limit);
}
//add player
module.exports.addplayer = function (player, callback) {
 Player.create(player, callback);
}

//getplayerbyposition
module.exports.getPlayerByPosition = function(Position,callback){
  Player.find({Position: {$in : Position}}).
        populate('Team', [['logo'],['t_shirt'],['short_club_name']]).select({point:1,valeur:1,Position:1,Name:1}).exec(callback);
  }
 //get player bt Id with all information
module.exports.getPlayerById = function (idP, callback) {
  Player.findOne({_id:idP}).populate('Team',[['Name'],['logo'],['t_shirt']]).exec(callback);
}

