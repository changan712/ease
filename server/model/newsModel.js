var mongoose = require('mongoose');
var NewsSchema = require('../schema/newsSchema');

NewsModel =  mongoose.model('news', NewsSchema);

module.exports = NewsModel;