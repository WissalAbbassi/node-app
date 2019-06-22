var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//team schema
module.exports = myteamSchema = new Schema({
  players: [{
    idplayer: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
    Position: { type: String },
    displayed: { type: Boolean, default: false },
    //point: { type: Number, default: 100 },
    Remplaçant: { type: Boolean, default: false },
    capitaine: { type: Boolean, default: false },
    date: { type: Date, default: Date.now },
  }],
  Date: { type: String },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },


},
  {
    timestamps: true
  });
