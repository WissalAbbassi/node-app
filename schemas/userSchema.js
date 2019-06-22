var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//user shema
module.exports = userSchema = new Schema({
    teamname:{ type: String, index: { unique: true }},
    phone:{ type: String,  required:true, unique: true},
    region_code : { type: String,default: null },
    username: { type: String, default: "", unique: true},
    code: {type: String},
    active:{type: Boolean, default: false},
    path_img: { type: String, default: "" },
    registrationToken:String,
    favTeam:{type: mongoose.Schema.Types.ObjectId, ref: 'Team'},
    point:{type: Number},
    budget:{type: Number,Default:100000},
},
{
    timestamps: true
});
