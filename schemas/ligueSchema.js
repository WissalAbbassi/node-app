var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//ligue schema
module.exports = ligueSchema = new Schema({
  liguename: { type: String, unique:true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  fanion: { type: String },
},
  {
    timestamps: true
  });
