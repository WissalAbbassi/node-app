var mongoose = require('mongoose');

stadeSchema = require('../schemas/stadeSchema.js');
var Stade =  mongoose.model('Stade', stadeSchema)

//get all stadiums
module.exports.getStadiums = function (callback, limit) {
  Stade.find(callback).limit(limit);
}

//get one stadium
  module.exports.getStadiumById = function (id, callback) {
      Stade.findOne({uID:id}).exec(callback);
  }
  
  //add stadium
module.exports.addstadium = function (stadium, callback) {
    Stade.create(stadium, callback);
   }