var mongoose = require('mongoose');
var Schema = mongoose.Schema;

teamSchema = require('../schemas/teamSchema.js');
var Team = module.exports = mongoose.model('Team', teamSchema)

//get all teams
module.exports.getTeam = function (callback, limit) {
  Team.find(callback).limit(limit);
}


//add team
module.exports.addteam = function (team, callback) {
    Team.create(team, callback);
}

module.exports.editpush = function (req, data, callback) {
    Team.update(req, data, {
        runValidators: true,

    }, callback);
}

module.exports.edit = function (req, data, callback) {
    Team.update(req, {$set: data}, {
        runValidators: true, multi: true

    }, callback);
}


module.exports.getdata = function (data, callback) {
    Team.find(data).exec(callback)
}
//get team by id
module.exports.getteambyid = function (IdT, callback) {
    Team.findOne({ _id: IdT }, { _id: 1, logo: 1,t_shirt:1 }, callback);
}
