var mongoose = require('mongoose');

refreeSchema = require('../schemas/refereeSchema.js');
var Referee = module.exports = mongoose.model('Referee', refereeSchema)

module.exports.addreferee = function (refree, callback) {
    Referee.create(refree, callback);
}
//get referee by Id
module.exports.getReferee = function (id, callback) {
    Referee.findOne({uID:id}).exec(callback);
}
//get all referees
module.exports.getReferees = function (callback, limit) {
    Referee.find(callback).limit(limit);
  }