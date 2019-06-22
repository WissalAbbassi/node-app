var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//ligue shema
ligueSchema = require('../schemas/ligueSchema.js');
var ligue = module.exports = mongoose.model('ligue', ligueSchema)

//create ligue 
module.exports.addliguename = function (ligu, callback) {
    ligue.create(ligu,callback);
}
//update name ligue
module.exports.updateNameligue = function (phone, liguename, callback) {
    ligue.findOneAndUpdate({ phone: phone }, { $set: { liguename: liguename } }, { "fields": { liguename:1 }, "new": true }, callback);
}
//get all ligues
module.exports.getligues = function (callback, limit) {
    ligue.find(callback).limit(limit);
  }