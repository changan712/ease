var mongoose = require('mongoose');
var UserSchema = require('../schema/userSchema');


UserModel =  mongoose.model('user', UserSchema);
module.exports = UserModel;