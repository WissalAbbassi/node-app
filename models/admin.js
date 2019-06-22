var mongoose = require('mongoose');

adminSchema = require('../schemas/adminSchema.js');
var Admin = module.exports = mongoose.model('Admin', adminSchema)

//admin shema
adminSchema = require('../schemas/adminSchema.js')

var Admin = module.exports = mongoose.model('Admin',adminSchema)

//Add admin 
module.exports.addAdmin = function(admin,callback){
    Admin.create(admin,callback);
}

//Get admin 
module.exports.getAdmin = function(email,password,callback){
    Admin.find({email: email,password:password}, callback)
}

//existAdmin
module.exports.existAdmin = function(email,callback){
    Admin.find({email: email}, callback)
}

//Get All Admis 
module.exports.getAdmins = function(callback,limit){
    Admin.find(callback).limit(limit);
}
//Get User by phone 
module.exports.getAdminById = function (id, callback) {
    Admin.findOne({ _id: id }, { _id: 1, phone: 1, active: 1, username: 1, name: 1, email: 1 }, callback);
}