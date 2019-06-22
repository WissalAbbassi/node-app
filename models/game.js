var mongoose = require('mongoose');

gameSchema = require('../schemas/gameSchema.js');
var Game = module.exports = mongoose.model('Game', gameSchema)

//get all games
module.exports.getGames = function (callback, limit) {
  Game.find(callback).limit(limit);
}

module.exports.addgame = function (game, callback) {
  Game.create(game, callback);
}
module.exports.addTeamToGame = function (play, callback) {
  Game.updateOne({ $push: { TeamData:play} }, callback);
}
