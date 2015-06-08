var mongoose = require('mongoose');

var NewsSchema = new mongoose.Schema({
    id: String,
    title: String,
    description: String,
    time: Date,
    updateTime: Date,
    keywords: Array,
    liked: Number,
    commented: {
        type:Number,
        default:0
    },
    viewed:Number
});

NewsSchema.statics = {
    fetch: function (options, cb) {
        return this
            .find({})
            .skip(options.skip || 0)
            .limit(options.limit || 20)
            .sort({'time': -1})
            .exec(cb);
    },
    findById: function (id, cb) {
        return this
            .findOne({id: id})
            .exec(cb);

    }
};

module.exports = NewsSchema;

