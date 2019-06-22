var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//user shema
userSchema = require('../schemas/userSchema.js');
var User = module.exports = mongoose.model('User', userSchema)

//Get User by phone 
module.exports.getUserByPhone = function (phone, callback) {
    User.findOne({ phone: phone }, { _id: 1, phone: 1, active: 1, path_img: 1, region_code: 1 }, callback);
}
//Get User by ID 
module.exports.getUserById = function (id, callback) {
    User.findOne({ _id: id }, { _id: 1, phone: 1 }, callback);
}
//Add user 
module.exports.addUser = function (user, callback) {
    User.create(user, callback);
}
//Update activation code by user phone 
module.exports.updateCodeUser = function (phone, code, callback) {
    User.findOneAndUpdate({ phone: phone }, { $set: { code: code } }, { "fields": { _id: 1, phone: 1 }, "new": true }, callback);
}
//check  code Sms 
module.exports.checkCodeSmsPhone = function (id, code, registrationToken, callback) {
    User.findOneAndUpdate({ _id: id, code: code },
        {
            $set: {
                registrationToken: registrationToken,
                active: true,
            },
        }, { "fields": { phone: 1 }, "new": true }, callback);
}
//update name user 
module.exports.updateNameUser = function (phone, username, callback) {
    User.findOneAndUpdate({ phone: phone }, { $set: { username: username } }, { "fields": { _id: 1, phone: 1 }, "new": true }, callback);
}
//update teamname 
module.exports.updateTeamName = function (phone, teamname, callback) {
    User.findOneAndUpdate({ phone: phone }, { $set: { teamname: teamname } }, { "fields": { _id: 1, phone: 1,username: 1 }, "new": true }, callback);
}

//get all users 
module.exports.getUsers = function (callback, limit) {
    User.find(callback).limit(limit);
}
//update img user 
module.exports.updateImageUser = function (phone, image, callback) {
    User.findOneAndUpdate({ phone: phone }, { $set: { path_img: image } }, { "fields": { path_img: 1, phone: 1 }, "new": true }, callback);
}
//Add team to user collection
module.exports.addTeamToUser = function (phone, data, callback) {
    User.updateOne({ phone: phone }, { $set: { favTeam: data } }, callback);
}
//get my profil
module.exports.getMyProfil = function(phone,callback){
    User.findOne({phone: phone},{_id:1,username:1,teamname:1,path_img:1})
        .exec(callback);
}
//update User details
module.exports.updateMyprofil = function(phone,data,callback){
    User.findOneAndUpdate({phone: phone}, {$set:data} ,{"fields": {username: 1,teamname:1,path_img: 1},"new": true }, callback)
}
//delete user 
module.exports.deleteUser = function(id,callback){
    User.deleteOne({ _id: id },callback);
}


  