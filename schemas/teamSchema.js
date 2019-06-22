var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//team schema
module.exports = teamSchema = new Schema({
  uID:{ type: String,index: { unique: true }},
  Name:{ type: String},
  Founded:{ type: String},
  country:{ type: String},
  country_id:{ type: String},
  country_iso:{ type: String},
  region_id:{ type: String},
  region_name:{ type: String},
  short_club_name:{ type: String},
  web_address:{ type: String},
  postal_code:{ type: String},
  street:{ type: String},
  t_shirt:{ type: String},
  logo:{ type: String},
  stadiums:{type: mongoose.Schema.Types.ObjectId, ref: 'Stade'},
  },
{
  timestamps: true
});
