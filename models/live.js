var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//ligue shema
liveSchema = require('../schemas/liveSchema.js');
var live = module.exports = mongoose.model('live', liveSchema)