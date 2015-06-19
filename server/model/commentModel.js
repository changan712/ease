var mongoose = require('mongoose');
var CommentSchema = require('../schema/commentSchema');

commentModel =  mongoose.model('comment', CommentSchema);
module.exports = commentModel;