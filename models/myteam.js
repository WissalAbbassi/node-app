var mongoose = require('mongoose');
var Schema = mongoose.Schema;

myteamSchema = require('../schemas/myteamSchema.js');
var MyTeam = module.exports = mongoose.model('MyTeam', myteamSchema)

//createmyteam
module.exports.addmyteam = function (myteam, callback) {
    MyTeam.create(myteam, callback);
}

//Add player to Myteam collection
module.exports.addplayer = function (iduser, data, callback) {
    MyTeam.update({user: iduser},{ $push: { players:{idplayer:data,displayed:true} } }, callback);
}
//get myteam by id
module.exports.getmyteambyid = function (Idteam, callback) {
    MyTeam.findOne({ _id: Idteam }, { _id: 1, players:1 }, callback);
}